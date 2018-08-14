$(function() {

    // 声明 DOM 元素
    var exam_notes = $(".exam_notes");
    var badge = $(".badge");
    var start = $(".exam_start_box button");
    var times = $(".exam_info table tbody tr:eq(2) td:eq(4)");
    var history = $(".exam_history");
    var t = 4;

    // 开始考试按钮禁用
    var timer = window.setInterval(function() {
        badge.html(t--);
        if(badge.html() == 0) {
            window.clearInterval(timer);
            badge.css("display", "none");
            start.removeClass("exam_start_btn_disabled").addClass("exam_start_btn");
            start.attr("disabled", false);
        }
    }, 1000);

    // 初始化考试须知
    for(var i in config.exam_notes) {
        exam_notes.append($("<p>" + config.exam_notes[i] + "</p>"))
    }

    // 修改考试须知最大高度
    if(!Number(times.html())) {
        exam_notes.css("height", "400px");
    }

    // 显示历史成绩
    if(Number(times.html())) {
        history.removeClass("hide");
    }
});