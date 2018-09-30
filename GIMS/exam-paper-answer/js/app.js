$(function () {
    var url = window.location.href.split("index.html")[0] + "data.json";
    // 获取数据
    $.getJSON(url, function (data) {
        console.log(data);

        // 初始化答题须知，试卷名，考生信息
        // $examNote.init();
        $paperName.init(data.data.name);
        // $examineeInfo.init();

        // 修改分数
        $('.exam_top .time').html(Number(data.data.zgscore) + Number(data.data.kgscore));
        if (data.data.group.length) {
            for (var i in data.data.group) {
                loadQuestionFormQuestionType(data.data.group[i].questionType, data.data.group[i]);
            }
        } else {
            throw new Error("There are no question in the paper! Please check it.");
        }
        $('input[type="radio"], input[type="checkbox"]').attr('disabled', true);
        $('.exam_map ul li a').click(function (e) {

            e.preventDefault();

            var type = $(e.target).attr('href');
            var title = $(type + ' .red');
            var position = title.offset().top;

            $(document).scrollTop(position - 80);
        });
    });
});

// 根据题型加载题目
function loadQuestionFormQuestionType(questionType, group) {
    var questionType = Number(questionType);

    switch (questionType) {
        case 1:
            $singleChoise.init(group);
            loadNavFormQuestionType("single-choise", "单选题");
            break;
        case 2:
            $multipleChoice.init(group);
            loadNavFormQuestionType("multiple-choice", "多选题");
            break;
        case 3:
            $judgement.init(group);
            loadNavFormQuestionType("judgement", "判断题");
            break;
        case 4:
            $completion.init(group);
            loadNavFormQuestionType("completion", "填空题");
            break;
        case 5:
            $shortAnswer.init(group);
            loadNavFormQuestionType("short-answer", "简答题");
            break;
        default:
            throw new Error("Uncaught questionType: " + questionType);
            break;
    }
}

// 根据题型初始化导航栏
function loadNavFormQuestionType(questionBlockId, questionTypeStr) {
    $('.exam_map ul').append($('<li><a href="#' + questionBlockId + '">' + questionTypeStr + '</a></li>'));
}


// 答题须知
var $examNote = function () {
    var $dom = $(''
        + ' <div class="exam_page_top">'
        + '答题须知：<br> 1. 请用钢笔或签字笔在试卷上直接作答，并准确填写个人信息，每人限答一份。<br> 2. 本试卷为内部资料，由中科软保密办统一收回，个人不得复制、留存。<br> 3. 其他文字资料，文字提示语言，以实际为准。'
        + '</div>');

    function init() {
        $('.exam_page').prepend($dom);
    }

    return {
        init: init
    };
}();

// 试卷名
var $paperName = function () {
    var $dom = $('<div class="exam_page_h1"></div>');

    function init(name) {
        $dom.html(name);
        $('.exam_page').append($dom);
    }

    return {
        init: init
    }
}();

// 考生信息
var $examineeInfo = function () {
    var $dom = $(''
        + '<div class="exam_page_block">'
        + '<table width="90%" border="0" cellspacing="0" cellpadding="0" class="exam_page_block_table">'
        + '<tbody>'
        + '<tr>'
        + '<td width="20%" class="text-right">考生姓名：</td>'
        + '<td width="30%">张三</td>'
        + '<td width="20%" class="text-right">考试时间：</td>'
        + '<td width="30%">2017年2月2日</td>'
        + '</tr>'
        + '<tr>'
        + '<td class="text-right">部门职务：</td>'
        + '<td>经理</td>'
        + '<td class="text-right">身份证号：</td>'
        + '<td>263882198602839283</td>'
        + '</tr>'
        + '<tr>'
        + '<td class="text-right">联系电话：</td>'
        + '<td>13433667788</td>'
        + '<td class="text-right">答题时间：</td>'
        + '<td>2小时</td>'
        + '</tr>'
        + '</tbody>'
        + '</table>'
        + '</div>');

    function init() {
        $('.exam_page').append($dom);
    }

    return {
        init: init
    };
}();

