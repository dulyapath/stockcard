/* global moment */

const log = console.log.bind();
const restURL = "report-1";
const subLink = $("#hSubLink").val();
const now = moment().toDate();
const dToDate = convertDate(now);
const dFromDate = convertDate(moment(now).add(-7, 'day'));

var CURRENT_PAGE = 0;
var TOTAL_PAGE = 20;
var PAGE_SIZE = 0;
var PAGI_CURRENT_VALUE = null;
var objPagination = null;

$(function () {
    initObj();
    loadGroupMain();
    loadGroupSub();
    loadBrand();
    loadItemSize();
    loadWarehouse();

    $("#contentSearchBox").on("click", "#btnLoadReport", function () {
        loadReportList();
    });

    $("#contentPaginationBox").on("keydown", "#txt-pagination", function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
                // Allow: Ctrl+A, Command+A
                        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                        // Allow: home, end, left, right, down, up
                                (e.keyCode >= 35 && e.keyCode <= 40)) {
                    // let it happen, don't do anything
                    return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });

    $("#contentPaginationBox").on("keypress", "#txt-pagination", function (e) {
        if (e.keyCode === 13) {
            if ($(this).val() <= PAGE_SIZE && $(this).val() > 0) {
                CURRENT_PAGE = $(this).val();
                loadReportList();
            } else {
                $(this).val(PAGI_CURRENT_VALUE);
            }
            $(this).blur();
        }
    });

    $("#contentPaginationBox").on("focusin", "#txt-pagination", function () {
        PAGI_CURRENT_VALUE = $(this).val();
        $(this).val('');
    });

    $("#contentPaginationBox").on("focusout", "#txt-pagination", function () {
        $(this).val(PAGI_CURRENT_VALUE);
    });

    $("#contentPaginationBox").on("click", ".btn-pagination", function () {
        var page_id = $(this).attr("page-id");
        if (page_id >= 0) {
            CURRENT_PAGE = page_id;
            loadReportList();
        }
    });

    $("#contentTableBox").on("change", "#selTableRows", function () {
        CURRENT_PAGE = 0;
        TOTAL_PAGE = parseInt($(this).val());
        loadReportList();
    });
});

function initObj() {
    objPagination = $("#contentPaginationBox").find("#contentPaginationList").clone();
    $("#contentSearchBox").find("#txtDocDate").datepicker(optDatePicker());
    $("#contentSearchBox").find("#txtDocDate").datepicker('update', dToDate);
}

