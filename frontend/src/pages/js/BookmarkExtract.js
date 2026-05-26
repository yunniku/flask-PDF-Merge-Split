import { useState } from "react";
import { Link } from "react-router-dom";
import { getDownloadUrl } from "../../api/pdfApi";
import "../css/Split.css";

function BookmarkExtract() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleExtract = async () => {
    if (!file) {
      alert("PDF 파일을 선택해주세요");
      return;
    }

    setLoading(true);
    setResults([]);
    setMessage("");
    setDownloadUrl("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/api/bookmark-extract", {
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
    setResults(data.bookmarks);
    setDownloadUrl(data.download_url);
  };

  return (
    <div className="container">
      <h2>📑 북마크 추출</h2>

      <div className="file-bar">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button className="splitBtn" onClick={handleExtract} disabled={loading}>
        {loading ? "추출 중..." : "📑 북마크 추출"}
      </button>

      {loading && <p className="loading">⏳ 처리 중입니다...</p>}

      {message && (
        <div style={{ marginTop: "16px" }}>
          <p>✅ {message}</p>
          <a href={getDownloadUrl(downloadUrl)} download>
            📥 Excel 다운로드
          </a>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <table className="result-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>북마크 제목</th>
                <th>페이지</th>
                <th>레벨</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td style={{ paddingLeft: `${r.depth * 16 + 10}px` }}>
                    {r.title}
                  </td>
                  <td>{r.page}</td>
                  <td>{r.depth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link to="/" className="home-btn">← 홈으로</Link>
    </div>
  );
}

export default BookmarkExtract;