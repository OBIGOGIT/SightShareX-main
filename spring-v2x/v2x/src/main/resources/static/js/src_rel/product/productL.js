var pageChange=function(b,a){Log.d("pageChange() -> page : ",b," size: ",a);productList(b)},productDetail=function(b){Log.d("productDetail() -> id : ",b);mv("/product/detail.do?productId="+b+"&productType="+queryString("productType")+"&productName="+queryString("productName"))},openHelp=function(b){mvNew(b);this.event.stopPropagation()},attachFileDown=function(b,a,d){this.event.stopPropagation();b="/file/fileD.do?filePath=%s&fileName=%s&productId=%s&productType=%s".sprintf(a,d,b,queryString("productType"));
mv(b)},productList=function(b){getID("table-list-body").innerHTML="";var a=new URLSearchParams;"0"==getVal("hdnCompanyId")?null!=getID("selCompany")&&a.append("companyId",getVal("selCompany")):a.append("companyId",getVal("hdnCompanyId"));null!=queryString("productType")&&a.append("productType",queryString("productType"));a.append("name",getVal("txtName"));a.append("version",getVal("txtVersion"));a.append("description",getVal("txtDesc"));0<getVal("txtStartDate").length?a.append("start",locToUtc(getVal("txtStartDate")+
" 00:00:00")):a.append("start","");0<getVal("txtEndDate").length?a.append("end",locToUtc(getVal("txtEndDate")+" 23:59:59")):a.append("end","");null!=getID("selStatus")&&a.append("active",getVal("selStatus"));for(var d=getCLS("ext_type"),c=d.length,h=[],k=0;k<c;k++){var m=getSuffix("_",d[k].id),l="";""!=getVal(d[k].id)&&(l=getSelectedText(d[k].id));Log.d("ext_value : ",m,"col_value : ",l);h.push({ext_value:m,col_value:l})}Log.d("extTypes : ",h);a.append("extTypes",JSON.stringify(h));a.append("curPage",
b);a.append("pageUnit",PAGE_UNIT);showHide("table-list",!1);scrollSave("my-scroll-pos");axios.post("/product/list",a).then(function(a){Log.d("response.data : ",a.data);if(!(0>=a.data.length)){a=a.data;if(""==getID("table-list-head").innerHTML){for(var b=Object.getOwnPropertyNames(a[0]),c="",d=0;d<b.length;d++)0!=d&&1!=d&&3!=d&&4!=d&&5!=d&&6!=d&&(c="No"==b[d]||"Help link"==b[d]?c+'<th style="text-align: center;">%s</th>'.sprintf(b[d]):c+"<th>%s</th>".sprintf(b[d]));b="<tr>%s</tr>".sprintf(c);getID("table-list-head").innerHTML=
b}c=b="";d=a.length;for(var g=0;g<d;g++){for(var f=Object.getOwnPropertyNames(a[0]),e=0;e<f.length;e++)0!=e&&1!=e&&3!=e&&4!=e&&5!=e&&6!=e&&(c="Updated date"==f[e]?c+"<td>%s</td>".sprintf(utcToLoc(a[g][f[e]])):"Help link"==f[e]?"None"==a[g][f[e]]?c+'<td align="center">%s</td>'.sprintf(a[g][f[e]]):"unzip"==a[g][f[e]]?c+'<td align="center"><span class="glyphicon glyphicon-refresh" title="In processing"></span></td>':"1"==a[g][f[4]]?c+'<td style="color: #3c8dbc;" align="center" onclick="openHelp(\'%s\')" title="Help link"><span class="glyphicon glyphicon-link"></span></td>'.sprintf(a[g][f[e]]):
c+'<td align="center"><span class="glyphicon glyphicon-link"></span></td>':"Name"==f[e]?"None"!=a[g][f[6]]&&"1"==a[g][f[4]]?c+'<td style="color: #3c8dbc;" onclick="attachFileDown(\'%s\', \'%s\', \'%s\');" title="Product download">%s&nbsp;<i class="fa fa-fw fa-cloud-download"></i></td>'.sprintf(a[g].productid,a[g][f[5]],a[g][f[6]],a[g][f[e]]):c+"<td>%s</td>".sprintf(a[g][f[e]]):"No"==f[e]?c+'<td align="center">%s</td>'.sprintf(a[g][f[e]]):"Description"==f[e]?c+'<td class="col-xs-2 text" title="%s"><span>%s</span></td>'.sprintf(a[g][f[e]],
a[g][f[e]]):c+"<td>%s</td>".sprintf(a[g][f[e]]));b="1"==a[g][f[4]]?b+'<tr style="cursor: pointer;" onclick="productDetail(\'%s\')">%s</tr>'.sprintf(a[g].productid,c):b+'<tr style="cursor: pointer; color: lightgray;" onclick="productDetail(\'%s\')">%s</tr>'.sprintf(a[g].productid,c);c=""}getID("table-list-body").innerHTML=b;b=a[0].page;a=Math.ceil(a[0].totalcnt/PAGE_UNIT);Log.d("curPage : ",b);Log.d("pageCount : ",a);"undefined"!=typeof Pagination&&(Pagination._pageNum=a,Pagination._initPage=b,Pagination.Init(document.getElementById("pagination"),
{size:Pagination._pageNum,page:Pagination._initPage,step:3}));scrollRestore("my-scroll-pos");showHide("table-list",!0)}}).catch(function(a){Log.d("error=",a)})},makeDynamicSearchItem=function(){getID("ext-col-container").innerHTML="";var b=new URLSearchParams;b.append("productType",queryString("productType"));axios.post("/product/extfield/flist",b).then(function(a){a=a.data;var b=a.length;if(!(0>=b)){Log.d("makeDynamicSearchItem() -> r : ",a);for(var c="",h=0;h<b;h++)c+='<div class="col-md-6">\t\t\t<div class="form-group-sm">\t\t\t\t<label for="ext_type_%s" class="col-sm-3 control-label">%s</label>\t\t\t\t\t<div class="col-sm-9">\t\t\t\t\t\t<select id="ext_type_%s" class="form-control select2 ext_type">\t\t\t\t\t\t\t<option value="">= Select =</option>\t\t\t\t\t\t</select>\t\t\t\t\t</div>\t\t\t </div>\t\t</div>'.sprintf(a[h].ext_value,
a[h].ext_value,a[h].ext_value);getID("ext-col-container").innerHTML=c;for(c=0;c<b;c++)getExtColVal(a[c].ext_value,a[c].ext_type)}}).catch(function(a){Log.d("makeDynamicSearchItem() -> error=",a)})},getExtColVal=function(b,a){var d="ext_type_%s".sprintf(b);b=new URLSearchParams;b.append("extType",a);axios.post("/product/extfield/clist",b).then(function(a){a=a.data;var b=a.length;if(!(0>=b)){Log.d("getExtColVal() -> r : ",a);for(var c=0;c<b;c++)getID(d).innerHTML+='<option value="%s">%s</option>'.sprintf(a[c].col_value_id,
a[c].col_value)}}).catch(function(a){Log.d("error=",a)})},companies=function(){Log.d("companies() called...");axios.post("/common/company/clist").then(function(b){b=b.data;var a=b.length;Log.d("companies() -> data : ",b);for(var d="",c=0;c<a;c++)d+='<option value="%s">%s</option>'.sprintf(b[c].company_id,b[c].company_name);getID("selCompany").innerHTML+=d}).catch(function(b){Log.d("companies() -> error=",b)})};
window.addEventListener("DOMContentLoaded",function(){Log.d("DOMContentLoaded() called...");productList(1);makeDynamicSearchItem();companies()});getID("btnSearch").onclick=function(b){Log.d("btnSearch() called...");productList(1)};
