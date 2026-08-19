import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { portfolioKnowledge } from "../data/portfolioKnowledge";
import { getAssistantContext, requestPortfolioAssistant, type AssistantProject, type AssistantResponse } from "../utils/portfolioAssistant";
import { assetPath } from "../utils/assetPath";

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
  projects?: AssistantProject[];
  suggestions?: string[];
};

const baseSuggestions = ["快速了解我", "推荐三个代表作品", "有哪些 AIGC 项目？", "你主要使用哪些 AI 工具？"];

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const Welcome = ({ suggestions, onSuggestion }: { suggestions: string[]; onSuggestion: (suggestion: string) => void }) => (
  <div className="portfolio-ai-welcome py-5 text-center">
    <div className="portfolio-ai-symbol mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-sky-100 shadow-[0_0_42px_rgba(99,210,255,.22)]">✦</div>
    <p className="mt-4 text-sm font-medium text-white/90">Ask me about my work.</p>
    <p className="mt-1 text-xs leading-5 text-white/48">Projects · Experience · AIGC · Visual Design · Creative Technology</p>
    <div className="mt-5 flex flex-wrap justify-center gap-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onSuggestion(suggestion)}
          className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 text-xs text-white/68 transition duration-300 hover:border-white/30 hover:bg-white/12 hover:text-white focus-visible:outline-white"
        >
          {suggestion}
        </button>
      ))}
    </div>
  </div>
);

