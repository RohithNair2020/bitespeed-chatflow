export interface TextinputField {
    label: string;
    placeholder?: string;
    disabled?: boolean;
    configPath: string;
}

export interface NumberInputField {
    label: string;
    placeholder?: string; 
    disabled?: boolean;
    configPath: string;
}

export interface FileUpload {
    label: string;
}

export type ComponentType = TextinputField | NumberInputField;