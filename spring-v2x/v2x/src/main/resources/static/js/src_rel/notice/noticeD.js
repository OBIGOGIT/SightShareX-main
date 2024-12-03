var pageChange=function(b,a){Log.d("pageChange() -> page : ",b," size: ",a);companies.getSelectCompany(b)},noticeTypes=function(){Log.d("noticeTypes() called...");axios.post("/notice/type/clist.do").then(function(b){b=b.data;var a=b.length;Log.d("noticeTypes() -> data : ",b);for(var c="",d=0;d<a;d++)c+='<option value="%s">%s</option>'.sprintf(b[d].id,b[d].type);getID("selNoticeType").innerHTML+=c;"I"!=queryString("mode")&&noticeDetailInfo()}).catch(function(b){Log.d("noticeTypes() -> error=",b)})},
noticeDetailInfo=function(){Log.d("noticeDetailInfo() called...");var b=new URLSearchParams;b.append("seq_no",queryString("seq_no"));Log.d("params : ",b);axios.post("/notice/detail",b).then(function(a){a=a.data;null!=a&&(Log.d("noticeDetailInfo() -> data : ",a),getID("txtSubject").value=a.subject,getID("selNoticeType").value=a.type,getID("txtContent").value=a.content,getID("selStatus").value=a.status,"0"==a.fixed?getID("chkFixed").checked=!1:getID("chkFixed").checked=!0,getID("txtCreatedUser").value=
a.created_user,getID("txtUpdatedUser").value=a.updated_user,getID("txtCreatedDate").value=utcToLoc(a.created_date),getID("txtUpdatedDate").value=utcToLoc(a.modified_date))}).catch(function(a){Log.d("noticeDetailInfo() -> error=",a)})},companies={datas:[],bChanged:!1,getSelectCompany:function(b){var a=new URLSearchParams;a.append("curPage",b);a.append("pageUnit",PAGE_UNIT);Log.d("params : ",a);axios.post("/manage/company/list",a).then(function(a){Log.d("ajaxcompanyL.do -> response.data : ",a.data);
var b=a.data;0>=b.length||(companies.setDatas(b),a=b[0].page,b=Math.ceil(b[0].totalcnt/PAGE_UNIT),Log.d("curPage : ",a),Log.d("pageCount : ",b),"undefined"!=typeof Pagination&&(Pagination._pageNum=b,Pagination._initPage=a,Pagination.Init(document.getElementById("pagination"),{size:Pagination._pageNum,page:Pagination._initPage,step:3})),"I"!=queryString("mode")&&companies.getSelectedCompany(queryString("seq_no")))}).catch(function(a){Log.d("error=",a)})},setDatas:function(b){companies.datas=[];var a=
b.length;if(!(0>=a)){for(var c=0;c<a;c++)companies.datas.push({select:!1,companyId:b[c].companyid,companyName:b[c]["Company Name"],domain:b[c].Domain,updated:utcToLoc(b[c]["Updated Date"])});Log.d("companies.datas=",companies.datas);companies.setUI()}},changeSelect:function(b,a){for(var c=0;c<this.datas.length;c++)if(this.datas[c].companyId==b){this.datas[c].select=a.checked;this.bChanged=!0;break}},setUI:function(){for(var b=getID("select-companies").innerHTML="",a="",c=0;c<companies.datas.length;c++)a+=
companies.datas[c].select?"<td><label class='ob-customcheck'><input type='checkbox' onclick='companies.changeSelect(%s, this)' style='display: none;' checked><span class='ob-checkmark'></span></label></td>".sprintf(companies.datas[c].companyId):"<td><label class='ob-customcheck'><input type='checkbox' onclick='companies.changeSelect(%s, this)' style='display: none;'><span class='ob-checkmark'></span></label></td>".sprintf(companies.datas[c].companyId),a+="<td>%s</td>".sprintf(companies.datas[c].companyName),
a+="<td>%s</td>".sprintf(companies.datas[c].domain),a+="<td>%s</td>".sprintf(companies.datas[c].updated),b+="<tr>%s</tr>".sprintf(a),a="";getID("select-companies").innerHTML=b},getSelectedCompany:function(b){var a=new URLSearchParams;a.append("seq_no",b);Log.d("params : ",a);axios.post("/notice/company/selected",a).then(function(a){Log.d("selectedcompany.do -> response.data : ",a.data);a=a.data;var b=a.length;if(!(0>=a.length)){for(var c=0;c<companies.datas.length;c++)for(var e=0;e<b;e++)companies.datas[c].companyId==
a[e].companyid&&(companies.datas[c].select=!0);companies.setUI()}}).catch(function(a){Log.d("companies.getSelectedCompany() -> error=",a)})},updateSelectedCompany:function(b){Log.d("updateSelectedCompany() -> seqNo:",b);if(null==b||""==b)Log.d("updateSelectedCompany() -> notice seqNo required."),modalAlert("Notice ID is required.");else{var a=new URLSearchParams;a.append("seqNo",b);a.append("curCompanys",JSON.stringify(this.datas));Log.d("companies.updateSelectedCompany() -> params : ",a);axios.post("/notice/company/selected/modify",
a).then(function(a){Log.d("response.data : ",a.data);"ok"==a.data.result&&(Log.d("companies.updateSelectedCompany() -> ok2"),mv("/notice/list.do"))}).catch(function(a){Log.d("companies.updateSelectedCompany() -> error=",a)})}}};window.addEventListener("DOMContentLoaded",function(){Log.d("noticeD.js -> DOMContentLoaded() called...");noticeTypes();companies.getSelectCompany(1)});
null!=getID("btnSave")&&(getID("btnSave").onclick=function(b){Log.d("noticeD.js -> btnSave() called...");var a="",c=getVal("txtSubject");if(""==c)modalAlert("Subject is required.");else{var d=getVal("txtContent");""==d?modalAlert("Content is required."):(b=new URLSearchParams,b.append("subject",c),b.append("content",d),b.append("type",getVal("selNoticeType")),b.append("status",getVal("selStatus")),getID("chkFixed").checked?b.append("fixed","1"):b.append("fixed","0"),c="","I"==queryString("mode")?
c="/notice/add":(a=queryString("seq_no"),b.append("seq_no",a),c="/notice/modify"),axios.post(c,b).then(function(b){Log.d("response.data : ",b.data);"failed"==b.data.result?modalAlert("Processing failed."):"redirect"==b.data.result?mv(b.data.cmd):(Log.d("noticeD.js -> btnSave() ok"),"I"==queryString("mode")&&(a=b.data.desc),Log.d("btnSave() -> companies.bChanged : ",companies.bChanged,"seqNo:",a),companies.bChanged?companies.updateSelectedCompany(a):mv("/notice/list.do"))}).catch(function(a){Log.d("btnSave() -> error=",
a)}))}});getID("btnList").onclick=function(b){Log.d("noticeD.js -> btnList() called...");mv("/notice/list.do")};getID("selectAll").onchange=function(b){Log.d("selectAll() -> e.target.checked : ",b.target.checked);for(var a=0;a<companies.datas.length;a++)companies.datas[a].select=b.target.checked,companies.bChanged=!0;companies.setUI()};
