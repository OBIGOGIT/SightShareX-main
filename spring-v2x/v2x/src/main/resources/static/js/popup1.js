	var chart1;
	var chart2;
	var chart3;
	var chart4;
	var chart_speed;
	
	var busSttnIdx = 1;
	var trafficLightIdx = 1;	//신호등 순서
	var dsbmLoadTxtIdx = 1;		//주행노선정보 순서
	var dsbmLoadTxt;			//차선안내 interval
	var trafficLight = true;	//신호등 interval
	var randomSpeedCar1;		//차량속도 interval
	var busFirst;				//신호등 이벤트 interval
	
	var pvdName = null;
	
	
	//배터리 상태
	function batteyStatus() {
		var batteryData = [
	        {
	        	id : 'car1_battey',
	            type :'battey',
	            value : 86,
	            lable : true,
	            lableData : {
	                volume : '150Ah',
	                unit : '%',
	                volt : '14.3V' 
	            }
	        }
	        ,
	        {
	        	id : 'car1_hydrogen',
	            type :'hydrogen',
	            value : 23,
	            lable : true,
	            lableData : {
	                volume : '150Ah',
	                unit : '%',
	                volt : '14.3V' 
	            }
	        }
	    ];
		
		batteryGraph.init('chargeDiv',batteryData);
		
//		setInterval(function () {
//			
//			batteyCnt = batteyCnt -3;
//			batteyCnt2--;
//			
//			if(0 >= batteyCnt) batteyCnt =100;
//			if(0 >= batteyCnt2) batteyCnt2 =100;
//			
//			
//			
//			batteryGraph.update('car1_battey',batteyCnt);
//			batteryGraph.update('car1_hydrogen',batteyCnt2);
//			
//		}, 2000);
	}
	//차량상태
	function drawStatusChart(){
		//게이지 차트
		var options = {
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
					offsetX: -35,
					width: '250px',
					height: '250px',
				},
				plotOptions: {
					radialBar: {
						hollow: {
							margin: 5,
							size: '80%',
						},
						startAngle: -150,
						endAngle: 150,
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
							},
							width: '150px',
							height: '150px',
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
				fill: {
					type: 'gradient',
					gradient: {
					shade: 'dark',
					type: 'horizontal',
					shadeIntensity: 0,
					gradientToColors: ['#ABE5A1'],
					inverseColors: true,
					opacityFrom: 1,
					opacityTo: 1,
					stops: [0, 100]
					}
				},
				stroke: {
					lineCap: "round",
				},
				series: [0],
				labels: ['Average Results'],
				
			}

//			chart1 = new ApexCharts(
//				document.querySelector("#chart1"),
//				options
//			);
		
			chart1 = obChart.init("chart1",options);
			options.series = [0]; // 엔진
			chart2 = obChart.init("chart2",options);
//			chart2 = new ApexCharts(
//			 	document.querySelector("#chart2"), 
//			 	options
//			);
			
			options.series = [0]; // 배터리
			chart3 = obChart.init("chart3",options);
//			chart3 = new ApexCharts(
//			 	document.querySelector("#chart3"),
//			 	options
//			);
//			
			options.series = [0]; // 수소탱크
			chart4 = obChart.init("chart4",options);
//			chart4 = new ApexCharts(
//			 	document.querySelector("#chart4"),
//			 	options
//			);

			
			
			
			
			options.series = [0]; // 차량 속도 게이지
			options.chart.width = '373px';
			options.chart.height = '373px';
			options.plotOptions.radialBar.startAngle = -120;
			options.plotOptions.radialBar.endAngle = 120;
			options.fill.type = 'linear';
			options.fill.colors = ['#3e86f2'];
			chart_speed = obChart.init("chart_speed",options, true);
//			chart_speed = new ApexCharts(
//			 	document.querySelector("#chart_speed"),
//			 	options
//			); 
			
			
//			chart1.render();
//			chart2.render();
//			chart3.render();
//			chart4.render();
//			chart_speed.render();
			
			
		
	}
	
	//차량장치 게이지
	function startRandomStatus() {
		
		setInterval(function () {
			
			for(var i = 1; i < 5; i ++) {
//				$("#randomStatusId" + i).html(eval("arrayRandomStatus" + i)[randomStatusCnt] + '<i>℃</i>');
//				eval("chart" + i).updateSeries([eval("arrayRandomStatus" + i)[randomStatusCnt]], false);
				
				
				obChart.update(eval("chart" + i), eval("arrayRandomStatus" + i)[randomStatusCnt]);
			}
		
			randomStatusCnt++;
			
			//배열이 끝났을때
			if(arrayRandomStatus1.length == randomStatusCnt){
				randomStatusCnt = 0;
			}
			
		}, 2000);
	}
	
	
	//정류소, 신호등 갱신 
	function startBSAndTLInfo(){
		setInterval(function (){
			setBusSttnInfo();
			
			if(trafficLight){
				setTrafficLight();
			}
			
		}, 5000);
	}
	
	function rsuGetCode(data,rsuId) {
		var returnSignal = {};
		var rsuList = data['intersections'][0]['states'];
		for(var i=0; i<rsuList.length; i++) {
			var rsuData = rsuList[i];
			if(rsuData['movementName'].indexOf(rsuId) > -1 ) {
				var signal = rsuData['movementName'].split(",")[4];
				var time = rsuData['movementName'].split(",")[5].split("/")[0];
				returnSignal['signal'] = signal;
				returnSignal['time'] = time;
				return returnSignal;
			}
		}
	}	
	
	function ligthOn(index) {
		var trafficLights = $("#trafficLightsId span");
		if(trafficLigth) {
			eventAddClass(trafficLights.eq(index), "on");
		}
		else {
			eventRemoveClass(trafficLights.eq(index), "on");
		}
	}
	
	
	function ligthStart(index) {
		
		ligthOn(index);
		trafficInterval = setTimeout(function (){
			trafficLigth = !trafficLigth;
			ligthStart(index);
		}, 1000);
		
	}
	
	function ligthStop() {
		 clearTimeout(trafficInterval);
		 var trafficLights = $("#trafficLightsId span");
		 clearTrafficLight(trafficLights);
	}
	
	var trafficCode = null;
	var trafficInterval = null;
	var trafficLigth = true;
	function trafficLightCode(codeJson,rsuId) {
		var code = codeJson['signal'];
		var time = parseInt(codeJson['time'],10);
		if(time < 100) getID('trlfTime').innerText = time;
		else getID('trlfTime').innerText = '';
		if(trafficCode == code) return;
		trafficCode = code;
		var trafficLights = $("#trafficLightsId span");
		ligthStop();
		switch (code) {
			case 'RDON':
				//적색
				eventAddClass(trafficLights.eq(0), "on");
				break;
			case 'YLON':
				//황색
				eventAddClass(trafficLights.eq(1), "on");
				break;
			case 'GRON':
				if(rsuId == '$MN,NNN,I-N,LF') {
					eventAddClass(trafficLights.eq(2), "on"); //좌회전
				}
				else {
					eventAddClass(trafficLights.eq(3), "on"); //녹색
				}
				break;
			case 'RDFL':
				//적색 점멸
				ligthStart(0)
				break;
			case 'YLFL':
				//황색점멸
				ligthStart(1)
				break;
			default:
				break;
		}
		
	}
	//신호등 변경
	function setTrafficLight(){
		
		var trafficLights = $("#trafficLightsId span");
		
		//신호등 초기화
		clearTrafficLight(trafficLights);
		
		if(trafficLightIdx == 0){			//초록불
			eventAddClass(trafficLights.eq(3), "on");
			$("#vhc_dsbm_id span").eq(0).text("250");
		}else if(trafficLightIdx == 1){		//초록불 AND 좌회전
			eventAddClass(trafficLights.eq(2), "on");
			eventAddClass(trafficLights.eq(3), "on");
			$("#vhc_dsbm_id span").eq(0).text("150");
		}else if(trafficLightIdx == 2){		//주황불
			eventAddClass(trafficLights.eq(1), "on");
			$("#vhc_dsbm_id span").eq(0).text("50");
		}else{								//빨간불
			eventAddClass(trafficLights.eq(0), "on");
			$("#vhc_dsbm_id span").eq(0).text("0");
		}
		
		if(trafficLightIdx < 3){
			trafficLightIdx++;
		}else{
			trafficLightIdx = 0;
		}
		
	}
	
	//신호등 초기화
	function clearTrafficLight(trafficLights){
		for(var i=0; i<trafficLights.size(); i++){ 
			eventRemoveClass(trafficLights.eq(i), "on");
			getID('trlfTime').innerText ="";
		}
	}
	
	
	//버스화면 - 신호등 이벤트 이벤트 중지
	function stopBeforeBusFirstEvent(){
		trafficLight = false;			//신호등
		clearInterval(dsbmLoadTxt);		//주행노선정보
		clearInterval(randomSpeedCar1);	//차량속도
	}
	
	//버스화면 - 신호등 이벤트 이벤트 중지
	function startBeforeBusFirstEvent(){
		trafficLight = true;			//신호등, 남은거리
		startDsbmLoadTxt();				//주행노선정보
		startRandomSpeedCar1();			//차량속도
		
		eventAddClass($(".accel"), 'on'); 		// 브레이크 텍스트 on
		eventRemoveClass($(".brake"), 'on');	// 엑셀 텍스트 off
		$(".clst_gear_txt").text('D');			// 기어 텍스트 N 변경
		
		var trafficLights = $("#trafficLightsId span");
		
		clearTrafficLight(trafficLights);		//신호등 비활성화로 초기화
		eventAddClass(trafficLights.eq(3), "on");
		$("#vhc_dsbm_id span").eq(0).text("250");
		trafficLightIdx = 1;
	}
	
	//버스 화면 - 신호등 이벤트
	function startBusFirstEvent(){
		var idx = 1;
		var arraySpeed = [34, 26, 12, 0];
		var trafficLights = $("#trafficLightsId span");
		
		stopBeforeBusFirstEvent();				//상시이벤트 정지
		clearTrafficLight(trafficLights);		//신호등 비활성화로 초기화
		eventAddClass(trafficLights.eq(2), "on");
		eventAddClass(trafficLights.eq(3), "on");
		
		$(".vhc_dsbm_loadtxt").text('편도 3차로 - 1차선 주행 중'); // 차선 안내
		//setSpeedInfo(42);
		$(".vhc_dsbm_txt").children('span').text('200'); // 앞차와의 간격 거리 텍스트

		//엑셀(ON), 브레이크(OFF)
		eventAddClass($(".brake"), 'on'); // 브레이크 텍스트 on
		eventRemoveClass($(".accel"), 'on'); // 엑셀 텍스트 off
		
		
		busFirst = setInterval(function (){
			//신호등 변경
			if(idx == 3 ){		//주황
				clearTrafficLight(trafficLights);		//신호등 비활성화로 초기화
				eventAddClass(trafficLights.eq(1), "on");
			}else if(idx > 3){	//빨강
				//신호등
				clearTrafficLight(trafficLights);		//신호등 비활성화로 초기화
				eventAddClass(trafficLights.eq(0), "on");
			}
			
			var vhcDsbmTxtInt = parseInt($(".vhc_dsbm_txt").children('span').text());
			
			//남은거리 변경
			if(vhcDsbmTxtInt > 0){
				$(".vhc_dsbm_txt").children('span').text( (vhcDsbmTxtInt - 50) );
			}
			
			//속도 감속
			if(arraySpeed.length > idx-1){
				// setSpeedInfo(arraySpeed[idx-1]);
			}
			
			//속도계가 0일때 기어(D->N)
			if(idx == 4){
				$(".clst_gear_txt").text('N'); // 기어 텍스트 N 변경
				//eventDiv = "";
				clearInterval(busFirst);		//이벤트 헤제
			}
			
			idx++;
		
		}, 1000);
	}
	
	//속도 그래프, 수치 셋팅
	function setSpeedInfo(speed){
//		$("#randomSpeedId1").html(speed + '<i>km/h</i>');	
//		eval("chart_speed").updateSeries([ (speed * 0.59) ], false);
		obChart.update(chart_speed, speed, true);
	}
	
	//버스화면 - 차선이탈 이벤트
	function startBustSecEvent(){
		var busSec = setInterval(function (){
			eventAddClass($(".vhc_dsbm_info"), 'lane_out_right'); // 차선이탈 클래스 추가
			$(".vhc_dsbm_alertTxt").children('span').text('차선이탈 위험'); // 텍스트 문구 변경
			clearInterval(busSec);
		}, 2000);
	}
	
	
	//버스화면 - 전방 추돌 이벤트
