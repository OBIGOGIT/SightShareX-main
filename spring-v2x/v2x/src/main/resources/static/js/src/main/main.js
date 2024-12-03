const COL_START = 3;

var pageChange = function(p, s) {
    Log.d("pageChange() -> page : ", p, " size: ", s);
    companyList(p);
};

var companyTypes = function() {
    Log.d( 'companyTypes() called...' );

    axios.post('/manage/company/types')
        .then( function(response) {
            let data = response.data;
            let len = data.length;
            Log.d( 'companyTypes() -> data : ', data );

            // <option value="">test</option>
            let opt = '';
            for ( let i = 0 ; i < len ; i++ ) {
                opt += '<option value="%s">%s</option>'
                    .sprintf(data[i].company_type_id, data[i].company_type_value);
            }
            getID('selCompanyType').innerHTML += opt;
        })
        .catch( function( error ) {
            Log.d('companyTypes() -> error=', error);
        });
};

//--------------------------------------기능 추가
const setParam = function(page){

    let selApp = document.getElementById('selApp');
    let selTimeType = document.getElementById('selTimeType');

    params = {}
    // params['curPage'] = page
    // params['pageUnit'] = PAGE_UNIT

    params['companyId'] = getVal('selCompany')
    params['type'] = getVal('selDashboardType')
    params['range'] = getVal('selRange')
    params['vehicleModel'] = getVal('selVehicleModel')
    params['oem'] = getVal('selCompany')
    params['msgMod'] = getVal('msgMod')
    // params['timeType'] = getVal('selTimeType')
    // params['name'] = getVal('selApp')


    if( getVal('selRange') == "day" ) {
        if (getVal('startDate').length > 0)
            params['startDate'] = getVal('startDate') + ' 00:00:00'
        else
            params['startDate'] = ''

        if (getVal('endDate').length > 0)
            params['endDate'] = getVal('endDate') + ' 23:59:59'
        else
            params['endDate'] = ''
    } else if( getVal('selRange') == "month" ) {
        if (getVal('startDate').length > 0) {
            params['startDate'] = getVal('startDate').replace("-", "");
            params['startDateM'] = getVal('startDate');
        }
        else {
            params['startDate'] = ''
            params['startDateM'] = ''
        }

        if (getVal('endDate').length > 0) {
            params['endDate'] = getVal('endDate').replace("-", "");
            params['endDateM'] = getVal('endDate')
        }
        else {
            params['endDate'] = ''
            params['endDateM'] = ''
        }
    }else {

        if (getVal('startDate').length > 0)
            params['startDate'] = getVal('startDate').replace("-", "");
        else
            params['startDate'] = ''

        if (getVal('endDate').length > 0)
            params['endDate'] = getVal('endDate').replace("-", "");
        else
            params['endDate'] = ''
    }


    var checkedValues = [];
    $('input[name=chkOpt]:checked').each(function() {
        checkedValues.push($(this).val());
    });

    params['chk'] = checkedValues;

    if (selApp) {
        params['name'] = getVal('selApp');
    }
    if (selTimeType) {
        params['timeType'] = getVal('selTimeType');
    }

    if( checkedValues.includes('300004') ) {
        if( getID('selApp') && getVal('selApp') == "" ) {
            modalAlert('Please select an App');
            isSpinner(false);
            return ;
        }
    }



}

