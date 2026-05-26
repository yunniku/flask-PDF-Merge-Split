import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/js/Home";
import Merge from "./pages/js/Merge";
import Split from "./pages/js/Split";
import SplitRange from "./pages/js/SplitRange";
import BookmarkSplit from "./pages/js/BookmarkSplit";
import SplitSingle from "./pages/js/SplitSingle";
import BookmarkExtract from "./pages/js/BookmarkExtract";
import SplitFields from "./pages/js/SplitFields";

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
        <Route path="/bookmark-extract" element={<BookmarkExtract />} />
        <Route path="/split/fields" element={<SplitFields />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;