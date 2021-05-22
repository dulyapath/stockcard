/* global moment */

const log = console.log.bind();
const restURL = "balance-lot";
const subLink = $("#hSubLink").val();
const now = moment().toDate();
var shortIc = 'down';

var objPagination = null;
var CURRENT_PAGE = 0;
var TOTAL_PAGE = 20;
var PAGE_SIZE = 0;
var PAGI_CURRENT_VALUE = null;

var ITEM_SEARCH_VALUE = [];
var WAREHOUSE_SEARCH_VALUE = [];
var SHELF_SEARCH_VALUE = [];
var SHELF_SEARCH_VALUE_2 = [];
var GROUP_SUB_SEARCH_VALUE = [];
var GROUP_SUB_2_SEARCH_VALUE = [];
var BRAND_SEARCH_VALUE = [];
var MODEL_SEARCH_VALUE = [];
var CATEGORY_SEARCH_VALUE = [];
var FORMAT_SEARCH_VALUE = [];

var FLAG_SHELF = 0;

$(function () {
    initObj();
    loadBranch();

    $("#contentSearchBox").on("click", "#btnSearchItem", function () {
        loadBalanceList();
//        $("#contentModalSearchBox").find("#tableSearch").find(".checkbox_search").prop("checked", false);
//        ITEM_SEARCH_VALUE = [];
//        loadSearchItemList();
    });


    $("#contentSearchBox").on("keyup", "#txtSearchItem", function (e) {
        var code = e.which;
        if (code === 13) {
            loadBalanceList();
        }
    });

    $("#contentSearchBox").on("click", "#btnSearchWarehouse", function () {
        $("#contentModalSearchWarehouseBox").find("#tableSearchWarehouse").find(".checkbox_search").prop("checked", false);
        WAREHOUSE_SEARCH_VALUE = [];
        loadSearchWarehouseList();
    });

    $("#contentSearchBox").on("click", "#btnSearchShelf", function () {
        $("#contentModalSearchShelfBox").find("#tableSearchShelf").find(".checkbox_search").prop("checked", false);
        SHELF_SEARCH_VALUE = [];
        FLAG_SHELF = 0
        loadSearchShelfList();
    });

    $("#contentSearchBox").on("click", "#btnSearchShelf2", function () {
        $("#contentModalSearchShelfBox").find("#tableSearchShelf").find(".checkbox_search").prop("checked", false);
        SHELF_SEARCH_VALUE_2 = [];
        FLAG_SHELF = 1
        loadSearchShelfList();
    });

    $("#contentSearchBox").on("click", "#btnSearchGroupSub", function () {
        $("#contentModalSearchGroupSubBox").find("#tableSearchGroupSub").find(".checkbox_search").prop("checked", false);
        GROUP_SUB_SEARCH_VALUE = [];
        loadSearchGroupSubList();
    });

    $("#contentSearchBox").on("click", "#btnSearchGroupSub2", function () {
        $("#contentModalSearchGroupSub2Box").find("#tableSearchGroupSub2").find(".checkbox_search").prop("checked", false);
        GROUP_SUB_2_SEARCH_VALUE = [];
        loadSearchGroupSub2List();
    });

    $("#contentSearchBox").on("click", "#btnSearchBrand", function () {
        $("#contentModalSearchBrandBox").find("#tableSearchBrand").find(".checkbox_search").prop("checked", false);
        BRAND_SEARCH_VALUE = [];
        loadSearchBrandList();
    });

    $("#contentSearchBox").on("click", "#btnSearchModel", function () {
        $("#contentModalSearchModelBox").find("#tableSearchModel").find(".checkbox_search").prop("checked", false);
        MODEL_SEARCH_VALUE = [];
        loadSearchModelList();
    });

    $("#contentSearchBox").on("click", "#btnSearchCategory", function () {
        $("#contentModalSearchCategoryBox").find("#tableSearchCategory").find(".checkbox_search").prop("checked", false);
        CATEGORY_SEARCH_VALUE = [];
        loadSearchCategoryList();
    });

    $("#contentSearchBox").on("click", "#btnSearchFormat", function () {
        $("#contentModalSearchFormatBox").find("#tableSearchFormat").find(".checkbox_search").prop("checked", false);
        FORMAT_SEARCH_VALUE = [];
        loadSearchFormatList();
    });

    $("#contentSearchBox").on("click", "#btnLoadBalanceLot", function () {
        loadBalanceList();
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
                loadBalanceList();
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
            loadBalanceList();
        }
    });

    $("#contentTableBox").find("#list").on("click", "#btnShowMore", function () {
        itemCode = $(this).attr("item_code");
        shelf_list = $(this).attr("shelf_list");
        warehouse_list = $(this).attr("warehouse_list");
        isShow = $(this).attr("is_show");

        if (parseInt(isShow) === 0) {
            $("#detail-" + itemCode).show('fast');
            $(this).attr("is_show", 1);
            $(this).find("i").removeClass("fa-angle-down");
            $(this).find("i").addClass("fa-angle-up");

            loadBalanceDetail(itemCode, shelf_list, warehouse_list);

        } else {
            $("#detail-" + itemCode).hide('fast');
            $(this).attr("is_show", 0);
            $(this).find("i").addClass("fa-angle-down");
            $(this).find("i").removeClass("fa-angle-up");
        }
    });

    $("#contentModalSearchBox").find("#tableSearch").on("change", "#chkSearch", function () {
        code = $(this).val();
        if (this.checked) {
            ITEM_SEARCH_VALUE.push(code);
        } else {
            ITEM_SEARCH_VALUE = $.grep(ITEM_SEARCH_VALUE, function (element, index) {
                return element !== code;
            });
        }
    });

    $("#contentModalSearchWarehouseBox").find("#tableSearchWarehouse").on("change", "#chkSearch", function () {
        code = $(this).val();
        if (this.checked) {
            WAREHOUSE_SEARCH_VALUE.push(code);
        } else {
            WAREHOUSE_SEARCH_VALUE = $.grep(WAREHOUSE_SEARCH_VALUE, function (element, index) {
                return element !== code;
            });
        }
    });

    $("#contentModalSearchShelfBox").find("#tableSearchShelf").on("change", "#chkSearch", function () {
        code = $(this).val();
        if (this.checked) {
            if (FLAG_SHELF === 0)
                SHELF_SEARCH_VALUE.push(code);
            else
                SHELF_SEARCH_VALUE_2.push(code);
        } else {
            if (FLAG_SHELF === 0)
                SHELF_SEARCH_VALUE = $.grep(SHELF_SEARCH_VALUE, function (element, index) {
                    return element !== code;
                });
            else
                SHELF_SEARCH_VALUE_2 = $.grep(SHELF_SEARCH_VALUE_2, function (element, index) {
                    return element !== code;
                });
        }
    });

    $("#contentModalSearchGroupSubBox").find("#tableSearchGroupSub").on("change", "#chkSearch", function () {
        code = $(this).val();
        if (this.checked) {
            GROUP_SUB_SEARCH_VALUE.push(code);
        } else {
            GROUP_SUB_SEARCH_VALUE = $.grep(GROUP_SUB_SEARCH_VALUE, function (element, index) {
                return element !== code;
            });
        }
    });

    $("#contentModalSearchGroupSub2Box").find("#tableSearchGroupSub2").on("change", "#chkSearch", function () {
        code = $(this).val();
        if (this.checked) {
            GROUP_SUB_2_SEARCH_VALUE.push(code);
        } else {
            GROUP_SUB_2_SEARCH_VALUE = $.grep(GROUP_SUB_2_SEARCH_VALUE, function (element, index) {
                return element !== code;
            });
        }
    });

    $("#contentModalSearchBrandBox").find("#tableSearchBrand").on("change", "#chkSearch", function () {
        code = $(this).val();
        if (this.checked) {
            BRAND_SEARCH_VALUE.push(code);
        } else {
            BRAND_SEARCH_VALUE = $.grep(BRAND_SEARCH_VALUE, function (element, index) {
                return element !== code;
            });
        }
    });

    $("#contentModalSearchModelBox").find("#tableSearchModel").on("change", "#chkSearch", function () {
        code = $(this).val();
        if (this.checked) {
            MODEL_SEARCH_VALUE.push(code);
        } else {
            MODEL_SEARCH_VALUE = $.grep(MODEL_SEARCH_VALUE, function (element, index) {
                return element !== code;
            });
        }
    });

    $("#contentModalSearchCategoryBox").find("#tableSearchCategory").on("change", "#chkSearch", function () {
        code = $(this).val();
        if (this.checked) {
            CATEGORY_SEARCH_VALUE.push(code);
        } else {
            CATEGORY_SEARCH_VALUE = $.grep(CATEGORY_SEARCH_VALUE, function (element, index) {
                return element !== code;
            });
        }
    });

    $("#contentModalSearchFormatBox").find("#tableSearchFormat").on("change", "#chkSearch", function () {
        code = $(this).val();
        if (this.checked) {
            FORMAT_SEARCH_VALUE.push(code);
        } else {
            FORMAT_SEARCH_VALUE = $.grep(FORMAT_SEARCH_VALUE, function (element, index) {
                return element !== code;
            });
        }
    });


    $("#contentModalSearchBox").on("click", "#btnSubmit", function () {
        $("#contentModalSearchBox").modal('hide');
        $("#contentSearchBox").find("#txtSearchItem").val(ITEM_SEARCH_VALUE);
    });

    $("#contentModalSearchWarehouseBox").on("click", "#btnSubmitWarehouse", function () {
        $("#contentModalSearchWarehouseBox").modal('hide');
        $("#contentSearchBox").find("#txtSearchWarehouse").val(WAREHOUSE_SEARCH_VALUE);
    });

    $("#contentModalSearchShelfBox").on("click", "#btnSubmitShelf", function () {
        $("#contentModalSearchShelfBox").modal('hide');
        if (FLAG_SHELF === 0) {
            $("#contentSearchBox").find("#txtSearchShelf").val(SHELF_SEARCH_VALUE[0]);
        } else {
            $("#contentSearchBox").find("#txtSearchShelf2").val(SHELF_SEARCH_VALUE_2[0]);
        }
    });

    $("#contentModalSearchGroupSubBox").on("click", "#btnSubmitGroupSub", function () {
        $("#contentModalSearchGroupSubBox").modal('hide');
        $("#contentSearchBox").find("#txtSearchGroupSub").val(GROUP_SUB_SEARCH_VALUE);
    });

    $("#contentModalSearchGroupSub2Box").on("click", "#btnSubmitGroupSub2", function () {
        $("#contentModalSearchGroupSub2Box").modal('hide');
        $("#contentSearchBox").find("#txtSearchGroupSub2").val(GROUP_SUB_2_SEARCH_VALUE);
    });

    $("#contentModalSearchBrandBox").on("click", "#btnSubmitBrand", function () {
        $("#contentModalSearchBrandBox").modal('hide');
        $("#contentSearchBox").find("#txtSearchBrand").val(BRAND_SEARCH_VALUE);
    });

    $("#contentModalSearchModelBox").on("click", "#btnSubmitModel", function () {
        $("#contentModalSearchModelBox").modal('hide');
        $("#contentSearchBox").find("#txtSearchModel").val(MODEL_SEARCH_VALUE);
    });

    $("#contentModalSearchCategoryBox").on("click", "#btnSubmitCategory", function () {
        $("#contentModalSearchCategoryBox").modal('hide');
        $("#contentSearchBox").find("#txtSearchCategory").val(CATEGORY_SEARCH_VALUE);
    });

    $("#contentModalSearchFormatBox").on("click", "#btnSubmitFormat", function () {
        $("#contentModalSearchFormatBox").modal('hide');
        $("#contentSearchBox").find("#txtSearchFormat").val(FORMAT_SEARCH_VALUE);
    });

});

