var log = console.log.bind();
var subLink = null;
var objMainRow = null;
var objSubRow = null;
var objSubTable = null;

$(function () {
    initObj();

//    $("#contentSearchBox").on("keyup", "#txtBook", function () {
//        loadList();
//    });

///// change event
    $("#contentSearchBox").on("change", "#txtFromDate", function () {
        loadList();
    });

    $("#contentSearchBox").on("change", "#txtToDate", function () {
        loadList();
    });

    $("#contentSearchBox").on("change", "#txtFromAmount", function () {
        loadList();
    });

    $("#contentSearchBox").on("change", "#txtToAmount", function () {
        loadList();
    });

    $("#contentSearchBox").on("change", "#txtCustomer", function () {
        loadList();
    });

    $("#contentSearchBox").on("change", "#txtBank", function () {
        loadList();
    });

    $("#contentSearchBox").on("change", "#txtBankBranch", function () {
        loadList();
    });

    $("#contentSearchBox").on("change", "#txtBook", function () {
        loadList();
    });
///////////////////////////

////// key event 

    $("#contentSearchBox").on("keyup", "#txtFromDate", function (e) {
        if (e.keyCode === 13) {
            loadList();
        }
    });

    $("#contentSearchBox").on("keyup", "#txtToDate", function (e) {
        if (e.keyCode === 13) {
            loadList();
        }
    });

    $("#contentSearchBox").on("keyup", "#txtFromAmount", function (e) {
        if (e.keyCode === 13) {
            loadList();
        }
    });

    $("#contentSearchBox").on("keyup", "#txtToAmount", function (e) {
        if (e.keyCode === 13) {
            loadList();
        }
    });

    $("#contentSearchBox").on("keyup", "#txtCustomer", function (e) {
        if (e.keyCode === 13) {
            loadList();
        }
    });

    $("#contentSearchBox").on("keyup", "#txtBank", function (e) {
        if (e.keyCode === 13) {
            loadList();
        }
    });

    $("#contentSearchBox").on("keyup", "#txtBankBranch", function (e) {
        if (e.keyCode === 13) {
            loadList();
        }
    });

    $("#contentSearchBox").on("keyup", "#txtBook", function (e) {
        if (e.keyCode === 13) {
            loadList();
        }
    });

    $("#contentSearchBox").on("click", "#submit", function (e) {
        loadList();
    });

///////////////////////////

    $("#contentTableBox").on("click", "#mainList #expand", function (e) {
        e.preventDefault();
        var gid = $(this).closest('tr').attr('id');
        if ($('#' + gid + '_EXPAND').length === 0) {
            loadSubList(gid);
            $("#" + gid).data('toggle', true);
//            $('#' + gid).find('td:nth-child(4) h5 b').css('color', 'red').text('ซ่อน');
        } else {
            var toggle = $('#' + gid).data('toggle');
            if (toggle) {
                $("#" + gid).data('toggle', false);
//                $('#' + gid).find('td:nth-child(4) h5 b').css('color', '#00ca6d').text('แสดง');
            } else {
                $("#" + gid).data('toggle', true);
//                $('#' + gid).find('td:nth-child(4) h5 b').css('color', 'red').text('ซ่อน');
            }
            $('#' + gid + '_EXPAND').toggle();
        }
    });
});

function initObj() {
    console.clear();
    subLink = $("#hSubLink").val();

    objMainRow = $("#contentTableBox").find("#mainRow").clone();
    objMainRow.show();
    objMainRow.removeAttr('id');

    objSubTable = $("#contentTableBox").find("#subRow").clone();
    objSubTable.show();
    objSubTable.removeAttr('id');
    objSubTable.find('table tbody > tr:nth-child(1)').remove();

    $("#txtFromDate").datepicker(optDatePicker());
    $("#txtToDate").datepicker(optDatePicker());

    $("#txtFromDate").datepicker('update', getDate('from'));
    $("#txtToDate").datepicker('update', getDate('to'));

    $("#contentTableBox").find("#mainList").html('');
}

