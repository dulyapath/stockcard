var serverURL = "../";

function _approveDoc() {
    var code = $('#hidden_docno').val()
    var trans_flag = $('#trans_flag').val()
    var radioValue = $("input[name='gridRadios']:checked").val();
    var doc_format_code = "";
    var doctype = '';
    if (radioValue == '1') {
        doctype = 'ใบเสนอราคา';
        doc_format_code = $('#selectSO').val();
    } else {
        doctype = 'ใบสั่งซื้อ/สั่งจอง';
        doc_format_code = $('#selectSR').val();
    }

    console.log(doc_format_code);

    swal({
        title: "ยืนยันการทำงาน",
        text: "ต้องการอนุมัติเอกสาร " + code + " \nเข้า " + doctype + " ใช่หรือไม่",
        icon: "warning",
        buttons: ["ปิด", "ตกลง"],
        dangerMode: true,

    })
            .then((willDelete) => {
                if (willDelete) {
                    if (trans_flag == '10001') {
                        $.ajax({
                            url: serverURL + 'approveDoc',
                            method: 'POST',
                            data: {doc_no: code, cmd: radioValue, docformat: doc_format_code},
                            success: function (res) {
                                if (res == 'success') {
                                    swal("การทำรายการทำเสร็จ", {
                                        icon: "success",
                                    });
                                    _getListData('');

                                    $('#doc_list').show()
                                    $('#create_doc').hide()
                                    $('#approveModal').modal('hide')
                                } else {
                                    swal("การทำรายการไม่สำเร็จ " + res, {
                                        icon: "warning",
                                    });
                                }
                            },
                            error: function (res) {
                                console.log(res)
                            },
                        });
                    } else {
                        $.ajax({
                            url: serverURL + 'approveDocSo',
                            method: 'POST',
                            data: {doc_no: code, cmd: radioValue, docformat: doc_format_code},
                            success: function (res) {
                                if (res == 'success') {
                                    swal("การทำรายการทำเสร็จ", {
                                        icon: "success",
                                    });
                                    _getListData('');

                                    $('#doc_list').show()
                                    $('#create_doc2').hide()
                                    $('#approveModal').modal('hide')
                                } else {
                                    swal("การทำรายการไม่สำเร็จ " + res, {
                                        icon: "warning",
                                    });
                                }
                            },
                            error: function (res) {
                                console.log(res)
                            },
                        });
                    }
                }
            });
}




function _rejeckDoc() {
    var code = $('#doc_no').val()
    swal({
        title: "ยืนยันการทำงาน",
        text: "ไม่อนุมัติเอกสาร " + code + " ใช่หรือไม่",
        icon: "warning",
        buttons: ["ปิด", "ตกลง"],
        dangerMode: true,

    })
            .then((willDelete) => {
                if (willDelete) {
                    $.ajax({
                        url: serverURL + 'rejectDoc',
                        method: 'POST',
                        data: {doc_no: code},
                        success: function (res) {
                            swal("การทำรายการทำเสร็จ", {
                                icon: "success",
                            });
                            _getListData('');
                            $('#create_doc').hide();
                            $('#doc_list').show('slow');
                        },
                        error: function (res) {
                            console.log(res)
                        },
                    });

                }
            });
}

