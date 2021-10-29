var serverURL = "../";
var pageActive = 1;
$(document).ready(function () {


    //_loadItemData()
    _getDocType();

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

    setTimeout(function () {
        _loadUserData()
    }, 500)



    $("#doc_type").on('input', function (e) {
        var data = $('#doc_type').val();
        var split = data.split('~')[1]
        $("[name=trans_type]").val([split]);
    });

    $("#new_item").on('click', function (e) {
        var item_code = $('#item_code').text();
        if (item_code != '') {
            var currentdate = new Date();
            $('#doc_date').val(currentdate.getFullYear() + '-' + ('0' + (currentdate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentdate.getDate()).slice(-2));

            $('#doc_type').val('');
            $('#qty').val('0');
            $('#remark').val('');
            $('#createModal').modal('show');
        } else {
            swal("กรุณาเลือกสินค้า ", '', "warning")
        }
    });


    $("#copy").on('click', function (e) {
        var item_code = $('#item_code').text();
        if (item_code != '') {
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
        } else {
            swal("กรุณาเลือกสินค้า ", '', "warning")
        }

    });

    $(".btn-showmore").on('click', function (e) {
        var item_code = $('#item_code').text();
        var item_show = $('#item_show').text();
        var total_item = $('#total_item').text();
        if (item_code != '') {
            if (total_item != item_show) {
                pageActive += 1;

                _loadlistItem(item_code);
            } else {
                swal("แสดงรายการทั้งหมดแล้ว ", '', "warning")
            }

        } else {
            swal("กรุณาเลือกสินค้า ", '', "warning")
        }

    });

    $("#create_save").on('click', function (e) {
        var item_code = $('#item_code').text();
        var unit_code = $('#unit_code').text();
        var wh_code = $('#wh_code').text();
        var doc_date = $('#doc_date').val();
        var doc_ref = $('#doc_ref').val();
        var doc_type = $('#doc_type').val().split('~')[0];
        var trans_type = $("input[name='trans_type']:checked").val();
        var qty = $('#qty').val();
        var remark = $('#remark').val();
        var creator_code = $('#userlogin').val();

        var msg = '';
        if (doc_date == '') {
            msg += 'วันที่ \n'
        }
        if (doc_ref == '') {
            msg += 'เอกสารอ้างอิง \n'
        }
        if (doc_type == '') {
            msg += 'ประเภทเอกสาร \n'
        }
        if (qty == '') {
            msg += 'จำนวน \n'
        }

        if (msg != '') {
            swal("กรุณาป้อนข้อมูล ", msg, "warning")
        } else {
            console.log('123415')
            var json_data = {
                item_code: item_code,
                unit_code: unit_code,
                wh_code: wh_code,
                doc_date: doc_date,
                doc_ref: doc_ref,
                doc_type: doc_type,
                trans_type: trans_type,
                qty: qty,
                remark: remark,
                creator_code: creator_code
            }
            $.ajax({
                url: serverURL + 'saveBarcode',
                method: 'POST',
                data: json_data,
                success: function (res) {
                    console.log(res)
                    if (res == 'success') {
                        _loadlistItem(item_code);

                        $('#createModal').modal('hide');
                        swal("บันทึกข้อมูลสำเร็จ", "", "success")
                    } else {
                        swal("ข้อมูลซ้ำ", "", "warning")
                    }
                },
                error: function (res) {

                    swal("Error " + res, "", "error")
                },
            });
        }
    });


    $("#scanner").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            var data = $("#scanner").val();
            console.log(data)

            if (data != '') {
                $.ajax({
                    url: serverURL + 'getBarcode?barcode=' + data + '&itemcode=&page=1',
                    method: 'GET',
                    cache: false,
                    success: function (res) {
                        console.log(res)
                        var html = "";
                        if (res.length > 0) {
                            $('#item_code').text(res[0].item_code);
                            $('#item_name').text(res[0].item_name);
                            $('#unit_code').text(res[0].unit_code);
                            $('#unit_name').text(res[0].unit_name);
                            $('#total_item').text(res[0].total_item);
                            $('#item_show').text(res[0].detail.length);
                            var html = "";
                            if (res[0].detail.length > 0) {
                                console.log(res[0].detail)
                                var balance_qty = 0;
                                if (parseFloat(res[0].old_balance) > 0) {
                                    balance_qty = parseFloat(res[0].old_balance);
                                    html += `<tr><td></td><td></td><td style='font-weight:bold;color:brown'>ยอดยกมา</td><td></td><td></td><td></td><td nowrap class="text-right" style='font-weight:bold;color:brown'>${formatNumber(parseFloat(res[0].old_balance))}</td><td></td><td></td></tr>`
                                }

                                for (var i = res[0].detail.length; i > 0; i--) {
                                    var dateFormat = res[0].detail[i - 1].doc_date.split('-');
                                    var doc_time = res[0].detail[i - 1].doc_time.split(' ')[1].split(':')
                                    html += `<tr>
                                    <td nowrap class="text-right">${dateFormat[2]}/${dateFormat[1]}/${dateFormat[0]}</td>
                                    <td nowrap class="text-right">${doc_time[0]}:${doc_time[1]}</td>
                                    <td nowrap class="text-left">${res[0].detail[i - 1].doc_ref}</td>
                                    <td nowrap class="text-left">${res[0].detail[i - 1].doc_type}</td>`
                                    if (res[0].detail[i - 1].trans_type == '0') {
                                        balance_qty += parseFloat(res[0].detail[i - 1].qty);
                                        html += ` <td nowrap class="text-right" style='font-weight:bold;color:green'>${formatNumber(parseFloat(res[0].detail[i - 1].qty))}</td> <td nowrap class="text-right"></td>`
                                    } else {
                                        balance_qty -= parseFloat(res[0].detail[i - 1].qty);
                                        html += ` <td nowrap class="text-right"></td><td nowrap class="text-right" style='font-weight:bold;color:red'>${formatNumber(parseFloat(res[0].detail[i - 1].qty))}</td>`
                                    }
                                    html += `
                                    <td nowrap class="text-right" style='font-weight:bold;color:brown'>${formatNumber(parseFloat(balance_qty))}</td>
                                    <td class="text-left">${res[0].detail[i - 1].creator_code}~${res[0].detail[i - 1].creator_name}</td>
                                    <td class="text-left">${res[0].detail[i - 1].remark}</td>
                                </tr>`;
                                }
                            } else {
                                html = ` <tr>
                                                    <td class="text-center" colspan='9'>ไม่พบรายการ</td>
                                                </tr>`;
                            }
                            $("#body_detail").html(html);

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
    $(document).delegate('#itemsselect', 'input', function (event) {
        var code = $('#itemsselect').val()
        console.log(code)
        if (code != '') {
            $('#productModal').modal('hide')
            $.ajax({
                url: serverURL + 'getBarcode?itemcode=' + code + '&barcode=&page=1',
                method: 'GET',
                cache: false,
                success: function (res) {
                    console.log(res)
                    var html = "";
                    if (res.length > 0) {
                        $('#item_code').text(res[0].item_code);
                        $('#item_name').text(res[0].item_name);
                        $('#unit_code').text(res[0].unit_code);
                        $('#unit_name').text(res[0].unit_name);
                        $('#total_item').text(res[0].total_item);
                        $('#item_show').text(res[0].detail.length);
                        var html = "";
                        if (res[0].detail.length > 0) {
                            console.log(res[0].detail)
                            var balance_qty = 0;
                            if (parseFloat(res[0].old_balance) > 0) {
                                balance_qty = parseFloat(res[0].old_balance);
                                html += `<tr><td></td><td></td><td style='font-weight:bold;color:brown'>ยอดยกมา</td><td></td><td></td><td></td><td nowrap class="text-right" style='font-weight:bold;color:brown'>${formatNumber(parseFloat(res[0].old_balance))}</td><td></td><td></td></tr>`
                            }

                            for (var i = res[0].detail.length; i > 0; i--) {
                                var dateFormat = res[0].detail[i - 1].doc_date.split('-');
                                var doc_time = res[0].detail[i - 1].doc_time.split(' ')[1].split(':')
                                html += `<tr>
                                    <td nowrap class="text-right">${dateFormat[2]}/${dateFormat[1]}/${dateFormat[0]}</td>
                                    <td nowrap class="text-right">${doc_time[0]}:${doc_time[1]}</td>
                                    <td nowrap class="text-left">${res[0].detail[i - 1].doc_ref}</td>
                                    <td nowrap class="text-left">${res[0].detail[i - 1].doc_type}</td>`
                                if (res[0].detail[i - 1].trans_type == '0') {
                                    balance_qty += parseFloat(res[0].detail[i - 1].qty);
                                    html += ` <td nowrap class="text-right" style='font-weight:bold;color:green'>${formatNumber(parseFloat(res[0].detail[i - 1].qty))}</td> <td nowrap class="text-right"></td>`
                                } else {
                                    balance_qty -= parseFloat(res[0].detail[i - 1].qty);
                                    html += ` <td nowrap class="text-right"></td><td nowrap class="text-right" style='font-weight:bold;color:red'>${formatNumber(parseFloat(res[0].detail[i - 1].qty))}</td>`
                                }
                                html += `
                                    <td nowrap class="text-right" style='font-weight:bold;color:brown'>${formatNumber(parseFloat(balance_qty))}</td>
                                    <td class="text-left">${res[0].detail[i - 1].creator_code}~${res[0].detail[i - 1].creator_name}</td>
                                    <td class="text-left">${res[0].detail[i - 1].remark}</td>
                                </tr>`;
                            }
                        } else {
                            html = ` <tr>
                                                    <td class="text-center" colspan='9'>ไม่พบรายการ</td>
                                                </tr>`;
                        }
                        $("#body_detail").html(html);

                    } else {
                        swal("ไม่พบสินค้า", code, "warning")
                    }

                },
                error: function (res) {
                    console.log(res)
                },
            });
        }
    });

    $("#btn_search").on('click', function (e) {


        $('#productModal').modal('show')
    });
});
function formatNumber(num) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function _loadItemData() {
    $('#overlay').show();
    $.ajax({
        url: serverURL + 'getItemList',
        method: 'GET',
        cache: false,
        success: function (res) {
            console.log(res)

            if (res.length > 0) {
                var html = "";
                for (var i = 0; i < res.length; i++) {
                    html += `<option value='${res[i].item_code}'>${res[i].item_code}~${res[i].item_name}</option>`
                }
                $('#itemsselect').html(html)
                setTimeout(function () {
                    $('#itemsselect').select2({
                        theme: "bootstrap"
                    });
                    $('#overlay').hide();
                }, 1000)

            } else {
                alert('ไม่พบข้อมูลสินค้า')
                $('#overlay').hide();
            }

        },
        error: function (res) {
            $('#overlay').hide();
            console.log(res)
        },
    });


}


function _loadlistItem(code) {
    $.ajax({
        url: serverURL + 'getBarcode?itemcode=' + code + '&barcode=&page=' + pageActive,
        method: 'GET',
        cache: false,
        success: function (res) {
            console.log(res)
            var html = "";
            if (res.length > 0) {
                $('#item_code').text(res[0].item_code);
                $('#item_name').text(res[0].item_name);
                $('#unit_code').text(res[0].unit_code);
                $('#unit_name').text(res[0].unit_name);
                $('#total_item').text(res[0].total_item);
                $('#item_show').text(res[0].detail.length);
                var html = "";
                if (res[0].detail.length > 0) {
                    console.log(res[0].detail)
                    var balance_qty = 0;
                    if (parseFloat(res[0].old_balance) > 0) {
                        balance_qty = parseFloat(res[0].old_balance);
                        html += `<tr><td></td><td></td><td style='font-weight:bold;color:brown'>ยอดยกมา</td><td></td><td></td><td></td><td nowrap class="text-right" style='font-weight:bold;color:brown'>${formatNumber(parseFloat(res[0].old_balance))}</td><td></td><td></td></tr>`
                    }

                    for (var i = res[0].detail.length; i > 0; i--) {
                        var dateFormat = res[0].detail[i - 1].doc_date.split('-');
                        var doc_time = res[0].detail[i - 1].doc_time.split(' ')[1].split(':')
                        html += `<tr>
                                    <td nowrap class="text-right">${dateFormat[2]}/${dateFormat[1]}/${dateFormat[0]}</td>
                                    <td nowrap class="text-right">${doc_time[0]}:${doc_time[1]}</td>
                                    <td nowrap class="text-left">${res[0].detail[i - 1].doc_ref}</td>
                                    <td nowrap class="text-left">${res[0].detail[i - 1].doc_type}</td>`
                        if (res[0].detail[i - 1].trans_type == '0') {
                            balance_qty += parseFloat(res[0].detail[i - 1].qty);
                            html += ` <td nowrap class="text-right" style='font-weight:bold;color:green'>${formatNumber(parseFloat(res[0].detail[i - 1].qty))}</td> <td nowrap class="text-right"></td>`
                        } else {
                            balance_qty -= parseFloat(res[0].detail[i - 1].qty);
                            html += ` <td nowrap class="text-right"></td><td nowrap class="text-right" style='font-weight:bold;color:red'>${formatNumber(parseFloat(res[0].detail[i - 1].qty))}</td>`
                        }
                        html += `
                                    <td nowrap class="text-right" style='font-weight:bold;color:brown'>${formatNumber(parseFloat(balance_qty))}</td>
                                    <td class="text-left">${res[0].detail[i - 1].creator_code}~${res[0].detail[i - 1].creator_name}</td>
                                    <td class="text-left">${res[0].detail[i - 1].remark}</td>
                                </tr>`;
                    }
                } else {
                    html = ` <tr>
                                                    <td class="text-center" colspan='9'>ไม่พบรายการ</td>
                                                </tr>`;
                }
                $("#body_detail").html(html);


            } else {
                swal("ไม่พบสินค้า", code, "warning")
            }

        },
        error: function (res) {
            console.log(res)
        },
    });
}

function _loadUserData() {
    var user_wh = $('#user_wh').val();
    $.ajax({
        url: serverURL + 'getUserDetail',
        method: 'GET',
        cache: false,
        success: function (res) {
            console.log(res)
            var html = "";
            if (res.length > 0) {
                $('#creator_code').val(res[0].user_code + '~' + res[0].user_name)
                $('#wh_code').text(res[0].wh_code)
                $('#wh_name').text(res[0].wh_name)
            } else {
                alert('ไม่พบข้อมูลผู้ใช้')
                setTimeout(function () {
                    location.href = "logout.jsp";
                }, 1000);
            }

        },
        error: function (res) {
            console.log(res)
        },
    });
}

function _getDocType() {
    $.ajax({
        url: serverURL + 'getDocType',
        method: 'GET',
        cache: false,
        success: function (res) {
            console.log(res)
            var html = "";
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