function sortIc() {
    shortIc = shortIc === 'down' ? 'up' : 'down';
    $('#shortIc').attr("class", "fa fa-sort-" + shortIc);
    loadBalanceList();
}

function initObj() {
    $("#contentSearchBox").find("#txtFromYear").val(moment(now).year());
    $("#contentSearchBox").find("#txtToYear").val(moment(now).year());

    objPagination = $("#contentPaginationList").clone();
}

function loadBranch() {
    $.ajax(subLink + restURL + "?action_name=loadBranch", {
        method: "GET",
        success: function (res) {
            if (res.success) {
                if (res.data.length > 0) {
                    $("#contentSearchBox").find("#selBranchCode").select2({maximumSelectionLength: -1, minimumResultsForSearch: -1, width: '100%'}).attr("disabled", false);
                }
                $("#contentSearchBox").find("#selBranchCode").html(renderBranch(res.data));
            }
        }
    });
}

function loadBalanceList() {
    data = {};



    var _offset = 0;
    { // pagination
        if (CURRENT_PAGE > 0) {
            _offset = (CURRENT_PAGE - 1) * TOTAL_PAGE;
        }
        data.offset = _offset;
        data.limit = TOTAL_PAGE;
    }
    data.search_item = $("#txtSearchItem").val();
    data.warehouse_list = $("#contentSearchBox").find("#txtSearchWarehouse").val();
    data.shelf_from = $("#contentSearchBox").find("#txtSearchShelf").val();
    data.shelf_to = $("#contentSearchBox").find("#txtSearchShelf2").val();
    data.group_sub = $("#contentSearchBox").find("#txtSearchGroupSub").val();
    data.group_sub2 = $("#contentSearchBox").find("#txtSearchGroupSub2").val();
    data.brand = $("#contentSearchBox").find("#txtSearchBrand").val();
    data.model = $("#contentSearchBox").find("#txtSearchModel").val();
    data.category = $("#contentSearchBox").find("#txtSearchCategory").val();
    data.format = $("#contentSearchBox").find("#btnSearchFormat").val();
    data.sort = shortIc === 'down' ? 'asc' : 'desc';
    ;

    $.ajax(subLink + restURL + "?action_name=loadBalanceList", {
        method: "GET",
        data: {data: JSON.stringify(data)},
        beforeSend: function () {
            $("#contentTableBox").show();
            $("#contentTableBox").find("#list").html("<tr><td colspan='5'><h5><span class='fa fa-refresh fa-spin'></span> กำลังโหลด...</h5></td></tr>");
            $("#contentPaginationBox").empty();
        },
        success: function (res) {
            if (res.success) {
                $("#contentTableBox").find("#list").html(renderBalanceList(res.data));
                $("#contentPaginationBox").append(createPagination(res.row_count));
                $("#contentPaginationBox").fadeIn("fast");
            } else {
                log(res);
            }
        }
    });
}