function _rejeckDoc2() {
    var code = $('#doc_no2').val()
    swal({
        title: "ยืนยันการทำงาน",
        text: "ไม่อนุมัติเอกสาร " + code + " ใช่หรือไม่",
        icon: "warning",
        buttons: ["ปิด", "ตกลง"],
        dangerMode: true,

    })
            .then((willDelete) => {
                if (willDelete) {
                    $.ajax({
                        url: serverURL + 'rejectDoc',
                        method: 'POST',
                        data: {doc_no: code},
                        success: function (res) {
                            swal("การทำรายการทำเสร็จ", {
                                icon: "success",
                            });
                            _getListData('');
                            $('#create_doc2').hide();
                            $('#doc_list').show('slow');
                        },
                        error: function (res) {
                            console.log(res)
                        },
                    });

                }
            });
}
function delay(callback, ms) {
    var timer = 0;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.apply(context, args);
        }, ms || 0);
    };
}
$(document).ready(function () {

    _getSR()
    _getSO()

    _getListData('')



    $('#search_text').keyup(delay(function (e) {
        _getListData(this.value)
    }, 1000));

    $(document).delegate('.send_approve', 'click', function (event) {
        var code = $(this).attr('data-docno')
        swal({
            title: "ยืนยันการทำงาน",
            text: "ต้องการส่งเอกสาร " + code + " ไปอนุมัติใช่หรือไม่",
            icon: "warning",
            buttons: ["ปิด", "ตกลง"],
            dangerMode: true,

        })
                .then((willDelete) => {
                    if (willDelete) {
                        $.ajax({
                            url: serverURL + 'sendDocSale',
                            method: 'POST',
                            data: {doc_no: code},
                            success: function (res) {
                                swal("การทำรายการทำเสร็จ", {
                                    icon: "success",
                                });
                                _getListData('');
                            },
                            error: function (res) {
                                console.log(res)
                            },
                        });

                    }
                });
    });

    $(document).delegate('#gridRadios1', 'click', function (event) {

        $('#docformatSO').show();
        $('#docformatSR').hide();

    });
    $(document).delegate('#gridRadios2', 'click', function (event) {

        $('#docformatSO').hide();
        $('#docformatSR').show();

    });
    $(document).delegate('.approve_doc', 'click', function (event) {
        var code = $(this).attr('data-docno')

        $('#hidden_docno').val(code)
        $('#trans_flag').val('1001')
        $('#modal-docno').text(code)
        $('#docformatSO').show();
        $('#docformatSR').hide();
        $("#gridRadios1").prop("checked", true);
        $('#approveModal').modal('show')
    });
    $(document).delegate('.approve_doc2', 'click', function (event) {
        var code = $(this).attr('data-docno')

        $('#hidden_docno').val(code)
        $('#trans_flag').val('1001')
        $('#modal-docno').text(code)
        $('#docformatSO').show();
        $('#docformatSR').hide();
        $("#gridRadios1").prop("checked", true);
        $('#approveModal').modal('show')
    });
    $(document).delegate('.approve_doc_sd', 'click', function (event) {
        var code = $(this).attr('data-docno')

        $('#hidden_docno').val(code)
        $('#trans_flag').val('1002')
        $('#modal-docno').text(code)
        $('#approveModal').modal('show')
    });

    $(document).delegate('.approve_doc_sd2', 'click', function (event) {
        var code = $(this).attr('data-docno')

        $('#hidden_docno').val(code)
        $('#trans_flag').val('1002')
        $('#modal-docno').text(code)
        $('#approveModal').modal('show')
    });

    $(document).delegate('.reject_doc', 'click', function (event) {
        var code = $(this).attr('data-docno')
        swal({
            title: "ยืนยันการทำงาน",
            text: "ไม่อนุมัติเอกสาร " + code + " ใช่หรือไม่",
            icon: "warning",
            buttons: ["ปิด", "ตกลง"],
            dangerMode: true,

        })
                .then((willDelete) => {
                    if (willDelete) {
                        $.ajax({
                            url: serverURL + 'rejectDoc',
                            method: 'POST',
                            data: {doc_no: code},
                            success: function (res) {
                                swal("การทำรายการทำเสร็จ", {
                                    icon: "success",
                                });
                                _getListData('');
                            },
                            error: function (res) {
                                console.log(res)
                            },
                        });

                    }
                });
    });

    $(document).delegate('.print_doc', 'click', function (event) {
        var code = $(this).attr('data-docno')

        printData(code)
    });
    $(document).delegate('.print_doc2', 'click', function (event) {
        var code = $(this).attr('data-docno')

        printData2(code)
    });


    $(document).delegate('.del_doc', 'click', function (event) {
        var code = $(this).attr('data-docno')
        swal({
            title: "ยืนยันการทำงาน",
            text: "ต้องการลบเอกสาร " + code + " ใช่หรือไม่",
            icon: "warning",
            buttons: ["ปิด", "ตกลง"],
            dangerMode: true,

        })
                .then((willDelete) => {
                    if (willDelete) {
                        $.ajax({
                            url: serverURL + 'delDocSale',
                            method: 'POST',
                            data: {doc_no: code},
                            success: function (res) {
                                swal("การทำรายการทำเสร็จ", {
                                    icon: "success",
                                });
                                _getListData('');
                            },
                            error: function (res) {
                                console.log(res)
                            },
                        });

                    }
                });
    });

    $(document).delegate('.show_detail', 'click', function (event) {
        var code = $(this).attr('data-docno')
        $.ajax({
            url: serverURL + 'getDocSaleDetail?docno=' + code,
            method: 'GET',
            success: function (res) {

                console.log(res)
                if (res.length > 0) {
                    $('#doc_no').val(res[0].doc_no)
                    $('#doc_date').val(res[0].doc_date)
                    $('#cust_code').val(res[0].cust_code + '~' + res[0].cust_name);
                    $('#user_creator').val(res[0].creator_code + '~' + res[0].creator_name);
                    $('#saler_code').val(res[0].saler_code + '~' + res[0].saler_name);
                    $('#sale_type').val(res[0].sale_type)
                    $('#branch_code').val(res[0].branch_code + '~' + res[0].branch_name)
                    $('#vat_type').val(res[0].vat_type)
                    $('#remark').val(res[0].remark)
                    item_detail = res[0].detail
                    $('#total_exp_discount').html(formatNumber(res[0].total_exp_discount));
                    $('#total_exp_car').html(formatNumber(res[0].total_exp_car));
                    $('#total_exp_other').html(formatNumber(res[0].total_exp_other));
                    $('#total_exp_doc').html(formatNumber(res[0].total_exp_doc));
                    $('#total_exp_tax').html(formatNumber(res[0].total_exp_tax));
                    $('#total_exp_other2').html(formatNumber(res[0].total_exp_other2));
                    $('#total_exp_each').html(formatNumber(res[0].total_exp_each));
                    _displayTable()
                    $('#doc_list').hide()
                    $('#create_doc').show()

                }


            },
            error: function (res) {
                console.log(res)
            },
        });
    });
    $(document).delegate('.show_detail2', 'click', function (event) {
        var code = $(this).attr('data-docno')
        var username = $('#user_namex').val();
        var user_code = $('#user_code').val();
        $.ajax({
            url: serverURL + 'getDocSoDetail?docno=' + code,
            method: 'GET',
            success: function (res) {

                console.log(res)
                if (res.length > 0) {
                    $('#doc_no2').val(res[0].doc_no)
                    $('#doc_date2').val(res[0].doc_date)
                    if (res[0].creator_code.length > 0) {
                        $('#user_creator2').val(res[0].creator_code + '~' + res[0].creator_name)
                    } else {
                        $('#user_creator2').val(user_code + '~' + username)
                    }
                    $('#cust_code2').val(res[0].cust_code + '~' + res[0].cust_name)
                    $('#saler_code2').val(res[0].saler_code + '~' + res[0].saler_name)
                    $('#sale_type2').val(res[0].sale_type)
                    $('#project_name').val(res[0].project_name)
                    $('#contact').val(res[0].contact)
                    if (res[0].is_rival == '0') {
                        $("#radio_rival1").prop("checked", true);
                    } else if (res[0].is_rival == '1') {
                        $("#radio_rival2").prop("checked", true);
                    }
                    $('#branch_code2').val(res[0].branch_code + '~' + res[0].branch_name)
                    $('#vat_type2').val(res[0].vat_type)
                    $('#remark2').val(res[0].remark)
                    item_detail = res[0].detail


                    $('#total_exp_each2').html(formatNumber(res[0].total_exp_each));
                    _displayTable2()
                    $('#doc_list').hide()
                    $('#create_doc2').show()

                }


            },
            error: function (res) {
                console.log(res)
            },
        });
    });
}
);
function printData(data) {
    window.open('../print/index.jsp' + "?docno=" + data, "_blank");
}

