/*
connectedCallback() : 커스텀 엘리먼트가 정의될때 실행된다.
adoptCallback(): 새로운 페이지나 문서로 이동될때 실행된다.
attributeChangedCallback(): 커스텀 엘리먼트 내에 있는 요소가 변경될때 해당 함수가 호출된다.
observedAttributes(): 위 attributeChangedCallback() 이 관찰 할 목록을 배열로 리턴하여 지정 해준다.
disconnectedCallback(): 커스텀 엘리먼트가 제거 될때 호출된다.
*/
import Base from '/js/src/wc/base.js';

export default class Title extends Base {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        Log.d( "Title constructor() called..." );

        this.shadowRoot.innerHTML = this.getTplMain();
        setTimeout(() => {
            this.getID('title-form').style.display = '';
        }, 500);

        /*
        this.addEventListener("x-msg", (v) => {
             console.log('x-msg receiver -> v.detail : ', v.detail);
        });
         */
    }

    //---------------------------------------------------------------
    // getter / setter 속성값을 내부에 전달하기 위해서 필요
    get path() {
        return this.getAttribute('path');
    }

    // web-component : 커스텀 엘리먼트가 정의될때 실행된다.
    async connectedCallback() {
        Log.d("connectedCallback() started...");

        this.shadowRoot.addEventListener("click", (e) => {
            const id = e.target.id;
            Log.d("shadowRoot.addEventListener() -> id : ", id);
            if  ( this[id] ) {
                this[id]();
            }
        });

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
        // this.render();
        Log.d("attributeChangedCallback() called...");
    }

    getTplMain() {
        return `
        ${this.incAdminLTE()}
        <div class="content-wrapper">
            <section id="title-form" class="content-header" style="display: none">
                <h1>
                    <slot name="title">Obigo Apps</slot>
                </h1>
                <ol class="breadcrumb">
                    ${this.path}
                </ol>
            </section>
        </div>
        `;
    }

}
// window.customElements.define('obigo-title', Title);