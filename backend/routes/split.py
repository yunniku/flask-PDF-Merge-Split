import os
import time
from pypdf import PdfReader, PdfWriter
from flask import Blueprint, request, jsonify

split_bp = Blueprint('split', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads')

@split_bp.route('/api/split', methods=['POST'])
def split_pdf():
    file = request.files.get('file')

    if not file:
        return jsonify({"error": "파일이 없습니다"}), 400

    start = int(request.form.get('start', 1))
    end = int(request.form.get('end', 1))

    save_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(save_path)

    reader = PdfReader(save_path)
    writer = PdfWriter()
    total_pages = len(reader.pages)

    start = max(1, start)
    end = min(end, total_pages)

    for i in range(start - 1, end):
        writer.add_page(reader.pages[i])

    output_filename = f"split_{int(time.time())}.pdf"
    output_path = os.path.join(UPLOAD_FOLDER, output_filename)

    with open(output_path, "wb") as f:
        writer.write(f)

    return jsonify({
        "message": "분할 완료",
        "download_url": f"/api/download/{output_filename}"
    })