function printData2(data) {
    window.open('../print2/index.jsp' + "?docno=" + data, "_blank");
}
function _searchItem() {
    var search_code = $('#search_code').val()
    var search_name = $('#search_name').val()

    $.ajax({
        url: serverURL + 'search_item?code=' + search_code + '&name=' + search_name,
        method: 'GET',
        cache: false,
        success: function (res) {
            $('#list_search_item').html(res)

        },
        error: function (res) {
            console.log(res)
        },
    });


}
function _addLine() {
    item_detail.push({
        item_code: '',
        item_name: '',
        unit_code: '',
        cost_qty: 0.00,
        cost_weight: 0.00,
        cost_sum_weight: 0.00,
        cost_factory_price: 0.00,
        cost_sum_cost: 0.00,
        exp_car: 0.00,
        exp_other: 0.00,
        exp_doc: 0.00,
        exp_tax: 0.00,
        exp_other2: 0.00,
        exp_each: 0.00,
        sale_sum_lao_cost: 0.00,
        sale_sum_cost: 0.00,
        sale_price: 0.00,
        sale_sum_amount: 0.00,
        sale_profit: 0.00,
        sale_percent_profit: 0.00
    });

    _displayTable();
}

function _getSR() {
    $.ajax({
        url: serverURL + 'getDocformatSR',
        method: 'GET',
        cache: false,
        success: function (res) {

            console.log(res)
            if (res.length > 0) {
                var html = "";
                for (var i = 0; i < res.length; i++) {
                    html += "<option value='" + res[i].code + "'>" + res[i].code + "|" + res[i].name_1 + "</option>"
                }
                $('#selectSR').html(html);
            }

        },
        error: function (res) {
            console.log(res)
        },
    });
}

