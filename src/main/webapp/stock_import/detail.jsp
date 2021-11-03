<%@include file="../globalsub.jsp"  %>
<%@page import="java.util.List"%>
<%@page import="java.util.Arrays"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>


<%    String pageName = "สร้างเอกสารนำเข้า";
    request.setAttribute("title", pageName);
    request.setAttribute("sublink", "../");
    String docno = "";
    String status = "0";
    if (request.getParameter("d") != null) {
        docno = request.getParameter("d");
    }
    if (request.getParameter("s") != null) {
        status = request.getParameter("s");
    }
    // request.setAttribute("css", Arrays.asList("../css/sweetalert.css", "../css/bootstrap-datetimepicker.min.css"));
    request.setAttribute("js", Arrays.asList("../js/sweetalert.min.js", "../conf.js", "../js/stock_import/form.js"));
    HttpSession _sess = request.getSession();
%>

<jsp:include  page="../theme/header.jsp" flush="true" />

<input type="hidden" value="" id="r_status">
<input type="hidden" value="<%=status%>" id="form-status">
<input type="hidden" value="<%=docno%>" id="form-mode">
<input type="hidden" value="<%=_sess.getAttribute("user")%>" id="userlogin">
<input type="hidden" value="<%=session.getAttribute("user")%>" id="user_code">
<input type="hidden" value="<%=_sess.getAttribute("wh_code")%>" id="user_wh">
<input type="hidden" value="${user_name}" id="user_namex">
<input type="hidden" id="hSubLink" value="${sublink}">
<div class="content-wrapper" style="background-color: #fff;padding-top:  1rem;">
    <!-- Main content -->
    <section class="content" >
        <div class="container-fluid" >
            <div class="row">
                <div class="col-lg-12">
                    <div class="card ">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-4">

                                    <label class="">เลขที่เอกสาร</label>
                                    <div class="">
                                        <input class="form-control" type="text"  id="doc_no" value="" readonly>
                                    </div>

                                </div>
                                <div class="col-4">

                                    <label class="">คลังสินค้า</label>
                                    <div class="">
                                        <input class="form-control" type="text"  id="wh_code" value="" readonly>
                                    </div>

                                </div>

                                <div class="col-4">

                                    <label class="">ผู้จัดทำ</label>
                                    <div class="">
                                        <input class="form-control" type="text"  id="creator_code" value="" readonly>
                                    </div>

                                </div>
                            </div>
                            <div class="row" style="margin-top:5px">
                                <div class="col-4">

                                    <label class="">เอกสารอ้างอิง</label>
                                    <div class="">
                                        <input class="form-control" type="text"  id="doc_ref" value="">
                                    </div>

                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label >ประเภทเอกสาร</label>
                                        <select class="form-control" id='doc_type'></select>
                                    </div>
                                </div>
                                <div class="col-4" >

                                    <label >ชนิด</label>
                                    <div style="margin-top: 8px">
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="trans_type" id="inlineRadio1" value="0" disabled style="color:#007bff !important">
                                            <label class="form-check-label" for="inlineRadio1" style="color:#000">รับ</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="trans_type" id="inlineRadio2" value="1" disabled>
                                            <label class="form-check-label" for="inlineRadio2" style="color:#000">จ่าย</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row" style="margin-top:5px">
                                <div class="col-8">
                                    <label class="">หมายเหตุ</label>
                                    <div class="">
                                        <input class="form-control" type="text"  id="remark" value="">
                                    </div>
                                </div>

                                <div class="col-4">
                                    <label for="formFile" class="form-label">นำเข้า Text File</label>
                                    <div>
                                        <input class="" type="file" id="formFile" style="margin-top:5px">
                                    </div>
                                </div>
                            </div>  
                            <hr style="margin-bottom: 10px;margin-top: 15px;" class="btn-addline">
                            <div id="editor"></div>
                            <div class="row">
                                <div class="col-2">
                                    <button class="btn btn-sm btn-success btn-addline" onclick="_addLine()">เพิ่มรายการสินค้า</button>
                                </div>
                                <div class="col-4">
                                    <input type="text" class="form-control form-control-sm" placeholder="scan barcode...." id="scanner">
                                </div>
                            </div>

                            <div class="row" style="margin-top: 10px">


                                <div class="col-12 table-responsive">
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th class="text-center">#</th>
                                                <th class="text-center">รหัสสินค้า</th>
                                                <th class="text-center">ชื่อสินค้า</th>
                                                <th class="text-center">หน่วยนับ</th>

                                                <th class="text-center">วันที่</th>

                                                <th class="text-center">จำนวน</th>
                                                <th class="text-center"></th>
                                            </tr>
                                        </thead>
                                        <tbody id="item_detail">

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-12">
                                    <a href="index.jsp" class="btn btn-warning btn-back">ยกเลิก</a>
                                    <button class="btn btn-success " id="btn_create"><i class="fa fa-save"></i> บันทึก</button>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="modal fade" id="modalSearch" tabindex="-1" role="dialog"  aria-hidden="true">
                        <div class="modal-dialog modal-lg" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">ค้นหาสินค้า</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <input type="hidden" id="line_index">
                                <input type="hidden" id="line_action">
                                <div class="modal-body">
                                    <div class="row">
                                        <div class="col-sm-4">
                                            <input type="text" class="form-control" id="search_name" placeholder="ค้นหาสินค้า">
                                        </div>
                                        <div class="col-sm-4">
                                            <input type="text" class="form-control" id="search_barcode" placeholder="บาร์โค้ด">
                                        </div>
                                        <div class="col-sm-4">
                                            <button  class="btn btn-success mb-2" onclick="_searchItem()">ค้นหา</button>
                                        </div>

                                    </div>
                                    <ul class="list-group" id="list_search_item">


                                    </ul>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-warning" data-dismiss="modal">ยกเลิก</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade" id="modalUnit" tabindex="-1" role="dialog"  aria-hidden="true">
                        <div class="modal-dialog modal-sm" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">เลือกหน่วยนับ</h5>
                                </div>
                                <div class="modal-body">
                                    <ul class="list-group" id="list_unit_item">


                                    </ul>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-warning" data-dismiss="modal">ยกเลิก</button>
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
                                                <label >สินค้า</label>
                                                <select class="form-control" style="width:100%" placeholder="เลือกสินค้า" id="itemsselect"></select>
                                                <input type="hidden" class="form-control" id="add_item_name" >
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="form-group">
                                                <label >หน่วยนับ</label>
                                                <select  class="form-control" id="add_unit_code" ></select>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="form-group">
                                                <label >วันที่</label>
                                                <input type="text" class="form-control" id="add_doc_date" >
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="form-group">
                                                <label >จำนวน</label>
                                                <input type="number" class="form-control" id="add_qty"  value="0">
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">ปิด</button>
                                    <button type="button" class="btn btn-primary" id="add_to_list">บันทึก</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modaltitle">แก้ไขรายการ <span id="edit_title"></span></h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="form-group">
                                                <label >สินค้า</label>
                                                <input type="text" class="form-control" id="edit_item" readonly>
                                                <input type="hidden" class="form-control" id="edit_index" >
                                                <input type="hidden" class="form-control" id="edit_item_code" >
                                                <input type="hidden" class="form-control" id="edit_item_name" >
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="form-group">
                                                <label >หน่วยนับ</label>
                                                <select  class="form-control" id="edit_unit_code" ></select>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="form-group">
                                                <label >วันที่</label>
                                                <input type="text" class="form-control" id="edit_doc_date" >
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="form-group">
                                                <label >จำนวน</label>
                                                <input type="number" class="form-control" id="edit_qty"  value="0">
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">ปิด</button>
                                    <button type="button" class="btn btn-primary" id="edit_to_list">บันทึก</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
<jsp:include  page="../theme/footer.jsp" flush="true" />
