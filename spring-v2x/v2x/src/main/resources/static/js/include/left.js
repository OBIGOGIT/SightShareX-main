window.addEventListener('DOMContentLoaded', function() { //실행될 코드
    Log.d('left.js -> DOMContentLoaded() called...');
    // getProductsMenu();
});

var menuProductLink = function(companyId, productType, productName) {
	// var link = '/product/list.do?companyId=%s&productType=%s'.sprintf(companyId, productType);
	var link = '/product/list.do?productType=%s&productName=%s'.sprintf(productType, productName);
	Log.d('menuProductLink() -> link : ', link);
	mv( link );
};

/*
var getProductsMenu = function() {
	axios.post('/common/left/products/menu')
	.then(function (response) {
		var data = response.data;
		Log.d( 'getProductsMenu() -> data : ', data );
		
		// <li><a href="#" onclick="menuProductLink(company_id, product_type)"><i class="fa fa-circle-o"></i></a></li>
		if ( data.result == 'redirect' ) { // 로그인 필요
			mv(data.cmd);
			return;
		}
		
		var li = '';
		var len = data.length;
		for ( var i = 0 ; i < len ; i++ ) {
			li += '<li><a href="#" onclick="menuProductLink(\'%s\', \'%s\', \'%s\')"><i class="fa fa-circle-o"></i>%s</a></li>'
				  .sprintf( data[i].company_id, data[i].product_type, data[i].product_value, data[i].product_value );
		}
		// Log.d('getProductsMenu() -> li=', li);
		getID('products-menu').innerHTML = li;
	})
    .catch( function (error) {
    	Log.d('getProductsMenu() -> error=', error);
    });
};
*/