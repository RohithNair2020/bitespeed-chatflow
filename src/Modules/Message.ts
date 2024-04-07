export type MessageType = 'text' | 'media';
export interface IMessage {
    isEmpty: () => boolean;
    getContent: () => void;
    setContent: (content: any) => void
}

export class TextMessage implements IMessage {
    private _content: string = '';

    //? Sets the content and sets the empty flag if message is empty 
    setContent(message: string) {
        this._content = message;
    }

    //? Returns the text content of the message
    getContent() {
        return this._content;
    }

    //? To check if empty
    isEmpty(): boolean {
        return !this._content.length;
    }
}

export class MediaMessage implements IMessage {
    private _media: { [key: string]: object | string } = {};

    getContent() {
        return this._media;
    }

    setContent(content: any) {
        this._media = content;
    }

    isEmpty() {
        return true;
    }
}

export class MessageFactory {
    private static _instance: MessageFactory | null = null;

    constructor() {
        if(!MessageFactory._instance) {
            MessageFactory._instance = this;
            return MessageFactory._instance;
        }
    }

    createMessage(type: MessageType) {
        switch(type) {
            case 'text':
                return new TextMessage();
            case 'media':
                return new MediaMessage();
            default: 
                return null;
        }
    }
}
