
/*
connectedCallback() : 커스텀 엘리먼트가 정의될때 실행된다.
adoptCallback(): 새로운 페이지나 문서로 이동될때 실행된다.
attributeChangedCallback(): 커스텀 엘리먼트 내에 있는 요소가 변경될때 해당 함수가 호출된다.
observedAttributes(): 위 attributeChangedCallback() 이 관찰 할 목록을 배열로 리턴하여 지정 해준다.
disconnectedCallback(): 커스텀 엘리먼트가 제거 될때 호출된다.
*/
class Planets extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        Log.d( "constructor() called..." );
    }

    // 아래 attributeChangedCallback() 이 관찰 할 목록을 배열로 리턴하여 지정 해준다.
    static get observedAttributes() {
        return ["loading", "planets"];
    }

    get loading() {
        return JSON.parse(this.getAttribute("loading"));
    }
    set loading(v) {
        this.setAttribute("loading", JSON.stringify(v));
    }

    get planets() {
        return JSON.parse(this.getAttribute("planets"));
    }
    set planets(v) {
        this.setAttribute("planets", JSON.stringify(v));
    }

    // 속성값을 내부에 전달하기 위해서 필요
    get company() {
        return this.getAttribute('company');
    }

    async fetchPlanets(url) {
        this.loading = true;

        const response = await fetch(url);
        const json = await response.json();
        this.planets = json;
        Log.d("this.planets : ", JSON.stringify(this.planets));

        this.loading = false;
    }

    // 커스텀 엘리먼트가 정의될때 실행된다.
    async connectedCallback() {
        Log.d("connectedCallback() started...");

        this.shadowRoot.addEventListener("click", (e) => {
            const name = e.target.id;
            if  ( this[name] ) {
                this[name]();
            }
        });
        await this.fetchPlanets( "https://swapi.dev/api/planets" );
    }

    // 새로운 페이지나 문서로 이동될때 실행된다.
    adoptCallback() {
        Log.d("adoptCallback() called...");
    }

    // 커스텀 엘리먼트가 제거 될때 호출된다.
    disconnectedCallback() {
        Log.d("disconnectedCallback() called...");
    }

    // 커스텀 엘리먼트 내에 있는 요소가 변경될때 해당 함수가 호출된다.
    attributeChangedCallback(attrName, oldVal, newVal) {
        this.render();
        Log.d("attributeChangedCallback() called...");
    }

    next() {
        this.fetchPlanets( this.planets.next );
    }

    previous() {
        this.fetchPlanets( this.planets.previous );
    }

    renderPrevious() {
        if ( this.planets.previous ) {
            return `<span><button id="previous" type="button" class="btn btn-outline-primary">Previous</button></span>`;
        } else {
            return `<span>No previous planets.</span>`;
        }
    }

    renderNext() {
        if ( this.planets.next ) {
            return `<span><button id="next" type="button" class="btn btn-outline-primary">Next</button></span>`;
        } else {
            return `<span>No more planets.</span>`;
        }
    }

    incBootStrap() {
        return `
			  <meta name="viewport" content="width=device-width, initial-scale=1">
			  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
			`;
    }

    renderStyle() {
        return `
			<style>
			h3 {
				color: green;
			}
			.center {
			  display: flex;
			  justify-content: center;
			  align-items: center;
			  height: 800px;
			  border: 0px solid green;
			}
			</style>
			`;
    }

    render() {
        if ( this.loading ) {
            this.shadowRoot.innerHTML = `
				${this.renderStyle()}
				<div class="center"><h1>Loading...</h1></div>
				`;
        } else {
            this.shadowRoot.innerHTML = `
				  ${this.incBootStrap()}
				  ${this.renderStyle()}
				  <div class="container mt-3">
					<h3><slot name="title">Star Wars Planets</slot></h3>
					<div class="alert alert-success">Company : <strong>${this.company}</strong></div>
					<div>Total Count: ${this.planets.count}</div>
					<table class="table table-striped">
					<thead>
					<tr>
						<th>Name</th>
						<th>Terrain</th>
						<th>Population</th>
						<th>Climate</th>
						<th>Diameter</th>
						<th>Gravity</th>
						<th>Orbital Period</th>
						<th>Rotation Period</th>
						<th>Surface Water</th>
						<th>URL</th>
					</tr>
					</thead>
					${this.planets.results.map( (item) => {
                return `
					<tr>
						<td>${item.name}</td>
						<td>${item.terrain}</td>
						<td>${item.population}</td>
						<td>${item.climate}</td>
						<td>${item.diameter}</td>
						<td>${item.gravity}</td>
						<td>${item.orbital_period}</td>
						<td>${item.rotation_period}</td>
						<td>${item.surface_water}</td>
						<td>${item.url}</td>
					</tr>
					`;
            }).join("")}
					</table>
					<div style="padding-top : 20px;">
						${this.renderPrevious()} &nbsp; ${this.renderNext()}
					</div>
				  </div>
				`;
        }
    }
}
window.customElements.define('obigo-planets', Planets);