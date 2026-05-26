import os
from pypdf import PdfReader, PdfWriter
from flask import Blueprint, request, jsonify

merge_bp = Blueprint('merge', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads')

@merge_bp.route('/api/merge', methods=['POST'])
def merge_files():
    files = request.files.getlist("files")

    if not files:
        return jsonify({"error": "파일이 없습니다"}), 400

    writer = PdfWriter()

    for file in files:
        save_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(save_path)
        reader = PdfReader(save_path)
        for page in reader.pages:
            writer.add_page(page)

    output_filename = "merged_output.pdf"
    output_path = os.path.join(UPLOAD_FOLDER, output_filename)

    with open(output_path, "wb") as f:
        writer.write(f)

    return jsonify({
        "message": "병합 완료",
        "download_url": f"/api/download/{output_filename}"
    })