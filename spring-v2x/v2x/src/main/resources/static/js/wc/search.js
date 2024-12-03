/*
connectedCallback() : 커스텀 엘리먼트가 정의될때 실행된다.
adoptCallback(): 새로운 페이지나 문서로 이동될때 실행된다.
attributeChangedCallback(): 커스텀 엘리먼트 내에 있는 요소가 변경될때 해당 함수가 호출된다.
observedAttributes(): 위 attributeChangedCallback() 이 관찰 할 목록을 배열로 리턴하여 지정 해준다.
disconnectedCallback(): 커스텀 엘리먼트가 제거 될때 호출된다.
*/
import Base from '/js/src/wc/base.js';

export default class Search extends Base {
    // enum define
    static TYPE = Object.freeze({
        DATE:  { v: "date" },
        DATETIME:  { v: "datetime" },
        COMBO: { v: "combo" },
    });

    constructor() {
        super();
        this.props = {
            count: 0,
        };

        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = this.getTplMain();
        setTimeout(() => {
            this.getID('search-form').style.display = '';
        }, 500);

        //-------------------------------------------------------------------
        // 이벤트 핸들러 등록 - 이것을 사용하면.. this.객체를 통해서 멘버 변수 접근 불가 주의
        //this.getID('btnSearch').addEventListener('click', this.onSearch);
        //this.onSearch = this.onSearch.bind(this);

        Log.d( "Search constructor() called..." );
    }

    btnSearchAll(e) {
        if (!this.searches) return;
        const newSearches = this.searches;
        for ( let i = 0 ; i < newSearches.length ; i++ ) {
            if (newSearches[i].type == Search.TYPE.DATE.v) {
                this.getID(newSearches[i].colName + '1').value = '';
                this.getID(newSearches[i].colName + '2').value = '';
            }
            else if (newSearches[i].type == Search.TYPE.DATETIME.v) {
                this.getID(newSearches[i].colName + '1').value = '';
                this.getID(newSearches[i].colName + '1-t').value = '';
                this.getID(newSearches[i].colName + '2').value = '';
                this.getID(newSearches[i].colName + '2-t').value = '';
            }
            else this.getID(newSearches[i].colName).value = '';
        }

        this.btnSearch(e);
    }

    // event handler
    btnSearch(e) {
        Log.d('onSearch() -> e : ', e);
        Log.d('onSearch() -> this.searches : ', this.searches);

        if (!this.searches) return;

        // 주의 : 전체 교체 해야 변경 됨.
        // 1. 사용자 입력 정보를 this.searches에 동기화 한다.
        let newSearches = this.searches;
        for ( let i = 0 ; i < newSearches.length ; i++ ) {
            if (newSearches[i].type == Search.TYPE.DATE.v) {
                let start = this.getID(newSearches[i].colName + '1').value;
                let end = this.getID(newSearches[i].colName + '2').value;
                if (start.length>0&&end.length>0)
                    newSearches[i].value = `${start},${end}`;
                else newSearches[i].value = '';
            }
            else if (newSearches[i].type == Search.TYPE.DATETIME.v) {
                let start = this.getID(newSearches[i].colName + '1').value
                            + ' ' + this.getID(newSearches[i].colName + '1-t').value + ':00.000';
                let end = this.getID(newSearches[i].colName + '2').value
                            + ' ' + this.getID(newSearches[i].colName + '2-t').value + ':59.999';
                if (start.length>10&&end.length>10) // 10 : basic text
                    newSearches[i].value = `${start},${end}`;
                else newSearches[i].value = '';
            }
            else newSearches[i].value = this.getID(newSearches[i].colName).value;
            Log.d('onSearch() -> newSearches[i].value : ', newSearches[i].value);
        }

        this.searches = newSearches; // renew this.searches
        Log.d('onSearch() -> this.searches : ', this.searches);

        // 2. 사용자 입력 정보를 Main(list)쪽으로 전달한다.
        this.sendMsgSearches(this.searches);
    }

    btnCollapse(e) {
        Log.d('btnCollapse called...');
        const txt = this.getID('btnCollapse').innerHTML;
        if (txt.includes('fa-minus')) {
            this.getID('s-body').style.display = 'none';
            this.getID('s-footer').style.display = 'none';
            this.getID('s-cw').style.height = '60px';
            this.getID('btnCollapse').innerHTML = `<i id="iCollapse" class="fa fa-plus"></i>`;
        } else {
            this.getID('s-body').style.display = 'block';
            this.getID('s-footer').style.display = 'block';
            this.getID('s-cw').style.height = '';
            this.getID('btnCollapse').innerHTML = `<i id="iCollapse" class="fa fa-minus"></i>`;
        }
    }

    iCollapse(e) {
        //Log.d('iCollapse called...');
        this.btnCollapse(e);
    }