function loadBalanceLotList() {
    data = {};
    if ($("#txtSearchItem").val().length > 0) {
        data.search_item = $("#txtSearchItem").val();
    }

    var _offset = 0;
    { // pagination
        if (CURRENT_PAGE > 0) {
            _offset = (CURRENT_PAGE - 1) * TOTAL_PAGE;
        }
        data.offset = _offset;
        data.limit = TOTAL_PAGE;
    }
    data.from_year = $("#contentSearchBox").find("#txtFromYear").val();
    data.to_year = $("#contentSearchBox").find("#txtToYear").val();
    data.wh_code = $("#contentSearchBox").find("#selBranchCode").val();

    $.ajax(subLink + restURL + "?action_name=loadBalanceLotList", {
        method: "GET",
        data: {data: JSON.stringify(data)},
        beforeSend: function () {
            $("#contentTableBox").show();
            $("#contentTableBox").find("#list").html("<tr><td colspan='5'><h5><span class='fa fa-refresh fa-spin'></span> กำลังโหลด...</h5></td></tr>");
            $("#contentPaginationBox").empty();
        },
        success: function (res) {
            if (res.success) {
                $("#contentTableBox").find("#list").html(renderBalanceLotList(res.data));
                $("#contentPaginationBox").append(createPagination(res.row_count));
                $("#contentPaginationBox").fadeIn("fast");
            } else {
                log(res);
            }
        }
    });
}