const AnswerText = ({ content }: { content: string }) => {
  const projectNames = [...portfolioKnowledge.projects.map((project) => project.titleCN), ...portfolioKnowledge.projects.map((project) => project.titleEN)].sort((a, b) => b.length - a.length);
  const projectPattern = projectNames.length ? new RegExp(`(${projectNames.map(escapeRegExp).join("|")})`, "g") : null;

  return (
    <div className="grid gap-2 text-sm leading-7 text-white/78">
      {content.split("\n").map((line, lineIndex) => {
        const parts = projectPattern ? line.split(projectPattern) : [line];
        return (
          <p key={`${line}-${lineIndex}`}>
            {parts.map((part, partIndex) => {
              const project = portfolioKnowledge.projects.find((item) => item.titleCN === part || item.titleEN === part);
              return project ? (
                <a key={`${part}-${partIndex}`} href={`#/work/${project.id}`} className="font-medium text-sky-100 underline decoration-white/20 underline-offset-4 transition hover:text-white hover:decoration-white/70">{part}</a>
              ) : (
                <span key={`${part}-${partIndex}`}>{part}</span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
};

const ProjectCard = ({ project, onOpen }: { project: AssistantProject; onOpen: () => void }) => (
  <a
    href={`#/work/${project.id}`}
    onClick={onOpen}
    className="group mt-4 block overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] transition duration-500 ease-apple hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/10 focus-visible:outline-white"
  >
    <div className="flex gap-3 p-2.5">
      <img src={assetPath(project.coverImage)} alt="" className="h-16 w-20 shrink-0 rounded-xl border border-white/10 bg-white/10 object-cover" loading="lazy" />
      <div className="min-w-0 py-0.5">
        <p className="truncate text-xs font-semibold text-white/92">{project.title}</p>
        <p className="mt-1 truncate text-[11px] text-sky-100/58">{project.category} · {project.year}</p>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/56">{project.description}</p>
      </div>
      <span aria-hidden="true" className="ml-auto self-center px-1 text-base text-white/42 transition duration-300 group-hover:translate-x-1 group-hover:text-white">↗</span>
    </div>
  </a>
);

const Thinking = () => (
  <div className="flex items-center gap-2 py-4 text-xs text-white/48">
    <span className="portfolio-ai-thinking-dots inline-flex items-center gap-1" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
    Thinking
  </div>
);

export default function PortfolioAI() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState("");
  const [hint, setHint] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contextKey, setContextKey] = useState(() => window.location.hash);
  const messageId = useRef(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const currentContext = useMemo(() => getAssistantContext(), [contextKey]);
  const contextSuggestions = currentContext.currentProject
    ? ["这个项目中我具体负责什么？", "这个项目使用了哪些工具？", "查看这个项目的完整内容"]
    : baseSuggestions;

  useEffect(() => {
    const onHashChange = () => setContextKey(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (window.sessionStorage.getItem("portfolio-ai-discovery-v2")) return undefined;
    const showTimer = window.setTimeout(() => setHint(true), 900);
    const hideTimer = window.setTimeout(() => {
      setHint(false);
      window.sessionStorage.setItem("portfolio-ai-discovery-v2", "1");
    }, 9800);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const submitQuestion = async (question: string) => {
    const message = question.trim();
    if (!message || thinking) return;

    const userMessage: Message = { id: messageId.current++, role: "user", content: message };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setThinking(true);
    const startedAt = Date.now();

    try {
      const response: AssistantResponse = await requestPortfolioAssistant(message, currentContext.currentProject);
      const wait = Math.max(360, 620 - (Date.now() - startedAt));
      await new Promise((resolve) => window.setTimeout(resolve, wait));
      setMessages((current) => [...current, { id: messageId.current++, role: "assistant", content: response.answer, projects: response.projects, suggestions: response.suggestions }]);
    } finally {
      setThinking(false);
    }
  };

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    await submitQuestion(input);
  };

  const submitSuggestion = (suggestion: string) => {
    void submitQuestion(suggestion);
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && <div className="portfolio-ai-edge-glow pointer-events-none fixed inset-0 z-[64]" aria-hidden="true" />}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {hint && !open && (
          <motion.button
            type="button"
            onClick={() => { setHint(false); setOpen(true); }}
            initial={{ opacity: 0, y: 8, x: 8 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 8, x: 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="portfolio-ai-hint fixed bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] right-4 z-[68] min-h-11 rounded-full border border-white/20 bg-[#075eac]/80 px-4 py-2 text-xs font-medium text-white shadow-glass backdrop-blur-xl focus-visible:outline-white"
          >
            <span className="mr-1 text-sky-100/70">Portfolio AI</span>
            <span>Ask about my work</span>
            <span className="ml-1 text-sky-100">了解我的作品 →</span>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={open ? "Minimize portfolio AI" : "Ask about Lin Hongle"}
        aria-expanded={open}
        onClick={() => { setHint(false); setOpen((current) => !current); }}
        data-glow="true"
        className="portfolio-ai-trigger group fixed bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] right-4 z-[68] flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-[#075eac]/72 text-xl text-sky-50 shadow-[inset_0_1px_0_rgba(255,255,255,.38),0_15px_45px_rgba(0,67,145,.24)] backdrop-blur-xl transition duration-500 ease-apple hover:scale-[1.04] hover:border-white/60 hover:bg-[#075eac]/90 focus-visible:outline-white sm:right-6"
      >
        <span className="portfolio-ai-trigger__symbol transition duration-500 ease-apple group-hover:rotate-12">✦</span>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.section
            aria-label="Portfolio AI assistant"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.18, y: 26, x: 20, borderRadius: 999 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0, borderRadius: 28 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.18, y: 26, x: 20, borderRadius: 999 }}
            transition={{ duration: reduceMotion ? 0.16 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="portfolio-ai-panel fixed inset-x-2 bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] z-[75] flex max-h-[84dvh] flex-col overflow-hidden border border-sky-100/20 bg-[#075eac]/95 text-sky-50 shadow-[0_28px_100px_rgba(0,25,70,.42),inset_0_1px_0_rgba(255,255,255,.18)] backdrop-blur-2xl sm:bottom-6 sm:left-auto sm:right-6 sm:w-[min(480px,calc(100vw-3rem))] sm:max-h-[75dvh]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-sky-100/20 px-5 py-4">
              <div>
                <p className="text-sm font-semibold tracking-wide text-sky-50">✦ Ask about me</p>
                <p className="mt-1 text-[11px] text-sky-100/68">Explore my work, experience and creative process.</p>
                {currentContext.currentProject && <p className="mt-2 truncate text-[11px] text-sky-100/82">Context · {currentContext.currentProject.titleCN}</p>}
              </div>
              <div className="flex items-center gap-1 text-sky-100/72">
                <button type="button" aria-label="Minimize portfolio AI" onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full text-lg transition hover:bg-sky-950/25 hover:text-white focus-visible:outline-white">—</button>
                <button type="button" aria-label="Close portfolio AI" onClick={() => { setMessages([]); setOpen(false); }} className="flex h-11 w-11 items-center justify-center rounded-full text-lg transition hover:bg-sky-950/25 hover:text-white focus-visible:outline-white">×</button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-2">
              {messages.length === 0 && <Welcome suggestions={contextSuggestions} onSuggestion={submitSuggestion} />}
              <div className="grid gap-5 py-3">
                {messages.map((message) => (
                  <div key={message.id} className={message.role === "user" ? "ml-auto max-w-[88%] rounded-[20px] rounded-br-md border border-sky-100/12 bg-sky-950/22 px-4 py-3 text-sm leading-6 text-sky-50" : "max-w-[95%]"}>
                    {message.role === "assistant" && <AnswerText content={message.content} />}
                    {message.role === "user" && <p className="whitespace-pre-wrap">{message.content}</p>}
                    {message.role === "assistant" && message.projects?.map((project) => <ProjectCard key={project.id} project={project} onOpen={() => setOpen(false)} />)}
                    {message.role === "assistant" && message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {message.suggestions.slice(0, 3).map((suggestion) => (
                          <button key={suggestion} type="button" onClick={() => submitSuggestion(suggestion)} className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/56 transition hover:border-white/28 hover:bg-white/10 hover:text-white focus-visible:outline-white">{suggestion}</button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {thinking && <Thinking />}
              </div>
            </div>

            <form onSubmit={(event) => void submit(event)} className="border-t border-sky-100/20 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 sm:pb-4">
              <div className="flex items-end gap-2 rounded-full border border-sky-100/24 bg-sky-950/24 px-3 py-2 transition focus-within:border-sky-100/52 focus-within:shadow-[0_0_0_4px_rgba(125,211,252,.1)]">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={onInputKeyDown}
                  rows={1}
                  placeholder="Ask about my work..."
                  aria-label="Ask about my work"
                  className="max-h-24 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-5 text-sky-50 outline-none placeholder:text-sky-100/64"
                />
                <button type="submit" aria-label="Send question" disabled={!input.trim() || thinking} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-50/16 text-lg text-sky-50 transition hover:bg-sky-50/26 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-white">↑</button>
              </div>
              <p className="mt-2 px-2 text-[10px] text-sky-100/54">Enter to ask · Shift + Enter for a new line · Esc to close</p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
