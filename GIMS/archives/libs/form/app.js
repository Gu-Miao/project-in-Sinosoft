$(function () {

    // 加载表单
    initForm();
});

// 初始化表单
function initForm() {
    $.ajax({
        url: '/data/form.json',
        type: 'get',
        success: function (data) {

            // 解析数据
            var data = JSON.parse(data);
            console.log("加载表单的数据：\n", data);

            // 获取父页面中激活的标签
            console.log($('.tab', window.parent.document).attr('data-TABLE_NAME'));

            // 获取激活的标签
            var TABLE_NAME = $('.tab', window.parent.document).attr('data-TABLE_NAME');
            var usefullData = [];

            for (let i = 0; i < data.length; ++i) {
                if (data[i].TABLE_NAME === TABLE_NAME && data[i].COLUMN_VISIBLE === "T") {
                    usefullData.push(data[i]);
                }
            }

            // 对数据进行排序
            usefullData.sort(sortByNumber('COLUMN_ORDER'));
            console.log("有用的数据\n", usefullData);

            for (let i = 0; i < usefullData.length; ++i) {
                loadInput(usefullData[i]);
            }

            // 显示树的对话框
            $('.treelayer').click(showTreeLayer);

            // 让 iframe 自适应高度，但最高 500px
            $('iframe', window.parent.document).height($(document).height()).css({
                'max-height': '500px',
                overflow: 'auto'
            });

            // 给保存按钮绑定方法
            $('.app .btn.btn-primary').click(submitForm);

        },
        error: function (err) {
            layer.msg('加载失败，请刷新页面');
            console.log("加载表单失败，错误信息：\n", err);
        }
    });
}

/**
 * 数组根据数组对象中的某个属性值进行排序
 * 用法：arr.sort(sortBy('COLUMN_ORDER', false)) 表示根据 COLUMN_ORDER 属性对 arr 进行降序排列，若第二个参数不传递，默认表示升序排序
 * @param attr 排序的属性，只支持 Number 类型，或者 String 类型的数字
 * @param rev true 表示升序排列，false 降序排序
 */
function sortByNumber(attr, rev) {
    //第二个参数没有传递 默认升序排列
    if (rev == undefined) {
        rev = 1;
    } else {
        rev = (rev) ? 1 : -1;
    }

    return function (a, b) {
        a = Number(a[attr]);
        b = Number(b[attr]);
        if (a < b) {
            return rev * -1;
        }
        if (a > b) {
            return rev * 1;
        }
        return 0;
    }
}

/**
 * 加载表单控件
 * @param data 加载表单控件所需要的数据对象
 */
function loadInput(data) {
    // T text S select A textarea(只会占一行) D treelayer F 
    switch (data.COLUMN_INPUT_TYPE) {
        case "T":
            loadTextInput(data);
            break;
        case "S":
            loadDropdown(data);
            break;
        case "A":
            loadTextArea(data);
            break;
        case "D":
            loadTreeLayer(data);
            break;
        case "F":
            loadF(data);
            break;
        default:
            break;
    }
}

/**
 * 加载文本框
 * @param data 加载文本框所需要的数据对象
 */
function loadTextInput(data) {
    $('.app form.row').append($(''
        + '<div class="form-group col-sm-6">'
        + '<label>' + data.COLUMN_CHN_NAME + '</label>'
        + '<input type="text" class="form-control" value="' + (data.COLUMN_VALUE_DEFAULT ? data.COLUMN_VALUE_DEFAULT : "") + '">'
        + '</div>')
    );
}

/**
 * 加载下拉菜单
 * @param data 加载下拉菜单所需要的数据对象
 */
function loadDropdown(data) {
    $('.app form.row').append($(''
        + '<div class="form-group col-sm-6">'
        + '<label>' + data.COLUMN_CHN_NAME + '</label>'
        + '<div class="select-container dropdown">'
        + '<button class="btn btn-default dropdown-toggle text-left" data-toggle="dropdown">'
        + (data.COLUMN_VALUE_DEFAULT ? data.COLUMN_VALUE_DEFAULT : "请选择")
        + '<span class="caret frcaret"></span>'
        + '</button>'
        + '<ul class="dropdown-menu">'
        + '<li class="dropdown-item">修改</li>'
        + '<li class="dropdown-item">新增</li>'
        + '<li class="dropdown-item">组合查询</li>'
        + '<li class="dropdown-item">简单查询</li>'
        + '<li class="dropdown-item">替换</li>'
        + '<li class="dropdown-item">档案调整</li>'
        + '<li class="dropdown-item">提交</li>'
        + '<li class="dropdown-item">删除</li>'
        + '</ul>'
        + '</div>'
        + '</div>'
    ));
}

