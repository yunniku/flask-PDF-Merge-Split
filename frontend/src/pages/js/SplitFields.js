import { useState } from "react";
import { Link } from "react-router-dom";
import { getDownloadUrl } from "../../api/pdfApi";
import "../css/global.css";
import "../css/Split.css";

function SplitFields() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSplit = async () => {
    if (!file) {
      alert("PDF 파일을 선택해주세요");
      return;
    }

    setLoading(true);
    setResults([]);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/api/split-fields", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) {
      alert(data.error);
      return;
    }

    setMessage(data.message);
    setResults(data.results);
  };

  return (
    <div className="container">
      <h2>🔧 필드 기반 분할</h2>
      <p className="sub">SUB_ID / MODULE / ISO 필드를 읽어 자동으로 파일명을 생성해 분할해요</p>

      <div className="file-bar">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button className="splitBtn" onClick={handleSplit} disabled={loading}>
        {loading ? "분할 중..." : "🔧 필드 기반 분할"}
      </button>

      {loading && <p className="loading">⏳ 처리 중입니다...</p>}

      {message && <p style={{ marginTop: "16px" }}>✅ {message}</p>}

      {results.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <table className="result-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>파일명</th>
                <th>페이지</th>
                <th>다운로드</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{r.title}</td>
                  <td>{r.pages}</td>
                  <td>
                    <a href={getDownloadUrl(r.download_url)} download>
                      📥
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link to="/split" className="home-btn">← 분할 메뉴로</Link>
    </div>
  );
}

export default SplitFields;