function loadBalanceDetail(itemCode, shelf_list = '', warehouse_list = '') {
    $.ajax(subLink + restURL + "?action_name=loadBalanceDetail", {
        method: 'GET',
        data: {data: JSON.stringify({item_code: itemCode, shelf_list: shelf_list, warehouse_list: warehouse_list})},
        success: function (res) {
            if (res.success) {
                $("#contentTableBox").find("#list").find("#detail-" + itemCode).find("#detail-list").html(renderBalanceDetail(res.data));
            }
        }
    });
}

function loadBalanceLotDetail(itemCode) {
    $.ajax(subLink + restURL + "?action_name=loadBalanceLotDetail", {
        method: 'GET',
        data: {data: JSON.stringify({item_code: itemCode})},
        success: function (res) {
            if (res.success) {
                $("#contentTableBox").find("#list").find("#detail-" + itemCode).find("#detail-list").html(renderBalanceLotDetail(res.data));
            }
        }
    });
}

function loadSearchItemList() {
    $.ajax(subLink + restURL + "?action_name=loadSearchItemList", {
        method: "GET",
        success: function (res) {
            if (res.success) {
                $("#contentModalSearchBox").find("#tableSearch").DataTable({
                    data: res.data,
                    lengthMenu: [5, 10, 25, 50, 100],
                    retrieve: true,
                    ordering: true,
                    language: {
                        lengthMenu: "แสดง _MENU_ รายการ",
                        info: "แสดงหน้า _PAGE_ / _PAGES_",
                        infoFiltered: "(จากทั้งหมด _MAX_ รายการ)",
                        zeroRecords: "ไม่พบข้อมูล",
                        infoEmpty: "ไม่พบข้อมูล",
                        search: "ค้นหา"
                    },
                    columnDefs: [
                        render2Object("#", null, 0, true, function (data, type, row, meta) {
                            return (meta.row + 1);
                        }),
                        render2Object("เลือก", null, 1, true, function (data, type, row, meta) {
                            return "<input type='checkbox' id='chkSearch' class='form-control checkbox_search' value='" + row.code + "'>";
                        }),
                        render2Object("รหัสสินค้า", null, 2, true, function (data, type, row, meta) {
                            return row.code;
                        }),
                        render2Object("ชื่อสินค้า", null, 3, true, function (data, type, row, meta) {
                            return row.name_1;
                        }),
                        render2Object("เครื่องหมาย", null, 4, true, function (data, type, row, meta) {
                            return row.sign_code;
                        }),
                        render2Object("หน่วยนับ", null, 5, true, function (data, type, row, meta) {
                            return row.unit_standard + "(" + row.unit_name + ")";
                        }),
                        render2Object("ยอดคงเหลือ", null, 6, true, function (data, type, row, meta) {
                            return row.balance_qty;
                        }),
                        render2Object("ยอดค้างจอง", null, 7, true, function (data, type, row, meta) {
                            return row.book_out_qty;
                        }),
                        render2Object("ยอดค้างส่ง", null, 8, true, function (data, type, row, meta) {
                            return row.accrued_out_qty;
                        }),
                        render2Object("ยอดค้างรับ", null, 9, true, function (data, type, row, meta) {
                            return row.accrued_in_qty;
                        })
                    ]
                });
            }
        }, complete: function () {
            $("#contentModalSearchBox").modal();
        }
    });
}

