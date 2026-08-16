import { getFeaturedItems, getPortfolioItemById, type PortfolioItem } from "../data/portfolioData";
import { portfolioKnowledge } from "../data/portfolioKnowledge";

export type AssistantProject = {
  id: string;
  title: string;
  titleEN: string;
  category: string;
  year: string;
  description: string;
  coverImage: string;
};

export type AssistantResponse = {
  answer: string;
  projects: AssistantProject[];
  suggestions: string[];
};

const toAssistantProject = (item: PortfolioItem): AssistantProject => ({
  id: item.id,
  title: item.titleCN,
  titleEN: item.titleEN,
  category: item.categorySubtitle,
  year: item.year,
  description: item.description,
  coverImage: item.coverImage,
});

const uniqueProjects = (items: PortfolioItem[]) => Array.from(new Map(items.map((item) => [item.id, item])).values());

const isEnglish = (message: string) => /(^|\s)(what|which|why|how|do|can|tell|show|recommend|your|about|projects?)(\s|\?|$)/i.test(message);

const projectSuggestions = (isEnglishReply: boolean) =>
  isEnglishReply
    ? ["Which AI tools do you use?", "What is your creative process?", "Show me three representative projects"]
    : ["你主要使用哪些 AI 工具？", "你的创作流程是什么？", "推荐三个代表作品"];

const categoryProjects = (categoryId: PortfolioItem["category"]) => portfolioKnowledge.projects.filter((item) => item.category === categoryId);

const projectMatch = (message: string) => {
  const normalized = message.toLowerCase();
  return portfolioKnowledge.projects.find((item) => normalized.includes(item.titleCN.toLowerCase()) || normalized.includes(item.titleEN.toLowerCase()));
};

const answerAboutProject = (item: PortfolioItem, english: boolean, question: string): AssistantResponse => {
  const asksRole = /(role|responsib|负责|职责|具体做了什么)/i.test(question);
  const asksTools = /(tool|software|technology|技术|工具|软件)/i.test(question);
  const documentedTools = item.aigcWorkflow?.map((stage) => stage.tools).filter(Boolean).join("、");
  const answer = asksTools && documentedTools
    ? english
      ? `${item.titleEN} documents these workflow tools: ${documentedTools}. The project role was ${item.role}.`
      : `${item.titleCN} 的项目流程中记录了这些工具或方法：${documentedTools}。项目角色是：${item.role}。`
    : asksRole
      ? english
        ? `For ${item.titleEN}, my documented role was ${item.role}. The responsibilities were: ${item.responsibilities.join("; ")}.`
        : `在「${item.titleCN}」中，资料记录的项目角色是：${item.role}。具体职责包括：${item.responsibilities.join("；")}。`
      : english
        ? `${item.titleEN} is presented in the portfolio as ${item.categorySubtitle.toLowerCase()}. My role was ${item.role}. ${item.description}`
        : `${item.titleCN} 在作品集中归入「${item.categorySubtitle}」。项目中我的角色是：${item.role}。${item.description}`;

  return {
    answer,
    projects: [toAssistantProject(item)],
    suggestions: english ? ["What was your role in this project?", "What tools were used?", "Show me the full project"] : ["这个项目中我具体负责什么？", "这个项目使用了哪些工具？", "查看这个项目的完整内容"],
  };
};

