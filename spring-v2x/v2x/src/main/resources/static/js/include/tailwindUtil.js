
let apiModalJson = {};
function appendConfirmModal() {
    const confirmModal = document.getElementById('confirmModal');
    document.body.appendChild(confirmModal);
}

function showConfirmModal(message) {
    appendConfirmModal();
    return new Promise((resolve, reject) => {
        document.getElementById('confirmMessage').textContent = message;
        document.getElementById('confirmModal').classList.remove('hidden');
        document.getElementById('confirmButton').onclick = function() {
            resolve(true);
            document.getElementById('confirmModal').classList.add('hidden');
        };
        document.getElementById('cancelButton').onclick = function() {
            resolve(false);
            document.getElementById('confirmModal').classList.add('hidden');
        };
    });
}


function showAlert(title, description, color) {


    const alertBox = document.getElementById('alertBox');
    const alertMessage = document.getElementById('alertMessage');
    const alertDescription = document.getElementById('alertDescription');

    alertMessage.textContent = title;
    alertDescription.textContent = description;

    // 색상 변경
    alertBox.classList.remove('bg-blue-100', 'bg-green-100', 'bg-red-100', 'text-blue-700', 'text-green-700', 'text-red-700');
    if (color === 'blue') {
        alertBox.classList.add('bg-blue-100', 'text-blue-700');
    } else if (color === 'green') {
        alertBox.classList.add('bg-green-100', 'text-green-700');
    } else if (color === 'red') {
        alertBox.classList.add('bg-red-100', 'text-red-700');
    }

    const currentModal = document.querySelector('.fixed:not(.hidden)');

    // 해당 모달 내부에 토스트 메시지 삽입
    if (currentModal) {
        const firstDiv = currentModal.querySelector('div > div');
        if (firstDiv) {
            alertBox.style.left = '';
            alertBox.style.width = '';
            alertBox.style.position = '';
            alertBox.style.zIndex = '';
            firstDiv.appendChild(alertBox);
        }
    }
    else {
        const sidebar = document.querySelector('aside'); // 사이드바 요소 찾기
        const sidebarWidth = sidebar ? sidebar.offsetWidth : 0
        const main = document.querySelector('main'); // main 요소 찾기
        alertBox.style.left = (sidebarWidth + 20) + 'px';
        alertBox.style.width = 'calc(100% - ' + (sidebarWidth + 40) + 'px)';
        alertBox.style.position = 'absolute'
        alertBox.style.zIndex = '60'
        main.appendChild(alertBox);
    }

    // Alert 표시
    alertBox.classList.remove('hidden');
}

// Alert 닫기 함수
function closeAlert() {
    const alertBox = document.getElementById('alertBox');
    alertBox.classList.add('hidden');
}

function getID(id) {
    if (typeof id !== 'string') {
        console.warn("getID: Provided ID is not a string.");
        return null;
    }
    return document.getElementById(id);
}


function resetModalFields(modalId) {
    const modalElement = getID(modalId);
    if (!modalElement) {
        console.warn("resetModalFields: Modal with ID " + modalId + " not found.");
        return;
    }

    const elements = modalElement.querySelectorAll('[id^="m_"]');
    elements.forEach(element => {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
            if (element.type === 'file') {
                const previewId = '%s-preview'.sprintf(element.id);
                const previewImage = getID(previewId);
                if (previewImage) {
                    previewImage.src = '';
                }
            } else {
                element.value = '';
            }
        } else if (element.tagName === 'A') {
            element.removeAttribute('href');  // 링크 초기화
            element.innerText = '';
        } else if (element.tagName === 'AUDIO' || element.tagName === 'VIDEO') {
            element.removeAttribute('src');
        } else if (element.tagName === 'IMG') {
            element.src = '';
        } else {
            element.innerText = '';
        }
    });
}

const showSuccess = ($defaultEl, $successEl) => {
    $defaultEl.classList.add('hidden');
    $successEl.classList.remove('hidden');
}

const resetToDefault = ($defaultEl, $successEl) => {
    $defaultEl.classList.remove('hidden');
    $successEl.classList.add('hidden');
}

const showModal = function(id) {
    if(typeof apiModalJson[id] != "undefined") {
        apiModalJson[id].show();
    }
}

const hideModal = function(id) {
    if(typeof apiModalJson[id] != "undefined") {
        apiModalJson[id].hide();
    }
}

const initModal = function(id) {
    const $targetEl = document.getElementById(id);
    const options = {
        backdrop: 'dynamic',
        backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
        closable: false
    };
    apiModalJson[id] = new Modal($targetEl, options);
}

