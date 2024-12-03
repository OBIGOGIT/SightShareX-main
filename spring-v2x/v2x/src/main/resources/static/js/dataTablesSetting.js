//dataTable 셋팅
$.extend( true, $.fn.dataTable.defaults, {
    pageLength: PAGE_UNIT,
    bInfo : true,
    searching : false,
    paging: true,
    bPaginate: false,
    responsive: true,
    processing: false,
    serverSide: true,
    autoWidth: false,
    lengthChange: false,
    ordering : false,
    language : { // 언어번경
        info:"<b>_START_-_END_ of _TOTAL_</b>",
        paginate: {
            "next": '<i class="fa fa-lg fa-angle-right"></i>',
            "previous": '<i class="fa fa-lg fa-angle-left"></i>'
        }
    }
} );