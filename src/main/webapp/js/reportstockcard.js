var serverURL = "../";
var userbranch = '';
var item_detail = [

]

function uuidv4() {
    return 'xxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function  _getGroupsub() {
    $.ajax({
        url: serverURL + 'getGroupsub',
        method: 'GET',
        cache: false,
        success: function (res) {

            console.log(res)
            var html = '<option value="">---เลือกกลุ่มย่อย---</option>';
            for (var i = 0; i < res.length; i++) {
                html += ' <option value="' + res[i].code + '">' + res[i].code + '~' + res[i].name_1 + '</option>'
            }

            $('.select_groupsub').html(html);
            $('.select_groupsub').select2({
                theme: "bootstrap"
            });
        },
        error: function (res) {
            console.log(res)
        },
    });
}

function  _getDoctype() {
    var html = `<option value="">---เลือกประเภท---</option>
                            <option value="0">สินค้าทั่วไป</option>
                            <option value="1">สินค้าบริการ</option>
                            <option value="2">สินค้าให้เช่า</option>
                            <option value="3">สินค้าชุด</option>
                            <option value="4">สินค้าฝากขาย</option>
                            <option value="5">สูตรการผลิต</option>
                            <option value="6">สีผสม</option>`
    $('.select_doctype').html(html);
    $('.select_doctype').select2({
        theme: "bootstrap"
    });
    /*
     $.ajax({
     url: serverURL + 'getDocType',
     method: 'GET',
     cache: false,
     success: function (res) {
     
     console.log(res)
     var html = '<option value="">---เลือกประเภท---</option>';
     for (var i = 0; i < res.length; i++) {
     html += ' <option value="' + res[i].code + '">' + res[i].code + '</option>'
     }
     
     $('.select_doctype').html(html);
     $('.select_doctype').select2({
     theme: "bootstrap"
     });
     },
     error: function (res) {
     console.log(res)
     },
     });*/
}

function  _getBrand() {
    $.ajax({
        url: serverURL + 'getBrand',
        method: 'GET',
        cache: false,
        success: function (res) {

            console.log(res)
            var html = '<option value="">---เลือกยี่ห้อ---</option>';
            for (var i = 0; i < res.length; i++) {
                html += ' <option value="' + res[i].code + '">' + res[i].code + '~' + res[i].name_1 + '</option>'
            }

            $('.select_brand').html(html);
            $('.select_brand').select2({
                theme: "bootstrap"
            });
        },
        error: function (res) {
            console.log(res)
        },
    });
}

function  _getGroupmain() {
    $.ajax({
        url: serverURL + 'getGroupmain',
        method: 'GET',
        cache: false,
        success: function (res) {

            console.log(res)
            var html = '<option value="">---เลือกกลุ่มหลัก---</option>';
            for (var i = 0; i < res.length; i++) {
                html += ' <option value="' + res[i].code + '">' + res[i].code + '~' + res[i].name_1 + '</option>'
            }

            $('.select_groupmain').html(html);
            $('.select_groupmain').select2({
                theme: "bootstrap"
            });
        },
        error: function (res) {
            console.log(res)
        },
    });
}

function  _getWhcode() {
    $.ajax({
        url: serverURL + 'getWarehouse',
        method: 'GET',
        cache: false,
        success: function (res) {

            console.log(res)
            var html = '<option value="">---เลือกคลัง---</option>';
            for (var i = 0; i < res.length; i++) {
                html += ' <option value="' + res[i].code + '">' + res[i].code + '~' + res[i].name + '</option>'
            }

            $('.select_whcode').html(html);
            $('.select_whcode').select2({
                theme: "bootstrap"
            });
        },
        error: function (res) {
            console.log(res)
        },
    });
}