function loadReportList() {
    data = {};
    data.offset = CURRENT_PAGE > 0 ? (CURRENT_PAGE - 1) * TOTAL_PAGE : 0;
    data.limit = TOTAL_PAGE;

    if (checkUndefined($("#txtDocDate").val()) && $("#txtDocDate").val().length > 0) {
        data.doc_date = $("#txtDocDate").val();
    }

    if (checkUndefined($("#selFromGroupMain").val()) && $("#selFromGroupMain").val().length > 0 && checkUndefined($("#selToGroupMain").val()) && $("#selToGroupMain").val().length > 0) {
        data.from_group_main = $("#selFromGroupMain").val();
        data.to_group_main = $("#selToGroupMain").val();
    }

    if (checkUndefined($("#selFromGroupSub").val()) && $("#selFromGroupSub").val().length > 0 && checkUndefined($("#selToGroupSub").val()) && $("#selToGroupSub").val().length > 0) {
        data.from_group_sub = $("#selFromGroupSub").val();
        data.to_group_sub = $("#selToGroupSub").val();
    }

    if (checkUndefined($("#selFromBrand").val()) && $("#selFromBrand").val().length > 0 && checkUndefined($("#selToBrand").val()) && $("#selToBrand").val().length > 0) {
        data.from_brand = $("#selFromBrand").val();
        data.to_brand = $("#selToBrand").val();
    }

    if (checkUndefined($("#selFromItemSize").val()) && $("#selFromItemSize").val().length > 0 && checkUndefined($("#selToItemSize").val()) && $("#selToItemSize").val().length > 0) {
        data.from_item_size = $("#selFromItemSize").val();
        data.to_item_size = $("#selToItemSize").val();
    }

    if (checkUndefined($("#selFromWarehouse").val()) && $("#selFromWarehouse").val().length > 0 && checkUndefined($("#selToWarehouse").val()) && $("#selToWarehouse").val().length > 0) {
        data.from_warehouse = $("#selFromWarehouse").val();
        data.to_warehouse = $("#selToWarehouse").val();
    }

    if ((checkUndefined($("#txtFromYear").val()) && $("#txtFromYear").val().length > 0 && $("#txtFromYear").val() > 0) && (checkUndefined($("#txtToYear").val()) && $("#txtToYear").val().length > 0 && $("#txtToYear").val() > 0)) {
        data.from_year = $("#txtFromYear").val();
        data.to_year = $("#txtToYear").val();
    }

    if ((checkUndefined($("#txtFromWeek").val()) && $("#txtFromWeek").val().length > 0 && $("#txtFromWeek").val() > 0) && (checkUndefined($("#txtToWeek").val()) && $("#txtToWeek").val().length > 0 && $("#txtToWeek").val() > 0)) {
        data.from_week = $("#txtFromWeek").val();
        data.to_week = $("#txtToWeek").val();
    }

    $.ajax(subLink + restURL + "?action_name=loadReport", {
        method: "GET",
        data: {data: JSON.stringify(data)},
        beforeSend: function () {
            $("#contentTableBox").find("#list").html("<tr><td colspan='8'><p><span class='fa fa-refresh fa-spin'></span> กำลังโหลด...</p></td></tr>");
            $("#contentPaginationBox").empty();
        },
        success: function (res) {
            if (res.success) {
                log(res.row_count);
                $("#contentTableBox").find("#list").html(renderReportList(res.data));
                if (res.row_count > 0) {
                    $("#contentPaginationBox").append(createPagination(res.row_count));
                    $("#contentPaginationBox").fadeIn("fast");
                }
            } else {
                log(res);
            }
        }, complete: function () {
            log('complete');
        }
    });
}

function loadGroupMain() {
    $.ajax(subLink + restURL + "?action_name=loadGroupMain", {
        method: "GET",
        success: function (res) {
            if (res.success) {
                if (res.data.length > 0) {
                    $("#contentSearchBox").find("#selFromGroupMain").select2({maximumSelectionLength: -1}).attr("disabled", false);
                    $("#contentSearchBox").find("#selToGroupMain").select2({maximumSelectionLength: -1}).attr("disabled", false);
                }
                $("#contentSearchBox").find("#selFromGroupMain").html(renderSelectData(res.data));
                $("#contentSearchBox").find("#selToGroupMain").html(renderSelectData(res.data));
            } else {
                log(res);
            }
        }
    });
}

function loadGroupSub() {
    $.ajax(subLink + restURL + "?action_name=loadGroupSub", {
        method: "GET",
        success: function (res) {
            if (res.success) {
                if (res.data.length > 0) {
                    $("#contentSearchBox").find("#selFromGroupSub").select2({maximumSelectionLength: -1}).attr("disabled", false);
                    $("#contentSearchBox").find("#selToGroupSub").select2({maximumSelectionLength: -1}).attr("disabled", false);
                }
                $("#contentSearchBox").find("#selFromGroupSub").html(renderSelectData(res.data));
                $("#contentSearchBox").find("#selToGroupSub").html(renderSelectData(res.data));
            } else {
                log(res);
            }
        }
    });
}

function loadBrand() {
    $.ajax(subLink + restURL + "?action_name=loadBrand", {
        method: "GET",
        success: function (res) {
            if (res.success) {
                if (res.data.length > 0) {
                    $("#contentSearchBox").find("#selFromBrand").select2({maximumSelectionLength: -1}).attr("disabled", false);
                    $("#contentSearchBox").find("#selToBrand").select2({maximumSelectionLength: -1}).attr("disabled", false);
                }
                $("#contentSearchBox").find("#selFromBrand").html(renderSelectData(res.data));
                $("#contentSearchBox").find("#selToBrand").html(renderSelectData(res.data));
            } else {
                log(res);
            }
        }
    });
}

