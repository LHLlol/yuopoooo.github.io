export type PortfolioCategoryId =
  | "handdrawn-graphic"
  | "animation"
  | "video"
  | "script";

export type AigcWorkflowStage = {
  title: string;
  tools: string;
  detail: string;
};

export type PromptExample = {
  shot: string;
  title: string;
  visualPrompt: string;
  motionPrompt: string;
  control: string;
};

export type StoryboardInfo = {
  title: string;
  summary: string;
  document: string;
  images: string[];
};

export type PortfolioItem = {
  id: string;
  titleCN: string;
  titleEN: string;
  category: PortfolioCategoryId;
  year: string;
  role: string;
  description: string;
  coverImage: string;
  images: string[];
  previewImages: string[];
  sourcePage: number;
  tags: string[];
  partLabel: string;
  categorySubtitle: string;
  highlights: string[];
  responsibilities: string[];
  aigcWorkflow?: AigcWorkflowStage[];
  promptExamples?: PromptExample[];
  storyboard?: StoryboardInfo;
};

export type PortfolioCategory = {
  id: PortfolioCategoryId;
  titleCN: string;
  titleEN: string;
  intro: string;
  partLabel: string;
  categorySubtitle: string;
};

type WorkOptions = {
  year?: string;
  role?: string;
  coverImage?: string;
  images?: string[];
  previewImages?: string[];
  highlights?: string[];
  responsibilities?: string[];
  aigcWorkflow?: AigcWorkflowStage[];
  promptExamples?: PromptExample[];
  storyboard?: StoryboardInfo;
};

const imageForPage = (page: number) => "portfolio/page-" + String(page).padStart(2, "0") + ".webp";
const handdrawnExtra = "portfolio/handdrawn-graphic/handdrawn-graphic-extra-01.jpg";
const productDesignBoardImages = [
  "portfolio/product-design/product-design-board-01.jpg",
  "portfolio/product-design/product-design-board-02.jpg",
];
const productDesignCreativeRender = "portfolio/product-design/product-design-creative-render-01.jpg";
const aigcConceptSupplementImages = Array.from(
  { length: 4 },
  (_, index) => `portfolio/animation/aigc-concept-supplement/aigc-concept-page-${String(index + 1).padStart(2, "0")}.webp`,
);
const huanyuStoryboardImages = Array.from(
  { length: 5 },
  (_, index) => `portfolio/animation/huanyu-jixi/storyboard/huanyu-jixi-storyboard-${String(index + 1).padStart(2, "0")}.webp`,
);
const xianniStoryboardImages = Array.from(
  { length: 3 },
  (_, index) => `portfolio/animation/xianni-xunmu/storyboard/xianni-xunmu-storyboard-${String(index + 1).padStart(2, "0")}.webp`,
);

const categoryMeta: Record<PortfolioCategoryId, Pick<PortfolioCategory, "partLabel" | "categorySubtitle">> = {
  "handdrawn-graphic": {
    partLabel: "Part 1",
    categorySubtitle: "Hand-drawn & Graphic Design / 手绘与平面设计",
  },
  animation: {
    partLabel: "Part 2",
    categorySubtitle: "AIGC Concept Animation / AIGC 概念动画创意",
  },
  video: {
    partLabel: "Part 3",
    categorySubtitle: "Video Creation / 视频创作",
  },
  script: {
    partLabel: "Part 4",
    categorySubtitle: "Script & Storyboard / 编剧与分镜",
  },
};

const createWork = (
  page: number,
  category: PortfolioCategoryId,
  titleCN: string,
  titleEN: string,
  tags: string[],
  description: string,
  options: WorkOptions = {},
): PortfolioItem => {
  const baseImage = imageForPage(page);
  const images = options.images ?? [baseImage];

  return {
    id: "work-" + String(page).padStart(2, "0"),
    titleCN,
    titleEN,
    category,
    year: options.year ?? "2026",
    role: options.role ?? "视觉设计 / 多媒介创作",
    description,
    coverImage: options.coverImage ?? images[0],
    images,
    previewImages: options.previewImages ?? images,
    sourcePage: page,
    tags,
    partLabel: categoryMeta[category].partLabel,
    categorySubtitle: categoryMeta[category].categorySubtitle,
    highlights: options.highlights ?? ["视觉表达", "版面组织", "叙事呈现"],
    responsibilities: options.responsibilities ?? ["视觉概念提炼", "画面与版式组织", "多媒介输出整理"],
    aigcWorkflow: options.aigcWorkflow,
    promptExamples: options.promptExamples,
    storyboard: options.storyboard,
  };
};

