<%@ page language="java" contentType="text/html; charset=UTF-8;" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>OBIGO Map</title>
    <!-- favicon -->
    <link href="/images/obigo_Favicon.png" rel="shortcut icon" type="image/x-icon" />
    <!-- Mapbox -->
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no">
    <%--	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />--%>
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.12.0/mapbox-gl.css" rel="stylesheet">
    <script src="https://api.mapbox.com/mapbox-gl-js/v2.12.0/mapbox-gl.js"></script>
    <script src="/js/apexcharts.js" defer></script>
    <script src="/js/roslib.min.js" defer></script>
    <script src="/js/ros.js" defer></script>
    <script src="https://unpkg.com/@turf/turf@6/turf.min.js" ></script> <%-- Turf : to smoothly animate a point along the distance of a line --%>
    <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=6ede651e5785dc0151f510d6f91aa7ea&libraries=services"></script>
    <script src="/js/include/customDash.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://unpkg.com/three@0.126.0/examples/js/loaders/GLTFLoader.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/jscastro76/threebox@v.2.2.2/dist/threebox.min.js" type="text/javascript"></script>
    <style>
        html, body {
            margin: 0;
            height: 100%;
            overflow: hidden;
        }
        body { margin: 0; padding: 0;}
        #map { width: 80%; height: 100%; float: left}
        .carInfo { width: 20%; height: 100%; float: left}
        .infoControl {
            width: 100%;
            height: 10%;
            text-align: center;
            border: 1px solid #000000;
        }
        .infoBody {
            width: 100%;
            height: 90%;
            border: 1px solid #000000;
        }
        .detailInfo {
            width: 100%;
            height: 50%;
            border: 1px solid #000000;
            float: left;
        }
        .detailLabel {
            width: 20%;
            float: left;
        }
        .detailP {
            width: 80%;
            float: left;
        }
        .logDetail {
            width: 100%;
            height: 204px;
        }



        .find-effect {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-color: #000000;
            text-align: center;
            margin: -35px;
            opacity: 0.2;
        }


        .pulse-effect {
            width: 100px;
            height: 100px;
            margin-top: -35px;
            margin-left: -35px;
            border-radius: 50%;
            background-color: #ff7b7b;
            animation: pulse 1s infinite;
        }
        iframe{
            /*object-fit:contain;*/
            margin:0 0 0 0px;
            border: 0;
            padding: 0;
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
    </style>
</head>
<%@ include file="/WEB-INF/view/include/head.jspf"%>
<c:choose>
<c:when test="${fn:containsIgnoreCase(ua, 'Trident')}">
<body class="preload hold-transition skin-blue sidebar-mini">
</c:when>
<c:otherwise>
<body class="hold-transition skin-blue sidebar-mini">
</c:otherwise>
</c:choose>
<%--<spring:eval expression="@environment.getProperty('obigo.cloud.admin')" var="adminurl" />--%>
<div class="wrapper">
    <!-- nav, sidebar -->
    <%@ include file="/WEB-INF/view/include/top.jspf"%>

    <%--	<%@ include file="/WEB-INF/view/include/left.jspf"%>--%>
    <div class="content-wrapper" id="content-wrapper">
        <%@ include file="/WEB-INF/view/include/navi.jspf"%>
        <div class="content-main body">
            <div class="content-main-info">
                <%--				<div class="weather-info">--%>
                <%--					<div class="time-info">--%>
                <%--						<span class="weather-date" id="currentDate"></span>--%>
                <%--						<span class="weather-time" id="currentTime"></span>--%>
                <%--					</div>--%>
                <%--					<div class="city-info">--%>
                <%--						<span id="cityName">성남시 분당구 삼평동</span>--%>
                <%--					</div>--%>
                <%--					<div class="weather-data">--%>
                <%--                        <div id="weatherIcon" class="weather-icon"></div>--%>
                <%--                        <span class="weather-templet">현재 온도&nbsp;</span>--%>
                <%--                        <span id="rowTemp" class="temp-info"> 5˚</span
                <%--					</div>--%>

                <%--				</div>--%>
                <div class="bus-info">
                    <div class="bus-data">
                        <%--                        <div class="bus-title"  onclick="openManagement('managementPopup')">--%>
                        <%--&lt;%&ndash;                            <div class="bus-icon"></div>&ndash;%&gt;--%>
                        <%--&lt;%&ndash;                            <span class="title-txt">차량정보</span>&ndash;%&gt;--%>
                        <%--&lt;%&ndash;                            <div class="arrow-icon"></div>&ndash;%&gt;--%>
                        <%--                        </div>--%>
                        <div class="bus-contents">
                            <div style="width: 100%; height: 100px">
                                <iframe id="ifr" src="https://grafana.obigo.com/d/8WUmas8Ik/v2x-dashboard?orgId=1&from=now-24h&to=now&&theme=light&viewPanel=2&kiosk" width="100%" height="100px" frameborder="0"></iframe>
                            </div>
                            <div style="width: 100%; height: 120px">
                                <iframe id="ifr4" src="https://grafana.obigo.com/d/8WUmas8Ik/v2x-dashboard?orgId=1&from=now-24h&to=now&theme=light&viewPanel=22&viewPanel=4&kiosk" width="100%" height="120px" frameborder="0"></iframe>
                            </div>
                            <div style="width: 100%">
                                <iframe id="ifr2" src="https://grafana.obigo.com/d/8WUmas8Ik/v2x-dashboard?orgId=1&from=now-24h&to=now&&theme=light&viewPanel=4&kiosk" width="100%" height="355px" frameborder="0"></iframe>
                            </div>
                            <div style="width: 100%">
                                <iframe id="ifr5" src="https://grafana.obigo.com/d/8WUmas8Ik/v2x-dashboard?orgId=1&from=now-24h&to=now&theme=light&viewPanel=24&kiosk" width="100%" height="280px" frameborder="0"></iframe>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="content-main-map">
                <div id="map" class="map" style="width: 100%"></div>
                <div id="areaSelect" class="select-box"></div>
                <div class="road-info">
                    <div class="service-icon"></div>
                    <span class="road-txt">차량</span>

                    <div class="staiton-icon"></div>
                    <span class="road-txt">낙하물</span>

                    <div class="road-icon"></div>
                    <span class="road-txt">주행경로</span>
                </div>
            </div>
            <div class="content-main-footer">

                <div id= "waringList" class="waring-contents">
                    <iframe id="ifr3" src="https://grafana.obigo.com/d/8WUmas8Ik/v2x-dashboard?orgId=1&from=now-24h&to=now&theme=light&viewPanel=6&kiosk" width="100%" height="307px" frameborder="0"></iframe>
                </div>
            </div>
        </div>
    </div>
</div>
</body>

<script>


    mapboxgl.accessToken = "pk.eyJ1Ijoia2FyaW5sZWUiLCJhIjoiY2xlY2k3MmhrMHp4aDNudDl3N3U2NzR5MyJ9.SeuDJKWvsCKsKOkZutIYLw";
    const styleUrl = 'mapbox://styles/karinlee/cldtw24nn000k01mxdqwb5tpq';

    const MAP_LNG = 127.11058607387321;
    const MAP_LAT = 37.39984828837143;
    const MAP_LNG2 = 126.65245092675946;
    const MAP_LAT2 = 37.37639102500491;

    const locationArr = [
        {
            "title": "판교",
            "value": 1,

        },
        {
            "title": "송도",
            "value": 1,

        }
    ];

    let api = {
        buildings: true
    };

    let minZoom = 2;
    let mapConfig = {
        map: {
            center: [126.62900074241821 , 37.37617554113969],
            zoom: 16,
            pitch: 60,
            bearing: 90
        },
        hlv: {
            origin: [126.62888306572057 , 37.37615858188063, 0],
            type: 'mtl',
            model: '/3d/3d-model',
            rotation: {
                x: 90,
                y: 0,
                z: 0
            },
            scale: 0.05,
            startRotation: {
                x: 0,
                y: 0,
                z: 90
            },
        },
        tlv: {
            // origin: [MAP_LNG, MAP_LAT, 0],
            origin: [126.62875915360667 , 37.37597453530827, 0],
            type: 'mtl',
            model: '/3d/3d-model',
            rotation: {
                x: 90,
                y: 0,
                z: 0
            },
            scale: 0.05,
            startRotation: {
                x: 0,
                y: 0,
                z: 90
            },
        },
        names: {
            compositeSource: "composite",
            compositeSourceLayer: "building",
            compositeLayer: "3d-buildings"
        }
    }

    let map = new mapboxgl.Map({
        container: 'map',
        style: styleUrl,
        zoom: mapConfig.map.zoom,
        center: mapConfig.map.center,
        pitch: mapConfig.map.pitch,
        bearing: mapConfig.map.bearing,
        antialias: true // create the gl context with MSAA antialiasing, so custom layers are antialiased
    });
    map.on('load', () => {
        // HTML 요소로 마커 생성
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(/imagePath/image_1721808300460.jpg)`;
        el.style.width = '80px';
        el.style.height = '80px';
        el.style.backgroundSize = '100%';

        const el2 = document.createElement('div');
        el2.className = 'marker';
        el2.style.backgroundImage = `url(/imagePath/image_1721808300871.jpg)`;
        el2.style.width = '80px';
        el2.style.height = '80px';
        el2.style.backgroundSize = '100%';

        // 마커를 지도에 추가
        marker1 = new mapboxgl.Marker(el)
            .setLngLat([127.1097173620335, 37.39940482318296]) // 마커 위치 (예: 서울)
            .addTo(map);
        marker2 = new mapboxgl.Marker(el2)
            .setLngLat([127.10817430521143,37.39982049274806]) // 마커 위치 (예: 서울)
            .addTo(map);

        popup1 = new mapboxgl.Popup({ closeOnClick: false,offset: 40 })
            .setLngLat(marker1.getLngLat())
            .setHTML('<div class="custom-popup"><div class="popup-header">상세화면</div><div class="popup-content"><img src="/imagePath/image_1721808300460.jpg" >');

        popup2 = new mapboxgl.Popup({ closeOnClick: false,offset: 40 })
            .setLngLat(marker2.getLngLat())
            .setHTML('<div class="custom-popup"><div class="popup-header">상세화면</div><div class="popup-content"><img src="/imagePath/image_1721808300871.jpg" >');

        marker1.getElement().addEventListener('click', function() {
            popup1.addTo(map);
        });
        marker2.getElement().addEventListener('click', function() {
            popup2.addTo(map);
        });

        map.addLayer(createCustomLayer('vehicle-layer'), 'waterway-label');



    });

    window.tb = new Threebox(
        map,
        map.getCanvas().getContext('webgl'), {
            realSunlight: true,
            enableSelectingObjects: true,
            enableDraggingObjects: true,
            enableRotatingObjects: true,
            enableTooltips: true
        }
    );

    let marker1, maker2, popup1, popup2;

    let stompClient = null;

    let vehicle,vehicle2;

    let vehicleArr = [];

    let vehicleData = {};


    let modeId = 'hlvMode';

    let messageCount = 0;

    window.addEventListener('DOMContentLoaded', function() {
        dateTimer();
        obigoCustomSelect.create('areaSelect', locationArr);
        initWebsocket()

        //
    });


    function initWebsocket() {
        let time = 5000;
        if ( !'WebSocket' in window ) {
            Log.d( 'WebSocket NOT supported by your Browser!' );
            return;
        }
        Log.d('WebSocket is supported by your Browser!');
        const socket = new SockJS('/websocket');
        stompClient = Stomp.over(socket);
        stompClient.debug = null
        stompClient.connect({}, function (frame) {
                stompClient.subscribe('/topic/shar_info', function (data) {
                    const result = JSON.parse(data['body']);
                    console.log('rr', result)
                    let position = [];
                    position[0] = result['logitude'];
                    position[1] = result['latitude'];
                    position[2] = result['heading'];
                    updateVehicle('hlv' , position);
                    messageCount++;
                    if (messageCount >= 2) {
                        // 5번 메시지를 수신할 때마다 맵 업데이트

                        periodicallyUpdateMap('hlv'); // 특정 차량 ID를 전달하여 맵을 업데이트
                        messageCount = 0; // 카운트 초기화
                    }
                });
                stompClient.subscribe('/topic/shar_info_path', function (data) {
                    // const result = JSON.parse(data['body']);
                    // let path = result['path'];
                    // updateLine('hlv-line',path);
                });
                //
                // stompClient.subscribe('/topic/reservation', function (data) {
                //     historyList();
                // });
            },
            function(error) {
                Log.d("socket err : " , error);
                time++;
                if(time > 30) time = 60000;
                setTimeout(function() {
                    Log.d("socket reconnect");
                    initWebsocket();
                },time);
            });
    }


    const dateTimer = function() {
        setDate();
        setInterval(function() {
            setDate();
        }, 30000)

    }


    let aaa2 = [];

    function printLocation() {
        map.on('contextmenu', (e) => {
            console.log('Clicked location:', e.lngLat.lng ,',',e.lngLat.lat);
            aaa2[0] = e.lngLat.lng;
            aaa2[1] = e.lngLat.lat;
        });
    }

    function createCustomLayer(layerName) {
        initLine();
        let customLayer3D = {
            id: layerName,
            type: 'custom',
            renderingMode: '3d',
            onAdd: function(map, gl) {
                let options = {
                    type: mapConfig.hlv.type, //model type
                    obj: mapConfig.hlv.model + '.obj', //model .obj url
                    mtl: mapConfig.hlv.model + '.mtl', //model .mtl url
                    units: 'meters', // in meters
                    scale: mapConfig.hlv.scale, //x3 times is real size for this model
                    rotation: mapConfig.hlv.rotation, //default rotation
                    anchor: 'auto'
                }
                let options2 = {
                    type: mapConfig.tlv.type, //model type
                    obj: mapConfig.tlv.model + '.obj', //model .obj url
                    mtl: mapConfig.tlv.model + '.mtl', //model .mtl url
                    units: 'meters', // in meters
                    scale: mapConfig.tlv.scale, //x3 times is real size for this model
                    rotation: mapConfig.tlv.rotation, //default rotation
                    anchor: 'auto'
                }
                tb.loadObj(options, function(model) {
                    vehicleArr['hlv'] = model.setCoords(mapConfig.hlv.origin);
                    vehicleArr['hlv'].setRotation(mapConfig.hlv.startRotation);
                    vehicleArr['hlv'].addTooltip("HLV", true, mapConfig.hlv.anchor, true, 2);
                    vehicleArr['hlv'].renderOrder = 999;
                    vehicleArr['hlv'].onBeforeRender = function( renderer ) { renderer.clearDepth(); };
                    tb.add(vehicleArr['hlv']);
                });
                tb.loadObj(options2, function(model) {
                    vehicleArr['tlv'] = model.setCoords(mapConfig.tlv.origin);
                    vehicleArr['tlv'].setRotation(mapConfig.tlv.startRotation);
                    vehicleArr['tlv'].addTooltip("TLV", true, mapConfig.tlv.anchor, true, 2);
                    tb.add(vehicleArr['tlv']);
                });
            },
            render: function(gl, matrix) {
                tb.update();
            }
        };
        return customLayer3D;

    };


    const updateVehicle = function(id, data) {

        let vehicleObj = vehicleArr[id];
        if(typeof(vehicleObj) == "undefined") return;
        const arrLat = data[1];
        const arrLng =data[0];
        const heading =data[2];
        vehicleObj.setRotation(heading-90);

        vehicleArr[id].setCoords([arrLng, arrLat]);
        vehicleData[id] = data;


    }

    function periodicallyUpdateMap(id) {
        if (typeof vehicleArr[id] != "undefined" && typeof  vehicleData[id] != 'undefined') {
            let vehicleObj = vehicleArr[id];
            let data = vehicleData[id]
            const heading = data[2];
            let options = {
                center: vehicleObj.coordinates,
                bearing: heading-90,
                easing: easing
            };
            map.jumpTo(options);
        }
    }

    function easing(t) {
        return t * (20 - t);
    }

    const initLine = function() {
        map.addSource('hlv-line', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        [127.10237920911715, 37.39987196235322],
                        [127.11058607387321, 37.39984828837143]
                    ]
                }
            }
        });
        map.addLayer({
            'id': 'hlv-line',
            'type': 'line',
            'source': 'hlv-line',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': 'blue',
                'line-width': 8,
                'line-opacity':0.3
            }
        });
        map.addSource('tlv-line', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        [127.11067253000084, 37.39980936847563],
                        [127.10235520557052 , 37.39984557140154]
                    ]
                }
            }
        });

        map.addLayer({
            'id': 'tlv-line',
            'type': 'line',
            'source': 'tlv-line',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': 'red',
                'line-width': 8,
                'line-opacity':0.3
            }
        });

    }

    const updateLine = function(id, data) {
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





</script>
</html>
