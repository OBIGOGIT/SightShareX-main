/**
 *  Chart 함수 
 * */
var obChart = (function() {

	var defaultValue = 0;
	var defaultOptions = {
		chart: {
			animations: {
				enabled: true,
				easing: 'easeinout',
				speed: 800,
				animateGradually: {
					enabled: true,
					delay: 150
				},
				dynamicAnimation: {
					enabled: true,
					speed: 500
				}
			},
			type: 'radialBar',
			offsetY: 0,
			offsetX: 0,
			width: '220px',
			height: '220px',
		},
		plotOptions: {
			radialBar: {
				hollow: {
					margin: 5,
					size: '70%',
				},
				startAngle: -110,
				endAngle: 110,
				track: {
					background: "#3d3d3d",
					strokeWidth: '100%',
					margin: 0, // margin is in pixels
					shadow: {
						enabled: false,
						top: 2,
						left: 0,
						color: '#999',
						opacity: 1,
						blur: 2
					}
				},
				dataLabels: {
					name: {
						show: false
					},   
					value: {
						offsetY: -2,
						fontSize: '0'
					}                     
				}
			}
		},
		series : [defaultValue],
		fill: {
			type: 'gradient',
			gradient: {
			shade: 'dark',
			type: 'horizontal',
			shadeIntensity: 0.5,
			gradientToColors: ['#ABE5A1'],
			inverseColors: true,
			opacityFrom: 1,
			opacityTo: 1,
			stops: [0, 100]
			}
		},
		stroke: {
			lineCap: "butt",
		}			
	}
	
	function updateChart(element, value, speed) {
		
		if(!Array.isArray(value)){
			if(speed != null && speed) value = value* 0.59;
			value = [value];
		}
		
		element.updateSeries(value, false);
	}
	
	function updateInfo(element, value, aver) {
		var valueStr = "";
//		if(typeof(aver) != "undefined") valueStr =  value + ' ('+parseInt(aver,10)+')';
//		else 
			valueStr =  value;
		element.innerText = valueStr;
	}

	function updateData(element, value, aver) {
		if(typeof(element) == 'undefined') return;
		if(element != null) updateChart(element, value,);
		var element2 = getID(element.el.id+"_info");
		if(element2 != null) updateInfo(element2, value, aver);
	}
	
	function updateDateFull(element, value) {
		if(typeof(element) == 'undefined') return;
		if(element != null) updateChart(element, value*0.59);
		var element2 = getID(element.el.id+"_info");
		if(element2 != null) updateInfo(element2, value);
	}
	function initData(id, options, speed) {
		if(options == null || options == "") 
		options = Object.assign(defaultOptions, options);
		var element2 = getID(id+"_info");
		if(element2 != null) updateInfo(element2, options.series, speed);
		if(speed != null && speed) options.series = [options.series* 0.59];
		var chart = new ApexCharts(
			document.querySelector("#"+id),
			options
		);
		chart.render();
		return chart;
	}
	
	function getOption() {
		return defaultOptions;
	}
	
	function setOption(options) {
		defaultOptions = options
	}
	
	function deleteData(element) {
		if(element == null ) return null;
		element.destroy();
		element = null;
	}
	
	return {
		"init" : initData,
		"update" : updateData,
		"deleteChart" : deleteData,
		"getOption" : getOption,
		"setOption" : setOption,
		"updateDateFull" : updateDateFull
	}
	
})();

/**
 * 프로그래스바 함수
 * */
