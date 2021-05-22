<%@page import="Model.Permission"%>
<%@page import="utils.PermissionUtil"%>
<%@include file="../globalsub.jsp"  %>
<%@page import="java.util.List"%>
<%@page import="java.util.Arrays"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%    String pageName = "ประวัติการอนุมัติ";

    request.setAttribute("title", pageName);
    request.setAttribute("sublink", "../");
    request.setAttribute("css", Arrays.asList("../css/sweetalert.css", "../css/bootstrap-datetimepicker.min.css"));
    request.setAttribute("js", Arrays.asList("../js/sweetalert.min.js", "../js/bootstrap-datetimepicker.min.js", "../js/historyuser/historyuser.js", "../js/_globals.js"));

    HttpSession _sess = request.getSession();
%>
<jsp:include  page="../theme/header.jsp" flush="true" />
<style>
    table {
        border-collapse: collapse;
    }
    body {
        color: black;
    }
    table, th, td {

        border: 1px solid #D3D3D3 ;
        padding:0px;
    }
    tr:hover{
        background-color: #F0F8FF;
    }


</style>
<input type="hidden" value="" id="r_status">
<input type="hidden" value="<%=_sess.getAttribute("user")%>" id="userlogin">
<input type="hidden" value="<%=session.getAttribute("user")%>" id="user_code">
<input type="hidden" value="<%=session.getAttribute("branch_code")%>" id="user_branch">
<input type="hidden" value="${user_name}" id="user_namex">
<input type="hidden" id="hSubLink" value="${sublink}">

