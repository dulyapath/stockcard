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

    $("#create_save").on('click', function () {
        var data = $('#code').val();
        var data_old = $('#old_code').val();
        var trans_type = $("input[name='trans_type']:checked").val();
        if (data != '') {
            if (data_old != '') {
                var json_data = {cmd: 'update', code: data, old_code: data_old, trans_type: trans_type};
                $.ajax({
                    url: serverURL + 'updateDocType',
                    method: 'POST',
                    data: json_data,
                    success: function (res) {
                        console.log(res)
                        if (res == 'success') {
                            _loadData();
                            $('#createModal').modal('hide');
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
            } else {
                var json_data = {cmd: 'save', code: data, trans_type: trans_type};
                $.ajax({
                    url: serverURL + 'saveDocType',
                    method: 'POST',
                    data: json_data,
                    success: function (res) {
                        console.log(res)
                        if (res == 'success') {
                            _loadData();
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


        } else {
            swal("กรุณาเพิ่มข้อมูลประเภท", "", "error")
        }
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
        url: serverURL + 'getDocType',
        method: 'GET',
        cache: false,
        success: function (res) {
            console.log(res)
            var html = "";
            if (res.length > 0) {
                for (var i = 0; i < res.length; i++) {
                    html += ` <tr>
                                  <td class="text-center">${i + 1}</td>
                                  <td class="text-left">${res[i].code}</td>`
                    if (res[i].trans_type == '0') {
                        html += `     <td class="text-center">รับ</td>`
                    } else {
                        html += `     <td class="text-center">จ่าย</td>`
                    }
                    html += `     <td class="text-center">
                                    <button class="btn btn-sm btn-edit" code="${res[i].code}" trans="${res[i].trans_type}"><i class="fa fa-edit" style="color:orange"></i></button>
                                    <button class="btn btn-sm btn-del" style="margin-left: 3px" code="${res[i].code}" trans="${res[i].trans_type}"><i class="fa fa-trash" style="color:#ff3333"></i></button>
                                  </td>
                              </tr>`;
                }

            } else {
                html = ` <tr>
                                                    <td class="text-center" colspan='3'>ไม่พบข้อมูลประเภท</td>
                                                </tr>`;
            }
            $('#table-detail').html(html);
        },
        error: function (res) {
            console.log(res)
        },
    });
}