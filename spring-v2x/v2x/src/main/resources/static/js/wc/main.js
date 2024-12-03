/*
connectedCallback() : 커스텀 엘리먼트가 정의될때 실행된다.
adoptCallback(): 새로운 페이지나 문서로 이동될때 실행된다.
attributeChangedCallback(): 커스텀 엘리먼트 내에 있는 요소가 변경될때 해당 함수가 호출된다.
observedAttributes(): 위 attributeChangedCallback() 이 관찰 할 목록을 배열로 리턴하여 지정 해준다.
disconnectedCallback(): 커스텀 엘리먼트가 제거 될때 호출된다.
*/
import Base from '/js/src/wc/base.js';

export default class Main extends Base {
    static COL_OFFSET = 2;
    static PG_UNIT = 10;
    static PG_OFFSET = 0;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        Log.d( "Main constructor() called..." );

        // 멤버 변수 초기화
        this.count = 0;
        this.page = 1;
    }

    // web-component : 아래 attributeChangedCallback() 이 관찰 할 목록을 배열로 리턴하여 지정 해준다.
    static get observedAttributes() {
        return ["loading", "contents"];
    }

    //---------------------------------------------------------------
    // getter / setter 속성값을 내부에 전달하기 위해서 필요
    get loading() {
        return JSON.parse(this.getAttribute("loading"));
    }
    set loading(v) {
        this.setAttribute("loading", JSON.stringify(v));
    }

    get contents() {
        return JSON.parse(this.getAttribute("contents"));
    }
    set contents(v) {
        this.setAttribute("contents", JSON.stringify(v));
    }

    get searches() {
        return JSON.parse(this.getAttribute("searches"));
    }
    // container가 여기를 호출 해서 보내 줌.
    set searches(v) {
        Log.d("set searches() -> v : ", v);
        this.setAttribute("searches", JSON.stringify(v));
        this.page = 1; // reset page num
        Main.PG_OFFSET = 0;
        //---------------------------------------------------------
        // 검색 조건 추가 하여 리스트 요청 한다.
        const p = this.genQueryStringFromObjArray(v);
        Log.d("set searches() -> p : ", p);
        this.fetchUrl( `${this.list}?curPage=${this.page}&pageUnit=${this.pageUnit}` + p );
    }

    genQueryStringFromObjArray(oa) {
        // {type: 'String', colName: 'app_id', caption: '앱 ID', value: 'cc'}
        let result = '';
        if (!oa) return result;
        oa.forEach(e => {
            if (!this.isEmpty(e.value)) {
                //if(e.colName.includes('date'))
                //    result += '&' + e.colName + '=' + encodeURI(locToUtc(e.value));
                //else
                    result += '&' + e.colName + '=' + encodeURI(e.value);
            }
        });
        return result;
    }

    get heads() {
        return JSON.parse(this.getAttribute('heads'));
    }
    set heads(v) {
        this.setAttribute("heads", JSON.stringify(v));
    }

    get pageUnit() {
        return this.getAttribute('pageUnit');
    }

    get pageType() {
        return this.getAttribute('pageType');
    }
    get detail() {
        return this.getAttribute('detail');
    }
    get tblProp() {
        return this.getAttribute('tblProp');
    }

    set count(v) {
        this.setAttribute("count", JSON.stringify(v));
    }
    get count() {
        return this.getAttribute('count');
    }

    set page(v) {
        this.setAttribute("page", v);
    }
    get page() {
        return parseInt(this.getAttribute('page'));
    }

    get firstLast() {
        return this.getAttribute('firstLast');
    }

    get list() {
        return this.getAttribute('list');
    }

    async fetchUrl(url) {
        this.loading = true;

        const res = await fetch(url);
        const json = await res.json();
        this.contents = json;
        Log.d("this.contents : ", this.contents);

        if (this.contents != null && this.contents.length) {
            this.count = this.contents[0].totalcnt;
            this.page = this.contents[0].page;

            //-------------------------------------
            // table header 추출
            this.makeTableHead( this.contents[0] );
        } else {
            this.count = 0;
            this.page = 0;
        }

        this.sendMsgCount(this.count); // main.js -> search.js
        this.loading = false;
    }

    makeTableHead(item) {
        // table head 정보가 있으면 통과
        if ( this.heads != null && this.heads.length > 0 ) return;

        let tmps = [];
        Object.keys(item).forEach((key, idx) => {
            // Log.d("key : ", key, "idx : ", idx);
            if (idx > Main.COL_OFFSET) {
                tmps.push(key);
            }
        });
        this.heads = tmps;
        Log.d("this.heads : ", this.heads);
    }

    // web-component : 커스텀 엘리먼트가 정의될때 실행된다.
    async connectedCallback() {
        Log.d("connectedCallback() started...");

        this.shadowRoot.addEventListener("click", (e) => {
            const id = e.target.id;
            Log.d("shadowRoot.addEventListener() -> id : ", id);
            //const text = e.target.innerText;
            // Log.d("shadowRoot.addEventListener() -> text : ", text);

            if  ( this[id] ) {
                this[id]();
            }

            if ( id.includes('pg-') )
                this.pgMove(id.substring(3, id.length));

            const path = e.path;
            if ( path && path.length >= 2 && path[0].localName == 'td' && path[1].id.includes('lnk-') ) {
                const trId = path[1].id;
                this.lnkMove(trId.substring(4, trId.length));
            }

        });
        await this.fetchUrl( `${this.list}?curPage=${this.page}&pageUnit=${this.pageUnit}` ); // entry pointer
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
        this.render(); // 지켜보는 속성 변경시에 화면 갱신 됨(중요)
        Log.d("attributeChangedCallback() called...");
    }

    sendMsgCount(v) {
        this.dispatchEvent(new CustomEvent('x-msg', {
            bubbles: true,  // bubble event to containing elements
            composed: true, // let the event pass through the shadowDOM boundary
            detail: {       // an object to hold any custom data that's attached to this event
                from: 'main',
                to: 'search',
                msg: 'count',
                count: v,
            }
        }));
    }

    pgFirst() {
        Log.d("pgFirst() called...");

        switch (this.pageType) {
            case "1": // spin style
                this.spinFirst();
                break;
            case "2": // standard page style
                this.stdFirst();
                break;
            default: // standard page style
                this.stdFirst();
                break;
        }
    }

    spinFirst() {
        const firstPage = 1;
        if (this.page == firstPage) {
            Log.d('This is first page');
            return;
        }
        this.page = firstPage;

        const p = this.genQueryStringFromObjArray(this.searches);
        this.fetchUrl( `${this.list}?curPage=${this.page}&pageUnit=${this.pageUnit}` + p );
    }

    stdFirst() {
        Log.d("stdFirst() called...");
        if (this.page == 1 && Main.PG_OFFSET == 0 ){
            Log.d('This is first page');
            return;
        }
        this.page = 1;
        Main.PG_OFFSET = 0;
        this.pgMove(this.page);
    }

    pgLast() {
        Log.d("pgLast() called...");
        switch (this.pageType) {
            case "1": // spin style
                this.spinLast();
                break;
            case "2": // standard page style
                this.stdLast();
                break;
            default: // standard page style
                this.stdLast();
                break;
        }
    }

    spinLast() {
        const lastPage = Math.ceil(this.count / this.pageUnit);
        if (this.page == lastPage) {
            Log.d('This is last page');
            return;
        }
        this.page = lastPage;
        const p = this.genQueryStringFromObjArray(this.searches);
        this.fetchUrl( `${this.list}?curPage=${this.page}&pageUnit=${this.pageUnit}` + p );
    }

    stdLast() {
        Log.d('stdLast called...');
        const totalPage = Math.ceil(this.count / this.pageUnit);
        if (this.page == totalPage){
            // modalAlert('This is last page');
            // modalConfirm('This is last page');
            Log.d('This is last page');
            return;
        }
        const pgOffset = Math.ceil(totalPage / Main.PG_UNIT);
        this.page = totalPage;
        Main.PG_OFFSET = pgOffset-1;
        this.pgMove(this.page);
    }

    pgNext() {
        switch (this.pageType) {
            case "1": // spin style
                this.spinNext();
                break;
            case "2": // standard page style
                this.stdNext();
                break;
            default: // standard page style
                this.stdNext();
                break;
        }
    }

    spinNext() {
        Log.d('spinNext called...');
        let lastPage = Math.ceil(this.count / this.pageUnit);
        if ( this.page >= lastPage ) return;
        this.page += 1;
        const p = this.genQueryStringFromObjArray(this.searches);
        this.fetchUrl( `${this.list}?curPage=${this.page}&pageUnit=${this.pageUnit}` + p );
    }

    stdNext() {
        Log.d('stdNext called...');
        const totalPage = Math.ceil(this.count / this.pageUnit);
        if ( (Main.PG_OFFSET + 1) * Main.PG_UNIT > totalPage ) {
            Log.d('last page unit');
            return;
        }

        Main.PG_OFFSET += 1;
        this.getID('pagination').innerHTML = this.showPageControl();
    }

    pgPrev() {
        switch (this.pageType) {
            case "1": // spin style
                this.spinPrev();
                break;
            case "2": // standard page style
                this.stdPrev();
                break;
            default: // standard page style
                this.stdPrev();
                break;
        }
    }

    spinPrev() {
        Log.d("spinPrev() called...");
        if (this.page <= 1) return;
        this.page -= 1;
        const p = this.genQueryStringFromObjArray(this.searches);
        this.fetchUrl( `${this.list}?curPage=${this.page}&pageUnit=${this.pageUnit}` + p );
    }

    stdPrev() {
        Log.d("stdPrev() called...");
        if (Main.PG_OFFSET <= 0) {
            Log.d('first page unit');
            return;
        }

        Main.PG_OFFSET -= 1;
        this.getID('pagination').innerHTML = this.showPageControl();
    }

    pgMove(pageNum) {
        Log.d("pgMove() -> pageNum : ", pageNum);
        const p = this.genQueryStringFromObjArray(this.searches);
        this.fetchUrl( `${this.list}?curPage=${pageNum}&pageUnit=${this.pageUnit}` + p );
    }

    // detail 페이지 이동
    lnkMove(seq) {
        Log.d("lnkMove() -> seq : ", seq);
        mv(this.detail + "?seq=" + seq);
    }

    showPageControl() {
        return `
          <div class="d-flex justify-content-center mb-3">
            <div class="p-2">
                <style>
                .page-link {
                    color: gray;
                    cursor: pointer;
                }
                </style>
                <ul id="page-control" class="pagination">
                    ${this.firstLast == '1' ? '<li class="page-item"><a id="pgFirst" class="page-link">≪</a></li>' : ''}
                    <li class="page-item"><a id="pgPrev" class="page-link">＜</a></li>
                    ${this.applyPageType()}
                    <li class="page-item"><a id="pgNext" class="page-link">＞</a></li>
                    ${this.firstLast == '1' ? '<li class="page-item"><a id="pgLast" class="page-link">≫</a></li>' : ''}
                </ul>                
            </div>
          </div>
        `;
    }

    applyPageType() {
        switch (this.pageType) {
            case "1": // spin style
                return this.makePageStatus();
            case "2": // standard page style
                return this.makePageNum();
            default: // standard page style
                return this.makePageNum();
        }
    }

    makePageStatus() {
        return `<li class="page-item"><a id="pgStatus" class="page-link">${this.page}</a></li>`;
    }

    makePageNum() {
        let result = '';
        // let totalPage = this.count / this.pageUnit;
        let totalPage = Math.ceil(this.count / this.pageUnit);
        Log.d("makePageNum() -> totalPage : {}", totalPage);

        let maxPage = (totalPage < Main.PG_UNIT) ? totalPage : (Main.PG_OFFSET+1) * Main.PG_UNIT;
        if (maxPage > totalPage)
            maxPage = totalPage;

        // for ( let i = 1 ; i <= totalPage ; i++ ) {
        for ( let i = Main.PG_OFFSET * Main.PG_UNIT +1 ; i <= maxPage ; i++ ) {
            if ( i == this.page ) // selected page
                result += `<li class="page-item active"><a id="pg-${i}" class="page-link">${i}</a></li>`;
            else
                result += `<li class="page-item"><a id="pg-${i}" class="page-link">${i}</a></li>`;
        }
        return result;
    }

    getTplMain() {
        return `
        ${this.incAdminLTE()}
        <div class="content-wrapper">
            <section class="content">
            <div class="row">
                <div class="col-xs-12">
                    <div id="app-list" class="box box-primary" style="display: none;">
                        <div class="box-body table-responsive no-padding">
                            <!-- list start -->
                            <!--<table class="table table-hover" style="table-layout:fixed">-->
                            <table class="table table-hover">
                            <thead>
                            <tr>
                                ${this.showTableHeader()}
                            </tr>
                            </thead>
                            <tbody>
                                ${this.showTableBody()}
                            </tbody>
                            </table>
                        </div> <!-- /.box-body -->
                        <div class="box-footer" style="padding: 2px 10px 2px 10px;">
                            <div class="box-tools pull-left">
                                <b><span>Total Count : </span><span>${this.count}</span></b>
                            </div>
                        </div>
                        <div id="pagination" class="no-margin pull-right">
                            ${this.showPageControl()}
                        </div>
                    </div>
                </div>
            </div>
            </section>
        </div>
        `;
    }

    showTableHeader() {
        let result = '';
        let style = '';
        let tblProp = null;
        Log.d('this.tblProp : ', this.tblProp);
        try {
            tblProp = JSON.parse(this.tblProp);
        } catch (e) {
            Log.d('e : ', e);
        }
        Log.d('tblProp : ', tblProp);

        this.heads.map( (item, idx) => {
            style = '';
            if (tblProp != null)
            switch(tblProp[idx].a) {
                case 1: // center
                    style += `text-align:center;`;
                    break
                case 2: // right
                    style += `text-align:right;`;
                    break;
                default: // 0 : left
                    break;
            }
            result += `<th style="${style}">${item}</th>`;
        });
        return result;
    }

    showTableBody() {
        let tr = '';
        this.contents.map( row => {
            tr += `
            <tr style='cursor: pointer' id='lnk-${row.seq}'>
                ${this.showTableTd(row)}
            </tr>`;
        })
        return tr;
    }

    showTableTd(row) {
        let tblProp = null;
        let td = '';
        let style = '';
        let els = false;

        try {
            tblProp = JSON.parse(this.tblProp);
        } catch (e) {
            Log.d('e : ', e);
        }

        this.heads.map( (head, idx) => {
            // `<td>${ head.includes('일시') ? utcToLoc(row[head]) : row[head] }</td>`;
            style = '';
            els = false;
            if (tblProp != null)
            switch(tblProp[idx].a) {
                case 1: // center
                    style += `text-align:center;`;
                    break
                case 2: // right
                    style += `text-align:right;`;
                    break;
                default: // 0 : left
                    break;
            }

            if (tblProp != null && tblProp[idx].w != null) {
                style += `width:` + tblProp[idx].w + ';';
            }
            if (tblProp != null && tblProp[idx].e != null && tblProp[idx].e == 1 ) {
                style += `text-overflow:ellipsis;overflow:hidden;white-space: nowrap;max-width:` + tblProp[idx].w + ';';
                els = true; // title property 사용을 위해서
            }
            if (tblProp != null && tblProp[idx].b != null && tblProp[idx].b == 1 ) {
                style += `font-weight: bold;`;
            }

            if (els) td += `<td style="${style}" title="${row[head]}">${row[head]}</td>`;
            else td += `<td style="${style}">${row[head]}</td>`;
        });
        return td;
    }

    // web-component
    render() {
        if (this.loading) {
            getID('loader').style.display = ''; // global loading resource 사용
        } else {
            this.shadowRoot.innerHTML = this.getTplMain();
            getID('loader').style.display = 'none';
            setTimeout(() => {
                this.getID('app-list').style.display = '';
            }, 500);
        }
    }
}
// window.customElements.define('obigo-main', Main);