<%@ page language="java" contentType="text/html; charset=UTF-8;" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<%@ include file="/WEB-INF/view/flow/include/head.jspf" %>
<body>
    <%@ include file="/WEB-INF/view/flow/include/top.jspf" %>
    <%@ include file="/WEB-INF/view/flow/include/sidebar.jspf" %>

<!-- Main content -->
<main>
        <!-- Main Content -->
        <div class="flex flex-col">
            <div class="flex justify-between items-center">
                <h2 class="text-3xl font-semibold">API 요청/사용 리스트</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mt-6">
                <div class="bg-white p-5 rounded-lg shadow">
                    <h3 class="text-xl mb-5 font-semibold">Policy Info</h3>
                    <div id="policyGrid" class="overflow-x-auto"></div>
                </div>
            </div>


            <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mt-6">
                <div class="bg-white p-5 rounded-lg shadow">
                    <h3 class="text-xl mb-5 font-semibold">API Key Info</h3>
                    <div id="grid" class="overflow-x-auto"></div>
                    <div class="flex justify-start mt-2">
                        <button id="customButton" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onclick="reqNewApi()">
                            신규신청
                        </button>
                    </div>
                </div>
            </div>


            <div id="apiModal" tabindex="-1" aria-hidden="true" class="fixed inset-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto h-[calc(100%-1rem)] max-h-full">
                <div class="relative w-full max-w-2xl max-h-full mx-auto mt-20">
                    <!-- Modal content -->
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <!-- Modal header -->
                        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
                                API Key 신규 신청
                            </h1>
                            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="apiModal" onclick="hideModal('apiModal2')">
                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        <!-- Modal body -->
                        <div class="p-4 md:p-5 space-y-4">
                            <div class="relative w-full">
                                <label for="m_apiEntity_apiSeq" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select a country</label>
                                <select id="m_apiEntity_apiSeq" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="">선택하세요</option>
                                    <c:forEach var="list" items="${apiList}" varStatus="status">
                                        <option value="${list.apiSeq}">${list.apiName}</option>
                                    </c:forEach>
                                </select>
                            </div>
                            <div class="relative w-full">
                                <label for="m_apiPolicyEntity_policySeq" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">정책명</label>
                                <select id="m_apiPolicyEntity_policySeq" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="">선택하세요</option>
                                    <c:forEach var="list" items="${policyList}" varStatus="status">
                                        <option value="${list.policySeq}">${list.policyName}</option>
                                    </c:forEach>
                                </select>
                            </div>
                        </div>
                        <!-- Modal footer -->
                        <div class="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 space-x-2">
                            <button type="button" id="btnModalSave" class="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                Save
                            </button>
                            <button type="button" id="btnModalCancel" data-modal-hide="apiModal" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onclick="hideModal('apiModal2')">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <div id="apiModal2" tabindex="-1" aria-hidden="true" class="fixed inset-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto h-[calc(100%-1rem)] max-h-full">
                <div class="relative w-full max-w-2xl max-h-full mx-auto mt-20">
                    <!-- Modal content -->
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <!-- Modal header -->
                        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
                                API Key 상세
                            </h1>
                            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="apiModal2" onclick="hideModal('apiModal2')">
                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        <!-- Modal body -->
                        <div class="p-4 md:p-5 space-y-4">
                            <div id="apiModalBody2" class="space-y-4">
                                <div id="apiKey" class="space-y-2">
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">API Key</label>
                                    <input id="m_seq" type="hidden" class="form-control" disabled/>
                                    <div class="relative">
                                        <input id="m_apiKeyEntity_apiKey" class="form-control w-full p-2.5 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white" disabled />
                                        <button data-copy-to-clipboard-target="m_apiKeyEntity_apiKey" data-tooltip-target="tooltip-api-key" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-0 inline-flex items-center justify-center">
                                            <span id="default-icon-api-key" class="bg-white p-1 rounded">
                                                <svg class="w-7 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
                                                </svg>
                                            </span>
                                                                            <span id="success-icon-api-key" class="hidden inline-flex items-center bg-white p-1 rounded">
                                                <svg class="w-7 h-7 text-blue-700 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                                </svg>
                                            </span>
                                        </button>
                                        <div id="tooltip-api-key" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-lg opacity-0 tooltip dark:bg-gray-700">
                                            <span id="default-tooltip-message-api-key">Copy to clipboard</span>
                                            <span id="success-tooltip-message-api-key" class="hidden">Copied!</span>
                                            <div class="tooltip-arrow" data-popper-arrow></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">상태</label>
                                    <input id="m_apiKeyStatusCode_statusName" class="form-control w-full p-2.5 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white" disabled/>
                                </div>
                            </div>
                        </div>
                        <!-- Modal footer -->
                        <div class="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 space-x-2">
                            <button type="button" id="btnModalDelete" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                Delete
                            </button>
                            <button type="button" id="btnModal2Cancel" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onclick="hideModal('apiModal2')">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</main>
