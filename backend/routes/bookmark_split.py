import os
import time
from pypdf import PdfReader, PdfWriter
from flask import Blueprint, request, jsonify, send_from_directory

bookmark_split_bp = Blueprint('bookmark_split', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads')


def get_bookmark_pages(reader):
    """북마크와 페이지 번호 목록 반환"""
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
                        "page": page_num,
                        "depth": depth
                    })
                except Exception:
                    pass

    walk(reader.outline)
    return bookmarks


@bookmark_split_bp.route('/api/bookmark-split', methods=['POST'])
def bookmark_split():
    file = request.files.get('file')

    if not file:
        return jsonify({"error": "파일이 없습니다"}), 400

    # 파일 저장
    save_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(save_path)

    reader = PdfReader(save_path)
    total_pages = len(reader.pages)

    # 북마크 가져오기
    bookmarks = get_bookmark_pages(reader)

    if not bookmarks:
        return jsonify({"error": "북마크가 없습니다"}), 400

    # 출력 폴더
    timestamp = int(time.time())
    out_dir = os.path.join(UPLOAD_FOLDER, f"bookmark_split_{timestamp}")
    os.makedirs(out_dir, exist_ok=True)

    # 북마크 기준으로 분할
    results = []
    for i, bm in enumerate(bookmarks):
        start = bm["page"]
        end = bookmarks[i + 1]["page"] - 1 if i + 1 < len(bookmarks) else total_pages - 1

        if start > end:
            continue

        writer = PdfWriter()
        for p in range(start, end + 1):
            writer.add_page(reader.pages[p])

        # 파일명 정리
        safe_title = "".join(c if c.isalnum() or c in " _-" else "_" for c in bm["title"])
        filename = f"{i+1:03d}_{safe_title}.pdf"
        out_path = os.path.join(out_dir, filename)

        with open(out_path, "wb") as f:
            writer.write(f)

        results.append({
            "title": bm["title"],
            "filename": filename,
            "pages": f"{start+1}~{end+1}",
            "download_url": f"/api/bookmark-split/download/{timestamp}/{filename}"
        })

    return jsonify({
        "message": f"북마크 기준 {len(results)}개 파일로 분할 완료",
        "results": results
    })


@bookmark_split_bp.route('/api/bookmark-split/download/<timestamp>/<filename>')
def bookmark_split_download(timestamp, filename):
    out_dir = os.path.join(UPLOAD_FOLDER, f"bookmark_split_{timestamp}")
    return send_from_directory(out_dir, filename, as_attachment=True)