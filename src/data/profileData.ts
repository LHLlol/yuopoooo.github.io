export type ProfileData = {
  nameCN: string;
  nameEN: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  avatar: string;
  summary: string;
  education: {
    school: string;
    major: string;
    period: string;
  };
  focusAreas: string[];
  skills: string[];
  software: string[];
  experiences: {
    title: string;
    organization: string;
    period: string;
    description: string;
  }[];
  achievements: string[];
};

export const profileData: ProfileData = {
  nameCN: "林洪乐",
  nameEN: "Lin Hongle",
  role: "视觉设计 / 动画影像 / AIGC 创意实践",
  location: "Hangzhou, Zhejiang",
  email: "lhl20040919@gmail.com",
  phone: "18806535299",
  avatar: "profile/avatar.png",
  summary:
    "动画专业本科背景，长期关注视觉设计、动态影像与新型内容生产方式。具备从手绘草图、视觉系统、活动主视觉到剪辑包装、三维辅助和 AIGC 生成的综合创作能力，能够把概念快速转译成可执行、可传播、可落地的视觉方案。",
  education: {
    school: "杭州师范大学",
    major: "动画 · 本科",
    period: "2022.09 - 2026.06",
  },
  focusAreas: [
    "Graphic Design",
    "Visual Identity",
    "Illustration",
    "Animation",
    "Video Editing",
    "AIGC",
    "ViBeCoding",
    "Storyboard",
    "Motion Design",
  ],
  skills: [
    "主视觉与活动物料设计",
    "手绘表现与角色场景设定",
    "二维三维动画概念表达",
    "视频剪辑、调色与字幕包装",
    "AIGC 图像生成与提示词迭代",
    "AI 视频与自然语言编程辅助创作",
  ],
  software: ["Photoshop", "Illustrator", "Premiere Pro", "After Effects", "Blender", "Cinema 4D", "ComfyUI", "Codex"],
  experiences: [
    {
      title: "视觉创意设计师 / 个人设计 IP 运营",
      organization: "杭州奇幻狂想文化传媒有限公司",
      period: "2024.01 - 2024.11",
      description:
        "参与商业视觉、活动主视觉与内容账号视觉运营，负责从概念提案、画面设计到多平台物料延展的完整输出。",
    },
    {
      title: "编导实习生",
      organization: "江山市婺剧研究院",
      period: "2025.07 - 2025.08",
      description:
        "独立完成婺剧非遗微电影后期剪辑与调色，整合采访素材、字幕节奏和基础视觉包装，让影像服务于场馆传播与公众展示。",
    },
    {
      title: "融媒体中心主席",
      organization: "文化创意与传媒学院",
      period: "2022.11 - 2025.06",
      description:
        "统筹学院新媒体内容生产、视觉发布与团队协作，在长期校园传播项目中积累稳定的设计执行和沟通推进经验。",
    },
  ],
  achievements: [
    "概念动画短片《寰宇极曦》获中国大学生计算机大赛动画专业组三等奖。",
    "《数字化传播的技术设计与应用研究——以温州蓝夹缬技艺为例》获本科生科研项目立项。",
    "AIGC 应用系列作品《联通文创》在中国大学生广告艺术节学院奖省赛奖项推送国赛。",
  ],
};
