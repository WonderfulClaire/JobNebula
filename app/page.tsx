"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type TrackId = "frontier" | "quant" | "startup";
type Kind = "岗位" | "实习" | "深造" | "加速器" | "赛事";
type Status = "new" | "saved" | "applied" | "hidden";
type Job = {
  id: number;
  track: TrackId;
  kind: Kind;
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

type Milestone = { label: string; state: "have" | "doing" | "todo" };
type Track = {
  id: TrackId;
  code: string;
  name: string;
  color: string;
  tagline: string;
  skills: string[];
  roadmap: Milestone[];
  actions: string[];
};

const TRACKS: Track[] = [
  {
    id: "frontier",
    code: "AI",
    name: "前沿 AI",
    color: "#69f5df",
    tagline: "从强化学习与信号处理出发，切入大模型后训练、Agent 与具身智能",
    skills: ["RLHF", "强化学习", "多模态", "Agent", "PyTorch", "信号处理"],
    roadmap: [
      { label: "强化学习全景实现（rl-from-scratch，表格方法到 RLHF）", state: "have" },
      { label: "阵列信号处理与数理基础（矩阵分析 / 随机过程 / 凸优化）", state: "have" },
      { label: "AI 应用工程（求职导师 / 私享管家 / 职业星图三个上线产品）", state: "have" },
      { label: "RLHF / 后训练的大规模实战", state: "doing" },
      { label: "顶会论文或高影响力开源", state: "todo" },
      { label: "具身智能方向的项目证据", state: "todo" },
    ],
    actions: [
      "给 rl-from-scratch 补一份 RLHF 端到端实验报告，做成可引用的作品",
      "复现一篇 2026 年后训练方向的新论文并公开写解读",
      "本学期投出 1–2 个前沿实验室的研究实习申请",
    ],
  },
  {
    id: "quant",
    code: "QT",
    name: "金融量化",
    color: "#ffd166",
    tagline: "数理功底 + 强化学习迁移到策略研究，用项目和比赛敲开买方大门",
    skills: ["Python", "时间序列", "统计学习", "凸优化", "强化学习", "C++"],
    roadmap: [
      { label: "矩阵分析 / 随机过程 / 凸优化的数理底子", state: "have" },
      { label: "Python 与机器学习工程能力", state: "have" },
      { label: "金融知识体系（个人理财路线图 9 课）", state: "doing" },
      { label: "可复现的策略回测项目（含风控与归因）", state: "doing" },
      { label: "C++ 与低延迟工程", state: "todo" },
      { label: "量化实习或竞赛名次", state: "todo" },
    ],
    actions: [
      "把 rl-from-scratch 第 11 章改造成完整可复现的回测项目",
      "连续 8 周 C++ 专项 + 概率 / 脑筋急转弯面试题训练",
      "报名一场量化公开赛，用名次换面试直通",
    ],
  },
  {
    id: "startup",
    code: "ST",
    name: "创业",
    color: "#8b7cff",
    tagline: "两段从 0 到 1 的孵化经历，向可增长、可融资的 AI 应用推进",
    skills: ["MVP 交付", "AI 应用", "增长实验", "路演叙事", "团队组建"],
    roadmap: [
      { label: "从 0 到 1 产品交付（VT Apex 孵化 + 黑客松两段经历）", state: "have" },
      { label: "全栈 + AI 工程独立交付能力", state: "have" },
      { label: "真实用户与增长数据", state: "doing" },
      { label: "商业化与收入验证", state: "todo" },
      { label: "融资叙事与路演能力", state: "todo" },
      { label: "互补的联合创始团队", state: "todo" },
    ],
    actions: [
      "给私享管家做 100 个真实用户访谈，搭一块留存看板",
      "写一页纸商业计划：定价、获客成本、增长飞轮",
      "申请奇绩创坛 / 清华 x-lab，拿导师与种子资源",
    ],
  },
];

const INITIAL_JOBS: Job[] = [
  {
    id: 1, track: "frontier", kind: "岗位",
    title: "LLM 后训练工程师 · RLHF",
    company: "Lumina AI Lab", location: "北京", mode: "混合",
    salary: "50–80K · 16薪", source: "公司官网", posted: "26 分钟前", score: 94,
    skills: ["RLHF", "PPO/DPO", "PyTorch", "评估体系"],
    reasons: ["rl-from-scratch 覆盖 PPO 到 RLHF 的完整实现，可直接作为作品集", "后训练是当前最前沿方向之一，与你的强化学习积累高度对口", "接受以开源项目替代部分论文要求"],
    gaps: ["需要补大规模分布式训练的经验说明", "北京与深圳 / 上海偏好冲突"],
    status: "new",
  },
  {
    id: 2, track: "frontier", kind: "实习",
    title: "具身智能感知算法实习生",
    company: "元启机器人", location: "深圳", mode: "现场",
    salary: "500–700 / 天", source: "Boss直聘", posted: "1 小时前", score: 90,
    skills: ["多模态", "传感器融合", "计算机视觉", "ROS"],
    reasons: ["麦克风阵列与波束成形背景在具身感知里是稀缺信号", "深圳本地，与你的城市偏好一致", "实习门槛低于社招，适合在读切入前沿"],
    gaps: ["视觉方向的项目证据还需要补充"],
    status: "saved",
  },
  {
    id: 3, track: "frontier", kind: "深造",
    title: "AI PhD 申请 · 音频与多模态方向",
    company: "海外顶尖实验室（多校联投）", location: "海外", mode: "远程",
    salary: "全奖 + 生活津贴", source: "导师主页", posted: "今天", score: 88,
    skills: ["研究经历", "一作论文", "GRE/TOEFL", "套磁信"],
    reasons: ["HearWeave / BeamBench 是现成的研究作品集", "你正在推进 GRE / TOEFL，申请时间线吻合", "空间音频 × 大模型是上升期交叉方向"],
    gaps: ["需要 1 篇可投稿的一作论文", "推荐信组合要尽早锁定"],
    status: "new",
  },
  {
    id: 4, track: "frontier", kind: "岗位",
    title: "AI Agent 平台工程师",
    company: "Paperplane", location: "Remote · APAC", mode: "远程",
    salary: "$80K–110K", source: "GitHub", posted: "昨天", score: 86,
    skills: ["Agent", "RAG", "TypeScript", "评测"],
    reasons: ["连做三个 AI 应用（求职 / 健康 / 职业星图），Agent 工程链路熟", "远程友好，不与学业冲突"],
    gaps: ["英文技术协作证据需要在简历中强化"],
    status: "new",
  },
  {
    id: 5, track: "frontier", kind: "岗位",
    title: "语音大模型算法工程师",
    company: "深声科技", location: "深圳", mode: "混合",
    salary: "45–70K · 15薪", source: "猎聘", posted: "2 天前", score: 85,
    skills: ["语音", "信号处理", "Transformer", "流式推理"],
    reasons: ["阵列信号处理 + 空间音频是你最深的技术护城河", "语音 × LLM 岗位对传统信号处理背景明显加分"],
    gaps: ["需要补流式端到端模型的实践"],
    status: "new",
  },
  {
    id: 6, track: "quant", kind: "岗位",
    title: "量化研究员 · 机器学习方向",
    company: "启元资本", location: "深圳", mode: "现场",
    salary: "60–90K · 年终另计", source: "公司官网", posted: "44 分钟前", score: 91,
    skills: ["Python", "机器学习", "时间序列", "因子挖掘"],
    reasons: ["矩阵分析 / 随机过程 / 凸优化的数理底子正中筛选门槛", "强化学习与时间序列方法可直接迁移到策略研究", "深圳本地，符合城市偏好"],
    gaps: ["缺一个可展示的完整回测项目", "高频方向需要 C++"],
    status: "new",
  },
  {
    id: 7, track: "quant", kind: "实习",
    title: "量化研究实习生（中低频）",
    company: "衡宇投资", location: "上海", mode: "混合",
    salary: "600–800 / 天", source: "内推", posted: "3 小时前", score: 89,
    skills: ["因子研究", "Pandas", "回测", "统计"],
    reasons: ["实习是零经验进量化的主通道", "rl-from-scratch 第 11 章量化交易可直接改造成面试项目"],
    gaps: ["需要熟悉一个主流回测框架"],
    status: "new",
  },
  {
    id: 8, track: "quant", kind: "深造",
    title: "MFE 金融工程硕士 · 申请窗口",
    company: "海外 Top 项目（CMU / 巴鲁克等）", location: "海外", mode: "远程",
    salary: "学费自费 · 就业回报周期短", source: "项目官网", posted: "今天", score: 82,
    skills: ["数学", "编程", "GRE", "面试"],
    reasons: ["量化求职最硬的敲门砖之一", "GRE 备考成果可直接复用"],
    gaps: ["费用高，需与直接求职路线做机会成本权衡"],
    status: "new",
  },
  {
    id: 9, track: "quant", kind: "岗位",
    title: "Quant Developer（C++）",
    company: "Nova Trading", location: "上海", mode: "现场",
    salary: "55–85K · 14薪", source: "猎聘", posted: "昨天", score: 78,
    skills: ["C++", "低延迟", "Linux", "网络"],
    reasons: ["工程与研究复合背景符合 Quant Dev 画像"],
    gaps: ["C++ 是当前最大缺口，建议 8 周专项补强"],
    status: "new",
  },
  {
    id: 10, track: "quant", kind: "赛事",
    title: "全球量化策略公开赛 2026",
    company: "QuantArena", location: "线上", mode: "远程",
    salary: "奖金池 ¥50 万 + 直通面试", source: "社区", posted: "3 天前", score: 84,
    skills: ["回测", "风控", "Alpha", "组合优化"],
    reasons: ["用比赛名次替代实习经历，是转量化的高性价比信号", "可复用 RL 交易章节的代码底座"],
    gaps: ["需要连续 6 周的策略迭代投入"],
    status: "new",
  },
  {
    id: 11, track: "startup", kind: "加速器",
    title: "奇绩创坛 2027 春季营 · 申请开放",
    company: "MiraclePlus", location: "北京 · 全国招募", mode: "混合",
    salary: "¥300 万起投资 + 加速服务", source: "官网", posted: "今天", score: 92,
    skills: ["AI 应用", "MVP", "路演", "增长"],
    reasons: ["你已有两段从 0 到 1：VT Apex 孵化的求职导师 + 黑客松健康管家", "AI 应用是本期最重点赛道", "对学生创始人友好"],
    gaps: ["需要一页纸讲清楚商业模式与增长数据"],
    status: "saved",
  },
  {
    id: 12, track: "startup", kind: "加速器",
    title: "Y Combinator W27 批次",
    company: "Y Combinator", location: "旧金山 · 远程申请", mode: "远程",
    salary: "$500K 标准投资", source: "官网", posted: "昨天", score: 85,
    skills: ["英文路演", "产品", "增长", "决心"],
    reasons: ["全英文产品履历（VT 孵化背景）是天然加分", "YC 对学生和首次创业者接受度高"],
    gaps: ["需要权衡签证与全职投入", "英文路演视频要专门打磨"],
    status: "new",
  },
  {
    id: 13, track: "startup", kind: "岗位",
    title: "Founding Engineer · AI 健康方向",
    company: "隐山智能（种子轮）", location: "深圳", mode: "现场",
    salary: "30–50K + 1–2% 期权", source: "即刻", posted: "5 小时前", score: 88,
    skills: ["全栈", "AI 应用", "健康科技", "从0到1"],
    reasons: ["私享管家与该公司几乎同赛道，认知可直接复用", "创始工程师是低风险体验创业的最佳位置"],
    gaps: ["期权条款需要仔细谈：行权价与稀释保护"],
    status: "new",
  },
  {
    id: 14, track: "startup", kind: "赛事",
    title: "清华校内创业大赛 · 春季赛",
    company: "清华 x-lab", location: "北京", mode: "现场",
    salary: "种子资金 + 校友导师", source: "校内", posted: "2 天前", score: 86,
    skills: ["路演", "团队", "产品", "校友网络"],
    reasons: ["在校身份是稀缺窗口期资源，毕业即失效", "校友资本与导师网络的入场券"],
    gaps: ["需要组一个 2–3 人的互补团队"],
    status: "new",
  },
  {
    id: 15, track: "startup", kind: "岗位",
    title: "AI 产品合伙人（技术）",
    company: "早期团队 · 教育科技", location: "远程 · 深圳优先", mode: "远程",
    salary: "合伙人机制 · 底薪 + 分红", source: "朋友推荐", posted: "3 天前", score: 80,
    skills: ["AI 产品", "教育", "合伙", "远程协作"],
    reasons: ["求职导师产品经验与教育科技高度相关"],
    gaps: ["合伙前要尽调：股权结构与现金流", "远程协作的执行力约定"],
    status: "new",
  },
];

const trackOf = (id: TrackId) => TRACKS.find((t) => t.id === id)!;
const completionOf = (track: Track) => {
  const total = track.roadmap.reduce((sum, m) => sum + (m.state === "have" ? 1 : m.state === "doing" ? 0.5 : 0), 0);
  return Math.round((total / track.roadmap.length) * 100);
};
const STATE_LABEL = { have: "已具备", doing: "进行中", todo: "待补强" } as const;

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState<"all" | TrackId>("all");
  const [filter, setFilter] = useState<"all" | "high" | "remote" | "saved">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("刚刚");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("job-nebula-jobs-v2");
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Job[];
          if (Array.isArray(parsed) && parsed.every((job) => job.track && job.kind)) setJobs(parsed);
        } catch { /* keep demo data */ }
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("job-nebula-jobs-v2", JSON.stringify(jobs));
  }, [jobs]);

  const visibleJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (job.status === "hidden") return false;
      if (trackFilter !== "all" && job.track !== trackFilter) return false;
      const query = search.trim().toLowerCase();
      const matchesSearch = !query || `${job.title} ${job.company} ${job.kind} ${job.skills.join(" ")}`.toLowerCase().includes(query);
      const matchesFilter =
        filter === "all" ||
        (filter === "high" && job.score >= 88) ||
        (filter === "remote" && job.mode === "远程") ||
        (filter === "saved" && job.status === "saved");
      return matchesSearch && matchesFilter;
    });
  }, [filter, jobs, search, trackFilter]);

  const selected = jobs.find((job) => job.id === selectedId) ?? visibleJobs[0] ?? jobs[0];
  const newCount = jobs.filter((job) => job.status === "new").length;
  const savedCount = jobs.filter((job) => job.status === "saved").length;
  const appliedCount = jobs.filter((job) => job.status === "applied").length;
  const highCount = jobs.filter((job) => job.score >= 88 && job.status !== "hidden").length;
  const trackCount = (id: TrackId) => jobs.filter((job) => job.track === id && job.status !== "hidden").length;
  const overallCompletion = Math.round(TRACKS.reduce((sum, t) => sum + completionOf(t), 0) / TRACKS.length);

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
    const track = (String(form.get("track")) as TrackId) || "frontier";
    const kind = (String(form.get("kind")) as Kind) || "岗位";
    const profileSkills = trackOf(track).skills;
    const skills = String(form.get("skills") || "").split(/[,，]/).map((item) => item.trim()).filter(Boolean);
    const overlap = skills.filter((skill) => profileSkills.some((mine) => mine.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(mine.toLowerCase()))).length;
    const score = clamp(68 + overlap * 7, 68, 97);
    const newJob: Job = {
      id: Date.now(),
      track,
      kind,
      title: String(form.get("title") || "新机会"),
      company: String(form.get("company") || "未命名公司"),
      location: String(form.get("location") || "待确认"),
      mode: "混合",
      salary: "薪资待沟通",
      source: String(form.get("source") || "手动添加"),
      posted: "刚刚添加",
      score,
      skills: skills.length ? skills : ["待分析"],
      reasons: overlap ? [`有 ${overlap} 项技能与「${trackOf(track).name}」航线的职业信号重合`, "你主动收藏了这条机会，意向权重已提升"] : [`已归入「${trackOf(track).name}」航线，建议补充完整 JD 以获得更准确解释`],
      gaps: overlap ? ["需要结合完整职位描述进一步判断"] : ["技能信息不足"],
      status: "new",
    };
    setJobs((items) => [newJob, ...items]);
    setSelectedId(newJob.id);
    setShowAdd(false);
    setFilter("all");
    setTrackFilter(track);
  };

  return (
    <main className="nebula-shell">
      <header className="nebula-nav">
        <a className="logo" href="#top" aria-label="JobNebula 首页"><span className="logo-orbit"><i /></span><b>JobNebula</b></a>
        <nav aria-label="主导航"><a href="#radar">机会雷达</a><a href="#empower">赋能路线</a><a href="#workflow">申请轨道</a></nav>
        <button className="nav-cta" onClick={() => setShowAdd(true)}>＋ 捕获机会</button>
      </header>

      <section className="nebula-hero" id="top">
        <div className="hero-stars" />
        <div className="nebula-copy">
          <span className="kicker"><i /> PERSONAL CAREER INTELLIGENCE</span>
          <h1>三条航线，<br /><em>一张职业星图。</em></h1>
          <p>JobNebula 围绕你的三条未来航线——前沿 AI、金融量化、创业——汇聚岗位、实习、深造与加速器信号，解释每一次匹配，并给出下一步行动。</p>
          <div className="hero-buttons"><a href="#radar" className="launch-button">打开我的机会雷达 <span>↗</span></a><button onClick={() => setShowAdd(true)}>粘贴一条机会试试</button></div>
          <div className="source-cloud"><small>信号源</small><span>公司官网</span><span>GitHub</span><span>Boss直聘</span><span>导师主页</span><span>加速器</span><span>校友内推</span></div>
        </div>
        <div className="radar-visual" aria-label="机会匹配雷达示意">
          <div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="orbit orbit-c" />
          <div className="radar-sweep" />
          <div className="radar-core"><span>94</span><small>FIT SCORE</small></div>
          <div className="signal signal-one"><i>AI</i><span><b>LLM 后训练工程师</b><small>Lumina · 北京</small></span><strong>94%</strong></div>
          <div className="signal signal-two"><i>QT</i><span><b>量化研究员 · ML</b><small>启元资本 · 深圳</small></span><strong>91%</strong></div>
          <div className="signal signal-three"><i>ST</i><span><b>奇绩创坛春季营</b><small>MiraclePlus · 申请中</small></span><strong>92%</strong></div>
        </div>
      </section>

      <section className="radar-section" id="radar">
        <div className="workspace-head">
          <div><span className="section-label">YOUR OPPORTUNITY MAP</span><h2>早上好，你的星图有 <em>{newCount}</em> 个新信号</h2><p>三条航线：前沿 AI · 金融量化 · 创业 — 深圳 / 上海优先 · 接受远程 · 深造与加速器并行追踪</p></div>
          <button className={syncing ? "syncing" : ""} onClick={syncSources}><span>↻</span>{syncing ? "正在扫描…" : `同步机会源 · ${lastSync}`}</button>
        </div>

        <div className="track-switcher" role="group" aria-label="航线切换">
          <button className={trackFilter === "all" ? "active" : ""} onClick={() => setTrackFilter("all")}>全部航线<em>{jobs.filter((job) => job.status !== "hidden").length}</em></button>
          {TRACKS.map((track) => (
            <button key={track.id} className={trackFilter === track.id ? "active" : ""} style={{ "--tc": track.color } as React.CSSProperties} onClick={() => setTrackFilter(track.id)}>
              <i />{track.name}<em>{trackCount(track.id)}</em>
            </button>
          ))}
        </div>

        <div className="stats-row" id="signals">
          <div><small>新信号</small><strong>{newCount}</strong><span className="up">跨三条航线</span></div>
          <div><small>高匹配</small><strong>{highCount}</strong><span>匹配度 ≥ 88</span></div>
          <div><small>已收藏</small><strong>{savedCount}</strong><span>等待行动</span></div>
          <div><small>已投递</small><strong>{appliedCount}</strong><span>本周目标 5</span></div>
          <div className="profile-card"><div className="profile-ring">{overallCompletion}</div><span><small>三航线平均就绪度</small><b>查看下方赋能路线图补齐缺口</b></span></div>
        </div>

        <div className="job-toolbar">
          <label className="search-box"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索机会、公司或技能…" aria-label="搜索机会" /></label>
          <div className="filter-group" role="group" aria-label="机会筛选">
            {([['all','全部'],['high','高匹配'],['remote','远程'],['saved','已收藏']] as const).map(([id,label]) => <button key={id} className={filter === id ? "active" : ""} onClick={() => setFilter(id)}>{label}</button>)}
          </div>
        </div>

        <div className="job-workspace" id="workflow">
          <div className="job-list">
            {visibleJobs.length ? visibleJobs.map((job) => (
              <article key={job.id} className={`job-card ${selected?.id === job.id ? "selected" : ""}`} onClick={() => setSelectedId(job.id)} tabIndex={0} onKeyDown={(event) => event.key === "Enter" && setSelectedId(job.id)}>
                <div className="company-avatar" style={{ color: trackOf(job.track).color }}>{trackOf(job.track).code}</div>
                <div className="job-main"><div className="job-title-line"><div><h3>{job.title}</h3><p>{job.company} · {job.location} · {job.mode}</p></div><div className={`fit-score ${job.score >= 88 ? "hot" : ""}`}><strong>{job.score}</strong><small>匹配</small></div></div>
                  <div className="tag-row"><span className="kind-badge" style={{ "--tc": trackOf(job.track).color } as React.CSSProperties}>{job.kind}</span>{job.skills.slice(0,4).map((skill) => <span key={skill}>{skill}</span>)}</div>
                  <div className="job-meta"><span>{job.salary}</span><span>来自 {job.source}</span><span>{job.posted}</span>{job.status !== "new" && <b>{job.status === "saved" ? "★ 已收藏" : "✓ 已投递"}</b>}</div>
                </div>
              </article>
            )) : <div className="empty-state"><strong>这片星域暂时没有信号</strong><span>换个航线或筛选条件，或者捕获一条新机会。</span></div>}
          </div>

          {selected && <aside className="insight-panel">
            <div className="insight-top"><div><small>WHY IT MATCHES</small><h3>为什么是它</h3></div><div className="score-disc"><strong>{selected.score}</strong><span>FIT</span></div></div>
            <div className="selected-role"><span>{trackOf(selected.track).name} 航线 · {selected.kind} · {selected.company}</span><h4>{selected.title}</h4><p>{selected.location} · {selected.salary}</p></div>
            <div className="reason-block good"><b>匹配信号</b>{selected.reasons.map((reason) => <p key={reason}><i>✓</i>{reason}</p>)}</div>
            <div className="reason-block gap"><b>需要确认</b>{selected.gaps.map((gap) => <p key={gap}><i>!</i>{gap}</p>)}</div>
            <div className="skill-overlap"><div><span>与「{trackOf(selected.track).name}」航线信号重合度</span><b>{Math.min(96, selected.score + 1)}%</b></div><div className="overlap-track"><i style={{width: `${Math.min(96, selected.score + 1)}%`}} /></div></div>
            <div className="insight-actions"><button className="apply" onClick={() => updateStatus(selected.id, "applied")}>{selected.status === "applied" ? "✓ 已加入申请轨道" : "加入申请轨道"}</button><button className={selected.status === "saved" ? "saved" : ""} onClick={() => updateStatus(selected.id, selected.status === "saved" ? "new" : "saved")}>{selected.status === "saved" ? "★" : "☆"}</button><button onClick={() => updateStatus(selected.id, "hidden")}>忽略</button></div>
            <p className="explain-note">JobNebula 只提供可解释的排序建议，最终判断始终由你做出。</p>
          </aside>}
        </div>
      </section>

      <section className="empower" id="empower">
        <span className="section-label">FUTURE EMPOWERMENT</span>
        <h2>三条航线的<em>赋能路线图</em></h2>
        <p className="empower-sub">基于你已有的真实积累（强化学习全景库 · 阵列信号处理 · 两段孵化产品经历），为每条航线标出已具备、进行中与待补强，并给出下一步行动。</p>
        <div className="empower-grid">
          {TRACKS.map((track) => {
            const completion = completionOf(track);
            return (
              <article key={track.id} style={{ "--tc": track.color } as React.CSSProperties}>
                <header><i>{track.code}</i><div><h3>{track.name}</h3><small>{track.tagline}</small></div><strong>{completion}%</strong></header>
                <div className="empower-bar"><i style={{ width: `${completion}%` }} /></div>
                <ul className="milestones">
                  {track.roadmap.map((milestone) => (
                    <li key={milestone.label} data-state={milestone.state}><i /><span>{milestone.label}</span><em>{STATE_LABEL[milestone.state]}</em></li>
                  ))}
                </ul>
                <div className="next-actions"><b>下一步行动</b>{track.actions.map((action) => <p key={action}>→ {action}</p>)}</div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="principles">
        <span className="section-label">DESIGNED FOR SIGNAL, NOT NOISE</span><h2>规划未来不该是一场信息耐力赛。</h2>
        <div className="principle-grid"><article><span>01</span><h3>汇聚，而非搬运</h3><p>岗位、实习、深造、加速器与赛事统一进一张星图，保留原始出处与时间。</p></article><article><span>02</span><h3>解释，而非黑盒</h3><p>每个匹配分数都展示加分项、冲突项和信息缺口，方便你自己判断。</p></article><article><span>03</span><h3>辅助，而非代替</h3><p>三条航线不是三倍焦虑。它帮助你把时间留给真正值得认真投入的机会。</p></article></div>
      </section>

      <footer className="nebula-footer"><div className="logo"><span className="logo-orbit"><i /></span><b>JobNebula</b></div><p>Turn scattered opportunities into your career constellation.</p><small>Open source · Local-first · Explainable ranking</small></footer>

      {showAdd && <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowAdd(false)}><form className="capture-modal" onSubmit={addOpportunity} onMouseDown={(event) => event.stopPropagation()}><button type="button" className="close-modal" onClick={() => setShowAdd(false)} aria-label="关闭">×</button><span className="section-label">CAPTURE A SIGNAL</span><h2>捕获一条新机会</h2><p>把你在任何地方看到的机会整理进同一张星图，并归入对应航线。</p><label>机会名称<input name="title" required placeholder="例如：LLM 后训练工程师 / MFE 项目 / 创业比赛" /></label><div className="form-row"><label>所属航线<select name="track" defaultValue={trackFilter === "all" ? "frontier" : trackFilter}>{TRACKS.map((track) => <option key={track.id} value={track.id}>{track.name}</option>)}</select></label><label>类型<select name="kind" defaultValue="岗位">{(["岗位","实习","深造","加速器","赛事"] as const).map((kind) => <option key={kind} value={kind}>{kind}</option>)}</select></label></div><div className="form-row"><label>公司 / 机构<input name="company" required placeholder="公司或项目名称" /></label><label>地点<input name="location" placeholder="深圳 / 上海 / Remote" /></label></div><label>关键技能<input name="skills" placeholder="RLHF, 时间序列, 路演" /></label><label>来源<input name="source" placeholder="公司官网 / 导师主页 / 朋友推荐" /></label><button className="modal-submit" type="submit">分析并加入星图 <span>↗</span></button></form></div>}
    </main>
  );
}

function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
