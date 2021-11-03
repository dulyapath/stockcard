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
    _getDocType()


    $.ajax({
        url: serverURL + 'getScSetting',
        method: 'GET',
        cache: false,
        success: function (res) {
            console.log(res)
            var html = "";
            if (res.length > 0) {
                if (res[0].date_edit == 1) {
                    edit_date = "1"
                } else {
                    edit_date = "0"
                }
            } else {
                edit_date = "0"
            }

        },
        error: function (res) {
            console.log(res)
        },
    });

    $('#itemsselect').select2({
        theme: "bootstrap",
        ajax: {
            url: serverURL + 'getItemList',
            dataType: 'json',
            type: "GET",
            quietMillis: 50,
            data: function (term) {
                //console.log(term)
                return {
                    term: term.term
                };
            },
            processResults: function (data) {
                return {
                    results: $.map(data, function (item) {
                        return {
                            text: item.item_code + '~' + item.item_name,
                            id: item.item_code
                        }
                    })
                };
            }
        }
    });


    var currentdate = new Date();
    var datetime = 'IMP-' + currentdate.getFullYear() + '' + (currentdate.getMonth() + 1) + '' + currentdate.getDate() + '' + currentdate.getHours() + '' + currentdate.getMinutes() + '' + currentdate.getSeconds() + '' + uuidv4().toUpperCase()

    var _user_code = $('#user_code').val();
    var _user_name = $('#user_namex').val();
    var _user_wh = $('#user_wh').val();

    setTimeout(function () {

        $('#add_doc_date').val(currentdate.getFullYear() + '-' + ('0' + (currentdate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentdate.getDate()).slice(-2))
        if (edit_date == "0") {
            $('#add_doc_date').attr("readonly", "true")
        } else {
            $('#add_doc_date').removeAttr("readonly")
        }
    }, 500)


    $('#doc_no').val(datetime)
    $('#creator_code').val(_user_code + '~' + _user_name);
    $('#wh_code').val(_user_wh)



    $('#add_to_list').on('click', function () {
        var code = $('#itemsselect').val()
        var item_name = $('#add_item_name').val();
        var unit_code = $('#add_unit_code').val()
        var doc_date = $('#add_doc_date').val()
        var qty = $('#add_qty').val()

        if (code != '' && unit_code != '' && doc_date != '' && qty != '' && item_name != '') {
            item_detail.push({item_code: code, item_name: item_name, unit_code: unit_code, doc_date: doc_date, qty: qty});

            _displayTable();

            $('#itemsselect').val('').trigger('change')
            $('#add_item_name').val('')
            $('#add_unit_code').html('')

            $('#add_qty').val('0')

            swal("แจ้งเตือนระบบ", "เพิ่มรายการสำเร็จ", "success")

            setTimeout(function () {
                $('#createModal').modal('hide')
            }, 500)
        } else {
            swal("แจ้งเตือนระบบ", "กรุณากรอกข้อมูลให้ครบ", "warning")
        }
    });

    $('#edit_to_list').on('click', function () {
        var index = $('#edit_index').val()
        var code = $('#edit_item_code').val()
        var item_name = $('#edit_item_name').val();
        var unit_code = $('#edit_unit_code').val()
        var doc_date = $('#edit_doc_date').val()
        var qty = $('#edit_qty').val()

        if (code != '' && unit_code != '' && doc_date != '' && qty != '' && item_name != '') {

            item_detail[index].item_code = code;
            item_detail[index].item_name = item_name;
            item_detail[index].unit_code = unit_code;
            item_detail[index].doc_date = doc_date;
            item_detail[index].qty = qty;
            _displayTable();


            swal("แจ้งเตือนระบบ", "แก้ไขรายการสำเร็จ", "success")

            setTimeout(function () {
                $('#editModal').modal('hide')
            }, 500)
        } else {
            swal("แจ้งเตือนระบบ", "กรุณากรอกข้อมูลให้ครบ", "warning")
        }
    });



    $("#doc_type").on('input', function (e) {
        var data = $('#doc_type').val();
        var split = data.split('~')[1]
        $("[name=trans_type]").val([split]);
    });

    document.getElementById('formFile')
            .addEventListener('change', function () {

                var fr = new FileReader();

                fr.onload = function (progressEvent) {
                    var fileContentArray = this.result.split(/\r\n|\n/);
                    // console.log(fileContentArray)

                    for (var i = 0; i < fileContentArray.length; i++) {
                        if (i > 0) {
                            var lines = fileContentArray[i].split('\t');
                            if (lines[0] != '') {
                                item_detail.push({item_code: lines[0], item_name: lines[1], unit_code: lines[2], doc_date: lines[3], qty: lines[4]})
                            }

                            /*for (var line = 0; line < lines.length; line++) {
                             console.log(line + " --> " + lines[line]);
                             
                             }*/


                        }
                    }

                };

                fr.readAsText(this.files[0]);

                setTimeout(function () {
                    _displayTable();
                }, 500)
            })
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
    $('.loading').show();
    $.ajax({
        url: serverURL + 'getDocRequestDetail?docno=' + docno,
        method: 'GET',
        cache: false,
        success: function (res) {
            console.log(res);
            if (res.length > 0) {
                $('#doc_no').val(res[0].doc_no);
                $('#doc_no').attr("readonly", "true");
                $('#doc_date').val(res[0].date);
                $('#remark').val(res[0].remark);

                $('#from_bh').val(res[0].branch_code);
                $('#from_wh').val(res[0].wh_code).trigger("change");


                $('#to_bh').val(res[0].to_branch_code);
                $('#to_wh').val(res[0].to_wh_code).trigger("change");


                setTimeout(function () {
                    $('#from_sh').val(res[0].shelf_code).trigger("change");
                    $('#to_sh').val(res[0].to_shelf_code).trigger("change");
                    item_detail = res[0].detail;
                    _displayTable();

                    if (cmd_status != "0") {
                        $('#doc_date').attr("disabled", "true");
                        $('#remark').attr("disabled", "true");
                        $('#from_bh').attr("disabled", "true");
                        $('#from_wh').attr("disabled", "true");
                        $('#to_bh').attr("disabled", "true");
                        $('#to_wh').attr("disabled", "true");
                        $('#from_sh').attr("disabled", "true");
                        $('#to_sh').attr("disabled", "true");
                        $('.btn-addline').hide();
                        $('#btn_create').hide();
                        $('#btn_create').hide();
                        $('.btn-back').text('กลับสู่หน้าจอหลัก')
                    }
                    $('.loading').hide();
                }, 1000);



            } else {
                $('.loading').hide();
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


        html += '<td class="text-center"><i class="fa fa-edit" style="cursor:pointer;color:orange" onclick="editLine(' + i + ')"></i> <i class="fa fa-trash" style="cursor:pointer;color:red;margin-left:10px" onclick="delLine(' + i + ')"></i></td>'


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

