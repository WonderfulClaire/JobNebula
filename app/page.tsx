"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Status = "new" | "saved" | "applied" | "hidden";
type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  mode: "远程" | "混合" | "现场";
  salary: string;
  source: string;
  posted: string;
  score: number;
  skills: string[];
  reasons: string[];
  gaps: string[];
  status: Status;
};

const INITIAL_JOBS: Job[] = [
  {
    id: 1,
    title: "AI 产品经理 · Agent",
    company: "Northstar AI",
    location: "上海",
    mode: "混合",
    salary: "35–55K · 16薪",
    source: "公司官网",
    posted: "18 分钟前",
    score: 96,
    skills: ["AI Agent", "产品策略", "LLM", "用户研究"],
    reasons: ["Agent 项目经历与岗位核心方向高度一致", "产品与技术的复合背景是明显加分项", "工作地点符合你的上海优先设置"],
    gaps: ["JD 更偏好有商业化经验的候选人"],
    status: "new",
  },
  {
    id: 2,
    title: "具身智能产品负责人",
    company: "Horizon Robotics Lab",
    location: "杭州",
    mode: "现场",
    salary: "45–70K · 15薪",
    source: "Boss直聘",
    posted: "1 小时前",
    score: 91,
    skills: ["机器人", "计算机视觉", "产品规划", "多模态"],
    reasons: ["机器人视觉是你的长期项目方向", "岗位强调从研究原型到产品落地", "计算机视觉能力与必选项重合"],
    gaps: ["现场办公与上海优先设置冲突", "需要补充量产项目证据"],
    status: "saved",
  },
  {
    id: 3,
    title: "Applied AI Engineer",
    company: "Paperplane",
    location: "Remote · APAC",
    mode: "远程",
    salary: "$70K–100K",
    source: "GitHub Jobs",
    posted: "今天",
    score: 88,
    skills: ["Python", "RAG", "Agents", "Evaluation"],
    reasons: ["支持远程且与 Agent 工程方向匹配", "开源项目可直接作为申请作品", "RAG 与评估体系属于高权重技能"],
    gaps: ["英语技术写作需要在简历中重点证明"],
    status: "new",
  },
  {
    id: 4,
    title: "多模态算法工程师",
    company: "VectorField",
    location: "北京",
    mode: "混合",
    salary: "40–65K · 14薪",
    source: "猎聘",
    posted: "昨天",
    score: 82,
    skills: ["PyTorch", "VLM", "视觉", "模型部署"],
    reasons: ["视觉识别方向与项目兴趣重合", "岗位接受开源贡献替代部分工作年限"],
    gaps: ["北京不是首选城市", "模型部署经验需要进一步量化"],
    status: "new",
  },
  {
    id: 5,
    title: "Developer Relations · AI",
    company: "OpenCraft",
    location: "深圳",
    mode: "混合",
    salary: "30–45K · 15薪",
    source: "即刻",
    posted: "2 天前",
    score: 76,
    skills: ["开源", "内容创作", "AI", "社区运营"],
    reasons: ["GitHub 项目和技术表达能力会成为核心证明", "AI 开发者生态与你的兴趣相符"],
    gaps: ["岗位更偏社区和内容，而非产品构建"],
    status: "new",
  },
];