// 单选题
var $singleChoise = function () {
    var $dom = $(''
        + '<div class="single-choise" id="single-choise">'
        + '<div class="exam_page_h2">'
        + '<span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> '
        + '<b class="red">单选题</b>'
        + '<span></span>'
        + '</div>'

        + '<div class="exam_page_block"></div>'
        + '</div>');

    var $question = $(''
        + '<div class="exam_one_question">'
        + '<div class="exam_subject"></div>'
        + '<div class="exam_answer"></div>'
        + '</div>');

    var $option = $(''
        + '<div class="radio">'
        + '<label>'
        + '<input type="radio" name="" value="">'
        + "<span></span>"
        + '</label>'
        + '</div>');

    var $analysis = $(''
        + '<div class="exam_analysis">'
        + '<div class="score">'
        + '得 <b class="red"></b> 分'
        + '</div>'
        + '<div class="main">'
        + '正确答案：<b class="green"></b> &nbsp;&nbsp;&nbsp;&nbsp;考生答案：<b class="black"></b><br>'
        + '答案解析：<span></span>'
        + '</div>'
        + '</div>');

    // 初始化
    function init(data) {
        $dom.find('.exam_page_h2 span:eq(1)').html('（共' + data.questionCount + '题，每题' + data.everyScore + '分）');


        for (var i = 0; i < data.question.length; ++i) {

            // 添加题目
            var $questionClone = $question.clone();
            $questionClone.find('.exam_subject').html(i + 1 + "." + data.question[i].describe);
            $questionClone.attr("name", data.question[i].id);
            $dom.find('.exam_page_block').append($questionClone);
            var rightAnswer = 0;
            var checkAnswer = data.question[i].isCheck;

            for (var j = 0; j < data.question[i].list.length; ++j) {

                // 添加选项
                var $optionClone = $option.clone();
                $optionClone.find('label input')
                    .attr("name", data.question[i].id)
                    .attr("value", data.question[i].list[j].content);
                $optionClone.find('label span').html(convertNumberToLetter(j+1)+'. '+data.question[i].list[j].content);
                $dom.find('.exam_answer:eq(' + i + ')').append($optionClone);

                if (Number(data.question[i].list[j].isRight)) rightAnswer = j + 1;
                if ((Number(checkAnswer) - 1) === j) $optionClone.find('[type="radio"]')[0].checked = true;

            }
            var $analysisClone = $analysis.clone();
            $analysisClone.find('.score .red').html(data.question[i].score);
            $analysisClone.find('.main .green').html(convertNumberToLetter(rightAnswer));
            $analysisClone.find('.main .black').html(convertNumberToLetter(checkAnswer));
            if (data.question[i].analysis) {
                $analysisClone.find('.main span').html(data.question[i].analysis);
            } else {
                $analysisClone.find('.main span').html("暂无");
            }
            $dom.find('.exam_answer:eq(' + i + ')').append($analysisClone);
        }
        $('.exam_page').append($dom);
    }

    return {
        init: init
    };

}();

// 多选题
var $multipleChoice = function () {

    var $dom = $(''
        + '<div class="multiple-choice" id="multiple-choice">'
        + '<div class="exam_page_h2">'
        + '<span class="glyphicon glyphicon-list" aria-hidden="true"></span>'
        + '<b class="red"> 多选题</b>'
        + '<span></span>'
        + '</div>'

        + '<div class="exam_page_block"></div>'
        + '</div>');

    var $question = $(''
        + '<div class="exam_one_question">'
        + '<div class="exam_subject"></div>'
        + '<div class="exam_answer"></div>'
        + '</div>');

    var $option = $(''
        + '<div class="checkbox">'
        + '<label>'
        + '<input type="checkbox" name="" value="">'
        + '<span></span>'
        + '</label>'
        + '</div>');

    var $analysis = $(''
        + '<div class="exam_analysis">'
        + '<div class="score">'
        + '得 <b class="red"></b> 分'
        + '</div>'
        + '<div class="main">'
        + '正确答案：<b class="green"></b> &nbsp;&nbsp;&nbsp;&nbsp;考生答案：<b class="black"></b><br>'
        + '答案解析：<span></span>'
        + '</div>'
        + '</div>');

    // 初始化
    function init(data) {

        $dom.find('.exam_page_h2 span:eq(1)').html('（共' + data.questionCount + '题，每题' + data.everyScore + '分）');

        for (var i = 0; i < data.question.length; ++i) {

            // 添加题目
            var $questionClone = $question.clone();
            $questionClone.find('.exam_subject').html(i + 1 + "." + data.question[i].describe);
            $questionClone.attr("name", data.question[i].id);
            $dom.find('.exam_page_block').append($questionClone);
            var rightAnswerArray = [];
            var checkAnswer = "";
            var checkAnswerArray = data.question[i].isCheck.split('#');

            for (var j = 0; j < data.question[i].list.length; ++j) {

                // 添加选项
                var $optionClone = $option.clone();
                $optionClone.find('label input').attr("value", data.question[i].list[j].content);
                $optionClone.find('label span').html(convertNumberToLetter(j+1)+'. '+data.question[i].list[j].content);
                $dom.find('.exam_answer:eq(' + i + ')').append($optionClone);

                if (Number(data.question[i].list[j].isRight)) rightAnswerArray.push(j + 1);
                for(var k = 0; k < checkAnswerArray.length; ++k) {
                    if(checkAnswerArray[k] == (j+1)) $optionClone.find('[type="checkbox"]')[0].checked = true;
                }
            }

            var $analysisClone = $analysis.clone();
            var rightAnswer = "";
            $analysisClone.find('.score .red').html(data.question[i].score);
            for (var k = 0; k < rightAnswerArray.length; ++k) {
                rightAnswer += convertNumberToLetter(rightAnswerArray[k]) + " ";
            }
            for (var k = 0; k < checkAnswerArray.length; ++k) {
                checkAnswer += convertNumberToLetter(checkAnswerArray[k]) + " ";
            }
            $analysisClone.find('.main .green').html(rightAnswer);
            $analysisClone.find('.main .black').html(checkAnswer);

            console.log(data.question, i);
            if (data.question[i].analysis) {
                $analysisClone.find('.main span').html(data.question[i].analysis);
            } else {
                $analysisClone.find('.main span').html("暂无");
            }
            $dom.find('.exam_answer:eq(' + i + ')').append($analysisClone);
        }
        $('.exam_page').append($dom);
    }

    return {
        init: init
    }

}();