var obProgress = (function() {
	
	var defaultOptions = {
			datas :[
				{
					id : 'car_1',
					name :'차량1',
					value : 0,
					maxValue : 105
				},
				{
					id : 'car_2',
					name :'차량2',
					value : 0,
					maxValue : 32
				},
				{
					id : 'car_3',
					name :'차량3',
					value : 0,
					maxValue : 32
				},
				{
					id : 'car_4',
					name :'차량4',
					value : 0,
					maxValue : 32
				}
			]
	}
	
	var progressData ={};
	
	function updateValue(id, value) {
		
		var data = getData(id);
		getID(id+"_value").innerHTML = data['value'];
	}
	
	function updateMaxValue(id, value) {
		
		var data = getData(id) ;
		getID(id+"_maxValue").innerHTML = data['maxValue'];
	}
	function updatePrecent(id) {
		
		var data = getData(id) ;
		var percent = (data['value'] / data['maxValue'] * 100).toFixed(1)+ '%'; 
		getID(id).style.width = percent;
	}
	
	function setProgressbar(data) {
		
		if(data == null) return;
		progressData[data['id']] = data;
		var id = data['id'];
		updateValue(id);
		updateMaxValue(id);
		updatePrecent(id);
	}
	
	function updataProgressbar(id, value) {
		getData(id)['value'] = value ;
		setProgressbar(getData(id));
	}
	
	function initProgressbar(id, options) {
		
		var element = getID(id);
		if(options != null || options != "") options = Object.assign(defaultOptions, options);
		
		for(var index in options.datas) {
			var data = options.datas[index];
			var progressTag = 
				'<li>'+
					'<span>'+data['name']+'</span>'+
					'<div class="md_progressbarBox">'+
						'<div class="md_pgb_bg">'+
							'<div class="md_pgb_inner" id="'+data['id']+'"></div>'+
						'</div>'+
						'<div class="md_pgb_value"><span id="'+data['id']+'_value'+'">'+data['value']+'</span>/<span id="'+data['id']+'_maxValue'+'">'+data['maxValue']+'</span></div>'+
					'</div>'+
				'</li>';
			element.insertAdjacentHTML('beforeend', progressTag);
			setProgressbar(data);
		}
		
	}
	
	function getData(id) {
		
		return progressData[id];
		
	}
	
	return {
		"init" : initProgressbar,
		"update" : updataProgressbar,
		"get" : getData
	}
})();

/**
 * 노트 함수
 * */
var noteDate = (function() {
	
	var noteData ={}; 
	
	function initNoteDate(data) {
		var element = getID(data['id']);
		if(element == null) return;
		var valueLenth = data['value'].toString().length;
		if(valueLenth < data['maxLenth']) {
			data['value'] = numberPad(data['value'] , data['maxLenth']);
		}
		else {
			var cutCnt = valueLenth - data['maxLenth'];
			data['value'] = data['value'].toString().substring(cutCnt,valueLenth);
		}
		var spanTag ="";
		for(var i = 0; i < data['maxLenth']; i++) {
			spanTag += '<span>'+data['value'].substr(i, 1)+'</span> ';
		}
		spanTag = data['label'] + spanTag.substr(0, spanTag.length -1) + data['unit'];
		element.innerHTML = spanTag;
		noteData[data['id']] = data;
	}
	
	function updateNoteDate(id,value) {

		var data = getData(id);
		var valueLenth = value.toString().length;
		if(valueLenth < data['maxLenth']) {
			value = numberPad(value , data['maxLenth'])
		}
		else {
			var cutCnt = valueLenth - data['maxLenth'];
			value = value.toString().substring(cutCnt,valueLenth);
		}
		
		for(var i=0;i<data['maxLenth'];i++){
			getID(id).getElementsByTagName('span')[i].innerHTML = value.substr(i, 1);
		}
	}
	
	function getData(id) {
		return noteData[id];
	}
	
	function getValue(id) {
		return getData(id)['value'];
	}
	
	function numberPad(n, width) {
	    n = n + '';
	    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
	}
	
	return {
		"init" : initNoteDate,
		"update" : updateNoteDate,
		"get" : getData,
		"value" : getValue
	}
	
})();


/**
 * 배터리 함수
 * */
var batteryGraph = (function() {
	
	function initBattey(id , data) {
		var element = getID(id);
		if(element == null) return;
		var div =
			'<div class="md_roundBox">';
				for(var i=0; i<data.length; i++) {
					div += makeBody(data[i]);
				}
			div +='</div>'
		element.insertAdjacentHTML('beforeend', div);
	}
	
	function updateValue(id,value) {
		var element = getID(id);
		var label = getID(id+"_label");
		if(element == null) return;
		element.style.height = value+"%";
		label.innerHTML = value+"%";
	}
	
	function makeBody(data) {
		var div = "";
		switch (data['type']) {
		case 'battey':
			div = 
				'<div class="vhc_cg_battery">'+
					'<div class="batteryGraphBox">'+
						'<span class="graph_bg"> '+
							'<span id="'+data['id']+'" style="height:'+data['value']+'%"></span>'+
							'<i></i>'+
						'</span>'+
					'</div>'
			break;
		case 'hydrogen' : 
			div = 
				'<div class="vhc_cg_hydrogen">'+
					'<div class="hydrogenGraphBox">'+
						'<span class="graph_bg"> '+
						'<span id="'+data['id']+'" style="height:'+data['value']+'%"></span>'+
							'<i></i>'+
						'</span>'+
					'</div>'
			break;
		default:
			break;
		}
		if(data['lable']) {
			div += 
				'<dl>'+
					'<dt>용량</dt>'+
					'<dd>'+data['lableData']['volume']+'</dd>'+
					'<dt class="mgTB">잔량</dt>'+
					'<dd class="mgTB" id="'+data['id']+'_label">'+data['value']+data['lableData']['unit']+'</dd>'+
					'<dt>전압</dt>'+
					'<dd>14.3V</dd>'+
				'</dl>';
		}
		div += '</div>';
		return div;
		
	}
	
	return {
		"init" : initBattey,
		"update" : updateValue
	}
})();


