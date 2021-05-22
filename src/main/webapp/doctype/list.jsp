<%@page import="Model.Permission"%>
<%@page import="utils.PermissionUtil"%>
<%@include file="../globalsub.jsp"  %>
<%@page import="java.util.List"%>
<%@page import="java.util.Arrays"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%// ###################    
    String pageName = "ประเภทเอกสาร";

    request.setAttribute("title", pageName);
    request.setAttribute("sublink", "../");
    request.setAttribute("css", Arrays.asList("../css/sweetalert.css", "../css/bootstrap-datetimepicker.min.css"));
    request.setAttribute("js", Arrays.asList("../js/sweetalert.min.js", "../js/bootstrap-datetimepicker.min.js", "../js/doctype/list.js", "../js/_globals.js"));

    HttpSession _session = request.getSession();
%>
<jsp:include  page="../theme/header.jsp" flush="true" />
<style>


</style>
<!-- Content Wrapper. Contains page content -->



<!-- /.content-header -->

<!-- Main content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <div class="content-header">
        <div class="container-fluid">
            <input type="hidden" value="<%=session.getAttribute("user")%>" id="user_code">
            <input type="hidden" id="hSubLink" value="${sublink}">

            <!--content-table-->
            <div class="row clearfix" id="content-table">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card" >
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-12" style="margin-top:0.5rem;">
                                    <button class="btn btn-success " id="btn-create"><i class="fa fa-plus"></i> สร้างประเภทเอกสาร</button>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12" style="margin-top:0.5rem;">
                                    <div class="table-responsive">
                                        <table class="table table-striped  table-hover">
                                            <thead>
                                                <tr>
                                                    <th class="text-center">#</th>
                                                    <th class="text-center">ประเภท</th>
                                                    <th class="text-center">ชนิด</th>
                                                    <th class="text-center">แก้ไข/ลบ</th>
                                                </tr>
                                            </thead>
                                            <tbody id="table-detail">

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div><!-- /.container-fluid -->

    <div class="modal fade" id="createModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modaltitle">สร้างประเภทใหม่</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="code">ประเภท</label>
                        <input type="hidden" class="form-control" id="old_code" >
                        <input type="text" class="form-control" id="code" >
                    </div>
                    <div class="col-12">

                        <label >ชนิด</label>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="trans_type" id="inlineRadio1" value="0" checked>
                            <label class="form-check-label" for="inlineRadio1">รับ</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="trans_type" id="inlineRadio2" value="1">
                            <label class="form-check-label" for="inlineRadio2">จ่าย</label>
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

    <!-- /.content -->
</div>
<jsp:include  page="../theme/footer.jsp" flush="true" />