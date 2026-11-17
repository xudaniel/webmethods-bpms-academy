// 简体中文：「从这里开始」的六个小步骤、10 分钟速成、基础 101，以及这些地方用到的示意图（#68 第一批）。
(function (Z) {
  // ---------- 从这里开始：六个动手小步骤 ----------
  Z.explainer = {
    story: {
      without: [
        "邮件发到一个公共邮箱",
        "有人把它转给经理",
        "经理在休假，没人发现",
        "5 天后客户来催",
        "审批结果在一条聊天消息里，没人记得为什么批"
      ],
      with: [
        "申请启动一个流程实例",
        "规则检查金额，选出审批人",
        "任务带着全部背景信息进入审批人的收件箱",
        "48 小时没处理，计时器自动升级给代理人",
        "决定、审批人和理由都记在审计记录里"
      ]
    },
    storyWith: "同一个申请，但工作被分派、计时、由规则决定，并且留下记录。这就是 BPMS 做的事。",
    storyWithout: "每一步都靠有人记得。什么都没有度量，事后什么都解释不清。",
    sort: [
      { item: "把一份采购申请送到对的审批人那里", owner: "process", why: "按顺序在系统和人之间推动工作，这就是编排。" },
      { item: "判断一笔 4,800 美元的申请需不需要总监批准", owner: "rules", why: "每个预算周期都会变的门槛，应该放在规则里，而不是画在流程图上。" },
      { item: "读一份 12 页的损失报告，写出理赔摘要", owner: "agent", why: "阅读非结构化文档、起草文字，正是 agent 的强项。" },
      { item: "给一位老客户批一笔不寻常的退款", owner: "people", why: "少见又需要高度判断的情况，留给人来处理。" },
      { item: "一个任务等了超过 48 小时，把它升级", owner: "process", why: "计时器和升级是流程引擎自带的能力。" },
      { item: "按信用分门槛审核一份贷款申请", owner: "rules", why: "受监管的决定必须可重复、可解释。" },
      { item: "货运延误后，提议给客户哪种补偿", owner: "agent", why: "Agent 可以提议，但决定仍由规则或人来做。" },
      { item: "签批一个规则转出来的决定", owner: "people", why: "转人工的设计目的，就是让它到达一个人手里。" }
    ],
    owners: { process: "流程", rules: "规则", agent: "Agent", people: "人" },
    guardCases: [
      { id: "A", desc: "延误 6 小时 · 普通客户", delay: 6, amount: 120, tier: "standard" },
      { id: "B", desc: "延误 30 小时 · 普通客户", delay: 30, amount: 450, tier: "standard" },
      { id: "C", desc: "延误 72 小时 · 大客户", delay: 72, amount: 1800, tier: "key" },
      { id: "D", desc: "延误 2 小时 · 大客户", delay: 2, amount: 90, tier: "key" },
      { id: "E", desc: "延误 50 小时 · 普通客户", delay: 50, amount: 2600, tier: "standard" }
    ],
    timeline: [
      ["2022 年 10 月", "webMethods 10.15 发布", "许多本地部署环境至今仍在用的长期版本。"],
      ["2024", "IBM 从 Software AG 收购 webMethods", "webMethods BPMS 成为 IBM 自动化产品线的一员，与 ODM 和 Business Automation Workflow 并列。"],
      ["2026", "webMethods 12.1 推出", "10.15 客户的升级目标。"],
      ["2026 年 9 月", "Gartner 发布 2026 年 BOAT 魔力象限", "流程编排、连接和 AI agent 被放在同一个类别里评估。"],
      ["2027 年 10 月", "10.15 支持结束", "客户必须升级、购买延长支持，或者重新评估：也是竞争对手瞄准的时刻。"],
      ["2027 年 12 月 2 日", "欧盟 AI 法案附件三的义务开始适用", "信用评分这类高风险用途需要日志记录和人工监督。"],
      ["2028 年 10 月", "10.15 第一阶段延长支持结束", "付费的延长支持可以持续到 2030 年 10 月，只含使用咨询和已知缺陷。"]
    ],
    ideas: [
      { name: "挖掘流程历史", text: "多年的执行日志会显示人们在哪里盖章式审批、在哪里干等、在哪里反复做同一个决定。把它变成一份排好序的规则和 agent 候选清单：用证据，而不是访谈。可以在 Agent 扫描实验室里试试。" },
      { name: "让 BPMS 成为 agent 的人工审批收件箱", text: "来自任何平台的 agent，都可以把「需要人来批」的步骤送进 BPMS 的任务列表，直接复用分派、升级和审计。BPMS 最老的功能，在 agent 时代反而最稀缺。" },
      { name: "给决定装一个黑匣子", text: "对每一个和 agent 相关的决定，都记下规则版本、输入、结果和审批人。当保险公司和监管机构要求出示管控证据时，这份日志本身就成了购买的理由。" },
      { name: "在已有客户所在的地方发力", text: "增长的新闻都指向保险和银行，但一个成熟的 BPMS 可能在别处最强：物流异常、政府部门的个案处理。为你已经服务的行业打包现成的模式。" },
      { name: "把维护费变成 AI 额度", text: "升级并续约的客户可以获得 agent 和决策服务的额度。续约为采用买单，而采用又让平台更难被替换。" }
    ],
    marketView: [
      ["分析师在量什么", "一个宽泛的「BPM 市场」，2025 年大约 170 亿到 260 亿美元，把套件、低代码、服务和文档工具混在一起。"],
      ["新的钱流向哪里", "能统一管控 AI agent 的编排平台，买家是受监管、流程繁重的组织。"],
      ["成熟的本地部署 BPMS 真正在哪里竞争", "在它自己的已有客户群，以及这些客户周边的集成环境里。决定客户去留的是升级截止日，而不是市场报告。"],
      ["接下来怎么做", "在升级的时刻守住已有客户，把 agent 管控变成留下来的理由，再拓展到还没用 BPMS 的集成客户。"]
    ],
    ui: { right: "答对了。", better: (o) => `更合适的负责者：${o}。`, score: (r, n) => `答对 ${r} / ${n}`, wrap: "：流程负责编排，规则负责判断，人处理例外，agent 负责提议。",
      h: " 小时", case: "案例", agent: "Agent", rules: "规则决定", proposes: "Agent 提议补偿", auto: "自动处理", toPerson: "转给人", denied: "拒绝",
      lt: (d) => `延误 < ${d} 小时`, le: (l) => `≤ ${l} 美元`, key: (l) => `大客户 ≤ ${l} 美元`, gt: (l) => `> ${l} 美元 → 人工审批`,
      out: { ALLOW: "批准", REFER: "转人工", DENY: "拒绝" } }
  };

  // ---------- 基础 101 ----------
  Z.basics = {
    intro: "给完全零基础的人准备的七节小课。不需要懂任何产品：先讲道理，再对上 IBM webMethods 的名字。大约 15 分钟。",
    lessons: [
      { id: "process", icon: "🔁", title: "流程就是一份反复使用的菜谱", mins: 2,
        story: "每个组织都在重复做同样的事：批一笔采购、开一个账户、处理一次投诉。把这些步骤写下来一次，你就有了一个流程模型，也就是菜谱。每当有人真的照着做一遍，那就是一个实例，就像照着菜谱做出的一顿饭。BPMS 帮你保管菜谱，并替你把每一顿饭做出来。",
        points: [
          "流程模型：画出来的步骤，很少改动。",
          "流程实例：一次运行，带着自己的数据（这张订单、这位客户）。",
          "一个繁忙的模型可以同时有成千上万个实例在跑，每个停在不同的步骤。"
        ],
        dg: "b-model-instance",
        check: { q: "今天来了 500 份采购申请，都走同一个审批流程。这是几个模型、几个实例？",
          a: ["500 个模型，1 个实例", "1 个模型，500 个实例", "1 个模型，1 个实例"], c: 1,
          e: "一份菜谱，500 顿饭：模型是共用的，每份申请是一个独立的实例，带着自己的数据。" },
        deeper: [["在模拟器里看一个实例怎么跑", "simulator"]] },

      { id: "workers", icon: "🤝", title: "每一步都由系统、人或规则来完成", mins: 2,
        story: "看任何一个步骤，问一句：谁来做？有些步骤由软件完成，比如查库存、发邮件。有些需要一个人，比如经理审批。有些是按政策做的决定，比如「超过 5,000 美元要总监批」。好的流程让每一种都做自己最擅长的事。",
        points: [
          "系统步骤（服务任务）：调用其他软件。又快又可重复。",
          "人的步骤（人工任务）：进入某个人的收件箱，等他来处理。",
          "决定步骤（规则任务）：向规则提问，拿回答案。AI agent 也能帮忙，但要在规则设定的范围之内。"
        ],
        dg: "b-three-workers",
        check: { q: "「超过 5,000 美元的订单需要总监批准。」这个 5,000 美元的上限应该放在哪里？",
          a: ["放在规则里，改它不用重画流程", "直接写在流程图上", "写在总监的邮件签名里"], c: 0,
          e: "上限每个预算周期都会变。放在规则里，业务人员就能安全地修改，流程只管来问。" },
        deeper: [["把真实的步骤分给流程、规则和 agent", "start"]] },

      { id: "shapes", icon: "🔷", title: "认识五个图形，就能看懂大多数流程图", mins: 2,
        story: "BPMN 是画流程的标准图示语言，让业务人员和开发人员能看懂同一张图。你不需要全部学会。认识五个图形，你遇到的大多数流程图就都能看懂了。",
        points: [
          "细圆圈：一次运行从这里开始。粗圆圈：到这里结束。",
          "圆角方框：一个任务，由系统、人或规则完成。",
          "菱形：网关，在这里选一条路（×），或者几条路同时走（+）。箭头表示接下来发生什么。"
        ],
        dg: "b-bpmn-shapes",
        check: { q: "在流程图里，菱形表示什么？",
          a: ["某个人必须做的任务", "流程选一条路或分成几路的地方", "流程的结束"], c: 1,
          e: "菱形是网关。× 网关只选一条路，比如「批准了吗？是或否」；+ 网关让几条路同时进行。" },
        deeper: [["BPMN 要点", "bpmn"]] },

      { id: "rules", icon: "⚖️", title: "把决定从流程图里拿出来", mins: 2,
        story: "流程管的是工作的顺序：先做什么、谁做什么、等多久。规则管的是决定：上限、资格、价格。两者分开，业务人员几分钟就能改一个决定，不用碰流程。",
        points: [
          "规则任务提一个问题，比如「批准还是转人工？」，流程拿到答案后继续。",
          "决策表是最友好的形式：每一行写着「如果满足这些条件，就得到这个结果」。",
          "在 IBM webMethods 里，Hot Deploy 可以把改好的规则直接推到正在运行的服务器上，不用重新部署流程。"
        ],
        dg: "process-vs-rules",
        check: { q: "审批上限从 500 美元改成 800 美元。需要重新部署什么？",
          a: ["整个流程", "只有规则（比如用 Hot Deploy）", "什么都不用，重启服务器就行"], c: 1,
          e: "变的只是决定，所以只改规则。正在运行的流程会直接拿到新的答案。" },
        deeper: [["业务分析师怎样改一条规则", "howto"]] },

      { id: "people", icon: "🙋", title: "人的工作以任务的形式出现在收件箱里", mins: 2,
        story: "流程走到需要人的一步时，会创建一个任务，然后等着。任务出现在相关人员的收件箱里。其中一个人接受它，其他人就知道已经有人在做了；他处理完，带着答案完成任务。流程醒过来，继续往下走。如果没人及时处理，流程可以提醒某人或者升级。",
        points: [
          "接受：「我来做」。一个人接受后，其他人就不能再接。",
          "完成：做完了，并给出流程需要的答案，比如批准或拒绝。",
          "转交：交给别人处理。每一个操作都会被记录。"
        ],
        dg: "task-lifecycle",
        check: { q: "一个任务同时在五个人的收件箱里。Ana 接受了它。会发生什么？",
          a: ["五个人继续一起处理", "任务现在归 Ana，其他人不能再接受", "任务被删除"], c: 1,
          e: "接受就是认领任务，避免同一件事做两遍。如果 Ana 做不完，她仍然可以转交。" },
        deeper: [["业务用户怎样处理任务", "howto"]] },

      { id: "engine", icon: "📒", title: "引擎负责运行，审计记录负责记住", mins: 2,
        story: "想象一个令牌沿着箭头移动：那就是一个实例在往前走。引擎推动每一个令牌，调用系统、创建任务、等待计时器。一边走，一边把发生的事写下来：哪一步、什么时候、谁做的，有没有出错。这份记录能回答「我的订单到哪了？」和「这是谁批的？」。",
        points: [
          "引擎一步步运行每一个实例，全天候不停。",
          "审计记录是每个实例每一步的历史。",
          "监控页面读的就是这份历史。某一步失败时，修好原因，再从那一步重新提交。"
        ],
        dg: "b-token-audit",
        check: { q: "客户问为什么 #123 号订单卡住了。你先去哪里看？",
          a: ["重新画一遍流程", "监控页面，它会显示这个实例和它的步骤历史", "挨个问团队里的每个人"], c: 1,
          e: "监控页面根据审计记录显示每个实例、它的状态和停下的那一步。如果某一步失败了，修好原因再重新提交。" },
        deeper: [["在模拟器里看审计记录", "simulator"], ["运维怎样监控和重新提交", "howto"]] },

      { id: "life", icon: "🚀", title: "从画图到运行，五个动作", mins: 3,
        story: "每个流程的一生都一样：画出来、发送到服务器、打开开关、让它跑、然后监控并改进。新手通常卡在其中一步：打开开关。",
        points: [
          "设计 → 构建并上传 → 启用 → 运行 → 监控，然后改进，再来一轮。",
          "在 IBM webMethods 里，新上传的流程默认是关着的：要在 My webMethods 里把它启用执行（Execution Enabled）。",
          "同一个模型一次只能有一个版本处于启用状态。"
        ],
        dg: "build-pipeline",
        map: [
          ["画出流程", "Designer"],
          ["运行每一个实例", "Process Engine，在 Integration Server 上"],
          ["把工作交给人", "Task Engine，收件箱在 My webMethods 里"],
          ["做决定", "webMethods Business Rules：规则任务和决策表"],
          ["记住发生过什么", "Process Audit 数据库"],
          ["监控和修复", "Monitor，在 My webMethods 里"]
        ],
        check: { q: "你上传了一个新流程，可什么都没启动。最可能的原因是什么？",
          a: ["模型太小了", "没有启用执行", "BPMN 不允许"], c: 1,
          e: "新上传的流程默认不启用。在 My webMethods 里把那个版本启用执行，再试一次。" },
        deeper: [["在动手实验里亲手做一遍", "lab"], ["流程不启动时怎么办", "trouble"]] }
    ],
    ui: { mapH: "同样的道理，换成 IBM webMethods 的名字", idea: "道理", inWm: "在 IBM webMethods 里", min: "分钟", check: "自测：", deeper: "继续深入：",
      nextLesson: "下一课：", right: "答对了。", notQuite: "还差一点。", retry: "再试一次", count: (n, m) => `通过 ${n} / ${m} 道题`, all: (n, m) => `通过 ${n} / ${m} 道题：基础你已经掌握了！🎉`,
      checkR: "自测：", key: "答案" }
  };

  // ---------- 10 分钟速成 ----------
  Z.crash = {
    steps: [
      { title: "BPMS 是什么", dg: "b-model-instance",
        body: ["流程就像一份菜谱：步骤写一次，可以一遍又一遍地用。写下来的步骤就是<b>流程模型</b>。",
          "每当有人照着做一遍，就是一个<b>实例</b>。今天来了 500 份采购申请，就是一个模型、500 个实例。",
          "<b>BPMS</b>（业务流程管理套件）替你保管这份菜谱，并替你运行每一个实例：调用系统、给人派任务、执行规则，还会记下发生过的每一件事。"],
        remember: "一个模型，很多个实例。", more: ["基础 101 第 1 课", "basics"] },
      { title: "每一步由谁来做", dg: "b-bpmn-shapes",
        body: ["每一步都由三者之一完成：<b>系统</b>（服务任务：调用软件、发邮件）、<b>人</b>（人工任务：在收件箱里等人处理），或者<b>规则</b>（规则任务：上限、资格、价格）。",
          "认识五个图形就能看懂大多数流程图：○ 开始，◉ 结束，▭ 任务，◇ 网关（选一条路或分成几路），→ 接下来发生什么。"],
        remember: "系统、人或规则；五个图形。", more: ["BPMN 要点", "bpmn"] },
      { title: "IBM webMethods 由哪几部分组成", dg: "arch-map",
        body: ["<b>Designer</b>：桌面工具，在这里画流程、写规则。",
          "<b>Integration Server</b>：服务器。里面的 <b>Process Engine</b>（流程引擎）运行每一个实例，<b>Business Rules</b>（业务规则）负责回答各种决定。",
          "<b>My webMethods Server</b>：一个网站。人们在这里领任务（由 <b>Task Engine</b> 任务引擎负责），运维在 <b>Monitor</b> 里查看和修复实例。",
          "<b>Process Audit 数据库</b>：记下每一步的历史账本。"],
        remember: "Designer 负责画，Integration Server 负责跑，My webMethods 是人干活的地方。", more: ["架构", "architecture"] },
      { title: "从画好到跑起来", dg: "build-pipeline",
        body: ["画图 → 构建并上传 → <b>启用执行</b> → 运行 → 监控，然后改进。",
          "⚠️ 新手最常犯的错：新上传的流程<b>默认没有启用</b>。在有人去 My webMethods 里把它打开（勾选 Execution Enabled）之前，什么都不会启动。",
          "💡 要改一个上限，就改那条规则，然后用 <b>Hot Deploy</b> 推上去。流程本身不需要重新部署。"],
        remember: "不启用，什么都不会启动。改规则用 Hot Deploy。", more: ["动手实验", "lab"] },
      { title: "为什么现在很重要", dg: "agent-pattern",
        body: ["AI agent 正在到来。安全的做法是：<b>agent 提议</b>，<b>规则决定</b>，例外由<b>人来批</b>，<b>每一步都有记录</b>。",
          "银行和保险公司需要的正是这些：能追溯的决定、关键时刻能介入的人、出故障后能恢复的工作。BPMS 三样都给你。"],
        remember: "Agent 提议，规则决定，人来审批，一切留痕。", more: ["面向受监管行业的合规控制", "controls"] }
    ],
    checks: [
      { q: "500 份采购申请走同一个审批流程。这是多少个实例？", a: ["1 个", "500 个", "要看规则"], c: 1, e: "一个模型，500 个实例：每份申请都是一次独立的运行。" },
      { q: "你上传了一个新流程，但什么都没启动。最可能的原因？", a: ["流程图画得太小", "没有启用执行", "规则写错了"], c: 1, e: "新上传的流程默认不启用；去 My webMethods 里把那个版本启用执行。" },
      { q: "审批上限从 500 美元改成 800 美元。你要改什么？", a: ["整个流程", "只改规则，然后 Hot Deploy", "什么都不改，重启服务器"], c: 1, e: "变的只是决定，所以只改规则；流程保持原样。" }
    ],
    ui: { kicker: (a, b, i, n) => `第 ${a}–${b} 分钟 · 第 ${i} 步，共 ${n} 步`, remember: "记住：", deeper: "以后再深入：", lastKicker: "最后一分钟 · 自测一下", three: "三道小题",
      left: (i, n, m) => `第 ${i} 步，共 ${n} 步 · 大约还剩 ${m} 分钟`, last: "最后一步：自测一下", next: "下一步 →", toCheck: "自测一下 →",
      allRight: "🎉 你已经掌握了 IBM webMethods BPMS 的核心。", good: "👍 开了个好头。", score: (r, n, m) => `答对 ${r} / ${n}，用时大约 ${m} 分钟。接下来选一个：`,
      after: ["<a href=\"#basics\">基础 101</a>：同样的道理，拆成七节 2 分钟的小课，每节一道题。", "<a href=\"#puzzles\">修图闯关</a>：点一点，修好五个坏掉的流程。", "<a href=\"#lab\">动手实验</a>：30 分钟搭一个真的流程。"] }
  };

  // ---------- 示意图 ----------
  // 标题和说明按示意图的 key；图里的文字按英文原文逐行对照（找不到的保持英文）。
  Z.dgCap = {
    "process-vs-rules": ["流程与规则：谁决定什么", "流程管工作的顺序，规则管决定。规则任务来问、规则来答，所以改一条规则不用重新部署流程。"],
    "task-lifecycle": ["一个人工任务，从收件箱到完成", "接受让任务归你；提交只保存、不结束；完成才让流程继续。转交不会改变接受人是谁，所以如果要让同事接手，先释放任务。"],
    "build-pipeline": ["从模型到运行中的实例", "构建并上传只能在 Process Developer 模式下进行。新上传的流程默认不启用，同一个模型一次只能启用一个版本。"],
    "b-model-instance": ["一个模型，很多个实例", "模型是菜谱；每一份按它走的申请都是一个实例，有自己的数据和当前所在的步骤。"],
    "b-three-workers": ["每一步由谁来做？", "系统、人或规则。顺序由流程决定；AI agent 也能帮忙，但要在规则设定的范围内。"],
    "b-bpmn-shapes": ["先认识这五个 BPMN 图形", "开始事件、结束事件、任务、网关，以及它们之间的箭头。认识这些就能看懂大多数流程图。"],
    "b-token-audit": ["引擎负责运行，审计记录负责记住", "蓝色的令牌就是一个实例在各个步骤间移动。每一步都会被记下来，监控页面读的就是这份历史。"],
    "arch-map": ["IBM webMethods BPMS：各个部件和它们运行的位置", "模型在 Designer 里画好，上传到 Integration Server，由 Process Engine 运行并调用规则。人的工作交给 My webMethods Server 上的 Task Engine。引擎把实时状态存在自己的数据库里，把历史写进 Process Audit 数据库，Monitor 读的就是它。"],
    "agent-pattern": ["Agent 提议，规则决定，流程执行", "AI agent 负责阅读和提议；规则里的政策给出批准、转人工或拒绝；流程执行这个答案，或者让一个人参与进来。每个决定都有记录。"]
  };
  Z.dg = {
    // 流程与规则
    "Process vs rules": "流程与规则", "Process (BPMN)": "流程（BPMN）", "Business rules": "业务规则", "order of steps": "步骤的顺序", "who does what": "谁做什么",
    "waits and timers": "等待和计时器", "human tasks": "人工任务", "audit trail": "审计记录", "thresholds": "门槛", "eligibility": "资格", "routing": "分派路线",
    "decision tables": "决策表", "change by analysts": "由分析师修改", "asks": "提问", "answer": "回答",
    "Rule task: the process calls a rule set or decision entity": "规则任务：流程调用一个规则集或决策实体",
    "Change a rule → hot deploy; no process redeploy": "改规则 → Hot Deploy；不用重新部署流程",
    // 任务生命周期
    "Task lifecycle": "任务生命周期", "In your inbox": "在你的收件箱里", "(you, your group or role)": "（你、你的组或角色）", "Accept": "接受",
    "Accepted by you": "已由你接受", "Submit = save, keep working": "提交 = 保存，继续处理", "Complete": "完成", "Completed": "已完成",
    "process continues": "流程继续", "Release": "释放", "Delegate →": "转交 →", "Colleague's": "同事的", "inbox": "收件箱",
    "still accepted": "仍然算", "by you until": "你接受的，", "you release it": "直到你释放",
    "Every action is recorded in the task's audit view.": "每个操作都记录在任务的审计视图里。",
    // 构建流水线
    "Build pipeline": "构建流水线", "Model in Designer": "在 Designer 里建模", "(Process Developer mode)": "（Process Developer 模式）",
    "Build and Upload": "构建并上传", "Runtime elements on": "运行时元素在", "Integration Server": "Integration Server", "not enabled yet!": "还没启用！",
    "My webMethods: tick": "My webMethods：勾选", "Execution Enabled → Save": "Execution Enabled → 保存", "start document arrives": "启动文档到达",
    "Instances run": "实例开始运行", "and appear in Monitor": "并显示在 Monitor 里",
    "Enabling a new version disables the old one;": "启用新版本会停用旧版本；", "new instances use the enabled version.": "新实例都用已启用的版本。",
    // 一个模型，很多实例
    "Process model and instances": "流程模型和实例", "Process model": "流程模型", "“Approve a purchase”": "「采购审批」", "Instance #101": "实例 #101",
    "waiting for": "正在等待", "the manager": "经理审批", "Instance #102": "实例 #102", "approved": "已批准", "Instance #103": "实例 #103", "rejected": "已拒绝",
    "One recipe, many dinners:": "一份菜谱，很多顿饭：", "every run is an instance.": "每次运行都是一个实例。",
    // 三种步骤
    "Three kinds of steps": "三种步骤", "⚙️ System": "⚙️ 系统", "🙋 Person": "🙋 人", "⚖️ Rule": "⚖️ 规则", "service task": "服务任务", "calls other": "调用其他",
    "software,": "软件，", "sends email": "发送邮件", "user task": "人工任务", "waits in an": "在收件箱里", "inbox until": "等待，直到", "someone acts": "有人处理",
    "rule task": "规则任务", "answers:": "回答：", "limits, prices,": "上限、价格、", "The process decides the order of the steps;": "步骤的顺序由流程决定；",
    "each step is done by one of these three.": "每一步都由这三者之一完成。",
    // 五个图形
    "Five BPMN shapes": "五个 BPMN 图形", "Start event": "开始事件", "a run begins": "一次运行开始", "Task": "任务", "a piece of work": "一项工作",
    "Gateway": "网关", "pick a path or split": "选一条路或分几路", "End event": "结束事件", "the run is finished": "这次运行结束", "Sequence flow": "顺序流",
    "what happens next": "接下来发生什么",
    // 引擎和审计
    "Engine and audit trail": "引擎和审计记录", "Receive": "收到", "request": "申请", "Manager": "经理", "approves": "审批", "Create": "创建", "order": "订单",
    "every step is written down": "每一步都会被记下来", "Audit trail": "审计记录", "(the monitor reads it)": "（监控页面读的就是它）",
    "09:01  Receive request  ·  completed": "09:01  收到申请  ·  已完成", "09:01  Manager approves  ·  started": "09:01  经理审批  ·  已开始",
    "11:40  Manager approves  ·  completed by Ana": "11:40  经理审批  ·  由 Ana 完成", "11:41  Create order  ·  completed": "11:41  创建订单  ·  已完成",
    // 架构
    "Architecture": "架构", "model, services, tasks, rules": "模型、服务、任务、规则", "build and upload": "构建并上传", "Process Engine": "Process Engine",
    "runs instances": "运行实例", "rule tasks,": "规则任务、", "Process Engine DB": "流程引擎数据库", "live state": "实时状态",
    "Process Audit DB": "流程审计数据库", "history (PRA_*)": "历史（PRA_* 表）", "user tasks": "人工任务", "reads": "读取",
    "Task Engine": "Task Engine", "inboxes, delegation": "收件箱、转交", "status, resubmit": "状态、重新提交",
    // Agent 模式
    "Agent-era pattern": "Agent 时代的模式", "Event or document arrives": "事件或文档到达", "🤖 AI agent": "🤖 AI agent", "reads, extracts, proposes": "阅读、提取、提议",
    "proposal": "提议", "⚖️ Rules (policy)": "⚖️ 规则（政策）", "allow · refer · deny": "批准 · 转人工 · 拒绝", "allow": "批准", "refer": "转人工", "deny": "拒绝",
    "Process": "流程", "executes": "执行", "Person": "人", "(user task)": "（人工任务）", "Decline": "拒绝", "and notify": "并通知",
    "📒 Decision log": "📒 决策日志", "inputs · rule version · outcome · approver": "输入 · 规则版本 · 结果 · 审批人",
    // 一张图看懂（path.js）
    "proposes": "提议", "everything is logged": "一切都有记录", "Numbers show the order a request flows through.": "数字表示一个申请经过各步骤的顺序。",
    "IBM webMethods BPMS in one picture": "一张图看懂 IBM webMethods BPMS"
  };
})(window.ZH);
