import os
import time
from pypdf import PdfReader
from openpyxl import Workbook
from flask import Blueprint, request, jsonify, send_from_directory

bookmark_extract_bp = Blueprint('bookmark_extract', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads')


def get_all_bookmarks(reader):
    """북마크 전체 목록 반환 (depth 포함)"""
    bookmarks = []

    def walk(outline, depth=0):
        for item in outline:
            if isinstance(item, list):
                walk(item, depth + 1)
            else:
                try:
                    page_num = reader.get_destination_page_number(item)
                    bookmarks.append({
                        "title": item.title,
                        "page": page_num + 1,
                        "depth": depth
                    })
                except Exception:
                    pass

    walk(reader.outline)
    return bookmarks


@bookmark_extract_bp.route('/api/bookmark-extract', methods=['POST'])
def bookmark_extract():
    file = request.files.get('file')

    if not file:
        return jsonify({"error": "파일이 없습니다"}), 400

    save_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(save_path)

    reader = PdfReader(save_path)
    bookmarks = get_all_bookmarks(reader)

    if not bookmarks:
        return jsonify({"error": "북마크가 없습니다"}), 400

    # Excel 파일 생성
    wb = Workbook()
    ws = wb.active
    ws.title = "Bookmarks"

    # 헤더
    ws.append(["번호", "북마크 제목", "페이지", "레벨"])

    # 데이터
    for i, bm in enumerate(bookmarks):
        ws.append([i + 1, bm["title"], bm["page"], bm["depth"]])

    # 열 너비 조정
    ws.column_dimensions["A"].width = 8
    ws.column_dimensions["B"].width = 50
    ws.column_dimensions["C"].width = 10
    ws.column_dimensions["D"].width = 8

    # 저장
    timestamp = int(time.time())
    filename = f"bookmarks_{timestamp}.xlsx"
    out_path = os.path.join(UPLOAD_FOLDER, filename)
    wb.save(out_path)

    return jsonify({
        "message": f"북마크 {len(bookmarks)}개 추출 완료",
        "bookmarks": bookmarks,
        "download_url": f"/api/bookmark-extract/download/{filename}"
    })


@bookmark_extract_bp.route('/api/bookmark-extract/download/<filename>')
def bookmark_extract_download(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)