function _getSO() {
    $.ajax({
        url: serverURL + 'getDocformatSO',
        method: 'GET',
        cache: false,
        success: function (res) {

            console.log(res)
            if (res.length > 0) {
                var html = "";
                for (var i = 0; i < res.length; i++) {
                    html += "<option value='" + res[i].code + "'>" + res[i].code + "|" + res[i].name_1 + "</option>"
                }
                $('#selectSO').html(html);
            }


        },
        error: function (res) {
            console.log(res)
        },
    });
}

function _getListData(data) {
    $.ajax({
        url: serverURL + 'getHistoryDoc?search=' + data,
        method: 'GET',
        cache: false,
        success: function (res) {

            console.log(res)
            _showListDetail(res)

        },
        error: function (res) {
            console.log(res)
        },
    });
}

function _showListDetail(data) {
    var html = '';
    for (var i = 0; i < data.length; i++) {
        var saletype = ''
        var vattype = ''
        var salecolor = 'black'
        var vatcolor = 'black'
        if (data[i].sale_type == '0') {
            saletype = 'ขายเงินเชื่อ'
            salecolor = 'blue'
        } else if (data[i].sale_type == '1') {
            saletype = 'ขายเงินสด'
            salecolor = 'green'
        }

        if (data[i].vat_type == '0') {
            vattype = 'ภาษีแยกนอก'
            vatcolor = 'blue'
        } else if (data[i].vat_type == '1') {
            vattype = 'ภาษีรวมใน'
            vatcolor = 'green'
        } else if (data[i].vat_type == '2') {
            vattype = 'ภาษีอัตราศูนย์'
            vatcolor = 'red'
        }
        if (data[i].contactor == undefined) {
            data[i].contactor = '';
        }
        html += '<div class="card">';
        html += '   <div class="card-body">'
        html += '        <div class="row">'
        html += '            <div class="col-sm-6 "><h5 class=" text-left" ><b>' + data[i].doc_no + '</b></h5></div>'
        html += '            <div class="col-sm-6 "><h5 class=" text-right">วันที่ ' + data[i].doc_date + '</h5></div>'
        html += '        </div>'
        html += '        <div class="row">'
        if (data[i].trans_flag == '1002') {
            html += '            <div class="col-sm-6">'
            html += '                <h6 class=" text-left">ชื่อโครงการ:<b > ' + data[i].project_name + '</b></h6>'
            html += '            </div>'
            html += '            <div class="col-sm-6">'
            html += '                <h6 class=" text-left">ผู้ติดต่อ:<b > ' + data[i].contact + '</b></h6>'
            html += '            </div>'
        }
        html += '            <div class="col-sm-6">'
        html += '                <h6 class=" text-left">ประเภทการขาย:<b style="color:' + salecolor + '"> ' + saletype + '</b></h6>'
        html += '            </div>'
        html += '            <div class="col-sm-6">'
        html += '                <h6 class=" text-left">ประเภทภาษี:<b style="color:' + vatcolor + '"> ' + vattype + '</b></h6>'
        html += '            </div>'
        html += '            <div class="col-sm-6">'
        html += '                <h6 class=" text-left">สาขา:<b > ' + data[i].branch_code + '~' + data[i].branch_name + '</b></h6>'
        html += '            </div>'
        html += '            <div class="col-sm-6">'
        html += '                <h6 class=" text-left">ลูกค้า:<b > ' + data[i].cust_code + '~' + data[i].cust_name + '</b></h6>'
        html += '            </div>'
        html += '            <div class="col-sm-6">'
        html += '                <h6 class=" text-left">รวมมูลค่า:<b > ' + formatNumber(data[i].total_sale_sum_amount) + '</b></h6>'
        html += '            </div>'
        html += '            <div class="col-sm-6">'
        html += '                <h6 class=" text-left">ผู้เปิดใบอนุมัติ: <b > ' + data[i].creator_code + '~' + data[i].creator_name + '</b></h6>'
        html += '            </div>'
        html += '            <div class="col-sm-6">'
        html += '                <h6 class=" text-left">พนักงานขาย: <b > ' + data[i].saler_code + '~' + data[i].saler_name + '</b></h6>'
        html += '            </div>'
        html += '            <div class="col-sm-6">'
        html += '                <h6 class=" text-left">สถานที่ส่ง:<b > ' + data[i].contactor + '</b></h6>'
        html += '            </div>'
        html += '            <div class="col-sm-6">'
        html += '                <h6 class=" text-left">หมายเหตุ:<b >' + data[i].remark + '</b></h6>'
        html += '            </div>'

        html += '        </div>'
        if (data[i].trans_flag == '1001') {
            html += '        <button class="btn btn-info show_detail" data-docno="' + data[i].doc_no + '"><i class="fa fa-search"></i> รายละเอียด</button>'
            html += '        <button class="btn btn-primary print_doc"  data-docno="' + data[i].doc_no + '"><i class="fa fa-print"></i> พิมพ์เอกสาร</button>'

        } else {
            html += '        <button class="btn btn-info show_detail2" data-docno="' + data[i].doc_no + '"><i class="fa fa-search"></i> รายละเอียด</button>'
            html += '        <button class="btn btn-primary print_doc2"  data-docno="' + data[i].doc_no + '"><i class="fa fa-print"></i> พิมพ์เอกสาร</button>'

        }


        html += '    </div>'
        html += '</div>'
    }
    $('#show_list_detail').html(html);
}


