
var productDetail = function() {
	Log.d('productDetail() called...');
	let params = new URLSearchParams();
	params.append('productId', queryString('productId'));
	params.append('productType', queryString('productType'));
	
	axios.post('/product/detail', params)
	.then(function(response) {
		Log.d( 'productDetail() -> response.data : ', response.data );
		let result = response.data;
		if ( result.length > 0 ) { // 있으면...
			let dl = '';
			const dt = '<dt>%s</dt><dd>%s</dd>';
			const dtFile = '<dt>%s</dt><dd><a href="#" onclick="attachFileDown(\'%s\', \'%s\');">%s <i class="fa fa-fw fa-cloud-download"></i></a></dd>';
			const dtHelp = '<dt>%s</dt><dd><a href="#" onclick="mvNew(\'%s\');">Help Link <i class="fa fa-fw fa-external-link-square"></i></a></dd>';
			const dtDesc = '<dt><br>%s</dt><dd><br><pre style="margin-top: 3px;"><p>%s</p></pre></dd>';
			
			let filepath = '';
			let filename = '';
			// key 출력
			let key = Object.getOwnPropertyNames( result[0] );
			const last = key.length-1;
			for ( let i = 0 ; i < key.length ; i++ ) {
				// Log.d('key : ', key[i], 'value : ', result[0][key[i]] );
				
				switch(i) {
				case 0: // path
					filepath = result[0][key[i]];
					break;
				case 1: // file
					filename = result[0][key[i]];
					break;
				case 2: // title
					getID('hTitle').innerText = result[0][key[i]];
					break;
				case 3: // Name
					if (result[0][key[i]] != 'None')
						dl += dtFile.sprintf(key[i], filepath, filename, result[0][key[i]]);
					break;
				case 4: // Help
					if (result[0][key[i]] != 'None')
						dl += dtHelp.sprintf(key[i], result[0][key[i]]);
					break;
				case 6: // File Size
					if (result[0][key[i]] != 'None')
						dl += dt.sprintf(key[i], hFS(result[0][key[i]]));
					break;
				case last-1: // Updated date
					dl += dt.sprintf(key[i], utcToLoc(result[0][key[i]]));
					break;					
				case last:
					dl += dtDesc.sprintf(key[i], result[0][key[i]]);
					break;
				default:
					dl += dt.sprintf(key[i], result[0][key[i]]);
					break;
				}
			}
			// Log.d( 'dl : ', dl );
			getID('dlResult').innerHTML = dl;
		}
	})
	.catch(function(error) {
		Log.d('error=', error);
	});
};

var attachFileDown = function(path, file) {
	let uri = '/file/fileD.do?filePath=%s&fileName=%s&productId=%s&productType=%s'.sprintf( path, file, queryString('productId'), queryString('productType') );
	mv( uri );
};

//----------------------------------------------------------
//event handler

window.addEventListener('DOMContentLoaded', function() { //실행될 코드
	Log.d('productdetailview.js -> DOMContentLoaded() called...');
	productDetail();
});

if(getID('btnEdit')!=null)
getID('btnEdit').onclick = function(e) {
	Log.d('productdetailview.js -> btnEdit() called...');
	mv( '/product/modifyform.do?productId='+ queryString('productId') +'&productType=' + queryString('productType') + '&productName=' + queryString('productName') );
};

getID('btnList').onclick = function(e) {
	Log.d('btnList() called...');
	mv('/product/list.do?productType=' + queryString('productType') + '&productName=' + queryString('productName'));
};
