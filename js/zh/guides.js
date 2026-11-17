// 简体中文：知识库、使用指南、动手实验、故障排查、速查卡、开课教学（#68 第二批）。
// 菜单路径（如 My webMethods → My Inbox）保留英文，和产品界面一致；来源标题保留英文原名，链接指向英文官方文档。
(function (Z) {
  Z.done = (Z.done || []).concat(["knowledge", "howto", "lab", "trouble", "teach"]);

  Object.assign(Z.page, {
    "kb.h2": "IBM webMethods BPMS 知识库",
    "kb.lead": "实际使用者需要知道的 IBM webMethods BPMS 运行机制：版本、Process Engine 和它的服务质量设置、执行历史、Task Engine、Business Rules，以及一份设计清单。每个主题都引用公开文档。",
    "ht.h2": "IBM webMethods BPMS 使用指南",
    "ht.lead": "给每天和产品打交道的人准备的分步指南。选你的身份。每份指南最后都告诉你怎么确认成功了，并附上官方文档链接。",
    "ht.src": "菜单路径按 Software AG / IBM 公开文档；不同版本的界面文字可能略有不同，所以保留英文原名，方便你在产品里对照。",
    "lab.h2": "动手实验：",
    "lab.reset": "重来",
    "lab.before": "开始之前",
    "lab.src": "请用开发环境，千万不要用生产环境。菜单名称按 Software AG / IBM 公开文档，不同版本可能略有不同。你的进度只保存在这个浏览器里。",
    "lab.stuck": "卡住了？常见的坑",
    "lab.noenv": "没有环境？在这里练",
    "lab.lvl": "进阶：",
    "tr.h2": "故障排查",
    "tr.lead": "有东西不正常？找到症状，先查可能的原因，再按办法修。每一条都链接到官方文档。",
    "tr.ph": "搜症状，比如「收件箱」「Hot Deploy」「重新提交」",
    "tr.aria": "搜索故障排查",
    "te.h2": "开课教学 <span class=\"pill\">作者观点</span>",
    "te.print": "课前要打印的",
    "te.tips": "讲师提示"
  });

  // ---------- 知识库 ----------
  Z.knowledge = {
    family: [
      ["Integration Server", "运行服务、适配器和 API 的运行时。Process Engine（WmPRT 包）就装在这里，规则项目也在这里执行。"],
      ["Designer", "基于 Eclipse 的开发工具，用来做 BPMN 流程、IS 服务、任务和业务规则。"],
      ["My webMethods Server (MWS)", "一个门户网站：任务收件箱、Monitor、管理功能，以及给业务分析师用的规则仓库。"],
      ["Process Engine", "在 Integration Server 里运行流程模型；把历史写进 Process Audit 数据库。"],
      ["Task Engine", "在 My webMethods Server 上运行人工任务：收件箱、分派、升级、审计、归档。"],
      ["Business Rules", "决策表、决策树和事件规则，在 Designer 里编写，部署到 Integration Server。"],
      ["Universal Messaging", "消息层，Process Engine 可以把它当作 JMS 提供方来传递流程中的步骤转移；Broker 已被弃用。"],
      ["Monitor / Optimize", "实例监控和重新提交；KPI 和业务活动监控。"],
      ["webMethods Hybrid Integration", "IBM 的混合控制平面和许可证，把 webMethods 的各个运行时和 IBM 其他集成产品放在一起；BPMS 仍然是这个环境里自己管理的运行时。"]
    ],
    topics: {
      releases: { title: "版本和生命周期",
        summary: "对今天大多数环境来说，有三个版本最重要：10.15（长期支持的本地部署版本）、11.1 和 12.1。",
        facts: [
          "webMethods 10.15 于 2022 年 10 月 18 日正式发布（GA）。",
          "10.15 的维护在 2027 年 10 月结束，支持在 2028 年 10 月结束；10.15 是最后一个支持 AIX 和 z/Linux 的版本。",
          "IBM webMethods 11.1 的发行说明于 2024 年 9 月发布，其中包含 IBM webMethods BPM 一节。",
          "IBM webMethods Integration 12.1 换成了基于 Java 21 和 Jakarta EE 10 的新运行时，增加了 FIPS 140-3 支持，也更容易在容器里运行。",
          "12.1 主要面向自己管理的、本地部署的、容器和混合部署；SaaS 则按 IBM 的持续交付模式更新。"
        ],
        practice: "在 2027 年 10 月之前尽早规划升级：盘点自定义 Java 服务、各个包和操作系统平台（AIX / z-Linux 环境不仅要换版本，还要换平台）。" },
      engine: { title: "Process Engine 运行机制和服务质量",
        summary: "Process Engine 在 Integration Server 里运行，用「转移文档」（transition document）在步骤之间传递工作，可以在本机传，也可以经过消息层。",
        facts: [
          "服务质量是一种取舍：流程运行时把数据持久化，换来可靠性、可见性和可控性；放在易失的内存里，换来速度。",
          "服务质量开到最高时，流程是「有保证」的：出故障后能在正确的步骤恢复，并一直跑到结束。",
          "性能开到最高时，服务器故障后流程可能无法恢复，而且在 Monitor 里看不到、也控制不了。",
          "这些设置按流程模型分别设定，所以每个流程都可以落在两个极端之间的任何位置。",
          "Optimize Locally（默认开）：相邻步骤在同一台 Integration Server 上运行时，不发布转移文档。",
          "Volatile Transition Documents（默认开）：转移文档只放在内存里；更快，尤其是 2 MB 及以上的文档，但步骤进行到一半时消息层出故障，就不会自动恢复。",
          "Volatile Tracking（默认关）：流程状态只放在内存里；更快，但步骤进行到一半时服务器出故障，状态就会丢失。",
          "Process Engine 可以用 Universal Messaging 作为 JMS 提供方（默认地址 nsp://localhost:9000）；webMethods Broker 已被弃用。"
        ],
        practice: "长时间运行、需要审计的流程（审批、理赔）用有保证的设置；易失设置只留给短小、量大、可以重放的流程。还要记住：Volatile Tracking 会让你在 Monitor 里看不到它。" },
      history: { title: "执行历史和审计",
        summary: "执行数据存在三个地方，其中只有两个是给你做分析用的。",
        facts: [
          "Process Engine 数据库保存引擎自己用的、实时的实例状态，不对外。",
          "Process Audit 数据库在 PRA_ 开头的表里（9.6 之前是 WM*）保存流程和步骤的状态、转移、记录的字段和错误；Monitor 读的就是它。",
          "具体写进去什么，取决于每个流程设置的日志级别（流程状态、步骤状态、转移、记录的字段）。",
          "在 10.15 里，任务状态默认不写进 Process Audit；任务历史要从 Task Engine 的审计（getTaskAudit）或任务归档里取。"
        ],
        practice: "一开始就定好日志级别和保留期限：它们决定了你将来能审计什么、能从中挖出哪些 agent 候选，以及多年后能向监管机构证明什么。" },
      tasks: { title: "Task Engine 和人的工作",
        summary: "流程里的人工任务，会变成 My webMethods Server 上 Task Engine 里的任务实例。",
        facts: [
          "任务出现在 My webMethods 的收件箱里；审计视图会显示对一个任务做过的每一个操作。",
          "Task Engine 的 Web 服务 getTaskAudit 返回一个任务实例的审计历史。",
          "任务实例可以归档到单独的数据源，用于长期审计。"
        ],
        practice: "设计任务时，把做决定所需的背景放在表单上，指定明确的负责角色，加上计时升级，并留一个记录结果的字段：以后的分析要的就是这个结果。" },
      rules: { title: "webMethods Business Rules",
        summary: "Business Rules 把决策逻辑从流程图里拿出来，这样改决策不用重新部署流程。",
        facts: [
          "规则项目（rule project）是一个容器，装着数据模型、规则集、决策实体和动作。",
          "决策实体包括决策表、决策树和事件规则；规则集把相关的决策实体放在一起。",
          "在决策表里，每一列是条件（IF）或结果（THEN），每一行是一条规则。",
          "规则动作分为 Data、Service 和 Process 三种；包含人工决定点的决策表必须设为 Process Aware。",
          "规则项目先在 Designer 里本地测试，然后导出并部署到作为运行时的 Integration Server，还可以通过 My webMethods Server 的仓库共享给业务分析师。"
        ],
        practice: "把门槛、资格和分派路线放进由业务部门负责的决策表；如果需要全企业范围的治理、版本管理和大规模测试，可以考虑 IBM ODM 决策服务。" },
      "rules-config": { title: "规则引擎配置和规则任务",
        summary: "怎样把 webMethods Business Rules 接进流程，并以保持灵活的方式部署它们。",
        facts: [
          "规则引擎运行在 Integration Server 上（WmBusinessRules 包）。默认情况下，规则在装了 Process Engine 的那台 Integration Server 上运行；要在另一台 Integration Server 上运行，就在 Integration Server Administrator 里建一个名为 businessrulesruntime 的远程服务器别名（Microservices Runtime 上则用配置变量）。",
          "在 Designer 里，把一个 Rule Task 放到流程画布上（或者从 Rules Explorer 里拖一条规则过来）。在 Properties → Implementation 里把 Rule Type 设为 Rule Set 或 Decision Entity，再选中对应的资产。",
          "把流程变量映射到规则输入，再把规则输出映射回流程变量。输出通常交给紧接着的排他网关使用。",
          "包含人工决定（Task Action）的决策表必须标为 Process Aware；要映射 TaskData，让任务的输入输出和表的一致，ProcessData 只做向外映射（绝不能覆盖或丢弃它）。",
          "要在流程里使用规则动作，把流程的 Minimum Logging Level 设为 5（流程及所有步骤）。",
          "事件规则需要目标 Integration Server 上有对应的 JMS 触发器。",
          "Hot Deploy 可以在 My webMethods 的 Business Rules 界面里或通过 Deployer，把规则项目推到一台或多台 Integration Server；事先要在 Administration > My webMethods > System Settings > webMethods Business Rules Settings 里配置好每台 Integration Server 的连接（主机、端口、用户、密码）。只改规则时，不需要重新构建流程模型。",
          "规则任务的高级属性（Process Developer 模式下）包括 Integration Server Name、Allow Parallel Execution 和 Compensating 标记。"
        ],
        practice: "把规则输出设计成清楚的枚举值（APPROVE / REFER / REJECT）。生产环境中把规则引擎放在专用的、或者可以横向扩展的 IS 节点上。把流程审计（走了哪条路、花了多久）和规则决策日志（输入和结果）结合起来，才能把决定完整地解释清楚。" },
      monitor: { title: "Monitor、重新提交和 Optimize",
        summary: "Monitor 是运维查找、修复、重跑流程实例的地方；Optimize for Process 在它之上加了 KPI 和分析。",
        facts: [
          "Monitor 在 My webMethods 里：Navigate > Applications > Monitoring。流程实例在 Monitoring > Business > Process Instances 下面。",
          "失败的实例可以从任何一个失败的步骤重新提交。已完成的实例，只能从实例开始执行之前就已设为可重新提交的步骤重新提交。",
          "重新提交之前，你可以修改某一步的 pipeline 数据，如果失败是坏数据引起的，这很有用。只有由 webMethods 执行的流程才能重新提交。",
          "Resubmit Closest：如果失败的步骤可以重新提交，就从它重跑，否则从它之前、离它最近的可重新提交且已经跑过的步骤重跑；Resubmit Earliest：从第一个可重新提交的步骤开始重跑这个实例余下的部分。",
          "Monitor 里的操作需要 My webMethods Server 管理员授予功能权限，比如 Business Monitoring > Resubmit 和 Business Monitoring > Modify and Resubmit。",
          "Optimize for Process 自带 KPI，开发人员还可以加自定义 KPI；KPI 可以把业务数据和流程、步骤指标结合起来，比如「按客户统计的流程周期时间」。",
          "Process Analytics 页面（Monitoring > Business > Process Analytics）分析当天或前一天的流程活动。"
        ],
        practice: "上线之前就决定哪些步骤必须能重跑，并把它们设为可重新提交：已经在跑的实例没法再补加。Modify and Resubmit 权限要少给，因为它会改动线上数据。" },
      upgrade: { title: "从 10.15 升级",
        summary: "10.15 在 2027 年 10 月维护结束。升级的做法是并排安装新版本，然后迁移数据库、配置和流程模型。",
        facts: [
          "webMethods 10.15 的升级指南说明，它适用于 10.15 迁移框架及之后的所有版本；请查阅目标版本的指南，看看有没有变化。",
          "先安装新版本，用 Database Component Configurator 迁移数据库组件，再用迁移工具或 Command Central 迁移产品配置、数据和资产。",
          "如果想在新环境里把进行中的实例跑完，或者重新提交已完成、已失败的实例，就要迁移 ProcessEngine 和 ProcessAudit 两个数据库组件。",
          "对于还有实例在跑的流程模型，在新版 Designer 里重新生成之前，先把它的版本号调高；在 My webMethods 里启用新版本时，如果问你要不要升级正在运行的流程，回答 No。",
          "迁移完成后，把 ProcessEngine 和 ProcessAudit 功能连到它们的数据库组件（Integration Server Administrator > Settings > JDBC Pools），重新加载 WmMonitor 包，并确认所有 webMethods Messaging 触发器都启用了文档获取。"
        ],
        practice: "先在生产环境的副本上演练。盘点正在进行中的实例，决定哪些必须在旧版本上跑完；规则项目、任务应用和 Monitor 权限要和流程模型一起规划。" },
      checklist: { title: "实践者的设计清单",
        summary: "十条检查，都来自产品真实的运行方式。",
        facts: [
          "先把顺利的主路径画出来；只把例外交给人。",
          "每一个可能变化的门槛都放进规则，绝不写在网关条件里。",
          "按流程选服务质量：需要审计的工作用有保证的设置，只有可以重放的流程才用易失设置。",
          "打开步骤日志，并记录将来解释结果时需要的决策字段。",
          "把任务结果作为数据记下来，而不只是「任务已完成」。",
          "每一个有 SLA 的人工任务，都要加计时器和升级。",
          "上线之前就规划好审计的保留和归档。",
          "让服务步骤具有幂等性，这样失败的步骤可以安全地重新提交。",
          "流程和规则项目一起管理版本，一起测试。",
          "对 agent：让它提议，让规则决定，把转人工的事交给人，并记录规则版本。"
        ],
        practice: "在设计评审和升级之前，都用这份清单过一遍。" }
    },
    ui: { comp: "组件", what: "在 BPMS 方案里做什么", sources: "来源：", practice: "实践建议：", synth: "以上主题的归纳；作者的实践观点。",
      reviewed: "最近一次对照来源核对：", dg: "示意图：" }
  };

  // ---------- 使用指南 ----------
  Z.howto = {
    roles: {
      user: { role: "业务用户", title: "在 My webMethods 里处理你的任务",
        who: "审批人、个案处理人员、核保员：任何会从流程里收到人工任务的人。",
        steps: [
          ["打开 My Inbox", "登录 My webMethods，打开 My Inbox。这里列出分配给你的所有任务，包括直接分给你的，以及通过你所在的角色或组分给你的。"],
          ["找到任务", "用 Inbox Search 面板筛选（比如按任务类型或日期），然后打开任务，查看它的详情和数据。"],
          ["接受任务", "点 Accept，任务就归你了。发给一个组的任务会出现在每个成员的收件箱里；一旦有人接受，其他人就不能再接。有些任务类型在你打开时会自动接受。"],
          ["处理工作", "填好任务的数据字段。Submit 只保存修改、不结束任务；Complete 保存并把任务标为 Completed，流程才能继续。"],
          ["处理不了？转交", "在收件箱里把任务转交（Delegate）给同事。每次转交都会记进审计日志，同事要先接受才能处理。"]
        ],
        check: "任务显示 Completed，流程走到下一步。任务的审计视图里能看到谁接受、谁转交、谁完成了它。",
        tip: "把结果记在任务的数据字段里，而不是写在评论里。这样以后才能做报表和自动化。" },
      dev: { role: "流程开发人员", title: "建模、构建并启用一个流程",
        who: "在 Software AG Designer 里搭流程的开发人员和架构师。",
        steps: [
          ["切到 Process Developer 模式", "只有在 Designer 的 Process Developer 模式下，才能构建流程并上传到服务器执行。"],
          ["画出流程", "画 BPMN：开始事件、活动、网关和泳道。为每个活动选择它怎么运行：一个 Integration Server 服务、一个人工任务，或者一个调用 webMethods Business Rules 规则集或决策实体的规则任务。"],
          ["设置日志和服务质量", "决定 Process Engine 记录什么、怎样传递工作。用到规则动作的流程，日志级别必须是「5 - Process and all steps」。服务质量的设置见知识库。"],
          ["构建并上传", "Build and Upload，上传以便执行。Designer 会在 Integration Server 上生成运行时元素（步骤、触发器、转移条件），并更新映射服务。"],
          ["启用执行", "默认情况下，新上传的版本不会自动启用。在 My webMethods 里启用这个版本（勾选 Execution Enabled，再点 Save），或者在 Designer 里设置「构建后自动启用」。同一个模型一次只能启用一个版本。"],
          ["跑一次测试", "启动一个实例（比如发送它的启动文档），然后在 Monitor 里跟踪它。"]
        ],
        check: "实例出现在 Process Instances 里并走到 Completed，每一步的状态都有记录。",
        tip: "把门槛放在规则里，不要写在网关条件里，这样业务人员改它就不用重新构建。" },
      analyst: { role: "业务分析师", title: "安全地修改一条业务规则",
        who: "上线后维护决策表的分析师和政策负责人。",
        steps: [
          ["拿到规则项目", "规则项目在 Designer 里创建，再导出到 My webMethods Server 的仓库。有权限的用户就可以在浏览器里修改。"],
          ["打开并锁定", "在 Business Rules 界面里打开决策表，并把它锁定，免得别人同时修改。"],
          ["修改决策表", "修改运算符和数值、调整规则顺序，或者设一个「生效」日期，让新政策从指定的那天开始。"],
          ["保存并校验", "保存。部署前，系统会检查规则项目里有没有空白、重叠、缺失和冗余的规则；把它报出的错误都改掉。"],
          ["Hot Deploy", "点 Hot Deploy，把整个规则项目推到 Integration Server。有未保存的修改或有错误时，这个按钮是灰的。流程模型本身不变。"]
        ],
        check: "Hot Deployment Results 对话框显示成功，下一个流程实例就会用新规则做决定。",
        tip: "部署前，先配置好到 Integration Server 的管理员连接：Administration → My webMethods → System Settings → webMethods Business Rules Settings → Add Integration Server。" },
      ops: { role: "运维", title: "监控、修复、重新提交",
        who: "让流程保持健康的支持和运维团队。",
        steps: [
          ["找实例", "打开 Process Instances，查看实例和它们的步骤，可以按流程、状态或时间搜索。"],
          ["打开有问题的实例", "在 Process Instance Detail 页面可以 Stop（停止）、Suspend（暂停）或 Resume（恢复）。除了 Completed、Failed、Failed (Escalated) 和 Stopped 状态的实例，其他实例都可以暂停。"],
          ["修好后重新提交", "Resubmit 用来修复并重跑失败的实例。如果失败的步骤可以重新提交，实例就从那里继续；否则从它之前最近的、可重新提交且已经跑过的步骤继续。需要的话，先修改 pipeline 数据，再 Resubmit。"],
          ["疏通卡住的任务", "有人不在时，用 Task List Management 把任务转交或重新分派。"],
          ["检查权限", "停止 / 暂停 / 恢复、重新提交、修改后重新提交，是三种不同的功能权限，由 My webMethods 管理员授予。"]
        ],
        check: "实例回到 Running 或 Completed，你做的控制操作（暂停、恢复、重新提交、停止）出现在实例的历史里。",
        tip: "把服务步骤设计成跑两遍也没问题（幂等），这样重新提交永远不会重复付款或重复下单。" }
    },
    demo: [
      ["先讲问题", "从这里开始 → 第 1 步，在「没有 BPMS」和「有 BPMS」之间切换。", "申请会丢，事后谁也说不清一个决定是怎么做的。BPMS 让每个申请都在轨道上运行，并留下记录。", "我们到底为什么需要一个流程平台？"],
      ["说清谁管什么", "从这里开始 → 第 2 步，分两三项工作。", "流程推动工作，规则做决定，人处理例外，agent 负责阅读和提议。", "AI 放在哪里，才不会失去控制？"],
      ["让 agent 变安全", "从这里开始 → 第 3 步，拖动自动批准上限，给对方看日志。", "政策一改，结果就跟着变，而且规则版本被记录下来。这正是审计人员和监管机构要看的。", "我们能让 AI 处理钱或客户的事吗？"],
      ["跑一个真流程", "模拟器 → 开始、下一步，批准核保员的任务。", "每一步都写下审计历史：就是你以后的报表和 agent 分析要用的那些表。", "它跑起来是什么样子？"],
      ["展示深度", "知识库 → Process Engine 服务质量，再看 Business Rules。", "每一项设置都有文档、有出处，连它在取舍什么都写清楚了。", "它够不够成熟，能不能承载我们的关键流程？"],
      ["展示日常使用", "使用指南 → 业务分析师。", "业务分析师改一条规则，然后 Hot Deploy，不需要开发人员重新构建流程。", "业务改一条政策能有多快？"]
    ],
    ui: { demoTab: "给客户演示（10 分钟）", demoH: "客户演示脚本 <span class=\"pill\">作者观点</span>",
      demoLead: "六个节拍，大约十分钟。点那一步，说那句话，你就回答了客户心里真正想问的问题。", say: "这样说：", answers: "回答的问题：",
      source: "来源：", worked: "看到这些就说明成功了：", tip: "提示：" }
  };

  // ---------- 动手实验 ----------
  Z.lab = {
    title: "30 分钟做出你的第一个流程",
    scenario: "搭一个小小的采购审批流程。一个申请进来，审批人在 My webMethods 里接受，然后批准或拒绝，你在 Monitor 里跟踪这个实例。",
    flow: ["收到申请（消息开始事件）", "审批申请（人工任务）", "批准了吗？（排他网关）", "已批准 / 已拒绝（结束事件）"],
    prereqs: [
      "装有 webMethods BPM 流程开发功能的 Software AG Designer",
      "一台装了 Process Engine 的 Integration Server，以及一台装了 Task Engine 的 My webMethods Server（开发环境，千万不要用生产环境）",
      "一个可发布的 Integration Server 文档类型，用来表示申请，比如包含 id、amount 和 requester 的 PurchaseRequest",
      "一个 My webMethods 用户或角色，用来当审批人"
    ],
    stages: {
      create: { t: "创建项目和流程", steps: ["创建一个流程项目（Process Project）。", "在里面创建一个名为 PurchaseApproval 的流程。名字不要以「wm」开头，结尾也不要有空格。"],
        check: "新流程打开时是一张空白画布，项目出现在 Solutions 视图里（看不到就刷新一下视图）。" },
      start: { t: "用一个文档启动流程", steps: ["加一个消息开始事件。把 Receive Protocol 设为 Subscription（用于可发布的文档）。", "把 Receive Document 设为你的 PurchaseRequest 文档类型。把文档类型直接拖到这一步上，就会自动填好。"],
        check: "开始事件显示 PurchaseRequest 是它的接收文档。" },
      task: { t: "加上审批任务", steps: ["加一个活动，把标签改成「Approve request」。标签会变成任务类型的名字，所以要独一无二。", "把它实现为一个人工任务。", "把任务分给你的审批人用户或角色，并在任务的业务数据里加一个决定字段（APPROVE 或 REJECT）。"],
        check: "这一步显示人工任务图标，任务类型出现在 Solutions 视图里。" },
      route: { t: "按决定分路", steps: ["在任务后面加一个排他网关，再加两个结束事件：Approved 和 Rejected。", "在每条出去的转移上设一个条件，检查任务的决定字段。"],
        check: "从开始事件出发的每一条路都能走到一个结束事件。" },
      build: { t: "构建、上传并启用", steps: ["切到 Process Developer 模式，然后构建并上传流程以便执行。", "Designer 提示时，把任务类型部署到 Task Engine。默认设置就是「提示」。", "启用新版本以便执行。新上传的版本默认不启用。"],
        check: "构建报告（Build Report）没有错误，版本显示为 Execution Enabled。" },
      run: { t: "启动一个实例", steps: ["发布一个 PurchaseRequest 文档，比如用一个小的测试 flow 服务。它的订阅触发器会启动一个新的流程实例。"],
        check: "几秒钟内，审批人的 My Inbox 里就会出现一个「Approve request」任务。" },
      work: { t: "以审批人的身份处理任务", steps: ["用审批人账号登录，打开任务并 Accept。", "把决定设为 APPROVE，点 Complete。流程拿到任务结果，继续往下走。"],
        check: "任务从待处理收件箱里消失，显示为 Completed。" },
      watch: { t: "在 Monitor 里跟踪实例", steps: ["找到你的实例，打开详情，查看每一步的状态。"],
        check: "实例状态是 Completed，路径经过 Approve request 走到了 Approved。" }
    },
    pitfalls: [
      ["流程一直不启动", "版本没有启用执行，或者发布的文档不是开始事件的接收文档。"],
      ["审批人的收件箱里没有任务", "任务类型没有部署，或者分给了别的用户或角色。"],
      ["出现两个同名任务", "沿用默认标签的步骤会生成重复的任务类型名；给每个步骤起一个唯一的标签。"],
      ["Monitor 里看不到实例", "日志级别太低，或者打开了 Volatile Tracking（见知识库 → Process Engine）。"],
      ["某一步失败了", "修好原因，然后在 Monitor 里重新提交（见使用指南 → 运维）。"]
    ],
    practice: [
      ["模拟器", "simulator", "跑一遍贷款流程：它走的是同样的模式：开始、规则、人工任务、网关、结束，并且会写审计日志。"],
      ["使用指南", "howto", "读一读「业务用户」和「流程开发人员」两份指南，看看每个阶段在日常工作里是什么样子。"]
    ],
    levelup: "下一步，用一张决策表代替审批人对小额申请的判断：低于上限自动批准，超过的转人工。然后用 Hot Deploy 修改上限（使用指南 → 业务分析师），不需要重新构建流程。",
    ui: { min: "分钟", checkpoint: "检查点：", source: "来源：", symptom: "症状", cause: "可能的原因和办法",
      count: (n, m) => `已完成 ${n} / ${m} 步`, complete: "：实验完成！" }
  };

  // ---------- 故障排查、速查卡、开课教学 ----------
  Z.support = {
    areaNames: { All: "全部", "Start and deploy": "启动和部署", Tasks: "任务", Rules: "规则", "Monitor and operations": "监控和运维" },
    trouble: [
      { s: "流程已经构建并上传，但从来没有启动过实例。",
        check: ["这个版本启用执行了吗？新上传的版本默认不启用，而且同一个模型一次只能启用一个版本。", "发布的文档是开始事件的接收文档吗？"],
        fix: "启用这个版本，或者把 Designer 设成每次构建后自动启用。然后发布正确的启动文档。" },
      { s: "在 Designer 里找不到 Build and Upload。",
        check: ["只有在 Process Developer 模式下，才能构建并上传以便执行。"],
        fix: "切换到 Process Developer 模式再试。" },
      { s: "我上传了新版本，但正在跑的实例还在用旧版本。",
        check: ["启用新版本会停用之前启用的那个。新实例用新版本；正在跑的实例保持原来的版本，除非你升级它们。"],
        fix: "启用新版本时，如果对你的流程是安全的，可以选择升级正在运行的实例。" },
      { s: "实现任务之后，出现奇怪的命名错误或重复的任务名。",
        check: ["流程名不应该以「wm」开头，结尾也不应该有空格。", "人工任务步骤的标签会变成任务类型的名字，所以沿用默认标签会产生重复。"],
        fix: "给流程改名，并在实现之前给每个人工任务步骤起一个唯一的标签。" },
      { s: "提示「You cannot accept this task.」（你不能接受这个任务）",
        check: ["很可能已经有别人接受了。默认情况下，一个任务只能由一个人接受。"],
        fix: "打开任务的 Details View，看看是谁接受的；如果它应该归你，请对方释放（Release）它。" },
      { s: "我转交了一个任务，但同事没法处理它。",
        check: ["转交不会改变接受人：如果你之前接受了它，它仍然是你的。", "同事需要有这个任务类型的访问权限和功能权限。"],
        fix: "释放任务，让同事可以接受它；并请管理员检查任务的访问权限。" },
      { s: "任务没有出现在应该收到它的人的收件箱里。",
        check: ["看看它分给了谁：一个用户、一个组还是一个角色。分给组和角色的任务会出现在每个成员的收件箱里。", "任务类型有没有随流程一起部署？"],
        fix: "改正分派对象，或者部署任务类型后重新构建。", where: "任务编辑器 → 分派；Build and Upload" },
      { s: "Process Audit 表里没有任务历史。",
        check: ["在 10.15 里，任务状态默认不写进 Process Audit。"],
        fix: "从 Task Engine 的审计（getTaskAudit）或任务归档里读取任务历史，或者打开任务日志。", where: "Task Engine 审计 / 归档" },
      { s: "Hot Deploy 按钮是灰的。",
        check: ["决策实体有未保存的修改或有错误时，Hot Deploy 是不可用的。"],
        fix: "保存，运行校验，把它列出的错误都改掉，再部署。" },
      { s: "Hot Deploy 时没有可以部署的 Integration Server。",
        check: ["管理员必须先在 My webMethods 里配置好 Integration Server 连接。"],
        fix: "在 webMethods Business Rules Settings 下添加 Integration Server（每个集群加一台就够了）。" },
      { s: "规则任务里的事件规则从来没有触发。",
        check: ["规则任务里的事件规则，需要对应的 Integration Server 上有 JMS 触发器。"],
        fix: "在那台服务器上创建或启用 JMS 触发器。", where: "Integration Server → JMS 触发器" },
      { s: "用到规则动作的流程，表现和设计的不一样。",
        check: ["用到规则动作的流程，日志级别必须是「5 - Process and all steps」。", "包含人工决定的决策表必须设为 Process Aware。"],
        fix: "调高日志级别；如果决策表会启动任务，就把它重新建成 Process Aware。", where: "流程属性；决策表设置" },
      { s: "我在 Monitor 里看不到某个实例，或者看不到它的步骤详情。",
        check: ["Volatile Tracking 只把状态放在内存里，所以 Monitor 看不到这个实例。", "日志级别可能太低。"],
        fix: "对需要监控的流程，关掉 Volatile Tracking、调高日志级别，然后重新构建。", where: "流程属性 → 服务质量和日志" },
      { s: "Suspend、Resubmit 或 Stop 按钮不见了。",
        check: ["停止 / 暂停 / 恢复、重新提交、修改后重新提交，是三种不同的功能权限。"],
        fix: "请 My webMethods 管理员授予这些权限。" },
      { s: "某个实例不能暂停（Suspend）。",
        check: ["Completed、Failed、Failed (Escalated) 和 Stopped 状态的实例不能暂停。"],
        fix: "对于失败的实例，应该修好原因后重新提交。" },
      { s: "重新提交后，实例从一个出乎我意料的步骤重新开始。",
        check: ["如果失败的步骤不可重新提交，实例会从它之前最近的、可重新提交且已经跑过的步骤继续。", "如果没有任何步骤可重新提交，「Resubmit Earliest」什么也不会做。"],
        fix: "在设计时就把幂等的步骤设为可重新提交，并从正确的步骤重新提交。" }
    ],
    cheats: {
      user: { role: "业务用户",
        actions: [["看我的工作", "My webMethods → My Inbox"], ["接一个任务", "Task → Accept"], ["保存但不结束", "Task → Submit"], ["做完了", "Task → Complete"], ["交给别人", "My Inbox → Delegate（如果你已经接受了，先释放）"]],
        rules: ["先接受再处理，免得重复做。", "把结果记在任务字段里，不要写在评论里。", "转交一个已接受的任务时，记得释放它。"],
        check: [
          { q: "分给你所在组的任务，谁能看到？", a: ["只有组长", "每个成员都能看到，直到有人接受", "在分派之前谁都看不到"], c: 1, e: "分给组和角色的任务会出现在每个成员的收件箱里；一旦有人接受，其他人就不能再接。" },
          { q: "Submit 做什么？", a: ["完成任务", "保存数据但不完成", "删除任务"], c: 1, e: "Submit 更新任务数据但不改变状态；Complete 才把它标为 Completed。" },
          { q: "你转交了一个自己已经接受的任务。同事能接受它吗？", a: ["能，马上就能", "要等你释放之后", "永远不能"], c: 1, e: "转交不会改变接受人；释放任务，被转交的人才能接受。" }
        ] },
      dev: { role: "流程开发人员",
        actions: [["新建流程", "Designer → File → New → Process"], ["做一个人工任务", "Step → Create Implementation → New Task"], ["用文档启动", "Message start event → Receive Document"], ["构建", "Process Developer 模式 → Build and Upload"], ["打开开关", "My webMethods → Administration → Business → Business Processes → Execution Enabled"]],
        rules: ["实现之前，先给每个人工任务步骤起一个唯一的标签。", "门槛放在规则里，不要写在网关条件里。", "每次上传后都要启用版本。"],
        check: [
          { q: "在哪里能用 Build and Upload？", a: ["Designer 的任何模式下", "只有 Process Developer 模式下", "只有在 My webMethods 里"], c: 1, e: "构建并上传以便执行，需要 Process Developer 模式。" },
          { q: "一个流程模型同时能启用几个版本？", a: ["一个", "两个", "不限"], c: 0, e: "启用新版本会停用之前启用的那个。" },
          { q: "从一个步骤新建任务时，什么会变成任务类型的名字？", a: ["一个随机 ID", "这个步骤的标签", "流程名"], c: 1, e: "Designer 用步骤的标签当任务类型名，所以先给每个步骤起一个唯一的标签。" }
        ] },
      analyst: { role: "业务分析师",
        actions: [["找到规则", "My webMethods → Business Rules → 决策实体"], ["不让别人同时改", "Decision Entity Editor → Lock"], ["定好政策生效日", "Decision Entity Editor → In effect"], ["检查质量", "Verify rule project"], ["上线", "Decision Entity Editor → Hot Deploy"]],
        rules: ["改之前先锁定，改完再解锁。", "部署前把所有校验错误都改掉。", "有生效日期的政策变化，用「In effect」日期。"],
        check: [
          { q: "Hot Deploy 为什么是灰的？", a: ["今天是周末", "有未保存的修改或有错误", "有流程正在运行"], c: 1, e: "决策实体有未保存的修改或有错误时，Hot Deploy 不可用。" },
          { q: "校验在找什么？", a: ["拼写", "空白、重叠、缺失和冗余的规则", "性能"], c: 1, e: "校验会检查规则项目里有没有空白、重叠、缺失和冗余的规则。" },
          { q: "改规则需要重新构建流程吗？", a: ["需要，每次都要", "不需要：Hot Deploy 规则项目就行", "只有周一需要"], c: 1, e: "Hot Deploy 把规则项目推到 Integration Server；流程模型保持不变。" }
        ] },
      ops: { role: "运维",
        actions: [["找实例", "My webMethods → Monitoring → Business → Process Instances"], ["暂停或停止", "Process Instance Detail → Suspend / Resume / Stop"], ["修好后重跑", "Process Step Detail → Resubmit"], ["疏通任务", "Monitoring → Business → Tasks → Task List Management"], ["申请权限", "Administration → System-Wide → Permissions Management"]],
        rules: ["先修好原因，再重新提交。", "只重新提交跑两遍也安全的步骤。", "每个控制操作都有记录，所以写下你为什么这么做。"],
        check: [
          { q: "哪种实例不能暂停？", a: ["正在运行的", "已完成的", "在等任务的"], c: 1, e: "Completed、Failed、Failed (Escalated) 和 Stopped 状态的实例不能暂停。" },
          { q: "失败的步骤不可重新提交。重新提交会从哪里开始？", a: ["从头开始", "从之前最近的、可重新提交且已经跑过的步骤", "哪里都不会"], c: 1, e: "Monitor 会从之前执行过的、最近的可重新提交步骤继续。" },
          { q: "Resubmit 按钮不见了。为什么？", a: ["浏览器缓存", "你没有 Resubmit 功能权限", "流程太老了"], c: 1, e: "Resubmit 是单独的功能权限，由 My webMethods 管理员授予。" }
        ] }
    },
    klass: {
      title: "半天工作坊：从零到跑起你的第一个流程",
      audience: "6 到 20 人：新用户、开发人员，或者一个客户团队。每人需要一台笔记本电脑；做实验的人还需要开发环境。",
      agenda: [
        ["0:00", 20, "为什么需要流程平台，为什么是现在", "start", "一起做第 1 到 3 步；在「谁管什么」小游戏里投票。"],
        ["0:20", 25, "IBM webMethods 一览", "overview", "讲一遍产品家族表，再看架构。"],
        ["0:45", 25, "它真实的运行方式", "knowledge", "讲 Process Engine 的服务质量和 Business Rules；问大家「换成你的流程，你会怎么选？」"],
        ["1:10", 15, "一起跑一个流程", "simulator", "用投影仪跑贷款模拟器；把审计日志念出来。"],
        ["1:25", 10, "休息", "", ""],
        ["1:35", 60, "动手实验", "lab", "两人一组按 8 个阶段做；讲师拿着「常见的坑」表在教室里巡视。"],
        ["2:35", 15, "按身份看日常使用", "howto", "每组选一份身份指南，分享一个技巧。"],
        ["2:50", 10, "自测和收尾", "quiz", "做身份自测或测验；发放速查卡。"]
      ],
      print: ["阅读版 → 第 7 章实验单（每组一份）", "每人一张身份速查卡（使用指南 → 速查卡 → 打印）", "给讲师的故障排查表"],
      tips: [
        "问每个团队他们实际在跑哪个流程，整个上午都用它当例子。",
        "给客户讲时，用 10 分钟演示脚本开场，知识库讲得比实验更久一些。",
        "没有环境？用模拟器代替实验，再拿实验单在纸上走一遍。",
        "要讲清楚：这是一门独立课程，不是 IBM 官方培训。"
      ]
    },
    ui: { shown: (n, m) => `显示 ${n} / ${m} 个问题`, checkFirst: "先查这些", fix: "解决办法：", source: "来源：",
      none: "没有找到。换个词试试，或者<a href=\"https://github.com/Xudaniel/webmethods-bpms-academy/issues/new\" target=\"_blank\" rel=\"noopener\">请我们加一条</a>。",
      cheat: (r) => `${r}速查卡`, golden: "黄金法则", printBtn: "打印这张速查卡", checkYou: (r) => `自测：${r}`, right: "答对了。", notQuite: "还差一点。",
      byline: "IBM webMethods BPMS 学院 · 作者 Daniel Yuanpeng Xu· xudaniel.github.io/webmethods-bpms-academy · 独立课程，与 IBM 无隶属关系",
      time: "时间", min: "分钟", module: "模块", how: "怎么上", total: "分钟合计" }
  };

  // ---------- 本批示意图 ----------
  Object.assign(Z.dgCap, {
    "rule-task-hot-deploy": ["用 Hot Deploy 修改一条规则", "在 Designer 里做好的规则项目被导出到 My webMethods Server 仓库；分析师在浏览器里编辑、校验，然后 Hot Deploy 到 Integration Server 上的规则引擎。流程模型保持不变。"],
    "instance-states": ["流程实例的状态和运维操作", "运维在 Monitor 里暂停、恢复、停止和重新提交实例。Completed、Failed、Failed (Escalated) 和 Stopped 的实例不能暂停；失败的实例应该修好后重新提交。"],
    "lab-process": ["实验里的采购审批流程（BPMN）", "消息开始事件 → 人工任务 → 排他网关 → 两个结束事件。蓝色令牌表示一个申请走了「已批准」这条路。"],
    "trouble-flow": ["排查流程图：流程不启动", "按顺序查三个常见原因：构建、启用执行、启动文档。"],
    qos: ["服务质量：要「有保证」还是要「快」？", "切换 Process Engine 的三个设置。默认值：Optimize Locally 开，Volatile Transition Documents 开，Volatile Tracking 关。"]
  });
  Object.assign(Z.dg, {
    // Hot Deploy
    "Hot Deploy path for a business rule": "业务规则的 Hot Deploy 路径", "rule project": "规则项目", "export": "导出", "repository": "仓库",
    "edit in the browser": "在浏览器里编辑", "Business Rules UI": "Business Rules 界面", "lock · edit table · verify": "锁定 · 编辑表 · 校验",
    "Rules Engine on Integration Server": "Integration Server 上的规则引擎", "(WmBusinessRules package)": "（WmBusinessRules 包）",
    "rule task calls": "规则任务调用", "Running process": "运行中的流程", "model unchanged": "模型不变",
    // 实例状态
    "Process instance states": "流程实例状态", "Running": "运行中", "Suspend": "暂停", "done": "完成", "step fails": "步骤失败",
    "Suspended": "已暂停", "Failed": "已失败", "Resume": "恢复", "fix + Resubmit": "修复 + 重新提交", "Stop": "停止", "Stopped": "已停止",
    "Stop also works on a running instance.": "运行中的实例也可以直接停止。", "Completed, failed or stopped: no suspend.": "已完成、已失败或已停止的：不能暂停。",
    // 实验流程
    "Purchase approval process": "采购审批流程", "Request": "申请", "received": "已收到", "Approve": "批准", "user task": "人工任务",
    "Approved?": "批准了吗？", "yes": "是", "no": "否", "Approved": "已批准", "Rejected": "已拒绝",
    // 排查流程图
    "Process won't start flowchart": "流程不启动排查图", "Built and uploaded": "构建并上传", "without errors?": "没有错误吗？",
    "Process Developer": "Process Developer", "mode → Build": "模式 → Build", "and Upload": "and Upload", "Version Execution": "这个版本启用了",
    "Enabled?": "Execution Enabled 吗？", "Enable it in": "在 My webMethods", "My webMethods": "里启用它", "→ Save": "→ Save",
    "Published the start": "发布的是开始事件的", "event's receive document?": "接收文档吗？", "Publish the": "发布", "right document": "正确的文档",
    "An instance should start —": "应该会启动一个实例：", "follow it in Monitor → Process Instances": "在 Monitor → Process Instances 里跟踪它",
    "Still nothing? Check logging level and volatile tracking.": "还是没有？检查日志级别和 Volatile Tracking。",
    // 服务质量
    "More guaranteed": "更有保证", "Faster": "更快", "you": "你", "Defaults shown. Per process model; see the sources in this topic.": "显示的是默认值。按流程模型分别设置；出处见本主题的来源。",
    "Not visible in Monitor; status lost if a server fails mid-step.": "在 Monitor 里看不到；步骤进行中服务器出故障，状态会丢失。",
    "Visible and controllable in Monitor.": "在 Monitor 里可见、可控。",
    "If messaging fails mid-step, no automatic recovery.": "步骤进行中消息层出故障，不会自动恢复。",
    "Transition documents persisted; recovers after messaging failures.": "转移文档已持久化；消息层故障后能恢复。",
    "Adjacent steps on one server skip the messaging round-trip.": "同一台服务器上的相邻步骤，省去经过消息层的来回。",
    "Every transition goes through messaging: slower, more traffic.": "每次转移都经过消息层：更慢，流量更大。",
    "Maximum quality of service: guaranteed, recoverable, fully visible.": "最高服务质量：有保证、可恢复、完全可见。",
    "Maximum speed: use only for short, replayable flows.": "最快速度：只用于短小、可重放的流程。",
    "Fast, but blind in Monitor: think twice for auditable work.": "快，但在 Monitor 里看不见：需要审计的工作要三思。",
    "Balanced: the default trade-off.": "平衡：默认的取舍。"
  });
  Object.assign(Z.dgUi = Z.dgUi || {}, { flow: "展开流程图：流程不启动", timeline: "工作坊时间轴。", tlCap: (t) => `共 ${t} 分钟；动手实验占了上午的三分之一。` });
})(window.ZH);
