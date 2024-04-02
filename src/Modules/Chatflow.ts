import { Message } from "./Message";

export class Chatflow {
    private _messages: Array<Message> = [];
    private _edges = [];
    private _isFaulty: boolean = false;

    constructor() {}

    addMessage(message: Message) {
        this._messages.push(message);
    }

    get edges() {
        return this._edges;
    }

    get messages() {
        return this._messages;
    }

    get isFaulty() {
        return this._isFaulty;
    }
}