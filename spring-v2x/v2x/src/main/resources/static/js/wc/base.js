/*
connectedCallback() : 커스텀 엘리먼트가 정의될때 실행된다.
adoptCallback(): 새로운 페이지나 문서로 이동될때 실행된다.
attributeChangedCallback(): 커스텀 엘리먼트 내에 있는 요소가 변경될때 해당 함수가 호출된다.
observedAttributes(): 위 attributeChangedCallback() 이 관찰 할 목록을 배열로 리턴하여 지정 해준다.
disconnectedCallback(): 커스텀 엘리먼트가 제거 될때 호출된다.
*/
// 주요 기능 : 공통 모듈 적제
export default class Base extends HTMLElement {
    constructor() {
        super();
        Log.d( "Base constructor() called..." );
    }

    //---------------------------------------------------------------
    // getter / setter 속성값을 내부에 전달하기 위해서 필요

    incAdminLTE() {
        return `
            <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
            <link rel="stylesheet" href="/bootstrap/css/bootstrap.css">
            <link rel="stylesheet" href="/bootstrap/css/bootstrap-select.css">
            <link rel="stylesheet" href="/dist/css/font-awesom.css">
            <link rel="stylesheet" href="/plugins/ionicons/ionicons-2.0.1.min.css">
<!--            <link rel="stylesheet" href="/plugins/datepicker/datepicker3.css">
            <link rel="stylesheet" href="/plugins/datetimepicker/bootstrap-datetimepicker.css">-->
            <link rel="stylesheet" href="/plugins/iCheck/all.css">
            <link rel="stylesheet" href="/dist/css/AdminLTE-obigo.css">
            <link rel="stylesheet" href="/dist/css/skins/skin-lg-gray.css">
            <link rel="stylesheet" href="/dist/css/style.css">
			`;
    }

    // web component에서 <script> tag추가로 js 사용은 불가 한 것으로 보임
    incAdminLTEjs() {
        return `
            <!-- JQuery 2.2.3 -->
            <script src="/plugins/jQuery/jquery-2.2.3.min.js"></script>
            <!-- Bootstrap 3.3.6 -->
            <script src="/bootstrap/js/bootstrap.min.js"></script>
            <script src="/bootstrap/js/bootstrap-select.js"></script>
            <!--<script src="/plugins/datepicker/bootstrap-datepicker.js"></script>-->
            <!-- AdminLTE app -->
            <script src="/dist/js/app.js"></script> 
            <!--<script type="text/javascript" src="/js/commonHelper.js" ></script>     -->
        `;
    }

    incBootStrap5() {
        return `
			  <meta name="viewport" content="width=device-width, initial-scale=1">
			  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
			`;
    }

    getTplLoading() {
        return `
        <div class="load-center" id="loader"></div>
        <style>
        @keyframes spin{
          0%{
            -webkit-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
          }
          100%{
            -webkit-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
          }
        }
        
        .load-center {
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 1;
            width: 30px;
            height: 30px;
            border-radius: 100%;
        }
        
        #loader:before, #loader:after{
          content: "";
          position: absolute;
          top: -20px;
          left: -20px;

          width: 30px;
          height: 30px;

          border-radius: 100%;
          border: 5px solid transparent;
          border-top-color: gray;
        }

        #loader:before{
          z-index: 1;
          animation: spin 1.5s infinite;
        }
        
        #loader:after{
          border: 5px solid #ccc;
        }
        </style>
         `;
    }

    // getShadowID
    getID(id) {
        return this.shadowRoot.getElementById(id);
    }

    isEmpty(str) {
        return (!str || str.length === 0 );
    }
}
