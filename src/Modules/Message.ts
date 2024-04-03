export class Message {
    type: 'text' | 'media' = 'text'; // Message type
    x: number = 0; // x-coordinate
    y: number = 0; // y-coordinate
    isEmpty: boolean = false; // empty message flag
}

export class TextMessage extends Message {
    icon: string;
    private _content: string = 'Enter message';

    constructor() {
        super();
        this.icon = ''; // icon for the text message node
    }

    //? Sets the content and sets the empty flag if message is empty 
    setContent(message: string) {
        this._content = message;
        this.isEmpty = this._content.length ? false : true;
    }

    //? Returns the text content of the message
    get content() {
        return this._content;
    }
}

export class MediaMessage extends Message {
    icon: string;
    private _media: { [key: string]: object | string } = {};

    constructor() {
        super();
        this.icon = '';
    }

    get media() {
        return this._media;
    }
}
