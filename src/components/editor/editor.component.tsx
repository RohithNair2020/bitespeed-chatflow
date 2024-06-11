import { useCallback, useEffect, useState } from "react";
import styles from "./editor.styles.module.css";
import ReactFlow, {
    Background,
    BackgroundVariant,
    useNodesState,
    useEdgesState,
    ReactFlowProvider,
    Controls,
    MiniMap,
    addEdge,
    useReactFlow,
    Panel,
    Edge as ReactFlowEdge,
    Node as ReactFlowNode,
} from "reactflow";
import "reactflow/dist/style.css";
import { INode, Node, useNodeStore } from "../../Modules/NodeManager";
import { MessageFactory, MessageType } from "../../Modules/Message";
import { v4 as generateId } from "uuid";
import { toast } from "react-toastify";

function Editor() {
    const messageNodes = useNodeStore().nodes;
    const initialNodes: any = [];
    const initialEdges: any = [];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [currentNode, setCurrentNode] = useState(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const { setViewport } = useReactFlow();

    /**
     * Checks if there are multiple source nodes and retures a boolean result accordingly
     * @returns {boolean} whether the flow is valid or not
     */
    const validateFlow = (
        nodes: Array<ReactFlowNode>,
        edges: Array<ReactFlowEdge>
    ): boolean => {
        const visitedSet = new Set<string>();
        let count = 0;

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            //? Checking if node already visited
            if (visitedSet.has(node.id)) {
                continue;
            }

            //? Checking for an incomingEdge
            const incomingEdge = edges.find((edge) => edge.source === node.id);

            if (!incomingEdge) {
                // incoming edge not present - This is a start node.
                count++;
                if (count > 1) return false;
            }

            //? Checking for an outgoingEdge
            const outgoingEdge = edges.find((edge) => edge.target === node.id);
            if (outgoingEdge) {
                // outgoing edge present - this node connects to some other node.
                // So no need of checking the connected node again. So adding to set.
                visitedSet.add(outgoingEdge.source);
            }
        }
        return true;
    };

    const saveFlow = useCallback(() => {
        try {
            if (reactFlowInstance) {
                if (!validateFlow(nodes, edges)) {
                    toast.error("multiple source nodes not allowed!");
                    return;
                }
                const flowData = (reactFlowInstance as any).toObject();
                localStorage.setItem(
                    "chat-flow-session",
                    JSON.stringify(flowData)
                );
                toast.success("The flow has been saved!");
            }
        } catch (e) {
            toast.error("Could not save the flow!");
        }
    }, [reactFlowInstance, nodes, edges]);

    const onConnect = useCallback(
        (params) =>
            setEdges((eds) => {
                console.log({ params, eds });
                const existingEdge = eds.find(
                    (ed) => ed.target === params.target
                );
                if (existingEdge) {
                    toast.warn("One only progression allowed from a message");
                    return eds;
                }
                console.log({ nodes, edges });
                return addEdge(params, eds);
            }),
        [setEdges, edges, nodes]
    );

    const onDragOver = useCallback((event: any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const addNode = useCallback(
        (
            messageNode: INode,
            position: { x: number; y: number } = { x: 0, y: 100 }
        ) => {
            const messageFactory = new MessageFactory();
            const message = messageFactory.createMessage(
                messageNode.messageType
            );
            const newNode: any = {
                id: generateId(),
                position,
                data: {
                    message,
                    label: messageNode.label,
                },
            };

            setNodes([...nodes, newNode]);
        },
        [nodes, setNodes]
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
                addNode(node, position);
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

    useEffect(() => {
        const restoreFlow = async () => {
            const flow = JSON.parse(
                localStorage.getItem("chat-flow-session") || ""
            );

            if (flow) {
                const { x = 0, y = 0, zoom = 1 } = flow.viewport;

                //TODO:: The nodes could be deserialised at this point. May be we'll need to look through all the nodes and serialise them back
                // flow.nodes?.forEach(node => {
                    // serialiseNode()
                // })
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                setViewport({ x, y, zoom });
            }
        };

        restoreFlow();
    }, [setEdges, setNodes, setViewport]);

    const handleNodeEdit = (e: React.MouseEvent, node: ReactFlowNode) => {
        setCurrentNode(node as any);
    };

    const handleInputChange = (e: any) => {
        if(currentNode) {
            (currentNode as ReactFlowNode)?.data.message?.setContent(e.target.value);
        }
    }

    return (
        <div className={styles.editorContainer}>
            <section className={styles.leftSidebar}>
                <div className={styles.nodesContainer}>
                    {messageNodes.map((node) => (
                        <div
                            className={styles.messageNode}
                            key={node.messageType}
                            onClick={() => addNode(node)}
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
                    <ReactFlowProvider>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onNodeDoubleClick={handleNodeEdit}
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
                            <Panel position="top-right">
                                <button
                                    className={styles.editorPanelButton}
                                    onClick={saveFlow}
                                >
                                    Save
                                </button>
                            </Panel>
                        </ReactFlow>
                    </ReactFlowProvider>
                </div>
            </section>
            {currentNode ? (
                <section className={styles.rightSidebar}>
                    <p>{(currentNode as ReactFlowNode).id}</p>
                    <p>{(currentNode as ReactFlowNode).data.message._content}</p>
                    {(currentNode as ReactFlowNode).data.label === "Text" && (
                        <input onChange={handleInputChange} />
                    )}
                    <button onClick={() => setCurrentNode(null)}>Close</button>
                </section>
            ) : (
                <></>
            )}
        </div>
    );
}

const EditorComponent = () => (
    <ReactFlowProvider>
        <Editor />
    </ReactFlowProvider>
);

export default EditorComponent;
