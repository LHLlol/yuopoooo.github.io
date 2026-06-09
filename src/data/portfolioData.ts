export type PortfolioCategoryId =
  | "handdrawn-graphic"
  | "animation"
  | "video"
  | "script";

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
};

const imageForPage = (page: number) => "portfolio/page-" + String(page).padStart(2, "0") + ".webp";
const handdrawnExtra = "portfolio/handdrawn-graphic/handdrawn-graphic-extra-01.jpg";

const categoryMeta: Record<PortfolioCategoryId, Pick<PortfolioCategory, "partLabel" | "categorySubtitle">> = {
  "handdrawn-graphic": {
    partLabel: "Part 1",
    categorySubtitle: "Hand-drawn & Graphic Design / 手绘与平面设计",
  },
  animation: {
    partLabel: "Part 2",
    categorySubtitle: "Animation / 二维三维动画",
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
    titleEN: "Animation",
    titleCN: "二维三维动画方向",
    intro: "聚焦概念设定、关键画面、三维场景与动态影像实验，展示从世界观到镜头画面的构建能力。",
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
    "为国际大学生配音大赛搭建活动视觉系统，完成核心视觉、海报喷绘、服装周边、视频包装及开闭幕式相关物料，在短周期内支撑大型赛事传播与现场使用。",
    {
      year: "2024",
      role: "核心视觉设计 / 活动物料延展 / 动效包装协作",
      images: [imageForPage(9), imageForPage(10), imageForPage(11), imageForPage(12), imageForPage(13), imageForPage(14)],
      highlights: ["24 张视觉物料", "9 件周边延展", "大型活动传播"],
      responsibilities: ["完成赛事核心视觉与喷绘海报设计", "延展服装、IP 周边与线上传播物料", "参与视频和开闭幕式动效包装输出"],
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
    17,
    "animation",
    "概念设定",
    "Concept Art Set",
    ["Concept Art", "Animation", "Scene"],
    "通过概念图和场景设定建立动画世界观，强调空间关系、材质情绪和镜头氛围，为后续动画画面提供视觉基础。",
    {
      role: "概念设计 / 场景设定",
      images: [imageForPage(17)],
      highlights: ["世界观构建", "场景视觉", "镜头氛围"],
      responsibilities: ["提炼故事视觉关键词", "绘制场景与气氛图", "建立动画画面的风格参考"],
    },
  ),
  createWork(
    18,
    "animation",
    "动画关键画面",
    "Animation Key Visuals",
    ["Animation", "Motion", "Key Visual"],
    "通过多组关键画面呈现动画叙事节奏与视觉风格，展示镜头画面、角色状态和动态影像的情绪控制能力。",
    {
      role: "动画视觉 / 关键帧设计",
      images: [imageForPage(18)],
      highlights: ["关键画面", "叙事节奏", "影像风格"],
      responsibilities: ["设计动画关键帧画面", "梳理镜头节奏与画面变化", "统一角色状态和视觉氛围"],
    },
  ),
  createWork(
    19,
    "animation",
    "寰宇极曦概念动画实验",
    "AIGC Animation Practice",
    ["Motion", "AIGC", "Editing"],
    "以概念动画短片为基础，将传统动画思维与 AIGC 视觉生成结合，用于创意发散、画面验证和动态影像表达。",
    {
      year: "2025",
      role: "AIGC 视觉生成 / 动态影像实验",
      images: [imageForPage(19), imageForPage(21)],
      highlights: ["AIGC 生成", "动态节奏", "竞赛获奖"],
      responsibilities: ["进行提示词迭代与视觉生成", "整理关键画面与动态节奏", "参与短片视觉风格和成片表达优化"],
    },
  ),
  createWork(
    20,
    "animation",
    "三维场景构建",
    "3D Scene Building",
    ["3D", "Environment", "Animation"],
    "围绕三维场景、建筑结构与空间叙事展开，体现建模、构图和场景氛围控制能力。",
    {
      role: "三维设计 / 场景构建",
      highlights: ["3D 场景", "空间叙事", "视觉氛围"],
      responsibilities: ["建立三维场景结构", "控制空间透视与光影氛围", "输出适合动画展示的场景画面"],
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
