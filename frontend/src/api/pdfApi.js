import * as XLSX from "xlsx";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function mergePdfs(files) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await fetch(`${BASE_URL}/api/merge`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function splitPdf(file, start, end) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("start", start);
  formData.append("end", end);

  const res = await fetch(`${BASE_URL}/api/split`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export function getDownloadUrl(path) {
  return `${BASE_URL}${path}`;
}

export function exportToExcel(results, columns, filename = "result.xlsx") {
  const data = results.map((r) => {
    const row = {};
    columns.forEach((col) => {
      row[col.header] = r[col.key];
    });
    return row;
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Result");
  XLSX.writeFile(wb, filename);
}