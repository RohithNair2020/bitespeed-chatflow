import { MediaMessage, Message, TextMessage } from "./Message";

interface INode {
    name: string,
    icon: string,
    messageType: new () => Message
}

class Node implements INode {
    name: string;
    icon: string = '';
    messageType: new () => Message
    constructor(config: INode) {
        this.name = config.name;
        this.icon = config.icon;
        this.messageType = config.messageType;
    }
}

//?- The NodeStore is a singleton class that stores all kinds of messages available.
// - Whenever creating a new message type,
// - make sure to register the message in the nodestore to make it available in the nodes palette. 
class NodeStore {
    private static _instance: NodeStore | undefined;
    private _nodeMap: Map<string, Node> = new Map();

    constructor() {
        if (!NodeStore._instance) {
            NodeStore._instance = this;
        }
        return NodeStore._instance;
    }

    registerNode(node: Node) {
        this._nodeMap.set(node.name, node);
    }

    get nodes(): Array<Node> {
        return Array.from(this._nodeMap.values());
    }
}

export function useNodeStore(): NodeStore {
    const nodeStore = new NodeStore();
    nodeStore.registerNode(new Node({ name: 'Text', 'icon': 'text-message.png', messageType: TextMessage}));
    nodeStore.registerNode(new Node({ name: 'Media', 'icon': 'media-message.png', messageType: MediaMessage}));
    return nodeStore;
}
