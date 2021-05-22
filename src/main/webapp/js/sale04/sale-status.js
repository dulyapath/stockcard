var SERVER_URL_1 = "../sale04-process01";
var SERVER_URL_2 = "../sale04-process02";

var PAGE_NO = 0;
var PERPAGE_NUMBER = 10;

$(document).ready(function ()
{
    $("#txt-sale-status-date-1").val(_getNewDate());
    $("#txt-sale-status-date-2").val(_getNewDate());
    $("#content-sale-status-table-list").html("<tr><td colspan='18'><span class='fa fa-refresh fa-spin fa-2x'></span></td></tr>");
});

$(function ()
{
    $("#btn-process").on("click", function () {
        _displayData("");
    });

    $("#btn-sale-status-find").on("click", function () {
        _displayData($("#txt-sale-status-find").val());
    });

    $("#txt-sale-status-find").on("keypress", function (e) {
        if (e.which === 13) {
            _displayData($(this).val());
        }
    });

    $("#content-sale-status-table-list").on("click", "#btn-credit", function () {
        _getCredit($(this).attr("doc_no_key"));
    });

    $("#content-sale-status-table-list").on("click", "#btn-waitsale", function () {
        _getWaitSale($(this).attr("doc_no_key"));
    });

    $("#content-sale-status-table-list").on("click", "#btn-close-div", function () {
        $("#R" + $(this).attr("doc_no_key")).html("");
    });
});

function _displayData(find_value) {
    var radio1 = $("#rad-1").is(":checked") ? "1" : "0";
    var radio2 = $("#rad-2").is(":checked") ? "1" : "0";
    var radio3 = $("#rad-3").is(":checked") ? "1" : "0";

    var checkbox1 = $("#chb-1").is(":checked") ? "1" : "0";
    var checkbox2 = $("#chb-2").is(":checked") ? "1" : "0";
    var checkbox3 = $("#chb-3").is(":checked") ? "1" : "0";


    var department = "";
    $.each($("input[name='department']:checked"), function () {
        if (department.length !== 0)
        {
            department = department + ",";
        }
        department = department + "\'" + $(this).val() + "\'";
    });

    var date_begin = $("#txt-sale-status-date-1").val();
    var date_end = $("#txt-sale-status-date-2").val();

    $.ajax({
        url: SERVER_URL_1,
        type: "GET",
        data: {
            mode: 1,
            action_name: "get_ic_trans",
            radio1: radio1,
            radio2: radio2,
            radio3: radio3,
            checkbox1: checkbox1,
            checkbox2: checkbox2,
            checkbox3: checkbox3,
            department: department,
            begin_date: date_begin,
            end_date: date_end,
            search: find_value
        },
        beforeSend: function () {
            $("#content-sale-status-table-list").html("<tr><td colspan='18'><span class='fa fa-refresh fa-spin fa-2x'></span></td></tr>");
        },
        success: function (res) {
            var _OUTPUT = "";
            if (res.success) {
                _OUTPUT = res.data;
            } else {
                _OUTPUT = "<tr><td colspan='18'><strong class='text-danger'>ดึงข้อมูลล้มเหลว.</strong></td></tr>";
                console.log(res);
            }
            $("#content-sale-status-table-list").html(_OUTPUT);
        },
        complete: function () {
            showPage();
        }
    });
}

function _checkInquiryType(data) {
    var _result = "";
    switch (data) {
        case 0:
            _result = "ขายเชื่อ";
            break;
        case 1:
            _result = "ขายสด";
            break;
        case 2:
            _result = "บริการเชื่อ";
            break;
        case 3:
            _result = "บริการสด";
            break;
    }
    return _result;
}

function _checkVatType(data) {
    var _result = "";
    switch (data) {

        case 0:
            _result = "แยกนอก";
            break;
        case 1:
            _result = "รวมใน";
            break;
        case 2:
            _result = "ศูนย์";
            break;
    }
    return _result;
}

function showPage() {
    $("#loader").css("display", "none");
    $("#content-sale-status-table").css("display", "block");
}

function _getNewDate() {
    var TODAY = new Date();
    var _day = TODAY.getDate();
    var _month = TODAY.getMonth() + 1;
    var _year = TODAY.getFullYear();

    if (_day < 10) {
        _day = '0' + _day;
    }

    if (_month < 10) {
        _month = '0' + _month;
    }

    return TODAY = _year + '-' + _month + '-' + _day;
}

function _getCredit(doc_no_key) {
    $.ajax({
        url: SERVER_URL_2,
        type: "GET",
        data: {
            wait_sale: false,
            doc_no: doc_no_key
        },
        success: function (res) {
            if (res.success) {
                $("#R" + doc_no_key).html(res.data).css("display", "inline");
            } else {

            }
        }
    });
}

function _getWaitSale(doc_no_key) {
    $.ajax({
        url: SERVER_URL_2,
        type: "GET",
        data: {
            wait_sale: true,
            doc_no: doc_no_key
        },
        success: function (res) {
            if (res.success) {
                $("#R" + doc_no_key).html(res.data).css("display", "inline");
            } else {

            }
        }
    });
}