// 判断题
var $judgement = function () {

    var $dom = $(''
        + '<div class="judgement" id="judgement">'
        + '<div class="exam_page_h2">'
        + '<span class="glyphicon glyphicon-check"></span>'
        + '<b class="red"> 判断题</b>'
        + '<span></span>'
        + '</div>'

        + '<div class="exam_page_block"></div>'
        + '</div>');

    var $question = $(''
        + '<div class="exam_one_question">'
        + '<div class="exam_subject"></div>'
        + '<div class="exam_answer"></div>'
        + '</div>');

    var $option = $(''
        + '<label class="radio-inline">'
        + '<input type="radio" name="" value="">'
        + '<span></span>'
        + '</label>');

    var $analysis = $(''
        + '<div class="exam_analysis">'
        + '<div class="score">'
        + '得 <b class="red"></b> 分'
        + '</div>'
        + '<div class="main">'
        + '正确答案：<b class="green"></b> &nbsp;&nbsp;&nbsp;&nbsp;考生答案：<b class="black"></b><br>'
        + '答案解析：<span></span>'
        + '</div>'
        + '</div>');

    // 初始化
    function init(data) {

        $dom.find('.exam_page_h2 span:eq(1)').html('（共' + data.questionCount + '题，每题' + data.everyScore + '分）');

        for (var i = 0; i < data.question.length; ++i) {

            // 添加题目
            var $questionClone = $question.clone();
            $questionClone.find('.exam_subject').html(i + 1 + "." + data.question[i].describe);
            $questionClone.attr("name", data.question[i].id);
            $dom.find('.exam_page_block').append($questionClone);
            var rightAnswer = 0;
            var checkAnswer = data.question[i].isCheck;

            for (var j = 0; j < data.question[i].list.length; ++j) {

                // 添加选项
                var $optionClone = $option.clone();
                $optionClone.find('input')
                    .attr("name", data.question[i].id)
                    .attr("value", data.question[i].list[j].content);
                $optionClone.find('span').html(convertNumberToLetter(j+1)+'. '+data.question[i].list[j].content);
                $dom.find('.exam_answer:eq(' + i + ')').append($optionClone);

                if (Number(data.question[i].list[j].isRight)) rightAnswer = j + 1;
                if ((Number(checkAnswer)-1) ===  j) $optionClone.find('[type="radio"]')[0].checked = true;
            }

            var $analysisClone = $analysis.clone();
            $analysisClone.find('.score .red').html(data.question[i].score);
            $analysisClone.find('.main .green').html(convertNumberToLetter(rightAnswer));
            $analysisClone.find('.main .black').html(convertNumberToLetter(checkAnswer));
            if (data.question[i].analysis) {
                $analysisClone.find('.main span').html(data.question[i].analysis);
            } else {
                $analysisClone.find('.main span').html("暂无");
            }
            $dom.find('.exam_answer:eq(' + i + ')').append($analysisClone);
        }
        $('.exam_page').append($dom);
    }

    return {
        init: init
    };
}();

