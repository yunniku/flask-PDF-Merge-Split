import os
import time
from pypdf import PdfReader, PdfWriter
from flask import Flask, render_template, request, jsonify, send_from_directory

app = Flask(__name__)

# =========================
# 📁 폴더 설정 (실무 구조)
# =========================
UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "static/output"

# merge 결과 파일명 (고정)
MERGE_FILE = "merged_output.pdf"

# =========================
# 📁 폴더 자동 생성
# =========================
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# =========================
# ⚙️ Flask 설정
# =========================
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["OUTPUT_FOLDER"] = OUTPUT_FOLDER


# =========================
# 🌐 페이지
# =========================
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/merge')
def merge_page():
    return render_template('merge.html')


@app.route('/split')
def split_page():
    return render_template('split.html')


# =========================
# 🚀 PDF MERGE
# =========================
@app.route('/merge', methods=['POST'])
def merge_files():

    files = request.files.getlist("files")

    if not files:
        return jsonify({"message": "파일 없음"}), 400

    file_paths = []

    # 1️⃣ 업로드 저장
    for file in files:
        save_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(save_path)
        file_paths.append(save_path)

    # 2️⃣ PDF 병합
    writer = PdfWriter()

    for path in file_paths:
        reader = PdfReader(path)
        for page in reader.pages:
            writer.add_page(page)

    # 3️⃣ 결과 저장 (OUTPUT_FOLDER로 통일)
    output_path = os.path.join(app.config["OUTPUT_FOLDER"], MERGE_FILE)

    with open(output_path, "wb") as f:
        writer.write(f)

    return jsonify({
        "message": "병합 완료",
        "download_url": f"/download/{MERGE_FILE}"
    })


# =========================
# ✂️ PDF SPLIT
# =========================
@app.route('/split', methods=['POST'])
def split_pdf():

    file = request.files.get('file')
    start = int(request.form.get('start'))
    end = int(request.form.get('end'))

    if not file:
        return jsonify({"message": "파일 없음"}), 400

    # 1️⃣ 업로드 저장
    save_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(save_path)

    # 2️⃣ PDF 읽기
    reader = PdfReader(save_path)
    writer = PdfWriter()

    total_pages = len(reader.pages)

    # 안전 범위 처리
    start = max(1, start)
    end = min(end, total_pages)

    # 3️⃣ 페이지 추출
    for i in range(start - 1, end):
        writer.add_page(reader.pages[i])

    # 4️⃣ 결과 파일 생성 (유니크 이름)
    filename = f"split_{int(time.time())}.pdf"
    output_path = os.path.join(app.config["OUTPUT_FOLDER"], filename)

    with open(output_path, "wb") as f:
        writer.write(f)

    return jsonify({
        "message": "split 완료",
        "download_url": f"/download/{filename}"
    })


# =========================
# 📥 다운로드 (핵심 수정 완료)
# =========================
@app.route('/download/<filename>')
def download(filename):

    return send_from_directory(
        app.config["OUTPUT_FOLDER"],
        filename,
        as_attachment=True
    )


# =========================
# 🚀 실행
# =========================
if __name__ == '__main__':
    app.run(debug=True)