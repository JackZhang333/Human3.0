'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('zh');
    const [mounted, setMounted] = useState(false);

    // Initialize language from localStorage or browser
    useEffect(() => {
        setMounted(true);
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
            setLanguageState(savedLang);
        } else {
            // Detect browser language
            const browserLang = navigator.language.toLowerCase();
            if (browserLang.startsWith('zh')) {
                setLanguageState('zh');
            } else {
                setLanguageState('en');
            }
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
        // Update html lang attribute
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    };

    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
            value = value?.[k];
        }

        return value || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

// Translations
const translations = {
    zh: {
        nav: {
            login: '登录',
            startAssessment: '开始评估',
            history: '评估历史',
        },
        hero: {
            badge: '基于 Human 3.0 发展框架的专业评估',
            title: '发现你的',
            titleAccent: '元类型',
            subtitle: '通过智能自适应访谈，深度评估你在',
            quadrants: '心智、身体、精神、使命',
            subtitleEnd: '四个象限的发展状态，获取个性化转变策略',
            ctaPrimary: '免费开始评估',
            ctaSecondary: '了解评估体系',
            statQuadrants: '生命象限',
            statQuadrantsDesc: '全维度覆盖',
            statLevels: '意识等级',
            statLevelsDesc: '递进式发展',
            statPotential: '成长可能',
            statPotentialDesc: '持续升级',
        },
        value: {
            precise: '精准评估',
            preciseDesc: 'AI 驱动的自适应访谈，深度挖掘你的真实状态',
            insight: '即时洞察',
            insightDesc: '实时生成个性化报告，清晰展示发展路径',
            growth: '持续成长',
            growthDesc: '可追踪的转变策略，陪伴你的升级之旅',
        },
        quadrants: {
            heading: '四个生命象限',
            subheading: 'Human 3.0 模型将人生发展分为四个相互关联的象限，真正的成长需要整合发展',
            mind: '心智',
            mindDesc: '个人心理世界：思想、情感、信念、世界观、元认知能力',
            body: '身体',
            bodyDesc: '个人物理世界：健康、体能、营养、睡眠、精力管理',
            spirit: '精神',
            spiritDesc: '集体心理世界：关系、意义、社群、归属感、文化连接',
            vocation: '使命',
            vocationDesc: '集体物理世界：事业、价值创造、影响力、贡献与遗产',
        },
        levels: {
            heading: '三个意识等级',
            subheading: '每个象限都有从从众者到整合者的发展路径，更高等级不是抛弃而是超越并包含',
            conformist: '从众者',
            conformistEng: 'Conformist',
            conformistDesc: '遵循权威和传统，非黑即白的思维。基于外部验证生活，像游戏中的 NPC，按照预设脚本运行。',
            individualist: '个体者',
            individualistEng: 'Individualist',
            individualistDesc: '拒绝从众，追求个人目标。相信自己发现的方式是正确的，成为选择自己故事线的主角，但可能把对立当作智慧。',
            synthesist: '整合者',
            synthesistEng: 'Synthesist',
            synthesistDesc: '整合多元视角，在悖论和复杂中识别真理。创造新游戏而非玩现有游戏，拥有程序员级别的现实建构意识。',
        },
        cta: {
            heading: '准备好发现你的元类型了吗？',
            subheading: '免费完成评估，获取你的个性化发展报告和转变策略',
            button: '开始我的评估',
        },
        login: {
            welcomeBack: '欢迎回来',
            createAccount: '创建账户',
            loginSubtitle: '登录以继续你的发展评估',
            signupSubtitle: '开始你的 Human 3.0 之旅',
            googleLogin: '使用 Google 账户',
            googleSignup: '使用 Google 账户注册',
            orEmail: '或使用邮箱',
            emailLabel: '邮箱地址',
            emailPlaceholder: 'your@email.com',
            passwordLabel: '密码',
            passwordPlaceholder: '••••••••',
            loginButton: '登录',
            signupButton: '创建账户',
            processing: '处理中...',
            noAccount: '还没有账户？',
            hasAccount: '已有账户？',
            signupLink: '立即注册',
            loginLink: '登录',
            signupSuccess: '注册成功！请查收您的邮箱确认链接。',
            signupSuccessTitle: '注册成功',
            signupSuccessDesc: '请检查您的邮箱并点击激活链接以完成账户注册。',
            agreeTerms: '我已阅读并同意',
            terms: '服务条款',
            privacy: '隐私政策',
            and: '和',
            loginDisclaimer: '登录即表示您同意我们的服务条款和隐私政策',
            unknownError: '发生未知错误',
            loading: '加载中...',
        },
        assess: {
            title: 'Human 3.0 评估',
            inputPlaceholder: '输入你的回答...',
            stop: '停止生成',
            send: '发送',
            welcome: '欢迎！让我们开始你的 Human 3.0 发展评估。',
            quadrantProgress: '象限进度',
            completed: '已完成',
            active: '进行中',
            pending: '待开始',
            keyboardHint: '按 Enter 发送，Shift + Enter 换行',
            viewReport: '查看完整报告',
            regenerateReport: '重新分析并更新报告',
        },
        report: {
            title: '评估报告',
            yourProfile: '你的发展档案',
            overallLevel: '总体水平',
            quadrantScores: '象限分数',
            strengths: '优势领域',
            growthAreas: '成长空间',
            recommendations: '转变建议',
            exportPDF: '导出为 PDF',
            viewHistory: '查看历史',
            retake: '重新评估',
            loading: '生成报告中...',
            error: '加载报告失败',
        },
        history: {
            title: '评估历史',
            noHistory: '暂无评估记录',
            date: '评估日期',
            level: '等级',
            viewReport: '查看报告',
            deleteConfirm: '确定要删除这条记录吗？',
            delete: '删除',
            back: '返回',
            completed: '已完成',
            inProgress: '进行中',
            continue: '继续评估',
        },
        common: {
            loading: '加载中...',
            error: '出错了',
            retry: '重试',
            cancel: '取消',
            confirm: '确认',
            save: '保存',
            delete: '删除',
            edit: '编辑',
            close: '关闭',
            next: '下一步',
            previous: '上一步',
            finish: '完成',
            back: '返回',
            logout: '退出',
            status: '状态',
            actions: '操作',
            ok: '确定',
        },
    },
    en: {
        nav: {
            login: 'Login',
            startAssessment: 'Start Assessment',
            history: 'Assessment History',
        },
        hero: {
            badge: 'Professional Assessment Based on Human 3.0 Framework',
            title: 'Discover Your',
            titleAccent: 'Metatype',
            subtitle: 'Map your development across',
            quadrants: 'Mind, Body, Spirit, and Vocation',
            subtitleEnd: '- the 4 Quadrants. AI-driven adaptive interviewing for personalized transformation strategies.',
            ctaPrimary: 'Start Free Assessment',
            ctaSecondary: 'Learn More',
            statQuadrants: 'Quadrants',
            statQuadrantsDesc: 'Full Coverage',
            statLevels: 'Levels',
            statLevelsDesc: 'Progressive',
            statPotential: 'Potential',
            statPotentialDesc: 'Unlimited',
        },
        value: {
            precise: 'Precise Assessment',
            preciseDesc: 'AI-driven adaptive interviews that deeply uncover your true state',
            insight: 'Instant Insights',
            insightDesc: 'Real-time personalized reports showing clear development paths',
            growth: 'Continuous Growth',
            growthDesc: 'Trackable transformation strategies accompanying your evolution journey',
        },
        quadrants: {
            heading: 'The 4 Quadrants of Development',
            subheading: 'Human 3.0 maps life development across four interconnected quadrants. True growth requires integration, not specialization.',
            mind: 'Mind',
            mindDesc: 'Individual Psychological: thoughts, emotions, beliefs, worldview, meta-cognition',
            body: 'Body',
            bodyDesc: 'Individual Physical: health, fitness, nutrition, sleep, energy management',
            spirit: 'Spirit',
            spiritDesc: 'Collective Psychological: relationships, meaning, community, belonging, cultural connection',
            vocation: 'Vocation',
            vocationDesc: 'Collective Physical: career, value creation, impact, contribution and legacy',
        },
        levels: {
            heading: '3 Consciousness Levels',
            subheading: 'Each quadrant evolves through three levels of awareness. Higher levels transcend and include, not abandon.',
            conformist: 'Conformist',
            conformistEng: 'Level 1.0',
            conformistDesc: 'Following authority and tradition, black-and-white thinking. Living based on external validation, like an NPC running preset scripts.',
            individualist: 'Individualist',
            individualistEng: 'Level 2.0',
            individualistDesc: 'Rejecting conformity, pursuing personal goals. Believing your discovered way is correct, becoming the protagonist choosing your storyline.',
            synthesist: 'Synthesist',
            synthesistEng: 'Level 3.0',
            synthesistDesc: 'Integrating multiple perspectives, identifying truth in paradox and complexity. Creating new games rather than playing existing ones.',
        },
        cta: {
            heading: 'Ready to Discover Your Metatype?',
            subheading: 'Complete the free assessment and receive your personalized development report and transformation strategies',
            button: 'Start My Assessment',
        },
        login: {
            welcomeBack: 'Welcome Back',
            createAccount: 'Create Account',
            loginSubtitle: 'Sign in to continue your development assessment',
            signupSubtitle: 'Begin your Human 3.0 journey',
            googleLogin: 'Continue with Google',
            googleSignup: 'Sign up with Google',
            orEmail: 'Or use email',
            emailLabel: 'Email Address',
            emailPlaceholder: 'your@email.com',
            passwordLabel: 'Password',
            passwordPlaceholder: '••••••••',
            loginButton: 'Sign In',
            signupButton: 'Create Account',
            processing: 'Processing...',
            noAccount: "Don't have an account?",
            hasAccount: 'Already have an account?',
            signupLink: 'Sign up',
            loginLink: 'Sign in',
            signupSuccess: 'Registration successful! Please check your email for confirmation link.',
            signupSuccessTitle: 'Registration Successful',
            signupSuccessDesc: 'Please check your email and click the activation link to complete your registration.',
            agreeTerms: 'I agree to the',
            terms: 'Terms of Service',
            privacy: 'Privacy Policy',
            and: 'and',
            loginDisclaimer: 'By logging in, you agree to our Terms of Service and Privacy Policy',
            unknownError: 'An unknown error occurred',
            loading: 'Loading...',
        },
        assess: {
            title: 'Human 3.0 Assessment',
            inputPlaceholder: 'Type your answer...',
            stop: 'Stop generating',
            send: 'Send',
            welcome: 'Welcome! Let\'s begin your Human 3.0 development assessment.',
            quadrantProgress: 'Quadrant Progress',
            completed: 'Completed',
            active: 'Active',
            pending: 'Pending',
            keyboardHint: 'Press Enter to send, Shift + Enter for new line',
            viewReport: 'View Full Report',
            regenerateReport: 'Re-analyze & Update Report',
        },
        report: {
            title: 'Assessment Report',
            yourProfile: 'Your Development Profile',
            overallLevel: 'Overall Level',
            quadrantScores: 'Quadrant Scores',
            strengths: 'Strengths',
            growthAreas: 'Growth Areas',
            recommendations: 'Recommendations',
            exportPDF: 'Export as PDF',
            viewHistory: 'View History',
            retake: 'Retake Assessment',
            loading: 'Generating report...',
            error: 'Failed to load report',
        },
        history: {
            title: 'Assessment History',
            noHistory: 'No assessment records yet',
            date: 'Assessment Date',
            level: 'Level',
            viewReport: 'View Report',
            deleteConfirm: 'Are you sure you want to delete this record?',
            delete: 'Delete',
            back: 'Back',
            completed: 'Completed',
            inProgress: 'In Progress',
            continue: 'Continue Assessment',
        },
        common: {
            loading: 'Loading...',
            error: 'Error occurred',
            retry: 'Retry',
            cancel: 'Cancel',
            confirm: 'Confirm',
            save: 'Save',
            delete: 'Delete',
            edit: 'Edit',
            close: 'Close',
            next: 'Next',
            previous: 'Previous',
            finish: 'Finish',
            back: 'Back',
            logout: 'Logout',
            status: 'Status',
            actions: 'Actions',
            ok: 'OK',
        },
    },
};
