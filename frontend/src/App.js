import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Merge from "./pages/Merge";
import Split from "./pages/Split";
import SplitRange from "./pages/SplitRange";
import BookmarkSplit from "./pages/BookmarkSplit";
import SplitSingle from "./pages/SplitSingle";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/merge" element={<Merge />} />
        <Route path="/split" element={<Split />} />
        <Route path="/split/range" element={<SplitRange />} />
        <Route path="/split/bookmark" element={<BookmarkSplit />} />
        <Route path="/split/single" element={<SplitSingle />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;