function loadSearchWarehouseList() {
    $.ajax(subLink + restURL + "?action_name=loadSearchWarehouseList", {
        method: "GET",
        success: function (res) {
            if (res.success) {
                $("#contentModalSearchWarehouseBox").find("#tableSearchWarehouse").DataTable({
                    data: res.data,
                    lengthMenu: [5, 10, 25, 50, 100],
                    retrieve: true,
                    ordering: true,
                    language: {
                        lengthMenu: "แสดง _MENU_ รายการ",
                        info: "แสดงหน้า _PAGE_ / _PAGES_",
                        infoFiltered: "(จากทั้งหมด _MAX_ รายการ)",
                        zeroRecords: "ไม่พบข้อมูล",
                        infoEmpty: "ไม่พบข้อมูล",
                        search: "ค้นหา"
                    },
                    columnDefs: [
                        render2Object("#", null, 0, true, function (data, type, row, meta) {
                            return (meta.row + 1);
                        }),
                        render2Object("เลือก", null, 1, true, function (data, type, row, meta) {
                            return "<input type='checkbox' id='chkSearch' class='form-control checkbox_search' value='" + row.code + "'>";
                        }),
                        render2Object("รหัสคลัง", null, 2, true, function (data, type, row, meta) {
                            return row.code;
                        }),
                        render2Object("ชื่อคลัง", null, 3, true, function (data, type, row, meta) {
                            return row.name_1;
                        })
                    ]
                });
            }
        }, complete: function () {
            $("#contentModalSearchWarehouseBox").modal();
        }
    });
}

function loadSearchShelfList() {
    $.ajax(subLink + restURL + "?action_name=loadSearchShelfList", {
        method: "GET",
        success: function (res) {
            if (res.success) {
                $("#contentModalSearchShelfBox").find("#tableSearchShelf").DataTable({
                    data: res.data,
                    lengthMenu: [5, 10, 25, 50, 100],
                    retrieve: true,
                    ordering: true,
                    language: {
                        lengthMenu: "แสดง _MENU_ รายการ",
                        info: "แสดงหน้า _PAGE_ / _PAGES_",
                        infoFiltered: "(จากทั้งหมด _MAX_ รายการ)",
                        zeroRecords: "ไม่พบข้อมูล",
                        infoEmpty: "ไม่พบข้อมูล",
                        search: "ค้นหา"
                    },
                    columnDefs: [
                        render2Object("#", null, 0, true, function (data, type, row, meta) {
                            return (meta.row + 1);
                        }),
                        render2Object("เลือก", null, 1, true, function (data, type, row, meta) {
                            return "<input type='checkbox' id='chkSearch' class='form-control checkbox_search' value='" + row.code + "'>";
                        }),
                        render2Object("รหัสที่เก็บ", null, 2, true, function (data, type, row, meta) {
                            return row.code;
                        }),
                        render2Object("ชื่อที่เก็บ", null, 3, true, function (data, type, row, meta) {
                            return row.name_1;
                        })
                    ]
                });
            }
        }, complete: function () {
            $("#contentModalSearchShelfBox").modal();
        }
    });
}

function loadSearchGroupSubList() {
    $.ajax(subLink + restURL + "?action_name=loadSearchGroupSubList", {
        method: "GET",
        success: function (res) {
            if (res.success) {
                $("#contentModalSearchGroupSubBox").find("#tableSearchGroupSub").DataTable({
                    data: res.data,
                    lengthMenu: [5, 10, 25, 50, 100],
                    retrieve: true,
                    ordering: true,
                    language: {
                        lengthMenu: "แสดง _MENU_ รายการ",
                        info: "แสดงหน้า _PAGE_ / _PAGES_",
                        infoFiltered: "(จากทั้งหมด _MAX_ รายการ)",
                        zeroRecords: "ไม่พบข้อมูล",
                        infoEmpty: "ไม่พบข้อมูล",
                        search: "ค้นหา"
                    },
                    columnDefs: [
                        render2Object("#", null, 0, true, function (data, type, row, meta) {
                            return (meta.row + 1);
                        }),
                        render2Object("เลือก", null, 1, true, function (data, type, row, meta) {
                            return "<input type='checkbox' id='chkSearch' class='form-control checkbox_search' value='" + row.code + "'>";
                        }),
                        render2Object("รหัส", null, 2, true, function (data, type, row, meta) {
                            return row.code;
                        }),
                        render2Object("ชื่อ", null, 3, true, function (data, type, row, meta) {
                            return row.name_1;
                        })
                    ]
                });
            }
        }, complete: function () {
            $("#contentModalSearchGroupSubBox").modal();
        }
    });
}

