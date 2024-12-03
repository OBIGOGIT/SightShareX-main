/*
	Industrious by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/
(function($) {

	var	$window = $(window),
		$banner = $('#banner'),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			default:   ['1681px',   null       ],
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Menu.

	$('#menu')
//		.append('<a href="#menu" class="close"></a>')
	.appendTo($body)
	.panel({
		target: $body,
		visibleClass: 'is-menu-visible',
		delay: 500,
		hideOnClick: true,
		hideOnSwipe: true,
		resetScroll: true,
		resetForms: true,
		side: 'right'
	});
		
})(jQuery);




/**
 * 
 * custom
 * 
 * */



function connect() {

    var socket = new SockJS('/websocket');
    stompClient = Stomp.over(socket);
    stompClient.debug = null
    stompClient.connect({}, function (frame) {

        stompClient.subscribe('/topic/refresh', function (data) {
            var result = JSON.parse(data['body']);
            Log.d("socket rev : " , result);
            titleChage();
        });

    },
    function(error) {
    	Log.d("socket err : " , error);
        setTimeout(function() {
        	Log.d("socket reconnect");
            connect();
        },3000);
    });
}

window.onload = function() {
//	if ( checkEventSource() )
//		sysInfoStream.start();
//	connect();
};

window.onbeforeunload = function() {
//	sysInfoStream.stop();
};

function initFormInput(form) {
    for(var i = 0; i < form.length; i++) {
        if("INPUT" == form[i].tagName) { //input type 중 text와 password의 값을 초기화
            var type = form[i].getAttribute("type");
            if("text" == type || "password" == type || "number" == type) {
                form[i].value = "";
            }else if("checkbox" == type) {
                $(form[i]).prop("checked", false).mobiscroll("refresh");
            }
            var readOnly = form[i].getAttribute("readonly");
            if(readOnly != null) {
            	form[i].removeAttribute("readonly");
            }
        }else if("SELECT" == form[i].tagName) { //selectbox의 option 중 empty('')를 가진 options으로 변경
            form[i].value = "";
        }else if("TEXTAREA" == form[i].tagName) {
            form[i].value = "";
        }
    }
}