function _backtolist() {
    $('#doc_list').show();
    $('#create_doc').hide();
    $('#create_doc2').hide();
}
function formatNumber(num) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function _displayTable() {
    var html = '';
    var total_cost_qty = 0.00;
    var total_cost_weight = 0.00;
    var total_cost_sum_weight = 0.00;
    var total_cost_purchases = 0.00;
    var total_cost_factory_price = 0.00;
    var total_cost_sum_cost = 0.00;
    var total_exp_car = 0.00;
    var total_exp_other = 0.00;
    var total_exp_doc = 0.00;
    var total_exp_tax = 0.00;
    var total_exp_other2 = 0.00;
    var total_exp_each = 0.00;
    var total_sale_sum_lao_cost = 0.00;
    var total_sale_sum_cost = 0.00;
    var total_sale_price = 0.00;
    var total_sale_sum_amount = 0.00;
    var total_sale_profit = 0.00;
    var total_sale_percent_profit = 0.00;
    var row_selling_price = 0;
    var total_selling_price = 0.00;

    for (var i = 0; i < item_detail.length; i++) {

        total_cost_qty += parseFloat(item_detail[i].cost_qty);
        total_cost_weight += parseFloat(item_detail[i].cost_weight);
        total_cost_sum_weight += parseFloat(item_detail[i].cost_sum_weight);
        total_cost_purchases += parseFloat(item_detail[i].purchases);
        total_cost_factory_price += parseFloat(item_detail[i].cost_factory_price);
        total_cost_sum_cost += parseFloat(item_detail[i].cost_sum_cost);
        total_selling_price += parseFloat(item_detail[i].selling_price);
        total_sale_sum_cost += parseFloat(item_detail[i].sale_sum_cost);
        total_sale_sum_amount += parseFloat(item_detail[i].sale_sum_amount);
        total_sale_profit += parseFloat(item_detail[i].sale_profit);


        html += '<tr>'
        html += '<td class="text-center">' + (i + 1) + '</td>'
        if (item_detail[i].item_code != '') {
            html += '<td class="text-left btn-search" style="cursor:pointer" index="item_' + i + '">' + item_detail[i].item_code + '~' + item_detail[i].item_name + '</td>'
        } else {
            html += '<td class="text-left btn-search" style="cursor:pointer" index="item_' + i + '"></td>'
        }
        html += '<td class="text-center">' + item_detail[i].unit_name + '</td>'
        html += '<td class="text-right " index="costqty_' + i + '">' + formatNumber(item_detail[i].cost_qty) + '</td>'
        html += '<td class="text-right">' + formatNumber(parseFloat(item_detail[i].cost_weight)) + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].cost_sum_weight) + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].purchases) + '</td>'
        html += '<td class="text-right " index="costfactory_' + i + '">' + formatNumber(item_detail[i].cost_factory_price) + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].cost_sum_cost) + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].exp_car) + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].exp_other) + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].exp_doc) + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].exp_tax) + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].exp_other2) + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].exp_each) + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].sale_sum_lao_cost) + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].sale_sum_cost) + '</td>'
        html += '<td class="text-right " index="saleprice_' + i + '">' + formatNumber(item_detail[i].sale_price) + '</td>'
        html += '<td class="text-right " index="discount_' + i + '">' + item_detail[i].sale_discount + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].selling_price) + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].sale_sum_amount) + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].sale_profit) + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].sale_percent_profit) + "%" + '</td>'
        html += '</tr>'
    }
    total_sale_sum_lao_cost = parseFloat(total_sale_sum_cost / total_cost_qty);
    total_sale_price = parseFloat(total_sale_sum_amount / total_cost_qty);
    total_sale_percent_profit = (parseFloat(total_sale_profit / total_sale_sum_amount) * 100);

    if (isNaN(total_sale_sum_lao_cost)) {
        total_sale_sum_lao_cost = 0.00
    }
    if (isNaN(total_sale_price)) {
        total_sale_price = 0.00
    }
    $('#total_selling_price').html(formatNumber(total_selling_price))
    $('#total_cost_qty').html(formatNumber(total_cost_qty))
    $('#total_cost_weight').html(formatNumber(total_cost_weight))
    $('#total_cost_sum_weight').html(formatNumber(total_cost_sum_weight))
    $('#total_cost_purchases').html(formatNumber(total_cost_purchases))
    $('#total_cost_factory_price').html(formatNumber(total_cost_factory_price))
    $('#total_cost_sum_cost').html(formatNumber(total_cost_sum_cost))
    $('#total_sale_sum_lao_cost').html(formatNumber(total_sale_sum_lao_cost))
    $('#total_sale_sum_cost').html(formatNumber(total_sale_sum_cost))
    $('#total_sale_price').html(formatNumber(total_sale_price))
    $('#total_sale_sum_amount').html(formatNumber(total_sale_sum_amount))
    $('#total_sale_profit').html(formatNumber(total_sale_profit))
    $('#total_sale_percent_profit').html(formatNumber(total_sale_percent_profit) + "%")

    $('#item_detail').html(html);
}