//	function startBustThrdEvent(){
//		var busThrd = setInterval(function (){
//			eventAddClass($(".vhc_dsbm_info"), 'front_collision'); // 전방 추돌 클래스 추가
//			$(".vhc_dsbm_alertTxt").children('span').text('전방 추돌위험'); // 텍스트 문구 변경
//			clearInterval(busThrd);
//		}, 2000);
//	}
	
	
	/***
	 * 
	 *	eaton
	 * 
	 * */
	
	const co2 = 1.29;
	
	
	var dataSelect = function() {
		
		pvdName = getID('vehicleSelect').options[getID('vehicleSelect').selectedIndex].value;
		trafficCode = null;
		var params = new URLSearchParams();
		params.append( 'pvdName', pvdName);
		axios.post('/status/ajaxList', params)
		.then(function(response) {
			Log.d( 'response.data : ', response.data );
			if ( response.data.result == 'ok' ) {
				var data = response.data;
				defulatInit();
				if(typeof(data['direction'])!='undefined'){
					
					if(data['direction'] == 1) {
						setMiniMapUpMode();
					}
					else {
						setMiniMapDownMode();
					}
				}
				if(typeof(data['verifyDistanceVO'])!='undefined'){
					initData(data['verifyDistanceVO']);
					setDistance(data['verifyDistanceVO'])
				}
				if(typeof(data['verifyResultVO'])!='undefined'){
					initData(data['verifyResultVO']);
					setQuestion(data['verifyResultVO']);
				}
				if(typeof(data['vehicle']) !='undefined') {
					getID('driverInfo').innerText = '('+data['vehicle']['driverName']+' '+data['vehicle']['driverTel']+')';
					
					
				}
				if(typeof(data['pointSeq']) != 'undefined') {
					eventRemoveClass($(".type_stationInfo li"), 'current');	
					var id = 'map_'+data['pointSeq'];
					getID(id).className = 'current';
				}
				if(typeof(data['connectedMap']) != 'undefined') {
					for(key in data['connectedMap']) {
						var connectedData = {};
						if(data['connectedMap'][key] == true) {
							connectedData['name'] = key;
							connectedData['code'] = 'gray';
							connection(connectedData)
						}
					}
				}
//				if(typeof(data['connectedCheck']) != 'undefined' && data['connectedCheck'] == true) {
//					var connectedData = {};
//					connectedData['code'] = 'gray';
//					connection(connectedData)
//				}
//				else {
//					eventRemoveClass($(".type_stationInfo li"), 'current');	
//				}
			} else {
				alert(response.data.desc);
			}
		}).catch(function(error) {
	    	Log.d('btnDelete() -> error=', error);
	    });
	}
	
	function defulatInit() {
		getID('lat').textContent ='0';
		getID('lng').textContent ='0';
		getID('ele').textContent ='0';
		obChart.updateDateFull(chart_speed, 0);
		getID('busModeStatus').textContent = '대기중';
		batteryGraph.update('car1_battey',0);
		batteryGraph.update('car1_hydrogen',0);
		obChart.update(chart1, 0);
		obChart.update(chart2, 0);
		obChart.update(chart3, 0);
		getID('absWarning').className = "";
		getID('batteryWarning').className = "";
		getID('breakWarning').className = "";
		getID('tpmsWarning').className = "";
		getID('distanceToEmpty').textContent = '0km';
		getID('timeStr').textContent = '00:00:00';
		getID('moveDistance').textContent  = '0km';
		getID('co2').textContent = '0ppm';
		getID('vhc_dsbm_loadtxtId').textContent ='';
		getID('vhc_dsbm_id').textContent ='';
		getID('verifyGroupTitle').textContent ='대기중';
		eventRemoveClass($(".type_stationInfo li"), 'current');	
		clearTimeout(trafficInterval);
		var trafficLights = $("#trafficLightsId span");
		clearTrafficLight(trafficLights);
	}
	
	function connection(data) {
		
		if(data.code == 'gray') {
    		getID('busConneted').style.display ='block';
    		getID('busStatusTxt').style.display ='none';
    	}
    	else {
    		getID('busConneted').style.display ='none';
    		getID('busStatusTxt').style.display ='block';
    	}
		
	}
	
	
	function initData(data) {
		pvdName = getID('vehicleSelect').options[getID('vehicleSelect').selectedIndex].value;
        var cmd = data['cmd'];
        if(cmd == 'distance' && data['name'] == pvdName) {
        	setDistance(data)
        }
        else if(cmd == 'speedOnly' && data['name'] == pvdName) {
        	setSpeedZero(data);
        }
        else if(cmd =='DOWN'&& data['pvdName'] == pvdName) {
        	setMiniMapDownMode();
        }
        else if(cmd =='question'&& data['pvdName'] == pvdName) {
        	setQuestion(data);
        }
        else if(cmd == 'distanceWarning' || cmd == 'arrivalWarning') {
        	var mainDashClass = getID('mainDisplayDiv').className;
        	if(mainDashClass.indexOf('front_collision') == -1) {
        		getID('mainDisplayDiv').className = mainDashClass+'front_collision';
        	}
        	var mainCarClass = getID('mainCar').className;
        	if(mainCarClass.indexOf('main_vhc_back') == -1) {
        		getID('mainCar').className = 'main_vhc_back';
        	}
        	getID('warningTitle').textContent = '후방 추돌위험';
        	getID('warningContent').textContent = data['result'];
        }
        else if(cmd == 'distanceNormal' || cmd == 'arrivalNormal') {
        	var mainDashClass = getID('mainDisplayDiv').className;
        	if(mainDashClass.indexOf('front_collision') > -1) {
        		getID('mainDisplayDiv').className = mainDashClass.replace('front_collision','');
        	}
        	var mainCarClass = getID('mainCar').className;
        	if(mainCarClass.indexOf('main_vhc_back') > -1) {
        		getID('mainCar').className = 'main_vhc';
        	}
        	getID('warningTitle').textContent = '';
        	getID('warningContent').textContent = '';
        }
        else if(cmd == 'updateHeader') {
			accumulateDistanceStautUpdate();
		}
        else if(cmd == 'nextGroup' && data['vehicleName'] == pvdName) {
        	getID('verifySpeedLimit').textContent =data['speedLimit'];
        	getID('verifyGroupTitle').textContent = data['title'];
        	var groupCode = data['verifyGroupCode'];
        	var initBrtCodeArr = ['#001', '#002', '#003', '#004', '#005', '#006', '#007'];
        	if(initBrtCodeArr.indexOf(groupCode) > -1) {
        		getID('brtInit').style.display = 'block';
        	}
        	else {
        		getID('brtInit').style.display = 'none';
        	}
        }
        else if(cmd == 'end' && data['name'] == pvdName) {
        	defulatInit();
        }
        else if(cmd == 'connection' && data['name'] == pvdName) {
        	connection(data);
        }
        else if(cmd == 'rsuOn') {
        	var name = data['name'];
        	if(typeof(rsuSwichJson[name])!= 'undefined' && rsuSwichJson[name]['tf']) return;
        	if(typeof(rsuSwichJson[name])== 'undefined') rsuSwichJson[name] = {};
        	rsuSwichJson[name]['tf'] = true;
        	rsuSwichJson[name]['data'] = data;
        }
        else if(cmd == 'rsuOff') {
        	var name = data['name'];
        	if(typeof(rsuSwichJson[name])!= 'undefined' && !rsuSwichJson[name]['tf']) return;
        	var trafficLights = $("#trafficLightsId span");
        	clearTrafficLight(trafficLights);
        	ligthStop();
        	rsuSwichJson[name] = {};
        	rsuSwichJson[name]['tf'] = false;
        	rsuSwichJson[name]['data'] = null;
        }
	}
	
	function setSpeedZero(data) {
		if(typeof(data['speed']) != 'undefined') {
			obChart.updateDateFull(chart_speed, 0);
		}
	}
	
	function setDistance(data) {
		var total = 0;
		if(typeof(data['amTotal']) != 'undefined' ) {
			total += data['amTotal'];
		}
		if(typeof(data['mmTotal']) != 'undefined' ) {
			total += data['mmTotal'];
		}
		if(typeof(data['lat']) != 'undefined') {
			getID('lat').textContent  = data['lat'];
		}
		if(typeof(data['lng']) != 'undefined') {
			getID('lng').textContent  = data['lng'];
		}
		if(typeof(data['ele']) != 'undefined') {
			getID('ele').textContent  = data['ele'];
		}
		if(typeof(data['speed']) != 'undefined') {
			var speed = parseInt(data['speed'] *0.02 *3.6, 10);
			obChart.updateDateFull(chart_speed, speed);
		}
		if(typeof(data['lane']) != 'undefined' && data['lane'] != 0) {
			getID('vhc_dsbm_loadtxtId').textContent  = data['lane']+'차선 주행 중';
		}
		if(typeof(data['drivigMode']) != 'undefined') {
			if(data['drivigMode'] == 1) {
				getID('busModeStatus').textContent = '자율주행중';
			}
			else if(data['drivigMode'] == 2) {
				getID('busModeStatus').textContent = '수동주행중';
			}
		}
		
		if(typeof(data['soc']) != 'undefined') {
			
			batteryGraph.update('car1_battey',data['soc']);
		}
		if(typeof(data['h2']) != 'undefined') {
			
			batteryGraph.update('car1_hydrogen',data['h2']);
		}
		if(typeof(data['coolantTemp']) != 'undefined') {
			obChart.update(chart1, data['coolantTemp']);
		}
		if(typeof(data['engineTemp']) != 'undefined') {
			obChart.update(chart2, data['engineTemp']);
		}
		if(typeof(data['batteryTemp']) != 'undefined') {
			obChart.update(chart3, data['batteryTemp']);
		}
		if(typeof(data['absWarning']) != 'undefined') {
			if(data['absWarning']) {
				getID('absWarning').className = "vhc_dsbm_ico_abs";
			}
			else {
				getID('absWarning').className = "";
			}
		}
		if(typeof(data['breakWarning']) != 'undefined') {
			if(data['breakWarning']) {
				getID('breakWarning').className = "vhc_dsbm_ico_break";
			}
			else {
				getID('breakWarning').className = "";
			}
		}
		if(typeof(data['batteryWarning']) != 'undefined') {
			if(data['batteryWarning']) {
				getID('batteryWarning').className = "vhc_dsbm_ico_battery";
			}
			else {
				getID('batteryWarning').className = "";
			}
		}
		
		if(typeof(data['tpmsWarning']) != 'undefined') {
			if(data['tpmsWarning']) {
				getID('tpmsWarning').className = "vhc_dsbm_ico_tire";
			}
			else {
				getID('tpmsWarning').className = "";
			}
		}
		if(typeof(data['distanceToEmpty']) != 'undefined') {
			getID('distanceToEmpty').textContent = data['distanceToEmpty']+'km';
		}
		
		if(typeof(data['timeStr']) != 'undefined') {
			getID('timeStr').textContent = data['timeStr'];
		}
		if(typeof(data['posAccuracy']) != 'undefined') {
			getID('posAccuracy').textContent = data['posAccuracy'];
		}
		if(typeof(data['heading']) != 'undefined') {
			busDirection(data['heading'])
			getID('heading').textContent = data['heading'];
		}
		getID('moveDistance').textContent  = (total.toFixed(2))+'km';
		getID('co2').textContent = ((total * co2).toFixed(2))+'ppm';
	}
	
	function setMiniMapDownMode() {
		getID('postionMapUp').style.display = 'none';
		getID('postionMapDown').style.display = 'block';
		
	}
	
	function setMiniMapUpMode() {
		getID('postionMapUp').style.display = 'block';
		getID('postionMapDown').style.display = 'none';
	}
	
	function setQuestion(data) {
		console.log('setQuestion() ->', data);
		if(data['detailMapCheck']) {
			eventRemoveClass($(".type_stationInfo li"), 'current');	
			var id = 'map_'+data['verifySeq'];
			getID(id).className = 'current';
		}
		if(typeof(data['monitoringText']) != 'undefined') {
			getID('vhc_dsbm_id').textContent = data['monitoringText'];
		}
		var verifyClassName = "vhcmb_cctv_inner "+data['verifyIcon'];
		getID('verifyIcon').className = verifyClassName
	}
	