import { useCallback, useEffect, useState } from "react";
import styles from "./editor.styles.module.css";
import { Chatflow } from "../../Modules/Chatflow";
import ReactFlow, {
    Background,
    BackgroundVariant,
    Controls,
    EdgeChange,
    MiniMap,
    NodeChange,
    applyEdgeChanges,
    applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { useNodeStore } from "../../Modules/NodeManager";
// import { toast } from "react-toastify";

interface IEditor {
    chatFlow: Chatflow;
}

function Editor(props: IEditor) {
    const { chatFlow } = props;
    const messageNodes = useNodeStore().nodes;

    const initialNodes = [
        { id: "43", position: { x: 0, y: 0 }, data: { label: "1" } },
        { id: "35", position: { x: 0, y: 100 }, data: { label: "2" } },
    ];
    const initialEdges = [{ id: "e1-2", source: "43", target: "35" }];

    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) =>
            setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) =>
            setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

    // const onDragOver = useCallback((event: any) => {
    //     event.preventDefault();
    //     event.dataTransfer.dropEffect = "move";
    // }, []);

    // const onDrop = useCallback(
    //     (event) => {
    //         event.preventDefault();

    //         const type = event.dataTransfer.getData("application/reactflow");

    //         // check if the dropped element is valid
    //         if (typeof type === "undefined" || !type) {
    //             return;
    //         }

    //         let id = 0;
    //         const getId = () => `dndnode_${id++}`;
    //         // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
    //         // and you don't need to subtract the reactFlowBounds.left/top anymore
    //         // details: https://reactflow.dev/whats-new/2023-11-10
    //         const position = reactFlowInstance.screenToFlowPosition({
    //             x: event.clientX,
    //             y: event.clientY,
    //         });
    //         const newNode = {
    //             id: getId(),
    //             type,
    //             position,
    //             data: { label: `${type} node` },
    //         };

    //         setNodes((nds) => nds.concat(newNode));
    //     },
    //     [reactFlowInstance]
    // );

    useEffect(() => {
        console.log(chatFlow);
    }, []);

    return (
        <div className={styles.editorContainer}>
            <section className={styles.leftSidebar}>
                <div className={styles.nodesContainer}>
                    {messageNodes.map((node) => (
                        <div
                            className={styles.messageNode}
                            key={node.name}
                        >
                            <img className={styles.nodeImage} src={node.icon} alt="message-type-image" />
                            <p className={styles.nodeTitle}>{node.name}</p>
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
                        // onDrop={onDrop}
                        // onDragOver={onDragOver}
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
