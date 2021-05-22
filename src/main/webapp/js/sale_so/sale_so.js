var serverURL = "../";
var userbranch = '';
var item_detail = [
    {
        item_code: '',
        item_name: '',
        unit_code: '',
        unit_name: '',
        stand_value: '0',
        divide_value: '0',
        purchases: 0.00,
        ratio: '0',
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
    }
]

function uuidv4() {
    return 'xxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function _getUserBranch() {

    $.ajax({
        url: serverURL + 'getUserBranch',
        method: 'GET',
        cache: false,
        success: function (res) {
            console.log(res)
            if (res[0].branch_code != '') {
                userbranch = res[0].branch_code + '~' + res[0].branch_name
            }
            $('#user_branch').val(res[0].branch_code)
            if (res[0].code.toUpperCase() == 'SUPERADMIN' || res[0].change_branch_code == '1') {
                $('#user_branch').val('all')
                userbranch = 'all'
            }

        },
        error: function (res) {
            console.log(res)
        },
    });
}

function  _getBranch() {
    var branchcode = $('#user_branch').val();
    console.log(branchcode)
    $.ajax({
        url: serverURL + 'getBranch',
        method: 'GET',
        cache: false,
        success: function (res) {

            console.log(res)
            var html = '<option value="">--เลือกสาขา--</option>';
            for (var i = 0; i < res.length; i++) {
                html += ' <option value="' + res[i].code + '~' + res[i].name_1 + '">' + res[i].code + '~' + res[i].name_1 + '</option>'
            }
            console.log('userbranch ' + userbranch)
            $('.branch_code').html(html);
            if (userbranch == 'all') {
                $('.branch_code').removeAttr('disabled')
                $('.branch_code').val('')
            }


        },
        error: function (res) {
            console.log(res)
        },
    });
}

function  _getVatrate() {
    $.ajax({
        url: serverURL + 'getVatrate',
        method: 'GET',
        cache: false,
        success: function (res) {
            console.log(res)
            if (res.length > 0) {
                $('#vat_rate').val(res[0].vat_rate)
            }

        },
        error: function (res) {
            console.log(res)
        },
    });
}

function  _getCustomer() {
    $.ajax({
        url: serverURL + 'getCustomer',
        method: 'GET',
        cache: false,
        success: function (res) {

            console.log(res)
            var html = '<option value="">--เลือกลูกค้า--</option>';
            for (var i = 0; i < res.length; i++) {
                html += ' <option value="' + res[i].code + '">' + res[i].code + '~' + res[i].name_1 + '</option>'
            }

            $('.select_cust').html(html);
            $('.select_cust').select2({
                theme: "bootstrap"
            });
        },
        error: function (res) {
            console.log(res)
        },
    });
}