/**
 * 
 * daum Map 함수 
 * 
 * */
const dMap = (function(){

	let markerObject = {};
	let polygonObject = {};
	let lineObject = {};
	let infowindow;
	let trafficMarker = {};
	let customOverlay = new kakao.maps.CustomOverlay({});
	let verifyObject ={};
	let _MOVETIME = 500;
	let _FRAME = _MOVETIME*0.03;

	let movePositon = {};
	let moveStep = {};
	let moveInterval = {};
	const markerOptions = {
			'size' : {
				'width' : 80,
				'height' : 80
			},
			'offset' : {
				'x' : 40,
				'y' : 40
			}
	}
	
	var TrafficViewOption ={
			'PC0001':true,
			'PC0002':true,
			'PC0003':true,
			'PC0004':true,
			'PC0005':true,
			'PC0006':true,
			'PC0007':true,
			'PC0008':true,
			'PC0009':true,
			'PC0010':true,
			'PC0011':true
	};
	
	function moveTo(map, postion, level) {
		map.setLevel(level);
		map.panTo(postion);
	}
	
	function createLine(id,lineOptions, map) {
		var line = new kakao.maps.Polyline(lineOptions);
		line.setMap(map); 
		lineObject[id] = line; 
		return line;
	}
	
	function createBusMarker(id, imgPath, markerPosition, map, options, level, contents, zIndex) {
		
		var imageSrc = imgPath+'#_'+id;
		var markerOption = Object.assign(markerOptions, options);
		var imageSize = new kakao.maps.Size(32, 66);
		var imageOption = new kakao.maps.Point(16, 33);
		var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
		var marker = new kakao.maps.Marker({
		    position: markerPosition, 
		    image: markerImage
		});
		marker.setMap(map);  
		marker.setZIndex(zIndex);
		markerObject[id] = marker;
		marker['mapLevel'] = level;
		
		kakao.maps.event.addListener(marker, 'mouseover', function() {
			var iwContent;
			if(infowindow != null) infowindow.close();
			iwContent = '<div style="padding:5px;">'+contents+'</div>';
			infowindow = new kakao.maps.InfoWindow({
			    content : iwContent
			});
			infowindow.open(map, marker);
		});

		kakao.maps.event.addListener(marker, 'mouseout', function() {
		    infowindow.close();
		});
		
		return marker;
		
	}
	
	
	function createMarker(id, imgPath, markerPosition, map, options, level, contents, zIndex) {

		let setOptions = Object.assign({}, markerOptions);
		let imageSrc = imgPath+'#_'+id;
		let markerOption = Object.assign(setOptions, options);
		let imageSize = new kakao.maps.Size(markerOption['size']['width'], markerOption['size']['height']);
		let imageOption = new kakao.maps.Point(markerOption['offset']['x'], markerOption['offset']['y']);
		let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
		let marker = null;
		if(imgPath == null) {
			marker = new kakao.maps.Marker({
				position: markerPosition
			});
		}
		else {
			marker = new kakao.maps.Marker({
				position: markerPosition,
				image: markerImage
			});
		}
		marker.setMap(map);
		marker.setZIndex(zIndex);
		markerObject[id] = marker;
		marker['mapLevel'] = level;
		
		kakao.maps.event.addListener(marker, 'mouseover', function() {
			let iwContent;
			if(infowindow != null) infowindow.close();
			iwContent = '<div style="padding:5px;">'+contents+'</div>';
			infowindow = new kakao.maps.InfoWindow({
			    content : iwContent
			});
			infowindow.open(map, marker);
		});

		kakao.maps.event.addListener(marker, 'mouseout', function() {
		    infowindow.close();
		});
		
		return marker;
		
	}
	
	
	function searchDetailAddrFromCoords(coords, callback) {
		var geocoder = new kakao.maps.services.Geocoder();
	    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
	}
	
	
	function createTrafficMarker(id, image, positon, map, sizeOption, level, description) {
		createMarker(id, image, positon, map, markerEquals(positon, sizeOption), level, description);
	}
	
	function createDefaultMarker(id, postion, level, description) {
		
		var marker = new kakao.maps.Marker({ 
		    position: postion
		}); 
		
		markerObject[id] = marker;
		marker['mapLevel'] = level;
		marker.setMap(map);  
		kakao.maps.event.addListener(marker, 'mouseover', function() {
			if(infowindow != null) infowindow.close();
			iwContent = '<div style="padding:5px;">'+description+'</div>';
			infowindow = new kakao.maps.InfoWindow({
			    content : iwContent
			});
			infowindow.open(map, marker);
		});

		kakao.maps.event.addListener(marker, 'mouseout', function() {
		    infowindow.close();
		});
		
	}
	
	function markerChange(id,img) {
		
		var image = markerObject[id].getImage()
		image['Vj'] = img+"#_"+id;
		markerObject[id].setImage(image);
	}
	
	function setImage(id,path,options) {
		
		var markerOption = Object.assign(markerOptions, options);
		var imageSize = new kakao.maps.Size(80, 80);
		var imageOption = new kakao.maps.Point(40, 40);
		
		var markerImage = new kakao.maps.MarkerImage(path, imageSize, imageOption);
		markerObject[id].setImage(markerImage);
	}
	
	function markerEquals(postion, sizeOption) {
		
		var options = {
				'offset' : {
					'x' : 10,
					'y' : 35
				}
		}
		options = Object.assign(options, sizeOption);
		if(typeof(trafficMarker[postion]) == "undefined") {
			
			var trafficJson = dMap.getTraffic();
			trafficJson[postion] = 1;
			dMap.setTraffic(trafficJson);
			return options;
		}
		else {
			
			var offset ={};
			var trafficJson = dMap.getTraffic();
			options['offset']['x'] = options['offset']['x'] - (trafficJson[postion]*25);
			trafficJson[postion]++;
			dMap.setTraffic(trafficJson);
			return options;
		}
		
	}
	function removeApiBus(fitterId) {
		for(var idx in markerObject) {
			if(idx == fitterId) {
				markerObject[fitterId].setMap(null);
				delete markerObject[fitterId]; 
				return;
			}
		}
	}
	function removeMarkers(fitterId) {
		var flag = false;
		if(typeof(TrafficViewOption[fitterId]) != "undefined") {
			flag = !TrafficViewOption[fitterId];
		}
		
		for(var idx in markerObject) {
			if(idx.indexOf(fitterId) > -1) {
				if(flag) {
					markerObject[idx].setMap(map);
				}
				else {
					markerObject[idx].setMap(null);
				}
			}
		}
		TrafficViewOption[fitterId] = flag;
	}
	
	function getTrafficView(id) {
		return TrafficViewOption[id];
	}
	function getTrafficJson() {
		return trafficMarker;
	}
	
	function setTrafficJson(trafficJson) {
		trafficMarker = trafficJson;
	}
	
	function getMarker(id) {
		return markerObject[id];
	}

	function removeMaker(idx) {
		if(typeof(markerObject[idx]) != 'undefined') {
			window.clearInterval(moveInterval[idx]);
			markerObject[idx].setMap(null);
			delete markerObject[idx];
		}
	}
	
	function getBusMarkerAll() {
		var preFix = "api_";
		var apiBusIdxArr = []
		for(var idx in markerObject) {
			if(idx.indexOf(preFix) > -1) {
				apiBusIdxArr.push(idx);
			}
		}
		return apiBusIdxArr;
	}
	
	
	function getCarMarkerAll() {
		var preFix = "bus";
		var carArr = []
		for(var idx in markerObject) {
			if(idx.indexOf(preFix) > -1) {
				carArr.push(markerObject[idx]);
			}
		}
		return carArr;
	}
	
	
	
	function getLine(id) {
		return lineObject[id];
	}
	
	function setLine(id, object) {
		lineObject[id] = object;
	}
	
	
	function getPolyGon() {
		return polygonObject;
	}
	
	function createPolyGon(id, options, level, description) {
		var polygonOptions =  {
				
	        strokeWeight: 2,
	        strokeColor: '#004c80',
	        strokeOpacity: 0.8,
	        fillColor: '#fff',
	        fillOpacity: 0.7 
            
		}
		var setOptions = Object.assign(polygonOptions, options);
		var polygon = new kakao.maps.Polygon(setOptions);
		polygon['mapLevel'] = level; 
		polygonObject[id] = polygon;
		
	    kakao.maps.event.addListener(polygon, 'mouseover', function(mouseEvent) {
	        polygon.setOptions({fillColor: '#09f'});

	        customOverlay.setContent('<div class="area" style="background-color:wheat;">' + description + '</div>');
	        
	        customOverlay.setPosition(mouseEvent.latLng); 
	        customOverlay.setMap(map);
	    });

	    // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다 
	    kakao.maps.event.addListener(polygon, 'mousemove', function(mouseEvent) {
	        customOverlay.setPosition(mouseEvent.latLng); 
	    });

	    // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
	    // 커스텀 오버레이를 지도에서 제거합니다 
	    kakao.maps.event.addListener(polygon, 'mouseout', function() {
	        polygon.setOptions({fillColor: '#004c80'});
	        customOverlay.setMap(null);
	    }); 
	}
	
	function getVerify(id) {
		
		return verifyObject[id];
		
	}
	
	function setVerify(id,contents) {
		
		
		verifyObject[id] = contents;
		
	}
	
	function carMarkerHide() {
		setTimeout(function() {
			for(var idx in markerObject) {
				markerObject[idx].setMap(null);
				
			}
			
		},3000);
	}
	
	function markerHideAndView() {
		
		var mapLevel = map.getLevel();
		
		for(var idx in markerObject) {
			
			var level = markerObject[idx]['mapLevel'];
			if(idx.indexOf('api_') == -1 && idx.indexOf('PC') == -1) continue;
			if(level < mapLevel) {
				markerObject[idx].setMap(null);
			}
			else {
				markerObject[idx].setMap(map);
			}
			
		}
		
		for(var idx in polygonObject) {
			var level = polygonObject[idx]['mapLevel'];
			if(level < mapLevel) {
				polygonObject[idx].setMap(null);
			}
			else {
				polygonObject[idx].setMap(map);
			}
			
		}
		
	}

	function markerMoveEvent(id, position) {
		if(getMarker(id) == "undefined") return;
		if(moveInterval[id] != "undefined" || moveInterval[id] != null) {
			window.clearInterval(moveInterval[id]);
			moveInterval[id] = null;
		}
		movePositon[id] = position;
		moveStep[id] = 0;
		headingSet(id, position);
		setPostion(id);

	}

	function setPostion(id) {
		moveInterval[id] = setTimeout(function() {
			if(moveStep[id] >= _FRAME) {
				moveInterval[id] = null;
				return;
			}
			moveStep[id] = moveStep[id]+1;
			movingBusEvent(id, moveStep[id]);
			setPostion(id);
		}, (_MOVETIME/_FRAME));
	}

	function movingBusEvent(id,index) {
		const position = movePositon[id];
		const markerLatLng = getMarker(id).getPosition();
		const coordsDeparture = new google.maps.LatLng(markerLatLng.getLat(), markerLatLng.getLng());
		const coordsArrival = new google.maps.LatLng(position.getLat(), position.getLng());
		const are_we_there_yet = google.maps.geometry.spherical.interpolate(coordsDeparture, coordsArrival, index / _FRAME);
		dMap.getMarker(id).setPosition(new kakao.maps.LatLng(are_we_there_yet.lat(), are_we_there_yet.lng()))

	}

	function headingSet(id, position) {
		const departure = dMap.getMarker(id).getPosition();
		const coordsDeparture = new google.maps.LatLng(departure.getLat(), departure.getLng());
		const coordsArrival = new google.maps.LatLng(position.getLat(), position.getLng());
		const heading = parseInt(google.maps.geometry.spherical.computeHeading(coordsDeparture, coordsArrival),10);
		$('img[src="/images/dashboard/car.png#_'+id+'"]').css({
			'transform': 'rotate('+heading+'deg)'
		});
	}




	/**
	 * 
	 * 화면 상의 맵 초기화 및 그리기
	 * 
	 * @param id
	 * @param options (required options.center)
	 * @return map
	 * 
	 * */
	function initMap(id, options) {
		var element = getID(id);
		if(element == null) return;
		
		var kakaoMap = new kakao.maps.Map(element, options);
		kakao.maps.event.addListener(kakaoMap, 'click', function(mouseEvent) {      
			if(infowindow != null) infowindow.close();
		});
		
		return kakaoMap;
	}

	return {
		'init' : initMap,
		'createMarker' : createMarker,
		'createLine' : createLine,
		'getMarker' : getMarker,
		'setImage' : setImage,
		'getLine' : getLine,
		'setLine' : setLine,
		'move' : moveTo,
		'getTraffic' : getTrafficJson,
		'setTraffic' : setTrafficJson,
		'markerEquals' : markerEquals,
		'createTraffic' : createTrafficMarker,
		'removeMarkers' : removeMarkers,
		'getTrafficView' : getTrafficView,
		'markerChange' : markerChange,
		'createDefaultMarker' : createDefaultMarker,
		'createPolyGon' : createPolyGon,
		'markerHideAndView' : markerHideAndView,
		'getPolyGon' : getPolyGon,
		'getVerify' : getVerify,
		'setVerify' : setVerify,
		'getBusMarkerAll' :getBusMarkerAll,
		'removeApiBus':removeApiBus,
		'createBusMarker':createBusMarker,
		'carMarkerHide':carMarkerHide,
		'getCarMarkerAll':getCarMarkerAll,
		'markerMove':markerMoveEvent,
		'removeMaker':removeMaker
	}
})();