//dataTable 셋팅
const searchDashboard = function(page) {

    if( getVal('selCompany') == "" ) {
        modalAlert('Please select a company');
        isSpinner(false);
        return;
    }

    let selRange = getVal("selRange");
    let startDate = getVal("startDate");
    let endDate = getVal("endDate");
    let format;

    if ( ( !isValidDate(startDate, selRange) && startDate != "" ) || (!isValidDate(endDate, selRange) && endDate != "") ) {
        switch (selRange) {
            case "day" :
                format = "yyyy-mm-dd";
                break;
            case "month" :
                format = "yyyy-mm";
                break;
            case "year" :
                format = "yyyy";
                break;
        }


        modalAlert(`The date format is incorrect. Please enter in the ${format} format.`);
        isSpinner(false);
        return;
    }


    //  APP 별 상세 - 버전 별 다운로드 건 수
    let checkbox = document.getElementById('200004');
    if (checkbox) {
        if (checkbox.checked) {
            let selApp = document.getElementById('selApp');
            console.log("check selApp : ",selApp)
            if (!selApp || getVal('selApp') == "") {
                modalAlert('Please select an App');
                isSpinner(false);
                return;
            }
        }
    }



    // if( getVal('selVehicleModel') == "" ) {
    //     modalAlert('Please select your vehicle model.');
    //     return;
    // }

    console.log("searchDashboard() -> params : ", params)
    axios.post('/dashboard/installChart', JSON.stringify(params), {
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
        .then(function (response) {
            // console.log("ranking : " + response.data.search.chk);

            let data = response.data;

            $('.rInstall').empty();

            var dashboardList = data.dashboardList;
            console.log("chart data : " , data)

            if( !getID('divInstall') ) {
                let divContent = `
                    <div class="col-md-8 divInstall">
                    </div>`;

                $('.rInstall').append(divContent);
            }


            if( getVal("selDashboardType") == "300000" ) {
                console.log("installChart data.dashboardList : ", data.dashboardList);

                let title;
                for (let i = 0; i < data.dashboardList.length; i++) {

                    let labelsArray = [];
                    let dataArray = [];
                    let imgUrlArray = [];
                    let curChk;


                    let chk = data.search.chk[i];
                    if(chk == "300001") {
                        title = data.dashboardList[i][0].name;
                        let allTotalTime = secondsToYMDHMS(data.dashboardList[i][0].data);
                        let htmlContent = `
                            <div class="">
                                <div class="box box-primary">
                                    <div class="box-header with-border" >
                                        <i class="fa fa-bar-chart-o"></i>
                                        <h3 class="box-title">${title}</h3>
                                    </div>
                                     <div class="box-body line-chart-body app-total-time">
                                        <span>${allTotalTime}</span>
                                    </div>
                                </div>
                            </div>`;

                        $('.divInstall').append(htmlContent);
                    } else if(chk == "300004") {
                        // labels와 datas 배열을 초기화합니다.
                        var labels = [];
                        var datas = [];
                        let title;
                        let curChk;

                        // 각각의 대시보드 리스트에 대해 반복합니다.
                        for (let j = 0; j < dashboardList[i].length; j++) {
                            // label과 data를 각각의 배열에 추가합니다.
                            labels.push(dashboardList[i][j].label);
                            datas.push(dashboardList[i][j].data);
                            title = dashboardList[i][j].name;
                            curChk =  data.search.chk[i];
                        }
                        console.log(labels);
                        console.log(datas);

                        console.log("cha rt title : ", title)
                        createSparkline('usedChart', labels, datas, data.ranking, title, curChk);

                    } else {
                        curChk =  data.search.chk[i];
                        for( let j = 0; j < data.dashboardList[i].length; j++ ) {
                            let dto = data.dashboardList[i][j];
                            console.log("installChart dto : ", dto)
                            labelsArray.push(dto.label);
                            dataArray.push(dto.data);
                            title = dto.name;

                            if(dto.imgUrl == null || dto.imgUrl == undefined) {
                                // TODO no image로 변경 필요
                                imgUrlArray.push("../images/obigo_Favicon.png");
                            } else {
                                imgUrlArray.push(dto.imgUrl);
                            }
                        }

                        let canvasId = 'canvasId' + i;
                        createChartDiv(canvasId, title, curChk);

                        console.log("canvasId : ", canvasId, "      labelsArray : ", labelsArray, "     dataArray : ", dataArray, "     imgUrlArray : ", imgUrlArray)
                        createImgBarChart(canvasId, labelsArray, dataArray, imgUrlArray);
                    }

                    if( i == 0 ) {
                        console.log("ranking : ", data.ranking)
                        let selDashboardType = getID("selDashboardType");
                        let selDashboardTypeOpt = selDashboardType.options[selDashboardType.selectedIndex];
                        let rankingTitle = selDashboardTypeOpt.text; // "INSTALL"

                        createRanking(rankingTitle + ' RANKING', data.ranking)
                    }
                }

            } else {

                // dashboardList의 모든 요소에 대해 반복합니다.
                for (let i = 0; i < dashboardList.length; i++) {
                    // labels와 datas 배열을 초기화합니다.
                    var labels = [];
                    var datas = [];
                    let title;
                    let curChk;

                    // 각각의 대시보드 리스트에 대해 반복합니다.
                    for (let j = 0; j < dashboardList[i].length; j++) {
                        // label과 data를 각각의 배열에 추가합니다.
                        labels.push(dashboardList[i][j].label);
                        datas.push(dashboardList[i][j].data);
                        title = dashboardList[i][j].name;
                        curChk =  data.search.chk[i];
                    }
                    console.log(labels);
                    console.log(datas);

                    if( title == undefined || title == "" ) {
                        title = document.querySelector("label[for='" + getID(data.search.chk[i]).id + "']").textContent;

                    }

                    console.log("chart title : ", title)


                    createSparkline('chart' + i, labels, datas, data.ranking, title, curChk);
                }

            }
        })
        .catch(function (error) {
            Log.d('searchDashboard() -> error=', error);
        })
        .finally(function () {
            isSpinner(false);
        });


    function isValidDate(dateString, type) {
        var regEx;
        if( type == "month" ) {
            regEx = /^\d{4}-\d{2}$/;
        } else if( type == "year" ) {
            regEx = /^\d{4}$/;
        } else {
            regEx = /^\d{4}-\d{2}-\d{2}$/;
        }

        if(!dateString.match(regEx)) return false;  // Invalid format

        switch (type) {
            case "day":
                var d = new Date(dateString);
                var dNum = d.getTime();
                if(!dNum && dNum !== 0) return false; // Invalid date
                return d.toISOString().slice(0,10) === dateString;
            case "month":
                var [year, month] = dateString.split("-");
                if (month < 1 || month > 12) return false;
                return true;
            case "year":
                if (dateString < 0 || dateString > new Date().getFullYear()) return false;
                return true;
        }
    }




    /*$.ajax({
        url : "/dashboard/installChart", // 데이터를 가져올 서버의 URL을 입력하세요.
        type : "POST",
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType : 'json',
        dataSrc : 'list', //data 받는 key이름 (기본 : "" => data)
        success : function(data) {
            console.log("ranking : " + data.search.chk)





            $('.rInstall').empty();

            var dashboardList = data.dashboardList;


            // dashboardList의 모든 요소에 대해 반복합니다.
            for (let i = 0; i < dashboardList.length; i++) {
                // labels와 datas 배열을 초기화합니다.
                var labels = [];
                var datas = [];

                // 각각의 대시보드 리스트에 대해 반복합니다.
                for (let j = 0; j < dashboardList[i].length; j++) {
                    // label과 data를 각각의 배열에 추가합니다.
                    labels.push(dashboardList[i][j].label);
                    datas.push(dashboardList[i][j].data);
                }
                console.log(labels);
                console.log(datas);

                let title = data.search.chk[i];
                if( title == 'allI' )  {
                    title = '전체 APP 대상 총 설치 다운로드 건수';
                } else if ( title == 'Ioa' ) {
                    title = '업데이트 차량 한 대 당 평균 설치 다운로드 건 수';
                } else if ( title == 'Ia' ) {
                    title = 'APP 별 설치 다운로드 건 수';
                }

                createSparkline('chart' + i, labels, datas, data.ranking, title);
            }



            // let max = data.ranking[0].data;
            // for (let i = 0; i < data.ranking.length; i++) {
            //     // label과 data를 각각의 배열에 추가합니다.
            //     console.log(data.ranking[i].label);
            //     console.log(data.ranking[i].data);
            //     if( max > data.ranking[i].data ) {
            //         max = data.ranking[i].data;
            //     }
            // }
            // console.log("max : " + max);
            // createRanking(data.ranking, max, 'installChart0')




            // createSparkline('installChart', Object.keys(obj), Object.values(obj));
            // createSparkline('installChart', data.labelsArray, data.dataArray);
        },
        error : function(xhr,status,error) {
            console.log(error);
        }
    });*/
}

//----------------------------------------------------------


function createRanking(title, ranking) {

    let len = ranking.length;
    if ( len <= 0 )
        return;

    let max = ranking[0].data;
    for (let i = 0; i < ranking.length; i++) {
        // label과 data를 각각의 배열에 추가합니다.
        console.log(ranking[i].label);
        console.log(ranking[i].data);
        if( max < ranking[i].data ) {
            max = ranking[i].data;
        }

    }
    console.log("max : " + max);

    if( !getID('divRankingInstall') ) {
        let divContent = `
        <div class="col-md-4 divRankingInstall">
        </div>`;

        $('.rInstall').append(divContent);
    }


    var htmlContent = `
            <div class="">
                <!-- 랭킹 start -->
                <div class="box box-primary">
                    <div class="box-header">
                        <h3 class="box-title">${title}</h3>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body no-padding">
                        <table class="table table-striped">
                            <tr>
                                    <th style="width: 10px">#</th>
                                    <th>Icon</th>
                                    <th>App</th>
                                    <th style="width: 40px">Percent</th>
                                    <th></th>
                                </tr>`;

    // Assuming response.data is an array of objects
    // where each object represents a row in the table
    $.each(ranking, function(index, row) {
        let percent = (row.data / max) * 100;

        console.log("row.data : " + row.data);
        console.log("percent : " + percent);

        let rankingData = row.data;
        if( title == 'USE RANKING' ) {
            rankingData = secondsToYMDHMS(rankingData);
        }

        htmlContent += `
                <tr>
                    <td>${index + 1}.</td>
                    <td><img src="${row.imgUrl}" class="img-ranking"></td>
<!--                    <td><img src="${row.iconSrc}" alt="${row.iconAlt}" class="img-ranking"></td>-->
                    <td>${row.label}</td>
                    <td>
                        <div class="progress-group">
                            <div class="progress sm">
<!--                                <div class="progress-bar progress-bar-aqua" style="width:90%"></div>-->
                                <div class="progress-bar progress-bar-aqua" style="width: ${percent}%"></div>
                            </div>
                        </div>
                    </td>
                    <td><span class="badge bg-black span-inline">${rankingData}</span></td>
                </tr>`;
    });

    htmlContent += `
                        </table>             
                        <!-- /.box-body -->
                </div>  
                <!-- 랭킹 end -->          
            </div>`;

    const firstElement = document.querySelector('.rInstall');
    if (firstElement) {
        console.log("firstElement : " + firstElement)
        // firstElement.classList.add('rInstall');
        // $("." + canvasId).append(htmlContent);
        $('.divRankingInstall').append(htmlContent);
    }

    // $("." + canvasId).append(htmlContent);
}

/* spartline chart start */

function createSparkline(canvasId, labelsArray, dataArray, ranking, title, curChk) {

    // $('.line-chart-body').append('<canvas id="'+canvasId+'" width="450" height="150""></canvas>');


    // var title = 'Install';

    let detailTitle = '';
    let app = '';
    let vehicleModel = getVal("selVehicleModel");
    const selAppElement = getID("selApp");
    if( vehicleModel == "" ) {
        vehicleModel = "All";
    }

    let checkValue = ['200004', '300003', '300004'];

    if(selAppElement && checkValue.includes(curChk) && (selAppElement.value != "" || curChk != 200004 )  ) {

        var selAppIndex = selAppElement.selectedIndex;

        // Get the <option> element based on the selected index
        var selAppOption = selAppElement.options[selAppIndex];
        var selAppText = selAppOption.textContent;

        app = " - " + selAppText;

        if(curChk != 200004 && selAppElement.value == "")
            app = " - All";
    }
    detailTitle = vehicleModel + app;


    var htmlContent = `
        <div class="">
            <div class="box box-primary ${canvasId}">
                <div class="box-header with-border" style="margin-bottom: 3%">
                    <i class="fa fa-bar-chart-o"></i>
                    <h3 class="box-title">${title} (${detailTitle})</h3>
                </div>
                <div class="box-body line-chart-body">
                    <canvas id="${canvasId}" width="450" height="150"></canvas>
                </div>
            </div>
        </div>`;

    $('.divInstall').append(htmlContent);


    if( canvasId == 'chart0' ) {

        let selectElement = getID("selDashboardType");
        let selectedOption = selectElement.options[selectElement.selectedIndex];
        let rankingTitle = selectedOption.text; // "INSTALL"


        // let rankingTitle = getID("selDashboardType").text;
        console.log("rankingTitle : ", rankingTitle)
        createRanking(rankingTitle + ' RANKING', ranking)
    }


    var spartlinechartCtx = document.getElementById(canvasId).getContext('2d');

    var spartlinechart = null;

    // if (window.spartlinechart != undefined) {
    //     window.spartlinechart.destroy();
    //     spartlinechart = null;
    // }

    var spartlinechart = new Chart(spartlinechartCtx, {
        // window.spartlinechart = new Chart(spartlinechartCtx, {
        type: 'line',
        data: {
            labels: labelsArray,
            datasets: [{
                data: dataArray,
                backgroundColor: [
                    'rgba(75,192,192,.5)'
                ],
                borderColor: [
                    'rgba(75,192,192)'
                ],
                borderWidth: 1,
                fill:true,
                tension:0.4
            }]
        },
        options: {
            responsive:true,
            scales:{
                y:{
                    title:{
                        display:true
                    }
                },
                x:{
                    title:{
                        display:true
                    }
                }
            },
            plugins:{
                legend:{
                    display:false
                }
            }
        }
    });
}

function createImgBarChart(canvasId, labelsArray, dataArray, imgUrlArray) {
    var imgBarchartCtx = document.getElementById(canvasId).getContext('2d');

    Promise.all(
        imgUrlArray.map((url) => {
            return new Promise((resolve) => {
                var img = new Image();
                img.src = url;
                img.onload = function() {
                    resolve(img);
                };
            });
        })
    ).then((imgArray) => {
        // Now create the chart

        var imgBarchart = new Chart(imgBarchartCtx, {
            type: 'bar',
            data: {
                labels: labelsArray,
                datasets: [{
                    data: dataArray,
                    backgroundColor: 'rgba(54, 162 ,235)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                },
                layout: {
                    padding: {
                        top: 20
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            padding: 60
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 10,
                            max: 100,
                            min: 0
                        }
                    }
                }
            },
            plugins: [{
                afterDraw: function (chart) {
                    if (chart.data.labels.length === 0) return;
                    var ctx = chart.ctx;
                    var xAxis = chart.scales['x'];
                    var yPos = xAxis.top + 5;

                    chart.data.labels.forEach(function (label, i) {
                        let xPos = xAxis.getPixelForTick(i);
                        ctx.drawImage(imgArray[i], xPos - 25, yPos, 50, 50);
                    });
                },
                afterDatasetsDraw: function(chart, easing) {
                    var ctx = chart.ctx;
                    chart.data.datasets.forEach(function (dataset, i) {
                        var meta = chart.getDatasetMeta(i);
                        if (!meta.hidden) {
                            meta.data.forEach(function(element, index) {
                                // Use toLocaleString to format the number with commas
                                var dataString = dataset.data[index].toLocaleString();
                                ctx.fillStyle = 'rgb(0, 0, 0)';
                                var fontSize = 16;
                                var fontStyle = 'normal';
                                var fontFamily = 'Helvetica Neue';
                                ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                var padding = 5;
                                var position = element.tooltipPosition();
                                ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
                            });
                        }
                    });
                }

            }]
        });


    });
}


function createChartDiv(canvasId, title, curChk) {

    let detailTitle = '';
    let app = '';
    let vehicleModel = getVal("selVehicleModel");
    const selAppElement = getID("selApp");
    if( vehicleModel == "" ) {
        vehicleModel = "All";
    }

    let checkValue = ['200004', '300003', '300004'];

    if(selAppElement && checkValue.includes(curChk) ) {

        var selAppIndex = selAppElement.selectedIndex;

        // Get the <option> element based on the selected index
        var selAppOption = selAppElement.options[selAppIndex];
        var selAppText = selAppOption.textContent;


        app = " - " + (selAppElement.value != "" ? selAppText : 'All' );

        if(curChk == 200004 && selAppElement.value == "")
            app = "";

        console.log("app name : ",app)
    }
    detailTitle = vehicleModel + app;

    // if( !getID('divInstall') ) {
    //     let divContent = `
    //     <div class="col-md-8 divInstall">
    //     </div>`;
    //
    //     $('.rInstall').append(divContent);
    // }


    var htmlContent = `
        <div class="">
            <div class="box box-primary ${canvasId}">
                <div class="box-header with-border" style="margin-bottom: 3%">
                    <i class="fa fa-bar-chart-o"></i>
                    <h3 class="box-title">${title} (${detailTitle})</h3>
                </div>
                <div class="box-body line-chart-body">
                    <canvas id="${canvasId}" width="450" height="150"></canvas>
                </div>
            </div>
        </div>`;

    $('.divInstall').append(htmlContent);
}

/* used chart start */


/* ####################### */

/*
function ex() {
    /!* spartline chart start *!/

    function createSparkline(canvasId, labelsArray, dataArray) {
        var spartlinechartCtx = document.getElementById(canvasId).getContext('2d');
        var spartlinechart = new Chart(spartlinechartCtx, {
            type: 'line',
            data: {
                labels: labelsArray,
                datasets: [{
                    data: dataArray,
                    backgroundColor: [
                        'rgba(75,192,192,.5)'
                    ],
                    borderColor: [
                        'rgba(75,192,192)'
                    ],
                    borderWidth: 1,
                    fill:true,
                    tension:0.4
                }]
            },
            options: {
                responsive:true,
                scales: {
                    y: {  // 변경된 부분
                        title: {
                            display: true,
                            // text: 'Y-axis'
                        }
                    },
                    x: {  // 변경된 부분
                        title: {
                            display: true,
                            // text: 'X-axis'
                        }
                    }
                },
                plugins:{
                    legend:{
                        display:false
                    }
                }

            }
        });
    }

    createSparkline('installChart', ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        , [13000, 14500, 14300, 15200, 15000, 14700, 15600, 15100, 17000, 15800, 16100, 18000]);
    // createSparkline('installChart', ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    //     , [14500, 15000, 15500, 15000, 15500, 15000, 15500, 15000, 15500, 15300, 14500, 18500]);
    /!* spartline chart end *!/
}*/


var dash = {};
dash.datas = [];
dash.bChanged = false;
dash.getSelectDashMenuOpt = function() {
    // showHide('table-list', false);

    console.log("getVal('selDashboardType') : ", getID('selDashboardType').value)
    let params = {
        'groupId' : getVal('selDashboardType')
    };


    axios.post('/manage/dashboard/menuOptionList', JSON.stringify(params), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
        let data = response.data;
        let len = data.length;
        if (len <= 0) return;

        let msgMod = getVal('msgMod');

        let selRange = getVal("selRange");
        console.log("selRange opt : ", selRange)

        let html = data.map(menu => {
            let isDisabled = '';
            let tooltipAttribute = '';
            let isChecked = '';

            if (menu.dashMenuId === '200004') {
                const selAppElement = document.getElementById('selApp');

                console.log("selAppElement : ", selAppElement)
                if (!selAppElement || selAppElement.value != '') {
                    isDisabled = 'disabled';
                }
                tooltipAttribute = 'data-toggle="tooltip" data-bs-placement="top" title="Please select the Vehicle Model and App first."';
            }

            if (menu.dashMenuId === '300004') {
                tooltipAttribute = 'data-toggle="tooltip" data-bs-placement="top" title="The range can only be selected when set to day."';
            }

            if (menu.dashMenuId === '300004' && selRange !== 'day') {
                isDisabled = 'disabled';
            }

            // 마지막 숫자가 3 이하인 경우 checked 속성 추가
            if (parseInt(menu.dashMenuId.slice(-1)) <= 3) {
                isChecked = 'checked';
            }

            return `
                <div class="col-sm-3 box-tools">
                    <input type="checkbox" class="box-tooltip" id="${menu.dashMenuId}" name="chkOpt" value="${menu.dashMenuId}" ${isDisabled} ${isChecked} ${tooltipAttribute}>
                    <label for="${menu.dashMenuId}" class="control-label" ${tooltipAttribute}>${msgMod === 'ko' ? menu.menuDes : menu.subMenu}</label>
                </div>
                `;

            // return `
            //     <div class="col-sm-3 box-tools">
            //         <input type="checkbox" class="box-tooltip" id="${menu.dashMenuId}" name="chkOpt" value="${menu.dashMenuId}" ${isDisabled} ${isChecked} ${tooltipAttribute}>
            //         <label for="${menu.dashMenuId}" class="control-label" ${tooltipAttribute}>${menu.menuDes}</label>
            //     </div>
            //     `;
        }).join('');

        document.querySelector('.checkOpt').innerHTML = html;

    })
    .catch(function(error) {
        Log.d('error=', error);
    });
};

dash.setTimeType = function () {

    let timeTypelist = document.querySelector('.timeTypelist');
    if (timeTypelist) {
        timeTypelist.remove();
    }

    let html = '<div class="row mg-tb1"> <div class="col-md-6 timeTypelist">' +
        '<label for="selTimeType" class="col-sm-3 control-label">App State</label>' +
        '<div class="col-sm-9">' +
        '<select id="selTimeType" class="form-control select2">';

    html += '<option value="all">' + 'ALL(FG+BG)' + '</option>';
    html += '<option value="fg">' + 'FG' + '</option>';
    html += '<option value="bg">' + 'BG' + '</option>';

    html += '</select></div></div></div>';

    let divApp = document.querySelector('.divApp');
    divApp.insertAdjacentHTML('afterend', html);
}

dash.setSelApp = function () {

    if(getVal("selVehicleModel") == "") {
        let applist = document.querySelector('.applist');
        if (applist) {
            applist.remove();
        }
        return;
    }

    // if( getVal('selVehicleModel') == "" ) {
    //     modalAlert('Please select your vehicle model.');
    //     return;
    // }

    let params = {
        'companyId' : getVal('selCompany'),
        'vehicleCode' : getVal('selVehicleModel')
    };

    console.log("params : ", params)


    axios.post('/manage/dashboard/AppList', JSON.stringify(params), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
        let data = response.data;
        let len = data.length;

        let applist = document.querySelector('.applist');
        if (applist) {
            applist.remove();
        }

        if (len <= 0) return;

        let html = '<div class="col-md-6 applist">' +
            '<label for="selApp" class="col-sm-3 control-label">App</label>' +
            '<div class="col-sm-9">' +
            '<select id="selApp" class="form-control select2">';


        html += '<option value="">' + '= Select =' + '</option>';
        for (let i = 0; i < len; i++) {
            html += '<option value="' + data[i].code + '">' + data[i].name + '</option>';
        }

        html += '</select></div></div>';

        let divApp = document.querySelector('.divApp');
        divApp.insertAdjacentHTML('beforeend', html);

    })
    .catch(function(error) {
        Log.d('error=', error);
    });
}


var companies = function() {
    Log.d( 'companies() called...' );

    axios.post('/common/company/active/myclist')
        .then( function(response) {
            let data = response.data;
            companyData = data;
            let len = data.length;
            Log.d( 'companies() -> data : ', data );

            // <option value="">test</option>
            let opt = '';
            for ( let i = 0 ; i < len ; i++ ) {
                opt += '<option value="%s">%s</option>'
                    .sprintf(data[i].company_id, data[i].company_name);

            }
            getID('selCompany').innerHTML += opt;
        })
        .catch( function( error ) {
            Log.d('companies() -> error=', error);
        });
};

dash.getSelVehicle = function() {

    console.log("getVal('selCompany') : ", getID('selCompany').value)
    let params = {
        'companyId' : getVal('selCompany')
    };


    axios.post('/manage/dashboard/vehicleList', JSON.stringify(params), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
        let data = response.data;
        let len = data.length;
        // if (len <= 0) return;

        // app list 삭제 start
        let applist = document.querySelector('.applist');
        if (applist) {
            applist.remove();
        }
        // app list 삭제 end

        let opt = '';
        let firstOption = getID('selVehicleModel').options[0]; // 기존 첫 번째 옵션 저장

        if (len > 0) {
            for (let i = 1; i < len; i++) { // 첫 번째 옵션은 건너뛰고 반복문 시작
                opt += '<option value="%s">%s</option>'
                    .sprintf(data[i].code, data[i].name);
            }
        }

        let selVehicleModel = getID('selVehicleModel');
        selVehicleModel.innerHTML = ''; // 기존 옵션 제거

        selVehicleModel.appendChild(firstOption); // 기존 첫 번째 옵션 추가

        if (len > 0)
            selVehicleModel.innerHTML += opt; // 새로운 옵션 추가

    })
    .catch(function(error) {
        Log.d('error=', error);
    });
};

function secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + "일 " : "";
    var hDisplay = h > 0 ? h + "시 " : "";
    var mDisplay = m > 0 ? m + "분 " : "";
    var sDisplay = s > 0 ? s + "초" : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

function secondsToYMDHMS(seconds) {
    seconds = Number(seconds);
    var y = Math.floor(seconds / (3600*24*365));
    var mo = Math.floor(seconds % (3600*24*365) / (3600*24*30));
    var d = Math.floor(seconds % (3600*24*30) / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var yDisplay = y > 0 ? y + " Year " : "";
    var moDisplay = mo > 0 ? mo + " Month " : "";
    var dDisplay = d > 0 ? d + " Day " : "";
    var hDisplay = h > 0 ? h + " Hour " : "";
    var mDisplay = m > 0 ? m + " Minute " : "";
    var sDisplay = s > 0 ? s + " Second" : "";
    return yDisplay + moDisplay + dDisplay + hDisplay + mDisplay + sDisplay;
}

function dateFormat() {

    // 기존 datepicker 제거
    $("#startDate").datepicker("destroy");
    $("#endDate").datepicker("destroy");


    let rangeType = getVal("selRange");
    let rangeDateFormat = "yy-mm-dd";
    switch (rangeType) {
        case "day":
            rangeDateFormat = "yy-mm-dd";
            break;
        case "week":
            rangeDateFormat = "yy-mm-dd";
            break;
        case "month":
            rangeDateFormat = "yy-mm";
            break;
        case "year":
            rangeDateFormat = "yy";
            break;
        default:
            rangeDateFormat = "yy-mm-dd";
            break;
    }

    getID("startDate").value = '';
    getID("endDate").value = '';

    console.log("rangeDateFormat : ",rangeDateFormat)


    // 새로운 dateFormat으로 datepicker 생성
    var dateFormat = rangeDateFormat,
    from = $("#startDate")
        .datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 2,
            dateFormat: dateFormat
        })
        .on("change", function () {
            var date = getDate(this);
            if (date) {
                if (rangeType === "month") {
                    var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    to.datepicker("option", "minDate", date);
                    to.datepicker("option", "maxDate", lastDayOfMonth);
                } else if (rangeType === "year") {
                    var lastDayOfYear = new Date(date.getFullYear(), 11, 31);
                    to.datepicker("option", "minDate", date);
                    to.datepicker("option", "maxDate", lastDayOfYear);
                } else {
                    to.datepicker("option", "minDate", date);
                }
            } else {
                to.datepicker("option", "minDate", null);
                to.datepicker("option", "maxDate", null);
            }
        });

    to = $("#endDate").datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 2,
        dateFormat: dateFormat
    })
        // .on("change", function () {
        //     var date = getDate(this);
        //     if (date) {
        //         if (rangeType === "month") {
        //             var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        //             to.datepicker("option", "minDate", date);
        //             to.datepicker("option", "maxDate", lastDayOfMonth);
        //         } else if (rangeType === "year") {
        //             var lastDayOfYear = new Date(date.getFullYear(), 11, 31);
        //             to.datepicker("option", "minDate", date);
        //             to.datepicker("option", "maxDate", lastDayOfYear);
        //         } else {
        //             to.datepicker("option", "minDate", date);
        //         }
        //     } else {
        //         to.datepicker("option", "minDate", null);
        //         to.datepicker("option", "maxDate", null);
        //     }
        // });

    function getDate(element) {
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
        } catch (error) {
            date = null;
        }

        return date;
    }
};

