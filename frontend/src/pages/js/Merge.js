import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { mergePdfs, getDownloadUrl } from "../../api/pdfApi";
import "../css/global.css";
import "../css/Merge.css";

function Merge() {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const dragItem = useRef(null);
  const dragOver = useRef(null);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setResult(null);
  };

  const handleDragStart = (idx) => {
    dragItem.current = idx;
  };

  const handleDragEnter = (idx) => {
    dragOver.current = idx;
  };

  const handleDragEnd = () => {
    const newFiles = [...files];
    const draggedFile = newFiles.splice(dragItem.current, 1)[0];
    newFiles.splice(dragOver.current, 0, draggedFile);
    dragItem.current = null;
    dragOver.current = null;
    setFiles(newFiles);
  };

  const handleRemove = (idx) => {
    const newFiles = files.filter((_, i) => i !== idx);
    setFiles(newFiles);
  };

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
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="fileInput"
        />
        <label htmlFor="fileInput" className="file-label">
          {files.length > 0 ? `📄 파일 ${files.length}개 선택됨` : "📂 파일 선택 (클릭)"}
        </label>
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <p style={{ fontSize: "13px", color: "#888", marginBottom: "8px" }}>
            ↕ 드래그로 순서를 바꿀 수 있어요
          </p>
          <div id="fileList">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="item"
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragEnter={() => handleDragEnter(idx)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
              >
                <span style={{ marginRight: "8px", color: "#aaa" }}>☰</span>
                <span style={{ flex: 1 }}>📄 {file.name}</span>
                <button
                  onClick={() => handleRemove(idx)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#e74c3c",
                    fontWeight: "bold",
                    fontSize: "16px"
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
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