/**
 * 
 * google Map 함수 
 * 
 * */
var gMaps = (function() {
	
	var lineOptions = {
			geodesic: true,
			strokeColor: 'red',
			strokeOpacity: 1.0,
			strokeWeight: 2
	}
        
	var polygonOptions = {
			strokeColor: 'red',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: 'red',
			fillOpacity: 0.3,
	}
	
	/**
	 * 
	 * 화면 상의 맵 초기화 및 그리기
	 * 
	 * @param id
	 * @param options (required options.center)
	 * @return map
	 * 
	 * */
	function initMap(id, options) {
		var element = getID(id);
		if(element == null) return;
		var map = new google.maps.Map(element,options);
		return map;
	}
	
	
	/**
	 * 
	 * 화면상 마커 생성
	 * 
	 * @param coordinate (required google.maps.LatLng)
	 * @pram map (required)
	 * @param options 
	 * @return makerObject 
	 * 
	 * */
	function createMarker(options, map) {
		options.map = map;
		var markerObject = new google.maps.Marker(options);
		return markerObject;
	}
	
	/**
	 * 
	 * 라인 그리기
	 * 
	 * @param options (required options.path, map);
	 * @retrun lineObject 
	 * 
	 * */
	function createLine(options, map) {
		options = Object.assign(lineOptions, options);
		options.map = map;
		var lineObject = new google.maps.Polyline(options);
		return lineObject;
		
	}
	
	/**
	 * 
	 * 사각형 그리기
	 * @param options (required options.paths, map);
	 * @retrun polygonObject 
	 * 
	 * */
	function createPolygon(options, map) {
		options = Object.assign(polygonOptions, options);
		options.map = map;
		var lineObject = new google.maps.Polygon(options);
		return lineObject;
	}
	
	
	/**
	 * 
	 * 두 좌표 사이의 각도 찾기
	 * 
	 * @param startCoordinate  (required google.maps.LatLng)
	 * @param endCoordinate (required google.maps.LatLng)
	 * @return angle 
	 * 
	 * */
	function directionPoint(startCoordinate,endCoordinate) {
		var heading = google.maps.geometry.spherical.computeHeading(startCoordinate, endCoordinate);
		return heading;
	}
	
	
	/**
	 * 
	 * 지정된 영역안에 진입 유무 여부
	 * 
	 * @param coordinate (required)
	 * @param areaCoordinate (required Array 3point or 4 point)  
	 * @return boolean
	 * 
	 * */
	
	function containsLocation(coordinate, areaCoordinate) {
		return google.maps.geometry.poly.containsLocation(carPostion, bound[i]);
	}
	
	/**
	 *  기본 맵 옵션 return;
	 *  
	 *  @retrun options
	 *  
	 * */
	function getOptions() {
		return mapOptions;
	}
	
	
	/**
	 *  기본 라인 옵션 return;
	 *  
	 *  @retrun options
	 *  
	 * */
	function getLineOptions() {
		return lineOptions;
	}
	
	/**
	 *  기본 폴리곤 옵션 return;
	 *  
	 *  @retrun options
	 *  
	 * */
	function getPolygonOptions() {
		return polygonOptions;
	}
	
	
	return {
		
		'init' : initMap,
		'createMarker' : createMarker,
		'createLine' : createLine,
		'createPolygon' : createPolygon,
		'getOptions' : getOptions,
		'getLineOptions' : getLineOptions,
		'getPolygonOptions' : getPolygonOptions,
		'direction': directionPoint,
		'contains' : containsLocation
		
	}
	
})();