/**
 * 加载文本域
 * @param data 加载文本域所需要的数据对象
 */
function loadTextArea(data) {
    $('.app form.row').append($(''
        + '<div class="form-group col-sm-12">'
        + '<label>' + data.COLUMN_CHN_NAME + '</label>'
        + '<textarea>' + (data.COLUMN_VALUE_DEFAULT ? data.COLUMN_VALUE_DEFAULT : "") + '</textarea>'
        + '</div>'
    ));
}

/**
 * 加载树的对话框
 * @param data 加载树的对话框所需要的数据对象
 */
function loadTreeLayer(data) {
    $('.app form.row').append($(''
        + '<div class="form-group col-sm-6">'
        + '<label>' + data.COLUMN_CHN_NAME + '</label>'
        + '<input type="text" class="form-control treelayer" value="' + (data.COLUMN_VALUE_DEFAULT ? data.COLUMN_VALUE_DEFAULT : "") + '">'
        + '</div>')
    );
}

/**
 * 加载F
 * @param data 加载F所需要的数据对象
 */
function loadF(data) {
    var $form = $('.app form.row');
}

/**
 * 显示树的弹框
 */
function showTreeLayer() {
    layer.open({
        title: '树'
    });
}

/**
 * 保存表单内容并提交
 */
function submitForm() {

    // 声明表单提交的数据
    var formData = [];

    // 判断控件类型并获取控件名和值
    for (let i = 0; i < $('.app form.row .form-group').length; ++i) {
        var data = {};
        if ($('.app form.row .form-group:eq(' + i + ') input[type="text"]').length) {
            data = getTextInputValue(i);
        } else if ($('.app form.row .form-group:eq(' + i + ') .dropdown-toggle').length) {
            data = getDropDownValue(i);
        } else if ($('.app form.row .form-group:eq(' + i + ') textarea').length) {
            data = getTextareaValue(i);
        } else {
            console.log("未找到控件！")
        }
        formData.push(data);
    }

    console.log("表单提交的数据：\n", formData);
}

/**
 * 获取文本框的值
 * @param index 文本框容器在表单中的索引
 * @return  文本框的数据对象
 */
function getTextInputValue(index) {
    var html = $('.app form.row .form-group:eq(' + index + ') input[type="text"]').val();
    return {
        COLUMN_CHN_NAME: $('.app form.row .form-group:eq(' + index + ') label').html(),
        value: (html === "" || isNaN(Number(html)) ? html : Number(html))
    };
}

/**
 * 获取下拉菜单的值
 * @param index 下拉菜单容器在表单中的索引
 * @return  下拉菜单的数据对象
 */
function getDropDownValue(index) {
    var html = $('.app form.row .form-group:eq(' + index + ') .dropdown-toggle').html().split('<')[0];
    return {
        COLUMN_CHN_NAME: $('.app form.row .form-group:eq(' + index + ') label').html(),
        value: ((html === "请选择") ? "" : html)
    };
}

/**
 * 获取文本域的值
 * @param index 文本域容器在表单中的索引
 * @return  文本域的数据对象
 */
function getTextareaValue(index) {
    return {
        COLUMN_CHN_NAME: $('.app form.row .form-group:eq(' + index + ') label').html(),
        value: $('.app form.row .form-group:eq(' + index + ') textarea').val()
    };
}




{/* 
<div class="form-group col-sm-6">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email">
</div>
<div class="form-group col-sm-6">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
</div>
<div class="form-group col-sm-12">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email">
</div>
<div class="form-group col-sm-12">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
</div>
<div class="form-group col-sm-12">
    <label for="date">Date</label>
    <input type="text" class="form-control" id="date" placeholder="Password">
</div>
<div class="form-group col-sm-12">
    <label for="exampleInputFile">File input</label>
    <!-- <input type="text" class="form-control" id="fileinput" placeholder="Password"> -->
    <input type="file" id="exampleInputFile">
    <p class="help-block">Example block-level help text here.</p>
</div>
<div class="form-group col-sm-12">
    <label for="exampleInputFile">Textarea</label>
    <!-- <input type="text" class="form-control" id="fileinput" placeholder="Password"> -->
    <textarea name="" id="" cols="30" rows="10"></textarea>
    <p class="help-block">Example block-level help text here.</p>
</div>
<div class="checkbox col-sm-12">
    <label>
        <input type="checkbox"> Check me out
    </label>
</div>
<div class="col-sm-12">
    <button type="submit" class="btn btn-default">Submit</button>
</div>*/
}

{/* <div class="form-item-container">
    <label for="" class="form-item-label">
        <span class="form-item-title">text input:</span>
        <input type="text" name="" id="" class="form-item">
    </label>
</div> */}