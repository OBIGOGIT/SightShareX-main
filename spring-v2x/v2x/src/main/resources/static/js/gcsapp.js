var myApp = angular.module('form.app', ['angularModalService'])
myApp.config(function($httpProvider) {
	$httpProvider.interceptors.push('GcsHttpInterceptor');
});

myApp.factory('GcsHttpInterceptor', ['$q', '$window', function($q, $window) {
	return {
		'requestError': function(rejection)
        {
            return $q.reject(rejection);
        }
		, 'responseError': function(rejection)
        {
            return $q.reject(rejection);
        }
        , 'response': function (response) {
            return response || $q.when(response);
        }
	}
}]);


myApp.run(function($rootScope, $http) {
	$rootScope.upload = {
			loding : false,
			status : 0,
			process : 0,
			totla : 0
	}
	$rootScope.confirmTpl = "/angular/tpl/confirm.html";
	$rootScope.confirmDelTpl = "/angular/tpl/confirmDel.html";
	
	$rootScope.login = {
			checkduplicate : false
	}
	$rootScope.certificate = {
			checkduplicate : false
	}
	$rootScope.tempfiles = [];
	var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
	$http.defaults.headers.post[header]=token;
});


myApp.directive("compareTo", function() {
	return {
		require: "ngModel",
		scope: {
			otherModelValue: "=compareTo"
		},
		link: function(scope, element, attributes, ngModel) {
			ngModel.$validators.compareTo = function(modelValue) {
				return modelValue == scope.otherModelValue;
			};

			scope.$watch("otherModelValue", function() {
				ngModel.$validate();
			});
		}
	};
});

myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var isMultiple = attrs.multiple;
            var modelSetter = model.assign;
            element.bind('change', function () {
                var values = [];
                angular.forEach(element[0].files, function (item) {
                    var value = {
                       // File Name
                        name: item.name,
                        //File Size
                        size: item.size,
                        //File URL to view
                        url: URL.createObjectURL(item),
                        // File Input Value
                        _file: item
                    };
                    values.push(value);
                });
                scope.$apply(function () {
                    if (isMultiple) {
                    	modelSetter(scope, values);
                    } else {
                    	modelSetter(scope, values[0]);
                    }
                    if(scope.afterWork) scope.afterWork(attrs);
                });
            });
        }
    };
}]);

myApp.service('fileUpload', ['$http', function ($http) {
	this.uploadFileToUrl = function(rootScope, files, uploadUrl,goUrl, loading){

		rootScope.upload.loading = true;
		if(loading!=null) rootScope.upload.loading = loading;

		$("#myModal").modal({
			"backdrop"  : "static",
			"keyboard"  : true,
			"show"      : true
		});

		$.setModalDisplayOpt("request", 'Working','Working');

		var fd = new FormData();
		var data = $("#frm").serializeArray();
		$.each(data, function(key, input){
			fd.append(input.name,input.value);
		})
		$.each(files, function(key, input){
			fd.append(input.fieldNm, input.file);
		})

		$http.post(uploadUrl, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined , 'HTTP':true },
			eventHandlers: {
				progress: function(c) {
					console.log('Progress -> ' + c);
					//console.log(c);
				}
			},
			uploadEventHandlers: {
				progress: function(e) {
					console.log('UploadProgress -> ' + e);
					//console.log(e);
					rootScope.upload.status = (e.loaded / e.total) * 100;
					rootScope.upload.process = e.loaded;
					rootScope.upload.total = e.total;
				}
			}
		})
		.then(
			function successCallback(response){
				var data = response.data;
				$.setModalDisplayOpt("response", 'Result', data.description);

				if(response.data.code=="S") {
					$("#btnModalClose").on("click", function(e){
						$.goUrl(goUrl);
					});
					console.log("success==>"+data.code);
				} else {
					console.log("success==>"+data.code);
				}
			},function errorCallback(response){
				$rootScope.upload.loading = false;
				$.httpErrfunc(response, "modal");
			}
		);
	}
}]);


