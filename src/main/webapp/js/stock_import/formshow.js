var serverURL = "../";
var userbranch = '';
var cmd_status = "0";
function uuidv4() {
    return 'xxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
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



var item_detail = []

var show_balance = "0";

function _getDocType() {
    $.ajax({
        url: serverURL + 'getDocType',
        method: 'GET',
        cache: false,
        success: function (res) {
            console.log(res)
            var html = ` <option value="">---เลือกประเภท---</option>`;
            if (res.length > 0) {

                for (var i = 0; i < res.length; i++) {

                    html += `<option value="${res[i].code}~${res[i].trans_type}">${res[i].code}</option>`;
                }
            } else {
                html = `<option value="">ไม่พบข้อมูล</option>`;
            }
            $("#doc_type").html(html);
        },
        error: function (res) {
            console.log(res)
        },
    });
}

$(document).delegate('#itemsselect', 'input', function (event) {
    var code = $('#itemsselect').val()
    console.log(code)
    if (code != '') {
        $.ajax({
            url: serverURL + 'getItemDetail?itemcode=' + code,
            method: 'GET',
            cache: false,
            success: function (res) {
                console.log(res)
                var html = "";
                if (res.length > 0) {
                    $('#add_item_name').val(res[0].item_name)
                    html = "";
                    for (var i = 0; i < res[0].units.length; i++) {
                        html = `<option value='${res[0].units[i].unit_code}'>${res[0].units[i].unit_code}~${res[0].units[i].unit_name}</option>`;
                    }
                    $('#add_unit_code').html(html);
                } else {
                    swal("ไม่พบสินค้า", code, "warning");
                }

            },
            error: function (res) {
                console.log(res)
            },
        });
    }
});
$(document).ready(function () {


    var cmd_mode = $('#form-mode').val();
    cmd_status = $('#form-status').val();
    if (cmd_mode != '') {
        console.log('here')
        $('#doc_no').val(cmd_mode);

        _getDocDetail(cmd_mode);
    } else {
        _displayTable();

        $('#doc_no').val(datetime);
        $('#doc_date').val(currentdate.getFullYear() + '-' + ('0' + (currentdate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentdate.getDate()).slice(-2));
        $('#remark').val('');
    }
  
    /*
     
     _getWhList();
     _getBranchList();
     _getToWhList()
     _getToBranchList()
     */
    /*
     var currentdate = new Date();
     var datetime = 'RT' + currentdate.getFullYear() + '' + (currentdate.getMonth() + 1) + '' + currentdate.getDate() + '' + currentdate.getHours() + '' + currentdate.getMinutes() + '' + currentdate.getSeconds() + '' + uuidv4().toUpperCase()
     
     var cmd_mode = $('#form-mode').val();
     cmd_status = $('#form-status').val();
     if (cmd_mode != '') {
     console.log('here')
     $('#doc_no').val(cmd_mode);
     
     _getDocDetail(cmd_mode);
     } else {
     _displayTable();
     
     $('#doc_no').val(datetime);
     $('#doc_date').val(currentdate.getFullYear() + '-' + ('0' + (currentdate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentdate.getDate()).slice(-2));
     $('#remark').val('');
     }
     
     */

    $("#scanner").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            var data = $("#scanner").val();
            console.log(data)

            if (data != '') {
                $.ajax({
                    url: serverURL + 'getBarcodeDetail?barcode=' + data + '&itemcode=&page=1',
                    method: 'GET',
                    cache: false,
                    success: function (res) {
                        console.log(res)
                        var html = "";
                        if (res.length > 0) {
                            var row = item_detail.filter(
                                    c => c.item_code == res[0].item_code
                            );

                            if (row.length == 0) {
                                item_detail.push({item_code: res[0].item_code, item_name: res[0].item_name, unit_code: res[0].unit_code, doc_date: currentdate.getFullYear() + '-' + ('0' + (currentdate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentdate.getDate()).slice(-2), qty: 0});
                                _displayTable()
                                $("#scanner").val('');
                            } else {
                                swal("มีสินค้าในรายการแล้ว", data, "warning")
                            }
                        } else {
                            swal("ไม่พบสินค้า", data, "warning")
                        }

                    },
                    error: function (res) {
                        console.log(res)
                    },
                });
            }

        }
    });
    $('#btn_create').on('click', function () {
        var doc_no = $('#doc_no').val();
        var wh_code = $('#wh_code').val()
        var doc_ref = $('#doc_ref').val();
        var doc_type = $('#doc_type').val().split('~')[0];
        var trans_type = $("input[name='trans_type']:checked").val();
        var qty = $('#qty').val();
        var remark = $('#remark').val();
        var creator_code = $('#userlogin').val();

        var details = [];
        var msg = '';
        if (doc_no == '') {
            msg += 'เลขที่เอกสาร \n'
        }
        if (wh_code == '') {
            msg += 'คลัง \n'
        }
        if (doc_ref == '') {
            msg += 'เอกสารอ้างอิง \n'
        }
        if (doc_type == '') {
            msg += 'ประเภท \n'
        }
        if (msg != '') {

            swal("กรุณาเพิ่ม ", msg, "warning")
        } else {
            for (var i = 0; i < item_detail.length; i++) {
                if (item_detail[i].item_code != '') {
                    var json_detail = {
                        line_number: i,
                        item_code: item_detail[i].item_code,
                        item_name: item_detail[i].item_name,
                        unit_code: item_detail[i].unit_code,
                        doc_date: item_detail[i].doc_date,
                        qty: item_detail[i].qty
                    }
                    details.push(json_detail);
                }
            }
            console.log(details)
            if (details.length > 0) {
                var json_data = {
                    doc_no: doc_no,
                    wh_code: wh_code,
                    creator_code: creator_code,
                    doc_ref: doc_ref,
                    doc_type: doc_type,
                    trans_type: trans_type,
                    remark: remark,
                    data: JSON.stringify(details)

                }
                $.ajax({
                    url: serverURL + 'saveDocImport',
                    method: 'POST',
                    data: json_data,
                    success: function (res) {
                        console.log(res)
                        swal("บันทึกข้อมูลสำเร็จ", "", "success")
                        setTimeout(function () {
                            window.location.href = "index.jsp"
                        }, 2000);
                    },
                    error: function (res) {
                        console.log(res)
                    },
                });
            } else {
                alert('กรุณาเพิ่มรายละเอียด')
            }
        }
    });

    $('#from_wh').on('change', function () {
        var data = $('#from_wh').val();
        if (data != '') {
            _getShList();

        } else {
            // $('.shelf_select').select2().destroy();
            $('#from_sh').html('');
            $('#from_sh').val('').trigger('change');
            $('#from_sh').attr('disabled', 'true');
        }
    });

    $('#to_wh').on('change', function () {
        var data = $('#to_wh').val();
        if (data != '') {
            _getShList2();

        } else {
            // $('.shelf_select').select2().destroy();
            $('#to_sh').html('');
            $('#to_sh').val('').trigger('change');
            $('#to_sh').attr('disabled', 'true');
        }
    });

    $(document).delegate('.btn-search', 'click', function (event) {
        var data = $(this).attr('index').split('_');
        var detail = data[0];
        var index = data[1];
        var to_bh = $('#to_bh').val();
        var to_wh = $('#to_wh').val();
        var msg = '';
        if (to_bh == '') {
            msg += 'สาขา \n'
        }
        if (to_wh == '') {
            msg += 'คลัง \n'
        }

        if (msg != "") {
            swal("กรุณาเลือก " + msg, "", "warning")
        } else {
            $('#line_index').val(index)
            $('#line_action').val(detail)
            $('#modalSearch').modal('show')
        }

    });

    $(document).delegate('.select-items', 'click', function (event) {
        var code = $(this).attr('data-code')
        var name = $(this).attr('data-name')
        var index = $('#line_index').val()
        var detail = $('#line_action').val()

        var row = item_detail.filter(
                c => c.item_code == code
        );

        if (row.length == 0) {


            item_detail[index].item_code = code;
            item_detail[index].item_name = name;
            $.ajax({
                url: serverURL + 'unit_item?code=' + code,
                method: 'GET',
                cache: false,
                success: function (res) {

                    console.log(res)
                    if (res.length == 1) {
                        item_detail[index].unit_code = res[0].code;
                        item_detail[index].unit_name = res[0].name_1;
                        _getCost(index, code, res[0].code);
                    } else {
                        var html = '';
                        for (var i = 0; i < res.length; i++) {
                            html += "<li class = 'list-group-item list-group-item-action select-unit' data-itemcode='" + code + "'  data-code='" + res[i].code + "' data-name='" + res[i].name_1 + "' > " + res[i].code + '~' + res[i].name_1 + " </li>"
                        }
                        $('#list_unit_item').html(html)
                        $('#modalSearch').modal('hide')
                        setTimeout(function () {
                            $('#modalUnit').modal('show')
                        }, 500);
                    }

                },
                error: function (res) {
                    console.log(res)
                },
            });
        } else {
            swal("พบสินค้าในรายการแล้ว", code, "warning")
        }
    });

    $(document).delegate('.qty_edit', 'input', function (event) {

        var index = $(this).attr('data-index')
        var data = $('.qty_value_' + index).val();


        if (parseFloat(data) > 0) {
            item_detail[index].qty = data
        } else {
            item_detail[index].qty = 1
        }

        $('.qty_value_' + index).val(item_detail[index].qty);

    });

    $(document).delegate('.select-unit', 'click', function (event) {
        var code = $(this).attr('data-code')
        var name = $(this).attr('data-name')
        var itemcode = $(this).attr('data-itemcode')
        var to_bh = $('#from_bh').val();
        var to_wh = $('#from_wh').val();
        var to_sh = $('#from_sh').val();

        var index = $('#line_index').val()
        var detail = $('#line_action').val()

        item_detail[index].unit_code = code;
        item_detail[index].unit_name = name;

        $.ajax({
            url: serverURL + 'getBalance?code=' + itemcode + '&unit=' + code + '&whcode=' + to_wh + '&branch=' + to_bh,
            method: 'GET',
            cache: false,
            success: function (res) {

                console.log(res)
                if (res.length == 1) {
                    item_detail[index].balance = res[0].balance_qty
                    _displayTable();
                    $('#modalUnit').modal('hide');
                } else {
                    item_detail[index].balance = 0
                    _displayTable();
                    $('#modalUnit').modal('hide');
                }

            },
            error: function (res) {
                console.log(res)
            },
        });


    });

});


