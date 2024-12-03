/**
 * 
 * daum Map 함수 
 * 
 * */
var dMap = (function(){
	
	var markerObject = {};
	var polygonObject = {};
	var lineObject = {};
	var infowindow;
	var trafficMarker = {};
	var customOverlay = new kakao.maps.CustomOverlay({});
	var verifyObject ={};
	
	var markerOptions = {
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
		
		var imageSrc = imgPath+'#_'+id;
		var markerOption = Object.assign(markerOptions, options);
		var imageSize = new kakao.maps.Size(markerOption['size']['width'], markerOption['size']['height']);
		var imageOption = new kakao.maps.Point(markerOption['offset']['x'], markerOption['offset']['y']);
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
		console.log('asdasdsa', markerObject[idx])
		if(typeof(markerObject[idx]) != 'undefined') {
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
		'removeMaker':removeMaker
	}
})();
