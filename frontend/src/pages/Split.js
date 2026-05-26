import { Link } from "react-router-dom";
import "./Split.css";

function Split() {
  return (
    <div className="container">
      <h2>✂️ PDF 분할</h2>
      <p className="sub">원하는 분할 방식을 선택하세요</p>
      <div className="menu">
        <Link to="/split/range" className="btn">📄 페이지 범위 분할</Link>
        <Link to="/split/bookmark" className="btn">🔖 북마크 기준 분할</Link>
      </div>
      <Link to="/" className="home-btn">← 홈으로</Link>
    </div>
  );
}

export default Split;