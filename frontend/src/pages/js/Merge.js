import { useState } from "react";
import { Link } from "react-router-dom";
import { mergePdfs, getDownloadUrl } from "../../api/pdfApi";
import "../css/Merge.css";

function Merge() {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("PDF 파일을 2개 이상 선택해주세요");
      return;
    }
    setLoading(true);
    const data = await mergePdfs(files);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>🔗 PDF 병합</h2>
      <div className="file-bar">
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
      </div>

      {files.length > 0 && (
        <div id="fileList">
          {files.map((file, idx) => (
            <div className="item" key={idx}>📄 {file.name}</div>
          ))}
        </div>
      )}

      <button className="mergeBtn" onClick={handleMerge} disabled={loading}>
        {loading ? "병합 중..." : "🔗 병합 시작"}
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

export default Merge;