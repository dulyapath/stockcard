var objBox = null;
var serverURL = "../";
var sql_date = 'YYYY-MM-DD';

var inp = "";
var doc_no = "";
var ic_code = "";
var qty = "";
var whcode = "";
var shelfcode = "";
var value = "";

$(function () {
    objBox = $('#root').clone();
  //  $('#stage').html('');


      loadList({});
      
 $("#barcode").keyup(function() {
    
            a = new Date();
            secrchByBarcode = true;
    });

    $("#item").keyup(function() {
            a = new Date();
            secrchByItem = true;
    }); 

    window.setInterval(function() {
            var b = new Date();
            var second = (b - a);
            if (second > 500) {
                    var $mode = $("#mode").text();
                  
                    if (secrchByItem == true)
                    {
                        
                            secrchByItem = false;
                            $value = $("#item").val();
                            console.log($value)
                            loadList({value: $value});
                            
                            
                           // $("#result").load($url);
                            //$("#result").load("icinfoprocess.php?input=test");
                    }
                    if (secrchByBarcode == true)
                    {
                            secrchByBarcode = false;
                            $value = $("#barcode").val();
                           
                           console.log($value)
                           
                           loadList({barcode: $value});
                            //alert($url);
                            //$("#result").load($url);
                            //$("#result").load("icinfoprocess.php?input=test");
                    }
            }
    }, 100);

});


function loadList(data) {

    $('#load').show();
    $('#doc_not_found').hide();

    console.log(data);
    var sql_date = 'YYYY-MM-DD';
    var format_date = 'll';
    var txt_send = ["รับเอง", "ส่งให้"];
    var txt_vate = ["ภาษีแยกนอก", "ภาษีรวมใน", "ภาษีอัตราศูนย์"];
    var txt_inquiry = ['ขายเงินเชื่อ', 'ขายเงินสด', 'ขายสินค้าเงินสด (สินค้าบริการ)', 'ขายสินค้าเงินเชื่อ (สินค้าบริการ)'];
    var color_inquiry = ['orange', '#1D4C99', 'orange', '#1D4C99'];
    var txt_status = ["ยังไม่อนุมัติ", "Confirm", "ยังไม่ได้จัด", "จัดเสร็จ", "รับแล้ว"];

   $('#resultx').html('');
    $.ajax({
        url: serverURL + 'sale02-list',  
        method: 'GET',
        cache: false,
        
        success: function (res) {
           console.log("1234")
            
            console.log(res)
            
            $('#resultx').html(res);
             
        },
        error: function (res) {
            swal({
                title: 'เกิดข้อผิดพลาด',
                text: res.responseText,
                type: "error",
                timer: 2000,
                showConfirmButton: false});
        },
        complete: function () {
            $('#load').hide();
        }
    });
}

function credit(obj) {
	var id = obj.id.substring(1);
        console.log(id);
	if ($("#R"+id).html() != "")
	{
		$("#R"+id).empty();
	} else {
		
                $.ajax({
                    url: serverURL + 'arcustomer-detail',
                    method: 'POST',
                    cache: false,
                    data: {cust: id},
                    success: function (res) {

                         //console.log(res);
                        $("#R"+id).html(res);
                    },
                    error: function () {

                    }

                });
		
	}
}




var id_use = [];
function genid() {
    var $gen_length = 4;
    var $lip_text = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var $lip_length = $lip_text.length;

    var $gen_text = '';
    for (var $i = 0; $i < $gen_length; $i++) {
        $gen_text += $lip_text.charAt(Math.floor(Math.random() * ($lip_length - 0 + 1)) + 0);
    }

    if (!checkTempId($gen_text)) {
        $gen_text = genid();
    }
    id_use.push($gen_text);
    return $gen_text;
}

function checkTempId(id_new) {
    for (var id_temp in id_use) {
        if (id_temp == id_new) {
            return false;
        }
    }
    return true;
}

