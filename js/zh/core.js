// 简体中文：页面文字、导航、菜单、角色路线、术语点读、徽章和 Mia 的故事（#68 第一批）。
// 产品和界面名称保留英文（Designer、Integration Server、My webMethods、Hot Deploy、Execution Enabled 等），
// 方便读者对照真实产品和 IBM 官方文档。
(function (Z) {
  Z.title = "IBM webMethods BPMS 学院：互动课程";
  Z.description = "Daniel Yuanpeng Xu 制作的独立互动课程和带出处的知识库，讲解 IBM webMethods BPMS（Process Engine、Task Engine、Business Rules）：架构、BPMN、决策自动化、AI agent 时代的模式和市场背景，只用公开资料。";

  // 已翻译完的栏目；其余栏目会显示「正在翻译」提示
  Z.done = ["start", "crash", "basics"];

  Z.nav = {
    start: "从这里开始", crash: "10 分钟速成", basics: "基础 101", overview: "概览", knowledge: "知识库", controls: "合规控制",
    howto: "使用指南", lab: "动手实验", decisions: "决策实验室", capstone: "综合练习", puzzles: "修图闯关", trouble: "故障排查", drills: "值班演练", teach: "开课教学",
    swipe: "刷卡分类", lifecycle: "生命周期", architecture: "架构", bpmn: "BPMN", patterns: "设计模式", cases: "案例", simulator: "模拟器",
    scan: "Agent 扫描实验室", market: "市场", glossary: "术语表", quiz: "测验", review: "复习本"
  };

  Z.page = {
    h1: "IBM webMethods BPMS 学院",
    tagline: "一个带出处的知识库加互动课程，讲解 IBM webMethods BPMS：Process Engine（流程引擎）、Task Engine（任务引擎）、Business Rules（业务规则）、BPMN，以及 AI agent 时代的设计模式。只用公开资料。",
    byread: '作者：Daniel Yuanpeng Xu· <a href="read.html" style="color:#fff">只想安静阅读？打开阅读版 →</a>',
    "s.h2": "这是什么？为什么值得关心？",
    "s.lead": "每个组织都在跑流程：审批、理赔、入职、货运异常处理。<strong>BPMS</strong>（业务流程管理套件）就是让这些流程「在轨道上运行」的软件：它分派工作、执行规则、把任务送到对的人面前，并记录发生过的每一件事。现在 AI agent 来了，而它们需要的正是这样的轨道。下面六个动手小步骤会告诉你为什么。",
    "s.cta": "⚡ 什么都不会？先上 10 分钟速成",
    "s.byline": "作者 <strong>Daniel Yuanpeng Xu</strong>，做过业务流程和决策自动化产品的产品经理。标有 <span class=\"pill\">作者观点</span> 的部分是个人看法，不代表任何雇主或厂商的立场。",
    "p.h3": "👋 你是谁？领一条属于你的路线",
    "p.p": "选一个身份。你只需要走 3 到 5 步，不用把 26 个栏目全看完；每走完一步会自动打勾。",
    "p.aria": "选择你的身份",
    "p.src": "有 webMethods 开发环境？做一遍 <a href=\"#lab\">30 分钟动手实验</a>。要给客户演示？用 <a href=\"#howto\" data-demo=\"1\">10 分钟演示脚本</a>。",
    "m.h3": "🗺️ 一张图看懂 IBM webMethods BPMS",
    "m.p": "跟着一个流程，从画图一路走到审计记录。<strong>点任何一个方框</strong>，就会跳到讲那一步的指南。",
    "ph.sum": "<strong>📱 在用手机？把它存成 App</strong> <small>放到主屏幕、离线阅读、怎么找内容</small>",
    "ph.qr": "在用电脑？用手机相机扫这个码，就能在手机上打开学院。",
    "kb.h3": "IBM webMethods 知识一览",
    "kb.src": "知识库里的每一条事实都链接到 IBM 或 Software AG 的公开文档。<a href=\"#knowledge\">打开知识库 →</a>",
    "e1.h3": "1 · 同一个申请，两个世界",
    "e1.wo": "<strong>没有 BPMS</strong>",
    "e1.w": "<strong>有 BPMS</strong>",
    "e2.h3": "2 · 每件事该交给谁？",
    "e2.p": "给每项工作选一个负责者。<span class=\"mono\">流程</span>负责推动工作，<span class=\"mono\">规则</span>负责做决定，<span class=\"mono\">人</span>负责判断例外，<span class=\"mono\">Agent</span>负责阅读和提议。",
    "e2.score": "答对 0 / 0",
    "e3.h3": "3 · Agent 需要一本规则手册 <span class=\"pill\">作者观点</span>",
    "e3.p": "一个 AI agent 读延误报告，并提议给客户一笔补偿。它从不自己付钱：由规则来决定<em>批准</em>、<em>转给人</em>还是<em>拒绝</em>，每个决定都会连同规则版本一起记下来。改一改政策，看看结果和日志怎么变。",
    "e3.lim": "自动批准上限：",
    "e3.min": "补偿所需的最短延误：",
    "e3.key": "大客户的自动批准上限翻倍",
    "e3.src": "Agent 擅长阅读和提议；规则掌握金额上限；规则转出来的事由人处理。正是这样的分工，让 agent 的决定能向审计人员讲清楚。",
    "e4.h3": "4 · 推动这个市场的时钟",
    "e4.p": "点一个日期。决定企业何时重新评估流程平台的，主要是升级截止日和监管，而不是技术潮流。",
    "e5.h3": "5 · 市场真正在哪里 <span class=\"pill\">作者观点</span>",
    "e5.p": "逐层点开看看。",
    "e6.h3": "6 · AI agent 时代的五个想法 <span class=\"pill\">作者观点</span>",
    "gd.h3": "继续深入",
    "gd.a": "它是怎么搭起来的", "gd.as": "引擎、数据库、审计表",
    "gd.b": "跑一个流程", "gd.bs": "带规则和人工任务的贷款流程",
    "gd.c": "找出 agent 候选", "gd.cs": "给流程历史打分",
    "gd.d": "考考自己",
    "c.h2": "10 分钟速成：从零看懂 IBM webMethods BPMS",
    "c.lead": "不需要任何基础。5 步，每步 2 分钟、一张图，最后 3 道小题。看完一步，点<strong>下一步</strong>。",
    "c.back": "← 上一步",
    "b.h2": "基础 101：每个流程平台背后的道理",
    "b.reset": "重来",
    "b.done": "🎉 基础你已经掌握了",
    "b.donep": "下一步选一条路：<a href=\"#lab\">在动手实验里搭你的第一个流程</a>、<a href=\"#decisions\">玩一玩决策表</a>，或者<a href=\"#start\">回到「从这里开始」选你的身份</a>。",
    "f.by": "作者",
    "f.ind": "独立学习资源 · 与 IBM 无隶属关系",
    "f.read": "阅读版",
    "f.src": "GitHub 源代码"
  };

  // ☰ 菜单分组（id、标题、说明）
  Z.phone = {
    groups: [
      ["入门", [["start", "从这里开始", "BPMS 是什么，六个动手小步骤"], ["crash", "10 分钟速成", "什么都不会？从这里开始：5 步 3 题"], ["basics", "基础 101", "七节基础课，15 分钟"], ["overview", "概览", "IBM webMethods 一览"]]],
      ["动手", [["howto", "使用指南", "按身份分的分步教程"], ["lab", "动手实验", "30 分钟做出第一个流程"], ["decisions", "决策实验室", "改一条规则、测一测、看为什么"], ["capstone", "综合练习", "agent、规则、经理、流程：一条申请走到底"], ["puzzles", "修图闯关", "修好五个坏掉的流程"], ["swipe", "刷卡分类", "规则、agent 还是人？60 秒"], ["trouble", "故障排查", "症状 → 原因 → 解决"], ["drills", "值班演练", "三个限时处理的故障"], ["simulator", "模拟器", "跑一个贷款流程"], ["scan", "Agent 扫描实验室", "找出规则和 agent 候选"], ["quiz", "测验", "考考自己"], ["review", "复习本", "答错的题会按时回来"]]],
      ["学习", [["knowledge", "知识库", "带出处的运行机制"], ["controls", "合规控制", "给银行和保险：控制项与证据"], ["architecture", "架构", "引擎、数据库、审计表"], ["lifecycle", "生命周期", "流程阶段和版本日期"], ["bpmn", "BPMN", "图示法要点"], ["patterns", "设计模式", "经典模式和 agent 时代模式"], ["cases", "案例", "完整示例"], ["market", "市场", "市场往哪里走"], ["glossary", "术语表", "可搜索的术语"]]],
      ["教学", [["teach", "开课教学", "半天工作坊方案"]]]
    ],
    guide: {
      iphone: [
        "用 Safari 打开链接。",
        "点「共享」（或地址栏旁的 ⋯，再点「共享」）。",
        "往下滑，点「添加到主屏幕」。如果找不到，点最下面的「编辑操作」把它加进来。",
        "保持「作为网页 App 打开」开启，然后点「添加」。"
      ],
      android: [
        "用 Chrome 打开链接。",
        "点右上角 ⋮ →「添加到主屏幕」。",
        "选「安装」（或「安装应用」）并确认。"
      ],
      use: [
        ["找栏目", "点左上角的 ☰ 栏目，或者左右滑动标签栏。"],
        ["往下走", "每个栏目最后都有「上一个」和「下一个」。↑ 按钮能回到顶部。"],
        ["离线阅读", "第一次打开以后，存下来的 App 没有网络也能打开。实验进度保存在你的手机上。"],
        ["放大文字", "用浏览器的文字大小设置，或者双指放大，版面会自动重排。"],
        ["只想读或打印", "打开阅读版：一页看完，带示意图和所有指南。用浏览器的共享或打印功能可以存成 PDF。"]
      ]
    },
    ui: { sections: "栏目", all: "全部栏目", close: "关闭", other: "其他", read: "阅读版", readSub: "一页看完全部内容，可打印",
      phone: "在手机上用", phoneSub: "存到主屏幕，离线阅读", prev: "上一个", next: "下一个", top: "回到顶部", toc: "回到目录",
      using: "怎么用", iphone: "iPhone（Safari）", android: "Android（Chrome）" }
  };

  // 「你是谁？」路线和一图看懂
  Z.paths = {
    roles: [
      { id: "new", icon: "🌱", name: "新手", intro: "不需要任何 webMethods 经验。五站，大约 30 分钟。",
        steps: [
          { go: "crash", t: "10 分钟速成", why: "什么都还不会？5 小步加 3 道题。" },
          { go: "basics", t: "基础 101", why: "七节小课：流程、任务、规则和引擎。" },
          { go: "simulator", t: "跑一个流程", why: "看一笔贷款怎样经过规则和人工任务。" },
          { go: "howto", role: "user", t: "使用指南：业务用户", why: "日常工作：接受并完成任务。" },
          { go: "quiz", t: "测验", why: "看看记住了多少。" }
        ] },
      { id: "customer", icon: "💼", name: "客户", intro: "这适不适合我们？成熟吗？大约 20 分钟。",
        steps: [
          { go: "start", t: "从这里开始：有没有 BPMS 的差别", why: "两分钟看懂业务问题。" },
          { go: "cases", t: "完整案例", why: "你一定熟悉的审批、贷款和物流异常。" },
          { go: "knowledge", kb: "engine", t: "压力下它表现如何", why: "服务质量：每个流程可选「有保证」或「快」。" },
          { go: "howto", role: "analyst", t: "不靠 IT 改规则", why: "业务人员怎样用 Hot Deploy 改政策。" },
          { go: "market", t: "市场往哪里走", why: "升级截止日、监管和 agent。" }
        ] },
      { id: "user", icon: "📥", name: "业务用户", intro: "你会从流程里收到任务。大约 12 分钟。",
        steps: [
          { go: "howto", role: "user", t: "处理你的任务", why: "My Inbox → 接受 → 完成，附速查卡和自测。" },
          { go: "trouble", area: "Tasks", t: "任务出问题时", why: "接不了、找不到、转出去后卡住。" },
          { go: "glossary", t: "术语表", why: "遇到不懂的词就查。" },
          { go: "quiz", t: "测验", why: "看看记住了多少。" }
        ] },
      { id: "dev", icon: "🛠️", name: "流程开发人员", intro: "你在 Designer 里搭流程。连实验大约 1 小时。",
        steps: [
          { go: "overview", t: "产品家族", why: "每个组件分别做什么。" },
          { go: "knowledge", kb: "engine", t: "Process Engine 和服务质量", why: "决定速度和可靠性取舍的设置。" },
          { go: "howto", role: "dev", t: "建模、构建、启用", why: "包括人人都会漏掉的一步：Execution Enabled。" },
          { go: "lab", t: "动手实验", why: "30 分钟跑起你的第一个流程。" },
          { go: "trouble", area: "Start and deploy", t: "流程不启动时", why: "排查流程图和常见原因。" }
        ] },
      { id: "analyst", icon: "📐", name: "业务分析师", intro: "规则和政策归你管。大约 20 分钟。",
        steps: [
          { go: "knowledge", kb: "rules", t: "webMethods Business Rules", why: "规则项目、决策表，以及它们在哪里运行。" },
          { go: "howto", role: "analyst", t: "安全地改一条规则", why: "锁定、编辑、校验、Hot Deploy。" },
          { go: "patterns", t: "设计模式", why: "Agent 提议，规则决定，流程执行。" },
          { go: "trouble", area: "Rules", t: "规则部署不了时", why: "Hot Deploy 变灰等常见陷阱。" }
        ] },
      { id: "ops", icon: "🚦", name: "运维", intro: "你负责让流程保持健康。大约 20 分钟。",
        steps: [
          { go: "architecture", t: "架构", why: "引擎、数据库，以及历史记录存在哪里。" },
          { go: "howto", role: "ops", t: "监控、修复、重新提交", why: "实例状态、权限和速查卡。" },
          { go: "knowledge", kb: "history", t: "执行历史和审计", why: "记录了什么，任务历史到底在哪。" },
          { go: "trouble", area: "Monitor and operations", t: "Monitor 的问题", why: "按钮不见、看不到实例、重新提交不正常。" }
        ] },
      { id: "trainer", icon: "🎓", name: "培训讲师", intro: "你要给团队或客户上课。准备大约 30 分钟。",
        steps: [
          { go: "teach", t: "开课教学", why: "3 小时议程、打印清单和授课提示。" },
          { go: "howto", role: "demo", t: "客户演示脚本", why: "十分钟，六个节拍。" },
          { go: "lab", t: "动手实验", why: "课上两人一组做的练习。" },
          { go: "trouble", t: "故障排查", why: "有人卡住时该怎么说。" }
        ] }
    ],
    map: {
      model: ["画出流程", "Designer · BPMN"], build: ["构建并上传", "Process Developer 模式"], enable: ["启用执行", "新手最常漏的一步！"],
      run: ["Process Engine 运行它", "在 Integration Server 里"], people: ["人处理任务", "My Inbox"], rules: ["规则做决定", "用 Hot Deploy 修改"],
      monitor: ["监控和修复", "暂停 · 重新提交"], audit: ["审计历史", "Process Audit 数据库"], agent: ["AI agent 提议", "规则来决定"]
    },
    ui: { done: "已完成", min: "分钟", yourPath: "你的路线", step: (i, n) => `第 ${i} 步，共 ${n} 步`, next: "下一步", complete: "路线完成 🎉", another: "换一个身份", mapTitle: "一张图看懂 IBM webMethods BPMS" }
  };

  // 术语点读：中文正文里出现的词（中文和保留的英文名都算），配一句大白话
  Z.words = {
    terms: [
      ["bpms", ["BPMS"], "运行业务流程的一整套工具：画出步骤、让它跑起来、把工作交给人、看进度、管规则。", "BPMS"],
      ["bpmn", ["BPMN"], "画流程用的图示语言。圆圈表示开始和结束，方框是工作，菱形是判断，箭头表示先后顺序。", "BPMN"],
      ["pe", ["Process Engine", "流程引擎"], "真正一步步运行流程的部分，像乐队指挥照着乐谱指挥。", "Process Engine"],
      ["te", ["Task Engine", "任务引擎"], "把工作交给人的部分：它把任务放进收件箱，等人做完。", "Task Engine"],
      ["is", ["Integration Server", "IS"], "webMethods 的主服务器。你的服务和 Process Engine 都在这里运行。", "Integration Server (IS)"],
      ["mws", ["My webMethods Server", "My webMethods", "MWS"], "大家登录的网站：任务收件箱、监控和管理页面都在这里。", "My webMethods Server (MWS)"],
      ["designer", ["Designer"], "桌面工具：在这里画流程、写规则，再发送到服务器。", null],
      ["model", ["流程模型"], "你画好的流程图。每个保存下来的版本都可以打开开关去运行。", null],
      ["instance", ["流程实例", "实例"], "流程的一次运行，比如一张订单、一份贷款申请。一个模型可以同时有成千上万个实例。", null],
      ["ruletask", ["规则任务"], "流程里的一个方框：它向规则问一个问题，比如「批准还是转人工？」，拿到答案后继续往下走。", "Rule task"],
      ["br", ["Business Rules", "业务规则"], "webMethods 的规则组件：把决定写成表格，改它不用动流程。", null],
      ["dt", ["决策表"], "像电子表格一样的规则：每一行写着「如果满足这些条件，就得到这个结果」。", "Decision table"],
      ["hot", ["Hot Deploy"], "不重新部署流程，直接把规则更新到正在运行的服务器上。就像换价目表不用重印菜单。", "Hot Deploy"],
      ["enable", ["Execution Enabled", "启用执行"], "My webMethods 里流程版本的开关。忘了打开，什么都不会启动：这是新手最常见的错误。", "Execution Enabled"],
      ["build", ["构建并上传"], "Designer 里的一个操作：把做好的流程发送到服务器，让它可以运行。", "Build and upload"],
      ["audit", ["Process Audit 数据库", "Process Audit", "审计记录"], "历史账本：每次运行走过哪些步骤、什么时候、出过什么错，都记在这里。Monitor 就是读它。", "Process Audit database"],
      ["monitor", ["Monitor"], "My webMethods 里的页面：看正在运行的流程、它们的状态和错误，还能重新提交。", null],
      ["resubmit", ["重新提交"], "修好原因之后，让失败的流程从选定的一步重新跑。", "Resubmit"],
      ["usertask", ["人工任务"], "要等一个人来完成的步骤，比如经理批准申请。它会出现在那个人的收件箱里。", null],
      ["servicetask", ["服务任务"], "由系统自动完成的步骤，比如调用其他软件、发邮件。", null],
      ["gateway", ["网关"], "BPMN 里的菱形：流程在这里选一条路，或者分成几路同时做。", null],
      ["odm", ["ODM"], "IBM 专门的决策引擎：在流程之外编写、测试、管理业务规则的版本。", "ODM"],
      ["hitl", ["人在回路"], "自动化或 AI 的动作执行前，先由一个人检查或批准。", "Human-in-the-loop"],
      ["agent", ["AI agent"], "用 AI 模型自己阅读、判断、行动的软件，在你设定的范围内工作。", null],
      ["eom", ["EOM", "EOS"], "维护结束和支持结束：过了这些日期，这个版本就不再有修复和支持。", "EOM / EOS"]
    ],
    plain: {
      crash: "5 个小步骤，每步一张图。准备好了就点「下一步」。什么都不用安装。",
      start: "选你的身份，跟着走 3 到 5 步。开始之前什么都不用装。",
      basics: "完全新手从这里开始：七节小课讲清每个流程平台背后的道理，每节一张图、一道题。",
      overview: "IBM webMethods 由哪些部分组成，一张表看完。扫一眼就行，后面每一部分都会再遇到。",
      howto: "选你的身份，就有像菜谱一样的分步说明。",
      lab: "大约 30 分钟，亲手搭出你的第一个流程。做完一步勾一步。",
      decisions: "玩一张很像真的决策表：拖动上限、测一份申请，看看为什么规则比流程改得快。",
      capstone: "一个女装店的降价申请，从 agent 提议、规则判定、经理审批到流程改价，一步步点着走，每一步都留记录。",
      puzzles: "五个坏掉的小流程。把缺的那块放回去，点「运行」看令牌能不能走通。",
      swipe: "看一张卡片，往左滑交给规则，往右滑交给 agent，往上滑留给人。60 秒，每答一张都告诉你为什么。",
      trouble: "有东西不正常？搜症状，看可能的原因，试解决办法。",
      drills: "像真的值班一样：出了故障，选你先查什么。查对了往下走，查错了要花时间，最后有复盘。",
      bpmn: "画流程的图示语言：圆圈是开始和结束，方框是工作，菱形是判断。",
      cases: "从头到尾的真实例子，每个都附上背后的道理。",
      simulator: "一步步跑一个模拟流程，看引擎在做什么。怎么点都不会弄坏。",
      glossary: "课程里所有的词都在这张可搜索的表里。在任何地方点带下划线的词也能看解释。",
      quiz: "考考自己。答错也没关系：每道题都会解释原因。",
      review: "你在网站上答错的题都会收在这里，过几天再考你一次，直到真的记住。"
    },
    ui: { what: "这是什么意思？", explained: "术语解释", close: "关闭", tech: "专业说法：", all: "在术语表里看全部术语 →",
      adv: "🧭 <strong>进阶栏目。</strong>第一遍可以跳过；等动手实验做明白了再回来。<a href=\"#start\">← 回到「从这里开始」</a>",
      plain: "🌱 <strong>大白话：</strong>", menu: (a, b) => `🌱 新手模式只显示 ${b} 个栏目中的 ${a} 个。`, showAll: "显示全部",
      on: "🌱 新手模式：<strong>开</strong>", off: "🌱 新来的？<strong>新手模式</strong>" }
  };

  // 进度、徽章、阅读时间
  Z.fun = {
    badges: {
      explorer: ["探索者", "每个栏目都看过"], agent: ["Agent 驯服师", "在「从这里开始」改一次 agent 的政策"], sim: ["模拟器", "把贷款流程跑到结束"],
      scan: ["扫描员", "跑一次 Agent 扫描实验室"], fixer: ["排障手", "打开 5 条故障排查"], role: ["上岗就绪", "在某个身份的自测里拿到 3 / 3"],
      basics: ["基础过关", "通过基础 101 的全部七道题"], fixer2: ["流程修理工", "修好全部五个坏掉的流程"], lab: ["实验通关", "勾完动手实验的每一步"],
      quiz: ["测验高手", "测验全部答对"], oncall: ["值班英雄", "三个值班演练都走理想路径"]
    },
    ui: { read: "阅读", handsOn: "动手", total: (t) => `⏱ 整门课大约要读 ${t}。每个栏目顶部都标了各自的时间。`, totalRead: (t) => `⏱ 全部读完大约 ${t}。每章都标了各自的时间。`,
      progress: "你的进度", local: "（只保存在这个浏览器里）", explored: (n, m) => `🧭 已看 ${n} / ${m} 个栏目`, unlocked: "已解锁",
      badge: "徽章解锁：", dyk: "💡 你知道吗？", another: "再来一条", readTopic: "读这个主题 →", h: "小时", min: "分钟" }
  };

  Z.pro = { on: "💼 专业模式：<strong>开</strong>", off: "💼 <strong>专业模式</strong>",
    bar: '<strong>专业模式</strong> · 高管简报：<a href="brief.html#banking">银行</a> · <a href="brief.html#insurance">保险</a> · <a href="index.html#controls">合规控制</a>' };

  Z.app = { topics: "个知识主题", facts: "条带出处的事实", comps: "个 IBM webMethods 组件", sources: "个公开来源", terms: "个术语", quiz: "道测验题", questions: "道题" };

  // Mia 的申请单：贯穿整门课的虚构故事
  Z.story = {
    cast: {
      mia: ["采购员", "要给新同事买一台 1,200 美元的笔记本电脑。我们跟着走的就是她的这张申请单。"],
      sam: ["经理", "在 My webMethods 的收件箱里审批超出上限的采购。"],
      priya: ["业务分析师", "管着采购上限这条规则，改它不用动流程。"],
      leo: ["流程开发人员", "在 Designer 里画出流程、构建它，并把它打开运行。"],
      omar: ["运维", "在 Monitor 里盯着运行中的申请，把失败的重新提交。"]
    },
    stages: ["已提交", "规则检查", "经理审批", "已下单", "已存档"],
    chapters: {
      start: "认识一下 Mia。她要给新同事买一台 1,200 美元的笔记本电脑。没有流程平台，就意味着给 Sam 发邮件、填电子表格，然后祈祷没人忘记。跟着她的申请走完整门课：每个栏目都会讲它旅程的下一段。",
      basics: "Mia 的申请是「采购审批」这个模型的一个实例。今天还有十位同事也提交了申请：同一个模型，又多了十个实例，各自停在自己的那一步。",
      overview: "Mia 点下提交的背后：Leo 在 Designer 里画了流程，Integration Server 运行它，My webMethods 给 Sam 显示收件箱，审计数据库记下每一步。",
      knowledge: "为什么服务器重启后 Mia 的申请还在？因为 Leo 给采购流程选了「有保证」的服务质量，而不是只放在内存里的 Volatile Tracking。Process Engine 主题讲了这个取舍。",
      howto: "Sam 打开 My Inbox，接受 Mia 的任务并批准。流程是 Leo 搭的，上限规则归 Priya 管，Omar 负责让它一直跑着。在下面选一个身份，看他们各自的步骤。",
      lab: "在这个实验里你就是 Leo：你要亲手搭出 Mia 的申请所走的那个流程。申请进来，审批人接受或拒绝，你在 Monitor 里跟踪它。",
      decisions: "Priya 把采购上限放在一张决策表里：500 美元以内自动批准，超过的交给经理。所以 Mia 的 1,200 美元会送到 Sam 那里。下面的贷款决策表也是同样的道理。",
      trouble: "周一早上 9 点：Mia 提交了，可什么都没发生。原来 Leo 周五上传了新版本，却没有启用执行。「流程不启动」排查图两步就能找到原因。",
      teach: "要上课？就讲 Mia 的故事。议程的每一部分都对应她申请的一个时刻，全班跟着一条线走，而不是听一串功能清单。没有电脑？用不插电课堂套件，围着桌子把她的申请走一遍。",
      lifecycle: "一个季度后，数据显示像 Mia 这样的申请要等经理两天。Priya 提高了自动批准上限，Leo 加了一个 24 小时提醒：循环又开始了。",
      architecture: "Mia 的申请走一趟：Integration Server 上的 Process Engine 运行它，Task Engine 把任务放进 Sam 的收件箱，每一步都写进 Process Audit 数据库。",
      bpmn: "下面的泳道图就是 Mia 的申请：她在「申请人」泳道提交，Sam 在「经理」泳道批准，系统创建订单。",
      patterns: "明年，一个 AI agent 会读 Mia 附上的报价单，并提议一个成本中心。Priya 的规则决定这样行不行，超过上限的由 Sam 批准，一切都有记录。",
      cases: "下面的采购审批案例就是 Mia 的流程，从头到尾，还有 Priya 学到的一课：上限应该放在哪里。",
      simulator: "运行 Mia 申请的那种引擎，也在运行贷款申请。一步步走一遍，看看 Omar 在 Monitor 里会看到的审计记录。",
      scan: "一年后，像 Mia 这样的申请有成千上万张。假如历史显示 1,500 美元以下的申请 Sam 几乎都在几分钟内批了：扫描就会把这一步标为规则候选。",
      quiz: "故事的结尾：Mia 的电脑到了，订单已经存档，谁在什么时候批准的，任何人都查得到。你能说出每一步发生了什么吗？"
    },
    ui: { where: "Mia 的申请走到哪了", tag: "📦 Mia 的申请", part: (n, m) => `第 ${n} 部分，共 ${m} 部分`, next: "Mia 的故事下一段：", done: "🎉 故事讲完了。回到「从这里开始」→",
      follow: "从头跟着 Mia 的故事 →", cast: "认识一下登场人物", castLead: "一张虚构的采购申请，从点击提交一路跟到审计记录。这里的人物都是虚构的。", go: "跟着 Mia 的申请走 →" }
  };
})(window.ZH);
