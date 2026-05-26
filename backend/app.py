import os
from flask import Flask, send_from_directory
from flask_cors import CORS

from routes.merge import merge_bp
from routes.split import split_bp

app = Flask(__name__)
CORS(app)  # React(3000포트)에서 Flask(5000포트) 요청 허용

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Blueprint 등록
app.register_blueprint(merge_bp)
app.register_blueprint(split_bp)

@app.route('/api/download/<filename>')
def download(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True, port=5000)