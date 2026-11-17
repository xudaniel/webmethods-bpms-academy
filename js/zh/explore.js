// 简体中文：概览、生命周期、架构、BPMN、设计模式、案例、模拟器、Agent 扫描实验室、市场、术语表、测验（#68 第三批 a）。
(function (Z) {
  Z.done = (Z.done || []).concat(["overview", "lifecycle", "architecture", "bpmn", "patterns", "cases", "simulator", "scan", "market", "glossary", "quiz"]);

  Object.assign(Z.page, {
    "ov.h2": "BPMS 是什么？",
    "ov.lead": "业务流程管理套件（BPMS）把用 BPMN 画出来的流程，变成真正运行、看得见的自动化：系统被自动调用，人在收件箱里领任务，决定来自规则，每一步都留下审计记录。",
    "ov.p": "IBM webMethods BPMS（2024 年 IBM 从 Software AG 收购 webMethods 后成为 IBM 的产品）由这些部分组成：<strong>Designer</strong>、Integration Server 里的 <strong>Process Engine</strong>、My webMethods Server 上的 <strong>Task Engine</strong>、<strong>Business Rules</strong>，以及 <strong>Monitor/Optimize</strong>。它常和 <strong>IBM ODM</strong> 搭配使用，管理需要治理的决策。",
    "ov.glance": "IBM webMethods 一览",
    "ov.glanceP": "BPMS 是 IBM webMethods 集成产品家族的一部分。下面是你在 BPMS 项目里会碰到的各个部件。",
    "ov.one": "最需要记住的一句话",
    "ov.oneP": "<strong>流程负责编排，规则负责判断，人负责例外。</strong>到了 agent 时代，出现了第四个角色：<strong>agent 负责提议</strong>：阅读文档、起草动作，而规则和人仍然要负责。",
    "ov.how": "怎么用这个网站",
    "ov.t1": "<strong>认识各个部件</strong><small>架构、生命周期、BPMN</small>",
    "ov.t2": "<strong>跑一个流程</strong><small>让一笔贷款走过规则和人工任务</small>",
    "ov.t3": "<strong>找出 agent 候选</strong><small>在浏览器里给流程历史打分</small>",
    "ov.t4": "<strong>看看市场</strong><small>编排方面的钱都花在哪里</small>",
    "ov.disc": "独立学习资源。不是 IBM 官方网站，与 IBM 无隶属关系，也未经 IBM 认可。产品名称是其所有者的商标。所有事实都来自公开资料，列在「市场」栏目和 README 里；没有用到任何客户数据或内部数据。",
    "lc.h2": "流程生命周期", "lc.p": "点一个阶段。",
    "lc.rel": "需要知道的版本生命周期",
    "lc.src": "升级截止日就是客户重新评估平台的时候。来源：IBM webMethods 支持生命周期页面。",
    "ar.h2": "架构", "ar.p": "点一个部件。",
    "ar.tables": "Process Audit 表（历史存在这里）", "ar.table": "表", "ar.holds": "里面存什么",
    "ar.src": "写进去什么，取决于每个流程设置的日志级别。在 10.15 里，人工任务的历史来自 Task Engine 的审计，而不是这些表，除非你打开了任务日志。",
    "bp.h2": "BPMN 要点",
    "pa.h2": "设计模式", "pa.show": "显示", "pa.all": "全部模式", "pa.classic": "经典", "pa.agent": "Agent 时代",
    "ca.h2": "完整案例", "ca.p": "每个案例都展示流程和背后的设计道理。",
    "si.h2": "贷款流程模拟器",
    "si.p": "填好申请，启动一个实例，一步步往下走。规则任务决定<em>批准</em>、<em>拒绝</em>还是<em>转人工</em>；只有转人工的才交给人。日志显示的是 Process Audit 数据库里会有的那种记录。",
    "si.amt": "贷款金额", "si.score": "信用分", "si.inc": "年收入", "si.start": "启动实例", "si.next": "下一步",
    "si.task": "收件箱里的核保员任务：", "si.ap": "批准", "si.de": "拒绝",
    "si.src": "使用的规则：信用分 &lt; 580 → 拒绝；信用分 ≥ 720 且贷款/收入 ≤ 35% → 批准；其他情况转人工。仅作示意。",
    "sc.h2": "Agent 扫描实验室",
    "sc.p": "多年的 BPMS 历史会显示：人们在哪里几乎什么都批、在哪里等很久、在哪里反复做同一个决定。这个实验室给每一步打分，把它归为 <strong>ODM 规则候选</strong>、<strong>agent 候选</strong>、<strong>继续由人做</strong>或<strong>集成问题</strong>。一切都在你的浏览器里运行，不会上传任何东西。",
    "sc.run": "用合成的物流数据跑一遍", "sc.load": "载入你的 CSV…", "sc.fmt": "CSV 格式",
    "sc.fmt1": "每个已完成的步骤实例一行：<code>process, step, step_type, start_ts, end_ts, wait_min, work_min, outcome, input_key, loop_count, error</code>。<code>step_type</code> 是 <code>user_task</code>、<code>service</code> 或 <code>gateway</code>。<code>input_key</code> 是驱动这个决定的业务字段的哈希值。常见来源：步骤来自 <code>PRA_PROCESS_STEP</code> 和 <code>PRA_STEP_LOGGED_FIELD</code>，人工任务来自 Task Engine 审计。只用匿名化的导出数据。",
    "sc.fmt2": "规则：确定性 ≥ 80% → 规则候选；同一结果 ≥ 90% 且处理 ≤ 15 分钟 → agent（盖章式）；等待 ≥ 24 小时且同一结果 ≥ 70% → agent（分诊 + 人工批准）；服务出错率 ≥ 5% → 集成问题。",
    "sc.src": "合成数据是特意生成来包含这些模式的，所以示例结果只是演示方法怎么运作。",
    "mk.h2": "市场往哪里走", "mk.dis": "分析机构的规模数字对不上", "mk.firm": "机构", "mk.size": "BPM 市场", "mk.out": "展望",
    "mk.sig": "信号（2026）", "mk.take": "结论", "mk.src": "来源",
    "gl.h2": "术语表", "gl.ph": "搜索术语…",
    "qz.h2": "知识自测", "qz.score": "得分：0 / 0"
  });

  // 概览、生命周期、架构、BPMN、设计模式、案例、市场（替换 ACADEMY 里的同名内容）
  Z.academy = {
    architecture: {
      designer: { role: "设计时", text: "基于 Eclipse 的工具：在这里画 BPMN 流程、做 Integration Server 服务、定义人工任务和业务规则，然后把流程模型构建并上传到运行时。",
        tip: "模型是「构建并上传」的；之后 Process Audit 数据库里会有这个流程的元数据。" },
      is: { name: "Integration Server + Process Engine（WmPRT）", role: "运行时", text: "Process Engine 在 Integration Server 里运行（WmPRT 包）。它执行流程步骤、调用 IS 服务，并把实例的实时状态存在 Process Engine 数据库里。",
        tip: "服务步骤就是 IS 服务，所以 BPMS 生活在 webMethods 的集成环境之中。" },
      task: { name: "Task Engine（在 My webMethods Server 上）", role: "人的工作", text: "运行人工任务：收件箱、分派、转交、升级、任务业务数据，以及每个任务的审计记录（getTaskAudit）。任务可以归档到单独的数据源。",
        tip: "在 10.15 里，任务状态默认不写进 Process Audit 表，所以任务历史通常来自 Task Engine。" },
      "pe-db": { name: "Process Engine 数据库", role: "状态", text: "引擎自己用的、不对外的实时流程实例状态存储。不是给报表用的。",
        tip: "如果审计日志是异步写的，审计数据可能比这个「真实」状态稍微滞后一点。" },
      audit: { name: "Process Audit 数据库", role: "历史", text: "对外的历史存储：流程和步骤状态、转移、记录的业务字段、错误。Monitor 读的就是它。从 9.6 起表名以 PRA_ 开头（之前是 WM*）。",
        tip: "关键的表：PRA_PROCESS、PRA_PROCESS_STEP、PRA_STEP_TRANSITION、PRA_STEP_LOGGED_FIELD、PRA_ERROR。" },
      rules: { name: "Business Rules / ODM", role: "决策", text: "从流程里调用的决策表和规则（通过规则任务或服务调用）。很多企业把决策逻辑搬到 IBM Operational Decision Manager（ODM），以便做版本管理、测试和治理。",
        tip: "模式：流程负责编排，规则引擎负责判断。" },
      monitor: { role: "观察和改进", text: "Monitor 显示实例和记录的数值，并可以重新提交；Optimize 再加上 KPI、仪表盘和业务活动监控。",
        tip: "用 Optimize 的客户手里已经有 KPI 历史，agent 机会扫描可以直接拿来用。" }
    },
    auditTables: [
      ["PRA_PROCESS", "每个流程状态一行（打开流程状态日志时）。"],
      ["PRA_PROCESS_STEP", "每个步骤状态一行（打开步骤日志时）。"],
      ["PRA_PROCESS_STEP_LOOP", "带流程、步骤和循环次数的步骤状态。"],
      ["PRA_STEP_TRANSITION", "每次转移的开始和结束步骤（打开转移日志时）。"],
      ["PRA_STEP_LOGGED_FIELD(S)", "标记为需要记录的输入/输出字段在运行时的值。"],
      ["PRA_ERROR", "每个失败的步骤一行。"]
    ],
    lifecycle: [
      ["建模", "在 Designer 里画 BPMN 流程：泳道、任务、网关、事件。和业务负责人一起确认流程。"],
      ["实现", "给服务步骤挂上 IS 服务，做好人工任务（表单、分派），加上规则任务或 ODM 调用。"],
      ["构建并上传", "生成运行时制品并上传模型；版本会被记录下来。"],
      ["执行", "Process Engine 运行实例；Task Engine 把人的工作放进收件箱。"],
      ["监控", "跟踪实例、错误和记录的数值；重新提交失败的步骤。"],
      ["优化", "度量 KPI 和周期时间，找出瓶颈，修改规则或模型。"],
      ["治理", "版本控制、审计历史、保留和归档、变更审批。"]
    ],
    bpmn: [
      { group: "活动", items: [
        ["服务任务（Service task）", "自动调用一个 Integration Server 服务或外部系统。"],
        ["人工任务（User task）", "给人做的工作，送到 Task Engine 的收件箱里。"],
        ["规则任务（Business rule task）", "评估一张决策表或一个 ODM 决策服务。"],
        ["子流程 / 调用活动", "在一个流程里复用另一个流程；让模型保持小巧。"]]},
      { group: "网关", items: [
        ["排他网关（XOR）", "只走一条路，由条件决定。"],
        ["并行网关（AND）", "所有路都走；汇合处等所有路都到了再继续。"],
        ["包容网关（OR）", "走一条或多条路，取决于条件。"],
        ["事件网关", "等哪个事件先到，就走哪条路。"]]},
      { group: "事件", items: [
        ["开始 / 结束", "一个实例从哪里开始、在哪里结束。"],
        ["计时器", "截止时间和升级，比如「24 小时后升级」。"],
        ["消息", "等待或发送来自另一个流程或系统的消息。"],
        ["错误", "捕获失败，转到恢复路径。"]]},
      { group: "泳道", items: [
        ["池（Pool）", "一个参与方，比如公司或合作伙伴。"],
        ["道（Lane）", "池里的一个角色或系统；表示谁做什么。"]]}
    ],
    patterns: [
      { name: "用规则任务实现决策敏捷", problem: "决策逻辑变得比流程快。",
        solution: "把门槛和资格放在规则任务或 ODM 决策服务里；流程只按结果分路。在 Designer 里配置规则任务（Properties → Implementation），映射输入输出，规则改了就 Hot Deploy，不用重新构建流程。",
        when: "定价、资格、分派、额度。" },
      { name: "带任务动作的 Process Aware 决策表", problem: "一条规则需要创建或影响一个人工任务。",
        solution: "把决策表标为 Process Aware，映射 TaskData 和 ProcessData（只向外），并确保规则任务的输入输出和表完全一致。",
        when: "在其余都自动化的规则里，插入人工决定点。" },
      { name: "人工例外路径", problem: "大多数情况是常规的，少数需要判断。",
        solution: "把直通路径自动化；只把例外连同完整背景送到人工任务。",
        when: "理赔、审批、订单异常。" },
      { name: "计时升级", problem: "任务在收件箱里放太久。",
        solution: "给人工任务挂一个计时器；到期就重新分派、通知经理，或者执行默认动作。",
        when: "SLA、监管截止日。" },
      { name: "并行工作加汇合", problem: "互不相干的检查一个接一个地做。",
        solution: "对互不相干的检查用并行网关，在做决定之前汇合。",
        when: "开户检查、收集文件。" },
      { name: "Agent 提议，规则决定，流程执行", problem: "AI agent 擅长读文档、提议动作，但受监管的决定必须可解释、可重复。",
        solution: "Agent 提取事实并提议；ODM 决策服务执行政策（批准 / 拒绝 / 转人工）；BPMS 流程执行，或升级给人。每一步都有记录。",
        when: "理赔、贷款、KYC、物流异常。" },
      { name: "给 agent 用的人工审批收件箱", problem: "来自多个平台的 agent，有些动作需要人来批，还要有 SLA 和审计。",
        solution: "把 agent「需要人来批」的步骤送进 BPMS 的人工任务：分派、转交、升级和审计都是现成的。",
        when: "影响大的动作；欧盟 AI 法案对高风险系统的人工监督要求。" },
      { name: "决策日志（黑匣子）", problem: "出事之后，你必须拿出是哪个规则版本、哪些输入、哪位审批人得出了这个结果。",
        solution: "对每一个和 agent 相关的决定，记录决策输入、规则版本、结果和审批人；和流程审计记录放在一起。",
        when: "任何受监管、或影响客户的自动化决定。" }
    ],
    cases: [
      { name: "采购审批",
        flow: ["提交申请", "规则：按金额和成本中心确定审批额度", "经理审批（人工任务，48 小时计时器）", "创建采购订单（服务）", "通知申请人"],
        lesson: "额度每个预算周期都会变，所以放在规则里，不要写在网关条件里。" },
      { name: "贷款决策",
        flow: ["收到申请", "获取信用数据（服务）", "规则：资格、定价、转人工理由", "只有「转人工」时才由核保员审核", "发出批准或拒绝函"],
        lesson: "信用评分属于欧盟 AI 法案附件三的用途；要保留决策日志和人工复核路径。" },
      { name: "物流异常（agent 时代）",
        flow: ["运输管理系统发来延误或损坏事件", "Agent 读文件，提议补偿或改道", "规则：政策和费用上限", "超过上限由人审批", "更新运输管理系统并通知客户"],
        lesson: "Agent 负责阅读和起草；规则掌握金额上限；人处理边缘情况。" }
    ],
    lifecycleDates: [
      ["webMethods 10.15 正式发布", "2022 年 10 月 18 日"],
      ["10.15 支持结束", "2027 年 10 月 31 日"],
      ["10.15 第一阶段延长支持结束", "2028 年 10 月 31 日"],
      ["10.15 后续延长支持结束（只含使用咨询和已知缺陷）", "2030 年 10 月 31 日"],
      ["最后一个支持 AIX 和 z/Linux 的版本", "10.15"]
    ],
    market: {
      sizing: [
        ["Mordor Intelligence", "167 亿美元（2025）", "到 2031 年年复合增长 11.6%"],
        ["IMARC", "175 亿美元（2025）", "到 2034 年达 381 亿美元"],
        ["Fortune Business Insights", "215 亿美元（2025）", "到 2034 年年复合增长 17.2%；北美占 43%"],
        ["360iResearch", "265 亿美元（2025）", "到 2032 年年复合增长 23.2%"]
      ],
      signals: [
        "Gartner 2026 年「业务编排与自动化技术（BOAT）」魔力象限评估了 20 家厂商；这个类别要求原生的 AI agent 编排和治理能力。",
        "Gartner 预计，到 2030 年，70% 的企业会转向统一的自动化平台，同时编排流程、agent、机器人、API 和人，而现在只有 10%。",
        "Camunda 在 2026 年 8 月公布年度经常性收入（ARR）接近 2 亿美元，增长主要来自保险（+53%）、公共部门（+48%）和银行（+40%）。",
        "Appian 公布 2026 年第三季度收入 2.346 亿美元（+25%），并表示约 80% 的 ARR 来自金融服务、生命科学和公共部门。",
        "欧盟 AI 法案（数字综合法案）：信用评分这类附件三高风险系统的义务从 2027 年 12 月 2 日起适用；嵌入产品的系统从 2028 年 8 月 2 日起适用。"
      ],
      takeaways: [
        "分析机构给出的「BPM 市场」规模相差超过 50%；拿来看方向可以，拿来估算一条产品线的规模不行。",
        "新的支出流向受监管、长时间运行、需要人监督的流程，买家把它们当作带 agent 治理的统一编排平台来采购。",
        "对一个成熟的本地部署 BPMS 来说，现实的市场是它的已有客户，以及这些客户周边的集成环境；升级截止日就是客户重新评估的时候。"
      ]
    },
    tags: { classic: "经典", "agent era": "Agent 时代" }
  };

  // 术语表：按英文原词对照（英文原词保留在括号里，方便查官方文档）
  Z.gloss = {
    "Accept (task)": ["接受（任务）", "在 My webMethods 里认领一个任务；一个人接受后，其他人就不能再接受。"],
    "BOAT": ["BOAT", "Business Orchestration and Automation Technologies（业务编排与自动化技术），Gartner 给结合流程编排、连接和 agent 能力的平台起的类别名。"],
    "BPMN": ["BPMN", "Business Process Model and Notation（业务流程模型和标记法），画流程的标准图示语言。"],
    "BPMS": ["BPMS", "Business Process Management Suite（业务流程管理套件）：建模、执行、人工任务、监控和规则，集中在一个产品家族里。"],
    "Build and upload": ["构建并上传（Build and upload）", "Designer 里的操作，在 Integration Server 上生成流程的运行时元素。"],
    "Decision agility": ["决策敏捷", "不重新部署流程就能修改业务决定的能力。"],
    "Decision table": ["决策表", "一种决策实体，每一行是一条规则，有 IF（条件）列和 THEN（结果）列。"],
    "Decision tree / event rule": ["决策树 / 事件规则", "webMethods Business Rules 里的另外两种决策实体。"],
    "Delegate": ["转交（Delegate）", "把一个任务转给另一个用户；会记进任务的审计日志。"],
    "EOM / EOS": ["EOM / EOS", "产品生命周期里的维护结束（End of Maintenance）和支持结束（End of Support）日期。IBM 的 webMethods 生命周期页列的是支持结束日期，之后是付费的延长支持。"],
    "Execution Enabled": ["启用执行（Execution Enabled）", "My webMethods 里的设置，打开后 Process Engine 才能启动这个流程模型版本的实例。"],
    "Hot Deploy": ["Hot Deploy（热部署）", "把更新后的规则项目推到 Integration Server，不用重新部署流程。"],
    "Human-in-the-loop": ["人在回路（Human-in-the-loop）", "一种设计：由一个人复核或批准自动化或 agent 的动作。"],
    "Integration Server (IS)": ["Integration Server（IS）", "webMethods 运行服务、适配器和 API 的运行时；Process Engine 就装在这里。"],
    "MCP": ["MCP", "Model Context Protocol（模型上下文协议），一个把工具和数据开放给 AI agent 的开放协议。"],
    "Message start event": ["消息开始事件", "一种开始步骤：它的接收文档一到，就启动一个新的流程实例。"],
    "My webMethods Server (MWS)": ["My webMethods Server（MWS）", "门户服务器，承载任务收件箱、Monitor 和管理界面。"],
    "ODM": ["ODM", "IBM Operational Decision Manager：业务规则的编写、测试、版本管理和执行。"],
    "ODMoC": ["ODMoC", "ODM on Cloud，ODM 的托管 SaaS 版本。"],
    "Optimize": ["Optimize", "webMethods 的 KPI 和业务活动监控组件。"],
    "Process Audit database": ["Process Audit 数据库", "流程和步骤状态、记录的字段和错误的历史存储（PRA_ 表）。"],
    "Process Aware": ["Process Aware", "决策表的一个设置；规则里包含人工决定或任务动作时必须打开。"],
    "Process Engine": ["Process Engine（流程引擎）", "Integration Server 里执行流程模型的运行时（WmPRT）。"],
    "Process project": ["流程项目（Process project）", "Designer 里装一个或多个流程及其资产的容器；每个流程都必须属于一个流程项目。"],
    "Quality of service (Process Engine)": ["服务质量（Process Engine）", "按流程设定的取舍：有保证、持久化的执行，还是更快的易失执行。"],
    "Resubmit": ["重新提交（Resubmit）", "Monitor 里的操作：从一个可重新提交的步骤开始，重跑失败或已完成的流程实例。"],
    "Rule project": ["规则项目（Rule project）", "装数据模型、规则集、决策实体和动作的容器。"],
    "Rule task": ["规则任务（Rule task）", "一种 BPMN 任务：评估业务规则，把结果返回给流程。"],
    "Subscription trigger": ["订阅触发器", "自动生成的触发器：根据收到的文档启动一个新的流程实例，或加入一个正在运行的实例。"],
    "Task Engine": ["Task Engine（任务引擎）", "My webMethods Server 上管理人工任务和收件箱的运行时。"],
    "Transition document": ["转移文档", "Process Engine 用来在步骤之间传递控制权的消息。"],
    "Universal Messaging": ["Universal Messaging", "webMethods 的消息服务器；可以作为 Process Engine 的 JMS 提供方。"],
    "Volatile tracking": ["Volatile Tracking（易失跟踪）", "流程状态只放在内存里；更快，但服务器故障时会丢失，而且在 Monitor 里看不到。"]
  };

  // 测验：按英文原题对照
  Z.quiz = {
    "Where does the webMethods Process Engine run?": { q: "webMethods 的 Process Engine 在哪里运行？", a: ["在 Integration Server 里（WmPRT）", "只在 My webMethods Server 里", "在浏览器里", "在 ODM 里"], e: "Process Engine 就是 Integration Server 里的 WmPRT 包。" },
    "Which store should you query for historical process and step statuses?": { q: "要查流程和步骤的历史状态，应该查哪个存储？", a: ["Process Engine 数据库", "Process Audit 数据库（PRA_ 表）", "IS 仓库", "Task Engine 缓存"], e: "Process Audit 数据库是对外的历史存储；Process Engine 数据库是不对外的运行时状态。" },
    "In 10.15, where is human-task history usually found?": { q: "在 10.15 里，人工任务的历史通常在哪里？", a: ["只在 PRA_PROCESS 里", "Task Engine 审计（getTaskAudit / 归档）", "IS 服务器日志", "根本没有存"], e: "10.15 默认不把任务状态写进 Process Audit；要用 Task Engine 的审计记录。" },
    "A discount threshold changes every quarter. Where should it live?": { q: "一个折扣门槛每季度都会变。它应该放在哪里？", a: ["网关条件里", "写死在一个 IS 服务里", "规则任务或 ODM 决策里", "BPMN 图的标签里"], e: "规则带来决策敏捷，不用重新部署流程。" },
    "Which gateway runs all outgoing paths?": { q: "哪种网关会走所有出去的路？", a: ["排他网关", "并行网关", "事件网关", "只有一个条件为真的包容网关"], e: "并行（AND）网关会激活每一条出去的路。" },
    "In the 'agent proposes, rules decide' pattern, who makes the final policy decision?": { q: "在「agent 提议，规则决定」的模式里，最终的政策决定由谁做？", a: ["Agent", "规则引擎（比如 ODM），必要时升级给人", "BPMN 图", "没有人"], e: "Agent 提议；确定性的规则决定；流程执行或升级。" },
    "When does standard support for webMethods 10.15 end?": { q: "webMethods 10.15 的标准支持什么时候结束？", a: ["2025 年 10 月", "2027 年 10 月", "2030 年 10 月", "没有结束日期"], e: "支持在 2027 年 10 月 31 日结束；付费的延长支持可以到 2028 年 10 月和 2030 年 10 月。" },
    "From when do EU AI Act obligations apply to Annex III high-risk systems such as credit scoring?": { q: "欧盟 AI 法案对信用评分这类附件三高风险系统的义务，从什么时候开始适用？", a: ["2025 年 8 月 2 日", "2026 年 12 月 2 日", "2027 年 12 月 2 日", "2030 年 8 月 2 日"], e: "数字综合法案把附件三的义务推迟到 2027 年 12 月 2 日。" },
    "In the Agent Scan Lab, a user task whose outcome is the same for the same inputs 95% of the time is best treated as…": { q: "在 Agent 扫描实验室里，一个人工任务在相同输入下 95% 的时候结果都一样，最好把它当作……", a: ["Agent 候选", "规则候选", "继续由人做", "集成问题"], e: "高度确定的结果，就是一条没人写下来的规则；把它写进 ODM。" },
    "What does BOAT stand for?": { q: "BOAT 是什么的缩写？", a: ["Business Orchestration and Automation Technologies（业务编排与自动化技术）", "Business Object Audit Trail", "BPM Online Analytics Tool", "Batch Orchestration And Transfer"], e: "Gartner 给统一编排和自动化平台起的类别名。" },
    "Which Process Engine setting keeps process status in memory only?": { q: "Process Engine 的哪个设置只把流程状态放在内存里？", a: ["Optimize Locally", "Volatile Tracking", "Guaranteed Transition", "Process Aware"], e: "Volatile Tracking（默认关）把状态放在内存里；更快，但出故障时状态会丢，Monitor 也看不到。" },
    "What does 'Optimize Locally' do?": { q: "「Optimize Locally」做什么？", a: ["缓存规则结果", "在同一台 Integration Server 上运行相邻步骤，不发布转移文档", "压缩审计表", "把任务移到本地收件箱"], e: "它默认是开的，省去相邻步骤之间经过消息层的来回。" },
    "In a webMethods decision table, what does each row represent?": { q: "在 webMethods 决策表里，每一行代表什么？", a: ["一个规则集", "一条单独的规则", "一个数据模型", "一个事件"], e: "每一列是条件（IF）或结果（THEN）；每一行是一条规则。" },
    "Which runtime platform change arrives with IBM webMethods 12.1?": { q: "IBM webMethods 12.1 带来了什么运行时平台变化？", a: ["只支持 Java 8", "Java 21 和 Jakarta EE 10", "换成 .NET", "运行时没有变化"], e: "12.1 换成了基于 Java 21 和 Jakarta EE 10 的新运行时。" },
    "What is required for a decision table that contains a manual decision (Task Action)?": { q: "包含人工决定（Task Action）的决策表需要什么？", a: ["必须标为 Process Aware，并映射 TaskData / ProcessData", "只能在 MWS 上运行", "不能从规则任务调用", "需要 ODM 许可证"], e: "有任务动作的决策表必须是 Process Aware；ProcessData 只做向外映射。" },
    "How do you update rules without redeploying the process?": { q: "怎样在不重新部署流程的情况下更新规则？", a: ["修改 BPMN 网关条件", "把规则项目 Hot Deploy 到 Integration Server", "重新构建整个流程模型", "重启 Designer"], e: "Hot Deploy 推送更新后的规则项目；流程模型保持不变。" },
    "A completed instance must be re-run from step 3, but the button does nothing. Most likely?": { q: "一个已完成的实例需要从第 3 步重跑，但按钮没反应。最可能的原因？", a: ["Monitor 离线了", "实例开始执行之前，第 3 步没有设为可重新提交", "这个流程是易失的", "Hot Deploy 失败了"], e: "已完成的实例，只能从实例开始执行之前就已设为可重新提交的步骤重新提交。" },
    "When upgrading, you enable the new version of a model that has running instances and are asked to upgrade running processes. What does the upgrade guide say?": { q: "升级时，你启用一个还有实例在跑的模型的新版本，系统问你要不要升级正在运行的流程。升级指南怎么说？", a: ["回答 Yes", "回答 No", "先删掉旧版本", "关掉 Monitor"], e: "重新生成之前先调高模型版本号，启用新版本，然后对「升级正在运行的流程」回答 No。" },
    "You built and uploaded a new process version but no instances start. What is the most likely reason?": { q: "你构建并上传了一个新的流程版本，但没有实例启动。最可能的原因是什么？", a: ["Designer 当时在 Business Analyst 模式", "这个版本没有启用执行", "没有安装 Universal Messaging", "任务收件箱满了"], e: "新上传的版本默认不启用。在 My webMethods 里启用这个版本（Execution Enabled），或者把 Designer 设成构建后自动启用。" },
    "A task is assigned to a group of five people. What happens?": { q: "一个任务分给了一个五人小组。会发生什么？", a: ["只有组长能看到", "它出现在每个成员的收件箱里；第一个接受的人拿走它", "被拆成五个任务", "等五个人都接受"], e: "分给组和角色的任务会出现在每个成员的收件箱里；一个人接受后，其他人就不能再接。" },
    "When is the Hot Deploy button disabled in the Business Rules user interface?": { q: "在 Business Rules 界面里，Hot Deploy 按钮什么时候不可用？", a: ["周末", "决策实体有未保存的修改或有错误时", "有流程在运行时", "从来不会"], e: "先保存并修好错误；校验还会检查空白、重叠、缺失和冗余的规则。" },
    "A failed step is not resubmit-enabled. Where does a resubmitted instance restart?": { q: "一个失败的步骤不可重新提交。重新提交的实例会从哪里重新开始？", a: ["从最开头", "从之前最近的、可重新提交且已经跑过的步骤", "不能重新提交", "从结尾"], e: "Monitor 会从之前执行过的、最近的可重新提交步骤继续。" },
    "You add an activity and implement it as a new task without renaming it. What is the problem?": { q: "你加了一个活动，没改名就把它实现为新任务。问题在哪里？", a: ["没问题", "任务类型会以默认标签命名，很容易出现重名的任务", "任务部署不了", "流程构建不了"], e: "Designer 用步骤标签当任务类型名；先给每个人工任务步骤起一个唯一的标签。" },
    "Which step can start a new process instance when a published document arrives?": { q: "收到一个发布的文档时，哪种步骤能启动一个新的流程实例？", a: ["中间消息事件", "带接收文档的消息开始事件", "排他网关", "结束事件"], e: "消息开始事件（以及允许启动实例的接收任务）会启动新实例；中间事件只会加入正在运行的实例。" }
  };

  // 模拟器和扫描实验室
  Z.sim = {
    steps: ["收到申请", "获取信用数据", "规则：资格", "核保员审核", "发出决定"], skipped: "（跳过）", press: "点「启动实例」创建一个流程实例。",
    low: "信用分低于 580", ok: "信用分 ≥ 720 且贷款/收入 ≤ 35%", refer: (s, d) => `信用分 ${s}，贷款/收入 ${d}% → 需要核保员`
  };
  Z.scan = {
    cls: { "Keep human": "继续由人做", "Integration fix": "集成问题", "Leave as is": "保持现状", "Rule candidate (ODM)": "规则候选（ODM）",
      "Agent candidate (rubber-stamp)": "Agent 候选（盖章式）", "Agent candidate (triage + human approve)": "Agent 候选（分诊 + 人工批准）" },
    head: ["流程 / 步骤", "分类", "每月节省小时", "每月量", "最常见结果", "确定性", "处理分钟", "等待小时"],
    note: "节省的时间用的是占位的可自动化比例（规则 80%，盖章式 60%，分诊 40%）。对外引用前，请先用真实数据校准。",
    bad: "读不了这个 CSV：",
    process: { "Shipment exception": "货运异常", "Customs hold": "海关扣留" },
    step: { "Review delay claim": "审核延误索赔", "Assign carrier credit": "分配承运商补偿", "Escalate to manager": "升级给经理", "Call TMS update": "调用运输系统更新",
      "Classify documents": "文件分类", "Release approval": "放行审批" }
  };

  // 本批示意图
  Object.assign(Z.dgCap, {
    "lifecycle-loop": ["流程生命周期是一个循环", "建模、实现、构建并上传、执行、监控、优化、治理，然后带着学到的东西重新开始。大多数改进只是改一条规则或出一个新的模型版本。"],
    "bpmn-gateways": ["三种网关，三种行为", "排他（×）只走一条路。并行（+）每条路都走，收口的 + 会等所有路都到齐。包容（○）走一条或多条路，取决于条件。"],
    "bpmn-lanes": ["泳道表示谁做什么", "一个池，三条泳道。每当箭头跨过泳道线，工作就换了一个人负责：从申请人到经理，再到系统。"],
    "sim-loan": ["模拟器里的贷款流程", "先获取信用数据，由资格规则做决定，只有转人工的申请才等核保员。这些门槛和模拟器用的完全一样。"],
    "scan-method": ["Agent 扫描实验室怎么给步骤分类", "历史里的每个人工任务步骤都会被打分，然后从上往下检查：第一个符合的类别胜出。出错率达到 5% 及以上的服务步骤，则标为集成问题。"]
  });
  Object.assign(Z.dg, {
    // 生命周期
    "Process lifecycle": "流程生命周期", "1. Model": "1. 建模", "draw the BPMN": "画出 BPMN", "2. Implement": "2. 实现", "services, tasks, rules": "服务、任务、规则",
    "3. Build & upload": "3. 构建并上传", "send to the server": "发送到服务器", "4. Execute": "4. 执行", "the engines run it": "由引擎运行",
    "5. Monitor": "5. 监控", "watch, resubmit": "查看、重新提交", "6. Optimize": "6. 优化", "KPIs, bottlenecks": "KPI、瓶颈",
    "7. Govern": "7. 治理", "versions, audit, retention": "版本、审计、保留", "improve and repeat": "改进，再来一轮",
    // 网关
    "BPMN gateways": "BPMN 网关", "Exclusive": "排他", "exactly one path": "只走一条路", "Reject": "拒绝", "Parallel": "并行",
    "all paths, then wait": "每条路都走，然后等齐", "Check credit": "查信用", "Check ID": "查身份", "Inclusive": "包容", "one or more paths": "一条或多条路",
    "Email": "邮件", "SMS": "短信", "Letter": "信函",
    // 泳道
    "Pool and lanes": "池和泳道", "Requester": "申请人", "System": "系统", "Submit": "提交",
    // 贷款
    "Loan process": "贷款流程", "Application received": "收到申请", "Fetch credit data (service)": "获取信用数据（服务）", "Rule: eligibility": "规则：资格",
    "score < 580 → decline; score ≥ 720 and": "信用分 < 580 → 拒绝；信用分 ≥ 720", "loan/income ≤ 35% → approve; else refer": "且贷款/收入 ≤ 35% → 批准；否则转人工",
    "Underwriter review": "核保员审核", "approve or decline": "批准或拒绝", "Send decision (service)": "发出决定（服务）",
    // 扫描方法
    "Scan method": "扫描方法", "Process history": "流程历史", "step rows, outcomes, times": "步骤记录、结果、时间", "Score each user-task step": "给每个人工任务步骤打分",
    "outcomes, repeat rate, work, wait": "结果、重复率、处理时间、等待时间", "Rule candidate (ODM)": "规则候选（ODM）", "same inputs → same outcome, ≥ 80%": "相同输入 → 相同结果，≥ 80%",
    "Agent candidate: rubber-stamp": "Agent 候选：盖章式", "one outcome ≥ 90%, work ≤ 15 min": "同一结果 ≥ 90%，处理 ≤ 15 分钟",
    "Agent candidate: triage + approve": "Agent 候选：分诊 + 批准", "wait ≥ 24 h, one outcome ≥ 70%": "等待 ≥ 24 小时，同一结果 ≥ 70%",
    "Keep human": "继续由人做", "none of the above": "以上都不是", "else": "否则"
  });
  Object.assign(Z.dgUi, { caseTitle: (n) => `${n}：流程图`, caseCap: "灰色：系统。蓝色：人。紫色：规则。黄色：AI agent。" });
})(window.ZH);
