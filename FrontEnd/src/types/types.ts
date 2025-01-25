// Enums
export enum WorkerRole {
    Nutritionist = 'nutritionist',
    Psychologist = 'psychologist',
}

// User Interface
export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

// Worker Interface (Extends User)
export interface Worker extends User {
    role: WorkerRole;
    specialty: string;
    experienceYears?: number;
}

// Category Interface
export interface Category {
    id: string;
    name: string;
    description?: string;
}

// Context Word Interface
export interface ContextWord {
    word: string;
    categoryId: string | null;
}

// Context Interface
export interface Context {
    id: string;
    name: string;
    description?: string;
    words: ContextWord[];
}

// Template Content Type
export type TemplateContent = string | Record<string, any>;

// Template Interface
export interface Template {
    id: string;
    title: string;
    workerName: string;
    createdBy: string;
    content: TemplateContent;
    shared: boolean;
    categoryId?: string | null;
}

// API Response Interface
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: 'success' | 'error';
}
