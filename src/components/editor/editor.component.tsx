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

interface IEditor {
    chatFlow: Chatflow;
}

function Editor(props: IEditor) {
    const { chatFlow } = props;

    const initialNodes = [
        { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
        { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
    ];
    const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

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

    useEffect(() => {
        console.log(chatFlow);
    });

    return (
        <div className={styles.editorContainer}>
            <section className={styles.leftSidebar}></section>
            <section className={styles.flowEditor}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                >
                    <Controls />
                    <MiniMap />
                    <Background
                        variant={BackgroundVariant.Dots}
                        gap={12}
                        size={1}
                    />
                </ReactFlow>
            </section>
            <section className={styles.rightSidebar}></section>
        </div>
    );
}

export default Editor;
