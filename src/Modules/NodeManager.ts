import { MediaMessage, Message, TextMessage } from "./Message";

interface Node {
    name: string,
    icon: string,
    class: new () => Message
}

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
    nodeStore.registerNode({ name: 'Text Message', 'icon': '', class: TextMessage});
    nodeStore.registerNode({ name: 'Media Message', 'icon': '', class: MediaMessage});
    return nodeStore;
}