export const portfolioCategories: PortfolioCategory[] = [
  {
    id: "handdrawn-graphic",
    titleEN: "Hand-drawn & Graphic Design",
    titleCN: "手绘与平面设计",
    intro: "以手绘表达、活动主视觉、品牌延展和海报系统为核心，呈现图形语言、版面控制与视觉叙事能力。",
    ...categoryMeta["handdrawn-graphic"],
  },
  {
    id: "animation",
    titleEN: "AIGC Concept Animation",
    titleCN: "AIGC 概念动画创意",
    intro: "聚焦 AIGC 驱动的动画概念开发、角色与场景设定、分镜拆解及动态影像实验，呈现从视觉构思、生成迭代到镜头一致性和后期整合的完整创作能力。",
    ...categoryMeta.animation,
  },
  {
    id: "video",
    titleEN: "Video Creation",
    titleCN: "视频方向",
    intro: "围绕影像拍摄、剪辑、调色与视觉包装，呈现视频创作中的节奏控制、画面情绪和传播落地能力。",
    ...categoryMeta.video,
  },
  {
    id: "script",
    titleEN: "Script Design",
    titleCN: "编剧设计",
    intro: "以剧本结构、故事段落、分镜设计和场景调度为核心，呈现从文本到视觉画面的转译能力。",
    ...categoryMeta.script,
  },
];