function loadSearchGroupSub2List() {
    $.ajax(subLink + restURL + "?action_name=loadSearchGroupSub2List", {
        method: "GET",
        success: function (res) {
            if (res.success) {
                $("#contentModalSearchGroupSub2Box").find("#tableSearchGroupSub2").DataTable({
                    data: res.data,
                    lengthMenu: [5, 10, 25, 50, 100],
                    retrieve: true,
                    ordering: true,
                    language: {
                        lengthMenu: "แสดง _MENU_ รายการ",
                        info: "แสดงหน้า _PAGE_ / _PAGES_",
                        infoFiltered: "(จากทั้งหมด _MAX_ รายการ)",
                        zeroRecords: "ไม่พบข้อมูล",
                        infoEmpty: "ไม่พบข้อมูล",
                        search: "ค้นหา"
                    },
                    columnDefs: [
                        render2Object("#", null, 0, true, function (data, type, row, meta) {
                            return (meta.row + 1);
                        }),
                        render2Object("เลือก", null, 1, true, function (data, type, row, meta) {
                            return "<input type='checkbox' id='chkSearch' class='form-control checkbox_search' value='" + row.code + "'>";
                        }),
                        render2Object("รหัส", null, 2, true, function (data, type, row, meta) {
                            return row.code;
                        }),
                        render2Object("ชื่อ", null, 3, true, function (data, type, row, meta) {
                            return row.name_1;
                        })
                    ]
                });
            }
        }, complete: function () {
            $("#contentModalSearchGroupSub2Box").modal();
        }
    });
}

function loadSearchBrandList() {
    $.ajax(subLink + restURL + "?action_name=loadSearchBrandList", {
        method: "GET",
        success: function (res) {
            if (res.success) {
                $("#contentModalSearchBrandBox").find("#tableSearchBrand").DataTable({
                    data: res.data,
                    lengthMenu: [5, 10, 25, 50, 100],
                    retrieve: true,
                    ordering: true,
                    language: {
                        lengthMenu: "แสดง _MENU_ รายการ",
                        info: "แสดงหน้า _PAGE_ / _PAGES_",
                        infoFiltered: "(จากทั้งหมด _MAX_ รายการ)",
                        zeroRecords: "ไม่พบข้อมูล",
                        infoEmpty: "ไม่พบข้อมูล",
                        search: "ค้นหา"
                    },
                    columnDefs: [
                        render2Object("#", null, 0, true, function (data, type, row, meta) {
                            return (meta.row + 1);
                        }),
                        render2Object("เลือก", null, 1, true, function (data, type, row, meta) {
                            return "<input type='checkbox' id='chkSearch' class='form-control checkbox_search' value='" + row.code + "'>";
                        }),
                        render2Object("รหัส", null, 2, true, function (data, type, row, meta) {
                            return row.code;
                        }),
                        render2Object("ชื่อ", null, 3, true, function (data, type, row, meta) {
                            return row.name_1;
                        })
                    ]
                });
            }
        }, complete: function () {
            $("#contentModalSearchBrandBox").modal();
        }
    });
}

function loadSearchModelList() {
    $.ajax(subLink + restURL + "?action_name=loadSearchModelList", {
        method: "GET",
        success: function (res) {
            if (res.success) {
                $("#contentModalSearchModelBox").find("#tableSearchModel").DataTable({
                    data: res.data,
                    lengthMenu: [5, 10, 25, 50, 100],
                    retrieve: true,
                    ordering: true,
                    language: {
                        lengthMenu: "แสดง _MENU_ รายการ",
                        info: "แสดงหน้า _PAGE_ / _PAGES_",
                        infoFiltered: "(จากทั้งหมด _MAX_ รายการ)",
                        zeroRecords: "ไม่พบข้อมูล",
                        infoEmpty: "ไม่พบข้อมูล",
                        search: "ค้นหา"
                    },
                    columnDefs: [
                        render2Object("#", null, 0, true, function (data, type, row, meta) {
                            return (meta.row + 1);
                        }),
                        render2Object("เลือก", null, 1, true, function (data, type, row, meta) {
                            return "<input type='checkbox' id='chkSearch' class='form-control checkbox_search' value='" + row.code + "'>";
                        }),
                        render2Object("รหัส", null, 2, true, function (data, type, row, meta) {
                            return row.code;
                        }),
                        render2Object("ชื่อ", null, 3, true, function (data, type, row, meta) {
                            return row.name_1;
                        })
                    ]
                });
            }
        }, complete: function () {
            $("#contentModalSearchModelBox").modal();
        }
    });
}

