<%@page import="Model.Permission"%>
<%@page import="utils.PermissionUtil"%>
<%@include file="../globalsub.jsp"  %>
<%@page import="java.util.List"%>
<%@page import="java.util.Arrays"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%    String pageName = "บันทึกรายการ";

    request.setAttribute("title", pageName);
    request.setAttribute("sublink", "../");
    request.setAttribute("css", Arrays.asList("../css/sweetalert.css", "../css/bootstrap-datetimepicker.min.css"));
    request.setAttribute("js", Arrays.asList("../js/sweetalert.min.js", "../js/bootstrap-datetimepicker.min.js", "../conf.js","../js/stock_card/stock_card.js", "../js/SimpleTableCellEditor.js"));
    HttpSession _sess = request.getSession();
%>
<jsp:include  page="../theme/header.jsp" flush="true" />
<style>
    #overlay {
        position: fixed;
        display: none;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.5);
        z-index: 2;
        cursor: pointer;
    }

    #text{
        position: absolute;
        top: 50%;
        left: 50%;
        color: white;
        transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
    }

    .loader {
        border: 16px solid #f3f3f3;
        border-radius: 50%;
        border-top: 16px solid #3498db;
        width: 120px;
        height: 120px;
        -webkit-animation: spin 2s linear infinite; /* Safari */
        animation: spin 2s linear infinite;
    }

    /* Safari */
    @-webkit-keyframes spin {
        0% { -webkit-transform: rotate(0deg); }
        100% { -webkit-transform: rotate(360deg); }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

</style>
<input type="hidden" value="" id="r_status">
<input type="hidden" value="<%=_sess.getAttribute("user")%>" id="userlogin">
<input type="hidden" value="<%=_sess.getAttribute("wh_code")%>" id="user_wh">
<input type="hidden" value="<%=session.getAttribute("user")%>" id="user_code">
<input type="hidden" value="${user_name}" id="user_namex">
<input type="hidden" id="hSubLink" value="${sublink}">

<div class="content-wrapper" style="background-color: #fff">
    <!-- Content Header (Page header) -->

    <div class="content-header">
        <div class="container-fluid">
            <div id="overlay" class="">
                <img  id="text" src="${sublink}assets/img/loading.gif">
            </div>
            <div class="row" style="margin-top:1rem">
                <div class="col-4 offset-1">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="Scan barcode" id="scanner">
                    </div>
                </div>
                <div class="col-4 offset-1">
                    <div class="input-group mb-3">
                        <select class="form-control" style="" placeholder="เลือกสินค้า" id="itemsselect"></select>
                    </div>
                </div>
            </div>
            <div class="row" >
                <div class="col-12">
                    <h5>สินค้า:<span id="item_code"></span> ~ <span id="item_name"></span></span><span style="margin-left: 30px">คลัง:<span id="wh_code"></span>~<span id="wh_name"></span></span><span style="margin-left: 30px">หน่วยนับ:<span id="unit_code"></span>(<span id="unit_name"></span>)</span></h5>
                </div>
            </div>
            <hr>
            <div class="row" >
                <div class="col-12">
                    <h5>แสดง <span id="item_show">0</span> จากทั้งหมด <span id="total_item">0</span> รายการ <span style="margin-left: 20px"><button class="btn btn-sm btn-primary btn-showmore">โหลดเพิ่ม10รายการ</button></span> <span style="margin-left: 10px"><button class="btn btn-sm btn-success" id='new_item'>เพิ่มรายการใหม่</button></span> <span style="margin-left: 10px"><button class="btn btn-sm btn-info" id='copy'>Copy to Clipboard</button></span></h5>

                </div>
                <div class="col-12"style="margin-top: 10px;">
                    <div class="table-responsive" style="max-height: 72vh;">
                        <table class="table table-hover table-bordered " id="table_report">
                            <thead>
                                <tr style="background-color: #99ffff;" >
                                    <th nowrap class="text-center">วันที่</th>
                                    <th nowrap class="text-center">เวลา</th>
                                    <th nowrap class="text-center">เลขที่อ้างอิง</th>
                                    <th nowrap class="text-center">ประเภทเอกสาร</th>
                                    <th nowrap class="text-center">เข้า</th>
                                    <th nowrap class="text-center">ออก</th>
                                    <th nowrap class="text-center">คงเหลือ</th>
                                    <th class="text-center">ผู้บันทึก</th>
                                    <th class="text-center">หมายเหตุ</th>
                                </tr>
                            </thead>
                            <tbody id='body_detail'>

                            </tbody>

                        </table>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="productModal" tabindex="-1" role="dialog" >
                <div class="modal-dialog modal-lg " role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modaltitle">รายการสินค้า</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="table-responsive">
                                <table class="table table-hover table-striped" id="table-item-select">
                                    <thead>
                                    <th class="text-center">รหัส</th>
                                    <th class="text-center">ชื่อ</th>
                                    <th class="text-center">หน่วยนับ</th>
                                    </thead>
                                    <tbody id="item_body_detail">

                                    </tbody>
                                </table>
                            </div>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">ปิด</button>

                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="createModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modaltitle">เพิ่มรายการ</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label >วันที่</label>
                                        <input type="date" class="form-control" id="doc_date" >
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-group">
                                        <label >เลขที่อ้างอิง</label>
                                        <input type="text" class="form-control" id="doc_ref" >
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-group">
                                        <label >ประเภทเอกสาร</label>
                                        <select class="form-control" id='doc_type'></select>
                                    </div>
                                </div>
                                <div class="col-12">

                                    <label >ชนิด</label>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="trans_type" id="inlineRadio1" value="0" disabled style="color:#007bff !important">
                                        <label class="form-check-label" for="inlineRadio1" style="color:#000">รับ</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="trans_type" id="inlineRadio2" value="1" disabled>
                                        <label class="form-check-label" for="inlineRadio2" style="color:#000">จ่าย</label>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-group">
                                        <label >จำนวน</label>
                                        <input type="number" class="form-control" id="qty"  value="0">
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-group">
                                        <label >หมายเหตุ</label>
                                        <textarea class="form-control" id="remark" ></textarea>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-group">
                                        <label >ผู้บันทึก</label>
                                        <input type="text" class="form-control" readonly="true" id="creator_code" value="">
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">ปิด</button>
                            <button type="button" class="btn btn-primary" id="create_save">บันทึก</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>








<jsp:include  page="../theme/footer.jsp" flush="true" />