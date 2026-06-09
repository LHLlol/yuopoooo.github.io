import Reveal from "./Reveal";
import { profileData } from "../data/profileData";

export default function AboutSection() {
  return (
    <section id="about-me" className="relative overflow-hidden bg-[#f7fbff] px-5 py-24 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute left-[-18rem] top-16 h-[34rem] w-[34rem] rounded-full bg-sky-200/34 blur-3xl" />
      <div className="pointer-events-none absolute right-[-14rem] bottom-[-10rem] h-[30rem] w-[30rem] rounded-full bg-cyan-100/70 blur-3xl" />

      <div className="relative mx-auto max-w-7xl border-y border-sky-100 py-16">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase text-portfolioBlue">About Me</p>
            <h2 className="mt-4 text-[clamp(2.5rem,5.5vw,5.8rem)] font-black leading-[0.92] text-inkBlue">关于我</h2>
            <p className="mt-6 text-base leading-8 text-slate-600">{profileData.summary}</p>
          </div>
        </Reveal>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[390px_1fr]">
          <Reveal>
            <aside className="overflow-hidden rounded-[18px] border border-white/70 bg-white/58 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_30px_90px_rgba(0,113,190,.12)] backdrop-blur-2xl">
              <div className="overflow-hidden rounded-[14px] border border-sky-100 bg-white shadow-[0_22px_70px_rgba(0,94,170,.12)]">
                <img src={profileData.avatar} alt={profileData.nameCN} className="aspect-[4/5] h-auto w-full object-cover object-top" loading="eager" />
              </div>
              <div className="px-2 pb-3 pt-6">
                <p className="text-sm font-semibold uppercase text-portfolioBlue">{profileData.nameEN}</p>
                <h3 className="mt-2 text-4xl font-black text-slate-950">{profileData.nameCN}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{profileData.role}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {profileData.focusAreas.slice(0, 6).map((item) => (
                    <span key={item} className="rounded-full border border-sky-100 bg-sky-50/80 px-3 py-1 text-xs font-medium text-inkBlue">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </Reveal>

          <div className="grid gap-6">
            <Reveal delay={80}>
              <div className="rounded-[18px] border border-sky-100 bg-white p-7 shadow-[0_20px_70px_rgba(0,90,160,.06)]">
                <p className="text-sm font-semibold uppercase text-portfolioBlue">Education</p>
                <div className="mt-4 flex flex-col gap-2 border-t border-sky-100 pt-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-950">{profileData.education.school}</h3>
                    <p className="mt-1 text-base text-slate-600">{profileData.education.major}</p>
                  </div>
                  <p className="text-sm text-slate-500">{profileData.education.period}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-[18px] border border-sky-100 bg-white p-7 shadow-[0_20px_70px_rgba(0,90,160,.06)]">
                  <p className="text-sm font-semibold uppercase text-portfolioBlue">Core Skills</p>
                  <div className="mt-5 grid gap-3">
                    {profileData.skills.map((skill) => (
                      <p key={skill} className="rounded-xl bg-[#f5fbff] px-4 py-3 text-sm leading-6 text-slate-700">{skill}</p>
                    ))}
                  </div>
                </div>
                <div className="rounded-[18px] border border-sky-100 bg-white p-7 shadow-[0_20px_70px_rgba(0,90,160,.06)]">
                  <p className="text-sm font-semibold uppercase text-portfolioBlue">Tools</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {profileData.software.map((tool) => (
                      <span key={tool} className="rounded-full border border-sky-100 bg-white px-3 py-2 text-sm text-slate-700 shadow-[0_10px_30px_rgba(0,110,190,.05)]">
                        {tool}
                      </span>
                    ))}
                  </div>
                  <p className="mt-6 text-sm leading-7 text-slate-600">
                    熟悉将 AIGC、AI 视频与 ViBeCoding 引入创作流程，用于灵感发散、方案验证、视觉生成和网页原型优化。
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="rounded-[18px] border border-sky-100 bg-white p-7 shadow-[0_20px_70px_rgba(0,90,160,.06)]">
                <p className="text-sm font-semibold uppercase text-portfolioBlue">Experience</p>
                <div className="mt-6 grid gap-6">
                  {profileData.experiences.map((experience) => (
                    <article key={experience.title} className="border-t border-sky-100 pt-5 first:border-t-0 first:pt-0">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-950">{experience.title}</h3>
                          <p className="mt-1 text-sm text-slate-500">{experience.organization}</p>
                        </div>
                        <p className="text-sm text-slate-400">{experience.period}</p>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{experience.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={280}>
              <div className="rounded-[18px] border border-sky-100 bg-white p-7 shadow-[0_20px_70px_rgba(0,90,160,.06)]">
                <p className="text-sm font-semibold uppercase text-portfolioBlue">Highlights</p>
                <div className="mt-5 grid gap-3">
                  {profileData.achievements.map((item) => (
                    <p key={item} className="rounded-xl bg-sky-50/80 px-4 py-3 text-sm leading-6 text-slate-700">{item}</p>
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap gap-3 border-t border-sky-100 pt-6 text-sm">
                  <a href={"mailto:" + profileData.email} className="rounded-full border border-portfolioBlue bg-portfolioBlue px-5 py-2 font-semibold text-white transition duration-500 ease-apple hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-inkBlue">
                    Email / 联系我
                  </a>
                  <span className="rounded-full border border-sky-100 bg-white px-5 py-2 text-slate-600">{profileData.phone}</span>
                  <span className="rounded-full border border-sky-100 bg-white px-5 py-2 text-slate-600">{profileData.location}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