function loadItemSize() {
    $.ajax(subLink + restURL + "?action_name=loadItemSize", {
        method: "GET",
        success: function (res) {
            if (res.success) {
                if (res.data.length > 0) {
                    $("#contentSearchBox").find("#selFromItemSize").select2({maximumSelectionLength: -1}).attr("disabled", false);
                    $("#contentSearchBox").find("#selToItemSize").select2({maximumSelectionLength: -1}).attr("disabled", false);
                }
                $("#contentSearchBox").find("#selFromItemSize").html(renderSelectData(res.data));
                $("#contentSearchBox").find("#selToItemSize").html(renderSelectData(res.data));
            } else {
                log(res);
            }
        }
    });
}

function loadWarehouse() {
    $.ajax(subLink + restURL + "?action_name=loadWarehouse", {
        method: "GET",
        success: function (res) {
            if (res.success) {
                if (res.data.length > 0) {
                    $("#contentSearchBox").find("#selFromWarehouse").select2({maximumSelectionLength: -1}).attr("disabled", false);
                    $("#contentSearchBox").find("#selToWarehouse").select2({maximumSelectionLength: -1}).attr("disabled", false);
                }
                $("#contentSearchBox").find("#selFromWarehouse").html(renderSelectData(res.data));
                $("#contentSearchBox").find("#selToWarehouse").html(renderSelectData(res.data));
            } else {
                log(res);
            }
        }
    });
}

function renderReportList(data) {
    resHTML = "";
    if (data.length > 0) {
        $.each(data, function (key, obj) {
            ic_code = (obj.ic_code !== null && obj.ic_code !== undefined && obj.ic_code.length > 0) ? obj.ic_code : "-";
            ic_name = (obj.ic_name !== null && obj.ic_name !== undefined && obj.ic_name.length > 0) ? obj.ic_name : "-";
            group_main = (obj.group_main !== null && obj.group_main !== undefined && obj.group_main.length > 0) ? obj.group_main : "-";
            group_sub = (obj.group_sub !== null && obj.group_sub !== undefined && obj.group_sub.length > 0) ? obj.group_sub : "-";
            item_brand = (obj.item_brand !== null && obj.item_brand !== undefined && obj.item_brand.length > 0) ? obj.item_brand : "-";
            item_size = (obj.item_size !== null && obj.item_size !== undefined && obj.item_size.length > 0) ? obj.item_size : "-";
            balance_qty = (obj.balance_qty !== null && obj.balance_qty !== undefined && obj.balance_qty.length > 0) ? obj.balance_qty : "-";
            price = (obj.price !== null && obj.price !== undefined && obj.price.length > 0) ? obj.price : "-";

            resHTML += "<tr>";
            resHTML += "<td>" + ic_code + "</td>";
            resHTML += "<td>" + ic_name + "</td>";
            resHTML += "<td>" + group_main + "</td>";
            resHTML += "<td>" + group_sub + "</td>";
            resHTML += "<td>" + item_brand + "</td>";
            resHTML += "<td>" + item_size + "</td>";
            resHTML += "<td>" + balance_qty + "</td>";
            resHTML += "<td>" + price + "</td>";
            resHTML += "</tr>";
            if (obj.detail.length > 0) {
                resHTML += "<tr style='background-color: #00ccff;'>";
                resHTML += "<td></td>";
                resHTML += "<td></td>";
                resHTML += "<td>ซีเรียลนัมเบอร์</td>";
                resHTML += "<td>ปี</td>";
                resHTML += "<td>สัปดาห์</td>";
                resHTML += "<td>ชื่อคลัง</td>";
                resHTML += "<td>ชื้อที่เก็บ</td>";
                resHTML += "<td></td>";
                resHTML += "</tr>";

                $.each(obj.detail, function (key2, obj2) {
                    serial_number = (obj2.serial_number !== null && obj2.serial_number !== undefined) ? obj2.serial_number : "-";
                    product_week = (obj2.product_week !== null && obj2.product_week !== undefined) ? obj2.product_week : "-";
                    product_year = (obj2.product_year !== null && obj2.product_year !== undefined) ? obj2.product_year : "-";
                    location_name = (obj2.location_name !== null && obj2.location_name !== undefined) ? obj2.location_name : "-";
                    warehouse_name = (obj2.warehouse_name !== null && obj2.warehouse_name !== undefined) ? obj2.warehouse_name : "-";
                    product_year = (obj2.product_year !== null && obj2.product_year !== undefined) ? obj2.product_year : "-";

                    resHTML += "<tr style='background-color: #EAFAF1;'>";
                    resHTML += "<td></td>";
                    resHTML += "<td></td>";
                    resHTML += "<td>" + serial_number + "</td>";
                    resHTML += "<td>" + product_year + "</td>";
                    resHTML += "<td>" + product_week + "</td>";
                    resHTML += "<td>" + warehouse_name + "</td>";
                    resHTML += "<td>" + location_name + "</td>";
                    resHTML += "<td></td>";
                    resHTML += "</tr>";
                });
            }
        });
    } else {
        resHTML += "<tr>";
        resHTML += "<td colspan='8'>ไม่พบข้อมูล</td>";
        resHTML += "</tr>";
    }
    return resHTML;
}

