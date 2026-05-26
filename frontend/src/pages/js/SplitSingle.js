import { useState } from "react";
import { Link } from "react-router-dom";
import { getDownloadUrl, exportToExcel } from "../../api/pdfApi";
import "../css/global.css";
import "../css/Split.css";

function SplitSingle() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSplit = async () => {
    if (!file) {
      alert("PDF 파일을 선택해주세요");
      return;
    }

    setLoading(true);
    setResults([]);
    setChecked([]);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/api/split-single", {
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
    const mapped = data.results.map((r, idx) => ({ ...r, index: idx + 1 }));
    setResults(mapped);
    setChecked(mapped.map(() => true));
  };

  const toggleAll = (e) => {
    setChecked(checked.map(() => e.target.checked));
  };

  const toggleOne = (idx) => {
    const newChecked = [...checked];
    newChecked[idx] = !newChecked[idx];
    setChecked(newChecked);
  };

  const handleExcel = () => {
    const selected = results.filter((_, idx) => checked[idx]);
    if (selected.length === 0) {
      alert("선택된 항목이 없습니다");
      return;
    }
    exportToExcel(
      selected,
      [
        { header: "번호", key: "index" },
        { header: "파일명", key: "filename" },
        { header: "페이지", key: "page" },
      ],
      "split_single.xlsx"
    );
  };

  return (
    <div className="container">
      <h2>📄 단일 페이지 분할</h2>

      <div className="file-bar">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button className="splitBtn" onClick={handleSplit} disabled={loading}>
        {loading ? "분할 중..." : "📄 단일 페이지 분할"}
      </button>

      {loading && <p className="loading">⏳ 처리 중입니다...</p>}

      {message && <p style={{ marginTop: "16px" }}>✅ {message}</p>}

      {results.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <button
            className="splitBtn"
            onClick={handleExcel}
            style={{ marginBottom: "12px" }}
          >
            📊 선택 항목 Excel 내보내기
          </button>
          <table className="result-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={toggleAll}
                    checked={checked.every(Boolean)}
                  />
                </th>
                <th>페이지</th>
                <th>파일명</th>
                <th>다운로드</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, idx) => (
                <tr key={idx} style={{ background: checked[idx] ? "#edf4ff" : "white" }}>
                  <td>
                    <input
                      type="checkbox"
                      checked={checked[idx]}
                      onChange={() => toggleOne(idx)}
                    />
                  </td>
                  <td>{r.page}</td>
                  <td>{r.filename}</td>
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

export default SplitSingle;