const PROFILE_SKILLS = ["AI Agent", "产品策略", "Python", "计算机视觉", "RAG", "机器人"];

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "high" | "remote" | "saved">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("刚刚");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("job-nebula-jobs");
      if (saved) {
        try { setJobs(JSON.parse(saved)); } catch { /* keep demo data */ }
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("job-nebula-jobs", JSON.stringify(jobs));
  }, [jobs]);

  const visibleJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (job.status === "hidden") return false;
      const query = search.trim().toLowerCase();
      const matchesSearch = !query || `${job.title} ${job.company} ${job.skills.join(" ")}`.toLowerCase().includes(query);
      const matchesFilter =
        filter === "all" ||
        (filter === "high" && job.score >= 90) ||
        (filter === "remote" && job.mode === "远程") ||
        (filter === "saved" && job.status === "saved");
      return matchesSearch && matchesFilter;
    });
  }, [filter, jobs, search]);

  const selected = jobs.find((job) => job.id === selectedId) ?? visibleJobs[0] ?? jobs[0];
  const savedCount = jobs.filter((job) => job.status === "saved").length;
  const appliedCount = jobs.filter((job) => job.status === "applied").length;

  const updateStatus = (id: number, status: Status) => {
    setJobs((items) => items.map((job) => job.id === id ? { ...job, status } : job));
    if (status === "hidden") {
      const next = visibleJobs.find((job) => job.id !== id);
      if (next) setSelectedId(next.id);
    }
  };

  const syncSources = () => {
    setSyncing(true);
    window.setTimeout(() => {
      setSyncing(false);
      setLastSync("刚刚");
    }, 950);
  };

  const addOpportunity = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const skills = String(form.get("skills") || "").split(/[,，]/).map((item) => item.trim()).filter(Boolean);
    const overlap = skills.filter((skill) => PROFILE_SKILLS.some((mine) => mine.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(mine.toLowerCase()))).length;
    const score = clamp(68 + overlap * 7, 68, 97);
    const newJob: Job = {
      id: Date.now(),
      title: String(form.get("title") || "新机会"),
      company: String(form.get("company") || "未命名公司"),
      location: String(form.get("location") || "待确认"),
      mode: "混合",
      salary: "薪资待沟通",
      source: String(form.get("source") || "手动添加"),
      posted: "刚刚添加",
      score,
      skills: skills.length ? skills : ["待分析"],
      reasons: overlap ? [`有 ${overlap} 项技能与你的职业信号重合`, "你主动收藏了这条机会，意向权重已提升"] : ["职位信息已归档，建议补充完整 JD 以获得更准确解释"],
      gaps: overlap ? ["需要结合完整职位描述进一步判断"] : ["技能信息不足"],
      status: "new",
    };
    setJobs((items) => [newJob, ...items]);
    setSelectedId(newJob.id);
    setShowAdd(false);
    setFilter("all");
  };

  return (
    <main className="nebula-shell">
      <header className="nebula-nav">
        <a className="logo" href="#top" aria-label="JobNebula 首页"><span className="logo-orbit"><i /></span><b>JobNebula</b></a>
        <nav aria-label="主导航"><a href="#radar">机会雷达</a><a href="#signals">职业信号</a><a href="#workflow">申请轨道</a></nav>
        <button className="nav-cta" onClick={() => setShowAdd(true)}>＋ 捕获机会</button>
      </header>

      <section className="nebula-hero" id="top">
        <div className="hero-stars" />
        <div className="nebula-copy">
          <span className="kicker"><i /> PERSONAL CAREER INTELLIGENCE</span>
          <h1>别再追着职位跑。<br /><em>让机会找到你。</em></h1>
          <p>JobNebula 汇聚分散在公司官网、招聘平台和社区里的求职信号，并根据你的经历、偏好和目标解释每一次匹配。</p>
          <div className="hero-buttons"><a href="#radar" className="launch-button">打开我的机会雷达 <span>↗</span></a><button onClick={() => setShowAdd(true)}>粘贴一条职位试试</button></div>
          <div className="source-cloud"><small>信号源</small><span>公司官网</span><span>GitHub</span><span>Boss直聘</span><span>即刻</span><span>邮件订阅</span></div>
        </div>
        <div className="radar-visual" aria-label="职位匹配雷达示意">
          <div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="orbit orbit-c" />
          <div className="radar-sweep" />
          <div className="radar-core"><span>96</span><small>FIT SCORE</small></div>
          <div className="signal signal-one"><i>AI</i><span><b>AI 产品经理</b><small>Northstar · 上海</small></span><strong>96%</strong></div>
          <div className="signal signal-two"><i>CV</i><span><b>具身智能产品</b><small>Horizon · 杭州</small></span><strong>91%</strong></div>
          <div className="signal signal-three"><i>PY</i><span><b>Applied AI Engineer</b><small>Remote · APAC</small></span><strong>88%</strong></div>
        </div>
      </section>

      <section className="radar-section" id="radar">
        <div className="workspace-head">
          <div><span className="section-label">YOUR OPPORTUNITY MAP</span><h2>早上好，你的星图有 <em>{jobs.filter((job) => job.status === "new").length}</em> 个新信号</h2><p>基于：AI 产品 / Agent / 机器人 · 上海优先 · 接受远程</p></div>
          <button className={syncing ? "syncing" : ""} onClick={syncSources}><span>↻</span>{syncing ? "正在扫描…" : `同步职位源 · ${lastSync}`}</button>
        </div>

        <div className="stats-row" id="signals">
          <div><small>今日发现</small><strong>12</strong><span className="up">↗ 20%</span></div>
          <div><small>高匹配</small><strong>{jobs.filter((job) => job.score >= 90 && job.status !== "hidden").length}</strong><span>匹配度 ≥ 90</span></div>
          <div><small>已收藏</small><strong>{savedCount}</strong><span>等待行动</span></div>
          <div><small>已投递</small><strong>{appliedCount}</strong><span>本周目标 5</span></div>
          <div className="profile-card"><div className="profile-ring">82</div><span><small>职业信号完整度</small><b>再补充 2 项作品经历</b></span></div>
        </div>

        <div className="job-toolbar">
          <label className="search-box"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索职位、公司或技能…" aria-label="搜索职位" /></label>
          <div className="filter-group" role="group" aria-label="职位筛选">
            {([['all','全部'],['high','高匹配'],['remote','远程'],['saved','已收藏']] as const).map(([id,label]) => <button key={id} className={filter === id ? "active" : ""} onClick={() => setFilter(id)}>{label}</button>)}
          </div>
        </div>

        <div className="job-workspace" id="workflow">
          <div className="job-list">
            {visibleJobs.length ? visibleJobs.map((job) => (
              <article key={job.id} className={`job-card ${selected?.id === job.id ? "selected" : ""}`} onClick={() => setSelectedId(job.id)} tabIndex={0} onKeyDown={(event) => event.key === "Enter" && setSelectedId(job.id)}>
                <div className="company-avatar">{job.company.split(/\s/).map((part) => part[0]).join("").slice(0,2)}</div>
                <div className="job-main"><div className="job-title-line"><div><h3>{job.title}</h3><p>{job.company} · {job.location} · {job.mode}</p></div><div className={`fit-score ${job.score >= 90 ? "hot" : ""}`}><strong>{job.score}</strong><small>匹配</small></div></div>
                  <div className="tag-row">{job.skills.slice(0,4).map((skill) => <span key={skill}>{skill}</span>)}</div>
                  <div className="job-meta"><span>{job.salary}</span><span>来自 {job.source}</span><span>{job.posted}</span>{job.status !== "new" && <b>{job.status === "saved" ? "★ 已收藏" : "✓ 已投递"}</b>}</div>
                </div>
              </article>
            )) : <div className="empty-state"><strong>这片星域暂时没有信号</strong><span>换个筛选条件，或者捕获一条新的职位信息。</span></div>}
          </div>

          {selected && <aside className="insight-panel">
            <div className="insight-top"><div><small>WHY IT MATCHES</small><h3>为什么是它</h3></div><div className="score-disc"><strong>{selected.score}</strong><span>FIT</span></div></div>
            <div className="selected-role"><span>{selected.company}</span><h4>{selected.title}</h4><p>{selected.location} · {selected.salary}</p></div>
            <div className="reason-block good"><b>匹配信号</b>{selected.reasons.map((reason) => <p key={reason}><i>✓</i>{reason}</p>)}</div>
            <div className="reason-block gap"><b>需要确认</b>{selected.gaps.map((gap) => <p key={gap}><i>!</i>{gap}</p>)}</div>
            <div className="skill-overlap"><div><span>技能重合度</span><b>{Math.min(96, selected.score + 1)}%</b></div><div className="overlap-track"><i style={{width: `${Math.min(96, selected.score + 1)}%`}} /></div></div>
            <div className="insight-actions"><button className="apply" onClick={() => updateStatus(selected.id, "applied")}>{selected.status === "applied" ? "✓ 已加入申请轨道" : "加入申请轨道"}</button><button className={selected.status === "saved" ? "saved" : ""} onClick={() => updateStatus(selected.id, selected.status === "saved" ? "new" : "saved")}>{selected.status === "saved" ? "★" : "☆"}</button><button onClick={() => updateStatus(selected.id, "hidden")}>忽略</button></div>
            <p className="explain-note">JobNebula 只提供可解释的排序建议，最终判断始终由你做出。</p>
          </aside>}
        </div>
      </section>

      <section className="principles">
        <span className="section-label">DESIGNED FOR SIGNAL, NOT NOISE</span><h2>求职不该是一场信息耐力赛。</h2>
        <div className="principle-grid"><article><span>01</span><h3>汇聚，而非搬运</h3><p>统一不同来源的字段，识别重复职位，同时保留原始出处与发布时间。</p></article><article><span>02</span><h3>解释，而非黑盒</h3><p>每个匹配分数都展示加分项、冲突项和信息缺口，方便你自己判断。</p></article><article><span>03</span><h3>辅助，而非代替</h3><p>不做无差别海投。它帮助你把时间留给真正值得认真申请的机会。</p></article></div>
      </section>

      <footer className="nebula-footer"><div className="logo"><span className="logo-orbit"><i /></span><b>JobNebula</b></div><p>Turn scattered opportunities into your career constellation.</p><small>Open source · Local-first · Explainable ranking</small></footer>

      {showAdd && <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowAdd(false)}><form className="capture-modal" onSubmit={addOpportunity} onMouseDown={(event) => event.stopPropagation()}><button type="button" className="close-modal" onClick={() => setShowAdd(false)} aria-label="关闭">×</button><span className="section-label">CAPTURE A SIGNAL</span><h2>捕获一条新机会</h2><p>把你在任何地方看到的职位整理进同一张星图。</p><label>职位名称<input name="title" required placeholder="例如：AI 产品经理" /></label><div className="form-row"><label>公司<input name="company" required placeholder="公司名称" /></label><label>地点<input name="location" placeholder="上海 / Remote" /></label></div><label>关键技能<input name="skills" placeholder="Agent, Python, 产品策略" /></label><label>来源<input name="source" placeholder="公司官网 / 朋友推荐 / 社区" /></label><button className="modal-submit" type="submit">分析并加入星图 <span>↗</span></button></form></div>}
    </main>
  );
}

function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
