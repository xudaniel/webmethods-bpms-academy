// 简体中文：受监管行业的合规控制、决策实验室、修图闯关（#68 第三批 b）。
// 法规名称保留官方英文缩写（SR 11-7、OSFI E-23、DORA 等），链接指向监管机构的原文。本页是教学用的对照，不是法律或合规意见。
(function (Z) {
  Z.done = (Z.done || []).concat(["controls", "decisions", "puzzles", "swipe", "drills"]);

  Object.assign(Z.page, {
    "ct.h2": "面向受监管行业的合规控制",
    "ct.lead": "银行和保险公司被要求拿出什么，以及 IBM webMethods BPMS 和 Business Rules 怎样提供：七项常见控制、要求它们的法规框架，以及审计人员能看到的证据。",
    "ct.b1": "高管简报：银行", "ct.b2": "高管简报：保险",
    "dl.h2": "决策实验室：可以修改的规则",
    "dl.lead": "规则任务提一个问题，规则来回答。改一改下面的门槛，测一份申请，再比较一下「改规则」和「改流程」的差别。",
    "pz.h2": "修图闯关：五个坏掉的流程",
    "pz.lead": "每一关都有一处错误。点一个零件放进虚线框，按 ▶ 运行，看令牌怎么走。如果卡住了，你会看到原因。什么都不用安装。",
    "pz.aria": "关卡", "pz.reset": "重来",
    "sw.h2": "刷卡分类：规则、agent 还是留给人？",
    "dr.h2": "值班演练",
    "dr.lead": "三个小故障，时钟一直在走。选你要先查什么：查对了就往下走，查错了要多花几分钟，并告诉你为什么。每个演练最后都有复盘，每一步都附上官方文档出处。",
    "sw.lead": "Agent 提议，规则决定，人处理边缘情况。60 秒判断 20 个步骤：往左滑交给规则，往右滑交给 agent，往上滑留给人。每个答案都用 Agent 扫描实验室的同一套门槛来解释。"
  });

  // ---------- 合规控制 ----------
  Z.controls = {
    frameworks: {
      sr117: { full: "模型风险管理监管指引（Supervisory Guidance on Model Risk Management）", who: "美联储和美国货币监理署（OCC）· 银行业",
        what: "2011 年 4 月 4 日发布。要求模型的开发、实施和使用稳健，验证有效，治理、政策和控制健全。" },
      e23: { full: "指引 E-23：模型风险管理（2027）", who: "加拿大金融机构监管局（OSFI）· 银行和保险公司",
        what: "最终版于 2025 年 9 月 11 日发布，2027 年 5 月 1 日生效，适用于所有受联邦监管的金融机构。以原则为本，涵盖所有类型的模型，包括 AI。" },
      aiact: { name: "欧盟 AI 法案", full: "欧盟条例（EU）2024/1689", who: "欧盟 · 放贷机构和人寿/健康保险公司",
        what: "附件三第 5 点把「自然人的信用评估和信用评分」以及「人寿和健康保险的风险评估和定价」列为高风险。第 12 条要求自动记录日志；第 14 条要求有效的人工监督。具体的适用日期请以官方网站为准。" },
      gdpr: { name: "GDPR 第 22 条", full: "自动化个人决策", who: "欧盟 · 任何对个人做决定的机构",
        what: "个人有权不受仅基于自动化处理、并对其产生法律效力或类似重大影响的决定约束。在允许的情况下，保障措施至少包括：获得人工干预的权利、表达自己观点的权利，以及对决定提出异议的权利。" },
      naic: { name: "NAIC AI 公告", full: "示范公告：保险公司对 AI 系统的使用", who: "美国各州 · 保险公司",
        what: "美国全国保险监督官协会（NAIC）于 2023 年 12 月 4 日通过。这是一份示范指引，在各州采纳后适用；它要求保险公司为负责任地使用 AI 系统制定书面计划。" },
      dora: { full: "欧盟条例（EU）2022/2554，数字运营韧性", who: "欧盟 · 银行、保险公司和其他金融实体",
        what: "自 2025 年 1 月 17 日起适用。涵盖 ICT 风险管理、ICT 相关事件的管理和报告、韧性测试，以及 ICT 第三方风险。" }
    },
    rows: {
      "four-eyes": { control: "四眼审批（制单 / 复核）",
        need: "超过授权额度的事项要由第二个人批准，而且同一个人不能既申请又批准。",
        how: "规则任务判断申请是否需要审批；人工任务把它分派给审批人角色。接受任务就是认领它，所以只有一位审批人处理，转交也会被记录。",
        evidence: "任务的审计历史（谁、在什么时候接受、转交和完成），来自 Task Engine 的 getTaskAudit 服务或任务归档。" },
      sod: { control: "职责分离",
        need: "构建决定的人、修改决定的人、批准决定的人和修复故障的人，不是同一批人。",
        how: "开发人员在 Designer 里搭流程；分析师在 My webMethods 里管理规则项目；运维只有在管理员授予了相应功能权限（比如 Resubmit 或 Modify and Resubmit）后，才能在 Monitor 里操作。",
        evidence: "My webMethods 里的角色和功能权限分配；Monitor 里谁重新提交了什么。" },
      trace: { control: "决策可追溯",
        need: "对任何一个具体结果，你都能拿出输入、决策逻辑及其版本、结果，以及是谁确认的。",
        how: "把规则任务的输入和输出标为记录字段：输入在步骤运行前记录，输出在运行后记录。它们会和实例一起进入 Process Audit 数据库。规则版本也作为一个字段记下来（作者观点）。",
        evidence: "这个实例的记录字段（PRA_STEP_LOGGED_FIELD）和步骤历史（PRA_PROCESS_STEP）。" },
      oversight: { control: "人工监督和提出异议的权利",
        need: "一个人可以复核、推翻或叫停自动化或 AI 辅助的决定；客户也可以要求由人重新看一遍。",
        how: "把转人工的、对客户不利的结果和 AI 提议的动作，送到人工任务：agent 提议，规则决定，人来批准。客户提出异议时，可以在同一个流程里启动一个复核任务（作者观点）。",
        evidence: "人工任务记录，包括复核人、结果和时间；旁边就是记录下来的决策字段。" },
      change: { control: "决策逻辑的变更控制",
        need: "对决策逻辑的修改要经过测试、批准并有版本记录。如果你的政策把评分卡或规则当作模型，它们就要进入模型清单。",
        how: "规则项目先在 Designer 里本地测试，再通过配置好的服务器连接 Hot Deploy 到 Integration Server。新的流程版本只有在有人启用执行后才会运行，而且同一时间只能启用一个版本。",
        evidence: "规则项目的版本和部署历史；My webMethods 里流程模型的各个版本以及哪个已启用。" },
      retention: { control: "记录保留和归档",
        need: "决策和流程记录按照你的记录政策和监管要求保存足够长的时间，并且能调出来。",
        how: "流程历史存在 Process Audit 数据库里；Archive 数据库组件用来归档 ProcessAudit 数据，已完成的任务也可以归档到单独的存储。",
        evidence: "归档表和任务归档，可以按实例调取。" },
      resilience: { control: "韧性和恢复",
        need: "进行中的工作在故障后不丢失，失败的步骤可以在受控的方式下修复并重跑。",
        how: "需要审计的流程用有保证的（非易失）服务质量。在 Monitor 里，失败的实例可以从失败的步骤重新提交；如果是坏数据导致的，还可以先修改 pipeline。",
        evidence: "Process Audit 数据库里实例和步骤的状态历史；Monitor 里重新提交后的实例视图。" }
    },
    ui: { practice: "常见做法", askedBy: "提出要求的：", need: "期望做到什么", how: "BPMS 和规则怎么做", evidence: "审计人员看到的证据", productSrc: "产品来源：",
      disclaimer: (d) => `<strong>这是教学用的对照，不是法律或合规意见。</strong>某个框架是否适用，取决于你的机构、所在司法辖区和具体用途。法规引用最近一次核对于 ${d}。`,
      glance: "一览", control: "控制项", frameworks: "相关法规框架", source: "来源：", checked: "核对于" }
  };

  // ---------- 决策实验室 ----------
  Z.decisions = {
    dtH: "互动决策表", dtP: "改一改门槛，测一份申请。规则任务评估的就是这个。",
    approveIf: "信用分 ≥ 多少时批准", andDti: "且贷款/收入 ≤", declineIf: "信用分 < 多少时拒绝", testScore: "测试信用分", loan: "贷款", income: "收入", run: "评估",
    dtSrc: '这模拟的是一张简单的决策表。在生产环境里，同样的逻辑放在一个规则项目里，Hot Deploy 到 Integration Server，完全不碰流程。来源：<a href="https://documentation.softwareag.com/webmethods/compendiums/v10-3/C_Digital_Event_Comm/intsagdes-compendium/co-about_hot_deployment.html" target="_blank" rel="noopener">About hot deployment</a>。',
    out: { APPROVE: "批准", DECLINE: "拒绝", REFER: "转人工" },
    rDecline: (s, d) => `信用分 ${s} < ${d}`, rApprove: (s, m, dti, max) => `信用分 ${s} ≥ ${m}，且贷款/收入 ${dti}% ≤ ${max}%`, rRefer: (s, dti) => `信用分 ${s}，贷款/收入 ${dti}%：需要核保员`,
    pitH: "规则配置的坑", sym: "症状", cause: "原因和办法", src: "来源", author: "作者观点",
    pitfalls: [
      ["人工决定（任务动作）被忽略或出错", "决策表必须是 Process Aware，必须映射 TaskData，任务的输入输出必须和表的一致。"],
      ["改了映射之后出现奇怪的运行时错误", "ProcessData 里装的是运行时数据：绝不能覆盖或丢弃它，只能向外映射。"],
      ["事件规则从来不触发", "用到事件规则的规则任务，需要对应的 Integration Server 上有 JMS 触发器。"],
      ["规则动作在流程里什么都不做", "把流程的 Minimum Logging Level 设为 5（流程及所有步骤）；Designer 需要靠它判断规则动作要什么。"],
      ["规则跑到了错误的服务器上", "默认情况下，规则在装了 Process Engine 的那台 Integration Server 上运行。要用远程服务器，就在 Integration Server Administrator 里建一个名为 businessrulesruntime 的远程服务器别名。"],
      ["Hot Deploy 连不上服务器", "先配置好每台 Integration Server 的连接：Administration > My webMethods > System Settings > webMethods Business Rules Settings（主机、端口、用户、密码）。如果用 SSL，每个目标都必须在主端口上使用 SSL。"],
      ["流程还在等旧的规则签名", "作者观点：规则项目和调用它的流程一起管理版本、一起测试。"]
    ],
    agH: "决策敏捷：规则 vs 写死在流程里", agP: "改一个折扣门槛，看看两种做法各要多久。", newT: "新门槛：$", apply: "应用修改",
    hard: "写死在流程 / 网关里", hardP: "在 Designer 里改网关条件，构建并上传一个新版本，再把它启用执行。", days: "几天到几周",
    rules: "决策表 + Hot Deploy", rulesP: "改规则，Hot Deploy 规则项目。流程模型不变。", mins: "几分钟", click: "点「应用修改」看模拟。",
    log: (t) => `门槛改成 $${t}\n写死的做法：打开 Designer → 改网关条件 → 构建并上传新版本 → 启用执行（加上测试和审批，要几天到几周）\n规则的做法：改决策表的一行 → Hot Deploy 规则项目 → 上线（几分钟）\n流程模型版本：不变`
  };

  // ---------- 修图闯关 ----------
  Z.puzzles = {
    levels: {
      1: { title: "接上结束事件", goal: "Mia 的申请批下来了……然后呢？给流程一个像样的结尾。", lesson: "基础 101：五个 BPMN 图形",
        choices: ["○ 开始事件", "◉ 结束事件", "◇ 网关"],
        msg: { end: "令牌走到了结束事件：实例完成，Monitor 显示它已结束。", start: "开始事件用来开始一次运行，不能结束它。令牌无路可走，实例永远完成不了。", gw: "后面什么都没有的网关是一条死路：令牌到了这里，就永远等着。" } },
      2: { title: "选对网关", goal: "两项检查都必须在做决定之前完成。哪种网关能把工作分开、并等两边都做完？", lesson: "BPMN 要点：网关",
        choices: ["× 排他", "+ 并行", "○ 包容"],
        msg: { p: "并行（+）让两项检查都执行，收口的 + 等两边都做完，再去做决定。", x: "排他（×）只走一条路，所以身份检查被跳过了。决定是在只有一半事实的情况下做出的。", o: "包容（○）只走条件为真的那些路。如果两项检查总是都要做，并行（+）把这一点说得最清楚，也不会漏掉一项。" } },
      3: { title: "把上限放进规则", goal: "「500 美元以内自动批准。」下个月 Priya 要改这个上限。它应该放在哪里？", lesson: "基础 101：把决定从流程图里拿出来",
        choices: ["在网关里写「金额 ≤ 500」", "⚖️ 规则任务：采购上限", "所有申请都交给 Sam"],
        msg: { rule: "流程去问规则，按答案分路。上限变了，Priya 把规则 Hot Deploy 上去，没有人需要重新构建流程。", gw: "今天能跑，但上限被焊死在流程图里了。每次预算一变，就要出一个新的流程版本：构建、上传、启用、测试。", none: "什么都没有自动化：Sam 成了瓶颈，申请都在他的收件箱里排队。" } },
      4: { title: "加一个计时器", goal: "Sam 要休两周假。怎样才能不让 Mia 的申请一直等着？", lesson: "设计模式：计时升级",
        choices: ["✉ 消息开始事件", "什么都不加：就等着", "⏰ 任务上的计时器（24 小时）"],
        msg: { timer: "24 小时后计时器触发，申请转给 Sam 的代理人，Mia 这周就拿到电脑了。", msg: "消息开始事件用来启动一个新流程，不能挂在任务的边上。令牌卡在了 Sam 的收件箱里。", none: "令牌在 Sam 的收件箱里等了 14 天。每一个有截止时间的人工任务，都需要一个计时器和一条升级路径。" } },
      5: { title: "只把例外交给人", goal: "Sam 每份申请都要亲手看，连 12 美元的笔都不放过。改一改设计，让他只看需要判断的那些。", lesson: "设计模式：人工例外路径",
        choices: ["所有申请都交给 Sam", "全部自动批准", "⚖️ 规则 + 网关：只把例外转人工"],
        msg: { rule: "常规申请直接通过；只有例外才连同完整背景送到 Sam 那里。这就是人工例外路径。", auto: "很快，但完全没有控制。一旦批错一笔，审计就会问：是谁决定的，依据是什么？", all: "Sam 变成了盖章机，也成了瓶颈。把政策放进规则，只把需要判断的交给他。" } }
    },
    ui: { level: (n) => `第 ${n} 关`, pieces: "可放的零件", run: "▶ 运行", clear: "清除", fixed: "修好了。", notQuite: "还差一点。", hint: "提示：",
      next: (n) => `下一关：第 ${n} 关 →`, all: "<strong>五关全部修好。</strong><a href=\"#lab\">现在去动手实验里搭一个真的吧 →</a>",
      count: (n, m) => `修好 ${n} / ${m} 关`, done: (n, m) => `修好 ${n} / ${m} 关：你是流程修理工！🧩` }
  };

  // ---------- 本批示意图 ----------
  Object.assign(Z.dgCap, {
    "decision-table": ["一张决策表的结构", "左边是条件（IF），右边是结果（THEN）。在这个实验里，从上往下逐行检查，第一条匹配的行给出结果。"]
  });
  Object.assign(Z.dg, {
    // 决策表
    "Decision table": "决策表", "IF (conditions)": "IF（条件）", "THEN (result)": "THEN（结果）", "Credit score": "信用分", "Loan / income": "贷款 / 收入", "Outcome": "结果",
    "any": "任意", "otherwise": "其他情况", "DECLINE": "拒绝", "APPROVE": "批准", "REFER": "转人工",
    "Change a number here: the process itself stays the same.": "在这里改一个数字：流程本身保持不变。",
    // 修图闯关
    "Sam": "Sam", "Tap a piece below, then press Run.": "点下面的一个零件，再按「运行」。", "Decide": "做决定",
    "The closing gateway mirrors the opening one.": "收口的网关和开口的网关是同一种。", "Rule task": "规则任务", "purchase limit": "采购上限",
    "(no rule:": "（没有规则：", "limit is in": "上限写在", "the gateway)": "网关里）", "(no check)": "（不检查）", "amount ≤ 500?": "金额 ≤ 500？", "result?": "结果？",
    "Auto-approve": "自动批准", "Sam approves": "Sam 审批", "Then Priya raises the limit to $800…": "然后 Priya 把上限提高到 800 美元……",
    "✅ Hot Deploy the rule. The process is untouched.": "✅ Hot Deploy 规则即可。流程一点不用动。",
    "❌ Edit the gateway, build, upload, enable a new version.": "❌ 改网关、构建、上传、启用一个新版本。",
    "❌ Sam still checks every request, even $12 pens.": "❌ Sam 仍然要看每一份申请，连 12 美元的笔也不例外。",
    "Which piece makes this change easy?": "哪个零件能让这次修改变容易？", "Escalate to": "升级给", "Sam's deputy": "Sam 的代理人", "after 24 h": "24 小时后",
    "a start event cannot sit on a task": "开始事件不能放在任务上", "(no boundary event)": "（没有边界事件）", "Event: Sam is away for 14 days.": "事件：Sam 不在 14 天。",
    "Rule": "规则", "task": "任务", "exception": "例外", "everything": "所有申请", "Sam checks": "Sam 审核",
    "Out of 100 requests (illustrative):": "每 100 份申请里（示意）：", "✅ about 90 approved by the rule, about 10 to Sam": "✅ 约 90 份由规则批准，约 10 份交给 Sam",
    "Every decision is logged.": "每个决定都有记录。", "❌ 100 approved, including a $9,000 laptop": "❌ 100 份全部批准，包括一台 9,000 美元的笔记本",
    "nobody looked at": "而且没有人看过", "❌ 100 tasks in Sam's inbox": "❌ Sam 的收件箱里有 100 个任务", "Requests wait days; Sam rubber-stamps.": "申请要等好几天；Sam 只能盖章了事。",
    "Which design sends Sam only the hard ones?": "哪种设计只把难的交给 Sam？", "Level 1": "第 1 关", "Level 2": "第 2 关", "Level 3": "第 3 关", "Level 4": "第 4 关", "Level 5": "第 5 关"
  });
})(window.ZH);
