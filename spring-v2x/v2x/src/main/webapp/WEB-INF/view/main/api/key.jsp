<%@ page language="java" contentType="text/html; charset=UTF-8;" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<%@ include file="/WEB-INF/view/flow/include/head.jspf" %>
<link href="https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css" rel="stylesheet">
<script src="https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.js"></script>
<script src="/js/apexcharts.js" defer></script>
<script src="/js/roslib.min.js" defer></script>
<script src="/js/ros.js" defer></script>
<script src="https://unpkg.com/@turf/turf@6/turf.min.js" ></script> <%-- Turf : to smoothly animate a point along the distance of a line --%>
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=6ede651e5785dc0151f510d6f91aa7ea&libraries=services"></script>
<script src="/js/include/customDash.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://unpkg.com/three@0.126.0/examples/js/loaders/GLTFLoader.js"></script>
<script src="https://cdn.jsdelivr.net/gh/jscastro76/threebox@v.2.2.2/dist/threebox.min.js" type="text/javascript"></script>
<link rel="stylesheet" href="https://uicdn.toast.com/tui.date-picker/latest/tui-date-picker.css" />
<link rel="stylesheet" href="https://uicdn.toast.com/tui.pagination/latest/tui-pagination.css" />
<link rel="stylesheet" href="https://uicdn.toast.com/grid/latest/tui-grid.css" />
<link rel="stylesheet" href="https://uicdn.toast.com/chart/latest/toastui-chart.min.css" />
<script src="https://uicdn.toast.com/tui.date-picker/latest/tui-date-picker.js"></script>
<script type="text/javascript" src="https://uicdn.toast.com/tui.code-snippet/v1.5.0/tui-code-snippet.js"></script>
<script type="text/javascript" src="https://uicdn.toast.com/tui.pagination/v3.3.0/tui-pagination.js"></script>
<script src="https://uicdn.toast.com/grid/latest/tui-grid.js"></script>
<script src="https://uicdn.toast.com/chart/latest/toastui-chart.min.js"></script>
<body>
<%@ include file="/WEB-INF/view/flow/include/top.jspf" %>
<style>
    .tui-datepicker {
        z-index: 1;
    }
</style>

<main>
    <!-- 전체를 감싸는 Flex 컨테이너 -->
    <div class="flex flex-col md:flex-row">
        <div class="w-full grid grid-cols-1 gap-6 mt-1 bg-white p-3 rounded-lg shadow">
            <div class="col-span-12 grid grid-cols-1 gap-6">
                <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mt-6">
                    <div class="bg-white p-5 rounded-lg shadow">
                        <h3 class="text-xl mb-5 font-semibold">API Key Info</h3>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mt-6">
                        <div class="bg-white p-5 rounded-lg shadow">
                            <div class="grid gap-4 mb-4 sm:grid-cols-2">
                                <div>
                                    <label for="m_apiKey" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Key</label>
                                    <input type="text" id="m_apiKey" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled>
                                </div>
                            </div>
                            <div class="flex justify-end mt-10 space-x-4">
                                <button id="btnModalSave" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    신규신청 / 키변경
                                </button>
                                <button id="btnModalDelete" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                    삭제
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div id="confirmModal" class="fixed inset-0 z-50 hidden flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-white rounded-lg shadow-lg w-96 p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Confirm</h3>
            <p id="confirmMessage" class="text-gray-700 mb-6">정말로 이 작업을 수행하시겠습니까?</p>
            <div class="flex justify-end">
                <button id="cancelButton" class="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2" onclick="confirmCancel()">
                    취소
                </button>
                <button id="confirmButton" class="bg-red-500 text-white px-4 py-2 rounded-lg" onclick="confirmOk()">
                    확인
                </button>
            </div>
        </div>
    </div>
</main>
<%@ include file="/WEB-INF/view/flow/include/footer.jspf" %>


<script>
    let picker, grid;
    const reqNewApi = function() {

        resetModalFields('apiModal')
        showModal('apiModal')
    }

    function initDatePicker() {
        var today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        picker = tui.DatePicker.createRangePicker({
            startpicker: {
                date: oneWeekAgo,
                input: '#datepicker-range-start',
                container: '#startpicker-container'
            },
            endpicker: {
                date: today,
                input: '#datepicker-range-end',
                container: '#endpicker-container'
            },
            format: 'YYYY-MM-dd'
        });
    }

    function getSearchData() {
        let searchDate = {};
        const startDate = picker.getStartpicker().getDate(); // Get the start date
        const endDate = picker.getEndpicker().getDate(); // Get the end date
        const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
        const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;
        searchDate['startDate'] = formattedStartDate
        searchDate['endDate'] = formattedEndDate
        return searchDate
    }


    function getUserKey() {

        axios.post('/user/apikey/').then(function (response) {
            Log.d('response.data : ', response.data);
            const data = response.data
            if (data.result == true) {
                if(data.data == null) {
                    getID('m_apiKey').value = '';
                }
                else {
                    getID('m_apiKey').value = data.data.apiKey;
                }
            }
            else {
                // showAlert('Error','오류가 발생했습니다.', 'red');
            }
        }).catch(function (error) {
            Log.d('error() -> error=', error);
        });

    }

    function initGrid() {
        if(typeof grid != "undefined") {
            grid.destroy();
        }
        grid = new tui.Grid({
            el: document.getElementById('grid'),
            data: {
                api: {
                    readData: { url: '/apikey/apikey', method: 'GET' ,initParams: getSearchData() },
                }
            },
            scrollX: false,
            scrollY: false,
            pageOptions: {
                perPage: 5
            },
            columns: [
                {
                    header: 'seq',
                    name: 'apiKeySeq'
                },
                {
                    header: 'apiKey',
                    name: 'apiKey'
                },
                {
                    header: 'useYn',
                    name: 'useYn'
                },
                {
                    header: 'created',
                    name: 'created'
                },
                {
                    header: 'updated',
                    name: 'updated'
                }
            ]
        });

    }


    if(getID('btnModalSave')!=null) {
        document.getElementById('btnModalSave').addEventListener('click', async () => {
            const result = await showConfirmModal('API KEY 업데이트 하시겠습니까?');
            if (result) {
                axios.post('/user/apikey/add').then(function (response) {
                    Log.d('response.data : ', response.data);
                    const data = response.data
                    if (data.result == "SUCCESS") {
                        getUserKey();
                    }
                    else {

                    }
                }).catch(function (error) {
                    Log.d('error() -> error=', error);
                });
            }
        });
    }

    if(getID('btnModalDelete')!=null) {
        document.getElementById('btnModalDelete').addEventListener('click', async () => {
            const result = await showConfirmModal('API KEY를 삭제 하시겠습니까?');
            if (result) {
                axios.post('/user/apikey/delete').then(function (response) {
                    Log.d('response.data : ', response.data);
                    const data = response.data
                    if (data.result == "SUCCESS") {
                        getUserKey();
                    }
                    else {

                    }
                }).catch(function (error) {
                    Log.d('error() -> error=', error);
                });
            }
        });
    }



    window.addEventListener('DOMContentLoaded', function () {
        getUserKey()

    });


</script>