getID('selDashboardType').onchange = function(e) {
    Log.d('selDashboardType() -> e : ', e);
    dash.getSelectDashMenuOpt();

    if( getVal("selDashboardType") == "300000" ) {
        dash.setTimeType();
    } else {
        $('.timeTypelist').empty();
    }

    if( getVal("selDashboardType") != "200000"
        || getVal("selDashboardType") != "300000") {
        $('.applist').empty();

        getID("selVehicleModel").selectedIndex = 0

    }
};

getID('selCompany').onchange = function(e) {
    Log.d('selCompany() -> e : ', e);
    dash.getSelVehicle();
};

getID('selVehicleModel').onchange = function(e) {
    Log.d('selVehicleModel() -> e : ', e);

    if(getID("200004")) {
        if( getVal("selVehicleModel") != "" ) {
            getID("200004").disabled = false;
        } else {
            getID("200004").disabled = true;
            getID("200004").checked = false;
        }
    }

    if( getVal("selDashboardType") == "200000"
         || getVal("selDashboardType") == "300000") {
        dash.setSelApp();
    } else {
        $('.applist').empty();
    }

};
getID('selRange').onchange = function(e) {
    Log.d('selRange() -> e : ', e);
    dateFormat();

    var now = new Date();
    var startDate, endDate;

    switch(this.value) {
        case 'day':
            var oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            startDate = formatDate(oneWeekAgo);
            endDate = formatDate(now);
            break;
        case 'month':
            var oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            startDate = formatMonth(oneMonthAgo);
            endDate = formatMonth(now);
            break;
        case 'year':
            var oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            startDate = formatYear(oneYearAgo);
            endDate = formatYear(now);
            break;
    }

    getID("startDate").value = startDate;
    getID("endDate").value = endDate;

    if( getVal("selRange") != "day"  ) {
        if( getVal("selDashboardType") == "300000" ) {
            getID("300004").disabled = true;
            getID("300004").checked = false;
        }
    } else if( getID("300004") ) {
        getID("300004").disabled = false;
    }

};

