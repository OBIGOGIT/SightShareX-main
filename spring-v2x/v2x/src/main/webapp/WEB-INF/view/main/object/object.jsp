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

            <div class="col-span-12 gap-6 bg-white p-1 rounded-lg shadow">
                <div class="flex items-center space-x-4">
                    <div id="date-range-picker2" class="flex items-center space-x-2 text-right">
                        <label for="datepicker-range-start" class="text-sm font-medium">Select Date:</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                                </svg>
                            </div>
                            <input type="text" id="datepicker-range-start" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" aria-label="Date-Time">
                            <div id="startpicker-container" style="margin-left: -1px;"></div>
                        </div>
                        <span class="mx-2 text-gray-500">to</span>

                        <div class="relative">
                            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                                </svg>
                            </div>
                            <input id="datepicker-range-end" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="Select end">
                            <div id="endpicker-container" style="margin-left: -1px;"></div>

                        </div>
                        <button id="btnSearch" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto" onclick="initGrid()">
                            search
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-span-12 gap-6 bg-white p-1 rounded-lg shadow">
                <div id="map" class="map" style="width: 100%; height: 50vh;"></div>
            </div>

            <div class="col-span-12 grid grid-cols-1 gap-6">
                <div id="grid" style="width: 100%"></div>
            </div>
        </div>
    </div>
</main>
<%@ include file="/WEB-INF/view/flow/include/footer.jspf" %>


<script>

    let picker, grid, chart;
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


    function initChart() {

        let dataList = grid.getData();

        let rttValues = [];
        let mbpsValues = [];
        let packetRateValues = [];
        let packetSizeValues = [];
        let createdValues = [];

        for (let i = 0; i < dataList.length; i++) {
            rttValues.push(Number((dataList[i].rtt / 60000).toFixed(2)));  // rtt를 분 단위로 변환
            mbpsValues.push(dataList[i].mbps);                     // mbps 값을 추출
            packetRateValues.push(dataList[i].packetRate);                     // mbps 값을 추출
            packetSizeValues.push(dataList[i].packetSize);                     // mbps 값을 추출
            let createdDate = new Date(dataList[i].created);
            createdValues.push(createdDate.getTime());          // Unix timestamp로 변환
        }

        const data = {
            'categories':createdValues,
            'series':[
                {
                    'name':'rtt',
                    'data':rttValues
                },
                {
                    'name':'mbps',
                    'data':mbpsValues
                },
                {
                    'name':'packetRate',
                    'data':packetRateValues
                },
                {
                    'name':'packetSizeValues',
                    'data':packetSizeValues
                }
            ]
        }

        const options = {
            chart: { title: 'OBU Performance Chart', width: 'auto', height: 'auto' },
            xAxis: {
                type: 'datetime', // 날짜 데이터를 사용할 경우
                label: {
                    rotation: false
                },
                date: {
                    format: 'MM-dd:HH:mm:ss', // 원하는 포맷
                },
            },
            legend: {
                align: 'bottom',
            },
        };

        const el = document.getElementById('chart-area');
        if(typeof chart != "undefined") {
            chart.destroy();
        }
        chart = toastui.Chart.lineChart({ el, data, options });
    }

    function initGrid() {


        if(typeof grid != "undefined") {
            grid.destroy();
        }
        grid = new tui.Grid({
            el: document.getElementById('grid'),
            data: {
                api: {
                    readData: { url: '/object/object', method: 'GET' ,initParams: getSearchData() },
                }
            },
            scrollX: false,
            scrollY: false,
            pageOptions: {
                perPage: 5
            },
            columns: [
                {
                    header: 'id',
                    name: 'id'
                },
                {
                    header: 'objectType',
                    name: 'objectType'
                },
                {
                    header: 'totalCount',
                    name: 'totalCount'
                },
                {
                    header: 'active',
                    name: 'active'
                },
                {
                    header: 'detecting',
                    name: 'detecting'
                },
                {
                    header: 'lastLat',
                    name: 'lastLat'
                },

                {
                    header: 'lastLng',
                    name: 'lastLat'
                },

                {
                    header: 'imagePath',
                    name: 'imagePath'
                },
                {
                    header: 'created',
                    name: 'created'
                }
            ]
        });
        //
        // grid.on(`afterPageMove`, (ev) => {
        //     initChart();
        // });
        // grid.on(`onGridUpdated`, (ev) => {
        //     initChart();
        // });



    }

    window.addEventListener('DOMContentLoaded', function () {
        initDatePicker();
        initGrid()
    });


    mapboxgl.accessToken = "pk.eyJ1Ijoia2FyaW5sZWUiLCJhIjoiY2xlY2k3MmhrMHp4aDNudDl3N3U2NzR5MyJ9.SeuDJKWvsCKsKOkZutIYLw";
    const styleUrl = 'mapbox://styles/karinlee/cldtw24nn000k01mxdqwb5tpq';

    const MAP_LNG = 127.11058607387321;
    const MAP_LAT = 37.39984828837143;
    const MAP_LNG2 = 126.65245092675946;
    const MAP_LAT2 = 37.37639102500491;

    let api = { buildings: true };
    let minZoom = 2;
    let mapConfig = {
        map: {
            center: [126.62900074241821, 37.37617554113969],
            zoom: 16,
            pitch: 60,
            bearing: 90
        }
    };

    let map = new mapboxgl.Map({
        container: 'map',
        style: styleUrl,
        zoom: mapConfig.map.zoom,
        center: mapConfig.map.center,
        pitch: mapConfig.map.pitch,
        bearing: mapConfig.map.bearing,
        antialias: true
    });



</script>