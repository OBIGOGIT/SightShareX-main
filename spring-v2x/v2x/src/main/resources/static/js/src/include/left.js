window.addEventListener('DOMContentLoaded', function() { //실행될 코드
    Log.d('left.js -> DOMContentLoaded() called...');
    // getProductsMenu();
});

var menuProductLink = function(companyId, productType, productName) {
	// let link = '/product/list.do?companyId=%s&productType=%s'.sprintf(companyId, productType);
	var link = '/product/list.do?productType=%s&productName=%s'.sprintf(productType, productName);
	Log.d('menuProductLink() -> link : ', link);
	mv( link );
};