function _displayTable2() {
    var html = '';
    var total_cost_qty = 0.00;
    var total_cost_weight = 0.00;
    var total_cost_sum_weight = 0.00;
    var total_cost_purchases = 0.00;
    var total_cost_factory_price = 0.00;
    var total_cost_sum_cost = 0.00;
    var total_selling_price = 0.00;
    var total_exp_discount = 0.00;
    var total_exp_car = 0.00;
    var total_exp_other = 0.00;
    var total_exp_doc = 0.00;
    var total_exp_tax = 0.00;
    var total_exp_other2 = 0.00;
    var total_exp_each = 0.00;
    var total_sale_sum_lao_cost = 0.00;
    var total_sale_sum_cost = 0.00;
    var total_sale_price = 0.00;
    var total_sale_sum_amount = 0.00;
    var total_sale_profit = 0.00;
    var total_sale_percent_profit = 0.00;
    var row_purchase = 0;
    var row_cost_factory = 0;
    var row_exp_each = 0;
    var row_cost_lao = 0;
    var row_sale_price = 0;
    var row_selling_price = 0;

    for (var i = 0; i < item_detail.length; i++) {
        if (item_detail[i].purchases > 0) {
            row_purchase += 1;
        }
        if (item_detail[i].cost_factory_price > 0) {
            row_cost_factory += 1;
        }
        if (item_detail[i].exp_each > 0) {
            row_exp_each += 1;
        }
        if (item_detail[i].sale_sum_lao_cost > 0) {
            row_cost_lao += 1;
        }
        if (item_detail[i].sale_price > 0) {
            row_sale_price += 1;
        }
        if (item_detail[i].selling_price > 0) {
            row_selling_price += 1;
        }

        total_cost_qty += parseFloat(item_detail[i].cost_qty);
        total_cost_purchases += parseFloat(item_detail[i].purchases);
        total_cost_factory_price += parseFloat(item_detail[i].cost_factory_price);
        total_exp_each += parseFloat(item_detail[i].exp_each);
        total_cost_sum_cost += parseFloat(item_detail[i].cost_sum_cost);
        total_sale_sum_cost += parseFloat(item_detail[i].sale_sum_cost);
        total_sale_sum_amount += parseFloat(item_detail[i].sale_sum_amount);
        total_sale_profit += parseFloat(item_detail[i].sale_profit);
        total_selling_price += parseFloat(item_detail[i].selling_price);
        total_sale_sum_lao_cost += parseFloat(item_detail[i].sale_sum_lao_cost);
        total_sale_price += parseFloat(item_detail[i].sale_price);

        html += '<tr>'
        html += '<td class="text-center">' + (i + 1) + '</td>'
        if (item_detail[i].item_code != '') {
            html += '<td class="text-left btn-search" style="cursor:pointer" index="item_' + i + '">' + item_detail[i].item_code + '~' + item_detail[i].item_name + '</td>'
        } else {
            html += '<td class="text-left btn-search" style="cursor:pointer" index="item_' + i + '"></td>'
        }
        html += '<td class="text-center">' + item_detail[i].unit_name + '</td>'
        html += '<td class="text-right editIt" index="costqty_' + i + '">' + formatNumber(item_detail[i].cost_qty) + '</td>'
        html += '<td class="text-right" style="color:#9E00FF">' + formatNumber(item_detail[i].purchases) + '</td>'
        html += '<td class="text-right editIt" index="costfactory_' + i + '">' + formatNumber(item_detail[i].cost_factory_price) + '</td>'

        html += '<td class="text-right editIt" index="exp_' + i + '">' + formatNumber(item_detail[i].exp_each) + '</td>'
        html += '<td class="text-right" >' + formatNumber(item_detail[i].sale_sum_lao_cost) + '</td>'
        html += '<td class="text-right" >' + formatNumber(item_detail[i].sale_sum_cost) + '</td>'
        html += '<td class="text-right editIt" index="saleprice_' + i + '">' + formatNumber(item_detail[i].sale_price) + '</td>'
        html += '<td class="text-right editIt" index="discount_' + i + '">' + item_detail[i].sale_discount + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].selling_price) + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].sale_sum_amount) + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].sale_profit) + '</td>'
        html += '<td class="text-right">' + formatNumber(item_detail[i].sale_percent_profit) + "%" + '</td>'
        html += '</tr>'
    }
    if (row_purchase > 0) {
        total_cost_purchases = total_cost_purchases / row_purchase;
    } else {
        total_cost_purchases = 0.00;
    }
    if (row_cost_factory > 0) {
        total_cost_factory_price = total_cost_factory_price / row_cost_factory;
    } else {
        total_cost_factory_price = 0.00;
    }
    if (row_exp_each > 0) {
        total_exp_each = total_exp_each / row_exp_each;
    } else {
        total_exp_each = 0.00;
    }
    if (row_cost_lao > 0) {
        total_sale_sum_lao_cost = total_sale_sum_lao_cost / row_cost_lao;
    } else {
        total_sale_sum_lao_cost = 0.00;
    }
    if (row_sale_price > 0) {
        total_sale_price = total_sale_price / row_sale_price;
    } else {
        total_sale_price = 0.00;
    }
    if (row_selling_price > 0) {
        total_selling_price = total_selling_price / row_selling_price;
    } else {
        total_selling_price = 0.00;
    }

    total_sale_percent_profit = (parseFloat(total_sale_profit / total_sale_sum_amount) * 100);
    if (isNaN(total_sale_sum_lao_cost)) {
        total_sale_sum_lao_cost = 0.00
    }
    if (isNaN(total_sale_price)) {
        total_sale_price = 0.00
    }
    if (isNaN(total_sale_percent_profit)) {
        total_sale_percent_profit = 0.00
    }


    $('#total_cost_qty2').html(formatNumber(total_cost_qty))

    $('#total_cost_purchases2').html(formatNumber(total_cost_purchases))
    $('#total_cost_factory_price2').html(formatNumber(total_cost_factory_price))

    $('#total_exp_each2').html(formatNumber(total_exp_each))

    $('#total_sale_sum_lao_cost2').html(formatNumber(total_sale_sum_lao_cost))
    $('#total_sale_sum_cost2').html(formatNumber(total_sale_sum_cost))
    $('#total_sale_price2').html(formatNumber(total_sale_price))
    $('#total_selling_price2').html(formatNumber(total_selling_price))
    $('#total_sale_sum_amount2').html(formatNumber(total_sale_sum_amount))
    $('#total_sale_profit2').html(formatNumber(total_sale_profit))
    $('#total_sale_percent_profit2').html(formatNumber(total_sale_percent_profit) + "%")

    $('#item_detail2').html(html);
}