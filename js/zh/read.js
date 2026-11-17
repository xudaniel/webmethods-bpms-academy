// 简体中文：阅读版（read.html）和两份高管简报（brief.html）（#68 第四批）。
// 只在这两个页面加载，放在 zh/core.js 等之后，所以这里的页面标题会覆盖互动版的标题。
// 静态文字用 Z.text 按英文原文对照（i18n.js 会逐个替换文字节点）；含链接或加粗的段落用 data-i18n。
(function (Z) {
  const body = document.body;
  const isBrief = body && body.classList.contains("brief-page");

  if (isBrief) {
    Z.title = "高管简报：银行业和保险业 · IBM webMethods BPMS 学院";
    Z.description = "写给银行和保险公司的一页纸高管简报：用 IBM webMethods BPMS 和 Business Rules 做流程和决策自动化，能帮到哪里、哪些管控最重要、接下来有哪些关键日期。只用公开资料。";
  } else {
    Z.title = "IBM webMethods BPMS 学院：阅读版";
    Z.description = "Daniel Yuanpeng Xu 制作的 IBM webMethods BPMS 学院阅读版，只读、可打印：带出处的 IBM webMethods BPMS 知识库、示意图、完整课程文字，以及附答案的自测题。";
  }

  // 含链接或加粗的段落
  Object.assign(Z.page = Z.page || {}, {
    "r.intro": '想点一点、动手玩？<a href="index.html">打开互动版</a>。这一页没有标签页、滑块和小游戏：只管读、看图，最后自测一下。可以直接打印（Ctrl/Cmd + P）。',
    "r.why1": "每个组织都在跑流程：审批、理赔、入职、货运异常处理。<strong>BPMS</strong>（业务流程管理套件）就是让这些流程「在轨道上运行」的软件：它分派工作、执行规则、把任务送到对的人面前，并记录发生过的每一件事。现在 AI agent 来了，而它们需要的正是这样的轨道。",
    "r.why3": "<strong>每件事由谁负责。</strong>流程负责<em>编排</em>，规则负责<em>判断</em>，人负责<em>处理例外</em>，agent 负责<em>阅读和提议</em>。",
    "r.scan1": "多年的 BPMS 历史会显示：人们在哪里几乎什么都批、在哪里一等好几天、在哪里对相同的输入反复做同一个决定。给每个步骤按这几项打分：数量、人工处理时间、等待时间、最常见结果出现的比例，以及<em>确定性</em>，也就是相同的输入是不是几乎总得到相同的结果。",
    "r.foot": "Daniel Yuanpeng Xu 制作的独立学习资料。不是 IBM 官方网站，与 IBM 或 Software AG 没有隶属或背书关系。标有<em>作者观点</em>的部分是个人看法。所有事实都来自列出的公开资料；没有使用任何客户数据或雇主内部数据。"
  });

  // 纯文字：英文原文（去掉首尾空白）→ 中文
  Z.text = {
    // 页头、目录
    "Reading version — a cited IBM webMethods BPMS knowledge base and the whole course on one page, with diagrams and a self-check quiz": "阅读版：带出处的 IBM webMethods BPMS 知识库和整门课程放在一页里，配示意图和自测题",
    "by Daniel Yuanpeng Xu": "作者：Daniel Yuanpeng Xu",
    "IBM webMethods BPMS Academy": "IBM webMethods BPMS 学院",
    "Contents": "目录",
    "Why this matters": "为什么值得关心",
    "What a BPMS is": "BPMS 是什么",
    "Basics 101: seven fundamental lessons": "基础 101：七节基础课",
    "IBM webMethods knowledge base": "IBM webMethods 知识库",
    "Controls for regulated industries": "受监管行业的合规控制",
    "How to use IBM webMethods BPMS": "怎么使用 IBM webMethods BPMS",
    "Hands-on lab: your first process in 30 minutes": "动手实验：30 分钟做出你的第一个流程",
    "Troubleshooting": "故障排查",
    "Role cheat sheets": "按角色的速查卡",
    "Teach a class": "开课教学",
    "Architecture": "架构",
    "Where execution history lives": "执行历史存在哪里",
    "Lifecycle and release dates": "生命周期和发布日期",
    "BPMN essentials": "BPMN 要点",
    "Patterns": "设计模式",
    "Agents need a rulebook": "Agent 需要一本规则手册",
    "Worked cases": "案例详解",
    "Finding agent candidates in process history": "从流程历史里找出 agent 候选",
    "Where the market is going": "市场往哪里走",
    "Five ideas for the agent era": "AI agent 时代的五个主意",
    "Glossary": "术语表",
    "Self-check quiz and answer key": "自测题和答案",
    "Sources": "资料来源",

    // 各章标题（保留「数字.」开头，其他脚本靠它算章节号）
    "1. Why this matters": "1. 为什么值得关心",
    "2. What a BPMS is": "2. BPMS 是什么",
    "3. Basics 101: seven fundamental lessons": "3. 基础 101：七节基础课",
    "4. IBM webMethods knowledge base": "4. IBM webMethods 知识库",
    "5. Controls for regulated industries": "5. 受监管行业的合规控制",
    "6. How to use IBM webMethods BPMS": "6. 怎么使用 IBM webMethods BPMS",
    "7. Hands-on lab: your first process in 30 minutes": "7. 动手实验：30 分钟做出你的第一个流程",
    "8. Troubleshooting": "8. 故障排查",
    "9. Role cheat sheets": "9. 按角色的速查卡",
    "10. Teach a class": "10. 开课教学",
    "11. Architecture": "11. 架构",
    "12. Where execution history lives": "12. 执行历史存在哪里",
    "13. Lifecycle and release dates": "13. 生命周期和发布日期",
    "14. BPMN essentials": "14. BPMN 要点",
    "15. Patterns": "15. 设计模式",
    "16. Agents need a rulebook": "16. Agent 需要一本规则手册",
    "17. Worked cases": "17. 案例详解",
    "18. Finding agent candidates in process history": "18. 从流程历史里找出 agent 候选",
    "19. Where the market is going": "19. 市场往哪里走",
    "20. Five ideas for the agent era": "20. AI agent 时代的五个主意",
    "21. Glossary": "21. 术语表",
    "22. Self-check quiz": "22. 自测题",
    "23. Sources": "23. 资料来源",
    "Author's view": "作者观点",

    // 第 1–10 章的静态文字
    "One request, two worlds.": "同一个申请，两个世界。",
    "Job": "工作", "Best owner": "最合适的负责者", "Why": "为什么",
    "A Business Process Management Suite turns a process drawn in BPMN into running, observable automation: systems are called automatically, people get tasks in an inbox, decisions come from rules, and every step leaves an audit trail.":
      "业务流程管理套件（BPMS）把用 BPMN 画出来的流程，变成正在运行、看得见的自动化：系统被自动调用，人在收件箱里收到任务，决定来自规则，每一步都留下审计记录。",
    "IBM webMethods BPMS (part of IBM since the 2024 acquisition of webMethods from Software AG) combines Designer, the Process Engine inside Integration Server, the Task Engine on My webMethods Server, Business Rules, and Monitor/Optimize. It is commonly paired with IBM ODM for governed decisions.":
      "IBM webMethods BPMS（2024 年 IBM 从 Software AG 收购 webMethods 后成为 IBM 的一部分）由这几部分组成：Designer、Integration Server 里的 Process Engine、My webMethods Server 上的 Task Engine、Business Rules，以及 Monitor/Optimize。它常和 IBM ODM 搭配，用来做受管控的决策。",
    "IBM webMethods at a glance": "IBM webMethods 一览",
    "How IBM webMethods BPMS actually behaves, topic by topic. Each topic ends with a practitioner note and its public sources.": "IBM webMethods BPMS 实际是怎么运作的，一个主题一个主题地讲。每个主题最后都有一段实践经验和它的公开出处。",
    "What banks and insurers are asked to show, and how IBM webMethods BPMS and Business Rules can provide it.": "银行和保险公司被要求拿出什么证据，以及 IBM webMethods BPMS 和 Business Rules 怎样提供这些证据。",
    "One-page executive briefs:": "一页纸高管简报：", "banking": "银行业", "insurance": "保险业",
    "Step-by-step guides by role. Menu paths follow public Software AG / IBM documentation; labels can differ slightly by version.": "按角色分的分步指南。菜单路径依照 Software AG / IBM 的公开文档；不同版本的界面名称可能略有不同。",
    "New here? A 15-minute path through this course": "第一次来？15 分钟走一遍这门课",
    "Customer demo script (10 minutes)": "客户演示脚本（10 分钟）",
    "Process:": "流程：", "Before you start": "开始之前", "Common pitfalls": "常见的坑", "Level up:": "进阶：",
    "Symptom, what to check first, the fix, and where to apply it.": "症状、先查什么、怎么修，以及在哪里修。",
    "Print before the class:": "开课前打印：", "Facilitator tips:": "主持人提示：",

    // 图 1：架构
    "webMethods BPMS architecture": "webMethods BPMS 架构",
    "BPMN, services,": "BPMN、服务、", "tasks, rules": "任务、规则", "upload": "上传",
    "IS services": "IS 服务", "adapters, APIs": "适配器、API", "human tasks (MWS)": "人工任务（MWS）",
    "Rules / ODM": "规则 / ODM", "decisions": "决策", "Process Engine DB": "Process Engine 数据库", "live state": "实时状态",
    "Process Audit DB": "Process Audit 数据库", "PRA_* history": "PRA_* 历史",
    "Figure 1. Models are built in Designer and uploaded; the Process Engine inside Integration Server runs them, calling services, human tasks and rules, and writes history to the Process Audit database.":
      "图 1。模型在 Designer 里建好并上传；Integration Server 里的 Process Engine 运行它们，调用服务、人工任务和规则，并把历史写进 Process Audit 数据库。",

    // 图 2：执行历史
    "Three stores of execution data": "执行数据的三个存储",
    "private, real-time state": "不对外的实时状态", "used by the engine only": "只给引擎自己用",
    "process & step status,": "流程和步骤状态、", "transitions, logged fields,": "流转、记录的字段、", "errors (PRA_* tables)": "错误（PRA_* 表）",
    "Task Engine audit": "Task Engine 审计", "assignments, actions,": "分派、操作、", "outcomes per task;": "每个任务的结果；", "optional archive": "可选归档",
    "Analyse history from the Process Audit DB and the Task Engine audit — never the live engine store.": "从 Process Audit 数据库和 Task Engine 审计分析历史，千万别去查引擎的实时存储。",
    "Figure 2. In 10.15, task status is not written to the Process Audit tables by default, so human-task detail comes from the Task Engine audit.": "图 2。在 10.15 里，任务状态默认不写进 Process Audit 表，所以人工任务的细节要从 Task Engine 审计里找。",
    "Table": "表", "What it holds": "存什么",

    // 图 3：时间线
    "Release event": "发布事件", "Date": "日期",
    "Timeline 2022 to 2028": "2022 到 2028 年时间线",
    "Oct 2022": "2022 年 10 月", "10.15 GA": "10.15 正式发布", "IBM acquires": "IBM 收购", "12.1 available": "12.1 推出",
    "Sep 2026": "2026 年 9 月", "Gartner BOAT": "Gartner BOAT", "MQ": "魔力象限", "Oct 2027": "2027 年 10 月", "10.15 end of": "10.15", "10.15 extended": "10.15 延长", "support ends": "支持结束",
    "2 Dec 2027": "2027 年 12 月 2 日", "EU AI Act": "欧盟 AI 法案", "Annex III": "附件三", "Oct 2028": "2028 年 10 月", "support": "支持结束",
    "Figure 3. Upgrade deadlines and regulation decide when organisations re-evaluate their process platforms.": "图 3。升级截止日和监管要求，决定了组织什么时候重新评估自己的流程平台。",

    // 图 4：agent 和规则
    "Agent proposes, rules decide, process executes": "Agent 提议，规则决定，流程执行",
    "AI agent": "AI agent", "reads, proposes": "阅读、提议", "Rules (ODM)": "规则（ODM）", "allow / refer / deny": "允许 / 转人工 / 拒绝",
    "Process executes": "流程执行", "Person approves": "人来审批", "BPMS user task": "BPMS 人工任务", "Denied": "拒绝",
    "Log": "日志", "rule ver.,": "规则版本、", "inputs,": "输入、", "approver": "审批人",
    "Figure 4. The agent is good at reading and proposing; rules hold the money limits; people handle what the rules refer; everything is logged.": "图 4。Agent 擅长阅读和提议；规则掌管金额上限；人处理规则转过来的情况；一切都有记录。",
    "Example policy.": "示例政策。",
    "An agent proposes a customer credit after a shipping delay. Rules: no credit if the delay is under 4 hours; auto-approve up to $500 (key accounts up to $1,000); anything above goes to a person.":
      "货运延误后，agent 提议给客户一笔补偿。规则：延误不到 4 小时不补偿；500 美元以内自动批准（大客户 1,000 美元以内）；超过的交给人。",
    "Case": "案例", "Agent proposes": "Agent 提议", "Rules decide": "规则决定",

    // 图 5：贷款案例
    "Loan decisioning process in BPMN": "用 BPMN 画的贷款决策流程",
    "Fetch credit": "获取信用", "data (service)": "数据（服务）", "Eligibility": "资格审核", "(rule task)": "（规则任务）",
    "Underwriter": "核保员", "review (user task)": "审核（人工任务）", "Send decision": "发送决定", "(service)": "（服务）",
    "approve / decline": "批准 / 拒绝", "refer": "转人工",
    "Figure 5. Loan decisioning: a rule task decides approve, decline or refer; only referrals reach a person.": "图 5。贷款决策：规则任务决定批准、拒绝还是转人工；只有转人工的才会到人手里。",
    "Simulator walkthrough": "模拟器演练",
    "The interactive simulator runs this loan process. With a loan of $40,000, a credit score of 690 and income of $90,000 (loan/income 44%), the rule refers the case to an underwriter. The Process Audit history looks like this:":
      "互动版的模拟器跑的就是这个贷款流程。贷款 40,000 美元、信用分 690、收入 90,000 美元（贷款收入比 44%）时，规则把这个案子转给核保员。Process Audit 里的历史大致是这样：",
    "Illustrative rows; real column names and values differ by version and logging level.": "示意数据；真实的列名和取值会因版本和日志级别而不同。",

    // 第 18 章：扫描
    "Class": "类别", "Rule": "判定规则", "Meaning": "含义",
    "Rule candidate (ODM)": "规则候选（ODM）", "User task, determinism ≥ 80%": "人工任务，确定性 ≥ 80%", "A rule nobody wrote down": "一条没人写下来的规则",
    "Agent candidate (rubber-stamp)": "Agent 候选（盖章式审批）", "≥ 90% one outcome, ≤ 15 min work": "≥ 90% 是同一个结果，处理 ≤ 15 分钟", "Agent prepares, rule or person confirms": "Agent 准备，规则或人确认",
    "Agent candidate (triage + approve)": "Agent 候选（分诊 + 审批）", "Wait ≥ 24 h, ≥ 70% one outcome": "等待 ≥ 24 小时，≥ 70% 是同一个结果", "Agent triages, person approves": "Agent 分诊，人审批",
    "Integration fix": "集成修复", "Service step, errors ≥ 5%": "服务步骤，出错率 ≥ 5%", "Fix the integration first": "先把集成修好",
    "Keep human": "继续由人做", "Everything else": "其他所有情况", "High variance or high stakes": "变化大或风险高",
    "Example result (synthetic logistics data, 6 months)": "示例结果（合成的物流数据，6 个月）",
    "Step": "步骤", "Volume / month": "每月数量", "Hours saved / month*": "每月节省小时*",
    "Review delay claim": "审核延误索赔", "Agent (rubber-stamp)": "Agent（盖章式审批）", "Assign carrier credit": "分配承运商补偿",
    "Classify customs documents": "给报关文件分类", "Agent (triage + approve)": "Agent（分诊 + 审批）", "Customs release approval": "海关放行审批",
    "Call TMS update": "调用 TMS 更新", "Integration fix (7% errors)": "集成修复（7% 出错）", "Escalate to manager": "升级给经理",
    "*Placeholder automatable shares (rules 80%, rubber-stamp 60%, triage 40%). The synthetic data was generated to contain these patterns; the table shows the method, not real-world results.":
      "*可自动化比例是占位数（规则 80%、盖章式 60%、分诊 40%）。合成数据是特意生成来包含这些模式的；这张表展示的是方法，不是真实世界的结果。",

    // 第 19–23 章
    "Firm": "机构", "BPM market": "BPM 市场", "Outlook": "展望", "Signals (2026)": "信号（2026）", "Where the market really is": "市场真正在哪里",
    "Answer on paper or in your head, then check the key below.": "在纸上或心里作答，然后对照下面的答案。",
    "Answer key": "答案",

    // 页脚
    "Created by": "制作：", "interactive version": "互动版", "source on GitHub": "GitHub 上的源码",

    // 高管简报页顶部的按钮
    "← Back to the course": "← 回到课程", "Print the banking brief": "打印银行业简报", "Print the insurance brief": "打印保险业简报"
  };

  // ---------- 高管简报（brief.js） ----------
  Z.briefs = {
    banking: {
      title: "银行的流程和决策自动化",
      problem: "信贷、开户和支付运营把系统、政策和人连在一起。监管机构期望每一个决定都能解释、有人监督、出了问题能恢复，而邮件往来和电子表格做不到这一点。",
      helps: [
        ["贷款发放", "规则执行信贷政策并分派每一份申请；只有转人工的才到核保员手里；输入和结果与申请一起记录下来。"],
        ["客户开户", "干净的案子直接走完；例外带着完整背景到分析师手里；超过风险门槛的由第二位审批人签批。"],
        ["支付异常", "失败的步骤由有具名权限的人在 Monitor 里修复并重新提交，每一次重跑都留在历史里。"]
      ],
      dates: [
        ["2027 年 5 月 1 日", "OSFI 指引 E-23（模型风险管理）对加拿大所有联邦监管的金融机构生效。"],
        ["2025 年 1 月 17 日", "DORA 从这一天起适用于欧盟金融机构：ICT 风险、事件管理、测试和第三方风险。"],
        ["持续中", "欧盟 AI 法案：对自然人的信用评估和信用评分被列为高风险（附件三第 5(b) 项）。具体适用日期请查官方网站的最新信息。"],
        ["2027 年 10 月 31 日", "webMethods 10.15 支持结束（付费的延长支持可到 2028 年 10 月和 2030 年 10 月）：这是现代化改造的天然时机。"]
      ]
    },
    insurance: {
      title: "保险公司的流程和决策自动化",
      problem: "理赔、核保和保单服务混合了文件、授权额度和人。监管机构期望 AI 辅助的决定受到管控、有人监督，并且有记录。",
      helps: [
        ["理赔分诊", "规则让简单的理赔直接走完，把复杂或可疑的带着完整背景送给理赔员或调查员。"],
        ["核保转人工", "超出核保员授权额度的案子交给高级核保员，额度放在业务人员自己就能改的规则里。"],
        ["AI 辅助受理", "Agent 阅读文件并提议；规则决定它能做什么；其余的由人审批；每个决定都有记录。"]
      ],
      dates: [
        ["2023 年 12 月 4 日", "NAIC 通过了《保险公司使用 AI 系统示范公告》；各州采纳后适用。"],
        ["2027 年 5 月 1 日", "OSFI 指引 E-23 对加拿大所有联邦监管的金融机构生效，包括保险公司。"],
        ["持续中", "欧盟 AI 法案：人寿和健康保险中对自然人的风险评估和定价被列为高风险（附件三第 5(c) 项）。具体适用日期请查官方网站的最新信息。"],
        ["2027 年 10 月 31 日", "webMethods 10.15 支持结束（付费的延长支持可到 2028 年 10 月和 2030 年 10 月）。"]
      ]
    },
    ui: {
      sub: (d) => `一页纸简报 · IBM webMethods BPMS 和 Business Rules · 只用公开资料 · 作者 Daniel Yuanpeng Xu · 出处核对于 ${d}`,
      problem: "问题", view: "作者观点", helps: "流程加规则能帮到哪里", controls: "最重要的管控", control: "管控",
      askedBy: "提出要求的", evidence: "平台产生的证据", dates: "接下来的关键日期", sources: "资料来源", practice: "常见做法",
      fig: "每一部分在哪里运行：Designer、Integration Server（Process Engine、Business Rules）、两个数据库，以及 My webMethods Server（Task Engine、Monitor）。",
      foot: "教学材料，不构成法律、合规或投资建议。独立学习资料；与 IBM 没有隶属或背书关系。产品名称是各自所有者的商标。完整内容：xudaniel.github.io/webmethods-bpms-academy（合规控制栏目）。"
    }
  };
})(window.ZH = window.ZH || {});
