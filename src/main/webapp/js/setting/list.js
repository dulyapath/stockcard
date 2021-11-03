var serverURL = "../";

$(document).ready(function () {
    console.log("ready!");
    _loadData();
    $('#btn-create').on('click', function () {
        $('#code').val('');
        $('#old_code').val('');
        $("#modaltitle").text('สร้างประเภทเอกสารใหม่');
        $('#createModal').modal('show');
    });



    $("#btn-save").on('click', function () {
        var date_edit = 0;

        if ($('#dateEdit').is(":checked")) {
            date_edit = 1
        } else {
            date_edit = 0;
        }

        var json_data = {date_edit: date_edit};
        $.ajax({
            url: serverURL + 'updateSetting',
            method: 'POST',
            data: json_data,
            success: function (res) {
                console.log(res)
                if (res == 'success') {
                    _loadData();
                    swal("บันทึกข้อมูลสำเร็จ", "", "success")
                    $('#old_code').val('');
                } else {
                    swal("ข้อมูลซ้ำ", "", "warning")
                }

            },
            error: function (res) {

                swal("Error " + res, "", "error")
            },
        });
    });

    $(document).delegate('.btn-del', 'click', function (event) {
        var code = $(this).attr('code')
        swal({
            title: "ยืนยันการทำงาน",
            text: "ต้องการลบประเภท " + code + " ใช่หรือไม่",
            icon: "warning",
            buttons: ["ปิด", "ตกลง"],
            dangerMode: true,
        })
                .then((willDelete) => {
                    if (willDelete) {
                        $.ajax({
                            url: serverURL + 'delDocType',
                            method: 'POST',
                            data: {code: code},
                            success: function (res) {
                                swal("การทำรายการทำเสร็จ", {
                                    icon: "success",
                                });
                                _loadData('');
                            },
                            error: function (res) {
                                console.log(res)
                            },
                        });
                    }
                });
    });


    $(document).delegate('.btn-edit', 'click', function () {

        var data = $(this);
        var code = data.attr('code');
        var trans = data.attr('trans');
        console.log(trans)
        $('#old_code').val(code);
        $('#code').val(code);
        $("[name=trans_type]").val([trans]);
        $("#modaltitle").text('แก้ไขประเภทเอกสาร ' + code);
        $('#createModal').modal('show');

    });
});

function _loadData() {
    $.ajax({
        url: serverURL + 'getScSetting',
        method: 'GET',
        cache: false,
        success: function (res) {
            console.log(res)
            var html = "";
            if (res.length > 0) {
                if (res[0].date_edit == 1) {
                    $('#dateEdit').prop('checked', true);
                } else {
                    $('#dateEdit').prop('checked', false);
                }
            } else {
                $('#dateEdit').prop('checked', false);
            }

        },
        error: function (res) {
            console.log(res)
        },
    });
}