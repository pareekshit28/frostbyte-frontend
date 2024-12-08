import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <div className="h-screen w-screen flex flex-col">
    <App />
  </div>
);