<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <div class="content-header">
        <div class="container-fluid">
            <div id="doc_list" >
                <div class="row">
                    <div class="col-sm-12" style="margin-top:0.2rem;" >
                        <div class="input-group">
                            <input type="text" class="form-control" value="" id="search_text" placeholder="ค้นหา เลขที่เอกสาร หรือ ลูกค้า...">
                            <div class="input-group-append">
                                <span class="input-group-text"><i class="fa fa-search"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12" style="margin-top:0.5rem;" id="show_list_detail">

                    </div>
                </div>
            </div>
            <div id="create_doc" style="display:none">

                <div class="row">
                    <div class="col-sm-6 col-md-3">
                        <label>เลขที่เอกสาร</label>
                        <input type="text" class="form-control form-control-sm" readonly id="doc_no" style="height: 34px;"/>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>วันที่เอกสาร</label>
                        <input type="text" class="form-control form-control-sm" readonly id="doc_date" style="height: 34px;"/>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>รหัสลูกค้า</label>
                        <input type="text" class="form-control form-control-sm" readonly id="cust_code" style="height: 34px;"/>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>สาขา</label>
                        <input type="text" class="form-control form-control-sm" readonly id="branch_code" style="height: 34px;"/>

                    </div>

                </div>
                <div class="row">
                    <div class="col-sm-6 col-md-3">
                        <label>ประเภทการขาย</label>
                        <select class="form-control form-control-sm" id="sale_type" disabled>
                            <option value="0">ขายเงินเชื่อ</option>
                            <option value="1">ขายเงินสด</option>
                        </select>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>ประเภทภาษี</label>
                        <select class="form-control form-control-sm" id="vat_type" disabled>
                            <option value="0">ภาษีแยกนอก</option>
                            <option value="1">ภาษีรวมใน</option>
                            <option value="2">ภาษีอัตราศูนย์</option>
                        </select>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>ผู้เปิดใบอนุมัติ</label>
                        <input type="text" class="form-control form-control-sm" id="user_creator" readonly/>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>พนักงานขาย</label>
                        <input type="text" class="form-control form-control-sm" id="saler_code" readonly/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6 col-md-6">
                        <label>หมายเหตุ</label>
                        <textarea type="text" class="form-control form-control-sm" id="remark" readonly></textarea>
                    </div>
                </div>
                <div class="row">

                    <div class="col-sm-6 col-md-6" style="margin-top:2.9rem;">

                        <button class="btn btn-info " onclick="_backtolist()"><i class="fa fa-undo"></i> กลับ</button>
                    </div>
                </div>
                <div class="row"  style="margin-top:1rem;">


                </div>
                <div class="table-responsive" style="margin-top:1rem;">
                    <table id="" class="table table-striped" style="width:100%;">
                        <thead id="table_header">
                            <tr>
                                <th rowspan="3" class="text-center bg-primary" >ลำดับ</th>
                                <th rowspan="3" class="text-center bg-primary" style="min-width: 300px;">สินค้า</th>
                                <th rowspan="3" class="text-center bg-primary" >หน่วยนับ</th>
                                <th class="text-center bg-success" colspan="6" >ต้นทุน</th>
                                <th class="text-center bg-warning" colspan="6" >ค่าใช้จ่าย</th>
                                <th class="text-center bg-danger" colspan="8" >ขายและกำไร</th>
                            </tr>
                            <tr>

                                <th class="text-center bg-success">จำนวน</th>
                                <th class="text-center bg-success">น้ำหนัก/หน่วยkg</th>
                                <th class="text-center bg-success">น้ำหนัก/รวมkg</th>
                                <th class="text-center bg-success">ซื้อล่าสุด</th>
                                <th class="text-center bg-success">ราคาโรงงาน</th>
                                <th nowrap class="text-center bg-success">รวมทุน</th>

                                <th nowrap class="text-center bg-warning">ค่ารถ</th>
                                <th nowrap class="text-center bg-warning">ต่างแขวง</th>
                                <th nowrap class="text-center bg-warning">เอกสาร</th>
                                <th nowrap class="text-center bg-warning">ภาษี</th>
                                <th nowrap class="text-center bg-warning">ต่างแขวง</th>
                                <th nowrap class="text-center bg-warning">ต่อชิ้น</th>

                                <th class="text-center bg-danger">ทุนลาว/หน่วย</th>
                                <th class="text-center bg-danger">มูลค่าต้นทุน(รวม)</th>
                                <th class="text-center bg-danger">ราคาขาย</th>
                                <th class="text-center bg-danger">ส่วนลด</th>
                                <th class="text-center bg-danger">ขายสุทธิ</th>
                                <th class="text-center bg-danger">รวมมูลค่าขาย</th>
                                <th class="text-center bg-danger">กำไร</th>
                                <th class="text-center bg-danger">%กำไร</th>

                            </tr>
                            <tr>
                                <td class="text-right" id="total_cost_qty"></td>
                                <td class="text-right" id="total_cost_weight"></td>
                                <td class="text-right" id="total_cost_sum_weight"></td>
                                <td class="text-right" id="total_cost_purchases"></td>
                                <td class="text-right" id="total_cost_factory_price"></td>
                                <td class="text-right" id="total_cost_sum_cost"></td>


                                <td class="text-right editMe"  id="total_exp_car"></td>
                                <td class="text-right editMe"  id="total_exp_other"></td>
                                <td class="text-right editMe"  id="total_exp_doc"></td>
                                <td class="text-right editMe"  id="total_exp_tax"></td>
                                <td class="text-right editMe"  id="total_exp_other2"></td>
                                <td class="text-right"  id="total_exp_each"></td>

                                <td class="text-right" id="total_sale_sum_lao_cost"></td>
                                <td class="text-right" id="total_sale_sum_cost"></td>
                                <td class="text-right" id="total_sale_price"></td>
                                <td class="text-right" ></td>
                                <td class="text-right" id="total_selling_price"></td>
                                <td class="text-right" id="total_sale_sum_amount"></td>
                                <td class="text-right" id="total_sale_profit"></td>
                                <td class="text-right" id="total_sale_percent_profit"></td>

                            </tr>
                        </thead>
                        <tbody id="item_detail">

                        </tbody>
                    </table>
                </div>
            </div>

            <div id="create_doc2" style="display:none">
                <div class="row">
                    <div class="col-sm-6 col-md-3">
                        <label>เลขที่เอกสาร</label>
                        <input type="text" class="form-control form-control-sm" readonly id="doc_no2" style="height: 34px;"/>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>วันที่เอกสาร</label>
                        <input type="date" class="form-control form-control-sm" readonly id="doc_date2" style="height: 34px;"/>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>รหัสลูกค้า</label>
                        <input type="text" class="form-control form-control-sm" readonly id="cust_code2" style="height: 34px;"/>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>สาขา</label>
                        <input type="text" class="form-control form-control-sm" readonly id="branch_code2" style="height: 34px;"/>
                    </div>

                </div>
                <div class="row">
                    <div class="col-sm-6 col-md-3">
                        <label>ประเภทการขาย</label>
                        <select class="form-control form-control-sm" readonly id="sale_type2"  style="height: 34px;">
                            <option value="0">ขายเงินเชื่อ</option>
                            <option value="1">ขายเงินสด</option>
                        </select>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>ประเภทภาษี</label>
                        <select class="form-control form-control-sm" readonly id="vat_type2" style="height: 34px;" >
                            <option value="0">ภาษีแยกนอก</option>
                            <option value="1">ภาษีรวมใน</option>
                            <option value="2">ภาษีอัตราศูนย์</option>
                        </select>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>ผู้เปิดใบอนุมัติ</label>
                        <input type="text" class="form-control form-control-sm" readonly value='' id='user_creator2' style="height: 34px;"/>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>พนักงานขาย</label>
                        <input type="text" class="form-control form-control-sm" readonly id="saler_code2" style="height: 34px;"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6 col-md-3">
                        <label>ชื่อโครงการ</label>
                        <input type="text" class="form-control form-control-sm" readonly id='project_name' style="height: 34px;"/>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>ผู้ติดต่อ</label>
                        <input type="text" class="form-control form-control-sm" readonly id='contact' style="height: 34px;"/>
                    </div>
                    <div class="col-sm-6 col-md-3" style="padding-top: 35px;text-align: center">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="radio_rival" id="radio_rival1" value="0" disabled checked>
                            <label class="form-check-label" for="radio_rival1"><b>ไม่มีคู่แข่ง</b></label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="radio_rival" id="radio_rival2" disabled value="1">
                            <label class="form-check-label" for="radio_rival2"><b>มีคู่แข่ง</b></label>
                        </div>
                    </div>

                </div>
                <div class="row">
                    <div class="col-sm-6 col-md-6">
                        <label>หมายเหตุ</label>
                        <textarea type="text" class="form-control form-control-sm" readonly id="remark2" ></textarea>
                    </div>
                </div>

                <div class="row"  style="margin-top:0.5rem;">
                    <div class="col-sm-6 col-md-6" style="margin-top:2.9rem;">
                        <button class="btn btn-success approve_doc_sd2" ><i class="fa fa-check"></i> อนุมัติ</button>
                        <button class="btn btn-danger " onclick="_rejeckDoc2()"><i class="fa fa-share"></i> ไม่อนุมัติ</button>
                        <button class="btn btn-info " onclick="_backtolist()"><i class="fa fa-undo"></i> กลับ</button>
                    </div>
                </div>
                <div class="table-responsive" style="margin-top:1rem;">
                    <table id="advancedEditableTable" class="table table-striped" style="width:100%;">
                        <thead id="table_header">
                            <tr>
                                <th rowspan="2" class="text-center bg-primary" >ลำดับ</th>
                                <th rowspan="2" class="text-center bg-primary" style="min-width: 300px;">สินค้า</th>
                                <th rowspan="2" nowrap class="text-center bg-primary" >หน่วยนับ</th>

                                <th nowrap class="text-center bg-success">จำนวน</th>
                                <th nowrap class="text-center bg-success">ซื้อล่าสุด</th>
                                <th nowrap class="text-center bg-success">ราคาทุนไทย</th>

                                <th nowrap class="text-center bg-warning">ค่าใช้จ่ายนำเข้า</th>

                                <th nowrap class="text-center bg-danger">ราคาทุนลาว</th>
                                <th nowrap class="text-center bg-danger">รวมทุน</th>
                                <th nowrap class="text-center bg-danger">ราคาขาย</th>
                                <th nowrap class="text-center bg-danger">ส่วนลด</th>
                                <th nowrap class="text-center bg-danger">ขายสุทธิ</th>
                                <th nowrap class="text-center bg-danger">รวมมูลค่าขาย</th>
                                <th nowrap class="text-center bg-danger">กำไร</th>
                                <th nowrap class="text-center bg-danger">%กำไร</th>

                            </tr>

                            <tr>

                                <td class="text-right" id="total_cost_qty2"></td>
                                <td class="text-right" id="total_cost_purchases2"></td>
                                <td class="text-right" id="total_cost_factory_price2"></td>

                                <td class="text-right"  id="total_exp_each2"></td>

                                <td class="text-right" id="total_sale_sum_lao_cost2"></td>
                                <td class="text-right" id="total_sale_sum_cost2"></td>
                                <td class="text-right" id="total_sale_price2"></td>
                                <td class="text-right" ></td>
                                <td class="text-right" id="total_selling_price2"></td>
                                <td class="text-right" id="total_sale_sum_amount2"></td>
                                <td class="text-right" id="total_sale_profit2"></td>
                                <td class="text-right" id="total_sale_percent_profit2"></td>

                            </tr>
                        </thead>
                        <tbody id="item_detail2">

                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modalCopySO" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog"  aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">คักลอก จากเอกสาร  <span id="so_copy_doc_no_title"></span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-6 col-md-3">
                        <label>เลขที่เอกสาร</label>
                        <input type="text" class="form-control form-control-sm" id="so_copy_doc_no" style="height: 34px;"/>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>วันที่เอกสาร</label>
                        <input type="date" class="form-control form-control-sm" id="so_copy_doc_date" style="height: 34px;"/>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>รหัสลูกค้า</label>
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" class="form-control" id="so_copy_cust_code"  style="height: 34px;">
                            <div class="input-group-append">
                                <span class="input-group-text so_copy_cust_box_click" style="cursor: pointer"><i class="fa fa-search"></i></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>สาขา</label>
                        <select class="form-control form-control-sm branch_code" style="height: 34px;" id="so_copy_branch_code" disabled>

                        </select>
                    </div>

                </div>
                <div class="row">
                    <div class="col-sm-6 col-md-3">
                        <label>ประเภทการขาย</label>
                        <select class="form-control form-control-sm" id="so_copy_sale_type"  style="height: 34px;">
                            <option value="0">ขายเงินเชื่อ</option>
                            <option value="1">ขายเงินสด</option>
                        </select>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>ประเภทภาษี</label>
                        <select class="form-control form-control-sm" id="so_copy_vat_type" style="height: 34px;" >
                            <option value="0">ภาษีแยกนอก</option>
                            <option value="1">ภาษีรวมใน</option>
                            <option value="2">ภาษีอัตราศูนย์</option>
                        </select>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>ผู้เปิดใบอนุมัติ</label>
                        <input type="text" class="form-control form-control-sm" readonly value='' id='so_copy_user_creator' style="height: 34px;"/>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>พนักงานขาย</label>
                        <select class=" select_sale" id="so_copy_saler_code" >

                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6 col-md-3">
                        <label>สถานที่ส่ง</label>
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" class="form-control" id="so_copy_contactor" readonly style="height: 34px;">
                            <div class="input-group-append">
                                <span class="input-group-text so_copy_contactor_box_click" style="cursor: pointer"><i class="fa fa-search"></i></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-md-9">
                        <label>หมายเหตุ</label>
                        <input type="text" class="form-control form-control-sm"  style="height: 34px;" id="so_copy_remark" >
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-warning" data-dismiss="modal">ยกเลิก</button>
                <button type="button" class="btn btn-success" id="so_btn_copy_save">สร้างเอกสาร</button>
            </div>
        </div>
    </div>
