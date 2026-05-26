import os
import re
import time
import fitz
from pypdf import PdfReader, PdfWriter
from flask import Blueprint, request, jsonify, send_from_directory

split_fields_bp = Blueprint('split_fields', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads')


def sanitize_title(name: str, max_len: int = 120) -> str:
    safe = re.sub(r'[\\/:*?"<>|]+', "_", str(name or "").strip())
    safe = re.sub(r"\s+", " ", safe)
    return safe[:max_len] if len(safe) > max_len else safe


def extract_fields_from_page(page,
                             y_top=1625, y_bottom=1665,
                             sub_x=(1690, 1740),
                             module_x=(1765, 1840),
                             iso_y_tol=10):
    out = {"sub_id": "", "module": "", "iso": ""}
    words = page.get_text("words")
    if not words:
        return out

    # SUB ID
    subid_words = [w for w in words if y_top <= w[1] <= y_bottom and sub_x[0] <= w[0] <= sub_x[1]]
    if subid_words:
        out["sub_id"] = " ".join(w[4] for w in sorted(subid_words, key=lambda x: x[0]))

    # MODULE
    module_words = [w for w in words if y_top <= w[1] <= y_bottom and module_x[0] <= w[0] <= module_x[1]]
    if module_words:
        out["module"] = " ".join(w[4] for w in sorted(module_words, key=lambda x: x[0]))

    # ISO
    texts = [w[4].upper() for w in words]
    for i in range(len(texts) - 2):
        if texts[i] == "ISO" and texts[i+1].startswith("DWG") and texts[i+2].startswith("NO"):
            lx1 = words[i+2][2]
            ly0 = words[i][1]
            candidates = [w for w in words if abs(w[1] - ly0) < iso_y_tol and w[0] > (lx1+10)]
            if candidates:
                out["iso"] = sorted(candidates, key=lambda x: x[0])[0][4].strip()
            break
    return out


def compose_title(fields: dict) -> str:
    parts = []
    if fields.get("sub_id"): parts.append(fields["sub_id"].strip())
    if fields.get("module"): parts.append(fields["module"].strip())
    if fields.get("iso"): parts.append(fields["iso"].strip())
    return sanitize_title("_".join(parts) if parts else "PAGE")


@split_fields_bp.route('/api/split-fields', methods=['POST'])
def split_fields():
    file = request.files.get('file')

    if not file:
        return jsonify({"error": "파일이 없습니다"}), 400

    save_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(save_path)

    doc = fitz.open(save_path)
    reader = PdfReader(save_path)
    total_pages = doc.page_count

    timestamp = int(time.time())
    out_dir = os.path.join(UPLOAD_FOLDER, f"split_fields_{timestamp}")
    os.makedirs(out_dir, exist_ok=True)

    # 페이지별 타이틀 추출
    titles = []
    for i in range(total_pages):
        fields = extract_fields_from_page(doc[i])
        title = compose_title(fields)
        titles.append(title or "PAGE")

    # 같은 타이틀 연속되면 묶기
    starts = []
    last = None
    for i, t in enumerate(titles):
        if i == 0 or t != last:
            starts.append((i, t))
            last = t

    ranges = [
        (p, (starts[idx+1][0]-1 if idx+1 < len(starts) else total_pages-1), t)
        for idx, (p, t) in enumerate(starts)
    ]

    results = []
    used_names = {}

    for start, end, title in ranges:
        writer = PdfWriter()
        for p in range(start, end + 1):
            writer.add_page(reader.pages[p])

        # 중복 파일명 처리
        base_name = title
        if base_name in used_names:
            used_names[base_name] += 1
            filename = f"{base_name}_{used_names[base_name]}.pdf"
        else:
            used_names[base_name] = 0
            filename = f"{base_name}.pdf"

        out_path = os.path.join(out_dir, filename)
        with open(out_path, "wb") as f:
            writer.write(f)

        results.append({
            "title": title,
            "filename": filename,
            "pages": f"{start+1}~{end+1}",
            "download_url": f"/api/split-fields/download/{timestamp}/{filename}"
        })

    doc.close()

    return jsonify({
        "message": f"필드 기반 {len(results)}개 파일로 분할 완료",
        "results": results
    })


@split_fields_bp.route('/api/split-fields/download/<timestamp>/<filename>')
def split_fields_download(timestamp, filename):
    out_dir = os.path.join(UPLOAD_FOLDER, f"split_fields_{timestamp}")
    return send_from_directory(out_dir, filename, as_attachment=True)