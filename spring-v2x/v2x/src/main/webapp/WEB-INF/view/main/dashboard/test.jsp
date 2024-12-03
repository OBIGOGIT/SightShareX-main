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
<%--<script src="/js/include/tailwindUtil.js"></script>--%>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://unpkg.com/three@0.126.0/examples/js/loaders/GLTFLoader.js"></script>
<script src="https://cdn.jsdelivr.net/gh/jscastro76/threebox@v.2.2.2/dist/threebox.min.js" type="text/javascript"></script>
<script src="https://unpkg.com/mqtt/dist/mqtt.min.js"></script>


<style>
    /* 범례 색상 박스 스타일 */
    .legend-color {
        display: inline-block;
        width: 15px;  /* 색상 박스 크기를 줄임 */
        height: 15px;  /* 색상 박스 크기를 줄임 */
        margin-right: 5px;  /* 텍스트와의 간격을 줄임 */
    }

    /* 범례 아이템 스타일 */
    .legend-item {
        display: flex;
        align-items: center;
        font-size: 12px;  /* 글자 크기를 줄임 */
    }

    /* 범례 전체 박스 스타일 */
    .legend-box {
        border: 1px solid #ccc; /* 테두리 추가 */
        padding: 5px 10px;  /* 패딩을 줄임 */
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.8); /* 배경 색, 약간 투명 */
        display: flex; /* 가로로 정렬 */
        gap: 10px; /* 범례 아이템 간 간격을 줄임 */
        white-space: nowrap; /* 줄바꿈을 방지 */
    }

    .select-box {
        background: #FFFFFF;
        position: absolute;
        width: 130px;
        height: 56px;
        left: 588px;
        top: 95px;
        z-index: 999;
    }

    .area-overlay-title,
    .area-overlay-contens .content-box {
        background: #FFFFFF;
        border: 1px solid #D9D9D9;
        box-shadow: 1px 4px 4px rgba(37, 37, 37, 0.25);
        box-sizing: border-box;
        border-radius: 7px;
        cursor: pointer;
    }

    .area-overlay-title {
        height: 100%;
        padding: 16px 15px 0 20px;
    }

    .area-overlay-contens {
        height: 100%;
        display: none;
        cursor: pointer;
        color: #292A2C;
    }

    .area-overlay-contens .content-box {
        padding: 25px 0 0 35px;
        border-top: 0;
    }

    .area-overlay-contens .content-box:last-child {
        border-bottom-left-radius: 7px;
        border-bottom-right-radius: 7px;
    }

    .area-overlay-contens .active,
    .area-overlay-contens .content-box:hover {
        background: #F2F2F2;
    }

    .overlay-txt {
        font-size: 24px;
        font-weight: 400;
        line-height: 28px;
    }

    .area-overlay-title .overlay-txt {
        font-size: 13px;
        font-weight: 600;
        line-height: 23px;
        float: left;
        color: #292A2C;
    }

    .area-overlay-title .arrow-icon {
        width: 16px;
        height: 16px;
        padding-top: 10px;
        background: url(/images/arrow_down.png) no-repeat center center / 16px;
        float: right;
    }

    .road-info {
        position: absolute;
        width: 390px;
        height: 56px;
        left: 1500px;
        top: 95px;
        background: #FFFFFF;
        border: 1px solid #D9D9D9;
        box-sizing: border-box;
        box-shadow: 1px 4px 4px rgba(37, 37, 37, 0.25);
        border-radius: 7px;
        padding: 15px 0 0 20px;
        z-index: 999;
    }

    .road-info .service-icon,
    .road-info .staiton-icon {
        width: 20px;
        height: 28px;
        background-size: 20px;
        float: left;
    }

    .road-info .service-icon {
        background: url(/images/marker-green.png) no-repeat center center / 20px;
    }

    .road-info .staiton-icon {
        background: url(/images/marker-red.png) no-repeat center center / 20px;
    }

    .road-info .road-txt {
        margin: 0 40px 0 11px;
        padding-top: 2px;
        font-family: "NanumBarunGothic";
        font-size: 13px;
        font-weight: 600;
        line-height: 23px;
        color: #292A2C;
        float: left;
    }

    .road-info .road-txt:last-child {
        margin-right: 0;
    }

    .road-info .road-icon {
        width: 91px;
        height: 7px;
        padding-top: 15px;
        background: url(/images/line.png) no-repeat center center / 91px;
        float: left;
    }


    .marker {
        background-size: cover;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        cursor: pointer;
    }
    .custom-popup .mapboxgl-popup-content {
        background: #000000;
        color: #333;
        padding: 10px;
        border-radius: 5px;
        font-family: Arial, sans-serif;
    }
    .custom-popup .mapboxgl-popup-close-button {
        display: none; /* Hide default close button */
    }
    .custom-popup .popup-header {
        font-size: 16px;
        font-weight: bold;
    }
    .custom-popup .popup-content img {
        width: 100%;
        height: auto;
        border-radius: 5px;
    }
    @keyframes pulse {
        0% {
            transform: scale(0.5);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0.3;
        }
    }

    .bouncing-marker {
        animation: bounce 0.5s infinite ease-in-out;
        position: relative;
    }

    /* 바운스 애니메이션: 위아래로 반복적으로 움직임 */
    @keyframes bounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-20px); /* 위로 20px 이동 */
        }
    }


</style>
<body>
<%@ include file="/WEB-INF/view/flow/include/top.jspf" %>


