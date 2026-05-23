console.log("merge.js 로드 완료");

const fileInput = document.getElementById("pdfFiles");
const fileList = document.getElementById("fileList");

let fileArray = [];
let selectedIndex = null;


// =========================
// 파일 추가
// =========================

fileInput.addEventListener("change", function () {

    const newFiles = Array.from(fileInput.files);

    newFiles.forEach(file => {

        const exists = fileArray.some(
            f => f.name === file.name
        );

        if (!exists) {
            fileArray.push(file);
        }

    });

    fileInput.value = "";

    renderList();
});


// =========================
// 리스트 출력
// =========================

function renderList() {

    fileList.innerHTML = "";

    fileArray.forEach((file, index) => {

        const div = document.createElement("div");

        div.className = "item";

        if (index === selectedIndex) {
            div.classList.add("selected");
        }

        div.textContent =
            `${index + 1}. ${file.name}`;

        div.onclick = () => {

            if (selectedIndex === index) {
                selectedIndex = null;
            }
            else {
                selectedIndex = index;
            }

            renderList();
        };

        fileList.appendChild(div);

    });

}


// =========================
// 선택 삭제
// =========================

function deleteSelected() {

    if (selectedIndex === null) return;

    fileArray.splice(selectedIndex, 1);

    selectedIndex = null;

    renderList();
}


// =========================
// 위로 이동
// =========================

function moveUpSelected() {

    if (selectedIndex === null) return;

    if (selectedIndex === 0) return;

    [
        fileArray[selectedIndex - 1],
        fileArray[selectedIndex]
    ] =
    [
        fileArray[selectedIndex],
        fileArray[selectedIndex - 1]
    ];

    selectedIndex--;

    renderList();
}


// =========================
// 아래 이동
// =========================

function moveDownSelected() {

    if (selectedIndex === null) return;

    if (selectedIndex === fileArray.length - 1)
        return;

    [
        fileArray[selectedIndex],
        fileArray[selectedIndex + 1]
    ] =
    [
        fileArray[selectedIndex + 1],
        fileArray[selectedIndex]
    ];

    selectedIndex++;

    renderList();
}


// =========================
// 병합
// =========================

function mergeFiles() {

    if (fileArray.length === 0) {

        alert("파일을 선택하세요.");

        return;
    }

    const formData = new FormData();

    fileArray.forEach(file => {

        formData.append("files", file);

    });

    fetch("/merge", {

        method: "POST",

        body: formData

    })
    .then(res => res.json())
    .then(data => {

        window.location.href =
            data.download_url;

    })
    .catch(err => {

        console.error(err);

        alert("병합 실패");

    });
}