function loadSearchCategoryList() {
    $.ajax(subLink + restURL + "?action_name=loadSearchCategoryList", {
        method: "GET",
        success: function (res) {
            if (res.success) {
                $("#contentModalSearchCategoryBox").find("#tableSearchCategory").DataTable({
                    data: res.data,
                    lengthMenu: [5, 10, 25, 50, 100],
                    retrieve: true,
                    ordering: true,
                    language: {
                        lengthMenu: "แสดง _MENU_ รายการ",
                        info: "แสดงหน้า _PAGE_ / _PAGES_",
                        infoFiltered: "(จากทั้งหมด _MAX_ รายการ)",
                        zeroRecords: "ไม่พบข้อมูล",
                        infoEmpty: "ไม่พบข้อมูล",
                        search: "ค้นหา"
                    },
                    columnDefs: [
                        render2Object("#", null, 0, true, function (data, type, row, meta) {
                            return (meta.row + 1);
                        }),
                        render2Object("เลือก", null, 1, true, function (data, type, row, meta) {
                            return "<input type='checkbox' id='chkSearch' class='form-control checkbox_search' value='" + row.code + "'>";
                        }),
                        render2Object("รหัส", null, 2, true, function (data, type, row, meta) {
                            return row.code;
                        }),
                        render2Object("ชื่อ", null, 3, true, function (data, type, row, meta) {
                            return row.name_1;
                        })
                    ]
                });
            }
        }, complete: function () {
            $("#contentModalSearchCategoryBox").modal();
        }
    });
}

function loadSearchFormatList() {
    $.ajax(subLink + restURL + "?action_name=loadSearchFormatList", {
        method: "GET",
        success: function (res) {
            if (res.success) {
                $("#contentModalSearchFormatBox").find("#tableSearchFormat").DataTable({
                    data: res.data,
                    lengthMenu: [5, 10, 25, 50, 100],
                    retrieve: true,
                    ordering: true,
                    language: {
                        lengthMenu: "แสดง _MENU_ รายการ",
                        info: "แสดงหน้า _PAGE_ / _PAGES_",
                        infoFiltered: "(จากทั้งหมด _MAX_ รายการ)",
                        zeroRecords: "ไม่พบข้อมูล",
                        infoEmpty: "ไม่พบข้อมูล",
                        search: "ค้นหา"
                    },
                    columnDefs: [
                        render2Object("#", null, 0, true, function (data, type, row, meta) {
                            return (meta.row + 1);
                        }),
                        render2Object("เลือก", null, 1, true, function (data, type, row, meta) {
                            return "<input type='checkbox' id='chkSearch' class='form-control checkbox_search' value='" + row.code + "'>";
                        }),
                        render2Object("รหัส", null, 2, true, function (data, type, row, meta) {
                            return row.code;
                        }),
                        render2Object("ชื่อ", null, 3, true, function (data, type, row, meta) {
                            return row.name_1;
                        })
                    ]
                });
            }
        }, complete: function () {
            $("#contentModalSearchFormatBox").modal();
        }
    });
}

function render2Object(title, class_name, target, is_visible, func, width = null) {
    result = {};
    result.title = title;
    if (class_name !== null) {
        result.class_name = class_name;
    }
    result.render = func;
    result.targets = target;
    result.visible = is_visible;
    return result;
}

function renderSearchItemList(data) {
    resHTML = "";
    if (data.length > 0) {
        $.each(data, function (key, obj) {
            resHTML += "<tr>";
            resHTML += "<td style='text-align: left;' class='vertical-center'><b>" + obj.code + "</b></td>";
            resHTML += "</tr>";
        });
    } else {
        resHTML = "<tr><td colspan='4'><h5><span class='fa fa-close text-danger'></span> ไม่พบข้อมูล</h5></td></tr>";
    }
    return resHTML;
}

function renderBranch(data) {
    resHTML = "";
    if (data.length > 0) {
        resHTML = "<option value=''>ทั้งหมด</option>";
        $.each(data, function (key, obj) {
            resHTML += "<option value='" + obj.code + "'>" + obj.name_1 + " (" + obj.code + ") " + "</option>";
        });
    } else {
        resHTML = "<option value=''>ไม่พบข้อมูล</option>";
    }
    return resHTML;
}

function renderWarehouse(data) {
    resHTML = "";
    if (data.length > 0) {
        $.each(data, function (key, obj) {
            resHTML += "<tr>";
            resHTML += "<td style='text-align: left;' class='vertical-center'> " + obj.item_code + "</td>";
            resHTML += "<td class='vertical-center' style='width:500px'>" + obj.item_name + "</td>";
            resHTML += "</tr>";
        });
    } else {
        resHTML = "<tr><td colspan='6'><h5><span class='fa fa-close text-danger'></span> ไม่พบข้อมูล</h5></td></tr>";
    }
    return resHTML;
}