function renderSelectData(data) {
    resHTML = "";
    if (data.length > 0) {
        resHTML = "<option value=''>ทั้งหมด</option>";
        $.each(data, function (key, obj) {
            resHTML += "<option value='" + obj.code + "'>" + obj.name_1 + "</option>";
        });
    } else {
        resHTML = "<option value=''>ไม่พบข้อมูล</option>";
    }
    return resHTML;
}


function checkUndefined(selector) {
    if (typeof selector !== typeof undefined && selector !== false) {
        return true;
    } else {
        return false;
    }
}

function convertDate(date, date_format) {
    return moment(date).add(date_format === 'th' ? 543 : 0, 'year').format('DD/MM/YYYY');
}

function optDatePicker() {
    return {
        language: 'th',
        thaiyear: true,
        format: 'dd/mm/yyyy',
        autoclose: true
    };
}

function createPagination(total_records) {
    var objPagiList = objPagination.clone();
    $("#contentPaginationBox").empty();
    var page = parseInt(CURRENT_PAGE) === 0 ? 1 : CURRENT_PAGE;
    var total_pages = total_records > 0 ? parseInt(total_records / TOTAL_PAGE) : 0;
    if (parseInt(total_pages) === 0) {
        total_pages = 1;
    } else {
        var total_pages2 = total_records > 0 ? parseFloat(total_records / TOTAL_PAGE) : 0.00;
        total_pages2 = total_pages2.toFixed(2); // ทำให้เป็นทศนิยม 2 ตำแหน่ง
        var split_total_page2 = total_pages2.toString().split('.');
        if (split_total_page2[1] > 0) {
            total_pages += 1;
        }
    }

    PAGE_SIZE = total_pages;
    // CREATE HTML
    if (parseInt(page) === 1) {
        objPagiList.find("#btn-pagi-first").attr('page-number', -1).addClass("disabled");
        objPagiList.find("#btn-pagi-previous").attr("page-number", -1).addClass("disabled");
    } else {
        objPagiList.find("#btn-pagi-first").attr('page-id', 1).addClass("btn-pagination");
        objPagiList.find("#btn-pagi-previous").attr("page-id", parseInt(page) - 1).addClass("btn-pagination");
    }
    if (parseInt(page) === parseInt(total_pages)) {
        objPagiList.find("#btn-pagi-next").attr("page-id", -1).addClass("btn-pagination disabled");
        objPagiList.find("#btn-pagi-last").attr('page-id', -1).addClass("btn-pagination disabled");
    } else {
        objPagiList.find("#btn-pagi-next").attr("page-id", parseInt(page) + 1).addClass("btn-pagination");
        objPagiList.find("#btn-pagi-last").attr('page-id', total_pages).addClass("btn-pagination");
    }

    objPagiList.find("#txt-pagination").val("หน้า " + page + " ถึง " + total_pages);
    // return HTML
    return objPagiList;
}