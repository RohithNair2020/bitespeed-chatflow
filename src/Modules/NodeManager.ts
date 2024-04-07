import { MessageType } from "./Message";

interface INode {
    icon: string,
    label: string,
    messageType: MessageType
}

export class Node implements INode {
    label: string;
    icon: string = '';
    messageType: MessageType
    constructor(config: INode) {
        this.messageType = config.messageType;
        this.label = config.label;
        this.icon = config.icon;
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
        this._nodeMap.set(node.messageType, node);
    }

    get nodes(): Array<Node> {
        return Array.from(this._nodeMap.values());
    }
}

export function useNodeStore(): NodeStore {
    const nodeStore = new NodeStore();
    nodeStore.registerNode(new Node({ label: 'Text', 'icon': 'text-message.png', messageType: 'text'}));
    nodeStore.registerNode(new Node({ label: 'Media', 'icon': 'media-message.png', messageType: 'media'}));
    return nodeStore;
}
