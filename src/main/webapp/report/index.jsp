<%@page import="Model.Permission"%>
<%@page import="utils.PermissionUtil"%>
<%@include file="../globalsub.jsp"  %>
<%@page import="java.util.List"%>
<%@page import="java.util.Arrays"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%    String pageName = "รายงาน Stock card";

    request.setAttribute("title", pageName);
    request.setAttribute("sublink", "../");
    request.setAttribute("css", Arrays.asList("../css/sweetalert.css", "../css/bootstrap-datetimepicker.min.css"));
    request.setAttribute("js", Arrays.asList("../js/sweetalert.min.js", "../js/bootstrap-datetimepicker.min.js", "../js/reportstockcard.js", "../js/SimpleTableCellEditor.js"));
    HttpSession _sess = request.getSession();
%>
<jsp:include  page="../theme/header.jsp" flush="true" />
<style>

</style>
<input type="hidden" value="" id="r_status">
<input type="hidden" value="<%=_sess.getAttribute("user")%>" id="userlogin">
<input type="hidden" value="<%=session.getAttribute("user")%>" id="user_code">
<input type="hidden" value="<%=session.getAttribute("branch_code")%>" id="user_branch">
<input type="hidden" value="${user_name}" id="user_namex">
<input type="hidden" id="hSubLink" value="${sublink}">

<div class="content-wrapper" style="background-color: #fff">
    <!-- Content Header (Page header) -->
    <div class="content-header">
        <div class="container-fluid">
            <div class="alert alert-dark   " role="alert" id="showAlertMsg" style='display:none'>
                <p id="alert-doc-msg">

                </p>
                <a href="javascript:;" class="alert-link btn-alert-ok" style="color:#fff">ตกลง</a>
            </div>
            <div id="doc_list" >
                <div class="row">
                    <div class="col-sm-6 col-md-3">
                        <label>สินค้า</label>
                        <input type="text" class="form-control"  style="width:100%"  id="item_code" placeholder="รหัสสินค้า">

                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>คลัง</label>
                        <select class=" select_whcode"  style="width:100%"  id="wh_code" >

                        </select>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>กลุ่มหลัก</label>
                        <select class=" select_groupmain"  style="width:100%"  id="group_main" >

                        </select>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>กลุ่มย่อย</label>
                        <select class=" select_groupsub"  style="width:100%"  id="group_sub" >

                        </select>
                    </div>
                </div>
                <div class="row" style="margin-top:15px">
                    <div class="col-sm-6 col-md-3">
                        <label>ยี่ห้อ</label>
                        <select class=" select_brand"  style="width:100%"  id="item_brand" >

                        </select>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>ประเภท</label>
                        <select class=" select_doctype" style="width:100%" id="doc_type" >
                           
                        </select>
                    </div>
                </div>
                <div class="row" style="margin-top:5px">
                    <div class="col-sm-12" style="margin-top:0.5rem;">
                        <button class="btn btn-success " onclick="_Process()"><i class="fa fa-play"></i> ประมวลผล</button>
                        <button class="btn btn-primary " id="copy"><i class="fa fa-clipboard"></i> Copy to clipboard</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12 table-responsive" style="margin-top:1rem;" >
                        <table class="table table-striped table-bordered" id="table_report">
                            <thead>
                                <tr style="background-color:#33ccff">
                                    <th class="text-center">รหัสสินค้า</th>
                                    <th class="text-center">ชื่อสินค้า</th>
                                    <th class="text-center">Barcode</th>
                                    <th class="text-center">คลัง</th>
                                    <th class="text-center">หน่วยนับ</th>
                                    <th class="text-center">ยอดคงเหลือ</th>
                                    <th class="text-center">System</th>
                                    <th class="text-center"></th>
                                </tr>
                            </thead>
                            <tbody id="show_list_detail">

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
<div class="modal fade" id="modalCust" tabindex="-1" role="dialog"  aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">ค้นหาลูกค้า</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-6">
                        <input type="text" class="form-control" id="search_cust_input" placeholder="ค้นหาลูกค้า">
                    </div>
                    <div class="col-sm-4">
                        <button  class="btn btn-success mb-2" onclick="_searchCust()">ค้นหา</button>
                    </div>

                </div>
                <ul class="list-group" id="list_search_cust" style="height: 65vh;overflow-y: scroll">


                </ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-warning" data-dismiss="modal">ยกเลิก</button>
            </div>
        </div>
    </div>
</div>

<jsp:include  page="../theme/footer.jsp" flush="true" />
<script>
    var a = new Date();
    var secrchByItem = false;
    var secrchByBarcode = false;
    var ses = new webkitSpeechRecognition();
    ses.continuous = true;
    ses.lang = 'TH'
    ses.onresult = function (e) {
        if (event.results.length > 0) {
            sonuc = event.results[event.results.length - 1];
            if (sonuc.isFinal) {
                var oldValue = $('#item').val();
                var newValue = sonuc[0].transcript;
                if (oldValue.length > 0)
                {
                    oldValue = oldValue + ' ';
                }
                if (newValue.indexOf('เริ่มใหม่') != -1) {
                    clearValue();
                    $("#item").text('เริ่มใหม่');
                } else {
                    $('#item').val(oldValue + sonuc[0].transcript);
                    secrchByItem = true;
                }
            }
        }
    }

    var $speechworking = false;



    function clearValue() {
        $('#item').val('');
    }

    function eylem() {
        if ($speechworking == false)
        {
            $speechworking = true;
            $('#speech').text('หยุดค้นหาด้วยเสียง');
            ses.start();
        } else {
            $('#speech').text('ค้นหาด้วยเสียง');
            $speechworking = false;
            ses.stop();
        }
    }
</script>