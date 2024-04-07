import { useCallback, useEffect, useState } from "react";
import styles from "./editor.styles.module.css";
import ReactFlow, {
    Background,
    BackgroundVariant,
    useNodesState,
    useEdgesState,
    Controls,
    EdgeChange,
    MiniMap,
    NodeChange,
    applyEdgeChanges,
    applyNodeChanges,
    addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { Node, useNodeStore } from "../../Modules/NodeManager";
import { MessageFactory, MessageType } from "../../Modules/Message";
import { v4 as generateId } from "uuid";
// import { toast } from "react-toastify";

function Editor() {
    const messageNodes = useNodeStore().nodes;

    const initialNodes: any = [];
    const initialEdges: any = [];
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const onConnect = useCallback(
        (params) => setEdges((eds) => {
            console.log(params, eds);
            const existingEdge = eds.find(ed => ed.source === params.source);
            if(existingEdge) return eds;
            return addEdge(params, eds);
        }),
        [setEdges]
    );

    const onDragOver = useCallback((event: any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const addNode = useCallback(
        (
            messageType: MessageType,
            content?: any,
            position: { x: number; y: number } = { x: 0, y: 100 }
        ) => {
            const messageFactory = new MessageFactory();
            const message = messageFactory.createMessage(messageType);
            message?.setContent(content);
            const newNode: any = {
                id: generateId(),
                position,
                data: message?.getContent(),
            };

            setNodes([...nodes, newNode]);
        },
        [nodes]
    );

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const nodeData = event.dataTransfer.getData(
                "application/reactflow"
            );
            const node = JSON.parse(nodeData);

            if (!node) {
                return;
            }

            if (reactFlowInstance) {
                // @ts-expect-error react flow instance can be null
                const position = reactFlowInstance.screenToFlowPosition({
                    x: event.clientX,
                    y: event.clientY,
                });
                addNode(node.messageType, { label: node.label }, position);
            }
        },
        [reactFlowInstance, addNode]
    );

    const onDragStart = (event, node: Node) => {
        event.dataTransfer.setData(
            "application/reactflow",
            JSON.stringify(node)
        );
        event.dataTransfer.effectAllowed = "move";
    };

    // useEffect(() => {
    // }, []);

    return (
        <div className={styles.editorContainer}>
            <section className={styles.leftSidebar}>
                <div className={styles.nodesContainer}>
                    {messageNodes.map((node) => (
                        <div
                            className={styles.messageNode}
                            key={node.messageType}
                            onClick={() => addNode(node.messageType)}
                            onDragStart={(event) => onDragStart(event, node)}
                            draggable
                        >
                            <img
                                className={styles.nodeImage}
                                src={node.icon}
                                alt="message-type-image"
                            />
                            <p className={styles.nodeTitle}>{node.label}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section className={styles.flowEditorContainer}>
                <div className={styles.flowEditor}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        onInit={setReactFlowInstance}
                        onConnect={onConnect}
                        fitView
                    >
                        <Controls />
                        <MiniMap />
                        <Background
                            variant={BackgroundVariant.Dots}
                            gap={12}
                            size={1}
                        />
                    </ReactFlow>
                </div>
            </section>
            {/* <section className={styles.rightSidebar}></section> */}
        </div>
    );
}

export default Editor;
