import os
import time
from pypdf import PdfReader, PdfWriter
from flask import Blueprint, request, jsonify, send_from_directory

split_single_bp = Blueprint('split_single', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads')


@split_single_bp.route('/api/split-single', methods=['POST'])
def split_single():
    file = request.files.get('file')

    if not file:
        return jsonify({"error": "파일이 없습니다"}), 400

    save_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(save_path)

    reader = PdfReader(save_path)
    total_pages = len(reader.pages)

    timestamp = int(time.time())
    out_dir = os.path.join(UPLOAD_FOLDER, f"split_single_{timestamp}")
    os.makedirs(out_dir, exist_ok=True)

    results = []
    for i in range(total_pages):
        writer = PdfWriter()
        writer.add_page(reader.pages[i])

        filename = f"page_{i+1:03d}.pdf"
        out_path = os.path.join(out_dir, filename)

        with open(out_path, "wb") as f:
            writer.write(f)

        results.append({
            "filename": filename,
            "page": i + 1,
            "download_url": f"/api/split-single/download/{timestamp}/{filename}"
        })

    return jsonify({
        "message": f"총 {total_pages}페이지를 개별 파일로 분할 완료",
        "results": results
    })


@split_single_bp.route('/api/split-single/download/<timestamp>/<filename>')
def split_single_download(timestamp, filename):
    out_dir = os.path.join(UPLOAD_FOLDER, f"split_single_{timestamp}")
    return send_from_directory(out_dir, filename, as_attachment=True)