function renderBalanceList(data) {
    resHTML = "";
    if (data.length > 0) {
        $.each(data, function (key, obj) {
            resHTML += "<tr>";
            resHTML += "<td style='text-align: left;' class='vertical-center'><b>" + obj.item_code + "</b> ~ " + obj.item_name + "</td>";
            resHTML += "<td class='vertical-center'>" + obj.price + "</td>";
            resHTML += "<td class='vertical-center'>" + obj.balance_qty + " (" + obj.unit_code + ")</td>";
            resHTML += "<td class='vertical-center'>" + obj.year_weak + "</td>";
            resHTML += `<td class='vertical-center'>
                            <button type='button' id='btnShowMore' class='btn btn-primary btn-sm'  
                             item_code='` + obj.item_code + `' 
                             shelf_list='` + obj.shelf_list + `' 
                             warehouse_list='` + obj.warehouse_list + `' 
                             is_show='0'><i class='fa fa-angle-down'></i>
                        </button></td>`;
            resHTML += "</tr>";

            // detail
            resHTML += "<tr id='detail-" + obj.item_code + "' style='background-color: #D6EAF8; display: none;'>";
            resHTML += "<td colspan='6'>";
            resHTML += "<div>";
            resHTML += "<table class='table' style='margin-bottom: 0;'>";
            resHTML += "<thead>";
            resHTML += "<tr style='background-color: #FDEBD0;'><td style='text-align: left;'>คลัง.</td><td>ที่เก็บ</td><td>จำนวน</td></tr>";
            resHTML += "</thead>";
            resHTML += "<tbody id='detail-list'></tbody>";
            resHTML += "</table>";
            resHTML += "</div>";
            resHTML += "</td>";
            resHTML += "</tr>";
        });
    } else {
        resHTML = "<tr><td colspan='6'><h5><span class='fa fa-close text-danger'></span> ไม่พบข้อมูล</h5></td></tr>";
    }
    return resHTML;
}

function renderBalanceLotList(data) {
    resHTML = "";
    if (data.length > 0) {
        $.each(data, function (key, obj) {
            resHTML += "<tr>";
            resHTML += "<td style='text-align: left;' class='vertical-center'><b>" + obj.item_code + "</b> ~ " + obj.item_name + "</td>";
            resHTML += "<td class='vertical-center'>" + obj.price + "</td>";
            resHTML += "<td class='vertical-center'>" + obj.item_lot + "</td>";
            resHTML += "<td class='vertical-center'>" + obj.balance_qty_this_year + " (" + obj.unit_code + ")</td>";
            resHTML += "<td class='vertical-center'>" + obj.balance_qty_old_year + " (" + obj.unit_code + ")</td>";
//            resHTML += "<td class='vertical-center'>" + obj.balance_qty_all + " (" + obj.unit_code + ")</td>";
            resHTML += "<td class='vertical-center'><button type='button' id='btnShowMore' class='btn btn-primary btn-sm' item_code='" + obj.item_code + "' is_show='0'><i class='fa fa-angle-down'></i></button></td>";
            resHTML += "</tr>";

            // detail
            resHTML += "<tr id='detail-" + obj.item_code + "' style='background-color: #D6EAF8; display: none;'>";
            resHTML += "<td colspan='6'>";
            resHTML += "<div>";
            resHTML += "<table class='table' style='margin-bottom: 0;'>";
            resHTML += "<thead>";
            resHTML += "<tr style='background-color: #FDEBD0;'><td style='text-align: left;'>Lot No.</td><td>คลัง</td><td>จำนวน</td></tr>";
            resHTML += "</thead>";
            resHTML += "<tbody id='detail-list'></tbody>";
            resHTML += "</table>";
            resHTML += "</div>";
            resHTML += "</td>";
            resHTML += "</tr>";
        });
    } else {
        resHTML = "<tr><td colspan='6'><h5><span class='fa fa-close text-danger'></span> ไม่พบข้อมูล</h5></td></tr>";
    }
    return resHTML;
}

function renderBalanceLotDetail(data) {
    resHTML = "";
    if (data.length > 0) {
        $.each(data, function (key, obj) {
            resHTML += "<tr>";
            resHTML += "<td style='text-align: left;' class='vertical-center'><b>" + obj.lot_year + "</b></td>";
            resHTML += "<td class='vertical-center'>" + obj.wh_code + "</td>";
            resHTML += "<td class='vertical-center'>" + obj.balance_qty + " (" + obj.ic_unit_code + ")</td>";
            resHTML += "</tr>";
        });
    } else {
        resHTML = "<tr><td colspan='6'><h5><span class='fa fa-close text-danger'></span> ไม่พบข้อมูล</h5></td></tr>";
    }
    return resHTML;
}

function renderBalanceDetail(data) {
    resHTML = "";
    if (data.length > 0) {
        $.each(data, function (key, obj) {
            resHTML += "<tr>";
            resHTML += "<td style='text-align: left;' class='vertical-center'><b>" + obj.warehouse + "</b></td>";
            resHTML += "<td class='vertical-center'>" + obj.location + "</td>";
            resHTML += "<td class='vertical-center'>" + obj.balance_qty + " (" + obj.unit_code + ")</td>";
            resHTML += "</tr>";
        });
    } else {
        resHTML = "<tr><td colspan='6'><h5><span class='fa fa-close text-danger'></span> ไม่พบข้อมูล</h5></td></tr>";
    }
    return resHTML;
}

function createPagination(total_records) {
    var objPagiList = objPagination.clone();
    $("#contentPaginationList").empty();
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