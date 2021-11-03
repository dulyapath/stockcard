<%@page import="Model.Permission"%>
<%@page import="utils.PermissionUtil"%>
<%@include file="../globalsub.jsp"  %>
<%@page import="java.util.List"%>
<%@page import="java.util.Arrays"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%// ###################    
    String pageName = "ตั้งค่าทั่วไป";

    request.setAttribute("title", pageName);
    request.setAttribute("sublink", "../");
    request.setAttribute("css", Arrays.asList("../css/sweetalert.css", "../css/bootstrap-datetimepicker.min.css"));
    request.setAttribute("js", Arrays.asList("../js/sweetalert.min.js", "../js/bootstrap-datetimepicker.min.js", "../js/setting/list.js", "../js/_globals.js"));

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
            <div class="card">
                <div class="card-body">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="dateEdit">
                        <label class="form-check-label" for="dateEdit">
                            เลือกวันที่ได้
                        </label>
                    </div>
                </div>
                <div class="card-footer">
                    <button type="button" class="btn btn-primary" id="btn-save">บันทึก</button>
                </div>
            </div>

        </div>
    </div><!-- /.container-fluid -->
    <!-- /.content -->
</div>
<jsp:include  page="../theme/footer.jsp" flush="true" />