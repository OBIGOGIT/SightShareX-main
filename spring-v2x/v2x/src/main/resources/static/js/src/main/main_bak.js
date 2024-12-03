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
    params = {}
    // params['curPage'] = page
    // params['pageUnit'] = PAGE_UNIT
 
    params['company'] = getVal('selCompany')
    params['type'] = getVal('selDashboardType')
    params['range'] = getVal('selRange')
    params['carModel'] = getVal('selCarModel')
    params['oem'] = getVal('selOem')

    if (getVal('startDate').length > 0)
        params['startDate'] = getVal('startDate') + ' 00:00:00'
    else
        params['startDate'] = ''

    if (getVal('endDate').length > 0)
        params['endDate'] = getVal('endDate') + ' 23:59:59'
    else
        params['endDate'] = ''

    var checkedValues = [];
    $('input[name=chkOpt]:checked').each(function() {
        checkedValues.push($(this).val());
    });

    params['chk'] = checkedValues;

}

//dataTable 셋팅
const searchDashboard = function(page) {

    axios.post('/dashboard/installChart', JSON.stringify(params), {
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
        .then(function (response) {
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

                createSparkline('installChart' + i, labels, datas, data.ranking, title);
            }
        })
        .catch(function (error) {
            Log.d('searchDashboard() -> error=', error);
        });



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

                createSparkline('installChart' + i, labels, datas, data.ranking, title);
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
// event handler
window.addEventListener('DOMContentLoaded', function() { //실행될 코드
    Log.d('DOMContentLoaded() called...');
    // companyTypes();
    // setParam(1);
    // searchDashboard(1);
});

getID('btnDashboardSearch').onclick = function(e) {
    Log.d('btnSearch() called...');
    // setParam(1);
    // searchDashboard(1);
    // table.ajax.reload();
};

function createRanking(title, ranking, canvasId) {

    let max = ranking[0].data;
    for (let i = 0; i < ranking.length; i++) {
        // label과 data를 각각의 배열에 추가합니다.
        console.log(ranking[i].label);
        console.log(ranking[i].data);
        if( max > ranking[i].data ) {
            max = ranking[i].data;
        }
    }
    console.log("max : " + max);

    var htmlContent = `
            <div class="col-md-4">
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
                                    <th style="width: 40px">Install</th>
                                    <th></th>
                                </tr>`;

    // Assuming response.data is an array of objects
    // where each object represents a row in the table
    $.each(ranking, function(index, row) {
        htmlContent += `
                <tr>
                    <td>${index + 1}.</td>
                    <td><img src="images/dashboard/temu.png" class="img-ranking"></td>
<!--                    <td><img src="${row.iconSrc}" alt="${row.iconAlt}" class="img-ranking"></td>-->
                    <td>${row.label}</td>
                    <td>
                        <div class="progress-group">
                            <div class="progress sm">
                                <div class="progress-bar progress-bar-aqua" style="width:90%"></div>
<!--                                <div class="progress-bar progress-bar-aqua" style="width: ${row.progressWidth}%"></div>-->
                            </div>
                        </div>
                    </td>
                    <td><span class="badge bg-black">${row.data}</span></td>
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
        $('.rInstall').append(htmlContent);
    }

    // $("." + canvasId).append(htmlContent);
}

/* spartline chart start */

function createSparkline(canvasId, labelsArray, dataArray, ranking, title) {

    // $('.line-chart-body').append('<canvas id="'+canvasId+'" width="450" height="150""></canvas>');


    // var title = 'Install';

    var htmlContent = `
        <div class="col-md-8">
            <div class="box box-primary ${canvasId}">
                <div class="box-header with-border" style="margin-bottom: 3%">
                    <i class="fa fa-bar-chart-o"></i>
                    <h3 class="box-title">${title}</h3>
                </div>
                <div class="box-body line-chart-body">
                    <canvas id="${canvasId}" width="450" height="150"></canvas>
                </div>
            </div>
        </div>`;

    $('.rInstall').append(htmlContent);


    if( canvasId == 'installChart0' ) {

        createRanking('Install Ranking', ranking, 'installChart0')
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


/* used chart start */