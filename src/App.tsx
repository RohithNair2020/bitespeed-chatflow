import "./App.css";
import { Chatflow } from "./Modules/Chatflow";
import Editor from "./components/editor/editor.component";
import Navbar from "./components/navbar/navbar.component";

function App() {
    const chatFlow = new Chatflow();
    return (
        <>
            <Navbar></Navbar>
            <Editor chatFlow={chatFlow}></Editor>
        </>
    );
}

export default App;
