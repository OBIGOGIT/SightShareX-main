// Our app container, app-wide state is managed here
// 주요 기능 : 메시지 분배 처리
import Base from '/js/src/wc/base.js';

class ObigoContainer extends Base {
    constructor() {
        super();

        // our application level state is defined here, with initial values
        this.state = {
            count: 0, // table total count
        };

        // give this component a shadowDOM
        this.attachShadow({ mode: 'open' });

        // add shadowDOM and slot in the lightDOM
        this.shadowRoot.innerHTML = `
         <slot></slot>
       `;

        // add our event listeners for listening to state change requests
        this.addEventListener('x-msg', this.onMsg);

        // ensure our callbacks are bound to the component context
        this.onMsg = this.onMsg.bind(this);
    }

    connectedCallback() {
        // update the shadowDOM with the intitial props/state
        this.notifyMessage(); // 초기값 적용
        // this.getTplLoading();
    }

    onMsg(e) {
        // increment our total by the current amount
        // this.state.count = e.detail.count;

        // update the shadowDOM with the current props/state
        this.notifyMessage(e);
    }

    notifyMessage(e) { // parent -> child
        if (!e) return;
        // set the props of our child components (one-way data binding)
        switch (e.detail.to) {
            case 'search':
                // this.querySelector('obigo-search').count = this.state.count;
                this.querySelector('obigo-search').count = e.detail[e.detail.msg];
                break;
            case 'main': // board list
                this.querySelector('obigo-main').searches = e.detail[e.detail.msg];
                break;
        }

    }
}

export default ObigoContainer;