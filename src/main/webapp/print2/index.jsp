<%@page contentType="text/html" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">
    <%
        String __docno = request.getParameter("docno") != null ? request.getParameter("docno") : "";

    %>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <title>Sale Approve | Print</title>
        <!-- Font Awesome -->
        <link rel="stylesheet" href="../plugins/fontawesome-free/css/all.min.css">
        <!-- Ionicons -->
        <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
        <!-- Tempusdominus Bbootstrap 4 -->
        <link rel="stylesheet" href="../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css">
        <!-- iCheck -->
        <link rel="stylesheet" href="../plugins/icheck-bootstrap/icheck-bootstrap.min.css">
        <!-- JQVMap -->
        <link rel="stylesheet" href="../plugins/jqvmap/jqvmap.min.css">
        <!-- Theme style -->
        <link rel="stylesheet" href="../dist/css/adminlte.min.css">
        <!-- overlayScrollbars -->
        <link rel="stylesheet" href="../plugins/overlayScrollbars/css/OverlayScrollbars.min.css">
        <!-- Daterange picker -->
        <link rel="stylesheet" href="../plugins/daterangepicker/daterangepicker.css">
        <!-- summernote -->
        <link rel="stylesheet" href="../plugins/summernote/summernote-bs4.css">
        <link href="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="../css/select2-bootstrap.css">
        <link rel="stylesheet" href="../css/sweetalert.css">
        <!-- Google Font: Source Sans Pro -->
        <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">
        <style type="text/css" media="print">
            @page {
                size: A4;
                margin: 5px;
                size: landscape;
            }



            div.content-print-layout
            {
                page-break-after: always;
                page-break-inside: avoid;
            }
            body{
                font-size: 14px !important
            }

        </style>
    </head>

    <body>
        <!-- HIDDEN CONTENT -->
        <input type="hidden" id="doc_no" value="<%= __docno%>">

        <div class="container-fluid " style="margin: 0">
            <div class='content-print-layout'>
                <div  id="content-list">

                </div>
                <table id="advancedEditableTable" class="table" style="width:100%;font-size: 14px">
                    <thead id="table_header">
                        <tr>
                            <th rowspan="2" class="text-center" >ลำดับ</th>
                            <th rowspan="2" class="text-center " style="min-width: 300px;">สินค้า</th>
                            <th rowspan="2" nowrap class="text-center " >หน่วยนับ</th>

                            <th nowrap class="text-center ">จำนวน</th>
                            <th nowrap class="text-center">ซื้อล่าสุด</th>
                            <th nowrap class="text-center ">ราคาทุนไทย</th>

                            <th nowrap class="text-center ">ค่าใช้จ่ายนำเข้า</th>

                            <th nowrap class="text-center ">ราคาทุนลาว</th>
                            <th nowrap class="text-center ">รวมทุน</th>
                            <th nowrap class="text-center ">ราคาขาย</th>
                            <th nowrap class="text-center ">ส่วนลด</th>
                            <th nowrap class="text-center ">ขายสุทธิ</th>
                            <th nowrap class="text-center ">รวมมูลค่าขาย</th>
                            <th nowrap class="text-center ">กำไร</th>
                            <th nowrap class="text-center ">%กำไร</th>

                        </tr>

                        <tr>

                            <td class="text-right" id="total_cost_qty" ></td>
                            <td class="text-right" id="total_cost_purchases"></td>
                            <td class="text-right" id="total_cost_factory_price"></td>

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
        <script src="../js/jquery-3.2.1.min.js"></script>

        <script src="../js/jquery.cookie.js"></script>
        <script src="../assets/bootstrap/js/bootstrap.min.js"></script>
        <script src="../js/fastclick.js"></script>
        <script src="../js/moment.min.js"></script>
        <script src="../js/locale/th.js"></script>
        <script src="../js/custom.min.js${v}"></script>
        <!-- jQuery UI 1.11.4 -->
        <script src="../plugins/jquery-ui/jquery-ui.min.js"></script>
        <!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
        <!-- Bootstrap 4 -->
        <script src="../plugins/bootstrap/js/bootstrap.bundle.min.js"></script>

        <!-- AdminLTE App -->
        <script src="../dist/js/adminlte.js"></script>
        <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js"></script>
        <script src="../js/print2/print2.js"></script>
    </body>
</html>