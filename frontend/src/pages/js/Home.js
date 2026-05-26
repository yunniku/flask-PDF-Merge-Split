import { Link } from "react-router-dom";
import "../css/Home.css";

function Home() {
  return (
    <div className="container">
      <h1 className="title">📄 PDF 도구</h1>
      <p className="sub">원하는 기능을 선택하세요</p>
      <div className="menu">
        <Link to="/merge" className="btn">🔗 PDF 병합</Link>
        <Link to="/split" className="btn">✂️ PDF 분할</Link>
        <Link to="/bookmark-extract" className="btn">📑 북마크 추출</Link>
      </div>
    </div>
  );
}

export default Home;