    sendMsgSearches(v) {
        this.dispatchEvent(new CustomEvent('x-msg', {
            bubbles: true,  // bubble event to containing elements
            composed: true, // let the event pass through the shadowDOM boundary
            detail: {       // an object to hold any custom data that's attached to this event
                from: 'search',
                to: 'main',
                msg: 'searches',
                searches: v,
            }
        }));
    }

    // web-component : 아래 attributeChangedCallback() 이 관찰 할 목록을 배열로 리턴하여 지정 해준다.
    static get observedAttributes() {
        return ["searches"];
    }

    //---------------------------------------------------------------
    // getter / setter 속성값을 내부에 전달하기 위해서 필요
    get searches() {
        return JSON.parse(this.getAttribute("searches"));
    }
    set searches(v) {
        this.setAttribute("searches", JSON.stringify(v));
    }

    get hide() {
        return this.getAttribute('hide');
    }

    set count(value) {
        // update our props with new value
        this.props.count = value;
        this.updateView();
    }
    get count() {
        // return the prop
        return this.props.count;
    }

    get searchName() {
        return this.getAttribute('searchName');
    }
    get uri() {
        return this.getAttribute('uri');
    }

    async fetchUrl(url) {
        const res = await fetch(url);
        const json = await res.json();
        this.searches = json;
        Log.d("this.searches : ", this.searches);

        this.getID('search-items').innerHTML = this.makeSearchForm();
        this.addDatepicker();
    }

    addDatepicker() {
        if (!this.searches) return;
        this.searches.forEach(e => {
            if ( e.type == Search.TYPE.DATE.v || e.type == Search.TYPE.DATETIME.v) {
                this.createDatepicker( this.getID(e.colName + '1') );
                this.createDatepicker( this.getID(e.colName + '2') );
            }
        });
    }

    createDatepicker(o) {
        new Datepicker(o, {
            autohide: true,
            format: 'yyyy-mm-dd',
            todayHighlight: true,
            showOnFocus: true,
            //nextArrow: 'Next',
            //prevArrow: 'Prev',
            //language: 'en',
        });
    }

    makeSearchForm() {
        let result = '';
        if (!this.searches) return result;
        this.searches.forEach(e => {
            let tpl = '';
            switch(e.type) {
                case Search.TYPE.DATE.v:
                    tpl = `
                    <div class="col-md-6">
                        <div class="form-group-sm">
                            <label for="${e.colName}" class="col-sm-3 control-label">${e.caption}</label>
                            <div class="col-sm-9">
                                <nobr>
                                <input id="${e.colName}1" placeholder="${e.caption}" class="form-control-cal" type="text" value="${e.value}" onfocus="Odatepicker('${e.colName}1')" />
                                <label class="dash-cal">~</label>
                                <input id="${e.colName}2" placeholder="${e.caption}" class="form-control-cal" type="text" value="${e.value}" />
                                </nobr>
                            </div>
                        </div>
                    </div>
                    `;
                    break;
                case Search.TYPE.DATETIME.v:
                    tpl = `
                    <div class="col-md-6">
                        <div class="form-group-sm">
                            <label for="${e.colName}" class="col-sm-3 control-label">${e.caption}</label>
                            <div class="col-sm-9">
                                <nobr>
                                <input id="${e.colName}1" placeholder="${e.caption}" class="form-control-cal" type="text" value="${e.value}" style="width:26%" />
                                <input id="${e.colName}1-t" placeholder="Time" class="form-control-cal" type="text" value="" style="width:20%" />
                                <label class="dash-cal">~</label>
                                <input id="${e.colName}2" placeholder="${e.caption}" class="form-control-cal" type="text" value="${e.value}" style="width:26%" />
                                <input id="${e.colName}2-t" placeholder="Time" class="form-control-cal" type="text" value="" style="width:20%" />
                                </nobr>
                            </div>
                        </div>
                    </div>
                    `;
                    break;
                case Search.TYPE.DATE.v:
                    tpl = `
                    <div class="col-md-6">
                        <div class="form-group-sm">
                            <label for="${e.colName}" class="col-sm-3 control-label">${e.caption}</label>
                            <div class="col-sm-9">
                                <nobr>
                                <input id="${e.colName}1" placeholder="${e.caption}" class="form-control-cal" type="text" value="${e.value}" />
                                <label class="dash-cal">~</label>
                                <input id="${e.colName}2" placeholder="${e.caption}" class="form-control-cal" type="text" value="${e.value}" />
                                </nobr>
                            </div>
                        </div>
                    </div>
                    `;
                    break;
                case Search.TYPE.COMBO.v:
                    const ui = JSON.parse(e.ui);
                    tpl = `
                    <div class="col-md-6">
                        <div class="form-group-sm">
                            <label for="${e.colName}" class="col-sm-3 control-label">${e.caption}</label>
                            <div class="col-sm-9">
                                <!-- <input id="${e.colName}" placeholder="${e.caption}" class="form-control" type="text" value="${e.value}" /> -->
                                <select id="${e.colName}" class="form-control">
                                    ${ui.map( item => {
                                    return `<option value="${item.key}">${item.value}</option>`;
                                    }).join("")}
                                </select>
                            </div>
                        </div>
                    </div>
                    `;
                    break;
                default:
                    tpl = `
                    <div class="col-md-6">
                        <div class="form-group-sm">
                            <label for="${e.colName}" class="col-sm-3 control-label">${e.caption}</label>
                            <div class="col-sm-9">
                                <input id="${e.colName}" placeholder="${e.caption}" class="form-control" type="text" value="${e.value}" />
                            </div>
                        </div>
                    </div>
                    `;
                    break;
            }
            result += tpl;
        });
        return result;
    }