function _getDocDetail(docno) {

    $.ajax({
        url: serverURL + 'getDocImportDetail?docno=' + docno,
        method: 'GET',
        cache: false,
        success: function (res) {
            console.log(res);
            if (res.length > 0) {
                $('#doc_no').val(res[0].doc_no);
                $('#doc_ref').val(res[0].doc_ref);
                $('#remark').val(res[0].remark);

                $('#creator_code').val(res[0].creator_code + '~' + res[0].creator_name);
                $('#wh_code').val(res[0].wh_code + '~' + res[0].wh_name);
                $('#doc_type').val(res[0].doc_type);
                if (res[0].trans_type == '0') {
                    $('#inlineRadio1').prop('checked', 'true')
                } else {
                    $('#inlineRadio2').prop('checked', 'true')
                }

                setTimeout(function () {


                    item_detail = res[0].detail;
                    _displayTable();

                }, 500);



            } else {

                setTimeout(function () {
                    swal("ไม่พบเอกสารนี้", "", "success")
                }, 300);
                setTimeout(function () {
                    window.location.href = "index.jsp"
                }, 1500);
            }


        },
        error: function (res) {
            console.log(res)
        },
    });
}


function _getCost(index, itemcode, unitcode) {
    var to_bh = $('#from_bh').val();
    var to_wh = $('#from_wh').val();
    var to_sh = $('#from_sh').val();

    $.ajax({
        url: serverURL + 'getBalance?code=' + itemcode + '&unit=' + unitcode + '&whcode=' + to_wh + '&branch=' + to_bh,
        method: 'GET',
        cache: false,
        success: function (res) {

            console.log(res)
            if (res.length > 0) {
                item_detail[index].balance = res[0].balance_qty
                _displayTable();
                $('#modalSearch').modal('hide')
            } else {
                item_detail[index].balance = '0'
                _displayTable();
                $('#modalSearch').modal('hide')
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



function _searchItem() {
    var search_name = $('#search_name').val()
    var search_barcode = $('#search_barcode').val()
    console.log(search_name)

    $.ajax({
        url: serverURL + 'search_item?name=' + search_name + '&barcode=' + search_barcode,
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
    $('#itemsselect').val('').trigger('change')
    $('#add_item_name').val('')
    $('#add_unit_code').html('')

    $('#add_qty').val('0')
    $('#createModal').modal('show');
}



function _displayTable() {
    var html = '';
    for (var i = 0; i < item_detail.length; i++) {


        html += '<tr>'
        html += '<td class="text-center">' + (i + 1) + '</td>'

        html += '<td class="text-left " style="cursor:pointer" index="item_' + i + '">' + item_detail[i].item_code + '</td>'


        html += '<td class="text-left">' + item_detail[i].item_name + '</td>'

        html += '<td class="text-center">' + item_detail[i].unit_code + '</td>'
        html += '<td class="text-center">' + item_detail[i].doc_date + '</td>'
        html += '<td class="text-right" >' + item_detail[i].qty + '</td>'




        html += '</tr>'
    }

    $('#item_detail').html(html);
}
function editLine(data) {
    console.log(data)

    var code = item_detail[data].item_code;
    console.log(code)
    if (code != '') {
        $.ajax({
            url: serverURL + 'getItemDetail?itemcode=' + code,
            method: 'GET',
            cache: false,
            success: function (res) {
                console.log(res)
                var html = "";
                if (res.length > 0) {
                    $('#edit_title').html(item_detail[data].item_code + '~' + item_detail[data].item_name)
                    html = "";
                    for (var i = 0; i < res[0].units.length; i++) {
                        html = `<option value='${res[0].units[i].unit_code}'>${res[0].units[i].unit_code}~${res[0].units[i].unit_name}</option>`;
                    }
                    $('#edit_unit_code').html(html);
                    $('#edit_index').val(data)
                    $('#edit_item').val(item_detail[data].item_code + '~' + item_detail[data].item_name)
                    $('#edit_item_code').val(item_detail[data].item_code)
                    $('#edit_item_name').val(item_detail[data].item_name)
                    $('#edit_doc_date').val(item_detail[data].doc_date)
                    if (edit_date == "0") {
                        $('#edit_doc_date').attr("readonly", "true")
                    } else {
                        $('#edit_doc_date').removeAttr("readonly")
                    }
                    $('#edit_qty').val(item_detail[data].qty)
                    setTimeout(function () {
                        $('#edit_unit_code').val(item_detail[data].unit_code).trigger('change')
                        $('#editModal').modal('show')
                    }, 500);
                } else {
                    swal("ไม่พบสินค้า", code, "warning");
                }

            },
            error: function (res) {
                console.log(res)
            },
        });
    }

}

function delLine(data) {
    console.log(data)
    item_detail.splice(data, 1);
    _displayTable()

}

