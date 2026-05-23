console.log("split.js 로드 완료");

// =========================
// ✂️ 로딩 상태
// =========================
function setLoading(state) {

    const btn = document.getElementById("splitBtn");
    const loading = document.getElementById("loading");

    if (state) {
        btn.disabled = true;
        btn.innerText = "처리 중...";
        loading.style.display = "block";
    } else {
        btn.disabled = false;
        btn.innerText = "✂️ PDF 분할 시작";
        loading.style.display = "none";
    }
}

// =========================
// 🔔 토스트 메시지
// =========================
function showToast(msg) {

    let toast = document.getElementById("toast");

    toast.innerText = msg;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}

// =========================
// ✂️ PDF Split 실행
// =========================
function splitFile() {

    const fileInput = document.getElementById("pdfFile");
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;

    if (fileInput.files.length === 0) {
        showToast("파일을 선택하세요");
        return;
    }

    if (!start || !end) {
        showToast("페이지 범위를 입력하세요");
        return;
    }

    if (parseInt(start) > parseInt(end)) {
        showToast("페이지 범위가 잘못되었습니다");
        return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("file", fileInput.files[0]);
    formData.append("start", start);
    formData.append("end", end);

    fetch("/split", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {

        setLoading(false);

        if (data.download_url) {

            showToast("분할 완료!");

            const a = document.createElement("a");
            a.href = data.download_url;
            a.click();

        } else {
            showToast(data.message || "실패");
        }
    })
    .catch(err => {

        setLoading(false);

        console.error(err);
        showToast("split 실패");
    });
}