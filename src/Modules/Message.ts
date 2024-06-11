import { ComponentType } from "./UITypes";

export type MessageType = "text" | "media";
export type MessageLabel = "Text Message" | "Media Message";

export interface ITextMessageConfig {
    content: string;
}

export interface IMediaMessageConfig {
    content: {
        file: Record<string, any> | null;
    };
}
export interface IMessage {
    label: string;
    messageType: MessageType;
    isEmpty: () => boolean;
    getContent: () => void;
    setContent: (content: any) => void;
    getConfig: () => ITextMessageConfig | IMediaMessageConfig;
    setConfig: (config: ITextMessageConfig | IMediaMessageConfig) => void;
    getAttributesConfig: () => Array<ComponentType>;
}

export class TextMessage implements IMessage {
    label: string = "Text Message";
    messageType: MessageType = "text";

    //? This is the UI Config for the Text Message Type
    private _attributesConfig: ComponentType[] = [
        {
            label: "Text Message",
            placeholder: "Enter your message",
            configPath: "content",
        },
    ];

    //? This is the default config for a text message
    private _config: ITextMessageConfig = {
        content: "",
    };

    constructor(config?: ITextMessageConfig) {
        if (config) {
            this._config = config;
        }
    }

    //? Sets the content and sets the empty flag if message is empty
    setContent(message: string) {
        this._config.content = message;
    }

    //? Returns the text content of the message
    getContent() {
        return this._config.content;
    }

    //? Sets the config of the message
    setConfig(config: ITextMessageConfig) {
        this._config = config;
    }

    //? Returns the config of the message
    getConfig() {
        return this._config;
    }

    //? Returns the attributes UI Config
    getAttributesConfig() {
        return this._attributesConfig;
    }

    //? To check if empty
    isEmpty(): boolean {
        return !this._config?.content?.length;
    }
}

export class MediaMessage implements IMessage {
    label: string = "Media Message";
    messageType: MessageType = "media";

    //? This is the UI Config for the Text Message Type
    private _attributesConfig: ComponentType[] = [
        {
            label: "Upload your file",
            configPath: "content.file",
        },
    ];

    //? This is the default config for a text message
    private _config: IMediaMessageConfig = {
        content: {
            file: null
        },
    };

    constructor(config?: IMediaMessageConfig) {
        if (config) {
            this._config = config;
        }
    }

    //? Sets the content and sets the empty flag if message is empty
    setContent(content: any) {
        this._config.content = content;
    }

    //? Returns the text content of the message
    getContent() {
        return this._config.content;
    }

    //? Sets the config of the message
    setConfig(config: IMediaMessageConfig) {
        this._config = config;
    }

    //? Returns the config of the message
    getConfig() {
        return this._config;
    }

    //? Returns the attributes UI Config
    getAttributesConfig() {
        return this._attributesConfig;
    }

    //? To check if empty
    isEmpty(): boolean {
        return !!this._config?.content?.file;
    }
}

export class MessageFactory {
    private static _instance: MessageFactory | null = null;

    constructor() {
        if (!MessageFactory._instance) {
            MessageFactory._instance = this;
            return MessageFactory._instance;
        }
    }

    createMessage(type: MessageType) {
        switch (type) {
            case "text":
                return new TextMessage();
            case "media":
                return new MediaMessage();
            default:
                return null;
        }
    }
}