//파일 단순 다운로드 (스크립트 처리 .text)
var obFiles = (function() {
	
	
	function downLoadFile(fileName, content) {
		var blob = new Blob([content], { type: 'text/plain' });
		 
	    objURL = window.URL.createObjectURL(blob);
	            
	    // 이전에 생성된 메모리 해제
	    if (window.__Xr_objURL_forCreatingFile__) {
	        window.URL.revokeObjectURL(window.__Xr_objURL_forCreatingFile__);
	    }
	    window.__Xr_objURL_forCreatingFile__ = objURL;
	 
	    var a = document.createElement('a');
	 
	    a.download = fileName;
	    a.href = objURL;
	    a.click();
	}
	
	return {
		'down' : downLoadFile
	} 
	
})();

const obigoMiniMap = (function() {

	function removeAllchild(id) {
		let element = getID(id);
		while (element.hasChildNodes()) {
			element.removeChild(element.firstChild);
		}
	}
	function createMiniMap(json) {
		removeAllchild('miniMapContents');
		const locationSize = json.length;
		const locationData = json;
		const height = Math.floor((596 - 24) / locationSize) - 3;
		let mapDiv = '';
		for(let i=0; i < locationSize; i++) {
			const mapId = 'location_'+locationData[i]['locationSeq'];
			if(i == 0) {
				const miniMapDiv =
					'<div class="mini-map-location" style="height: %spx;">' +
					'	<div class="location-icon">' +
					'		<div class="location-bg-r-icon">' +
					'			<div id="%s" class="minimap"></div>' +
					'		</div>' +
					'	</div>' +
					'	<div class="location-text">%s</div>' +
					'</div>'
				mapDiv += miniMapDiv.sprintf(height, mapId, locationData[i]['locationName']);
			}
			else if(i == json.length -1) {
				const miniMapDiv =
					'<div class="mini-map-location" style="height: 24px;">' +
					'	<div class="location-icon-last">' +
					'		<div class="location-bg-r-icon">' +
					'			<div id="%s" class="minimap"></div>' +
					'		</div>' +
					'	</div>' +
					'	<div class="location-text">%s</div>' +
					'</div>'
				mapDiv += miniMapDiv.sprintf(mapId, locationData[i]['locationName']);
			}
			else {
				const miniMapDiv =
					'<div class="mini-map-location" style="height: %spx;">' +
					'	<div class="location-icon">' +
					'		<div class="location-bg-icon">' +
					'			<div id="%s" class="origin minimap"></div>' +
					'		</div>' +
					'	</div>' +
					'	<div class="location-text">%s</div>' +
					'</div>'
				mapDiv += miniMapDiv.sprintf(height, mapId, locationData[i]['locationName']);
			}
		}
		getID('miniMapContents').innerHTML = mapDiv;
	}

	return {
		"remove" : removeAllchild,
		"create" : createMiniMap
	}
})();


