	var todayDistanceCnt = 0;	// 금일주행거리
	var todayPerform = 0;		// 금일검증수행류
	var tcSpeedCnt = 0;			// 검증결과 - 속도
	var tcDistance = 0;			// 검증결과 - 이동거리
	var tcVrfctRsltCnt = 0;		// 검증결과 순서
	
	var curPage = 1; //검증 이력 페이지 번호
	var curMaxPage = 0; //최대 페이지 번호

	// 전체검증현황 이벤트 호출
	function startInitVrfctEvent(){
		setInterval(function (){
			setTargetPercent();
			setTodayDistance();
			setTodayPerform();
		}, 1000);
		
	}
	
	// 목표 달성률 갱신
	function setTargetPercent(){
		$("#target_percent").html((Math.round((opener.accumulateDistanceCnt / 3000*100*10))/10) + "<i>%</i>");
	}
	
	// 금일주행거리 갱신
	function setTodayDistance(){
		// 금일주행거리 셋팅
		$("#today_distance").html((todayDistanceCnt++) + "<i>km</i>");
		
		// 금일 주행거리 초기화
		if(todayDistanceCnt == 120){
			todayDistanceCnt = 0;
		}
	}
	
	// 금일 검증 수행률 갱신
	function setTodayPerform(){
		// 금일주행거리 셋팅
		$("#today_perform").html((todayPerform++) + "<i>%</i>");
		
		// 금일 검증수행률 초기화
		if(todayPerform == 100){
			todayPerform = 0;
		}
	}
	
	// 테스트케이스 검증결과 실행 이벤트
	function startTCEvent(){
		// 수행중 문구로 변경
 		$("#vhc_vrfct_tcResult").text("수행중");
 		eventAddClass($('#vhc_vrfct_tcResult'), "ing");
		
		var eventTcObj =  setInterval(function (){
							if(tcVrfctRsltCnt < 3){
								setTCSpeed();
								setTCDitance();
								setTcVrfctRsltCnt();
							}else{
								clearInterval(eventTcObj);
							}
							
		tcVrfctRsltCnt++;
		}, 1000);
	}
	
	// 검증결과 클릭이벤트 - 속도 갱신
	function setTCSpeed(){
		$("#vhc_vrfct_speed").html('<i></i>' + arrayTCSpeed[tcSpeedCnt] + 'km/h');
		tcSpeedCnt++;
	}
	
	// 검증결과 클릭이벤트 - 이동거리 갱신
	function setTCDitance(){
		$("#vhc_vrfct_distance").html('<i></i>' + arrayTCDistance[tcDistance] + 'km');
		tcDistance++;
	}
	
	// 검증 결과 셋팅
	function setTcVrfctRsltCnt(){
		if(tcVrfctRsltCnt == 0){			// 드라이버, 도로, 교통규제
			$("#tcDetail_result1").text("운전석 대기(AM)");
			$("#tcDetail_result2").text("예양 교차로");
			$("#tcDetail_result4").text("속도제한(50)"); 
		}else if(tcVrfctRsltCnt == 1){		// 신호등, 장애물
			$("#tcDetail_result3").html('<img src="images/img_tc_trafficlight1.png">'); // <img
																						// src="images/img_tc_trafficlight1.png">
			$("#tcDetail_result5").text("횡단보도");
		}else if(tcVrfctRsltCnt == 2){		// 신호등
			// pass 버튼
			eventRemoveClass($('#vhc_vrfct_tcResult'), "ing");
			eventAddClass($('#vhc_vrfct_tcResult'), 'pass');
			$('#vhc_vrfct_tcResult').text('PASS');
		}
	}
	
	// 검증 결과 초기화
	function initTCEventParam(){
		tcSpeedCnt = 0;
		tcDistance = 0;
		tcVrfctRsltCnt = 0;
		
		$("#tcDetail_result1").text("");
		$("#tcDetail_result2").text("");
		$("#tcDetail_result3").html("");
		$("#tcDetail_result4").text(""); 
		$("#tcDetail_result5").text("");
	}
	
	
	// eaton
	
	var verifyObejct ={};
	var distanceObject ={};
	var verifySeqCheck = {};
	var setting = {};
	var timer = {};
	var qcSeqCheck = {};
	
	function deleteSetting(json) {
		var name = json['name'];
		var idx = name + '_';
		delete setting[idx];
	}
	
	function repeatVerify(json) {
		
		var name = json['name'];
		var idx = name + '_';
		clearTimeout(timer[idx]);
		axios.post( '/verify/ajaxList' )
		.then( function (response) {
			if ( response.data.length > 0 ) {
				var verifyArr = [];
				for(var i=0; i < response.data.length; i++) {
					verifyArr.push(response.data[i]);
				}
				verifyObejct[idx] = verifyArr;
				initVerify(idx);
//				popupId = null;
//				popup.close($('#popup_verification_histroy')); return false;
			}
		})
	    .catch( function (error) {
	    	 Log.d('verify() -> error=', error);
	    });
		
	}
	
	function userEvent(data) {
		
		var name = data['pvdName'];
		var idx = name+'_';
		verifySeqCheck[idx] = 998; 
		getID(idx+'verifyGroupCode').innerText = '#998';
		getID(idx+'verifyGroupCode').setAttribute("groupCode", data['verifyGroupSeq']);
		getID(idx+'verifyGroupCode').innerText = 'USER EVENT';
		getID(idx+'titleName').innerText = '사용자 이벤트';
		getID(idx+'detailName').innerText = '- '+data['detailName'];
		getID(idx+'questionName').innerText = data['questionName'];
		getID(idx+'pvdResult').innerText = "-";
		getID(idx+'pvdResult').className  = "";
		getID(idx+'userResult').innerText = "-";
		getID(idx+'userResult').className  = "";
		getID(idx+'result').innerText = "-";
		getID(idx+'result').className  = "";
		var verifyClassName = "dubleSpan question_name "+data['verifyIcon'];
		getID(idx+'verifyIcon').className = verifyClassName
		
		
	}

	function mrmVerify(data) {
		
		var name = data['pvdName'];
		var idx = name+'_';
		verifySeqCheck[idx] = 999; 
		getID(idx+'verifyGroupCode').innerText = '#999';
		getID(idx+'verifyGroupCode').setAttribute("groupCode", data['verifyGroupSeq']);
		getID(idx+'verifyGroupCode').innerText = 'mrm 발생';
		getID(idx+'titleName').innerText = data['titleName'];
		getID(idx+'detailName').innerText = '- '+data['detailName'];
		getID(idx+'questionName').innerText = data['questionName'];
		
		
		waitVerify(idx);
	}
	
	function mrmResult(data) {
		var name = data['pvdName'];
		var idx = name+'_';
		verifySeqCheck[idx] = 999;
		getID(idx+'verifyGroupCode').innerText = '#999';
		getID(idx+'verifyGroupCode').setAttribute("groupCode", data['verifyGroupSeq']);
		getID(idx+'verifyGroupCode').innerText = 'mrm 발생';
		getID(idx+'titleName').innerText = data['titleName'];
		getID(idx+'detailName').innerText = '- '+data['detailName'];
		getID(idx+'questionName').innerText = data['questionName'];
		
		if(data['pvdResult']) {
			getID(idx+'pvdResult').innerText = "PASS";
			getID(idx+'pvdResult').className  = "pass";
		}
		else {
			getID(idx+'pvdResult').innerText = 'FAIL';
			getID(idx+'pvdResult').className  = "fail";
		}
	}

	function initVerify(idx) {
		
		var verifyGroup = verifyObejct[idx][0];
		var verifyArr = verifyGroup['verify'];
		var verify = verifyGroup['verify'][0];
		getID(idx+'verifyGroupCode').setAttribute("groupCode", verifyGroup['verifyGroupSeq']);
		getID(idx+'verifyGroupCode').innerText = verifyGroup['verifyGroupCode'];
		getID(idx+'titleName').innerText = verify['titleName'];
		getID(idx+'detailName').innerText = '- '+verify['detailName'];
		getID(idx+'questionName').innerText = verify['questionName'];
		var verifyClassName = "dubleSpan question_name "+verify['verifyIcon'];
		getID(idx+'verifyIcon').className = verifyClassName
		if(verify['active']) {
			waitVerify(idx);
		}
		else {
			noneVerify(idx);
		}
	}
	
	function endVerify(idx) {
		
		getID(idx+'verifyGroupCode').removeAttribute("groupCode");
		getID(idx+'drivigMode').innerText = '대기중';
		getID(idx+'verifyGroupCode').innerText = '-';
		getID(idx+'titleName').innerText = '-';
		getID(idx+'detailName').innerText = '-';
		getID(idx+'questionName').innerText = '-';
		var verifyClassName = "dubleSpan question_name";
		getID(idx+'verifyIcon').className = verifyClassName;
		initVerifyConnneted(idx);
	}
	
	
	
	function getVerifyGroupSeq(data) {
		
		var groupSeq = data['verifyGroupSeq'];
		var idx = data['pvdName']+'_';
		var groupVerify = verifyObejct[idx];
		if(typeof(groupVerify) == "undefined") return;
		for(var i=0; i < groupVerify.length; i++) {
			if(groupVerify[i]['verifyGroupSeq'] == groupSeq) {
				return i;
			}
		}
	}
	
	
	function setDrivingMode(idx, mode) {
		if(mode == 1) {
			getID(idx+'drivigMode').innerText = '자율 주행중';
		}
		else if(mode == 2) {
			getID(idx+'drivigMode').innerText = '수동 주행중';
		}
		else if(mode == 3) { 
			getID(idx+'drivigMode').innerText = 'MRM 발생';
		}
	}

	
	function updateResult(idx, verify) {
		
		if(setting[idx]['isEnableTester']) {
			
			if(verify['pvdResult'] == verify['userResult'] && (typeof(verify['pvdResult']) != "undefined" || typeof(verify['userResult']) != "undefined")) {
				getID(idx+'result').innerText = '검증완료';
				getID(idx+'result').className  = "pass";
			}
			else {
				getID(idx+'result').innerText = '대기';
				getID(idx+'result').className  = "ing";
			}
			
		}
		else {
			if(typeof(verify['pvdResult']) != "undefined") {
				getID(idx+'result').innerText = '완료';
				getID(idx+'result').className  = "pass";
				
			}
			else {
				getID(idx+'result').innerText = '대기';
				getID(idx+'result').className  = "ing";
			}
			getID(idx+'userResult').innerText = '미검증';
			getID(idx+'userResult').className = "";
			
		}
		
		
	}
	
	function nextVerify(data) {
		var idx = data['pvdName']+'_';
		var groupIndex = getVerifyGroupSeq(data);
		var verifyGroup = verifyObejct[idx][groupIndex];
		var verifyArr = verifyGroup['verify'];
		
		for(var i=0; i<verifyArr.length; i++) {
			
			if(data['verifySeq'] == verifyArr[i]['verifySeq']) {
				if(i >= verifyArr.length-1) return;
				var verify = verifyArr[i+1];
				if(verifySeqCheck[idx] == verify['verifySeq']) return;
				verify['pvdName'] = data['pvdName'];
				timer[idx] = setTimeout(() => nextVerifyQuestion(verify), 5000);
				return;
			}
		}
	}
	
	function nextGroupVerify(data) {
		if((data['verifyResult'].length == 0) || typeof(data['verifyResult'])=="undefined" ) return;
		
		var verify = data['verifyResult'][0];
		var name = data['vehicleName'];
		var idx = name+'_';
		verify['pvdName'] = name;
		nextVerifyQuestion(verify);
		verifySeqCheck[idx] = data['verifySeq'];
		if(popupId != idx) return;
		updateGroupMiniMap(data['verifyGroupSeq']);
		initVerifyDetailList(idx, data['verifyResult'], data['title']);
	}

	function questionUpdate(data) {
		var idx = data['pvdName']+'_';
		var groupSeq = getVerifyGroupSeq(data);
		
		
		var verifyGroup = verifyObejct[idx][groupSeq];
		getID(idx+'verifyGroupCode').setAttribute("groupCode", verifyGroup['verifyGroupSeq']);
		getID(idx+'verifyGroupCode').innerText = verifyGroup['verifyGroupCode'];
		getID(idx+'titleName').innerText = data['titleName'];
		getID(idx+'detailName').innerText = '- '+ data['detailName'];
		getID(idx+'questionName').innerText = data['questionName'];
		var verifyClassName = "dubleSpan question_name "+data['verifyIcon'];
		getID(idx+'verifyIcon').className = verifyClassName
	}
	
	function nextVerifyQuestion(data) {
		var idx = data['pvdName']+'_';
		if(verifySeqCheck[idx] >= data['verifySeq']) return;
		questionUpdate(data);
		verifySeqCheck[idx] = data['verifySeq'];
		if(data['active']) {
			waitVerify(idx);
		}
		else {
			noneVerify(idx);
			
		}
//		
	}
	
	
	function updateVerifyResultInfo(id, result) {
		
		if(getID(id) == null) return;
		
		if(typeof(result) == "undefined") {
			getID(id).innerText = "수행중";
			getID(id).className  = "ing";
		}
		else if(result) {
			getID(id).innerText = "PASS";
			getID(id).className = "pass";
		}
		else {
			getID(id).innerText = "FAIL";
			getID(id).className = "fail";
		}
	}
	
	function initInfo(data) {
		var idx = data['pvdName']+'_';
		
	}
	
	function updateVerifyResult(data) {
		var idx = data['pvdName']+'_';
		if(idx == 'undefined_') idx = data['name']+'_';
		
		getID(idx+'verifyGroupCode').setAttribute("groupCode",data['verifyGroupSeq']);
		
		if(data['cmd'] == 'pvdVerify') {
			
			if(verifySeqCheck[idx] != data['verifySeq']) {
				questionUpdate(data); 
				verifySeqCheck[idx] = data['verifySeq'];
				if(data['active']) {
					updateVerifyResultInfo(idx+'pvdResult', data['pvdResult']);
					updateVerifyResultInfo(idx+'userResult', data['userResult']);
					updateResult(idx, data);
				}
				else {
					noneVerify(idx);
				}
				nextVerify(data);
			}
			
			if(data['active'] && popupId == idx) {
				updateDetail(data);
			}
		}
		else if(data['cmd'] == 'userVerify') {
			if(verifySeqCheck[idx] == data['verifySeq']) {
				updateVerifyResultInfo(idx+'pvdResult', data['pvdResult']);
				updateVerifyResultInfo(idx+'userResult', data['userResult']);
				updateResult(idx, data);
			}
			if(data['active'] && popupId == idx) {
				updateDetail(data);
			}
			
		}
	}
	
	function noneVerify(idx) {
		getID(idx+'pvdResult').innerText = '미검증';
		getID(idx+'pvdResult').className = "";
		getID(idx+'userResult').innerText = "미검증";
		getID(idx+'userResult').className  = "";
		getID(idx+'result').innerText = '미검증';
		getID(idx+'result').className = "";
	}
	
	function waitVerify(idx) {
		getID(idx+'result').innerText = '대기';
		getID(idx+'result').className  = "ing";
		
		getID(idx+'userResult').innerText = "수행중";
		getID(idx+'userResult').className  = "ing";
		
		getID(idx+'pvdResult').innerText = "수행중";
		getID(idx+'pvdResult').className  = "ing";
	}
	
	function initVerifyConnneted(idx) {
		getID(idx+'amDistance').innerText =  0;
		getID(idx+'mmDistance').innerText = 0;
		getID(idx+'totalDistance').innerText = 0;

		getID(idx+'verifyGroupCode').innerText = '-';
		getID(idx+'titleName').innerText = '-';
		getID(idx+'detailName').innerText = '-';
		getID(idx+'questionName').innerText = '대기중';
		
		getID(idx+'result').innerText = '-';
		getID(idx+'result').className  = "ing";
		
		getID(idx+'userResult').innerText = "-";
		getID(idx+'userResult').className  = "ing";
		
		getID(idx+'pvdResult').innerText = "-";
		getID(idx+'pvdResult').className  = "ing";
	}
	
	function verifySetting(data) {
		var json ={
			'isEnableTester' : 	data['isEnableTester'],
			'dayNightCode' : data['dayNightCode']
		}
		var idx = data['name']+'_';
		setting[idx] = json;
	}

	function initStatus(data) {
		var idx = data['name']+'_';
		setDrivingMode(idx, 1);
		getID(idx+'speed').innerText =0;
		getID(idx+'amDistance').innerText = 0;
		getID(idx+'mmDistance').innerText = 0;
		getID(idx+'totalDistance').innerText = 0;
	} 
	
	
	function setSpeedZero(data) {
		var idx = data['name']+'_';
		getID(idx+'speed').innerText = 0;
	}
	
	
	function connection(data) {
		var busStatusDiv = data.name+'_busStatusTxt';
		var connetedDiv = data.name+'_busConneted';
		
		if(data.code == 'gray') {
			getID(busStatusDiv).style.display ='none';
			getID(connetedDiv).style.display ='inline-block';
    	}
    	else {
    		getID(busStatusDiv).style.display ='inline-block';
    		getID(connetedDiv).style.display ='none';
    	}
		
	}


	
	function setStatus(data) {
		
		
		var idx = data['name']+'_';
		setDrivingMode(idx, data['drivigMode']);
		
		
		var ammmTotal = data['amTotal'] + data['mmTotal'];
		getID(idx+'speed').innerText = parseInt(data['speed'] *0.02 * 3.6, 10);
		getID(idx+'amDistance').innerText =  data['amTotal'].toFixed(2);
		getID(idx+'mmDistance').innerText = data['mmTotal'].toFixed(2);
		getID(idx+'totalDistance').innerText = ammmTotal.toFixed(2);
		
		
		if(data['name'] == 'bus02') {
			var total = (typeof(distanceObject['total']) != 'undefined') ? distanceObject['total'] : 0;
			var todayTotal = (typeof(distanceObject['todaytotal']) != 'undefined') ? distanceObject['todaytotal'] : 0;
			total += data['amTotal'].toFixed(2);
			todayTotal += data['amTotal'].toFixed(2);
			$("#accumulateDistanceId").html(addCommas(total.toFixed(0)) + "<i>km</i>");
			$("#today_distance").html(addCommas(todayTotal.toFixed(0)) + "<i>km</i>");
			var percent = ((todayTotal / 3000) * 100).toFixed(1);
			$("#target_percent").html(percent + "<i>%</i>");
		}
		
		
		
		if(popupId != idx) return;
		getID('popup_amDistance').innerText =  data['amTotal'].toFixed(2);
		getID('popup_mmDistance').innerText = data['mmTotal'].toFixed(2);
		getID('popup_totalDistance').innerText = ammmTotal.toFixed(2);
		
	}
	
	
	function distanceSet(distanceTotalMap) {
		if(typeof(distanceTotalMap) == 'undefined') return;
		distanceObject = distanceTotalMap;
		var total = (typeof(distanceTotalMap['total'])!='undefined')?distanceTotalMap['total'].toFixed(0):0;
		var todayTotal = (typeof(distanceTotalMap['todaytotal'])!='undefined')?distanceTotalMap['todaytotal'].toFixed(0):0;
		$("#accumulateDistanceId").html(addCommas(total) + "<i>km</i>");
		$("#today_distance").html(addCommas(todayTotal) + "<i>km</i>");
		var percent = ((todayTotal / 3000) *100).toFixed(2);
		$("#target_percent").html(percent + "<i>%</i>");
		$("#today_perform").html(distanceTotalMap['todayrepeat'] + "<i>차</i>");
		
	}
	
	function testSettingHeader(data) {
		var dayNight = data['dayNightCode'];
		var tester = data['isEnableTester'];
		if(dayNight == 'DAY') {
			getID('testWeather').className = 'hdSpot_weather day';
			getID('testWeather').innerText = '낮 (Day)';
		}
		else {
			getID('testWeather').className = 'hdSpot_weather night';
			getID('testWeather').innerText = '밤 (Night)';
		}
		
		if(tester) {
			getID('testTester').innerText = '(BUS & QC)';
		}	
		else {
			getID('testTester').innerText = '(BUS)';
		}
		getID('scenarioName').innerText = data['scenarioName'];
	} 
	
	function init() {
		var params = new URLSearchParams();
		params.append( 'curPage', curPage);
		axios.post( '/verify/init' )
		.then( function (response) {
			if(Object.keys(response.data).length > 0) {
				var data = response.data;
				var settingObject = data['settingMap'];
				var nowObject = data['nowData'];
				var vehicleList = data['vehicleList'];
				var verifyGrouplist = data['verifyGrouplist'];
				var verifyReplayList = data['verifyReplayList'];
				var distanceTotalMap = data['distanceTotalMap'];
				var testSetting = data['testSetting'];
				testSettingHeader(testSetting);
				distanceSet(distanceTotalMap);
				for(var i=0; i<vehicleList.length; i++) {
					var verifyArr = [];
					for(var j=0; j < verifyGrouplist.length; j++) {
						verifyArr.push(verifyGrouplist[j]);
					}
					var idx = vehicleList[i]['name']+'_';
					verifyObejct[idx] = verifyArr;
					var objOption = document.createElement("option");       
				    objOption.text = vehicleList[i]['anotherName'];
				    objOption.value = vehicleList[i]['vehicleSeq'];
				    getID('replayVehicleSelect').options.add(objOption);
				}
				for (var key in settingObject) {
					settingObject['name'] = key;
					verifySetting(settingObject[key]);
					var json = nowObject[key];
					if(typeof(nowObject[key]) =='undefined') {
						var idx = key+'_';
//						delete setting[idx];
						initVerifyConnneted(idx);
					}
					else {
						json['pvdName'] = key;
						updateVerifyResult(json);
						questionUpdate(json);
						var idx = key+'_';
						if(json['active']) {
							updateVerifyResultInfo(idx+'pvdResult', json['pvdResult']);
							updateVerifyResultInfo(idx+'userResult', json['userResult']);
							updateResult(idx, json);
						}
						else {
							noneVerify(idx);
						}
					}
				}
//				var replayTotalCnt = verifyReplayList[0]['totalCnt'];
//				curMaxPage = Math.ceil(replayTotalCnt/10);
				var tr = "";
				for(var i=0; i<verifyReplayList.length; i++) {
					tr += "<tr>"
					   +"	<td>"+verifyReplayList[i]['vehicleName']+"</td>"	
					   +"	<td>"+verifyReplayList[i]['date']+"</td>"	
					   +"	<td>"+verifyReplayList[i]['repeat']+"</td>"	
					   +"	<td><button onclick='replayPopupDetail("+verifyReplayList[i]['vehicleSeq']+","+verifyReplayList[i]['repeat']+", \""+verifyReplayList[i]['vehicleName']+"\")'>Replay</button></td>"	
					   + "</tr>";
				}
				getID('replayVerify').innerHTML = tr;
//				curPage++;
				
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
			}
		})
	    .catch( function (error) {
	    	 Log.d('verify() -> error=', error);
	    });
		
	}
	
	function removeDivChild(id) {
		var node  = document.getElementById(id); 
		while (node.hasChildNodes()) {
			node.removeChild(node.lastChild);
		}
	}

	function getInnerHeight( elm ){
		var computed = getComputedStyle(elm),
		padding = parseInt(computed.paddingTop) + parseInt(computed.paddingBottom);
		return elm.clientHeight - padding
	}
	
	
	var updateReplayVerifyTop1 = function() {
		var params = new URLSearchParams();
		params.append( 'curPage', 1);
		axios.post( '/verify/verifyreplaylist', params)
		.then( function (response) {
			if(Object.keys(response.data).length > 0) {
				var verifyReplayList = response.data;
//				var replayTotalCnt = verifyReplayList[0]['totalCnt'];
//				curMaxPage = Math.ceil(replayTotalCnt/10);
				var tr = "";
				tr += "<tr>"
				   +"	<td>"+verifyReplayList[0]['vehicleName']+"</td>"	
				   +"	<td>"+verifyReplayList[0]['date']+"</td>"	
				   +"	<td>"+verifyReplayList[0]['repeat']+"</td>"	
				   +"	<td><button onclick='replayPopupDetail("+verifyReplayList[0]['vehicleSeq']+","+verifyReplayList[0]['repeat']+", \""+verifyReplayList[0]['vehicleName']+"\")'>Replay</button></td>"	
				   + "</tr>";
				getID('replayVerify').insertAdjacentHTML('afterbegin', tr);
			}
		})
	    .catch( function (error) {
	    	 Log.d('updateReplayVerify() -> error=', error);
	    });
	}
	
	
	
	
	
	var updateReplayVerify = function() {
		if(curMaxPage < curPage) return;
		var params = new URLSearchParams();
		params.append( 'curPage', curPage);
//		
		axios.post( '/verify/verifyreplaylist', params)
		.then( function (response) {
			if(Object.keys(response.data).length > 0) {
				var verifyReplayList = response.data;
				var replayTotalCnt = verifyReplayList[0]['totalCnt'];
				curMaxPage = Math.ceil(replayTotalCnt/10);
				var tr = "";
				for(var i=0; i<verifyReplayList.length; i++) {
					tr += "<tr>"
					   +"	<td>"+verifyReplayList[i]['vehicleName']+"</td>"	
					   +"	<td>"+verifyReplayList[i]['date']+"</td>"	
					   +"	<td>"+verifyReplayList[i]['repeat']+"</td>"	
					   +"	<td><button onclick='replayPopupDetail("+verifyReplayList[i]['vehicleSeq']+","+verifyReplayList[i]['repeat']+", \""+verifyReplayList[i]['vehicleName']+"\")'>Replay</button></td>"	
					   + "</tr>";
				}
				getID('replayVerify').insertAdjacentHTML('beforeend', tr);
//				curPage++;
			}
		})
	    .catch( function (error) {
	    	 Log.d('updateReplayVerify() -> error=', error);
	    });
		
	}
	
	getID('replayVerify').addEventListener('scroll', () => {
		var ele = getID('replayVerify');
		let scrollLocation = ele.scrollTop; // 현재 스크롤바 위치
		let windowHeight = getInnerHeight(ele); // 스크린 창
		let fullHeight = ele.scrollHeight; //  margin 값은 포함 x
		if(scrollLocation + windowHeight >= fullHeight){
			updateReplayVerify();
		}
	})
	
	
	
	var selectReplaySeq = function() {
		
		var pvdName = getID('replayVehicleSelect').options[getID('replayVehicleSelect').selectedIndex].value;
		pvdName = (pvdName == "")? null : pvdName;
		var params = new URLSearchParams();
		params.append( 'curPage', curPage);
		params.append( 'vehicleSeq', pvdName);
		axios.post( '/verify/verifyreplaylist', params)
		.then( function (response) {
			var tr = "";
			if(Object.keys(response.data).length > 0) {
				var verifyReplayList = response.data;
				for(var i=0; i<verifyReplayList.length; i++) {
					tr += "<tr>"
					   +"	<td>"+verifyReplayList[i]['vehicleName']+"</td>"	
					   +"	<td>"+verifyReplayList[i]['date']+"</td>"	
					   +"	<td>"+verifyReplayList[i]['repeat']+"</td>"	
					   +"	<td><button onclick='replayPopupDetail("+verifyReplayList[i]['vehicleSeq']+","+verifyReplayList[i]['repeat']+", \""+verifyReplayList[i]['vehicleName']+"\")'>Replay</button></td>"	
					   + "</tr>";
				}
			}
			getID('replayVerify').innerHTML = tr;
		})
	    .catch( function (error) {
	    	 Log.d('selectReplaySeq() -> error=', error);
	    });
	}
	
	
	
	
	
	/**
	 * 
	 * popup menu
	 * 
	 * */
	
	var popupId = null;
	var replayObject = {};
	
	function repalyPreviousVerify() {
		replayStop();
		if(0 >= replayObject['index']) {
			if(1 >= replayObject['groupSeq'])return;
			replayObject['groupSeq'] = replayObject['groupSeq']-1;
			callReplayGroup('pre');
		} 
		else {
			replayObject['index'] = replayObject['index']-1;
			getID('detail_verify').removeChild(getID('detail_verify').lastChild);
			var data = replayObject['data'];
			var verify = data['verifyResult'][replayObject['index']];
			var verifySeq = (verify['verifySeq'] == 999) ? verify['verifyResultSeq'] : verify['verifySeq'];
            var pointerId = popupId+"pointer_"+verifySeq;
            checkingPointer(pointerId);
		}
	}
	
	function repalyNextVerify() {
		replayStop();
		if(replayObject['data']['verifyResult'].length <= replayObject['index']+1) {
			
			replayObject['groupSeq'] += 1;
			callReplayGroup('next');
		} 
		else {
			replayObject['index'] = replayObject['index']+1;
			var data = replayObject['data'];
			var idx = data['vehicleName']+'_';
			var groupCode = data['verifyGroupSeq'];
			var verify = data['verifyResult'][replayObject['index']];
			var verifySeq = (verify['verifySeq'] == 999) ? verify['verifyResultSeq'] : verify['verifySeq'];
            var pointerId = popupId+"pointer_"+verifySeq;
			initVerifyDetail(idx);
			initGroupMinuMap(groupCode);
//			updateGroupMiniMap(groupCode);
			initVerifyDetailOne(idx, data['verifyResult'][replayObject['index']],replayObject['index'], data['title'], pointerId);
		}
	}
	
	function replayStart() {
		if(replayObject['startTimer'] != null) return;
		replayTimer();
	}
	
	function replayStop() {
		clearTimeout(replayObject['startTimer']);
		replayObject['startTimer'] = null;
	}
	
	function replayTimer() {
		replayObject['startTimer'] = setTimeout(function () {
			repalyNextVerify();
			replayTimer();
		},1000);
	}
	
	function callReplayGroup(cmd) {
		
		var params = new URLSearchParams();
		params.append('nameSeq', replayObject['nameSeq'] );	    
		params.append('repeat', replayObject['repeat']);
		params.append('groupSeq', replayObject['groupSeq']);
		axios.post( '/verify/replay/groupresult' ,params)
		.then( function (response) {
			var result = response.data;
			if(typeof(result['verifyGroupResultVO']) == "undefined") {
				clearTimeout(replayObject['startTimer']);
				replayObject['groupSeq'] = replayObject['groupSeq']-1;
				alert('마지막 구간 입니다.');
				return;
			}
			if(response.data.length>0 || Object.keys(response.data).length > 0) {
				var data = result['verifyGroupResultVO'];
				replayObject['data'] = data;
				var idx = data['vehicleName']+'_';
				setting[idx] = result['testSetting'];
				var groupCode = data['verifyGroupSeq'];
				replayObject['index'] = 0;
				popupId = idx;
				getID('dayNightState').innerText = (setting[idx]['dayNightCode'] == 'DAY'?'주간':'야간');
				getID('enableTester').innerText = (setting[idx]['isEnableTester'] ? '탑승':'미탑승');
				getID('enableTesterIcon').className = (setting[idx]['isEnableTester'] ? 'vrfct_ht_setting_box_enable_tester_icon':'vrfct_ht_setting_box_unenable_tester_icon');
				initVerifyDetail(idx);
				initGroupMinuMap(groupCode);
				updateGroupMiniMap(groupCode, 'replay');
				if(data['verifyResult'].length <= 0) {
					removeDivChild('detail_verify');
					return;
				}
				
				if(cmd == 'next') {
					var verify = data['verifyResult'][replayObject['index']];
					var verifySeq = (verify['verifySeq'] == 999) ? verify['verifyResultSeq'] : verify['verifySeq'];
	                var pointerId = popupId+"pointer_"+verifySeq;
					initVerifyDetailOne(idx, verify, replayObject['index'], data['title'], pointerId);
				}
				else {
					replayObject['index'] = data['verifyResult'].length-1;
					var verify = data['verifyResult'][replayObject['index']];
					var verifySeq = (verify['verifySeq'] == 999) ? verify['verifyResultSeq'] : verify['verifySeq'];
					var pointerId = popupId+"pointer_"+verifySeq;
					initVerifyDetailList(idx, data['verifyResult'], data['title'], pointerId,'replay');
				}
				popup.open($('#popup_verification_histroy')); 
			}
		})
	    .catch( function (error) {
	    	 Log.d('verify() -> error=', error);
	    });
	}
	
	function replayPopupDetail(nameSeq, repeat, vehicleName) {
		replayObject['nameSeq'] = nameSeq;
		replayObject['index'] = 0;
		replayObject['groupSeq'] = 1;
		replayObject['repeat'] = repeat;
		getID('popupDetailName').innerText = "검증 시나리오 Replay";
		getID('replayOnly').style.display ='block';
		callReplayGroup('next');
		
		
		var params = new URLSearchParams();
		params.append('vehicleName', vehicleName );	    
		params.append('repeat', repeat);
		axios.post( '/verify/replay/distance', params)
		.then( function (response) {
			var result = response.data;
			if(result != null) {
				getID('popup_amDistance').innerText =  result['amTotal'].toFixed(2);
				getID('popup_mmDistance').innerText = result['mmTotal'].toFixed(2);
				getID('popup_totalDistance').innerText = (result['amTotal'] + result['mmTotal']).toFixed(2);
			}
		})
	    .catch( function (error) {
	    	 Log.d('replayPopupDetail() -> error=', error);
	    });
	}
	
	
	function saveComment(verifyResultSeq) {
		
		var userComment =  getVal('userCommnet_'+verifyResultSeq);
		var params = new URLSearchParams();
		params.append('verifyResultSeq', verifyResultSeq );	    
		params.append('userComment', userComment);	
		axios.post( '/verify/replay/usercomment' ,params)
		.then( function (response) {
			if(response.data.result != 'ok') {
				alert('실패');
				return;
			}
			chageUserCommnet(verifyResultSeq);
		})
	    .catch( function (error) {
	    	 Log.d('saveComment() -> error=', error);
	    });
	}
	
	function chageUserCommnet(verifyResultSeq) {
		var userComment =  (getVal('userCommnet_'+verifyResultSeq) !=''?getVal('userCommnet_'+verifyResultSeq) :undefined);
		var verifyArr = replayObject['data']['verifyResult'];
		var targetDiv = getID('userCommnet_'+verifyResultSeq).parentNode.parentNode.firstChild.lastChild;
		for(var i=0; i<verifyArr.length; i++) {
			var verify = verifyArr[i];
			if(verify['verifyResultSeq'] == verifyResultSeq) {
				verify['userComment'] = userComment;
				targetDiv.innerHTML = setUserComentDeatil(popupId,verify);
				return;
			}
		}
	}
	
	function popupDeatail(name, pointerId) {
		var idx = name+"_";
		getID('popupDetailName').innerText = "검증 시나리오";
		getID('replayOnly').style.display ='none';
//		if(typeof(setting[idx]) == "undefined" || Object.keys(setting[idx]).length < 0) {
//			alert('현재 주행중이 아닙니다.');
//			return;
//		}
		getID('dayNightState').innerText = (setting[idx]['dayNightCode'] == 'DAY'?'주간':'야간');
		getID('enableTester').innerText = (setting[idx]['isEnableTester'] ? '탑승':'미탑승');
		getID('enableTesterIcon').className = (setting[idx]['isEnableTester'] ? 'vrfct_ht_setting_box_enable_tester_icon':'vrfct_ht_setting_box_unenable_tester_icon');
		
//		
		popupId = idx;
		var groupCode = (getID(idx+'verifyGroupCode').getAttribute("groupCode")!=null ? getID(idx+'verifyGroupCode').getAttribute("groupCode"):12);
		var params = new URLSearchParams();
		params.append('busName', name );	    
		params.append('groupCode', groupCode);	 
		axios.post( '/verify/groupresult' ,params)
			.then( function (response) {
				initVerifyDetail(idx);
				initGroupMinuMap(groupCode);
				if(response.data.length>0 || Object.keys(response.data).length > 0) {
					var data = response.data;
					initVerifyDetailList(idx, data['verifyResult'], data['title'], pointerId,'play');
				}
				else {
					var data = verifyObejct[idx][0];
					initVerifyDetailList(idx, data['verify'], data['title'], pointerId,'play');
				}
			})
		    .catch( function (error) {
		    	 Log.d('verify() -> error=', error);
		    });
		popup.open($('#popup_verification_histroy')); 
		return false;
	}
	
	function popupColse() {
		popupId = null;
		replayStop();
		popup.close($('#popup_verification_histroy')); return false;
	}
	
	function initVerifyDetail(idx) {
		removeDivChild('groupVerifyList');
		var dataArr = verifyObejct[idx];
		var linebreakCnt = 13;
		var cnt =0;
		var trArr =[];
		var tr =[];
		for(var i=1; i<= dataArr.length; i++) {
			var verifyGroupSeq = idx+dataArr[i-1]['verifyGroupSeq'];
			var className = "";
			if((cnt+1)%2 == 0) { 
				className ="cel_e";
			}
			else {
				className ="cel_o";
			}
			
			if(i == 1) {
				className ="cel_first_o";
			}
			else if(i == dataArr.length) {
				if((cnt+1)%2 == 0) { 
					className ="cel_last_e";
				}
				else {
					className ="cel_last_o";
				}
			}
			else {
				if((cnt+1)%2 == 0) { 
					if((i-1)%linebreakCnt == 0) {
						className ="cel_ing_last_e";
					}
					if(i%linebreakCnt == 0) {
						className ="cel_ing_first_e";
					}
				}
				else {
					if(i%linebreakCnt == 0) {
						className ="cel_ing_last_o";
					}
					if((i-1)%linebreakCnt == 0) {
						className ="cel_ing_first_o";
					}
				}
			}
			var td = '<td id="'+verifyGroupSeq+'"class="'+className+'">'+dataArr[i-1]['title']+'</td>';
		    tr.push(td);
			if(i%linebreakCnt == 0) {
				if((cnt+1)%2 == 0) {
					tr.reverse();
				}
				trArr[cnt]= '<tr>'+tr.join('')+'</tr>';
				cnt++;
				tr = [];
			}
		}
		getID('groupVerifyList').innerHTML = trArr.join('');
		
	}
	
	
	
	function makeResultSpan(id,result) {
		var span ="";
		if(typeof(result) == "undefined") {
			span += "<span><div id="+id+" class='ing'>수행중</div></span>";
		}
		else {
			if(result) {
				span += "<span><div  id="+id+" class='pass'>PASS</div></span>";
			}
			else {
				span += "<span><div  id="+id+" class='fail'>FAIL</div></span>";
			}
		}
		return span;
	}
	
	function setUserComentDeatil(idx, verify) {
		var div ="";
		var verifySeq = (verify['verifySeq'] == 999) ? verify['verifyResultSeq'] : verify['verifySeq'];
		var id = idx+"detail_"+verifySeq;
		var commentId = idx+"detail_"+verifySeq+'_uesrComment';
		var buttonClass="unenable_coment_down";
		if(typeof(verify['userComment']) != "undefined") {
			div += "<div class='userDetail'>상세 메모</div>";
			buttonClass = "enable_coment_down";
		}
		if(verify['verifySeq'] == 999) {
			div += "<div class='userDetail'>"+verify['detailName']+"</div>";
		}
		div += "<i class='"+buttonClass+"' onclick='toggleUserComment("+commentId+")'></i>";
		return div;
		
	}
	
	function checkActive(idx, verify) {
		
		var span ="";
		var id = idx+"detail_"+verify['verifySeq'];
		
		if(verify['titleCode'] == "userMsg") {
			span += "<span><div class=''>-</div></span>"
				 +  "<span><div class=''>-</div></span>"
				 +  "<span><div class=''>-</div></span>";
		}
		else {
			if(typeof(setting[idx]) == "undefined") {
				span += "<span><div id="+id+"_pvdResult class='ing'>수행중</div></span>";
				span += "<span><div id="+id+"_userResult class='ing'>수행중</div></span>";
				span += "<span><div id="+id+"_result class='ing'>대기</div></span>";
			}
			else if(verify['active'] ) {
				span += makeResultSpan(id+'_pvdResult',verify['pvdResult']);
				span += makeResultSpan(id+'_userResult',verify['userResult']);
				if(setting[idx]['isEnableTester']) {
					if(verify['pvdResult'] == verify['userResult'] && (typeof(verify['pvdResult']) != "undefined" || typeof(verify['userResult']) != "undefined")) {
						span += "<span><div id="+id+"_result class='pass'>검증완료</div></span>";
					}
					else {
						span += "<span><div id="+id+"_result class='ing'>대기중</div></span>";
					}
				}
				else {
					if(typeof(verify['pvdResult']) != "undefined") {
						span += "<span><div id="+id+"_result class='pass'>완료</div></span>";
					}
					else {
						span += "<span><div id="+id+"_result class='ing'>대기중</div></span>";
					}
				}
				
			}
			else {
				span += "<span><div class=''>미검증</div></span>"
					 +  "<span><div class=''>미검증</div></span>"
					 +  "<span><div class=''>미검증</div></span>";
			}
		}
		return span;
	}
	
	function toggleUserComment(id) {
		
		if(id.classList[1] == 'hideComment') {
			id.classList.remove('hideComment');
			id.classList.add('showComment');
			
			
			id.scrollIntoView(true);
		}
		else {
			id.classList.add('hideComment');
			id.classList.remove('showComment');
		}
		
	}
	
	
	function initVerifyDetailOne(idx, verify, index, title, pointerIdx) {
		
		var div ="";
		var drivingMode;
		if(typeof(verify) == "undefined") return;
		var verifySeq = (verify['verifySeq'] == 999) ? verify['verifyResultSeq'] : verify['verifySeq'];
		var id = idx+"detail_"+verifySeq+'_drivingMode';
		var pointerId = idx+"pointer_"+verifySeq;
		var idEtc = idx+"detail_"+verifySeq+'_idEtc';
		var idUser = idx+"detail_"+verifySeq+'_uesrComment';
		var userComment = (typeof(verify['userComment']) == "undefined") ? "":verify['userComment'];
		if(!verify['active'] || typeof(verify['drivingMode']) == "undefined") {
			drivingMode = "대기";
		}
		else {
			if(verify['drivingMode'] == 1) {
				drivingMode = "자율 주행중";
			}
			else {
				drivingMode = "수동 주행중";
			}
		}
		div += "<div class='vhc_vrfct_tcDetail'>"
		    + 	"<div class='tcExpectation_tit'>"
		    + 		"<span class='dot5Span no'><span class='no'>"+(index+1)+"</span><i id='"+pointerId+"'></i></span>"
		    + 		"<span class='vhc_vrfct_mode'><span class='textCenter'><i></i><span id="+id+">"+drivingMode+"</span></span></span>"
		    + 		"<span>"+title+"</span>"
		    +		"<span class='threeSpan event'>[ "+verify['questionName']+" ] </span>"
		    + 		checkActive(idx, verify)
		    + 		"<span class='dot6Span' id='"+idEtc+"'>"+setUserComentDeatil(idx, verify)+"</span>"
		    + 	"</div>"
		    
		    +	"<div id='"+idUser+"' class='user_comment_div hideComment'>"
		    +		"<input type='text' id='userCommnet_"+verify['verifyResultSeq']+"' class='user_comment_contents' value='"+userComment+"'></input>"
		    +		"<button class='user_comment_btn' onclick='saveComment("+verify['verifyResultSeq']+")'>save</button>"
		    +	"</div>"
		    + "</div>";
		if(replayObject['index'] == 0) {
			getID('detail_verify').innerHTML = div;
		}
		else {
			getID('detail_verify').innerHTML += div;
		}
		
		checkingPointer(pointerId) 
		
	}
	
	function initVerifyDetailList(idx, verifyList, title, pointerIdx,cmd) {
		removeDivChild('detail_verify');
		var div ="";
		
		for(var i=0; i<verifyList.length; i++) {
			var drivingMode;
			var verifySeq = (verifyList[i]['verifySeq'] == 999) ? verifyList[i]['verifyResultSeq'] : verifyList[i]['verifySeq'];
			var id = idx+"detail_"+verifySeq+'_drivingMode';
			var pointerId = idx+"pointer_"+verifySeq;
			var idEtc = idx+"detail_"+verifySeq+'_idEtc';
			var idUser = idx+"detail_"+verifySeq+'_uesrComment';
			var userComment = (typeof(verifyList[i]['userComment']) == "undefined") ? "":verifyList[i]['userComment'];
			if(!verifyList[i]['active'] || typeof(verifyList[i]['drivingMode']) == "undefined") {
				drivingMode = "대기";
			}
			else {
//			else if(typeof(verifyList[i]['drivingMode']) != "undefined") {
				if(verifyList[i]['drivingMode'] == 1) {
					drivingMode = "자율 주행중";
				}
				else {
					drivingMode = "수동 주행중";
				}
			}
			div += "<div class='vhc_vrfct_tcDetail'>"
			    + 	"<div class='tcExpectation_tit'>"
			    + 		"<span class='dot5Span no'><span class='no'>"+(i+1)+"</span><i id='"+pointerId+"'></i></span>"
			    + 		"<span class='vhc_vrfct_mode'><span class='textCenter'><i></i><span id="+id+">"+drivingMode+"</span></span></span>"
			    + 		"<span>"+title+"</span>"
			    +		"<span class='threeSpan event'>[ "+verifyList[i]['questionName']+" ] </span>"
			    + 		checkActive(idx, verifyList[i]);
			
				if(verifyList[i]['verifySeq'] == 999 || cmd == 'replay') {
					div += "<span class='dot6Span' id='"+idEtc+"'>"+setUserComentDeatil(idx, verifyList[i])+"</span>"
					+ 	"</div>"
					+	"<div id='"+idUser+"' class='user_comment_div hideComment'>"
					+		"<input type='text' id='userCommnet_"+verifyList[i]['verifyResultSeq']+"' class='user_comment_contents' value='"+userComment+"'></input>";
					if(cmd == 'replay') {
						div += "<button class='user_comment_btn' onclick='saveComment("+verifyList[i]['verifyResultSeq']+")'>save</button>";
					}
					div += "</div>"
					+ "</div>";
				}
				else {
					div += "<span class='dot6Span' id='"+idEtc+"'></span>"
					+ 	"</div>"
					+ "</div>";
				}
		}
		getID('detail_verify').innerHTML = div;
		checkingPointer(pointerIdx) 
	}
	
	function checkingPointer(id) {
		
		if(document.querySelector('.ingPointer') != null) document.querySelector('.ingPointer').classList.remove('ingPointer');
		if(getID(id)!= null) getID(id).classList.add('ingPointer');
		
	}
	
	function updateDetail(verify) {
		
		var verifySeq = (verify['verifySeq'] == 999) ? verify['verifyResultSeq'] : verify['verifySeq'];
		var id = popupId+'detail_'+verifySeq;
		var drivingMode ="";
		var pointerId = popupId+"pointer_"+verifySeq;
		
		if(verify['drivingMode'] == 1) {
			drivingMode = "자율 주행중";
		}
		else {
			drivingMode = "수동 주행중";
		}
		if(getID(id+'_drivingMode')==null) return;
		checkingPointer(pointerId)
		getID(id+'_drivingMode').innerText = drivingMode;
		updateDeatailResult(id+'_pvdResult', verify['pvdResult'])
		updateDeatailResult(id+'_userResult', verify['userResult'])
		if(setting[popupId]['isEnableTester']) {
			
			if(verify['pvdResult'] == verify['userResult'] && (typeof(verify['pvdResult']) != "undefined" || typeof(verify['userResult']) != "undefined")) {
				getID(id+'_result').innerText = '검증완료';
				getID(id+'_result').className  = "pass";
			}
			else {
				getID(id+'_result').innerText = '대기';
				getID(id+'_result').className  = "ing";
			}
		}
		else {
			if(typeof(verify['pvdResult']) != "undefined") {
				getID(id+'_result').innerText = '완료';
				getID(id+'_result').className  = "pass";
				
			}
			else {
				getID(id+'_result').innerText = '대기';
				getID(id+'_result').className  = "ing";
			}
			getID(id+'_userResult').innerText = '미검증';
			getID(id+'_userResult').className = "";
		}
	}
	
	function updateDeatailResult(id, result) {
		
		if(getID(id) == null) return;
		
		if(typeof(result) == "undefined") {
			getID(id).innerText = "수행중";
			getID(id).className  = "ing";
		}
		else if(result) {
			getID(id).innerText = "PASS";
			getID(id).className = "pass";
		}
		else {
			getID(id).innerText = "FAIL";
			getID(id).className = "fail";
		}
	}
	
	function initGroupMinuMap(groupSeq) {
		var groupDiv = getID('groupVerifyList');
		var id = popupId+groupSeq;
		if(getID(id) == null) return;
		for(var i=0; i<groupDiv.childNodes.length; i++) {
			var tdArr = groupDiv.childNodes[i].childNodes;
			if(i%13 == 1) {
				for(var j= tdArr.length-1; j>=0; j--) {
					tdArr[j].className = tdArr[j].className+'_fill';
					if(tdArr[j].id == id) {
						tdArr[j].className = tdArr[j].className.replace('fill','end');
						return;
					}
				}
			}
			else {
				for(var j=0; j<tdArr.length; j++) {
					tdArr[j].className = tdArr[j].className+'_fill';
					if(tdArr[j].id == id) {
						tdArr[j].className = tdArr[j].className.replace('fill','end');
						return;
					}
				}
			}
			
		}
	}
	
	function updateGroupMiniMap(groupSeq, cmd) {
		var id = popupId+groupSeq;
		if(getID(id) == null) {
			return;
		}
		var groupDiv = getID('groupVerifyList');
		for(var i=0; i<groupDiv.childNodes.length; i++) {
			var tdArr = groupDiv.childNodes[i].childNodes;
			for(var j=0; j<tdArr.length; j++) {
				if(tdArr[j].className.indexOf("end") > -1) {
					tdArr[j].className = tdArr[j].className.replace('end','fill');
					break;
				}
			}
		}
		
		if(getID(id).className.indexOf("_first") > -1)  {
			getID(id).className = getID(id).className.replace('fill','end');
		}
		else {
			if(cmd == 'replay') {
				getID(id).className = getID(id).className.replace('fill','end');
			}
			else {
				getID(id).className += "_end";
			}
		}
	}
	