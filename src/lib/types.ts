// Human 3.0 评估系统 - 核心类型定义

// 四个生命象限
export type Quadrant = 'Mind' | 'Body' | 'Spirit' | 'Vocation';

export const QuadrantLabels: Record<Quadrant, string> = {
  Mind: '心智',
  Body: '身体',
  Spirit: '精神',
  Vocation: '使命',
};

export const QuadrantLabelsEn: Record<Quadrant, string> = {
  Mind: 'Mind',
  Body: 'Body',
  Spirit: 'Spirit',
  Vocation: 'Vocation',
};

export const QUADRANT_ORDER: Quadrant[] = [
  'Mind',
  'Body',
  'Spirit',
  'Vocation',
];

export const QuadrantDescriptions: Record<Quadrant, string> = {
  Mind: '个人心理世界 - 思想、情感、信念、世界观',
  Body: '个人物理世界 - 健康、体能、营养、精力',
  Spirit: '集体心理世界 - 关系、意义、社群、归属',
  Vocation: '集体物理世界 - 事业、价值创造、影响力',
};

// 三个意识等级
export type Level = 'Conformist' | 'Individualist' | 'Synthesist';
export type LevelNumber = 1 | 2 | 3;

export const LevelLabels: Record<Level, string> = {
  Conformist: '从众者 (1.0)',
  Individualist: '个体者 (2.0)',
  Synthesist: '整合者 (3.0)',
};

export const LevelLabelsEn: Record<Level, string> = {
  Conformist: 'Conformist (1.0)',
  Individualist: 'Individualist (2.0)',
  Synthesist: 'Synthesist (3.0)',
};

export const LevelDescriptions: Record<Level, string> = {
  Conformist: '遵循权威和传统，非黑即白的思维，基于外部验证',
  Individualist: '拒绝从众，追求个人目标，自我导向但常常反应性叛逆',
  Synthesist: '整合多元视角，在悖论和复杂中发现真理，创造新游戏',
};

// 每个等级内的三个发展阶段
export type Phase = 'Dissonance' | 'Uncertainty' | 'Discovery';
export type PhaseNumber = 1 | 2 | 3;

export const PhaseLabels: Record<Phase, string> = {
  Dissonance: '失调期',
  Uncertainty: '探索期',
  Discovery: '发现期',
};

export const PhaseLabelsEn: Record<Phase, string> = {
  Dissonance: 'Dissonance',
  Uncertainty: 'Uncertainty',
  Discovery: 'Discovery',
};

export const PhaseDescriptions: Record<Phase, string> = {
  Dissonance: '当前阶段的益处已耗尽，感到躁动、无聊或微妙的沮丧',
  Uncertainty: '踏入未知领域，尝试新方法，收集信息和经验',
  Discovery: '找到有效的资源、洞见或实践，正在整合新能力',
};

// 三个特质维度
export type Trait = 'Knowledge' | 'Experience' | 'Skill';
export type TraitLevel = 'Low' | 'Medium' | 'High';

export const TraitLabels: Record<Trait, string> = {
  Knowledge: '知识',
  Experience: '经验',
  Skill: '技能',
};

export const TraitLabelsEn: Record<Trait, string> = {
  Knowledge: 'Knowledge',
  Experience: 'Experience',
  Skill: 'Skill',
};

// 生活方式原型
export type LifestyleArchetype =
  | 'Workaholic'
  | 'Seeker'
  | 'Optimizer'
  | 'Drifter'
  | 'Specialist'
  | 'Integrated';

export const LifestyleArchetypeLabels: Record<LifestyleArchetype, string> = {
  Workaholic: '工作狂',
  Seeker: '探索者',
  Optimizer: '优化者',
  Drifter: '漂泊者',
  Specialist: '专家',
  Integrated: '整合者',
};

export const LifestyleArchetypeLabelsEn: Record<LifestyleArchetype, string> = {
  Workaholic: 'Workaholic',
  Seeker: 'Seeker',
  Optimizer: 'Optimizer',
  Drifter: 'Drifter',
  Specialist: 'Specialist',
  Integrated: 'Integrator',
};

export const LifestyleArchetypeDescriptions: Record<LifestyleArchetype, string> = {
  Workaholic: '使命消耗80%+精力，心智疲惫、身体忽视、精神空虚',
  Seeker: '精神/心智过重，身体/使命薄弱，洞见多但实践少',
  Optimizer: '身体/心智聚焦，精神/使命浅薄，在孤立中打磨自己',
  Drifter: '没有深度发展任何象限，分散精力，浅尝辄止',
  Specialist: '一个象限达到3级，其他在1级，单一领域出众但其他失调',
  Integrated: '所有象限2级+，相互支持，在领域间自然流动',
};

// 单个象限的评估结果
export interface QuadrantAssessment {
  quadrant: Quadrant;
  level: Level;
  levelNumber: LevelNumber;
  phase: Phase;
  phaseNumber: PhaseNumber;
  archetype: string;
  strengths: string[];
  gaps: string[];
  lifestyleImpact: string;
  falseTransformationAlert?: string;
  traits: Record<Trait, TraitLevel>;
}

// 转变策略
export interface TransformationStrategy {
  title: string;
  coreProblem?: string;
  solutionApproach?: string;
  practices: string[];
  challenge: string;
  resource?: string;
  milestone: string;
}

// 完整评估结果
export interface AssessmentResult {
  metatype: {
    name: string;
    description: string;
  };
  lifestyleArchetype: {
    type: LifestyleArchetype;
    description: string;
  };
  quadrants: QuadrantAssessment[];
  crossQuadrantDynamics: {
    primaryBlock: string;
    unlockOpportunity: string;
    hiddenPattern: string;
    cascadeWarning: string;
  };
  coreProblem: string;
  strategies: {
    thirtyDays: TransformationStrategy;
    ninetyDays: TransformationStrategy;
    sixToTwelveMonths: TransformationStrategy;
  };
  glitchAssessment: string;
  criticalWarnings: string[];
  comparableMetatypes: string[];
  immediateNextAction: string;
  truthAboutSituation: string;
}

// 聊天消息
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// 评估状态
export interface AssessmentState {
  id?: string;
  currentQuadrant: Quadrant | null;
  completedQuadrants: Quadrant[];
  messages: Message[];
  isComplete: boolean;
  result?: AssessmentResult;
}

// 数据库中的评估记录
export interface AssessmentRecord {
  id: string;
  user_id: string;
  conversation: Message[];
  result: AssessmentResult | null;
  status: 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}
