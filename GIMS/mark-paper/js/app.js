$(function () {
    fetch("./data.json", { method: "get" }).then(function (res) {
        res.text().then(function (data) {
            // 初始化评卷面板
            $markQuestion.init(data.data);

            // 给按钮绑定方法
            $('.mark-footer [name="save"]').click(clickSaveButton);
        });
    });
    // $.getJSON("../data.json", function (data) {
    //     // 初始化评卷面板
    //     $markQuestion.init(data.data);

    //     // 给按钮绑定方法
    //     $('.mark-footer [name="save"]').click(clickSaveButton);
    // });
});

/*
** 评卷面板组件
** @$markQuestionListItem   { String }      面板DOM
** @init                    { Function }    初始化的方法
** @data                    { Object }      初始化方法调用的参数，从接口获取
*/
var $markQuestion = function () {
    var $markQuestionListItem = $(''
        + '<div class="mark-paper">'
        + '<div class="row">'
        + '<div class="col-md-12 ">'
        + '<div class="block_title">'
        + '<span class="name">问题一 （20分）</span>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<br>'
        + '<div class="form-group">'
        + '<label>问题：</label>'
        + '<div class="col-md-10">'
        + '<textarea></textarea>'
        + '</div>'
        + '</div>'
        + '<div class="form-group">'
        + '<label>考生答案：</label>'
        + '<div class="col-md-10 a">'
        + '<textarea></textarea>'
        + '</div>'
        + '</div>'
        + '<div class="form-group">'
        + '<label>参考答案：</label>'
        + '<div class="col-md-10">'
        + '<textarea></textarea>'
        + '</div>'
        + '</div>'
        + '<div class="form-group">'
        + '<label>评分：</label>'
        + '<div class="col-md-3">'
        + '<input class="form-control" type="number"/>'
        + '</div>'
        + '</div>'
        + '</div>');

    function init(data) {
        console.log(data);
        for (var i = 0; i < data.group[0].question.length; ++i) {
            var $markQuestionListItemClone = $markQuestionListItem.clone();
            $markQuestionListItemClone.find('.block_title .name').html('题目' + ConvertIntNumberToChinese(i + 1) + ' （' + data.group[0].question[i].score + '分）');
            $markQuestionListItemClone.find('textarea:eq(0)').val(data.group[0].question[i].describe);
            $markQuestionListItemClone.find('textarea:eq(1)').val(data.group[0].question[i].optionContent);
            $markQuestionListItemClone.find('textarea:eq(2)').val(data.group[0].question[i].analysis);
            $markQuestionListItemClone.find('textarea').attr('rows', 3).attr('readonly', 'readonly').addClass('form-control');
            $markQuestionListItemClone.find('label').addClass('col-md-2').addClass('control-label');
            $markQuestionListItemClone.find('[type="number"]')
                .attr('name', data.group[0].paperId + '#' + data.group[0].question[i].id + '#' + data.group[0].question[i].answerId)
                .attr('min', 0)
                .keypress(validateKey);
            $('.container-fluid .row:eq(0) div:eq(0)').append($markQuestionListItemClone);
        }
    }

    // 字符级数据合法性校验
    function validateKey(e) {
        if (/[a-zA-Z`~!@#$%^&*()=_+\[\]{}|;:'",<>/?\\-]/.test(e.key)) e.preventDefault();
    }

    return {
        init: init
    };
}();

// 点击暂存按钮的回调函数
function clickSaveButton() {
    var group = [];
    for (var i = 0; i < $('.mark-content .mark-paper [type="number"]').length; ++i) {
        var markItem = {};
        var infoList = $('.mark-content .mark-paper:eq(' + i + ') [type="number"]').attr('name');
        markItem.score = $('.mark-content .mark-paper:eq(' + i + ') [type="number"]').val();
        markItem.paperId = infoList.split('#')[0];
        markItem.questionId = infoList.split('#')[1];
        markItem.answerId = infoList.split('#')[2];
        group.push(markItem);
    }
    console.log(group);
}


/*
** 将整数转换为汉字
** @section     { Number, String }      传入的整数，可以是字符串或者数字类型
** @return      { String }              转化成的汉字
*/
function ConvertIntNumberToChinese(section) {
    var section = Number(section);
    var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
    var chnUnitChar = ["", "十", "百", "千"];
    var strIns = '', chnStr = '';
    var unitPos = 0;
    var zero = true;
    while (section > 0) {
        var v = section % 10;
        if (v === 0) {
            if (!zero) {
                zero = true;
                chnStr = chnNumChar[v] + chnStr;
            }
        } else {
            zero = false;
            strIns = chnNumChar[v];
            strIns += chnUnitChar[unitPos];
            chnStr = strIns + chnStr;
        }
        unitPos++;
        section = Math.floor(section / 10);
    }
    return chnStr;
}