<main>
    <!-- 전체를 감싸는 Flex 컨테이너 -->
    <div class="flex flex-col md:flex-row">
        <!-- Sidebar Section (고정된 550px, 왼쪽에 배치) -->
        <div class="md:w-[600px] bg-white p-5 mr-5 ml-5 rounded-lg shadow md:max-w-full border border-gray-300" style="width: 600px;">
            <div class="w-full">
                <label for="select" class="block mb-2 text-lg font-medium text-gray-900">지역 선택</label>
                <select id="select" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="2">송도</option>
                </select>
            </div>
            <div class="w-full mt-5">
                <label class="block mb-2 text-lg font-medium text-gray-900">미니맵</label>
                <div id="minimap" class="w-full" style="width: 100%; height: 32vh"></div>
                <div class="w-full mt-5 flex items-center justify-between">
                    <div id="legend" class="legend-box flex">
                        <div class="legend-item">
                            <span class="legend-color" style="background-color: #50E6BB;"></span> 0-10
                        </div>
                        <div class="legend-item ml-4">
                            <span class="legend-color" style="background-color: #FBDD44;"></span> 11-20
                        </div>
                        <div class="legend-item ml-4">
                            <span class="legend-color" style="background-color: #FBA344;"></span> 21-30
                        </div>
                        <div class="legend-item ml-4">
                            <span class="legend-color" style="background-color: #FB7244;"></span> 31-40
                        </div>
                        <div class="legend-item ml-4">
                            <span class="legend-color" style="background-color: #FB5050;"></span> 41-50
                        </div>
                        <div class="legend-item ml-4">
                            <span class="legend-color" style="background-color: #5E537C;"></span> 51+
                        </div>
                    </div>
                </div>

            </div>
            <div class="w-full mt-5">
                <%--                <label class="block mb-2 text-lg font-medium text-gray-900">오브젝트 리스트</label>--%>
                <div class="flex items-center justify-between mb-2">
                    <label class="text-lg font-medium text-gray-900">오브젝트 리스트</label>
                    <button class="text-red-500 hover:text-red-700 font-medium" onclick="deleteObjects()">
                        삭제
                    </button>
                </div>
                <div id="grid" style="width: 100%"></div>
            </div>
        </div>

        <!-- Main Content Section (오른쪽에 배치) -->
        <div class="w-full md:grid-cols-6 md:flex-grow bg-white p-0 rounded-lg shadow md:max-w-full border border-gray-300 ">
            <div class="grid grid-cols-1 gap-6 mt-0">
                <div class="bg-white p-2 rounded-lg shadow">
                    <div class="content-main-map">

                        <div id="map" class="map" style="width: 100%; height: 50vh;"></div>
                        <button id= "iconToggleBtn" class="absolute top-14 right-4 focus:outline-none" style="width: 35px;">
                            <svg xmlns="http://www.w3.org/2000/svg" id="firstIcon" viewBox="0 0 24 24" fill="currentColor" class="size-6 ">
                                <path fill-rule="evenodd" d="M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0l-4.994-2.497a.375.375 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 9 6Zm6.75 3a.75.75 0 0 0-1.5 0v8.25a.75.75 0 0 0 1.5 0V9Z" clip-rule="evenodd" />
                            </svg>

                            <svg xmlns="http://www.w3.org/2000/svg" id="secondIcon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 hidden">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                            </svg>


                        </button>
                    </div>
                </div>
            </div>


            <div class="grid grid-cols-2 gap-6 mt-0 p-1">
                <div class="grid grid-cols-1 md:grid-cols-1 gap-1 p-1 mt-0 max-w-full">
                    <div class="border border-gray-300 rounded-lg p-1">
                        <h4 class="mt-0 mb-1 pl-1 font-semibold">EGO</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 p-1 mt-0 max-w-full">
                            <div class="relative">
                                <span class="absolute -top-3 left-2" style="color: #4777D7;" class="text-xs font-semibold px-2 py-1 rounded-lg">RTT</span>
                                <div class="flex items-center p-2 rounded-lg border mt-0" style="border: none; background: rgba(71, 119, 215, 0.07)">
                                    <div class="ml-3">
                                        <p id="ego-rtt" class="text-sm font-medium" style="color: #4777D7;">0</p>
                                    </div>
                                </div>
                            </div>
                            <div class="relative">
                                <span class="absolute -top-3 left-2" style="color: #F04D6B;" class="text-xs font-semibold px-2 py-1 rounded-lg">Rate</span>
                                <div class="flex items-center p-2 rounded-lg border mt-0" style="border: none; background: rgba(240, 77, 107, 0.07)">
                                    <div class="ml-3">
                                        <p id="ego-rate" class="text-sm font-medium" style="color: #F04D6B;">0</p>
                                    </div>
                                </div>
                            </div>
                            <div class="relative">
                                <span class="absolute -top-3 left-2" style="color: #D8A303;" class="text-xs font-semibold px-2 py-1 rounded-lg">Size</span>
                                <div class="flex items-center p-2 rounded-lg border mt-0" style="border: none; background: rgba(216, 163, 3, 0.07)">
                                    <div class="ml-3">
                                        <p id="ego-size" class="text-sm font-medium" style="color: #D8A303;">0</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-1 gap-1 p-1 mt-0 max-w-full">
                    <div class="border border-gray-300 rounded-lg p-1">
                        <h4 class="mt-0 mb-1 pl-1 font-semibold">Target</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 p-1 mt-0 max-w-full">
                            <div class="relative">
                                <span class="absolute -top-3 left-2" style="color:#4777D7;" class="text-xs font-semibold px-2 py-1 rounded-lg">RTT</span>
                                <div class="flex items-center p-2 rounded-lg border mt-0" style="border: none; background: rgba(71, 119, 215, 0.07)">
                                    <div class="ml-3">
                                        <p id="target-rtt" class="text-sm font-medium" style="color: #4777D7;">0</p>
                                    </div>
                                </div>
                            </div>
                            <div class="relative">
                                <span class="absolute -top-3 left-2" style="color: #F04D6B;" class="text-xs font-semibold px-2 py-1 rounded-lg">Rate</span>
                                <div class="flex items-center p-2 rounded-lg border mt-0" style="border: none; background: rgba(240, 77, 107, 0.07) ">
                                    <div class="ml-3">
                                        <p id="target-rate" class="text-sm font-medium" style="color: #F04D6B;">0</p>
                                    </div>
                                </div>
                            </div>
                            <div class="relative">
                                <span class="absolute -top-3 left-2" style="color: #D8A303;" class="text-xs font-semibold px-2 py-1 rounded-lg">Size</span>
                                <div class="flex items-center p-2 rounded-lg border mt-0" style="border: none; background: rgba(216, 163, 3, 0.07)">
                                    <div class="ml-3">
                                        <p id="target-size"class="text-sm font-medium" style="color: #D8A303;">0</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2 p-1 mt-0 max-w-full">

                <div class="grid grid-cols-1 md:grid-cols-1 gap-1 p-1 mt-0 max-w-full">
                    <div class="flex-1 bg-white p-1 rounded-lg shadow border border-gray-300">
                        <div id="myChart" style="width: 98%;"></div>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-1 gap-1 p-1 mt-0 max-w-full">
                    <div class="flex-1 bg-white p-1 rounded-lg shadow border border-gray-300">
                        <div id="myChart3" style="width: 98%;"></div>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-1 gap-1 p-1 mt-0 max-w-full">
                    <div class="flex-1 bg-white p-1 rounded-lg shadow border border-gray-300">

                        <div id="myChart4" style="width: 98%;"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

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