function  _getSaler() {
    $.ajax({
        url: serverURL + 'getSaler',
        method: 'GET',
        cache: false,
        success: function (res) {

            console.log(res)
            var html = '<option value="">--พนักงานขาย--</option>';
            for (var i = 0; i < res.length; i++) {
                html += ' <option value="' + res[i].code + '">' + res[i].code + '~' + res[i].name_1 + '</option>'
            }

            $('.select_sale').html(html);
            $('.select_sale').select2({
                theme: "bootstrap"
            });
        },
        error: function (res) {
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

function _gotocreate() {
    $('#doc_list').hide();
    $('#create_doc').show();
    var currentdate = new Date();
    var datetime = 'SD' + currentdate.getFullYear() + '' + (currentdate.getMonth() + 1) + '' + currentdate.getDate() + '' + currentdate.getHours() + '' + currentdate.getMinutes() + '' + currentdate.getSeconds() + '' + uuidv4().toUpperCase()
    var username = $('#user_namex').val();
    var user_code = $('#user_code').val();
    $('#doc_no').val(datetime);
    $('#doc_date').val(currentdate.getFullYear() + '-' + ('0' + (currentdate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentdate.getDate()).slice(-2));
    $('#remark').val('');
    $('#sale_type').val('0')
    $('#vat_type').val('0')
    if (userbranch == 'all') {
        $('#branch_code').val('')
    } else {
        $('#branch_code').val(userbranch)
    }
    $('#project_name').val('')
    $('#contact').val('')
    $("#radio_rival1").prop("checked", true);

    $('#user_creator').val(user_code + '~' + username)
    $('#cust_code').val('');
    $('#contactor').val('');
    $('#saler_code').val('').trigger('change');
    $('#total_exp_discount').html('0.00');
    $('#total_exp_each').html('0.00');
    $('#total_selling_price').html('0.00');
    item_detail = [
        {
            item_code: '',
            item_name: '',
            unit_code: '',
            unit_name: '',
            stand_value: '0',
            divide_value: '0',
            purchases: 0.00,
            ratio: '0',
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
        }
    ]

    _displayTable()
}

function _backtolist() {
    $('#doc_list').show();
    $('#create_doc').hide();
}

function _saveDocApprove() {
    var doc_no = $('#doc_no').val();
    var doc_date = $('#doc_date').val();
    var cust_code = $('#cust_code').val();
    var contactor = $('#contactor').val();
    var saler_code = $('#saler_code').val();
    var sale_type = $('#sale_type').val();
    var vat_type = $('#vat_type').val();
    var vat_rate = $('#vat_rate').val();
    var remark = $('#remark').val();
    var branch = $('#branch_code').val()
    var project_name = $('#project_name').val();
    var contact = $('#contact').val();
    var radioValue = $("input[name='radio_rival']:checked").val();

    var branch_code = ''
    var branch_name = ''

    var creator = $('#user_creator').val();
    var creator_code = '';
    if (creator != '') {
        creator_code = creator.split('~')[0]
    }
    if (branch != '') {
        branch_code = branch.split('~')[0]
        branch_name = " สาขา " + branch.split('~')[1]
    }
    var details = [];
    var msg = '';
    if (doc_no == '') {
        msg += 'เลขที่เอกสาร \n'
    }
    if (doc_date == '') {
        msg += 'วันที่เอกสาร \n'
    }
    if (cust_code == '') {
        msg += 'รหัสลูกค้า \n'
    }
    if (branch_code == '') {
        msg += 'สาขา \n'
    }
    for (var i = 0; i < item_detail.length; i++) {
        if (item_detail[i].cost_qty <= 0) {
            msg += item_detail[i].item_code + ' จำนวน \n'
        }
        if (item_detail[i].cost_factory_price == '') {
            item_detail[i].cost_factory_price = 0;
        }
        if (item_detail[i].sale_price <= 0) {
            msg += item_detail[i].item_code + ' ราคาขาย \n'
        }
    }



    if (msg != '') {
        alert('กรุณาเพิ่ม \n' + msg)
    } else {
        for (var i = 0; i < item_detail.length; i++) {
            if (item_detail[i].item_code != '') {
                var json_detail = {
                    line_number: i,
                    item_code: item_detail[i].item_code,
                    item_name: item_detail[i].item_name,
                    unit_code: item_detail[i].unit_code,
                    unit_name: item_detail[i].unit_name,
                    stand_value: item_detail[i].stand_value,
                    divide_value: item_detail[i].divide_value,
                    purchases: item_detail[i].purchases,
                    ratio: item_detail[i].ratio,
                    cost_qty: removeCommas(item_detail[i].cost_qty.toFixed(2)),
                    cost_weight: removeCommas(item_detail[i].cost_weight),
                    cost_sum_weight: removeCommas(item_detail[i].cost_sum_weight.toFixed(2)),
                    cost_factory_price: removeCommas(item_detail[i].cost_factory_price.toFixed(2)),
                    cost_sum_cost: removeCommas(item_detail[i].cost_sum_cost.toFixed(2)),
                    exp_discount: item_detail[i].exp_discount,
                    sale_discount: item_detail[i].sale_discount,
                    exp_car: removeCommas(item_detail[i].exp_car.toFixed(2)),
                    exp_other: removeCommas(item_detail[i].exp_other.toFixed(2)),
                    exp_doc: removeCommas(item_detail[i].exp_doc.toFixed(2)),
                    exp_tax: removeCommas(item_detail[i].exp_tax.toFixed(2)),
                    exp_other2: removeCommas(item_detail[i].exp_other2.toFixed(2)),
                    exp_each: removeCommas(item_detail[i].exp_each.toFixed(2)),
                    sale_sum_lao_cost: removeCommas(item_detail[i].sale_sum_lao_cost.toFixed(2)),
                    sale_sum_cost: removeCommas(item_detail[i].sale_sum_cost.toFixed(2)),
                    sale_price: removeCommas(item_detail[i].sale_price.toFixed(2)),
                    sale_sum_amount: removeCommas(item_detail[i].sale_sum_amount.toFixed(2)),
                    sale_profit: removeCommas(item_detail[i].sale_profit.toFixed(2)),
                    sale_percent_profit: removeCommas(item_detail[i].sale_percent_profit.toFixed(2)),
                    selling_price: removeCommas(item_detail[i].selling_price.toFixed(2)),

                }
                details.push(json_detail);
            }
        }
        //console.log(details)
        if (details.length > 0) {
            var total_cost_qty = $('#total_cost_qty').html();
            var total_cost_weight = $('#total_cost_weight').html();
            var total_cost_sum_weight = $('#total_cost_sum_weight').html();
            var total_cost_purchases = $('#total_cost_purchases').html();
            var total_cost_factory_price = $('#total_cost_factory_price').html();
            var total_cost_sum_cost = $('#total_cost_sum_cost').html();
            var total_exp_discount = '0.00';

            var total_selling_price = $('#total_selling_price').html();
            var total_exp_car = $('#total_exp_car').html();
            var total_exp_other = $('#total_exp_other').html();
            var total_exp_doc = $('#total_exp_doc').html();
            var total_exp_tax = $('#total_exp_tax').html();
            var total_exp_other2 = $('#total_exp_other2').html();
            var total_exp_each = $('#total_exp_each').html();
            var total_sale_sum_lao_cost = $('#total_sale_sum_lao_cost').html();
            var total_sale_sum_cost = $('#total_sale_sum_cost').html();
            var total_sale_price = $('#total_sale_price').html();
            var total_sale_sum_amount = $('#total_sale_sum_amount').html();
            var total_sale_profit = $('#total_sale_profit').html();
            var total_sale_percent_profit = $('#total_sale_percent_profit').html();
            total_sale_percent_profit = total_sale_percent_profit.replace('%', '')

            var json_data = {
                doc_no: doc_no,
                project_name: project_name,
                contact: contact,
                contactor: contactor,
                radioValue: radioValue,
                doc_date: doc_date,
                cust_code: cust_code,
                creator_code: creator_code,
                saler_code: saler_code,
                branch_code: branch_code,
                sale_type: sale_type,
                vat_type: vat_type,
                vat_rate: vat_rate,
                total_cost_qty: removeCommas(total_cost_qty),
                total_cost_weight: 0,
                total_cost_sum_weight: 0,
                total_cost_purchases: removeCommas(total_cost_purchases),
                total_cost_factory_price: removeCommas(total_cost_factory_price),
                total_cost_sum_cost: 0,
                total_exp_discount: 0,
                total_exp_car: 0,
                total_exp_other: 0,
                total_exp_doc: 0,
                total_exp_tax: 0,
                total_exp_other2: 0,
                total_exp_each: removeCommas(total_exp_each),
                total_sale_sum_lao_cost: removeCommas(total_sale_sum_lao_cost),
                total_sale_sum_cost: removeCommas(total_sale_sum_cost),
                total_sale_price: removeCommas(total_sale_price),
                total_sale_sum_amount: removeCommas(total_sale_sum_amount),
                total_sale_profit: removeCommas(total_sale_profit),
                total_selling_price: removeCommas(total_selling_price),
                total_sale_percent_profit: removeCommas(total_sale_percent_profit),
                remark: remark,
                status: 1,
                data: JSON.stringify(details)
            }
            console.log(json_data)
            $.ajax({
                url: serverURL + 'saveDocSo',
                method: 'POST',
                data: json_data,
                success: function (res) {
                    console.log(res)
                    swal("บันทึกข้อมูลสำเร็จ", "", "success")
                    _getListData('');
                    $('#create_doc').hide();
                    $('#doc_list').show();
                },
                error: function (res) {
                    console.log(res)
                },
            });
        } else {
            alert('กรุณาเพิ่มรายละเอียด')
        }
    }
}


function _saveDoc() {
    var doc_no = $('#doc_no').val();
    var doc_date = $('#doc_date').val();
    var cust_code = $('#cust_code').val();
    var contactor = $('#contactor').val();
    var saler_code = $('#saler_code').val();
    var sale_type = $('#sale_type').val();
    var vat_type = $('#vat_type').val();
    var vat_rate = $('#vat_rate').val();
    var remark = $('#remark').val();
    var branch = $('#branch_code').val()
    var project_name = $('#project_name').val();
    var contact = $('#contact').val();
    var radioValue = $("input[name='radio_rival']:checked").val();

    var branch_code = ''
    var branch_name = ''

    var creator = $('#user_creator').val();
    var creator_code = '';
    if (creator != '') {
        creator_code = creator.split('~')[0]
    }
    if (branch != '') {
        branch_code = branch.split('~')[0]
        branch_name = " สาขา " + branch.split('~')[1]
    }
    var details = [];
    var msg = '';
    if (doc_no == '') {
        msg += 'เลขที่เอกสาร \n'
    }
    if (doc_date == '') {
        msg += 'วันที่เอกสาร \n'
    }
    if (cust_code == '') {
        msg += 'รหัสลูกค้า \n'
    }
    if (branch_code == '') {
        msg += 'สาขา \n'
    }
    for (var i = 0; i < item_detail.length; i++) {
        if (item_detail[i].cost_qty <= 0) {
            msg += item_detail[i].item_code + ' จำนวน \n'
        }
        if (item_detail[i].cost_factory_price == '') {
            item_detail[i].cost_factory_price = 0;
        }
        if (item_detail[i].sale_price <= 0) {
            msg += item_detail[i].item_code + ' ราคาขาย \n'
        }
    }



    if (msg != '') {
        alert('กรุณาเพิ่ม \n' + msg)
    } else {
        for (var i = 0; i < item_detail.length; i++) {
            if (item_detail[i].item_code != '') {
                var json_detail = {
                    line_number: i,
                    item_code: item_detail[i].item_code,
                    item_name: item_detail[i].item_name,
                    unit_code: item_detail[i].unit_code,
                    unit_name: item_detail[i].unit_name,
                    stand_value: item_detail[i].stand_value,
                    divide_value: item_detail[i].divide_value,
                    purchases: item_detail[i].purchases,
                    ratio: item_detail[i].ratio,
                    cost_qty: removeCommas(item_detail[i].cost_qty.toFixed(2)),
                    cost_weight: removeCommas(item_detail[i].cost_weight),
                    cost_sum_weight: removeCommas(item_detail[i].cost_sum_weight.toFixed(2)),
                    cost_factory_price: removeCommas(item_detail[i].cost_factory_price.toFixed(2)),
                    cost_sum_cost: removeCommas(item_detail[i].cost_sum_cost.toFixed(2)),
                    exp_discount: item_detail[i].exp_discount,
                    sale_discount: item_detail[i].sale_discount,
                    exp_car: removeCommas(item_detail[i].exp_car.toFixed(2)),
                    exp_other: removeCommas(item_detail[i].exp_other.toFixed(2)),
                    exp_doc: removeCommas(item_detail[i].exp_doc.toFixed(2)),
                    exp_tax: removeCommas(item_detail[i].exp_tax.toFixed(2)),
                    exp_other2: removeCommas(item_detail[i].exp_other2.toFixed(2)),
                    exp_each: removeCommas(item_detail[i].exp_each.toFixed(2)),
                    sale_sum_lao_cost: removeCommas(item_detail[i].sale_sum_lao_cost.toFixed(2)),
                    sale_sum_cost: removeCommas(item_detail[i].sale_sum_cost.toFixed(2)),
                    sale_price: removeCommas(item_detail[i].sale_price.toFixed(2)),
                    sale_sum_amount: removeCommas(item_detail[i].sale_sum_amount.toFixed(2)),
                    sale_profit: removeCommas(item_detail[i].sale_profit.toFixed(2)),
                    sale_percent_profit: removeCommas(item_detail[i].sale_percent_profit.toFixed(2)),
                    selling_price: removeCommas(item_detail[i].selling_price.toFixed(2)),

                }
                details.push(json_detail);
            }
        }
        //console.log(details)
        if (details.length > 0) {
            var total_cost_qty = $('#total_cost_qty').html();
            var total_cost_weight = $('#total_cost_weight').html();
            var total_cost_sum_weight = $('#total_cost_sum_weight').html();
            var total_cost_purchases = $('#total_cost_purchases').html();
            var total_cost_factory_price = $('#total_cost_factory_price').html();
            var total_cost_sum_cost = $('#total_cost_sum_cost').html();
            var total_exp_discount = '0.00';

            var total_selling_price = $('#total_selling_price').html();
            var total_exp_car = $('#total_exp_car').html();
            var total_exp_other = $('#total_exp_other').html();
            var total_exp_doc = $('#total_exp_doc').html();
            var total_exp_tax = $('#total_exp_tax').html();
            var total_exp_other2 = $('#total_exp_other2').html();
            var total_exp_each = $('#total_exp_each').html();
            var total_sale_sum_lao_cost = $('#total_sale_sum_lao_cost').html();
            var total_sale_sum_cost = $('#total_sale_sum_cost').html();
            var total_sale_price = $('#total_sale_price').html();
            var total_sale_sum_amount = $('#total_sale_sum_amount').html();
            var total_sale_profit = $('#total_sale_profit').html();
            var total_sale_percent_profit = $('#total_sale_percent_profit').html();
            total_sale_percent_profit = total_sale_percent_profit.replace('%', '')

            var json_data = {
                doc_no: doc_no,
                project_name: project_name,
                contact: contact,
                contactor: contactor,
                radioValue: radioValue,
                doc_date: doc_date,
                cust_code: cust_code,
                creator_code: creator_code,
                saler_code: saler_code,
                branch_code: branch_code,
                sale_type: sale_type,
                vat_type: vat_type,
                vat_rate: vat_rate,
                total_cost_qty: removeCommas(total_cost_qty),
                total_cost_weight: 0,
                total_cost_sum_weight: 0,
                total_cost_purchases: removeCommas(total_cost_purchases),
                total_cost_factory_price: removeCommas(total_cost_factory_price),
                total_cost_sum_cost: 0,
                total_exp_discount: 0,
                total_exp_car: 0,
                total_exp_other: 0,
                total_exp_doc: 0,
                total_exp_tax: 0,
                total_exp_other2: 0,
                total_exp_each: removeCommas(total_exp_each),
                total_sale_sum_lao_cost: removeCommas(total_sale_sum_lao_cost),
                total_sale_sum_cost: removeCommas(total_sale_sum_cost),
                total_sale_price: removeCommas(total_sale_price),
                total_sale_sum_amount: removeCommas(total_sale_sum_amount),
                total_sale_profit: removeCommas(total_sale_profit),
                total_selling_price: removeCommas(total_selling_price),
                total_sale_percent_profit: removeCommas(total_sale_percent_profit),
                remark: remark,
                status: 0,
                data: JSON.stringify(details)
            }
            console.log(json_data)
            $.ajax({
                url: serverURL + 'saveDocSo',
                method: 'POST',
                data: json_data,
                success: function (res) {
                    console.log(res)
                    swal("บันทึกข้อมูลสำเร็จ", "", "success")
                    _getListData('');
                    $('#create_doc').hide();
                    $('#doc_list').show();
                },
                error: function (res) {
                    console.log(res)
                },
            });
        } else {
            alert('กรุณาเพิ่มรายละเอียด')
        }
    }
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

    _getUserBranch()
    _getVatrate()
    _alertMsgBox()
    setTimeout(function () {
        _getBranch()
        _getListData('')
        _displayTable();
    }, 700);

    $('#search_text').keyup(delay(function (e) {
        _getListData(this.value)
    }, 1000));
    //_getCustomer();
    _getSaler();

    editor = new SimpleTableCellEditor("item_detail");
    editor.SetEditableClass("editIt");
    $('#item_detail').on("cell:edited", function (event) {
        var data = event.element.attributes.index.value.split('_');
        var detail = data[0];
        var index = data[1];
        console.log(detail)
        console.log(index)
        console.log(event.newValue.trim())
        var newval = '';
        newval = event.newValue.trim();
        console.log(newval.length)
        if (newval.length == 0) {
            newval = '0.00';
        }

        if (detail == 'costqty') {
            item_detail[index].cost_qty = parseFloat(newval);
        }
        if (detail == 'costfactory') {
            item_detail[index].cost_factory_price = parseFloat(newval);
        }
        if (detail == 'saleprice') {
            item_detail[index].sale_price = parseFloat(newval);
        }
        if (detail == 'exp') {
            item_detail[index].exp_each = parseFloat(newval);
        }
        if (detail == 'discount') {
            item_detail[index].sale_discount = newval;
        }

        /*$.each(item_detail, function () {
         total_cost_sum_cost += this.cost_sum_cost;
         });*/

        for (var i = 0; i < item_detail.length; i++) {
            console.log(item_detail[i].sale_discount)

            var solitz = item_detail[i].sale_discount.toString().split("%")
            console.log(solitz)
            if (solitz.length > 1) {
                item_detail[i].selling_price = parseFloat(item_detail[i].sale_price) - ((parseFloat(item_detail[i].sale_price) * parseFloat(solitz[0])) / 100);
            } else {
                item_detail[i].selling_price = parseFloat(item_detail[i].sale_price) - parseFloat(solitz[0]);
            }


            item_detail[i].sale_sum_lao_cost = (parseFloat(item_detail[i].cost_factory_price) + parseFloat(item_detail[i].exp_each))
            item_detail[i].sale_sum_cost = (parseFloat(item_detail[i].sale_sum_lao_cost) * parseFloat(item_detail[i].cost_qty))
            item_detail[i].sale_sum_amount = (parseFloat(item_detail[i].selling_price) * parseFloat(item_detail[i].cost_qty))
            item_detail[i].sale_profit = (parseFloat(item_detail[i].sale_sum_amount) - parseFloat(item_detail[i].sale_sum_cost))
            item_detail[i].sale_percent_profit = ((parseFloat(item_detail[i].sale_profit) / parseFloat(item_detail[i].sale_sum_amount)) * 100)


        }
        _displayTable();
    });

    $('.contactor_box_click').on('click', function () {
        var cust_code = $('#cust_code').val();
        if (cust_code != '') {
            _searchContact();
            $('#modalContactor').modal('show');
        } else {
            swal("กรุณากรอกรหัสลูกค้า", "", "error")
        }

    });

    $('#btn_copy_save').on('click', function () {
        var old_doc_no = $('#copy_doc_no_title').text();
        var doc_no = $('#copy_doc_no').val();
        var doc_date = $('#copy_doc_date').val();
        var cust_code = $('#copy_cust_code').val();
        var contactor = $('#copy_contactor').val();
        var saler_code = $('#copy_saler_code').val();
        var sale_type = $('#copy_sale_type').val();
        var vat_type = $('#copy_vat_type').val();
        var vat_rate = $('#copy_vat_rate').val();
        var remark = $('#copy_remark').val();
        var branch = $('#copy_branch_code').val();
        var project_name = $('#copy_project_name').val();
        var contact = $('#copy_contact').val();
        var radioValue = $("input[name='copy_radio_rival']:checked").val();

        var branch_code = ''
        var branch_name = ''

        var creator = $('#copy_user_creator').val();
        var creator_code = '';
        if (creator != '') {
            creator_code = creator.split('~')[0]
        }
        if (branch != '') {
            branch_code = branch.split('~')[0]
            branch_name = " สาขา " + branch.split('~')[1]
        }
        var details = [];
        var msg = '';
        if (doc_no == '') {
            msg += 'เลขที่เอกสาร \n'
        }
        if (doc_date == '') {
            msg += 'วันที่เอกสาร \n'
        }
        if (cust_code == '') {
            msg += 'รหัสลูกค้า \n'
        }
        if (branch_code == '') {
            msg += 'สาขา \n'
        }
        if (msg != '') {
            alert('กรุณาเพิ่ม \n' + msg)
        } else {
            var json_data = {
                old_doc_no: old_doc_no,
                doc_no: doc_no,
                project_name: project_name,
                contact: contact,
                contactor: contactor,
                radioValue: radioValue,
                doc_date: doc_date,
                cust_code: cust_code,
                creator_code: creator_code,
                saler_code: saler_code,
                branch_code: branch_code,
                sale_type: sale_type,
                vat_type: vat_type,
                vat_rate: vat_rate,
                remark: remark,
                status: 0,
            }
            $.ajax({
                url: serverURL + 'saveCopyDocSo',
                method: 'POST',
                data: json_data,
                success: function (res) {
                    console.log(res)
                    _getListData('');
                    setTimeout(function () {
                        $('#modalCopy').modal('hide');
                    }, 500)

                },
                error: function (res) {
                    console.log(res)
                },
            });
        }

    });

    $('.copy_contactor_box_click').on('click', function () {
        var cust_code = $('#copy_cust_code').val();
        if (cust_code != '') {
            _searchCopyContact();
            $('#modalCopyContactor').modal('show');
        } else {
            swal("กรุณากรอกรหัสลูกค้า", "", "error")
        }

    });


    function _searchCopyContact() {
        var search_copy_contactor_input = $('#search_copy_contactor_input').val();
        var cust_code = $('#copy_cust_code').val();
        // console.log(search_cust_input)

        $.ajax({
            url: serverURL + 'getContact?cust=' + cust_code + '&search=' + search_copy_contactor_input,
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
                    html += "<li class = 'list-group-item list-group-item-action select-copy-contact' data-name='" + res[i].name + "' data-tel='" + res[i].telephone + "' data-address='" + res[i].address + "'> " + res[i].name + ' | ' + res[i].telephone + "|" + res[i].address + "</li>"
                }
                $('#list_search_copy_contact').html(html)

            },
            error: function (res) {
                console.log(res)
            },
        });
    }

    $('.cust_box_click').on('click', function () {
        $('#modalCust').modal('show');
    });


    $(document).delegate('.copy-doc', 'click', function (event) {
        var code = $(this).attr('data-docno')

        $('#copy_doc_no_title').text(code);

        var username = $('#user_namex').val();
        var user_code = $('#user_code').val();
        var currentdate = new Date();
        var datetime = 'SD' + currentdate.getFullYear() + '' + (currentdate.getMonth() + 1) + '' + currentdate.getDate() + '' + currentdate.getHours() + '' + currentdate.getMinutes() + '' + currentdate.getSeconds() + '' + uuidv4().toUpperCase()

        $.ajax({
            url: serverURL + 'getDocSoDetail?docno=' + code,
            method: 'GET',
            success: function (res) {

                console.log(res)
                if (res.length > 0) {
                    $('#copy_doc_no').val(datetime)
                    $('#copy_doc_date').val(res[0].doc_date)
                    $('#copy_contactor').val(res[0].contactor)
                    $('#copy_user_creator').val(user_code + '~' + username)

                    $('#copy_cust_code').val(res[0].cust_code);
                    $('#copy_saler_code').val(res[0].saler_code).trigger('change');
                    $('#copy_sale_type').val(res[0].sale_type)
                    $('#copy_branch_code').val(res[0].branch_code + '~' + res[0].branch_name)
                    $('#copy_vat_type').val(res[0].vat_type)
                    $('#copy_remark').val(res[0].remark)

                    $('#copy_project_name').val(res[0].project_name)
                    $('#copy_contact').val(res[0].contact)
                    if (res[0].is_rival == '0') {
                        $("#copy_radio_rival1").prop("checked", true);
                    } else if (res[0].is_rival == '1') {
                        $("#copy_radio_rival2").prop("checked", true);
                    }

                }


            },
            error: function (res) {
                console.log(res)
            },
        });

        $('#modalCopy').modal('show');
    });


    $('.copy_cust_box_click').on('click', function () {
        $('#modalCopyCust').modal('show');
    });

    $(document).delegate('.editIt', 'click', function (event) {
        $('.edit_input').select();
    });
    $(document).delegate('.editMe', 'click', function (event) {
        $('.edit_input').select();
    });
    $(document).delegate('.btn-search', 'click', function (event) {
        var data = $(this).attr('index').split('_');
        var detail = data[0];
        var index = data[1];
        $('#line_index').val(index)
        $('#line_action').val(detail)
        $('#modalSearch').modal('show')

    });
    $(document).delegate('.select-items', 'click', function (event) {
        var code = $(this).attr('data-code')
        var name = $(this).attr('data-name')
        var index = $('#line_index').val()
        var detail = $('#line_action').val()

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
                    item_detail[index].cost_weight = res[0].weight;
                    item_detail[index].stand_value = res[0].stand_value;
                    item_detail[index].divide_value = res[0].divide_value;
                    item_detail[index].purchases = res[0].purchases;
                    item_detail[index].ratio = res[0].ratio;
                    _displayTable();
                    $('#modalSearch').modal('hide')
                } else {
                    var html = '';
                    for (var i = 0; i < res.length; i++) {
                        html += "<li class = 'list-group-item list-group-item-action select-unit' data-purchases='" + res[i].purchases + "' data-code='" + res[i].code + "' data-name='" + res[i].name_1 + "' data-weight='" + res[i].weight + "' data-stand='" + res[i].stand_value + "' data-divide='" + res[i].divide_value + "' data-ratio='" + res[i].ratio + "'> " + res[i].code + '~' + res[i].name_1 + " | 1 " + res[i].name_1 + " = " + res[i].ratio + " " + res[0].name_1 + " </li>"
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
    });
    $(document).delegate('.select-unit', 'click', function (event) {
        var code = $(this).attr('data-code')
        var name = $(this).attr('data-name')
        var weight = $(this).attr('data-weight')
        var stand = $(this).attr('data-stand')
        var divide = $(this).attr('data-divide')
        var purchases = $(this).attr('data-purchases')
        var ratio = $(this).attr('data-ratio')
        var index = $('#line_index').val()
        var detail = $('#line_action').val()

        item_detail[index].unit_code = code;
        item_detail[index].unit_name = name;
        item_detail[index].cost_weight = weight;
        item_detail[index].stand_value = stand;
        item_detail[index].divide_value = divide;
        item_detail[index].purchases = parseFloat(purchases);
        item_detail[index].ratio = ratio;
        _displayTable();
        $('#modalUnit').modal('hide')
    });
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
    $(document).delegate('.print_doc', 'click', function (event) {
        var code = $(this).attr('data-docno')

        printData(code)
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
        var username = $('#user_namex').val();
        var user_code = $('#user_code').val();
        $.ajax({
            url: serverURL + 'getDocSoDetail?docno=' + code,
            method: 'GET',
            success: function (res) {

                console.log(res)
                if (res.length > 0) {
                    $('#doc_no').val(res[0].doc_no)
                    $('#doc_date').val(res[0].doc_date)
                    if (res[0].creator_code.length > 0) {
                        $('#user_creator').val(res[0].creator_code + '~' + res[0].creator_name)
                    } else {
                        $('#user_creator').val(user_code + '~' + username)
                    }
                    $('#cust_code').val(res[0].cust_code);
                    $('#contactor').val(res[0].contactor);
                    $('#saler_code').val(res[0].saler_code).trigger('change');
                    $('#sale_type').val(res[0].sale_type)
                    $('#project_name').val(res[0].project_name)
                    $('#contact').val(res[0].contact)
                    if (res[0].is_rival == '0') {
                        $("#radio_rival1").prop("checked", true);
                    } else if (res[0].is_rival == '1') {
                        $("#radio_rival2").prop("checked", true);
                    }
                    $('#branch_code').val(res[0].branch_code + '~' + res[0].branch_name)
                    $('#vat_type').val(res[0].vat_type)
                    $('#remark').val(res[0].remark)
                    item_detail = res[0].detail

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

    $('.btn-alert-ok').on('click', function () {
        $.ajax({
            url: serverURL + 'saveAlert',
            method: 'POST',
            success: function (res) {
                $('#showAlertMsg').hide();
            },
            error: function (res) {
                console.log(res)
            },
        });
    });
});

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
    $('#contactor').val('');
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