// 填空题
var $completion = function () {

    var $dom = $(''
        + '<div class="completion" id="completion">'
        + '<div class="exam_page_h2">'
        + '<span class="glyphicon glyphicon-check"></span>'
        + '<b class="red"> 填空题</b>'
        + '<span></span>'
        + '</div>'

        + '<div class="exam_page_block"></div>'
        + '</div>');

    var $question = $(''
        + '<div class="exam_one_question">'
        + '<div class="exam_subject"></div>'
        + '<div class="exam_answer"></div>'
        + '</div>');

    var $analysis = $(''
        + '<div class="exam_analysis">'
        + '<div class="score">得 <b class="red"></b> 分</div>'
        + '<div class="main">'
        + '正确答案：<b class="green"></b> <br>'
        + '考生答案：<b class="black"></b><br>'
        + '答案解析：<span></span>'
        + '</div>'
        + '</div>'
    )

    // 初始化
    function init(data) {

        $dom.find('.exam_page_h2 span:eq(1)').html('（共' + data.questionCount + '题，每题' + data.everyScore + '分）');

        for (var i = 0; i < data.question.length; ++i) {

            // 添加题目
            var $questionClone = $question.clone();
            $questionClone.find('.exam_subject').html(i + 1 + "." + data.question[i].describe);
            $questionClone.attr("name", data.question[i].id);
            $dom.find('.exam_page_block').append($questionClone);

            var rightAnswer = [];
            var checkAnswer = data.question[i].optionContent.split('#').join('，');;

            for (var j = 0; j < data.question[i].list.length; ++j) {
                rightAnswer.push(data.question[i].list[j].content);
            }
            rightAnswer = rightAnswer.join('，');

            var $analysisClone = $analysis.clone();
            $analysisClone.find('.score .red').html(data.question[i].score);
            $analysisClone.find('.main .green').html(rightAnswer);
            $analysisClone.find('.main .black').html(checkAnswer);

            console.log(data.question, i);
            if (data.question[i].analysis) {
                $analysisClone.find('.main span').html(data.question[i].analysis);
            } else {
                $analysisClone.find('.main span').html("暂无");
            }
            $dom.find('.exam_answer:eq(' + i + ')').append($analysisClone);
        }
        $('.exam_page').append($dom);
    }

    return {
        init: init
    };
}();

// 简答题
var $shortAnswer = function () {

    var $dom = $(''
        + '<div class="short-answer" id="short-answer">'
        + '<div class="exam_page_h2">'
        + '<span class="glyphicon glyphicon-edit"></span>'
        + '<b class="red" >简答题</b>'
        + '<span></sapn>'
        + '</div>'

        + '<div class="exam_page_block"></div>'
        + '</div>');

    var $question = $(''
        + '<div class="exam_one_question">'
        + '<div class="exam_subject"></div>'
        + '<div class="exam_answer"></div>'
        + '</div>');

    var $option = $('<textarea class="form-control no-resize" rows="3" readonly></textarea>');

    var $analysis = $(''
        + '<div class="exam_analysis">'
        + '<div class="score">得 <b class="red"></b> 分</div>'
        + '<div class="main">'
        + '答案解析：<span></span>'
        + '</div>'
        + '</div>'
    )

    // 初始化
    function init(data) {

        $dom.find('.exam_page_h2 span:eq(1)').html('（共' + data.questionCount + '题，每题' + data.everyScore + '分）');

        for (var i = 0; i < data.question.length; ++i) {

            // 添加题目
            var $questionClone = $question.clone();
            $questionClone.find('.exam_subject').html(i + 1 + "." + data.question[i].describe);
            $questionClone.attr("name", data.question[i].id)

            $dom.find('.exam_page_block').append($questionClone);

            // 添加选项
            var $optionClone = $option.clone();
            $optionClone.val(data.question[i].optionContent);
            $dom.find('.exam_answer:eq(' + i + ')').append($optionClone);

            // 添加答案解析
            var $analysisClone = $analysis.clone();
            $analysisClone.find('.score .red').html(data.question[i].score);
            $analysisClone.find('.main span').html(data.question[i].analysis);
            $dom.find('.exam_answer:eq(' + i + ')').append($analysisClone);
        }
        $('.exam_page').append($dom);
    }

    return {
        init: init
    };
}();


// 将数字转换成字母
function convertNumberToLetter(number) {
    var number = Number(number);
    switch (number) {
        case 1:
            return "A";
            break;
        case 2:
            return "B";
            break;
        case 3:
            return "C";
            break;
        case 4:
            return "D";
            break;
        default:
            throw new Error("Can not convert this number to letter!");
            break;
    }
}