function loadList() {
    var list = $("#contentTableBox").find("#mainList"), load = $("#contentTableBox").find("#load");

    var fromDate = $("#txtFromDate").val();
    var toDate = $("#txtToDate").val();
    var txtBook = $("#txtBook").val();
    var txtFromAmount = $("#txtFromAmount").val();
    var txtToAmount = $("#txtToAmount").val();
    var txtCustomer = $("#txtCustomer").val();
    var txtBank = $("#txtBank").val();
    var txtBankBranch = $("#txtBankBranch").val();

    $.ajax(subLink + 'bank-list', {
        method: 'GET',
        data: {data: JSON.stringify({
                search_item: txtBook,
                from_date: fromDate,
                to_date: toDate,
                from_amount: txtFromAmount,
                to_amount: txtToAmount,
                customer: txtCustomer,
                bank: txtBank,
                branch: txtBankBranch
            })},
        beforeSend: function () {
            load.show();
        },
        success: function (res) {
            list.html('');
            if (res.success) {
                if (res.data.length > 0) {
                    $.each(res.data, function (key, obj) {
                        var objResult = objMainRow.clone();
                        var gid = genid();
                        objResult.attr('id', gid);
                        objResult.data('code', obj.code);
                        
                        objResult.data("__strFromDate", obj.__strFromDate);
                        objResult.data("__strToDate", obj.__strToDate);
                        objResult.data("__strSearchItem", obj.__strSearchItem);
                        objResult.data("__strFromAmount", obj.__strFromAmount);
                        objResult.data("__strToAmount", obj.__strToAmount);
                        objResult.data("__strCustomer", obj.__strCustomer);
                        objResult.data("__strBank", obj.__strBank);
                        objResult.data("__strBranch", obj.__strBranch);

//                      objResult.data('amount_balance', obj.amount_balance);
                        objResult.data('toggle', false);

                        var tdIdx = 0;
                        objResult.find('td:nth-child(' + (++tdIdx) + ') h5').text(obj.code);
                        objResult.find('td:nth-child(' + (++tdIdx) + ') h5').text(obj.name_1);
                        objResult.find('td:nth-child(' + (++tdIdx) + ') h5').text(obj.bank_code);
//                        objResult.find('td:nth-child(' + (++tdIdx) + ') h5').text(obj.bank_branch);
//                        objResult.find('td:nth-child(' + (++tdIdx) + ') h5').text(numberFormat2(obj.amount_total, 2));

                        list.append(objResult);
                    });
                }
            }
        },
        complete: function () {
            load.hide();
        }
    });
}

function loadSubList(gid) {
    var subTable = objSubTable.clone();
    var code = $('#' + gid).data('code');
    var __strFromDate = $('#' + gid).data('__strFromDate');
    var __strToDate = $('#' + gid).data('__strToDate');
    var __strSearchItem = $('#' + gid).data('__strSearchItem');
    var __strFromAmount = $('#' + gid).data('__strFromAmount');
    var __strToAmount = $('#' + gid).data('__strToAmount');
    var __strCustomer = $('#' + gid).data('__strCustomer');                            
    var __strBank = $('#' + gid).data('__strBank');                            
    var __strBranch = $('#' + gid).data('__strBranch');                            
                        
//    var amountBalance = $('#' + gid).data('amount_balance');
//    var fromDate = $("#txtFromDate").val();
//    var toDate = $("#txtToDate").val();


    var subGid = gid + '_EXPAND';

    subTable.attr('id', subGid);
    $('#' + gid).after(subTable);

    var $endPoint = $('#' + subGid);

    var list = $endPoint.find("#subList");

    $.ajax(subLink + 'bank-detail', {
        method: 'GET',
        data: {data: JSON.stringify({code: code, 
                search_item: __strSearchItem,
                from_date: __strFromDate,
                to_date: __strToDate,
                from_amount: __strFromAmount,
                to_amount: __strToAmount,
                customer: __strCustomer,
                bank: __strBank,
                branch: __strBranch
            })},
        success: function (res) {
            if (res.success) {
                list.html(res.data);
            }
        }
    });
}

function optDatePicker() {
    return {
        autoclose: true,
        todayHighlight: true,
        language: 'th',
        format: "dd/mm/yyyy"
    };
}

function getDate(type) {
    var d = new Date();
    var result = "";
    switch (type) {
        case "from":
            d.setDate(d.getDate() - 7);
            result = d.getDate() + '/' + (d.getMonth() + 1) + '/' + (d.getFullYear() + 543);
            break;
        case "to":
            result = d.getDate() + '/' + (d.getMonth() + 1) + '/' + (d.getFullYear() + 543);
            break;
    }
    return result;
}

function numberFormat2(number, fix) {
    number = parseFloat(number);
    number = isNaN(number) ? 0.00 : number;
    var tmp = 0.00;
    if (fix > 0) {
        tmp = number.toFixed(fix).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    } else {
        number = Math.round(number);
        tmp = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return tmp;
}

var id_used = [];
function genid(len, renew) {
    var $reNew = renew || false;
    var $gen_length = len || 4;
    var $lip_text = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var $lip_length = $lip_text.length;

    var $gen_text = '';
    for (var $i = 0; $i < $gen_length; $i++) {
        $gen_text += $lip_text.charAt(Math.floor(Math.random() * ($lip_length - 0 + 1)) + 0);
    }

//    log("Max generate :: "+(Math.pow($lip_length, $gen_length)));

    if (!checkTempId($gen_text) || $gen_text.length !== $gen_length) {
        $gen_text = genid($gen_length, true);
    }
    if (!$reNew) {
        id_used.push($gen_text);
    }
    return $gen_text;
}

function checkTempId(id_new) {
    return id_used.indexOf(id_new) === -1 ? true : false;
}