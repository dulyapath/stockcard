
$(document).ready(function () {



    var doc_no = $('#doc_no').val()
    $.ajax({
        url: '../getDocSoDetail?docno=' + doc_no,
        method: 'GET',
        success: function (res) {

            console.log(res)
            var __rsHTML = '';

            __rsHTML += "<div class='divHeader' style='padding: 5px 0'>";
            if (res.length > 0) {
                var saletype = ''
                var vattype = ''
                if (res[0].sale_type == '0') {
                    saletype = 'ขายเงินเชื่อ'
                } else if (res[0].sale_type == '1') {
                    saletype = 'ขายเงินสด'
                }

                if (res[0].vat_type == '0') {
                    vattype = 'ภาษีแยกนอก'
                } else if (res[0].vat_type == '1') {
                    vattype = 'ภาษีรวมใน'
                } else if (res[0].vat_type == '2') {
                    vattype = 'ภาษีอัตราศูนย์'
                }
                var is_rival = '';
                if (is_rival == '0') {
                    is_rival = 'ไม่มีคู่แข่ง'
                } else {
                    is_rival = 'มีคู่แข่ง'
                }

                __rsHTML += "<div class='row' style='font-size: 18px;'>";
                __rsHTML += "<div class='col-sm-6 '>";
                __rsHTML += "<p>เลขที่เอกสาร: " + res[0].doc_no + "</p>";
                __rsHTML += "</div>";
                __rsHTML += "<div class='col-sm-6 '>";
                __rsHTML += "<p class='text-right'>วันที่: " + res[0].doc_date + "</p>";
                __rsHTML += "</div>";
                __rsHTML += "</div>";
                __rsHTML += "<div class='row' style='font-size: 18px;'>";
                __rsHTML += "<div class='col-sm-6 '>";
                __rsHTML += "<p  class='text-left'>ชื่อโครงการ: " + res[0].project_name + " ผู้ติดต่อ: " + res[0].contact + "</p>";
                __rsHTML += "</div>";
                __rsHTML += "<div class='col-sm-6 '>";
                __rsHTML += "<p  class='text-right'>คู่แข่ง: " + is_rival + " </p>";
                __rsHTML += "</div>";
                __rsHTML += "<div class='col-sm-6 '>";
                __rsHTML += "<p >ประเภทการขาย: " + saletype + "</p>";
                __rsHTML += "</div>";
                __rsHTML += "<div class='col-sm-6 '>";
                __rsHTML += "<p class='text-right'>รหัสลูกค้า: " + res[0].cust_code + "~" + res[0].cust_name + "</p>";
                __rsHTML += "</div>";

                __rsHTML += "</div>";
                __rsHTML += "<div class='row' style='font-size: 18px;'>";
                __rsHTML += "<div class='col-sm-6 '>";
                __rsHTML += "<p >ประเภทภาษี: " + vattype + " </p>";
                __rsHTML += "</div>";
                __rsHTML += "<div class='col-sm-6 '>";
                __rsHTML += "<p  class='text-right'>สาขา: " + res[0].branch_code + "~" + res[0].branch_name + " </p>";
                __rsHTML += "</div>";

                __rsHTML += "</div>";
                __rsHTML += "<div class='row' style='font-size: 18px;'>";
                __rsHTML += "<div class='col-sm-6 '>";
                __rsHTML += "<p >ผู้เปิดใบอนุมัติ:" + res[0].creator_code + '~' + res[0].creator_name + "</p>";
                __rsHTML += "</div>";
                __rsHTML += "<div class='col-sm-6 '>";
                __rsHTML += "<p class='text-right'>พนักงานขาย:" + res[0].saler_code + '~' + res[0].saler_name + "</p>";
                __rsHTML += "</div>";
                __rsHTML += "<div class='col-sm-12 '>";
                __rsHTML += "<p >หมายเหตุ: " + res[0].remark + " </p>";
                __rsHTML += "</div>";


                $("#content-list").html(__rsHTML);
                console.log(res[0].total_exp_discount)

                $('#total_exp_each').html(formatNumber(res[0].total_exp_each));


                _displayTable(res[0].detail)

            }


        },
        error: function (res) {
            console.log(res)
        },
    });
});
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

function _displayTable(item_detail) {
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


    setTimeout(function () {
        window.print();
        window.close();
    }, 2500);
}

