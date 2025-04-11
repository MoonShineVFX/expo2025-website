import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Status from "./components/Status"; // 假設你已經創建了 Status 元件

function App() {
  return (
    <div className="min-h-screen relative">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/status" element={<Status />} />
      </Routes>
    </div>
  );
}

export default App;
