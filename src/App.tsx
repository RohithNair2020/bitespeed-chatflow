import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import Editor from "./components/editor/editor.component";
import Navbar from "./components/navbar/navbar.component";

function App() {
    return (
        <>
            <Navbar></Navbar>
            <Editor></Editor>
            <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar/>
        </>
    );
}

export default App;
