import { useState } from "react";
import { Link } from "react-router-dom";
import { splitPdf, getDownloadUrl } from "../api/pdfApi";
import "./Split.css";

function Split() {
  const [file, setFile] = useState(null);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSplit = async () => {
    if (!file) {
      alert("PDF 파일을 선택해주세요");
      return;
    }
    setLoading(true);
    const data = await splitPdf(file, start, end);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>✂️ PDF 분할</h2>
      <div className="file-bar">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <div className="page-group">
        <input
          type="number"
          value={start}
          min={1}
          onChange={(e) => setStart(e.target.value)}
          placeholder="시작 페이지"
        />
        <input
          type="number"
          value={end}
          min={1}
          onChange={(e) => setEnd(e.target.value)}
          placeholder="끝 페이지"
        />
      </div>

      <button className="splitBtn" onClick={handleSplit} disabled={loading}>
        {loading ? "분할 중..." : "✂️ 분할 시작"}
      </button>

      {loading && <p className="loading">⏳ 처리 중입니다...</p>}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <p>✅ {result.message}</p>
          <a href={getDownloadUrl(result.download_url)} download>
            📥 다운로드
          </a>
        </div>
      )}

      <Link to="/" className="home-btn">← 홈으로</Link>
    </div>
  );
}

export default Split;