    // web-component : 커스텀 엘리먼트가 정의될때 실행된다.
    async connectedCallback() {
        Log.d("connectedCallback() started...");

        this.shadowRoot.addEventListener("click", (e) => {
            const id = e.target.id;
            Log.d("shadowRoot.addEventListener() -> id : ", id);
            if  ( this[id] ) {
                this[id](e);
            }

            if (id.endsWith('-t')) { // time setting
                this.showTimePicker(e.target);
            }
        });
        await this.fetchUrl( `${this.uri}/${this.searchName}` ); // entry pointer
    }

    showTimePicker(o) {
        Timepicker.showPicker({
            time: o.value,
            headerBackground: '#ababab',
            headerColor: '#454545',
            footerBackground: "#d4d4d4",
            wrapperBackground: "#ededed",
            submitColor: "#555",
            cancelColor: "#555",
            /*
            headerSelected: '#fafafa',
            wrapperBackground: "#424242",
            footerBackground: "#424242",
            clockBackground: "#424242",
            clockItemColor: "#fafafa",
            clockItemInnerColor: "#e0e0e0",
            handColor: "#F44336",
             */
            onSubmit: (v) => {
                o.value = v.formatted();
            }
        })
    }
    // web-component : 새로운 페이지나 문서로 이동될때 실행된다.
    adoptCallback() {
        Log.d("adoptCallback() called...");
    }

    // web-component : 커스텀 엘리먼트가 제거 될때 호출된다.
    disconnectedCallback() {
        Log.d("disconnectedCallback() called...");
    }

    // web-component : 커스텀 엘리먼트 내에 있는 요소가 변경될때 해당 함수가 호출된다.
    attributeChangedCallback(attrName, oldVal, newVal) {
        this.render();
        Log.d("attributeChangedCallback() called...");
    }

    getTplMain() {
        return `
        ${this.incAdminLTE()}
        ${this.incDate()}
        <div id="s-cw" class="content-wrapper">
        <section class="content">
        <div id="search-form" class="box box-primary" style="display: none">
            <div class="box-header with-border">
                <h3 class="box-title" style="font-size:14px;">Search</h3>
                ${this.hide == '1' ? `
                <div class="box-tools pull-right">
                    <button id="btnCollapse" type="button" class="btn btn-box-tool" data-widget="collapse" data-toggle="tooltip" title="" data-original-title="Collapse"><i id="iCollapse" class="fa fa-minus"></i></button>
                </div>
                ` : ''}
            </div>
            <div id="s-body" class="box-body" style="display: block;">
                <div id="search-items" class="row">
                    <!--
                    <div class="col-md-6">
                        <div class="form-group-sm">
                            <label for="txtEmail" class="col-sm-3 control-label">User Email</label>
                            <div class="col-sm-9">
                                <input id="txtEmail" placeholder="User Email" class="form-control" type="text" value="" />
                            </div>
                        </div>
                    </div>
                    -->                    
                </div>
            </div>
            <div id="s-footer" class="box-footer" style="display: block;">
                <div class="box-tools pull-left">
                    <span>Total Count : </span><span id="result">0</span>
                </div>
                <div class="box-tools pull-right">
                    <button type="button" class="btn btn-obigo btn-sm" id="btnSearch">Search</button>
                    <button type="button" class="btn btn-primary btn-sm" id="btnSearchAll">Search All</button>
                </div>
            </div>
        </div>
        </section>
        </div>
        `;
    }

    // web-component
    render() {
    }

    updateView() {
        // set the props of our child components (one-way data binding)
        let result = this.shadowRoot.querySelector('#result');
        if (result == null) return;
        result.innerText = this.props.count;
    }

    incDate() {
        return `
        <link rel="stylesheet" href="/css/date/date.css">
		`;
    }

    incClock() {
        return `
        <link href="/css/clock/clock.css" rel="stylesheet">
		`;
    }
}
// window.customElements.define('obigo-search', Search);