const obigoCustomSelect = (function() {

	let cutomFuc = {};
	let selectDataJson ={};

	function createFunction(id , fuc) {
		cutomFuc[id] = fuc;
	}
	function startFunction(id) {
		if(typeof(cutomFuc[id]) == 'undefined') return;
		cutomFuc[id]();
	}

	function getDate(id) {
		return selectDataJson[id];
	}

	function removeAllchild(id) {
		let element = getID(id);
		while (element.hasChildNodes()) {
			element.removeChild(element.firstChild);
		}
	}


	function createSelect(id, jsonList) {

		removeAllchild(id);
		if(jsonList.length == 0) {
			return;
		}

		let activeDate = null;
		let selectBody = '<div id="%s" data="%s" class="area-overlay-contens">';
		let bodyId = id+"_body"
		selectBody = selectBody.sprintf(bodyId, id);
		let selectId = id+"_select"
		let customDataArr = [];
		let dataJson = {};
		for(let i = 0; i < jsonList.length; i++) {

			let bodyData = null;
			if(jsonList[i]['active'] == true) {
				activeDate = jsonList[i];
				bodyData = '<div class="content-box active" onclick="areaSelectEvent(%s,this)">' +
					'<span class="overlay-txt" value="%s" >%s</span>' +
					'</div>';
			}
			else {
				bodyData = '<div class="content-box" onclick="areaSelectEvent(%s, this)">' +
					'<span class="overlay-txt" value="%s" >%s</span>' +
					'</div>';
			}
			if(i == jsonList.length-1 && activeDate == null) {
				activeDate = jsonList[0];
			}
			bodyData = bodyData.sprintf("'"+id+"'", jsonList[i]['value'],jsonList[i]['title']);
			selectBody += bodyData;
			dataJson[jsonList[i]['value']] = jsonList[i]['data'];
		}
		selectDataJson[id] = dataJson;

		selectBody += '</div>';

		let selectHeader =
				'<div class="area-overlay-title">' +
				'<span id = "%s" class="overlay-txt" value="%s">%s' +
				'</span>' +
				'<div class="arrow-icon"></div>' +
				'</div>';
			selectHeader = selectHeader.sprintf(selectId, activeDate['value'],activeDate['title']);
		let element = getID(id);
		element.innerHTML = selectHeader + selectBody;
		element.addEventListener("click", selectOpen);
	}

	return {
		"create" : createSelect,
		"set" : createFunction,
		"remove" : removeAllchild,
		"start":startFunction,
		"getData":getDate
	}


})();

