import { v4 as genUuid } from 'uuid';

export class Message {
    id: string;
    type: 'text' | 'media' = 'text'; // Message type
    x: number = 0; // x-coordinate
    y: number = 0; // y-coordinate
    isEmpty: boolean = false; // empty message flag

    constructor() {
        this.id = genUuid(); 
    }

    setPosition(x: number, y: number) {
        [this.x, this.y] = [x, y];
    }
}

export class TextMessage extends Message {
    private _content: string = 'Enter message';

    constructor() {
        super();
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
    private _media: { [key: string]: object | string } = {};

    constructor() {
        super();
    }

    get media() {
        return this._media;
    }
}