</div>



<div class="modal fade" id="modalCopyCustSO" tabindex="-1" role="dialog"  aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" >ค้นหาลูกค้า</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-6">
                        <input type="text" class="form-control" id="so_search_copy_cust_input" placeholder="ค้นหาลูกค้า">
                    </div>
                    <div class="col-sm-4">
                        <button  class="btn btn-success mb-2" onclick="_searchCopyCustSO()">ค้นหา</button>
                    </div>

                </div>
                <ul class="list-group" id="so_list_search_copy_cust">


                </ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-warning" data-dismiss="modal">ยกเลิก</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modalCopyContactorSO" tabindex="-1" role="dialog"  aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="">ค้นหาสถานที่ส่ง</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-6">
                        <input type="text" class="form-control" id="so_search_copy_contactor_input" placeholder="ค้นหาสถานที่ส่ง">
                    </div>
                    <div class="col-sm-4">
                        <button  class="btn btn-success mb-2" onclick="_searchCopyContactSO()">ค้นหา</button>
                    </div>

                </div>
                <ul class="list-group" id="so_list_search_copy_contact">


                </ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-warning" data-dismiss="modal">ยกเลิก</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modalCopy" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog"  aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">คักลอก จากเอกสาร  <span id="copy_doc_no_title"></span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-6 col-md-3">
                        <label>เลขที่เอกสาร</label>
                        <input type="text" class="form-control form-control-sm" id="copy_doc_no" style="height: 34px;"/>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>วันที่เอกสาร</label>
                        <input type="date" class="form-control form-control-sm" id="copy_doc_date" style="height: 34px;"/>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>รหัสลูกค้า</label>
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" class="form-control" id="copy_cust_code"  style="height: 34px;">
                            <div class="input-group-append">
                                <span class="input-group-text copy_cust_box_click" style="cursor: pointer"><i class="fa fa-search"></i></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>สาขา</label>
                        <select class="form-control form-control-sm branch_code" style="height: 34px;" id="copy_branch_code" disabled>

                        </select>
                    </div>

                </div>
                <div class="row">
                    <div class="col-sm-6 col-md-3">
                        <label>ประเภทการขาย</label>
                        <select class="form-control form-control-sm" id="copy_sale_type"  style="height: 34px;">
                            <option value="0">ขายเงินเชื่อ</option>
                            <option value="1">ขายเงินสด</option>
                        </select>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>ประเภทภาษี</label>
                        <select class="form-control form-control-sm" id="copy_vat_type" style="height: 34px;" >
                            <option value="0">ภาษีแยกนอก</option>
                            <option value="1">ภาษีรวมใน</option>
                            <option value="2">ภาษีอัตราศูนย์</option>
                        </select>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>ผู้เปิดใบอนุมัติ</label>
                        <input type="text" class="form-control form-control-sm" readonly value='' id='copy_user_creator' style="height: 34px;"/>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>พนักงานขาย</label>
                        <select class=" select_sale" id="copy_saler_code" >

                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6 col-md-3">
                        <label>ชื่อโครงการ</label>
                        <input type="text" class="form-control form-control-sm" value='' id='copy_project_name' style="height: 34px;"/>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <label>ผู้ติดต่อ</label>
                        <input type="text" class="form-control form-control-sm" value='' id='copy_contact' style="height: 34px;"/>
                    </div>
                    <div class="col-sm-6 col-md-6" style="padding-top: 35px;text-align: center">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="copy_radio_rival" id="copy_radio_rival1" value="0" checked>
                            <label class="form-check-label" for="radio_rival1"><b>ไม่มีคู่แข่ง</b></label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="copy_radio_rival" id="copy_radio_rival2" value="1">
                            <label class="form-check-label" for="radio_rival2"><b>มีคู่แข่ง</b></label>
                        </div>
                    </div>

                </div>
                <div class="row">
                    <div class="col-sm-6 col-md-3">
                        <label>สถานที่ส่ง</label>
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" class="form-control" id="copy_contactor" readonly style="height: 34px;">
                            <div class="input-group-append">
                                <span class="input-group-text copy_contactor_box_click" style="cursor: pointer"><i class="fa fa-search"></i></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-md-9">
                        <label>หมายเหตุ</label>
                        <input type="text" class="form-control form-control-sm"  style="height: 34px;" id="copy_remark" >
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-warning" data-dismiss="modal">ยกเลิก</button>
                <button type="button" class="btn btn-success" id="btn_copy_save">สร้างเอกสาร</button>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="modalCopyCust" tabindex="-1" role="dialog"  aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" >ค้นหาลูกค้า</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-6">
                        <input type="text" class="form-control" id="search_copy_cust_input" placeholder="ค้นหาลูกค้า">
                    </div>
                    <div class="col-sm-4">
                        <button  class="btn btn-success mb-2" onclick="_searchCopyCust()">ค้นหา</button>
                    </div>

                </div>
                <ul class="list-group" id="list_search_copy_cust">


                </ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-warning" data-dismiss="modal">ยกเลิก</button>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="modalCopyContactor" tabindex="-1" role="dialog"  aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="">ค้นหาสถานที่ส่ง</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-6">
                        <input type="text" class="form-control" id="search_copy_contactor_input" placeholder="ค้นหาสถานที่ส่ง">
                    </div>
                    <div class="col-sm-4">
                        <button  class="btn btn-success mb-2" onclick="_searchCopyContact()">ค้นหา</button>
                    </div>

                </div>
                <ul class="list-group" id="list_search_copy_contact">


                </ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-warning" data-dismiss="modal">ยกเลิก</button>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="approveModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">อนุมัติเอกสาร <span id="modal-docno"></span></h5>
            </div>
            <div class="modal-body">
                <input type="hidden" id="hidden_docno">
                <form>
                    <div class="form-group row">
                        <label for="branch_code" class="col-sm-2 col-form-label">สาขา</label>
                        <div class="col-sm-10">
                            <select class="form-control" id="branch_code">

                            </select>
                        </div>
                    </div>
                    <fieldset class="form-group">
                        <div class="row">
                            <legend class="col-form-label col-sm-2 pt-0">ประเภท</legend>
                            <div class="col-sm-10">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="1" checked>
                                    <label class="form-check-label" for="gridRadios1">
                                        ใบเสนอราคา
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="2">
                                    <label class="form-check-label" for="gridRadios2">
                                        ใบสั่งซื้อ/สั่งจอง
                                    </label>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">ยกเลิก</button>
                <button type="button" class="btn btn-success" onclick="_approveDoc()">ยืนยัน</button>
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