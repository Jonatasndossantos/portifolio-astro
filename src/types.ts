export enum Language {
    EN = 'en',
    PT = 'pt',
    FR = 'fr',
    ES = 'es',
    ZH = 'zh',
    JA = 'ja',
    EN_GB = 'en-GB',
}

export enum Mode {
    FULLSTACK = 'fullstack',
    FRONTEND = 'frontend',
    BACKEND = 'backend',
    DEVOPS = 'devops',
    DATABASE = 'database',
    AI = 'ai',
}

// Represents the data coming from a Headless CMS (Contentful/Sanity)
export interface LocalizedModeContent {
    [Language.EN]: {
        [Mode.FULLSTACK]: string;
        [Mode.FRONTEND]: string;
        [Mode.BACKEND]: string;
        [Mode.DEVOPS]: string;
        [Mode.DATABASE]: string;
        [Mode.AI]: string;
    };
    [Language.PT]: {
        [Mode.FULLSTACK]: string;
        [Mode.FRONTEND]: string;
        [Mode.BACKEND]: string;
        [Mode.DEVOPS]: string;
        [Mode.DATABASE]: string;
        [Mode.AI]: string;
    };
}

export interface Skill {
    id: string;
    name: string;
    icon?: string;
    // Relevance score (1-10) for sorting based on mode
    relevance: {
        [Mode.FULLSTACK]: number;
        [Mode.FRONTEND]: number;
        [Mode.BACKEND]: number;
        [Mode.DEVOPS]: number;
        [Mode.DATABASE]: number;
        [Mode.AI]: number;
    };
    category: 'language' | 'framework' | 'tool' | 'cloud' | 'data' | 'ai';
}

export interface Project {
    id: string;
    title: string;
    slug: string;
    description: LocalizedModeContent;
    technologies: string[];
    repoUrl?: string;
    demoUrl?: string;
    imageUrl: string;
}

export interface SocialLinks {
    github: string;
    linkedin: string;
    email: string;
    twitter?: string;
}

export interface Profile {
    name: string;
    role: LocalizedModeContent;
    bio: LocalizedModeContent;
    availableForHire: boolean;
    socials: SocialLinks;
}

export interface CuratedProfile {
    name: string;
    role: string;
    bio: string;
    availableForHire: boolean;
    socials: SocialLinks;
}