$.fn_submitform_real = function( $scope, $http, form_name, submit_url, go_url, dataObject, func, poptitle, popmsg, popresulttitle) {

	$("#myModal").modal({
		"backdrop"  : "static",
		"keyboard"  : true,
		"show"      : true
	});
	
	var t = (poptitle == null)?"Working":poptitle;
	var m = (popmsg == null)?"Working":popmsg;
	var r = (popresulttitle == null)?'Result':popresulttitle;
	
	$.setModalDisplayOpt("request", t,m);

	var formData;
	if(!dataObject) {
		formData = $('#'+form_name).serialize();
	} else {
		 formData = $.param(dataObject);
	}

	$http({
		method: 'POST',
		url: submit_url,
	    data: formData,
		headers: {
	        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	        ,'HTTP':true
	    }
	}).then(
			function successCallback(response) {
				$.setModalDisplayOpt("response", r ,response.data.description);

				if(response.data.code=="S") {
					if(func!=null) {
						eval(func);
					} else {
						$("#btnModalClose").on("click", function(e){
							$.goUrl(go_url);
						});
					}
					console.log("success==>"+response.data.code);
				} else {
					if(func!=null) {
						eval(func);
					} else {
						console.log("success==>"+response.data.code);
					}
				}
			},
			function errorCallback(response) {
				$.httpErrfunc(response, "modal");
			}
    )
}

$.fn_http_real = function( $scope, $http, form_name, submit_url, dataObject, func) {
	var formData;
	if(!dataObject) {
		formData = $('#'+form_name).serialize();
	} else {
		 formData = $.param(dataObject);
	}
	console.log(formData);
	$http({
		method: 'GET',
		url: submit_url+"?"+formData,
	    //data: formData,
		headers: {
	        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	        ,'HTTP':true
	    }
	}).then(
		function successCallback(response) {
			var data = response.data;
			if(data.code=="S") {
				eval(func);
				console.log("success==>"+data.code);
			} else {
				eval(func);
				console.log("fail==>"+data.code);
			}
	    }
		,function errorCallback(response) {
			$.httpErrfunc(response, "alert");
	    }
	);
}

$.httpErrfunc = function(response, mode) {
	console.log(response);
	var msgtxt = "";

	if (response.status == 401) {
		msgtxt="You do not have permission. \nPlease contact your administrator."
	} else if (response.status == 403) {
		msgtxt="Session Time Out, Your session has expired. \nPlease log in again.";
	} else if (response.status == 404) {
		msgtxt="The requested resource is not available.";
	} else if (response.status == 405) {
		msgtxt="The requested resource is not available.";
	} else {
		msgtxt="System Error, An exception occurred. \nPlease contact your administrator.";
    };

    if(response.data.path!=null) {
    	msgtxt += "\n("+response.data.path+")";
    }

	if(mode == "alert") {
	    	$.custom_alert(response.data.error , msgtxt);

	    	$("#btnModalClose").on("click", function(e){
				if (response.status == 403) { $.goUrl("/login/login.do"); }
			});
	} else {
			$.setModalDisplayOpt("response", response.data.error , msgtxt);

			$("#btnModalClose").on("click", function(e){
				if (response.status == 403) { $.goUrl("/login/login.do"); }
			});
	}
};

$.setModalDisplayOpt = function (mode, title, msg){
	if(mode=="request") {
		$("#myModalLabel").text(title);
		$("#modalMsgArea").text(msg);
		$("#btnModalX").attr('disabled',true);
		$("#btnModalOk").remove();
		$("#btnModalClose").attr('disabled',true);
	} else if(mode=="response") {
		$("#myModalLabel").text(title);
		$("#modalMsgArea").text(msg);
		$("#btnModalX").attr('disabled',false);
		$("#btnModalClose").attr('disabled',false);
	}
}