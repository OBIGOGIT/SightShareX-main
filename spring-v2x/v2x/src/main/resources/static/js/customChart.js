/**
 *  Chart 함수 
 * */
var obChart = (function() {

	var defaultValue = 0;
	var defaultOptions = {
		chart: {
			animations: {
				enabled: true,
				easing: 'easeinout',
				speed: 800,
				animateGradually: {
					enabled: true,
					delay: 150
				},
				dynamicAnimation: {
					enabled: true,
					speed: 500
				}
			},
			type: 'radialBar',
			offsetY: 0,
			offsetX: 0,
			width: '220px',
			height: '220px',
		},
		plotOptions: {
			radialBar: {
				hollow: {
					margin: 5,
					size: '70%',
				},
				startAngle: -110,
				endAngle: 110,
				track: {
					background: "#3d3d3d",
					strokeWidth: '100%',
					margin: 0, // margin is in pixels
					shadow: {
						enabled: false,
						top: 2,
						left: 0,
						color: '#999',
						opacity: 1,
						blur: 2
					}
				},
				dataLabels: {
					name: {
						show: false
					},   
					value: {
						offsetY: -2,
						fontSize: '0'
					}                     
				}
			}
		},
		series : [defaultValue],
		fill: {
			type: 'gradient',
			gradient: {
//			shade: 'dark',
			type: 'horizontal',
			shadeIntensity: 0.5,
			gradientToColors: ['#ABE5A1'],
			inverseColors: true,
			opacityFrom: 1,
			opacityTo: 1,
			stops: [0, 100]
			}
		},
		stroke: {
			lineCap: "butt",
		}			
	}
	
	function updateChart(element, value, speed) {
		
		if(!Array.isArray(value)){
			if(speed != null && speed) value = value* 0.59;
			value = [value];
		}
		
		element.updateSeries(value, false);
	}
	
	function updateInfo(element, value, aver) {
		var valueStr = "";
//		if(typeof(aver) != "undefined") valueStr =  value + ' ('+parseInt(aver,10)+')';
//		else 
			valueStr =  value;
		element.innerText = valueStr;
	}

	function updateData(element, value, aver) {
		if(typeof(element) == 'undefined') return;
		if(element != null) updateChart(element, value,);
		var element2 = getID(element.el.id+"_info");
		if(element2 != null) updateInfo(element2, value, aver);
	}
	
	function updateDateFull(element, value) {
		if(typeof(element) == 'undefined') return;
		if(element != null) updateChart(element, value*0.59);
		var element2 = getID(element.el.id+"_info");
		if(element2 != null) updateInfo(element2, value);
	}
	
	function initData(id, options, speed) {
		if(options == null || options == "") 
		options = Object.assign(defaultOptions, options);
		var element2 = getID(id+"_info");
		if(element2 != null) updateInfo(element2, options.series, speed);
		if(speed != null && speed) options.series = [options.series* 0.59];
		var chart = new ApexCharts(
			document.querySelector("#"+id),
			options
		);
		chart.render();
		return chart;
	}
	
	function getOption() {
		return defaultOptions;
	}
	
	function setOption(options) {
		defaultOptions = options
	}
	
	function deleteData(element) {
		if(element == null ) return null;
		element.destroy();
		element = null;
	}
	
	function initChartDonuts(id, options, data) {
		var dataLabelsColor = ['#fff','#55606D']
		var donutsOptions = {
	        labels: ["성공", "실패"],
	        colors:['#48ADA8', '#E1E7EF'],
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    type: 'vertical',
                    shadeIntensity: 1,
                    gradientToColors: ['#48ADA8', '#E1E7EF'],
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100]
                }
            },
	        chart: {
	        	background: '#FFFFFF',
	        	type: 'donut',
	        	width: '100%',
				height: '200px',
				events: {
				    animationEnd: function(ctx) {
				      ctx.toggleDataPointSelection(0);
				    }
			    }
	        },
	        plotOptions: {
        	  pie: {
        	    donut: {
        	      size: '60%',
        	      background: 'transparent',
        	    },      
        	  }
        	},
	        states: {
	        	normal: {
	                filter: {
	                    type: 'none',
	                    value: 0,
	                }
	            },
	            hover: {
	                filter: {
	                    type: 'none',
	                    value:0
	                }
	            },
	            active: {
	                allowMultipleDataPointsSelection: false,
	                filter: {
	                    type: 'none',
	                    value: 1
	                }
	            },
	        },
	        stroke: {
	            width:0
	        },
	        legend: {
	        	position: 'bottom',
	            onItemClick: {
	                //toggleDataSeries: false
	            },
	            onItemHover: {
	                highlightDataSeries: false
	            }
	        },
	        dataLabels: {
        	  enabled: true,
        	  dropShadow: {
        	      enabled: false
        	  },
        	  style: {
        	        colors: dataLabelsColor
        	  },
	        },
	        tooltip: {
        	  custom: function({series, seriesIndex, dataPointIndex, w}) {
    			  return '<div style="background-color:'+w.config.colors[seriesIndex]+';color:'+dataLabelsColor[seriesIndex]+'; padding:6px 10px 6px 10px">'+
        	      '<span style="font-size:12px">'+w.config.labels[seriesIndex]+' : </span>'+
        	      '<span class="apexcharts-tooltip-text-value">'+series[seriesIndex]+ '</span>' +
        	      '</div>'
        	  }
        	}
        };
		options = cloneObject(donutsOptions,options);
		
		options['series'] = data;
		
		var chart = new ApexCharts(
			document.querySelector("#"+id),
			options
		  	
		);
		chart.render();
		return chart;
	}
	
	function initChartLine(id, options, data) {
		
		var lineOptions = {
				series: [],
		        chart: {
		        	height: 300,
			        type: 'line',
			        dropShadow: {
			        	enabled: false,
			            color: '#000',
			            top: 5,
			            left: 3,
			            blur: 3,
			            opacity: 0.1
			        },
			        toolbar: {
			          show: false
			        }
		        },
	        colors: ['#45B2EF','#EBB769'],
	        dataLabels: {
	          enabled: true,
	        },
	        stroke: {
//	          curve: 'smooth',
	          width: 2
	        },
	        title: {
	          align: 'left'
	        },
	        grid: {
	          borderColor: '#e7e7e7',
	          row: {
	            colors: ['#F8F8F9', 'transparent'], // takes an array which will be repeated on columns
	            opacity: 0.5
	          },
	        },
	        markers: {
	          size: 0.5
	        },
	        legend: {
	          position: 'top',
	          horizontalAlign: 'right',
	          floating: true,
	          offsetY: -5,
	          offsetX: 10
	        }
        };

		options = cloneObject(lineOptions,options);
		
		options['series'] = data;
		var chart = new ApexCharts(
			document.querySelector("#"+id),
			options
		);
		chart.render();
		return chart;
	}

	function initChartColumn(id, options, data) {

		var columnOptions = {
			series: [],
			chart: {
				type: 'bar',
				height: 350
			},
			colors: ['#45B2EF'],
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
					// endingShape: 'rounded'
				},
			},
			fill: {
				opacity: 1
			}
		};

		options = cloneObject(columnOptions,options);

		options['series'] = data;
		var chart = new ApexCharts(
			document.querySelector("#"+id),
			options
		);
		chart.render();
		return chart;
	}
	
	function cloneObject(donutsOptions, obj) {
	    for(var i in obj) {
	        if(typeof(obj[i])=="object" && obj[i] != null)
	        	donutsOptions[i] = cloneObject(obj[i]);
	        else
	        	donutsOptions[i] = obj[i];
	    }
	    return donutsOptions;
	}

	
	
	return {
		"initChartD": initChartDonuts,
		"initChartL": initChartLine,
		"initChartC": initChartColumn,
		"init" : initData,
		"update" : updateData,
		"deleteChart" : deleteData,
		"getOption" : getOption,
		"setOption" : setOption,
		"updateDateFull" : updateDateFull
	}
	
})();





