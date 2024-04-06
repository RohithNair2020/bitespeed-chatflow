import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
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
            <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar/>
        </>
    );
}

export default App;
