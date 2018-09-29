$(function () {
    var url = window.location.href.split("index.html")[0] + "data.json";
    $.getJSON(url, function (data) {
        // 初始化评卷面板
        $markQuestion.init(data.data);

        // 给按钮绑定方法
        $('.mark-footer [name="save"]').click(clickSaveButton);
        $('.mark-footer .btn').mousedown(mouseDownSaveButton);

        // 如果页面有其他按钮的话，可以给每个按钮绑上一个 mousedown(mouseDownSaveButton)
        // 或者可以给所有按钮都绑定该方法
        // 这里我用的是给所有按钮绑定 mousedown，可以根据情况调试
    });
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
                .attr('max', data.group[0].question[i].score)
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

// 摁下暂存按钮的回调函数
function mouseDownSaveButton() {
    $('.mark-content .mark-paper [type="number"]').unbind('blur');
}

// 点击暂存按钮的回调函数
function clickSaveButton() {

    var group = [];
    var isScoreLegal = 1;
    for (var i = 0; i < $('.mark-content .mark-paper [type="number"]').length; ++i) {
        var markItem = {};
        var infoList = $('.mark-content .mark-paper:eq(' + i + ') [type="number"]').attr('name');
        var $score = $('.mark-content .mark-paper:eq(' + i + ') [type="number"]');

        markItem.max = $score.attr('max');
        markItem.min = $score.attr('min');
        markItem.score = $score.val();
        markItem.$score = $score;
        markItem.paperId = infoList.split('#')[0];
        markItem.questionId = infoList.split('#')[1];
        markItem.answerId = infoList.split('#')[2];
        if (!isScoreGroupIllegal(markItem)) isScoreLegal = 0;
        group.push(markItem);
    }
    console.log('标识符', isScoreLegal);

    if (isScoreLegal) {
        // 数据无问题，向后台发请求
    } else {
        // 错误处理
        makeOverIllegalScore(group, 0);
    }
}

/*
** 检验评分数据是否合法
** @markItem   { Object }       评卷对象
** @return     { Boolean }      true || false
*/
function isScoreGroupIllegal(markItem) {
    var score = markItem.score;
    var max = Number(markItem.max);
    var min = Number(markItem.min);

    // 是否为空，若为空直接返回真
    if (score.length) {
        score = Number(score);
    } else {
        return true;
    }

    // 多个小数点时为 NaN
    if (isNaN(score)) return false;

    // 比较大小
    if (score >= min && score <= max) {
        markItem.score = score;
    } else {
        markItem.score = undefined;
        return false;
    }

    return true;
}

/*
** 让用户修改不合法评分
** @group   { Object }      点击暂存按钮回调获取的数据对象
** @index   { string }      数据对象索引
*/
function makeOverIllegalScore(group, index) {
    console.log(index);
    var scoreObject = group[index];
    if (group.length === index) return;
    if (isUndefined(scoreObject.score)) {
        scoreObject.$score.focus();
        scoreObject.$score.blur(function () {
            $(this).unbind('blur');
            makeOverIllegalScore(group, (index + 1));
        });
    } else {
        makeOverIllegalScore(group, (index + 1));
    }
    return;
}

/*
** 判断是否为 undefined
** @value   { Any }         需要判断的值
** @return  { Boolean }     是否为 undefined 的布尔值
*/
function isUndefined(value) {
    if (typeof (value) === "undefined") return true;
    return false;
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