export const getAssistantContext = () => {
  const cleanHash = window.location.hash.replace(/^#\/?/, "");
  const [section, value] = cleanHash.split("/");
  const currentProject = section === "work" && value ? getPortfolioItemById(value) : undefined;

  return {
    section,
    currentProject,
  };
};

export const answerPortfolioQuestion = (message: string, currentProject?: PortfolioItem): AssistantResponse => {
  const english = isEnglish(message);
  const normalized = message.toLowerCase();
  const featured = getFeaturedItems();
  const hasCurrentProjectReference = Boolean(currentProject && /(this project|current project|这个项目|当前项目|这里|my role|what was your role|tools? were used|使用了哪些|具体负责|完整内容)/i.test(message));
  const matchedProject = projectMatch(message) ?? (hasCurrentProjectReference ? currentProject : undefined);

  if (!message.trim()) {
    return {
      answer: english ? "Ask me about the projects, experience, skills or creative process shown in this portfolio." : "你可以询问作品、项目经历、设计能力、AIGC、视频创作或我的工作经历。",
      projects: [],
      suggestions: projectSuggestions(english),
    };
  }

  if (matchedProject && /(project|work|作品|项目|负责|role|tools?|工具|过程|process|介绍|about)/i.test(message)) {
    return answerAboutProject(matchedProject, english, message);
  }

  if (/(代表|推荐|three|representative|best|最能代表|快速了解|quickly|overview)/i.test(message)) {
    const picks = featured.slice(0, 3);
    return {
      answer: english
        ? "Here are three representative projects covering hand-drawn and graphic design, AIGC animation, and video production. They show how I move from visual concept to a finished, presentable result."
        : "如果想快速了解我，可以先看这三个方向不同的项目：手绘与平面设计、AIGC 动画、视频创作。它们分别体现了我从视觉概念、镜头开发到成片整理的能力。",
      projects: picks.map(toAssistantProject),
      suggestions: projectSuggestions(english),
    };
  }

  if (/(aigc|ai\s*视频|ai video|生成|lovart|seedance|comfyui|概念动画|概念设计)/i.test(normalized)) {
    const projects = uniqueProjects([...categoryProjects("animation"), ...portfolioKnowledge.projects.filter((item) => item.tags.some((tag) => /AIGC|AI/i.test(tag))) ]).slice(0, 3);
    return {
      answer: english
        ? "The portfolio includes AIGC concept art and animation work. The documented workflow combines hand-drawn composition or visual control, AI-assisted exploration, reference and prompt iteration, then human selection, repair and post-production."
        : "作品集中有 AIGC 概念设计与动画项目。现有资料显示，流程通常从手绘构图或视觉设定开始，再用 AI 做方案探索、参考控制和提示词迭代，最后由人工筛选、修复并完成后期整合。",
      projects: projects.map(toAssistantProject),
      suggestions: english ? ["Which AI tools are listed?", "What is the role in the AIGC projects?", "How do you control visual consistency?"] : ["你主要使用哪些 AI 工具？", "AIGC 项目中我具体负责什么？", "如何控制画面一致性？"],
    };
  }

  if (/(tool|software|工具|软件|技术|technology|photoshop|after effects|blender|codex)/i.test(normalized)) {
    return {
      answer: english
        ? `The listed tools are ${portfolioKnowledge.software.join(", ")}. The portfolio also describes AI image generation, AI video, prompt iteration and natural-language coding assistance as part of the creative workflow. It does not claim that every project uses every tool.`
        : `当前资料中列出的软件与工具包括：${portfolioKnowledge.software.join("、")}。作品集还明确提到 AI 图像生成、AI 视频、提示词迭代和自然语言编程辅助创作。这里的工具清单是能力范围，不代表每个项目都使用了全部工具。`,
      projects: [],
      suggestions: english ? ["What are your strongest design skills?", "Which projects used AI video?", "Do you have web-related experience?"] : ["你最擅长哪些设计能力？", "哪些项目使用了 AI 视频？", "你有网页相关经验吗？"],
    };
  }

  if (/(experience|经历|实习|工作|employer|organization|团队|team|collaborat)/i.test(normalized)) {
    const experienceText = portfolioKnowledge.experiences
      .map((experience) => `${experience.title}（${experience.organization}，${experience.period}）：${experience.description}`)
      .join("\n");
    return {
      answer: english
        ? `The documented experience includes:\n${experienceText}`
        : `当前资料记录的经历包括：\n${experienceText}`,
      projects: [],
      suggestions: english ? ["What are your core skills?", "Which projects are real commercial or event work?", "What roles are you suited for?"] : ["你的核心能力是什么？", "哪些项目属于真实商业或活动项目？", "你适合哪些岗位方向？"],
    };
  }

  if (/(skill|能力|擅长|方向|design|设计|visual|视觉|岗位|role|优势|strength)/i.test(normalized)) {
    return {
      answer: english
        ? `The portfolio positions me around ${portfolioKnowledge.profile.role}. The documented strengths include ${portfolioKnowledge.skills.join(", ")}. My focus areas include ${portfolioKnowledge.focusAreas.slice(0, 7).join(", ")}.`
        : `作品集将我的定位放在「${portfolioKnowledge.profile.role}」。当前资料列出的核心能力包括：${portfolioKnowledge.skills.join("、")}。重点方向包括 ${portfolioKnowledge.focusAreas.slice(0, 7).join("、")}。`,
      projects: featured.slice(0, 2).map(toAssistantProject),
      suggestions: english ? ["Recommend three representative projects", "What is your creative process?", "What AIGC work have you done?"] : ["推荐三个代表作品", "你的创作流程是什么？", "你做过哪些 AIGC 项目？"],
    };
  }

  if (/(web|website|vibe|网页|网站|编程|coding)/i.test(normalized)) {
    return {
      answer: english
        ? "The portfolio mentions ViBeCoding and natural-language coding assistance as part of the creative toolkit. The current project demonstrates a React portfolio site, but the knowledge base does not document a separate client web-development project or a broader engineering role."
        : "当前资料提到 ViBeCoding 和自然语言编程辅助创作，并且这个作品集本身是 React 项目。但知识库没有记录独立的客户网站项目，也没有把我的定位描述为通用软件工程岗位，因此我不会把这部分经历扩大解释。",
      projects: [],
      suggestions: english ? ["What creative technology do you use?", "Which projects show your visual design?", "What is not documented yet?"] : ["你使用哪些创意技术？", "哪些项目能体现视觉设计能力？", "还有哪些信息没有记录？"],
    };
  }

  if (/(process|workflow|流程|怎么做|如何创作|为什么|why learn|learn aigc)/i.test(normalized)) {
    return {
      answer: english
        ? "Across the documented projects, the process usually moves from concept and composition control to visual exploration, selection and refinement, then final editing or delivery. For AIGC work, the project notes specifically emphasize hand-drawn or visual references, prompt and camera constraints, consistency control, human review and post-production."
        : "从现有项目资料看，我的流程通常是先梳理概念和构图控制，再做视觉探索，经过筛选与修正，最后完成剪辑、包装或交付。AIGC 项目中尤其强调手绘或视觉参考、提示词与镜头约束、画面一致性控制、人工判断和后期整合。",
      projects: portfolioKnowledge.projects.filter((item) => item.aigcWorkflow).slice(0, 2).map(toAssistantProject),
      suggestions: english ? ["Show me AIGC projects", "What was your role in the projects?", "Which tools are documented?"] : ["看看 AIGC 项目", "你在项目中具体负责什么？", "资料中记录了哪些工具？"],
    };
  }

  return {
    answer: english
      ? "I can answer from the information documented in this portfolio: projects, visual design, animation, video, AIGC, tools, experience and creative process. I do not have enough portfolio information to answer that specific question."
      : "我可以根据作品集中已经记录的内容回答：项目、视觉设计、动画、视频、AIGC、工具、工作经历和创作流程。当前资料没有足够信息回答这个具体问题。",
    projects: [],
    suggestions: projectSuggestions(english),
  };
};

export const requestPortfolioAssistant = async (message: string, currentProject?: PortfolioItem): Promise<AssistantResponse> => {
  const endpoint = import.meta.env.VITE_PORTFOLIO_ASSISTANT_API;

  if (!endpoint) return answerPortfolioQuestion(message, currentProject);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, pageContext: currentProject?.id ?? window.location.hash, conversation: [] }),
    });
    if (!response.ok) throw new Error("Assistant API unavailable");
    const payload = (await response.json()) as Partial<AssistantResponse>;
    if (typeof payload.answer !== "string") throw new Error("Assistant response is incomplete");
    return {
      answer: payload.answer,
      projects: Array.isArray(payload.projects) ? payload.projects : [],
      suggestions: Array.isArray(payload.suggestions) ? payload.suggestions : projectSuggestions(isEnglish(message)),
    };
  } catch {
    return answerPortfolioQuestion(message, currentProject);
  }
};
