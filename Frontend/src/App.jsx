import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import BoardDetail from "./Pages/BoardDetail";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/board/:id" element={<BoardDetail />} />

      </Routes>
    </BrowserRouter>
  );
}
