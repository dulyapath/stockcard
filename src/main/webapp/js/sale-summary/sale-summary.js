/* global moment */

var log = console.log.bind();
var subLink = null;
var restURI = 'saleSummaryList';
var itemCode = null;

$(function () {
    initObj();
    loadBranch();
    loadWarehouse();

    $("#contentSearchBox").on("change", "#txtFromDate", function () {
        getAllData();
    });

    $("#contentSearchBox").on("change", "#txtToDate", function () {
        getAllData();
    });

    $("#contentSearchBox").on("click", "#btnDateToday", function () {
        selected_date('today', 0);
    });

    $("#contentSearchBox").on("click", "#btnDateMonth", function () {
        selected_date('month', 0);
    });

    $("#contentSearchBox").on("click", "#btnDateYear", function () {
        selected_date('year', 0);
    });

    $("#contentSearchBox").on("change", "#selBranch", function () {
        getAllData();
    });

    $("#contentSearchBox").on("change", "#selWarehouse", function () {
        getAllData();
    });
});

function initObj() {
//    console.clear();
    subLink = $("#hSubLink").val();
    itemCode = $("#hItemCode").val();

    if (itemCode.length > 0) {
        loadProductDesc();
    }

    var now = moment().toDate();
    var dToDate = convertDate(now);
    var dFromDate = convertDate(moment(now).add(-7, 'day'));

    $("#txtFromDate").datepicker(optDatePicker2());
    $("#txtToDate").datepicker(optDatePicker2());

    $("#txtToDate").datepicker('update', dToDate);
    $("#txtFromDate").datepicker('update', dFromDate);
}

function getAllData() {
    loadLineList();
    loadLineInfo();
    loadBarInfo();
    loadBarList();
}

function loadBranch() {
    $.ajax(subLink + restURI + '?action_name=loadBranch', {
        method: "GET",
        success: function (res) {
            if (res.success) {
                if (res.data.length > 0) {
                    var html = "<option value=''>ทุกสาขา</option>";
                    $.each(res.data, function (key, obj) {
                        html += "<option value='" + obj.code + "'>" + obj.name_1 + "</option>";
                    });
                    $("#selBranch").html(html);
                }
            }
        }
    });
}

function loadWarehouse() {
    $.ajax(subLink + restURI + '?action_name=loadWarehouse', {
        method: "GET",
        success: function (res) {
            if (res.success) {
                if (res.data.length > 0) {
                    var html = "<option value=''>ทุกคลัง</option>";
                    $.each(res.data, function (key, obj) {
                        html += "<option value='" + obj.code + "'>" + obj.name_1 + "</option>";
                    });
                    $("#selWarehouse").html(html);
                }
            }
        }
    });
}

function loadProductDesc() {
    $.ajax(subLink + restURI + '?action_name=loadProductDesc', {
        method: "GET",
        data: {data: JSON.stringify({item_code: itemCode})},
        success: function (res) {
            if (res.success) {
                if (res.data.length > 0) {
                    $.each(res.data, function (key, obj) {
                        $("#descItemCode").text(obj.code);
                        $("#descItemName").text(obj.name_1);
                        $("#descUnitCost").text(obj.unit_cost);
                    });
                    $("#contentProductDesc").show();
                }
            }
        }
    });
}

function loadLineList() {
    var fromDate = $("#txtFromDate").val();
    var toDate = $("#txtToDate").val();
    var showAmount = $("#chbAmountLine").is(':checked');
    var showCost = $("#chbCostLine").is(':checked');
    var showProfit = $("#chbProfitLine").is(':checked');
    var showCash = $("#chbCashLine").is(':checked');
    var showCredit = $("#chbCreditLine").is(':checked');
    var showPurchase = $("#chbPurchaseLine").is(':checked');
    var showAbove = $("#chbAboveLine").is(':checked');
    var wareHouse = $("#selWarehouse").val();

    var data = [
        'from_date=' + fromDate,
        'to_date=' + toDate,
        'item_code=' + itemCode,
        'check_amount=' + showAmount,
        'check_cost=' + showCost,
        'check_profit=' + showProfit,
        'check_above=' + showAbove,
        'check_cash=' + showCash,
        'check_credit=' + showCredit,
        'check_purchase=' + showPurchase,
        'warehouse=' + wareHouse
    ].join('&');

    add_script('line.jsp?' + data, function () {
        if (success) {
            create_line();
        } else {
            hide_line();
        }
    });
}

