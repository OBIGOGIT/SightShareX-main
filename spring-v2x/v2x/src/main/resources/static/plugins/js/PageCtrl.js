const PAGE_BTN_CLS = "paginate_button";		// basic style
const A_PAGE_BTN_CLS = PAGE_BTN_CLS + " active";	// active style
//console.log("A_PAGE_BTN_CLS=", A_PAGE_BTN_CLS);

var Pagination = {
    code: '',
    _pageNum: 0,
    _initPage: 0,
    // --------------------
    // Utility
    // --------------------
    
    // converting initialize data
    Extend: function(data) {
        data = data || {};
        Pagination.size = data.size || 300; // 기본값 : 페이지 수
        Pagination.page = data.page || 1;   // 기본값 : 선택 페이지 번호
        Pagination.step = data.step || 3;   // 기본값 : 현재 페이지 기준 전후 몇개 페이지 표시 할까
    },
    
    // add pages by number (from [s] to [f])
    Add: function(s, f) {
        for (var i = s; i < f; i++) {
            Pagination.code += '<li class="'+PAGE_BTN_CLS+'"><a href="#">' + i + '</a></li>';
        }
    },
    
    // add last page with separator
    Last: function() {
        Pagination.code += '<li class="'+PAGE_BTN_CLS+'"><a href="#">...</a></li><li class="'+PAGE_BTN_CLS+'"><a href="#">' + Pagination.size + '</a></li>';
    },
    
    // add first page with separator
    First: function() {
        Pagination.code += '<li class="'+PAGE_BTN_CLS+'"><a href="#">1</a></li><li class="'+PAGE_BTN_CLS+'"><a href="#">...</a></li>';
    },
    
    // --------------------
    // Handlers
    
    // change page
    Click: function() {
        //Pagination.page = +this.innerHTML;
        Pagination.page = +this.innerText;
        console.log("click Click() -> Pagination.page = ", Pagination.page, "Pagination.size=", Pagination.size);
        if (isNaN(Pagination.page))
        	return;

        pageChange( Pagination.page, Pagination.size )
        Pagination.Start();
    },
    
    // previous page
    Prev: function() {
        Pagination.page--;
        if (Pagination.page < 1) {
            Pagination.page = 1;
        }
        //console.log("prev Click() -> Pagination.page = ", Pagination.page, "Pagination.size=", Pagination.size);
        pageChange( Pagination.page, Pagination.size )
        Pagination.Start();
    },
    
    // next page
    Next: function() {
        Pagination.page++;
        if (Pagination.page > Pagination.size) {
            Pagination.page = Pagination.size;
        }
        //console.log("next Click() -> Pagination.page = ", Pagination.page, "Pagination.size=", Pagination.size);
        pageChange( Pagination.page, Pagination.size )
        Pagination.Start();
    },
    
    //--------------------
    // Script
    //--------------------
    
    // binding pages
    Bind: function() {
        var a = Pagination.e.getElementsByTagName('li');
        for ( var i = 0; i < a.length; i++ ) {
        	//console.log('html : ', a[i].innerHTML);
        	//console.log('text : ', a[i].innerText);
            if (+a[i].innerText === Pagination.page)
                a[i].className = A_PAGE_BTN_CLS; // 현재 페이지 설정
            else 
                a[i].className = PAGE_BTN_CLS;
    
            a[i].addEventListener('click', Pagination.Click, false);
        }
    },
    
    // write pagination
    Finish: function() {
        Pagination.e.innerHTML = Pagination.code;
        Pagination.code = '';
        Pagination.Bind();
    },
    
    // find pagination type
    Start: function() {
        if (Pagination.size < Pagination.step * 2 + 6) {
            Pagination.Add(1, Pagination.size + 1);
        } else if (Pagination.page < Pagination.step * 2 + 1) {
            Pagination.Add(1, Pagination.step * 2 + 4);
            Pagination.Last();
        } else if (Pagination.page > Pagination.size - Pagination.step * 2) {
            Pagination.First();
            Pagination.Add(Pagination.size - Pagination.step * 2 - 2, Pagination.size + 1);
        } else {
            Pagination.First();
            Pagination.Add(Pagination.page - Pagination.step, Pagination.page + Pagination.step + 1);
            Pagination.Last();
        }
    
        Pagination.Finish();
    },
    
    // --------------------
    // Initialization
    // --------------------
    
    // binding buttons
    Buttons: function(e) {
        var nav = e.getElementsByTagName('ul');
        nav[0].addEventListener('click', Pagination.Prev, false);
        nav[2].addEventListener('click', Pagination.Next, false);
    },
    
    // create skeleton
    Create: function(e) {
    
        var html = [
        	'<ul class="pagination pagination-sm no-margin"><li class="paginate_button"><a href="#">‹</a></li></ul>', // previous button
            "&nbsp;<ul class='pagination pagination-sm no-margin'></ul>&nbsp;",  // pagination container
            '<ul class="pagination pagination-sm no-margin"><li class="paginate_button"><a href="#">›</a></li></ul>'  // next button
        ];
    
        e.innerHTML = html.join('');
        // console.log(e.innerHTML);
        Pagination.e = e.getElementsByTagName('ul')[1];
        Pagination.Buttons(e);
    },
    
    // init
    Init: function(e, data) {
        Pagination.Extend(data);
        Pagination.Create(e);
        Pagination.Start();
    }
};


/* * * * * * * * * * * * * * * * *
* Initialization
* * * * * * * * * * * * * * * * */
/*
var init = function() {
    Pagination.Init(document.getElementById('pagination'), {
        size: Pagination._pageNum,  // pages size ( 총 페이지 수 )
        page: Pagination._initPage, // selected page ( 처음 시직시 선택 페이지 번호 )
        step: 3          // pages before and after current ( 선택 페이지 기준으로 전 후 몇개 까지 표시 할까 )
    });
};

document.addEventListener('DOMContentLoaded', init, false);
*/