var selectOpen = function() {
	var id = this.getAttribute('id') + '_body';
	var ele = getID(id);
	var className = this.childNodes[0].className;
	if(className.indexOf('selected') > -1) {
		this.childNodes[0].classList.remove("selected");
		ele.style.display = 'none';
	}
	else {
		this.childNodes[0].classList.add('selected');
		ele.style.display = 'block';
	}
}


const managementAction = function() {
	console.log('aaa');
}

const areaSelectEvent = function(id , e) {

	const className = e.className;
	if(className.indexOf('active') == -1) {
		let parent = e.parentNode;
		let ele = getID(parent.getAttribute("data")+'_select');
		let nodes = parent.childNodes;
		for(let i=0; i<nodes.length; i++) {
			if(nodes[i].tagName == 'DIV') {
				nodes[i].className = 'content-box';
			}
		}
		e.classList.add('active');
		ele.setAttribute('value',e.childNodes[0].getAttribute('value'));


		if(id == 'popupSelect') {
			const value = e.childNodes[0].innerText;
			let location = value.split('-')[0];
			let service = value.split('-')[1];
			if(typeof service =='undefined') service = '서비스없음';
			getID('popup_service').innerText = service;
			getID('popup_location').innerText = location;
		}

		ele.innerText= e.childNodes[0].innerText;
		obigoCustomSelect.start(id);
	}


}
const prefixId = 'service_'
const serivceId = 'child_'