<script>
    const styleUrl = 'mapbox://styles/karinlee/cldtw24nn000k01mxdqwb5tpq';
    mapboxgl.accessToken = "pk.eyJ1Ijoia2FyaW5sZWUiLCJhIjoiY2xlY2k3MmhrMHp4aDNudDl3N3U2NzR5MyJ9.SeuDJKWvsCKsKOkZutIYLw";

    const MAP_LNG = 127.11058607387321;
    const MAP_LAT = 37.39984828837143;
    const MAP_LNG2 = 126.65245092675946;
    const MAP_LAT2 = 37.37639102500491;

    let grid,chartRTT,chartMbps,packetRate,packetSize,chartPacketRate,chartPacketSize;
    const eventSize = 200;
    let marker1, marker2, popup1, popup2;
    let vehicleArr = [];
    let vehicleData = {};
    let messageCount = 0;
    let currentPopup = null;
    let createdValues = [];
    let objectCilck = false;

    const locationArr = [
        { "title": "판교", "value": 1 },
        { "title": "송도", "value": 1 }
    ];

    let api = { buildings: true };

    let minZoom = 2;
    let mapConfig = {
        map: {
            center: [126.62900074241821, 37.37617554113969],
            zoom: 16,
            pitch: 60,
            bearing: 90
        },
        hlv: {
            origin: [126.62892401612476 , 37.376216982939525, 0],
            type: 'mtl',
            model: '/3d/3d-model',
            rotation: { x: 90, y: 45, z: 0 },
            scale: 0.020,
            startRotation: { x: 0, y: 0, z: 90 }
        },
        tlv: {
            origin: [126.62861647354396 , 37.37579919446526, 0],
            type: 'mtl',
            model: '/3d/3d-model',
            rotation: { x: 90, y: 47, z: 0 },
            scale: 0.020,
            startRotation: { x: 0, y: 0, z: 90 }
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

    // 미니맵 생성
    let minimap = new mapboxgl.Map({
        container: 'minimap',
        style: styleUrl,
        center: mapConfig.map.center,
        pitch: mapConfig.map.pitch,
        bearing: mapConfig.map.bearing,
        zoom: 13, // 미니맵은 더 낮은 줌 레벨로 설정
        interactive: false // 미니맵은 인터랙션 비활성화
    });

    minimap.addControl(new mapboxgl.NavigationControl());

    minimap.on('load', function () {
        minimap.resize(); // 지도가 초기화된 후 컨테이너 크기에 맞춰 리사이즈
    });


    map.on('load', () => {
        // const el = document.createElement('div');
        // el.className = 'marker';
        // el.style.backgroundImage = `url(/imagePath/image_1721808300460.jpg)`;
        // el.style.width = '80px';
        // el.style.height = '80px';
        // el.style.backgroundSize = '100%';
        //
        // const el2 = document.createElement('div');
        // el2.className = 'marker';
        // el2.style.backgroundImage = `url(/imagePath/image_1721808300871.jpg)`;
        // el2.style.width = '80px';
        // el2.style.height = '80px';
        // el2.style.backgroundSize = '100%';
        //
        // // 마커를 지도에 추가
        // marker1 = new mapboxgl.Marker(el)
        //     .setLngLat([127.1097173620335, 37.39940482318296])
        //     .addTo(map);
        // marker2 = new mapboxgl.Marker(el2)
        //     .setLngLat([127.10817430521143, 37.39982049274806])
        //     .addTo(map);
        //
        // popup1 = new mapboxgl.Popup({ closeOnClick: false, offset: 40 })
        //     .setLngLat(marker1.getLngLat())
        //     .setHTML('<div class="custom-popup"><div class="popup-header">상세화면</div><div class="popup-content"><img src="/imagePath/image_1721808300460.jpg" >');
        //
        // popup2 = new mapboxgl.Popup({ closeOnClick: false, offset: 40 })
        //     .setLngLat(marker2.getLngLat())
        //     .setHTML('<div class="custom-popup"><div class="popup-header">상세화면</div><div class="popup-content"><img src="/imagePath/image_1721808300871.jpg" >');
        //
        // marker1.getElement().addEventListener('click', function() {
        //     popup1.addTo(map);
        // });
        //
        // marker2.getElement().addEventListener('click', function() {
        //     popup2.addTo(map);
        // });

        map.addLayer(createCustomLayer('vehicle-layer'));
    });

    map.on('move', () => {
        const center = map.getCenter();
        minimap.setCenter(center); // 메인 지도의 중심에 맞춰 미니맵의 중심 설정
    });


    window.tb = new Threebox(
        map,
        map.getCanvas().getContext('webgl'),
        {
            realSunlight: true,
            enableSelectingObjects: true,
            enableDraggingObjects: true,
            enableRotatingObjects: true,
            enableTooltips: true
        }
        );

    function getGeoMove(lat, lng, degree, distanceKm) {
        const R = 6371; // 지구 반지름 (킬로미터 단위)

        // 위도와 경도를 라디안 단위로 변환
        const latRad = lat * (Math.PI / 180);
        const lngRad = lng * (Math.PI / 180);

        // 방위각을 라디안 단위로 변환
        const bearingRad = degree * (Math.PI / 180);

        // 새로운 위도 계산 (라디안 단위)
        const newLatRad = Math.asin(Math.sin(latRad) * Math.cos(distanceKm / R) +
        Math.cos(latRad) * Math.sin(distanceKm / R) * Math.cos(bearingRad));

        // 새로운 경도 계산 (라디안 단위)
        const newLngRad = lngRad + Math.atan2(Math.sin(bearingRad) * Math.sin(distanceKm / R) * Math.cos(latRad),
        Math.cos(distanceKm / R) - Math.sin(latRad) * Math.sin(newLatRad));

        // 결과를 다시 도 단위로 변환
        const newLat = newLatRad * (180 / Math.PI);
        const newLng = newLngRad * (180 / Math.PI);

        return [newLng, newLat]; // 경도, 위도의 순서로 반환
    }

    function deleteObjects() {
        const result = showConfirmModal('오브젝트를 삭제하시겠습니까?').then((result) => {
            if (result) {
                axios.get( '/all/delete').then(function(res) {
                    if ( res.data.result != 'OK' ) {
                        initGrid();
                        chartInit();
                        removeObject();
                        initObjectList();
                    }
                }).catch( function (err) {
                    Log.d('btnSignIn() -> err=', err);
                });
            } else {
            }
        });
    }

    function calculateVehiclePolygon(lat, lng, heading, distances) {
        const { front, back, left, right } = distances;

        // 전방 좌측
        const frontLeft = getGeoMove(lat, lng, heading - 90, left);
        // 전방 우측
        const frontRight = getGeoMove(lat, lng, heading + 90, right);

        // frontLeft와 frontRight에서 전방으로 이동한 좌표를 구함
        const frontLeftMoved = getGeoMove(frontLeft[1], frontLeft[0], heading, front);
        const frontRightMoved = getGeoMove(frontRight[1], frontRight[0], heading, front);

        // 차량의 중앙에서 전방으로 이동한 지점 (중앙 전방)
        const frontCenter = getGeoMove(lat, lng, heading, front * 0.75);

        // backLeft와 backRight에서 후방으로 이동한 좌표를 구함
        const backLeftMoved = getGeoMove(frontLeft[1], frontLeft[0], heading + 180, back);
        const backRightMoved = getGeoMove(frontRight[1], frontRight[0], heading + 180, back);

        // 차량의 중앙에서 후방으로 이동한 지점 (중앙 후방)
        const backCenter = getGeoMove(lat, lng, heading + 180, back * 0.75);

        // 다각형을 구성하는 6개의 좌표 배열
        const polygonPoints = [
            backLeftMoved,     // 좌측 후방
            backCenter,        // 중앙 후방
            backRightMoved,    // 우측 후방
            frontRightMoved,   // 우측 전방
            frontCenter,       // 중앙 전방
            frontLeftMoved     // 좌측 전방
        ];

        return polygonPoints;
    }

    function initSSEConnection(type) {
        const url = '/sse/'+type; // Adjust the server address and port if needed
        const eventSource = new EventSource(url);

        eventSource.onmessage = function(event) {
            const result = JSON.parse(event.data);
            if (type == 'sharInfo') {
                if (typeof result.ego != "undefined") {
                    let egoData = result.ego;
                    let position = [egoData['logitude'], egoData['latitude'], egoData['heading']];
                    updateVehicle('hlv', position);
                }
                if (typeof result.target != "undefined") {
                    let egoData = result.target;
                    let position = [egoData['logitude'], egoData['latitude'], egoData['heading']];
                    updateVehicle('tlv', position);
                    periodicallyUpdateMap('hlv');
                }
            }
            if (type == 'sharInfoPath') {
                if (typeof result.ego != "undefined") {
                    let egoData = result.ego;
                    let path = egoData['path'];
                    updateLine('ego-line', path);
                }
                if (typeof result.target != "undefined") {
                    let egoData = result.target;
                    let path = egoData['path'];
                    updateLine('target-line', path);
                }
            }
            if (type == 'communicationPerformance') {
                updateRttChart(result);
            }
            if (type == 'sharInfoImage') {
                updateMakerData(result.ego);
            }
            if (type == 'sharInfoGrid') {
                updateGridData();
            }
        }

        eventSource.onerror = function() {
            console.error('Error with ');
            eventSource.close(); // Close the connection on error
        };
    }

    function initSse() {
        initSSEConnection("sharInfo");
        initSSEConnection("sharInfoPath");
        initSSEConnection("communicationPerformance");
        initSSEConnection("sharInfoImage");
        initSSEConnection("sharInfoGrid");
    }


    function initWebsocket() {
        let time = 5000;
        if (!('WebSocket' in window)) {
            console.log('WebSocket NOT supported by your Browser!');
            return;
        }
        console.log('WebSocket is supported by your Browser!');
        const socket = new SockJS('/websocket');
        stompClient = Stomp.over(socket);
        stompClient.debug = null;

        stompClient.connect({}, function (frame) {
            stompClient.subscribe('/topic/shar_total', function (data) {
                const result = JSON.parse(data.body);
                if(typeof result.ego != "undefined") {
                    let egoData =  result.ego;
                    let position = [egoData['logitude'], egoData['latitude'], egoData['heading']];
                    updateVehicle('hlv', position);
                    periodicallyUpdateMap('hlv');
                }
                if(typeof result.target != "undefined") {
                    let egoData =  result.target;
                    let position = [egoData['logitude'], egoData['latitude'], egoData['heading']];
                    updateVehicle('tlv', position);
                }
                if(typeof result.egoPath != "undefined") {
                    let egoData =  result.egoPath;
                    let path = egoData['path'];
                    updateLine('ego-line',path);
                }
                if(typeof result.targetPath != "undefined") {
                    let egoData =  result.targetPath;
                    let path = egoData['path'];
                    updateLine('target-line',path);
                }
                if(typeof result.egoSharPerformanceData != "undefined") {
                    let egoData =  result.egoSharPerformanceData;
                    updateRttChart('ego',egoData);
                }
                if(typeof result.targetSharPerformanceData != "undefined") {
                    let egoData =  result.targetSharPerformanceData;
                    updateRttChart('target',egoData);
                }

            });
            stompClient.subscribe('/topic/ego/shar_info', function (data) {
                const result = JSON.parse(data.body);
                let position = [result['logitude'], result['latitude'], result['heading']];
                // updateVehicle('hlv', position);

                // messageCount++;
                // if (messageCount >= 10) {
                updateVehicle('hlv', position);
                periodicallyUpdateMap('hlv');
                // messageCount = 0;
                // }
            });

            stompClient.subscribe('/topic/target/shar_info', function (data) {
                const result = JSON.parse(data.body);
                let position = [result['logitude'], result['latitude'], result['heading']];
                updateVehicle('tlv', position);
            });

            stompClient.subscribe('/topic/ego/shar_info_path', function (data) {
                // 경로 업데이트
                const result = JSON.parse(data['body']);
                let path = result['path'];
                updateLine('ego-line',path);
            });

            stompClient.subscribe('/topic/target/shar_info_path', function (data) {
                // 경로 업데이트
                const result = JSON.parse(data['body']);
                let path = result['path'];
                updateLine('target-line',path);
            });

            stompClient.subscribe('/topic/ego/communication_performance', function (data) {
                const result = JSON.parse(data.body);
                updateRttChart('ego',result);
            });

            stompClient.subscribe('/topic/target/communication_performance', function (data) {
                const result = JSON.parse(data.body);
                updateRttChart('target',result);
            });

            stompClient.subscribe('/topic/image', function (data) {
                const result = JSON.parse(data.body);
                updateMakerData(result);
            });

            stompClient.subscribe('/topic/grid', function (data) {
                updateGridData();
            });

            stompClient.subscribe('/topic/delete', function (data) {
                // deleteObejct();
            });


        }, function (error) {
            console.log("Socket error: ", error);
            time++;
            if (time > 30) time = 60000;
            setTimeout(function () {
                console.log("Socket reconnect");
                initWebsocket();
            }, time);
        });
    }

    const updateVehicle = function(id, data) {
        let vehicleObj = vehicleArr[id];
        if (!vehicleObj) return;

        const arrLng = data[0];
        const arrLat = data[1];
        const heading = data[2];
        vehicleObj.setRotation(heading - 134);
        vehicleObj.setCoords([arrLng, arrLat]);
        vehicleData[id] = data;
    };

    function periodicallyUpdateMap(id) {
        if(objectCilck == true) return;
        let vehicleObj = vehicleArr[id];
        if (vehicleObj && vehicleData[id]) {
            let data = vehicleData[id];
            const heading = data[2];
            let options = {
                center: vehicleObj.coordinates,
                bearing: heading - 190,
                easing: easing
            };
            map.setZoom(19);
            map.jumpTo(options);
        }
    }

    function easing(t) {
        return t * (20 - t);
    }

    function createCustomLayer(layerName) {
        initLine()
        console.log('aaa');
        let customLayer3D = {
            id: layerName,
            type: 'custom',
            renderingMode: '3d',
            onAdd: function (map, gl) {
                load3DModel('hlv', mapConfig.hlv);
                load3DModel('tlv', mapConfig.tlv);
            },
            render: function (gl, matrix) {
                tb.update();
            }
        };
        return customLayer3D;
    }

    function load3DModel(id, config) {
        let options = {
            type: config.type,
            obj: config.model + '.obj',
            mtl: config.model + '.mtl',
            units: 'meters',
            scale: config.scale,
            rotation: config.rotation,
            anchor: 'auto'
        };

        tb.loadObj(options, function (model) {
            vehicleArr[id] = model.setCoords(config.origin);
            vehicleArr[id].setRotation(config.startRotation);
            let name = 'Ego';
            if(id == 'tlv') name = 'Target'
            vehicleArr[id].addTooltip(name, true);
            tb.add(vehicleArr[id]);
        });
    }

    const initLine = function() {
        map.addSource('ego-line', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        [126.62188458241411,37.38574175709867],
                        [126.62613987851057 ,37.383231552307564]
                    ]
                }
            }
        });

        map.addLayer({
            'id': 'ego-line',
            'type': 'line',
            'source': 'ego-line',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': 'red',
                'line-width': 8,
                'line-opacity': 0.3
            }
        });

        map.addSource('target-line', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        [126.62188458241411,37.38574175709867],
                        [126.62613987851057 ,37.383231552307564]
                    ]
                }
            }
        });

        map.addLayer({
            'id': 'target-line',
            'type': 'line',
            'source': 'target-line',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': 'blue',
                'line-width': 8,
                'line-opacity': 0.3
            }
        });
    }

    const updateLine = function(id, data) {
        if(typeof(map.getSource(id)) == "undefined") return;
        let currentData = {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': data
            }
        }
        map.getSource(id).setData(currentData);
    }


    function getRowDataById(id) {
        return grid.find(item => item.id === id);
    }

    function deleteObject(data) {
        updateGridData()
        let id = "m-"+data.id;
        let imageId = "im-"+data.id;
        if (typeof markerUpdateJson[id] != "undefined") {
            minimapMarkerJson[id].remove();
        }
        if (typeof imageMarkerJson[imageId] != "undefined") {
            imageMarkerJson[imageId].remove();
        }
    }

    function updateGridData() {
        grid.updateConfig({
            server: {
                url: '/object/list',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page: 1,
                    size: 5
                }),
                then: data => {
                    return data.data.map(item => {
                        const updatedDate = new Date(item.updated);
                        const hours = String(updatedDate.getHours()).padStart(2, '0');
                        const minutes = String(updatedDate.getMinutes()).padStart(2, '0');
                        const seconds = String(updatedDate.getSeconds()).padStart(2, '0');
                        const timeString = ''.concat(hours, ':', minutes, ':', seconds);
                        return [
                            item.id,
                            timeString,
                            (Number(item.lastLat).toFixed(3) + "," + Number(item.lastLng).toFixed(3)),
                            item.objectType + " (" + item.totalCount + ")"
                        ];
                    });
                }
            }
        }).forceRender(); // 업데이트 후 렌더링
    }

    function initGrid() {
        if(typeof grid !='undefined') {
            grid.destroy();
        }
        grid = new gridjs.Grid({
            columns: [
                {id:'id',name:'id', hidden: true},
                {id:'updated',name:'time'},
                {id:'lastLat',name:'location'},
                {id:'objectName',name:'Name'}
            ],
            server: {
                url: '/object/list',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: (prev, page) => JSON.stringify({
                    page: page, // 현재 페이지 번호
                    size: 5     // 페이지 당 항목 수 (limit과 일치시킴)
                }),
                then: data => {
                    return data.data.map(item => {
                        const updatedDate = new Date(item.updated);
                        const hours = String(updatedDate.getHours()).padStart(2, '0');
                        const minutes = String(updatedDate.getMinutes()).padStart(2, '0');
                        const seconds = String(updatedDate.getSeconds()).padStart(2, '0');
                        const timeString = ''.concat(hours, ':', minutes, ':', seconds);
                        return [
                            item.id,
                            timeString,
                            (Number(item.lastLat).toFixed(3)+","+
                                Number(item.lastLng).toFixed(3)),
                            item.objectType+" ("+item.totalCount+")"
                        ];
                    });
                }
            },
            pagination: {
                enabled: true,
                limit: 5,
                summary: false
            },
            // sort: true,
            className: {
                table: 'w-full text-sm text-left text-gray-500',
                th: 'px-0 py-0 text-xs font-semibold text-gray-700  bg-gray-50 border-b border-gray-200',
                td: 'px-0 py-0  border-b border-gray-200 cursor-pointer',
                paginationButton: 'text-xs py-0 px-1 mx-1 bg-gray-200 hover:bg-gray-300',
                paginationSummary: 'text-xs' // 페이지 요약 부분을 작은 글씨로
            },
            style: {
                th: {
                    paddingTop: '1', // 세로 패딩 0
                    paddingBottom: '0'
                },
                td: {
                    paddingTop: '0.5', // 세로 패딩 0
                    paddingBottom: '0'
                }
            }
        }).render(document.getElementById('grid'))
            .on('rowClick', (e, row) => {
                let id = "m-"+row.cells[0].data;
                let imageId = "im-"+row.cells[0].data;
                imageMarkerJson[imageId].getElement().click();
                makerEvent(id);

            });
    }

    const chartInit = function() {
        axios.post( '/obu/data').then(function(res) {
            if ( res.data.result != 'OK' ) {
                renderRttLineChart(res.data.data)
                return;
            }
        }).catch( function (err) {
            Log.d('btnSignIn() -> err=', err);
        });

    }

    function fillNullsWithPrevious(data) {
        return data.map((value, index, array) => {
            return value !== null ? value : (index > 0 ? array[index - 1] : 0);
        });
    }


    function renderRttLineChart(data) {
        if(typeof data['ego'] == "undefined") {
            data['ego'] = []
        }
        if(typeof data['target'] == "undefined") {
            data['target'] = []
        }
        const dateTimes = new Set();
        data.ego.forEach(item => dateTimes.add(item.created));
        data.target.forEach(item => dateTimes.add(item.created));

        // 정렬된 날짜+시간 배열 생성
        const sortedDateTimes = Array.from(dateTimes).sort();
        // Step 2: 시각별로 모든 ego와 target 데이터를 수집하고, 없는 값은 null로 처리
        const list = sortedDateTimes.map(dateTime => {
            const egoDataAtTime = data.ego.find(item => item.created === dateTime) || null;
            const targetDataAtTime = data.target.find(item => item.created === dateTime) || null;

            return {
                dateTime,
                ego: egoDataAtTime ? {
                    rtt: egoDataAtTime.rtt,
                    packetRate: egoDataAtTime.packetRate,
                    packetSize: egoDataAtTime.packetSize
                } : { rtt: 0,  packetRate: 0, packetSize: 0 },
                target: targetDataAtTime ? {
                    rtt: targetDataAtTime.rtt,
                    packetRate: targetDataAtTime.packetRate,
                    packetSize: targetDataAtTime.packetSize
                } : { rtt: 0,  packetRate: 0, packetSize: 0 }
            };
        });

        // Step 3: 각 항목별 데이터 배열 설정
        createdValues = list.map(item => item.dateTime);
        const egoRttData = list.map(item => item.ego.rtt);
        const targetRttData = list.map(item => item.target.rtt);

        const egoPacketRateData = list.map(item => item.ego.packetRate);
        const targetPacketRateData = list.map(item => item.target.packetRate);

        const egoPacketSizeData = list.map(item => item.ego.packetSize);
        const targetPacketSizeData = list.map(item => item.target.packetSize);

        const egoLastIndex = data.ego.length - 1;
        const targetLastIndex = data.target.length - 1;
        if (egoLastIndex >= 0) {
            getID('ego-rtt').textContent = data.ego[egoLastIndex].rtt;
            // getID('ego-mbps').textContent = data.ego[egoLastIndex].mbps;
            getID('ego-rate').textContent = data.ego[egoLastIndex].packetRate;
            getID('ego-size').textContent = data.ego[egoLastIndex].packetSize;
        }
        if (targetLastIndex >= 0) {
            getID('target-rtt').textContent = data.target[targetLastIndex].rtt;
            // getID('target-mbps').textContent = data.target[targetLastIndex].mbps;
            getID('target-rate').textContent = data.target[targetLastIndex].packetRate;
            getID('target-size').textContent = data.target[targetLastIndex].packetSize;
        }

        let baseOptions = {
            chart: {
                type: 'line',
                height: 230,
                toolbar: { show: false },
                animations: {
                    enabled: true,
                    easing: 'linear',
                    dynamicAnimation: { speed: 100 }
                }
            },
            xaxis: {
                type: 'datetime',
                categories: createdValues,
                tickAmount: 5,
                labels: {
                    datetimeUTC: false,
                    formatter: function(value, timestamp) {
                        let date = new Date(timestamp);
                        return date.toLocaleTimeString('en-US', { hour12: false });
                    },
                    style: { fontSize: '10px' }
                }
            },
            yaxis: { labels: { show: true } },
            stroke: {
                width: 1,
                curve: 'straight',
                lineCap: 'butt',
                connectNulls: true  // Null 값 사이에 선 연결하지 않음
            }
        };

// 차트 색상 배열 설정
        let colors = ['#4777D7', '#3BBD6F', '#F04D6B', '#D8A303'];
        let colors2 = ['#B88828', '#C44290', '#0FB294', '#275CFC'];

        let rttOptions = Object.assign({}, baseOptions, {
            series: [
                { name: 'Ego RTT', data: egoRttData },
                { name: 'Target RTT', data: targetRttData }
            ],
            colors: [colors[0], colors2[0]],
            title: {
                text: 'RTT Chart',
                align: 'center',
                style: { fontSize: '16px', fontWeight: 'bold', color: colors[0] }
            }
        });

        let packetRateOptions = Object.assign({}, baseOptions, {
            series: [
                { name: 'Ego Packet Rate', data: egoPacketRateData },
                { name: 'Target Packet Rate', data: targetPacketRateData }
            ],
            colors: [colors[2], colors2[2]],
            title: {
                text: 'Packet Rate Chart',
                align: 'center',
                style: { fontSize: '16px', fontWeight: 'bold', color: colors[2] }
            }
        });

        let packetSizeOptions = Object.assign({}, baseOptions, {
            series: [
                { name: 'Ego Packet Size', data: egoPacketSizeData },
                { name: 'Target Packet Size', data: targetPacketSizeData }
            ],
            colors: [colors[3], colors2[3]],
            title: {
                text: 'Packet Size Chart',
                align: 'center',
                style: { fontSize: '16px', fontWeight: 'bold', color: colors[3] }
            }
        });

        // chartRTT = new ApexCharts(document.querySelector("#myChart"), rttOptions);
        // packetRate = new ApexCharts(document.querySelector("#myChart3"), packetRateOptions);
        // packetSize = new ApexCharts(document.querySelector("#myChart4"), packetSizeOptions);
        //
        // chartRTT.render();
        // packetRate.render();
        // packetSize.render();

        if (typeof chartRTT != "undefined") {
            chartRTT.destroy();
        }
        chartRTT = new ApexCharts(document.querySelector("#myChart"), rttOptions);
        chartRTT.render();

        if (typeof packetRate != "undefined") {
            packetRate.destroy();
        }
        packetRate = new ApexCharts(document.querySelector("#myChart3"), packetRateOptions);
        packetRate.render();

        if (typeof packetSize != "undefined") {
            packetSize.destroy();
        }
        packetSize = new ApexCharts(document.querySelector("#myChart4"), packetSizeOptions);
        packetSize.render();

    }


    function updateRttChart(data) {
        let existingRttData = chartRTT.w.config.series[0].data;
        let existingRateData = packetRate.w.config.series[0].data;
        let existingSizeData = packetSize.w.config.series[0].data;

        let existingTargetRttData = chartRTT.w.config.series[1].data;
        let existingTargetRateData = packetRate.w.config.series[1].data;
        let existingTargetSizeData = packetSize.w.config.series[1].data;

        if(data.ego != 'undefined') {

            if (existingRttData.length > 50) {
                existingRttData.shift();
                existingRateData.shift();
                existingSizeData.shift();
            }
            let newRttValue = data.ego.nrtt;
            let newSizeValue = data.ego.packet_size;
            let newRateValue = data.ego.packet_rate;
            getID('ego-rtt').textContent = newRttValue;
            getID('ego-rate').textContent = newSizeValue;
            getID('ego-size').textContent = newRateValue;
            existingRttData.push(newRttValue);
            existingRateData.push(newSizeValue);
            existingSizeData.push(newRateValue);
            createdValues.shift();
            createdValues.push(data.ego.created)
        }
        else {
            if (existingRttData.length > 50) {
                existingRttData.shift();
                existingRateData.shift();
                existingSizeData.shift();
            }
            let newRttValue = 0;
            let newSizeValue = 0;
            let newRateValue = 0;
            getID('ego-rtt').textContent = newRttValue;
            getID('ego-rate').textContent = newSizeValue;
            getID('ego-size').textContent = newRateValue;
            existingRttData.push(newRttValue);
            existingRateData.push(newSizeValue);
            existingSizeData.push(newRateValue);
            createdValues.shift();
            createdValues.push(data.ego.created)
        }
        if(data.target != 'undefined') {
            if (existingTargetRttData.length > 50) {
                existingTargetRttData.shift();
                existingTargetRateData.shift();
                existingTargetSizeData.shift();
            }

            let newRttValue = data.target.nrtt;
            let newSizeValue = data.target.packet_size;
            let newRateValue = data.target.packet_rate;
            getID('target-rtt').textContent =newRttValue;
            getID('target-rate').textContent = newSizeValue;
            getID('target-size').textContent = newRateValue;
            existingTargetRttData.push(newRttValue);
            existingTargetRateData.push(newSizeValue);
            existingTargetSizeData.push(newRateValue);
            createdValues.shift();
            createdValues.push(data.target.created)
        }
        else {
            if (existingTargetRttData.length > 50) {
                existingTargetRttData.shift();
                existingTargetRateData.shift();
                existingTargetSizeData.shift();
            }

            let newRttValue = 0;
            let newSizeValue = 0;
            let newRateValue = 0;
            getID('target-rtt').textContent =newRttValue;
            getID('target-rate').textContent = newSizeValue;
            getID('target-size').textContent = newRateValue;
            existingTargetRttData.push(newRttValue);
            existingTargetRateData.push(newSizeValue);
            existingTargetSizeData.push(newRateValue);
            createdValues.shift();
            createdValues.push(data.target.created)
        }

        chartRTT.updateSeries([
            { name: 'Ego RTT', data: existingRttData },
            { name: 'Target RTT', data: existingTargetRttData }
        ]);
        packetRate.updateSeries([
            { name: 'Ego Packet Rate', data: existingRateData },
            { name: 'Target Packet Rate', data: existingTargetRateData }
        ]);
        packetSize.updateSeries([
            { name: 'Ego Packet Size', data: existingSizeData },
            { name: 'Target Packet Size', data: existingTargetSizeData }
        ]);
        chartRTT.updateOptions({
            xaxis: {
                type: 'datetime',  // X축을 datetime으로 설정
                categories: createdValues,  // X축에 Unix timestamp 사용
                tickAmount: 5,  // X축에 표시될 라벨 개수를 제한
                labels: {
                    datetimeUTC: false,  // 로컬 시간대를 사용
                    formatter: function(value, timestamp) {
                        let date = new Date(timestamp);
                        let hours = date.getHours().toString().padStart(2, '0');
                        let minutes = date.getMinutes().toString().padStart(2, '0');
                        let seconds = date.getSeconds().toString().padStart(2, '0');
                        let timePart = hours.concat(':', minutes, ':', seconds);
                        return timePart;  // 시:분:초 표시
                    },
                    style: {
                        fontSize: '10px', // 폰트 크기 조절 (필요에 따라)
                    }
                },
                title: {
                    text: undefined  // X축 타이틀 제거
                }
            }
        });

        packetRate.updateOptions({
            xaxis: {
                type: 'datetime',  // X축을 datetime으로 설정
                categories: createdValues,  // X축에 Unix timestamp 사용
                tickAmount: 5,  // X축에 표시될 라벨 개수를 제한
                labels: {
                    datetimeUTC: false,  // 로컬 시간대를 사용
                    formatter: function(value, timestamp) {
                        let date = new Date(timestamp);
                        let hours = date.getHours().toString().padStart(2, '0');
                        let minutes = date.getMinutes().toString().padStart(2, '0');
                        let seconds = date.getSeconds().toString().padStart(2, '0');
                        let timePart = hours.concat(':', minutes, ':', seconds);
                        return timePart;  // 시:분:초 표시
                    },
                    style: {
                        fontSize: '10px', // 폰트 크기 조절 (필요에 따라)
                    }
                },
                title: {
                    text: undefined  // X축 타이틀 제거
                }
            }
        });
        packetSize.updateOptions({
            xaxis: {
                type: 'datetime',  // X축을 datetime으로 설정
                categories: createdValues,  // X축에 Unix timestamp 사용
                tickAmount: 5,  // X축에 표시될 라벨 개수를 제한
                labels: {
                    datetimeUTC: false,  // 로컬 시간대를 사용
                    formatter: function(value, timestamp) {
                        let date = new Date(timestamp);
                        let hours = date.getHours().toString().padStart(2, '0');
                        let minutes = date.getMinutes().toString().padStart(2, '0');
                        let seconds = date.getSeconds().toString().padStart(2, '0');
                        let timePart = hours.concat(':', minutes, ':', seconds);
                        return timePart;  // 시:분:초 표시
                    },
                    style: {
                        fontSize: '10px', // 폰트 크기 조절 (필요에 따라)
                    }
                },
                title: {
                    text: undefined  // X축 타이틀 제거
                }
            }
        });
    }

    const objectMaker = function(data) {
        for(let idx in data) {
            addMarker(data[idx]);
            addImageMaker(data[idx]);
        }
    }

    function getMarkerColor(totalCount) {
        if (totalCount <= 10) {
            return '#50E6BB';
        } else if (totalCount <= 20) {
            return '#FBDD44';
        } else if (totalCount <= 30) {
            return '#FBA344';
        } else if (totalCount <= 40) {
            return '#FB7244';
        } else if (totalCount <= 50) {
            return '#FB5050';
        } else {
            return '#5E537C';
        }
    }

    const iconToggleBtn = document.getElementById('iconToggleBtn');
    const firstIcon = document.getElementById('firstIcon');
    const secondIcon = document.getElementById('secondIcon');

    // 버튼 클릭 이벤트 추가
    iconToggleBtn.addEventListener('click', () => {
        // 첫 번째 아이콘이 표시 중일 경우
        if (!firstIcon.classList.contains('hidden')) {
            firstIcon.classList.add('hidden');
            secondIcon.classList.remove('hidden');
            objectCilck = true;
        } else {
            // 두 번째 아이콘이 표시 중일 경우
            secondIcon.classList.add('hidden');
            firstIcon.classList.remove('hidden');
            objectCilck = false;
        }
    });

    let imageMarkerJson = {}
    let minimapMarkerJson = {}
    let imageMarkerPopupJson = {}
    let markerUpdateJson ={}

    function addImageMaker(objectSummary) {
        let id = "im-"+objectSummary.id;
        if (typeof imageMarkerJson[id] != "undefined") {
            return;
            // minimapMarkerJson[id].remove();  // 기존 마커 및 팝업 제거
            // imageMarkerPopupJson[id].remove();  // 기존 마커 및 팝업 제거
        }
        let imagePath = objectSummary.latestObjectEntity.objectImageEntity.imagePath;

        let minimapId = "m-"+objectSummary.id;
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url('+imagePath+')';
        el.style.width = '80px';
        el.style.height = '80px';
        el.style.backgroundSize = '100%';



        imageMarkerJson[id] = new mapboxgl.Marker(el)
            .setLngLat([objectSummary.lastLng, objectSummary.lastLat])
            .addTo(map);

        imageMarkerPopupJson[id] = new mapboxgl.Popup({ closeOnClick: false, offset: 40 })
            .setLngLat( imageMarkerJson[id].getLngLat())
            .setHTML('<div class="custom-popup"><div class="popup-header">상세화면</div><div class="popup-content"><img src="'+imagePath+'" >');

        imageMarkerPopupJson[id].on('close', function () {
            currentPopup = null; // 팝업이 닫히면 currentPopup을 초기화
            removePulsingDot();
            objectCilck = false;
            map.setZoom(18);
        });
        // imageMarkerPopupJson[id].on('open', function() {
        //     const closeButton = document.querySelector('.mapboxgl-popup-close-button');
        //     if (closeButton) {
        //         closeButton.removeAttribute('aria-hidden'); // aria-hidden 속성 제거
        //     }
        // });


        imageMarkerJson[id].getElement().addEventListener('click', function() {
            if (currentPopup) {
                currentPopup.remove();
            }
            imageMarkerPopupJson[id].addTo(map);
            currentPopup = imageMarkerPopupJson[id];
            makerEvent(minimapId);
        });
    }

    function removePulsingDot() {
        if (minimap.getLayer('layer-with-pulsing-dot')) {
            minimap.removeLayer('layer-with-pulsing-dot');
        }
        if (minimap.getSource('dot-point')) {
            minimap.removeSource('dot-point');
        }
        if (minimap.hasImage('pulsing-dot')) {
            minimap.removeImage('pulsing-dot');
        }
    }

    function addMarker(objectSummary) {
        let id = "m-"+objectSummary.id;
        if (typeof  minimapMarkerJson[id] != "undefined") {
            return;
        }
        const color = getMarkerColor(objectSummary.totalCount);

        // 팝업 내용 문자열 연결
        var popupContent = '';
        popupContent = popupContent.concat('<h3>', objectSummary.objectType, '</h3>');
        popupContent = popupContent.concat('<p>Total Count: ', objectSummary.totalCount, '</p>');
        // 원형 마커 스타일
        minimapMarkerJson[id] = new mapboxgl.Marker({
            color: color
        })
            .setLngLat([objectSummary.lastLng, objectSummary.lastLat])  // 경도, 위도 설정
            .setPopup(new mapboxgl.Popup().setHTML(popupContent))  // 팝업 추가
            .addTo(minimap);

        markerUpdateJson[id] = {
            'id' : id,
            'count' : objectSummary.totalCount,
            'path' : objectSummary.latestObjectEntity.objectImageEntity.imagePath,
            'color' : color
        }
    }

    const updateMakerData = function(data) {
        updateMarker(data)
        updateImageMarker(data)
    }


    const updateMarker = function(data) {
        let color = getMarkerColor(data.count);
        let id = "m-"+data.id;
        if (typeof markerUpdateJson[id] != "undefined") {
            if(markerUpdateJson[id]['count'] == data.count) return;
            if(markerUpdateJson[id]['color'] == color) return;
            minimapMarkerJson[id].remove();
        }
        let popupContent = '';
        popupContent = popupContent.concat('<h3>', data.objectType, '</h3>');
        popupContent = popupContent.concat('<p>Total Count: ', data.count, '</p>');
        minimapMarkerJson[id] = new mapboxgl.Marker({
            color: color
        })
            .setLngLat([data.lastLng, data.lastLat])  // 경도, 위도 설정
            .setPopup(new mapboxgl.Popup().setHTML(popupContent))  // 팝업 추가
            .addTo(minimap);
        markerUpdateJson[id] = {
            'id' : id,
            'count' : data.count,
            'path' : data.imagePath,
            'color' : color
        }
    }


    const updateImageMarker = function(data) {
        let id = "im-"+data.id;
        if (typeof markerUpdateJson[id] != "undefined") {
            if(markerUpdateJson[id]['path'] == data.imagePath) return;
            imageMarkerJson[id].remove();
        }

        let imagePath = data.imagePath;

        let minimapId = "m-"+data.id;
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url('+imagePath+')';
        el.style.width = '80px';
        el.style.height = '80px';
        el.style.backgroundSize = '100%';


        imageMarkerJson[id] = new mapboxgl.Marker(el)
            .setLngLat([data.lastLng, data.lastLat])
            .addTo(map);

        imageMarkerPopupJson[id] = new mapboxgl.Popup({ closeOnClick: false, offset: 40 })
            .setLngLat( imageMarkerJson[id].getLngLat())
            .setHTML('<div class="custom-popup"><div class="popup-header">상세화면</div><div class="popup-content"><img src="'+imagePath+'" >');

        imageMarkerPopupJson[id].on('close', function () {
            currentPopup = null; // 팝업이 닫히면 currentPopup을 초기화
            removePulsingDot();
            objectCilck = false;
            map.setZoom(16);
        });

        imageMarkerJson[id].getElement().addEventListener('click', function() {
            if (currentPopup) {
                currentPopup.remove();
            }
            imageMarkerPopupJson[id].addTo(map);
            currentPopup = imageMarkerPopupJson[id];
            makerEvent(minimapId);
        });

    }



    // pulsingDot 생성 함수
    const pulsingDot = {

        width: eventSize,
        height: eventSize,
        data: new Uint8Array(eventSize * eventSize * 4),

        onAdd: function () {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d');
        },

        render: function () {
            const duration = 1000; // 애니메이션의 총 지속 시간 (1초)
            const t = (performance.now() % duration) / duration; // 0에서 1 사이의 비율

            const radius = (eventSize / 2) * 0.3; // 기본 반지름
            const outerRadius = (eventSize / 2) * 0.7 * t + radius; // 외곽 반지름 (점점 커짐)
            const context = this.context;

            // 외곽 원 그리기
            context.clearRect(0, 0, this.width, this.height); // 캔버스 지우기
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2); // 외곽 원
            context.fillStyle = `rgba(255, 200, 200, ${1 - t})`; // 투명도 조절
            context.fill();

            // 내부 원 그리기
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2); // 내부 원
            context.fillStyle = 'rgba(255, 100, 100, 1)'; // 내부 색상
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t); // 선 두께 변경
            context.fill();
            context.stroke();

            this.data = context.getImageData(0, 0, this.width, this.height).data;

            minimap.triggerRepaint();

            return true;
        }
    };
    const makerEvent = function(id) {
        if(typeof minimapMarkerJson[id] == "undefined") return;
        objectCilck = true;
        const markerPosition = minimapMarkerJson[id].getLngLat();

        if (!minimap.hasImage('pulsing-dot')) {
            minimap.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
        }
        if (!minimap.getSource('dot-point')) {
            minimap.addSource('dot-point', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [markerPosition.lng, markerPosition.lat] // pulsingDot 위치 (경도, 위도)
                            }
                        }
                    ]
                }
            });
            // pulsingDot을 나타내는 레이어를 추가
            minimap.addLayer({
                'id': 'layer-with-pulsing-dot',
                'type': 'symbol',
                'source': 'dot-point',
                'layout': {
                    'icon-image': 'pulsing-dot',
                    'icon-size': 1
                }
            });
        } else {
            const source = minimap.getSource('dot-point');
            source.setData({
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [markerPosition.lng, markerPosition.lat] // pulsingDot 위치 업데이트
                        }
                    }
                ]
            });
        }
        map.setCenter([markerPosition.lng, markerPosition.lat]);
        minimap.setCenter([markerPosition.lng, markerPosition.lat]);
    }


    const removeObject = function() {
        for (const id in imageMarkerJson) {
            if (typeof imageMarkerJson[id] != 'undefined') {
                imageMarkerJson[id].remove();
            }
        }
        for (const id in minimapMarkerJson) {
            if (typeof minimapMarkerJson[id] != 'undefined') {
                minimapMarkerJson[id].remove();
            }
        }
        markerUpdateJson ={};
    }

    const initObjectList = function() {

        axios.post( '/object/total').then(function(res) {
            if ( res.data.result != 'OK' ) {
                objectMaker(res.data.data);

                return;
            }
        });

    }



    window.addEventListener('DOMContentLoaded', function () {
        initModal('confirmModal')
        initGrid();
        chartInit();
        initObjectList();
        // initWebsocket();
        initSse();
    });


</script>