function _loadItemData() {
    $('#overlay').show();
    $("#btn_search").attr('disabled', 'true');
    $.ajax({
        url: serverURL + 'getItemList',
        method: 'GET',
        cache: false,
        success: function (res) {
            console.log(res)

            if (res.length > 0) {
                var html = "";
                for (var i = 0; i < res.length; i++) {
                    html += `<tr class='item_click' code='${res[i].item_code}' style='cursor:pointer'>
                                <td>${res[i].item_code}</td>
                                <td>${res[i].item_name}</td>
                                <td>${res[i].unit_code}</td>
                            </tr>`
                }
                $('#item_body_detail').html(html)
                setTimeout(function () {
                    $('#overlay').hide();
                    $('#table-item-select').DataTable();
                    $("#btn_search").removeAttr('disabled');
                }, 1000)

            } else {
                $('#overlay').hide();
                alert('ไม่พบข้อมูลสินค้า')
                $("#btn_search").removeAttr('disabled');
            }

        },
        error: function (res) {
            $('#overlay').hide();
            console.log(res)
        },
    });


}

function  _alertMsgBox() {
    $.ajax({
        url: serverURL + 'getAlertMsg',
        method: 'GET',
        cache: false,
        success: function (res) {

            console.log(res)
            if (res.length > 0) {
                var html = 'เอกสาร รหัส <br>';
                for (var i = 0; i < res.length; i++) {
                    var stat = '';
                    if (res[i].status == 0) {
                        stat = '<b style="color:red">ไม่อนุมัติ</b> หมายเหตุ:' + res[i].reason;
                    } else if (res[i].status == 1) {
                        stat = '<b style="color:#ffff99">รออนุมัติ</b>';
                    } else if (res[i].status == 2) {
                        stat = '<b style="color:#66ffff">อนุมัติแล้ว</b>';
                    }
                    html += res[i].doc_no + ' สถานะ: ' + stat + '<br>';
                }
                $("#alert-doc-msg").html(html);
                $('#showAlertMsg').show();
            }

        },
        error: function (res) {
            console.log(res)
        },
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
    _loadItemData()
    _getWhcode()
    _getGroupmain()
    _getGroupsub()
    _getBrand()
    _getDoctype()


    $(document).delegate('.item_click', 'click', function (event) {
        var code = $(this).attr('code')
        var old_data = $('#item_code').val();
        if (old_data == '') {
            $('#item_code').val(code)
        } else {
            $('#item_code').val(old_data + ',' + code)
        }

        $('#productModal').modal('hide')

    });

    $("#btn_search").on('click', function (e) {


        $('#productModal').modal('show')
    });

    $("#copy").on('click', function (e) {


        let el = document.getElementById("table_report");
        let body = document.body;
        let range;
        let sel;
        if (document.createRange && window.getSelection) {
            range = document.createRange();
            sel = window.getSelection();
            sel.removeAllRanges();
            try {
                range.selectNodeContents(el);
                sel.addRange(range);
            } catch (e) {
                range.selectNode(el);
                sel.addRange(range);
            }
        }
        document.execCommand("Copy");
        alert("Copy Table to Clipboard");


    });

});


function _Process() {
    var item_code = $('#item_code').val();
    var wh_code = $('#wh_code').val();
    var group_main = $('#group_main').val();
    var group_sub = $('#group_sub').val();
    var item_brand = $('#item_brand').val();
    var doc_type = $('#doc_type').val();


    $.ajax({
        url: serverURL + 'getReportStock?whcode=' + wh_code + '&groupmain=' + group_main + '&groupsub=' + group_sub + '&itembrand=' + item_brand + '&itemcode=' + item_code + '&type=' + doc_type,
        method: 'GET',
        cache: false,
        success: function (res) {
            console.log(res)

            _showDetail(res);
        },
        error: function (res) {
            console.log(res)
        },
    });
}


function _showDetail(data) {
    $('#show_list_detail').html('');
    if (data.length > 0) {
        var html = "";
        for (var i = 0; i < data.length; i++) {
            html += `<tr>
                        <td nowrap>${data[i].item_code}</td>
                        <td nowrap>${data[i].item_name}</td>`
            if (data[i].barcode == '') {
                html += `  <td nowrap></td>`
            } else {
                html += `  <td nowrap>${data[i].barcode}'</td>`
            }

            html += `   <td nowrap>${data[i].wh_code}</td>
                        <td nowrap class='text-center'>${data[i].unit_code}</td>
                        <td nowrap class='text-right' style='color:#007bff;font-weight:bold'>${formatnumber(parseFloat(data[i].sc_qty))}</td>
                        <td nowrap class='text-right' style='color:#6610f2;font-weight:bold'>${formatnumber(parseFloat(data[i].balance_qty))}</td>
                        `
            if (parseFloat(data[i].sc_qty) == parseFloat(data[i].balance_qty)) {
                html += `  <td nowrap class='text-right' style='color:#28a745;font-weight:bold'>${formatnumber(parseFloat(data[i].sc_qty) - parseFloat(data[i].balance_qty))}</td> <td nowrap class='text-center' style='background-color:#28a745;color:#fff;font-weight:bold'>Match</td>`
            } else {
                html += `  <td nowrap class='text-right' style='color:#dc3545;font-weight:bold'>${formatnumber(parseFloat(data[i].sc_qty) - parseFloat(data[i].balance_qty))}</td> <td nowrap class='text-center' style='background-color:#dc3545;color:#fff;font-weight:bold'>Not Match</td>`
            }

            html += `</tr>`
        }
        $('#show_list_detail').html(html);
    }
}
function formatnumber2(nStr)
{

    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    var data = x1 + x2;
    return data;
}
function formatnumber(nStr)
{
    nStr = parseFloat(nStr).toFixed(2);
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    var data = x1 + x2;
    return data;
}
function formatdate(date) {

    var d = new Date(date);
    var dd = d.getDate();
    var mm = d.getMonth() + 1;
    var yy = d.getFullYear();
    return dd + "/" + mm + "/" + yy;
}
function _searchCopyCust() {
    var search_copy_cust_input = $('#search_copy_cust_input').val()
    // console.log(search_cust_input)

    $.ajax({
        url: serverURL + 'getCustomer?search=' + search_copy_cust_input,
        method: 'GET',
        cache: false,
        success: function (res) {
            var html = '';
            for (var i = 0; i < res.length; i++) {
                html += "<li class = 'list-group-item list-group-item-action select-copy-cust' data-code='" + res[i].code + "' data-name='" + res[i].name_1 + "'> " + res[i].code + '~' + res[i].name_1 + " </li>"
            }
            $('#list_search_copy_cust').html(html)

        },
        error: function (res) {
            console.log(res)
        },
    });
}

$(document).delegate('.select-cust', 'click', function (event) {
    var code = $(this).attr('data-code')
    $('#cust_code').val(code);
    $('#modalCust').modal('hide');
});
$(document).delegate('.select-copy-cust', 'click', function (event) {
    var code = $(this).attr('data-code')
    $('#copy_cust_code').val(code);
    $('#copy_contactor').val('');
    $('#modalCopyCust').modal('hide');
});
$(document).delegate('.select-contact', 'click', function (event) {
    var name = $(this).attr('data-name')
    $('#contactor').val(name);
    $('#modalContactor').modal('hide');
});
$(document).delegate('.select-copy-contact', 'click', function (event) {
    var name = $(this).attr('data-name')
    $('#copy_contactor').val(name);
    $('#modalCopyContactor').modal('hide');
});
function _searchContact() {
    var search_contactor_input = $('#search_contactor_input').val();
    var cust_code = $('#cust_code').val();
    // console.log(search_cust_input)

    $.ajax({
        url: serverURL + 'getContact?cust=' + cust_code + '&search=' + search_contactor_input,
        method: 'GET',
        cache: false,
        success: function (res) {
            console.log(res)
            var html = '';
            for (var i = 0; i < res.length; i++) {
                if (res[i].name == undefined) {
                    res[i].name = '';
                }
                if (res[i].telephone == undefined) {
                    res[i].telephone = '';
                }
                if (res[i].address == undefined) {
                    res[i].address = '';
                }
                html += "<li class = 'list-group-item list-group-item-action select-contact' data-name='" + res[i].name + "' data-tel='" + res[i].telephone + "' data-address='" + res[i].address + "'> " + res[i].name + ' | ' + res[i].telephone + "|" + res[i].address + "</li>"
            }
            $('#list_search_contact').html(html)

        },
        error: function (res) {
            console.log(res)
        },
    });
}
function _searchCust() {
    var search_cust_input = $('#search_cust_input').val()
    // console.log(search_cust_input)

    $.ajax({
        url: serverURL + 'getCustomer?search=' + search_cust_input,
        method: 'GET',
        cache: false,
        success: function (res) {
            var html = '';
            for (var i = 0; i < res.length; i++) {
                html += "<li class = 'list-group-item list-group-item-action select-cust' data-code='" + res[i].code + "' data-name='" + res[i].name_1 + "'> " + res[i].code + '~' + res[i].name_1 + " </li>"
            }
            $('#list_search_cust').html(html)

        },
        error: function (res) {
            console.log(res)
        },
    });
}


function printData(data) {
    window.open('../print/index.jsp' + "?docno=" + data, "_blank");
}


function _searchItem() {
    var search_name = $('#search_name').val()
    console.log(search_name)

    $.ajax({
        url: serverURL + 'search_item?name=' + search_name,
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
        purchases: 0.00,
        cost_qty: 0.00,
        cost_weight: 0.00,
        cost_sum_weight: 0.00,
        cost_factory_price: 0.00,
        cost_sum_cost: 0.00,
        exp_discount: 0.00,
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
        sale_percent_profit: 0.00,
        selling_price: 0.00,
        sale_discount: 0.00
    });
    _displayTable();
}

function _getListData(data) {
    var branch = $('#user_branch').val();
    $.ajax({
        url: serverURL + 'getDocSo?branch=' + branch + '&search=' + data,
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

function formatNumber(num) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
function removeCommas(str) {

    if (str != '0') {
        while (str.search(",") >= 0) {
            str = (str + "").replace(',', '');
        }
    }
    return str;
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
        html += '            <div class="col-sm-6">'
        html += '                <h6 class=" text-left">ชื่อโครงการ:<b > ' + data[i].project_name + '</b></h6>'
        html += '            </div>'
        html += '            <div class="col-sm-6">'
        html += '                <h6 class=" text-left">ผู้ติดต่อ:<b > ' + data[i].contact + '</b></h6>'
        html += '            </div>'
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
        html += '                <h6 class=" text-left">หมายเหตุ:<b > ' + data[i].remark + '</b></h6>'
        html += '            </div>'
        if (data[i].reason != '' && data[i].reason != undefined) {
            html += '            <div class="col-sm-6">'
            html += '                <h6 class=" text-left"><b style="color:red">ไม่ผ่านอนุมัติ หมายเหตุ: ' + data[i].reason + '</b></h6>'
            html += '            </div>'
        }
        html += '        </div>'
        html += '        <button class="btn btn-success send_approve" data-docno="' + data[i].doc_no + '"><i class="fa fa-share "></i> ส่งไปอนุมัติ</button>'
        html += '        <button class="btn btn-info show_detail" data-docno="' + data[i].doc_no + '"><i class="fa fa-search"></i> รายละเอียด</button>'
        html += '        <button class="btn copy-doc" style="background-color:#aa00c7;color:#fff" data-docno="' + data[i].doc_no + '"><i class="fa fa-clone"></i> คัดลอกเอกสาร</button>'

        html += '        <button class="btn btn-danger del_doc"  data-docno="' + data[i].doc_no + '"><i class="fa fa-trash"></i> ลบเอกสาร</button>'
        html += '    </div>'
        html += '</div>'
    }
    $('#show_list_detail').html(html);
}

function delLine(data) {
    console.log(data)
    item_detail.splice(data, 1);
    _displayTable()

}

function _displayTable() {
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
        html += '<td class="text-center"><i class="fa fa-minus-circle" style="cursor:pointer;color:red" onclick="delLine(' + i + ')"></i></td>'
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


    $('#total_cost_qty').html(formatNumber(total_cost_qty))

    $('#total_cost_purchases').html(formatNumber(total_cost_purchases))
    $('#total_cost_factory_price').html(formatNumber(total_cost_factory_price))

    $('#total_exp_each').html(formatNumber(total_exp_each))

    $('#total_sale_sum_lao_cost').html(formatNumber(total_sale_sum_lao_cost))
    $('#total_sale_sum_cost').html(formatNumber(total_sale_sum_cost))
    $('#total_sale_price').html(formatNumber(total_sale_price))
    $('#total_selling_price').html(formatNumber(total_selling_price))
    $('#total_sale_sum_amount').html(formatNumber(total_sale_sum_amount))
    $('#total_sale_profit').html(formatNumber(total_sale_profit))
    $('#total_sale_percent_profit').html(formatNumber(total_sale_percent_profit) + "%")

    $('#item_detail').html(html);
}