function loadBarList() {
    var fromDate = $("#txtFromDate").val();
    var toDate = $("#txtToDate").val();
    var showAmount = $("#chbAmountBar").is(':checked');
    var showCost = $("#chbCostBar").is(':checked');
    var showProfit = $("#chbProfitBar").is(':checked');
    var wareHouse = $("#selWarehouse").val();

    var data = [
        'from_date=' + fromDate,
        'to_date=' + toDate,
        'item_code=' + itemCode,
        'check_amount=' + showAmount,
        'check_cost=' + showCost,
        'check_profit=' + showProfit,
        'warehouse=' + wareHouse
    ].join('&');

    add_script('bar.jsp?' + data, function () {
        if (success) {
            create_bar();
        } else {
            hide_bar();
        }
    });
}

function loadLineInfo() {
    var fromDate = $("#txtFromDate").val();
    var toDate = $("#txtToDate").val();

    var sendData = {
        from_date: fromDate,
        to_date: toDate,
        item_code: itemCode
    };

    $.ajax(subLink + restURI + '?action_name=loadLineInfo', {
        method: 'GET',
        data: {data: JSON.stringify(sendData)},
        success: function (res) {
            if (res.success) {
                $("#contentInfoLine").find("#infoLine").html(res.data);
                $("#contentInfoLine").show();
            }
        }
    });
}

function loadBarInfo() {
    var fromDate = $("#txtFromDate").val();
    var toDate = $("#txtToDate").val();

    var sendData = {
        from_date: fromDate,
        to_date: toDate,
        item_code: itemCode
    };

    $.ajax(subLink + restURI + '?action_name=loadBarInfo', {
        method: 'GET',
        data: {data: JSON.stringify(sendData)},
        success: function (res) {
            if (res.success) {
                $("#contentInfoBar").find("#infoBar").html(res.data);
                $("#contentInfoBar").show();
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
function optDatePicker2() {
    return {
        language: 'th',
        thaiyear: true,
        format: 'dd/mm/yyyy'
    };
}

function resize_canvas_line() {
    canvas = document.getElementById("lineList");
    canvas.width = window.innerWidth - 300;
    line1.Draw();
    $("#contentLineList").show();
}
function resize_canvas_bar() {
    canvas = document.getElementById("barList");
    canvas.width = window.innerWidth - 300;
    bar1.Draw();
    $("#contentBarList").show();
}

function selected_date(field, dayNumber) {
    // เลื่อนวันที่เริ่มต้น
    try {
        switch (field) {
            case 'today':
                {
                    var d = moment().toDate();
                    $("#txtToDate").datepicker('update', d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear());
                    $("#txtFromDate").datepicker('update', d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear());
                }
                break;
            case 'month':
                {
                    var d = new Date();
                    $("#txtToDate").datepicker('update', d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear());
                    $("#txtFromDate").datepicker('update', '1/' + (d.getMonth() + 1) + '/' + d.getFullYear());
                }
                break;
            case 'year':
                {
                    var d = new Date();
                    $("#txtToDate").datepicker('update', d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear());
                    $("#txtFromDate").datepicker('update', '1/1/' + d.getFullYear() + 543);
                }
                break;
            default:
            {
                var s = document.getElementById(field).value.split("/");
                var d = new Date();
                d.setYear(parseInt(s[2]) - 543);
                d.setMonth(parseInt(s[1]) - 1);
                d.setDate(parseInt(s[0]));
                d.setDate(d.getDate() + dayNumber);
                document.getElementById(field).value = d.getDate() + '/' + (d.getMonth() + 1) + '/' + (d.getFullYear());
            }
        }
    } catch (err) {
    }
    getAllData();
}

function convertDate(date) {
    return moment(date).add(0, 'year').format('DD/MM/YYYY');
}