<!-- Footer -->
<%@ include file="/WEB-INF/view/flow/include/footer.jspf" %>
<script>
    let clipboardJson;
    let table = null;
    let policyTable = null;

    window.addEventListener('DOMContentLoaded', function() {
        initModal('apiModal')
        initModal('apiModal2')
        initPolicy();
        initTable();
        copy();
    });

    const copy = function() {
        clipboardJson = {
            defaultMessage: document.getElementById('default-tooltip-message-api-key'),
            successMessage: document.getElementById('success-tooltip-message-api-key'),
            defaultIcon: document.getElementById('default-icon-api-key'),
            successIcon: document.getElementById('success-icon-api-key')
        }
    }

    const reqNewApi = function() {

        resetModalFields('apiModal')
        showModal('apiModal')
    }

    const apiKeyOpen = function(seq) {
        showModal('apiModal2')
        resetModalFields('apiModal2')
        const clipboardExternalID = FlowbiteInstances.getInstance('CopyClipboard', 'm_apiKeyEntity_apiKey');
        const tooltipExternalID = FlowbiteInstances.getInstance('Tooltip', 'tooltip-api-key');
        clipboardJson['clipboard'] = clipboardExternalID;
        clipboardJson['tooltip'] = tooltipExternalID;
        clipboardJson.clipboard.updateOnCopyCallback(() => {
            showSuccess(clipboardJson.defaultMessage, clipboardJson.successMessage);
            showSuccess(clipboardJson.defaultIcon, clipboardJson.successIcon);
            clipboardJson.tooltip.show();
            setTimeout(() => {
                resetToDefault(clipboardJson.defaultMessage, clipboardJson.successMessage);
                resetToDefault(clipboardJson.defaultIcon, clipboardJson.successIcon);
                clipboardJson.tooltip.hide();
            }, 2000);
        })

        axios.post('/user/apikey/'+seq,).then(function (response) {
            Log.d('response.data : ', response.data);
            const data = response.data

            if (data.result == "SUCCESS") {
                const preFix = 'm_';
                const companyEntityApiKey = data['companyEntityApiKey'];
                for(let key in companyEntityApiKey) {
                    inserPopupValue(preFix, key, companyEntityApiKey[key]);
                }
            }
            else {
                showAlert('Error','오류가 발생했습니다.', 'red');
            }
        }).catch(function (error) {
            Log.d('error() -> error=', error);
        });
    }


    function initTable() {
        table = new gridjs.Grid({
            columns: ['순서', 'API 키','허용정책','Api명','Api주소','상태','수정일','요청일'],
            server: {
                url: '/user/apikey',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: (prev, page) => JSON.stringify({
                    page: page, // 현재 페이지 번호
                    size: 5     // 페이지 당 항목 수 (limit과 일치시킴)
                }),
                then: data => {
                    return data.data.map(item => [
                            item.seq,
                            gridjs.html(
                                '<button class="bg-blue-500 text-white px-4 py-2 rounded" ' +
                                ' onclick="apiKeyOpen(%s)"> Key 확인/삭제 </button>'.sprintf(item.seq)
                            ),
                            item.apiPolicyEntity.policyName,
                            item.apiEntity.apiName,
                            item.apiEntity.apiPath,
                            item.apiKeyStatusCode.statusName,
                            item.updated,
                            item.created
                        ]
                    )
                }
            },
            pagination: {
                enabled: true,
                limit: 5
            },
            sort: true,
            className: {
                table: 'w-full text-sm text-left text-gray-500 border-collapse',
                th: 'py-3 px-4 text-xs font-semibold text-gray-700 uppercase bg-gray-50 border-b border-gray-200',
                td: 'py-2 px-4 border-b border-gray-200'
            }
        }).render(document.getElementById('grid'));
    }

    function updateTable() {
        table.updateConfig({
            server: {
                url: '/user/apikey',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: (prev, page) => JSON.stringify({
                    page: page, // 현재 페이지 번호
                    size: 5     // 페이지 당 항목 수 (limit과 일치시킴)
                }),
                then: data => {
                    return data.data.map(item => [
                            item.seq,
                            gridjs.html(
                                '<button class="bg-blue-500 text-white px-4 py-2 rounded" ' +
                                ' onclick="apiKeyOpen(%s)"> Key 확인/삭제 </button>'.sprintf(item.seq)
                            ),
                            item.apiPolicyEntity.policyName,
                            item.apiEntity.apiName,
                            item.apiEntity.apiPath,
                            item.apiKeyStatusCode.statusName,
                            item.updated,
                            item.created
                        ]
                    )
                }
            }
        }).forceRender();
    }

    function initPolicy() {

        policyTable = new gridjs.Grid({
            columns: ['PolicySeq', 'PolicyName','사용량 (Month)'],
            server: {
                url: '/user/policy',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: (prev, page) => JSON.stringify({
                    page: page, // 현재 페이지 번호
                    size: 10     // 페이지 당 항목 수 (limit과 일치시킴)
                }),
                then: data => {
                    return data.data.map(item => [
                            item.policySeq,
                            item.policyName,
                            item.count
                        ]
                    )
                }
            },
            pagination: {
                enabled: true,
                limit: 10
            },
            sort: true,
            className: {
                table: 'w-full text-sm text-left text-gray-500 border-collapse',
                th: 'py-3 px-4 text-xs font-semibold text-gray-700 uppercase bg-gray-50 border-b border-gray-200',
                td: 'py-2 px-4 border-b border-gray-200'
            }
        }).render(document.getElementById('policyGrid'));
    }



    getID('btnModalSave').onclick = function(e) {
        const policySeq = getID('m_apiPolicyEntity_policySeq').value;
        const apiSeq = getID('m_apiEntity_apiSeq').value;
        if(apiSeq == '' || apiSeq.length == 0) {
            showAlert('Info', 'API를 선택해 주세요', 'blue')
            return;
        }
        if(policySeq == '' || policySeq.length == 0) {
            showAlert('Info', '정책을 선택 주세요', 'blue')
            return;
        }
        let companyEntityApiKeyEntity = {}
        let apiEntity = {}
        let apiPolicyEntity = {}

        apiEntity['apiSeq'] = apiSeq;
        apiPolicyEntity['policySeq'] = policySeq;
        companyEntityApiKeyEntity['apiEntity'] = apiEntity;
        companyEntityApiKeyEntity['apiPolicyEntity'] = apiPolicyEntity;
        axios.post('/user/apikey/add',companyEntityApiKeyEntity).then(function (response) {
            Log.d('response.data : ', response.data);
            const data = response.data
            if (data.result == "SUCCESS") {
                hideModal('apiModal')
                updateTable();
            }
            else {
                if(typeof data.desc == "undefined") {
                    showAlert('Error','요청에 실패하였습니다.', 'red');
                }
                else {
                    showAlert('Error',data.desc, 'red');
                }

            }
        }).catch(function (error) {
            Log.d('error() -> error=', error);
        });


    }

    if(getID('btnModalDelete')!=null) {
        document.getElementById('btnModalDelete').addEventListener('click', async () => {
            const result = await showConfirmModal('정말로 이 항목을 삭제하시겠습니까?');
            if (result) {
                const seq = getID('m_seq').value;
                if(seq == '' || seq.length == 0) {
                    showAlert('Info', 'API를 선택해 주세요', 'blue')
                    alert('');
                    return;
                }
                const companyEntityApiKeyEntity = {
                    'seq' : seq
                }
                axios.post('/user/apikey/delete', companyEntityApiKeyEntity).then(function (response) {
                    Log.d('response.data : ', response.data);
                    const data = response.data
                    if (data.result == "SUCCESS") {
                        updateTable();
                        hideModal('apiModal2');
                    }
                    else {
                        showAlert('Error','오류가 발생하였습니다', 'red');
                    }
                }).catch(function (error) {
                    Log.d('error() -> error=', error);
                });
            }
        });
    }

</script>
</body>
</html>