const inserPopupValue = function(preFix ,key, valueData) {
	if(typeof valueData == 'object') {


		if(Array.isArray(valueData) == true) {
			if(getID('serviceList') != null) {
				getID('serviceList').innerHTML ='';
				for(let i =0; i<valueData.length; i++) {
					const data = valueData[i];
					let bodyDiv = document.createElement('div');
					let groupDiv = document.createElement('div');
					let labelDiv = document.createElement('div');
					let valueDiv = document.createElement('div');
					let minusDiv = document.createElement('div');
					bodyDiv.id = prefixId + data['serviceCode'];
					minusDiv.id = prefixId + serivceId+ data['serviceCode'];
					minusDiv.className = 'fa fa-fw fa-minus-circle';
					minusDiv.style.paddingTop ='16px';
					minusDiv.style.cursor ='pointer';
					minusDiv.setAttribute('serviceCode' , data['serviceCode']);
					minusDiv.setAttribute('serviceName' , data['serviceName']);
					minusDiv.setAttribute('onclick', 'minusServiceCode(' + data['serviceCode'] + ')');
					bodyDiv.className = 'custom-body';
					groupDiv.className = 'custom-group';
					labelDiv.className = 'custom-child-label';
					valueDiv.className = 'custom-child-value';
					labelDiv.innerHTML = data['serviceCode'];
					valueDiv.innerHTML = data['serviceName'];
					groupDiv.appendChild(labelDiv);
					groupDiv.appendChild(valueDiv);
					groupDiv.appendChild(minusDiv);
					bodyDiv.appendChild(groupDiv);
					getID('serviceList').appendChild(bodyDiv);
				}
			}

		}
		else {
			for(let objectKey in valueData) {
				const id = preFix + key +"_";
				if(objectKey== "created" || objectKey== "updated" || objectKey =='reservationDate') {
					continue;
				}
				inserPopupValue(id, objectKey, valueData[objectKey]);
			}
		}
	}
	else {
		const popupId = preFix + key;
		if(getID(popupId) == null) return;
		if(getID(popupId).tagName == 'SELECT' || getID(popupId).tagName == 'INPUT'  || getID(popupId).tagName == 'TEXTAREA' ) {
			getID(popupId).value = valueData;
		}
		else {
			getID(popupId).innerText = valueData;
		}

	}
};