export const portfolioItems: PortfolioItem[] = [
  createWork(
    4,
    "handdrawn-graphic",
    "耳集一绘",
    "Ear One",
    ["Hand-drawn", "Illustration", "Narrative"],
    "围绕角色、场景与氛围展开的手绘叙事练习，通过线条密度、构图层次和画面留白建立故事感，体现基础造型与视觉叙事能力。",
    {
      role: "手绘创作 / 角色与场景设定",
      images: [imageForPage(4), imageForPage(6), imageForPage(8)],
      highlights: ["手绘线稿", "角色场景", "画面叙事"],
      responsibilities: ["完成角色与场景线稿绘制", "控制画面层次与黑白关系", "将故事氛围转化为视觉画面"],
    },
  ),
  createWork(
    5,
    "handdrawn-graphic",
    "布谷",
    "Achoo",
    ["Setup", "Exhibition", "Graphic"],
    "以展陈式视觉组织呈现平面作品，关注图像、空间和观看节奏之间的关系，让单张视觉延展为具有场域感的展示系统。",
    {
      role: "平面设计 / 展示视觉",
      highlights: ["展陈视觉", "版式节奏", "图像组织"],
      responsibilities: ["梳理作品展示结构", "完成图文版式与空间节奏设计", "统一平面视觉和观看路径"],
    },
  ),
  createWork(
    7,
    "handdrawn-graphic",
    "手绘表现作品集",
    "Hand-drawn Expression",
    ["Illustration", "Graphic", "Poster"],
    "以黑白线稿、插画海报和主题视觉为主体，展示手绘表现、图形构成、角色造型与画面叙事的综合能力。",
    {
      role: "插画设计 / 海报设计 / 手绘表达",
      coverImage: handdrawnExtra,
      images: [handdrawnExtra, imageForPage(7)],
      highlights: ["黑白线稿", "海报构成", "主题视觉"],
      responsibilities: ["完成手绘线稿与主题海报绘制", "控制人物、场景和图形层次", "将插画内容整理为可展示的作品页面"],
    },
  ),
  createWork(
    9,
    "handdrawn-graphic",
    "国际大学生配音大赛视觉系统",
    "International Dubbing Contest Visual System",
    ["Graphic Design", "Visual Identity", "Event"],
    "为第五届国际大学生配音大赛搭建活动视觉系统，完成主视觉喷绘、线上直播素材与赛事周边延展，让赛事传播在屏幕、现场和物料中保持统一识别。",
    {
      year: "2024",
      role: "核心视觉设计 / 活动物料延展 / 线上素材输出",
      images: [imageForPage(9), imageForPage(10)],
      highlights: ["赛事主视觉", "周边延展", "直播素材"],
      responsibilities: ["完成赛事核心视觉与喷绘画面设计", "延展证件、手提袋、引导牌和服装周边", "整理线上直播与现场传播所需视觉素材"],
    },
  ),
  createWork(
    11,
    "handdrawn-graphic",
    "良渚论坛开幕式话剧视觉设计",
    "Liangzhu Forum Opening Play Visuals",
    ["Graphic Design", "Stage Visual", "Event"],
    "围绕良渚论坛开幕式话剧《施昕更：良渚1937》进行主视觉与落地物料设计，将历史叙事、人物关系和舞台场景统一到活动传播画面中。",
    {
      year: "2024",
      role: "主视觉设计 / 话剧海报 / 场景道具视觉",
      images: [imageForPage(11), imageForPage(12)],
      highlights: ["话剧主视觉", "签名墙设计", "舞台道具"],
      responsibilities: ["完成话剧主视觉喷绘与字体设计", "设计签名墙和角色海报视觉", "配合舞台道具、景片与现场落地画面输出"],
    },
  ),
  createWork(
    13,
    "handdrawn-graphic",
    "浙江传媒学院播音主持艺术学院毕业晚会视觉设计",
    "Zhejiang Communication Graduation Gala Visuals",
    ["Graphic Design", "Event", "Visual Identity"],
    "为浙江传媒学院播音主持艺术学院毕业晚会设计主视觉与相关物料，以 Blue Moment 为核心概念组织色彩、版式和毕业仪式感表达。",
    {
      year: "2025",
      role: "主视觉设计 / IP 设计 / 活动物料延展",
      images: [imageForPage(13)],
      highlights: ["毕业晚会", "Blue Moment", "物料系统"],
      responsibilities: ["完成毕业晚会主视觉喷绘设计", "延展头像、手幅、工牌等活动物料", "统一晚会视觉识别与现场传播画面"],
    },
  ),
  createWork(
    14,
    "handdrawn-graphic",
    "浙江轨道集团浙江省工程研究中心揭牌仪式视觉设计",
    "Zhejiang Rail Engineering Research Center Ceremony Visuals",
    ["Graphic Design", "Event", "Branding"],
    "为浙江轨道集团浙江省工程研究中心揭牌仪式完成主视觉与现场物料设计，突出轨道交通、工程研究和正式仪式场景的专业感。",
    {
      year: "2024",
      role: "主视觉设计 / 签名墙设计 / 仪式物料",
      images: [imageForPage(14)],
      highlights: ["揭牌仪式", "蓝色科技感", "现场物料"],
      responsibilities: ["完成揭牌仪式主视觉喷绘设计", "设计签名墙、桌牌、工作证与指引画面", "确保现场物料风格统一并适配仪式场景"],
    },
  ),
  createWork(
    15,
    "handdrawn-graphic",
    "品牌与活动延展",
    "Branding Extension",
    ["Branding", "Event", "Graphic"],
    "围绕活动与品牌主题进行多物料设计，在不同载体之间保持清晰的信息层级、统一的视觉识别和稳定的执行质量。",
    {
      role: "品牌设计 / 活动视觉",
      highlights: ["品牌延展", "活动物料", "视觉统一"],
      responsibilities: ["建立活动视觉基调", "完成主视觉与多尺寸物料延展", "协调信息层级和传播场景"],
    },
  ),
  createWork(
    31,
    "handdrawn-graphic",
    "产品设计版图输出",
    "Product Design Board Output",
    ["Product Design", "Graphic Design", "AIGC"],
    "围绕联通文创方向进行产品设计版图输出，将品牌符号、产品结构、使用场景和展示信息整合成完整的提案画面。",
    {
      year: "2025",
      role: "产品设计 / 版图输出 / 视觉提案",
      coverImage: productDesignBoardImages[0],
      images: productDesignBoardImages,
      highlights: ["产品版图", "联通文创", "提案输出"],
      responsibilities: ["整理产品概念、结构和使用场景", "完成产品展示版式与信息层级设计", "输出适合汇报与展示的产品设计画面"],
    },
  ),
  createWork(
    32,
    "handdrawn-graphic",
    "产品设计创意渲染图输出",
    "Creative Product Render Output",
    ["Product Design", "Rendering", "AIGC"],
    "以产品创意渲染为核心，探索包装、香氛、饮品、食品等不同场景下的视觉表现，用渲染画面强化产品概念和氛围表达。",
    {
      year: "2025",
      role: "创意渲染 / 产品视觉 / AIGC 画面输出",
      coverImage: productDesignCreativeRender,
      images: [productDesignCreativeRender],
      highlights: ["创意渲染", "产品氛围", "AIGC 输出"],
      responsibilities: ["提炼不同产品方向的视觉关键词", "完成产品渲染画面与场景氛围输出", "整理可用于作品展示的创意视觉合集"],
    },
  ),
  createWork(
    33,
    "animation",
    "AIGC 次世代概念设计《余烬之后》",
    "After the Embers",
    ["AIGC Concept Art", "Environment Design", "Visual Development"],
    "围绕末日灾后世界观进行场景视觉开发，包含幸存者营地、废弃住宅区、港口聚落与怪物危机场景。创作中先以手绘完成构图参考，再利用 AI 生成工具完成写实场景搭建与氛围探索，并通过光影控制、空间层次和镜头化构图强化画面叙事感。",
    {
      year: "2026",
      role: "AIGC 概念设计 / 场景视觉开发 / 镜头氛围设计",
      coverImage: aigcConceptSupplementImages[0],
      images: [aigcConceptSupplementImages[0]],
      highlights: ["末日世界观", "写实场景开发", "镜头化构图"],
      responsibilities: ["以手绘草图建立场景构图与视觉重点", "使用 AI 生成工具搭建营地、住宅区、港口与危机场景", "统一光影、空间层次和末日氛围，形成可用于动态漫与短片前期的视觉设定"],
      aigcWorkflow: [
        {
          title: "世界观与构图草案",
          tools: "Worldbuilding / Hand-drawn Layout",
          detail: "围绕灾后生存主题拆分营地、聚落、废墟和怪物危机等叙事节点，以手绘形式确定主体位置、空间关系与镜头视线。",
        },
        {
          title: "写实场景生成",
          tools: "AI Image Generation / Reference Control",
          detail: "依据构图草案生成不同环境方案，重点迭代建筑破损、生活痕迹、人物尺度和危险物体之间的叙事关系。",
        },
        {
          title: "氛围与连续性统一",
          tools: "Lighting / Color / Shot Design",
          detail: "通过冷暖光线、雾气、纵深和镜头景别统一场景风格，使多张概念图能够服务于连续的影视美术与动画前期开发。",
        },
      ],
    },
  ),
  createWork(
    34,
    "animation",
    "AIGC 国风叙事概念设计",
    "Chinese-style Narrative Concept Design",
    ["AIGC Concept Art", "Chinese Aesthetics", "Narrative Design"],
    "以传统服饰、古建空间、神话生物与山水意象构建国风叙事场景，通过暖金、朱红、雾蓝与水墨灰组织不同情绪段落，探索角色、环境和镜头氛围之间的关系，为动画短片、动态漫与影视前期视觉开发建立风格方向。",
    {
      year: "2026",
      role: "AIGC 场景概念 / 国风视觉开发 / 叙事氛围设计",
      coverImage: aigcConceptSupplementImages[1],
      images: [aigcConceptSupplementImages[1]],
      highlights: ["国风叙事", "神话意象", "场景氛围"],
      responsibilities: ["提炼人物、古建、山水与神话生物等核心视觉元素", "生成并筛选不同色彩与空间情绪的叙事场景", "统一角色气质、画面风格和镜头氛围，为后续分镜延展建立视觉参考"],
      aigcWorkflow: [
        {
          title: "国风视觉母题",
          tools: "Visual Research / Style Board",
          detail: "从古典服饰、楼阁、灯笼、云雾山水和神话生物中提炼视觉母题，明确传统意象与幻想叙事的融合方向。",
        },
        {
          title: "场景与色彩探索",
          tools: "AI Image Generation / Color Direction",
          detail: "并行生成暖金、朱红、雾蓝和水墨灰等不同色彩段落，比较人物尺度、空间层次与画面情绪。",
        },
        {
          title: "叙事镜头整理",
          tools: "Key Visual Selection / Sequence Design",
          detail: "筛选具有明确角色关系和视线引导的关键画面，整理为可继续发展分镜、动态漫或概念短片的视觉序列。",
        },
      ],
    },
  ),
  createWork(
    35,
    "animation",
    "AIGC 二次元角色设计《绮露》",
    "Qilu Anime Character Design",
    ["AIGC Character Design", "Anime", "Visual Development"],
    "围绕二次元幻想角色完成主形象、武器、表情与配饰设定，通过 AI 绘画工具进行角色生成与迭代优化，重点强化造型识别度、色彩统一性与细节完成度。该设计可服务于动画、动态漫及游戏项目中的角色视觉开发与分镜延展。",
    {
      year: "2026",
      role: "AIGC 角色设定 / 造型设计 / 视觉整合",
      coverImage: aigcConceptSupplementImages[2],
      images: [aigcConceptSupplementImages[2]],
      highlights: ["角色主形象", "武器与配饰", "表情设定"],
      responsibilities: ["建立角色轮廓、服装层次和紫粉色彩体系", "迭代主形象、武器、表情与配饰细节", "整理角色设定版面，为动画、动态漫和游戏分镜延展提供统一参考"],
      aigcWorkflow: [
        {
          title: "角色方向设定",
          tools: "Character Brief / Silhouette Design",
          detail: "确定幻想角色的年龄感、气质、轮廓与紫粉色彩体系，并以服装层次和发型结构建立识别点。",
        },
        {
          title: "生成与迭代优化",
          tools: "AI Painting / Reference Iteration",
          detail: "围绕主形象持续调整面部、服装、材质和比例，筛选造型稳定且细节完成度较高的角色方案。",
        },
        {
          title: "设定资产延展",
          tools: "Expression / Weapon / Accessory Design",
          detail: "将角色主形象延展至法杖、表情和配饰设定，统一图形语言与配色，为后续动作分镜和角色表演提供依据。",
        },
      ],
    },
  ),
  createWork(
    36,
    "animation",
    "AIGC 二维场景概念设计《旅途四季》",
    "Journey Through Four Seasons",
    ["AIGC Environment Design", "2D Animation", "Shot Design"],
    "视觉强调清晰的动画轮廓、柔和的色彩层次与具有导向性的场景结构。通过足迹、道路、田埂、光带与角色视线组织观众视线，形成明确的镜头推进逻辑，体现对二维动画美术风格、场景调度、镜头语言和 AIGC 动漫制作流程的综合把控。",
    {
      year: "2026",
      role: "AIGC 场景概念 / 二维动画美术 / 镜头设计",
      coverImage: aigcConceptSupplementImages[3],
      images: [aigcConceptSupplementImages[3]],
      highlights: ["四季场景", "二维动画美术", "视线引导"],
      responsibilities: ["设计梯田、森林、荒漠与雪境四类旅途场景", "通过道路、足迹、光带与角色视线组织画面动线", "统一动画轮廓和柔和色彩层次，为短片镜头推进与场景调度提供概念依据"],
      aigcWorkflow: [
        {
          title: "四季场景规划",
          tools: "Environment Brief / Visual Sequence",
          detail: "将旅途拆分为梯田、森林、荒漠和雪境四个环境段落，明确每一场景的角色位置、行进方向和情绪温度。",
        },
        {
          title: "二维风格生成",
          tools: "AI Image Generation / 2D Style Control",
          detail: "以清晰轮廓、柔和色彩和动画化空间为统一标准，迭代不同季节的植被、天气、地貌与光线表现。",
        },
        {
          title: "镜头动线强化",
          tools: "Composition / Eye-flow / Camera Planning",
          detail: "利用足迹、道路、田埂、光带和人物视线建立画面导向，使静态概念图具备明确的镜头推进逻辑和后续动态延展空间。",
        },
      ],
    },
  ),
  createWork(
    18,
    "animation",
    "可画·生成未来 AIGC 动画短片",
    "Generative Future AIGC Short Film",
    ["AIGC Animation", "Motion", "Visual Development"],
    "围绕生成式内容创作主题构建赛博城市、角色与品牌化动态画面，将概念设定、关键帧生成、图生视频和后期包装整合为短片制作流程。",
    {
      year: "2025",
      role: "AIGC 视觉开发 / 动态生成 / 剪辑包装",
      images: [imageForPage(19)],
      highlights: ["生成式动画", "赛博视觉", "动态包装"],
      responsibilities: ["在 Lovart 中完成情绪板、角色与场景方向探索", "将筛选后的关键帧输入 Seedance 系列模型进行镜头动态生成", "在后期中修复时序跳变并完成字幕、节奏和声音包装"],
      aigcWorkflow: [
        {
          title: "概念与视觉母版",
          tools: "Lovart / Moodboard / Reference Image",
          detail: "拆分赛博城市、角色状态、品牌色和镜头情绪，在多模型画布中并行探索构图与风格，筛选可作为后续镜头统一基准的视觉母版。",
        },
        {
          title: "关键帧一致性",
          tools: "Lovart / Image Reference / Prompt Iteration",
          detail: "固定角色轮廓、蓝粉配色、服装与城市光源关系，通过参考图和提示词迭代减少跨镜头的造型漂移。",
        },
        {
          title: "图生视频",
          tools: "Seedance Series / Image-to-Video",
          detail: "把关键帧作为视觉条件，分别描述主体动作、摄影机运动、速度和时间连续性，并以短镜头多版本生成方式控制动态结果。",
        },
        {
          title: "剪辑与动态包装",
          tools: "After Effects / Premiere Pro",
          detail: "对生成片段进行速度重映射、遮罩修复、转场与文字包装，统一镜头节奏、色彩和声音反馈。",
        },
      ],
      promptExamples: [
        {
          shot: "Scene 01",
          title: "赛博城市建立镜头",
          visualPrompt: "夜间未来都市，蓝紫与高饱和粉色霓虹，层叠电子屏幕和高楼形成纵深，二维动画质感，清晰轮廓光，宽银幕构图。",
          motionPrompt: "摄影机缓慢向前推进并轻微上摇，远处灯牌依次亮起，城市光带保持稳定透视，节奏由静至动。",
          control: "锁定建筑透视和主色，不新增文字与标志，避免楼体融化、灯牌闪烁跳变和镜头突然加速。",
        },
        {
          shot: "Scene 02",
          title: "角色坠落与转场",
          visualPrompt: "蓝发动画角色置于黑色空间与粉色发光图形之间，服装和发型保持参考图一致，强背光，动势构图。",
          motionPrompt: "角色缓慢下坠并产生轻微旋转，衣摆与头发受到空气阻力，镜头跟随下降，发光图形形成视线引导。",
          control: "保持面部结构、四肢数量和服装细节，不改变角色身份，避免肢体扭曲、背景纹理爬动和无关物体出现。",
        },
      ],
    },
  ),
  createWork(
    19,
    "animation",
    "寰宇极曦 AIGC 概念动画",
    "Huanyu Jixi AIGC Concept Film",
    ["AIGC Animation", "Storyboard", "Chinese Aesthetics"],
    "以中国古代物理发明与科学探索为叙事母题，通过 20 镜、约 101 秒的分镜设计，将浑天仪、手稿、日晷与人物思辨转译为融合二维、三维和生成式影像的概念短片。",
    {
      year: "2025",
      role: "分镜设计 / AIGC 视觉开发 / 动态生成与后期",
      images: [imageForPage(17), imageForPage(18)],
      highlights: ["20 镜分镜", "AIGC 动画流程", "竞赛获奖"],
      responsibilities: ["将科学史文本拆解为意象、景别、时长和运镜明确的 20 镜分镜", "在 Lovart 中建立青铜、纸张、日晷和黑白空间的材质与光线体系", "使用 Seedance 系列模型生成镜头动态，并完成时序修复、剪辑、字幕与声音设计"],
      aigcWorkflow: [
        {
          title: "叙事拆解与镜头规划",
          tools: "Script Breakdown / Previs Shot",
          detail: "将古代物理发展史提炼为浑天仪、物理启蒙、手稿、日晷与文明群像等视觉节点，明确 20 个镜头的景别、时长、音效和运镜。",
        },
        {
          title: "Lovart 视觉开发",
          tools: "Lovart / Style Board / Multi-model Exploration",
          detail: "围绕青铜流光、黑白极简空间、漂浮纸张和金色曦光建立情绪板，在同一画布中比较构图、材质和光线方案，形成稳定的视觉基准。",
        },
        {
          title: "关键帧与一致性控制",
          tools: "Reference Image / Prompt Iteration / Keyframe Selection",
          detail: "先生成静态关键帧，再锁定主体比例、镜头轴线、色温与材质关键词；通过参考图复用和负向约束控制跨镜头的风格漂移。",
        },
        {
          title: "Seedance 动态生成",
          tools: "Seedance Series / Image-to-Video",
          detail: "把关键帧与分镜运镜说明组合为动态提示词，分别控制环绕、推远、上摇和静止镜头，并通过多版本短片段测试选择运动最稳定的结果。",
        },
        {
          title: "后期整合与人工修复",
          tools: "After Effects / Premiere Pro / Sound Design",
          detail: "对生成结果进行镜头裁切、速度重映射、局部遮罩和帧间修复，再统一字幕、色彩、环境音与音乐节奏，确保叙事连续性由人工判断主导。",
        },
      ],
      promptExamples: [
        {
          shot: "Shot 01 · 6s",
          title: "浑天仪开场",
          visualPrompt: "青铜铸造的中国古代浑天仪立于地平线，龙首结构庄严，东方日出，金红曦光沿铜制纹理流动，史诗感，低饱和天空，电影级体积光。",
          motionPrompt: "摄影机缓慢向下并绕主体旋转，太阳从地平线稳定升起，金属反光随视角自然变化，节奏肃穆。",
          control: "保持浑天仪结构完整和地平线稳定，不增加现代机械，不改变龙首数量，避免金属形体融化和日轮跳动。",
        },
        {
          shot: "Shot 02 · 7s",
          title: "物理启蒙",
          visualPrompt: "人物背对镜头站在极简黑色竖条空间，顶部单一白色光源，黑白几何与微弱色彩渐变，超现实主义，存在主义氛围，强烈纵深。",
          motionPrompt: "摄影机缓慢环绕并轻微上升，人物保持静止，顶部光束稳定，空间条状结构产生克制视差。",
          control: "锁定人物背影和竖直结构，禁止面部转向镜头，避免多余人物、光源漂移和背景弯曲。",
        },
        {
          shot: "Shot 03 · 6s",
          title: "手稿飘扬",
          visualPrompt: "古代物理手稿悬浮在黑白空间，隔栏光影投射地面，宣纸纤维与墨迹清晰，纸页像凝固思绪在现实与想象之间漂浮。",
          motionPrompt: "固定镜头，纸张以不同相位缓慢浮动和轻微旋转，光影保持方向一致，不产生强风感。",
          control: "保持纸张文字和边缘稳定，不生成现代印刷物，不让纸页互相穿插，避免墨迹闪烁。",
        },
        {
          shot: "Shot 06 · 3s",
          title: "日晷群像",
          visualPrompt: "大量中国古代日晷整齐延伸至画面尽头，长影形成秩序化抽象图案，冷白地面与金色斜光，宏观俯瞰，天人合一的哲学意象。",
          motionPrompt: "摄影机持续升高并向后拉远，从单个日晷揭示成规模群体，阴影缓慢移动，构图中心保持稳定。",
          control: "保持日晷朝向和排列规律，禁止随机增生与重叠，避免阴影方向不一致和地面纹理抖动。",
        },
      ],
      storyboard: {
        title: "《寰宇极曦》20 镜分镜表",
        summary: "全片约 101 秒，分镜记录画面、景别、时长、内容、音效与运镜。前七镜完成从科学器物到文明群像的序章，后续镜头继续推进传统科学意象与现代视觉语言的融合。",
        document: "portfolio/animation/huanyu-jixi/huanyu-jixi-storyboard.pdf",
        images: huanyuStoryboardImages,
      },
    },
  ),
  createWork(
    20,
    "animation",
    "衔泥寻木 AIGC 建筑动画",
    "Xianni Xunmu AIGC Architecture Film",
    ["AIGC Animation", "Architecture", "Clay Style"],
    "以两只北归燕子的迁徙为线索，用五幕结构串联福建土楼、江南园林、赵州桥、悬空寺、应县木塔、长城与紫禁城，在宏大建筑和微小生命的对照中讲述归宿与空间。",
    {
      year: "2026",
      role: "叙事分镜 / AIGC 场景生成 / 图生视频与剪辑",
      images: [imageForPage(20), imageForPage(21)],
      highlights: ["五幕建筑叙事", "粘土定格风格", "Seedance 动态生成"],
      responsibilities: ["研究不同建筑的结构识别点并拆解为五幕镜头脚本", "在 Lovart 中建立粘土定格材质、燕子角色和建筑比例的一致性规范", "使用 Seedance 系列模型实现飞行跟随、FPV 穿越、贴水横移和航拍推进等复杂运镜"],
      aigcWorkflow: [
        {
          title: "建筑研究与五幕叙事",
          tools: "Architecture Research / Story Structure",
          detail: "以聚与圆、水与木、力学奇迹、尺度与脊梁、序与归为五幕主题，提取土楼圆形天井、马头墙、敞肩拱、斗拱和中轴线等建筑识别点。",
        },
        {
          title: "Lovart 风格与资产开发",
          tools: "Lovart / Clay Style Board / Character Reference",
          detail: "建立粘土定格材质、燕子角色比例、云层和植被的视觉规范；在多模型画布中对建筑构图进行方案比较，兼顾结构准确性与风格化表达。",
        },
        {
          title: "镜头级提示词工程",
          tools: "Visual Prompt / Camera Prompt / Negative Constraints",
          detail: "每个镜头分开描述主体、建筑、天气、景别、镜头运动和禁止项，把画面生成与动态生成拆成可迭代的参数模块。",
        },
        {
          title: "Seedance 图生视频",
          tools: "Seedance Series / Image-to-Video / Reference Frame",
          detail: "以关键帧为视觉条件生成燕子飞行和建筑穿越镜头，重点测试 FPV、贴水跟随、垂直拉升与航拍中轴推进的空间连续性。",
        },
        {
          title: "连续性修复与成片",
          tools: "After Effects / Premiere Pro / Sound Design",
          detail: "筛选动作连贯版本，修复燕子形态、建筑边缘和光线跳变，通过剪辑节奏、环境音和转场把不同地域场景组织为完整旅程。",
        },
      ],
      promptExamples: [
        {
          shot: "Sc1-02 · 6s",
          title: "屋檐燕巢",
          visualPrompt: "极度特写，福建土楼高层粗壮榫卯木梁交接处，泥巴与枯草燕巢卡在缝隙，一只刚破壳的黑色雏燕探头，粘土定格动画质感，初春暖色晨光，木纹清晰。",
          motionPrompt: "固定微距镜头，浅景深，雏燕轻微抬头和呼吸，背景保持柔和虚化，动作克制自然。",
          control: "锁定燕巢位置、雏燕数量和木梁结构，不出现现代材料，避免羽毛闪烁、木纹爬动和角色突然变形。",
        },
        {
          shot: "Sc1-03 · 12s",
          title: "冲破天际",
          visualPrompt: "两只燕子飞入福建土楼巨大的圆形内部空间，木柱与红灯笼形成环形纵深，顶部屋檐框住圆形蓝天，粘土定格风格，晨光逐渐增强。",
          motionPrompt: "FPV 穿越机视角高速跟随燕子，穿过灯笼和木柱后急速上摇，最终冲向圆形天空并以强光转场。",
          control: "保持两只燕子全程可辨识，锁定土楼圆形结构和飞行方向，避免碰撞穿模、额外鸟群和镜头无规律旋转。",
        },
        {
          shot: "Sc3-01 · 10s",
          title: "风雨孤桥",
          visualPrompt: "暴雨中的赵州桥远景，乌云冷蓝灰黑，江水翻涌如巨龙，两只燕子逆风飞行，单孔石桥和敞肩小拱结构清晰，粘土定格电影质感。",
          motionPrompt: "摄影机在燕子侧方平行跟随，加入轻微受控震动表现狂风，水流持续向前，远处石桥缓慢接近。",
          control: "保持赵州桥结构准确，不改变桥孔数量，燕子不消失，禁止桥体软化、水面穿透和随机闪电遮挡主体。",
        },
        {
          shot: "Sc5-01 · 12s",
          title: "皇家秩序",
          visualPrompt: "晨曦金光照亮紫禁城红墙黄瓦，两只燕子沿笔直中轴线飞行，下方宫殿群与广场极度对称，宏大航拍大全景，粘土定格建筑模型质感。",
          motionPrompt: "航拍镜头沿中轴线庄重缓慢推进，燕子保持前方引导位置，云层和阳光变化平稳，空间尺度逐渐展开。",
          control: "锁定中轴对称和宫殿排列，不新增现代城市元素，避免屋顶扭曲、燕子数量变化和镜头横向漂移。",
        },
      ],
      storyboard: {
        title: "《衔泥寻木》五幕建筑意象分镜表",
        summary: "分镜以燕子迁徙串联七类中国传统建筑意象，记录每镜时长、视觉提示词和摄影机运动，为 Lovart 关键帧开发与 Seedance 动态生成提供镜头级输入。",
        document: "portfolio/animation/xianni-xunmu/xianni-xunmu-storyboard.pdf",
        images: xianniStoryboardImages,
      },
    },
  ),
  createWork(
    23,
    "video",
    "婺剧非遗影像剪辑",
    "Wuju Heritage Video Editing",
    ["Video", "Film", "Editing"],
    "在江山市婺剧研究院实习期间，独立完成约 6 分钟非遗微电影后期剪辑与调色，整合采访、演出与场馆素材，让影像服务于传统戏曲传播。",
    {
      year: "2025",
      role: "视频剪辑 / 调色 / 字幕与基础包装",
      images: [imageForPage(23), imageForPage(24)],
      highlights: ["6 分钟成片", "非遗传播", "场馆展示"],
      responsibilities: ["整理采访与演出素材", "完成剪辑节奏、调色和字幕处理", "输出适配场馆播放的完整成片"],
    },
  ),
  createWork(
    24,
    "video",
    "影像片段与场景",
    "Video Scene Collection",
    ["Video", "Scene", "Cinematography"],
    "通过多场景画面组织呈现视频项目的视觉质感、取景方式和影像氛围，强调镜头间的节奏衔接。",
    {
      role: "视频拍摄 / 场景组织",
      highlights: ["场景取景", "光影控制", "影像氛围"],
      responsibilities: ["进行场景素材梳理", "调整画面节奏与光影关系", "组织适合传播展示的视频画面"],
    },
  ),
  createWork(
    25,
    "video",
    "城市与人物影像",
    "Urban & Character Film",
    ["Video", "Urban", "Character"],
    "以城市空间和人物状态为线索，呈现视频创作中的观察视角、镜头组织与节奏控制。",
    {
      role: "视频创作 / 影像观察",
      highlights: ["城市影像", "人物状态", "节奏组织"],
      responsibilities: ["完成画面取景与素材选择", "组织人物与空间关系", "以剪辑节奏强化影像叙事"],
    },
  ),
  createWork(
    27,
    "script",
    "施昕更：良渚1937 视觉与分镜",
    "Liangzhu 1937 Storyboard & Stage Visuals",
    ["Storyboard", "Script", "Stage"],
    "参与六幕音诗话剧《施昕更：良渚1937》的视觉与舞台设计，将良渚文明、历史叙事与舞台场景转化为主视觉、分镜和投影视觉。",
    {
      year: "2025",
      role: "舞台视觉设计 / 分镜设计 / 物料设计",
      images: [imageForPage(27), imageForPage(28), imageForPage(29)],
      highlights: ["舞台分镜", "主视觉设计", "历史叙事"],
      responsibilities: ["完成舞台场景分镜和投影视觉整理", "参与主视觉与宣传物料设计", "将剧本段落转译为舞台视觉方案"],
    },
  ),
  createWork(
    28,
    "script",
    "分镜剧本",
    "Script Writing",
    ["Script", "Writing", "Storyboard"],
    "围绕故事结构、段落节奏和文本组织展开，展示脚本创作、情节推进与视觉化叙事能力。",
    {
      role: "剧本创作 / 文本设计",
      highlights: ["故事结构", "文本组织", "叙事节奏"],
      responsibilities: ["梳理故事段落与冲突结构", "撰写分镜相关文本", "将剧本节奏对应到画面推进"],
    },
  ),
  createWork(
    29,
    "script",
    "分镜制作文档",
    "Storyboard Production",
    ["Storyboard", "Production", "Planning"],
    "通过分镜与制作规划呈现项目推进方式，体现镜头组织、执行路径与跨媒介协作思路。",
    {
      role: "分镜制作 / 项目规划",
      highlights: ["制作规划", "镜头组织", "执行思路"],
      responsibilities: ["整理镜头和场景信息", "建立分镜制作顺序", "辅助项目从文本进入视觉执行"],
    },
  ),
];

export const featuredWorks = ["work-07", "work-09", "work-19", "work-20", "work-23", "work-27"];

export const getFeaturedItems = () =>
  featuredWorks
    .map((id) => portfolioItems.find((item) => item.id === id))
    .filter((item): item is PortfolioItem => Boolean(item));

export const getCategoryById = (categoryId: PortfolioCategoryId) =>
  portfolioCategories.find((category) => category.id === categoryId);

export const getItemsByCategory = (categoryId: PortfolioCategoryId) =>
  portfolioItems.filter((item) => item.category === categoryId);

export const getPortfolioItemById = (id: string) =>
  portfolioItems.find((item) => item.id === id);