function formatDate(date) {
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    return date.getFullYear() + "-" + month + "-" + day;
}

function formatMonth(date) {
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    return date.getFullYear() + "-" + month;
}

function formatYear(date) {
    return date.getFullYear().toString();
}

const isSpinner = function (flag) {
    let spinner = getID("spinner");

    if(flag) {
        getID("search_box").classList.add('overlay');
        let spin = '<i id="spinner" class="fa fa-refresh fa-spin"></i>';
        getID("search_box").innerHTML += spin;
    } else {
        if (spinner) { // spinner가 존재하면
            getID("search_box").classList.remove('overlay');
            spinner.parentNode.removeChild(spinner);
        }
    }
}

$(document).on('change', '#selApp', function(e) {
    Log.d('selApp() -> e : ', e);

    if( getID("200004") ) {
        if( getVal("selApp") != "" ) {
            getID("200004").disabled = false;
        }
    } else if( getID("200004") ) {
        getID("200004").disabled = true;
        getID("200004").checked = false;
    }


});

// event handler
window.addEventListener('DOMContentLoaded', function() { //실행될 코드
    Log.d('DOMContentLoaded() called...');

    console.log("time!!!! :: ", secondsToYMDHMS(35999664888))
    console.log("time2!!!! :: ", secondsToYMDHMS(368016115))
    console.log("time3!!!! :: ", secondsToYMDHMS(41450436354))

    // $('[data-toggle="tooltip"]').tooltip();

    dash.getSelectDashMenuOpt();
    companies();
    dateFormat();

    var now = new Date();
    var startDate, endDate;

    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    startDate = formatDate(oneWeekAgo);
    endDate = formatDate(now);

    getID("startDate").value = startDate;
    getID("endDate").value = endDate;

    // getID('btnDashboardSearch').click();
});

getID('btnDashboardSearch').onclick = function(e) {
    Log.d('btnSearch() called...');

    isSpinner(true);

    setParam(1);
    searchDashboard(1);
    // table.ajax.reload();
};