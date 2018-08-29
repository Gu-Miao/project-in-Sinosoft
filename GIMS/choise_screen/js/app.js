// 初始化时间控件
lay('.date-item').each(function () {
    laydate.render({
        elem: this,
        trigger: 'click',
        type: 'datetime'

    });
});

// 选择屏幕绑定改变样式方法
$('.screen div').bind("mouseover", mouseOver);
$('.screen div').bind("mouseout", mouseOut);

$('.screen div').click(function() {
    if(checkTime()) {
        var start = $('#start').val();
        var end = $('#end').val();
        var side = $(this).attr('class').split(' ')[0];
        if(side === 'left') { side = "左侧"; } else { side = "右侧"; }
        var text = '开始时间：' + start + "<br>结束时间：" + end + "<br>荧屏选择：" + side;
        var that = this;
        layer.confirm(text, {
            btn: ['确定','取消']
        }, function() {
            $(that).find('button').html('正在使用中...');
            $(that).unbind("mouseover", mouseOver);
            $(that).unbind("mouseoout", mouseOut);
            $(that).unbind('click');
            notAllowed(that);
            $(that).css("cursor", "not-allowed");
        }, function() {});
    }

    
});

function mouseOver() {
    if($(this).attr('class') === 'left' || $(this).attr('class') === 'right') {
        $(this).addClass('active-div');
        $(this).find('p').addClass('active-p');
        $(this).find('button').addClass('active-button');
    }
}

function mouseOut() {
    $(this).removeClass('active-div');
    $(this).find('p').removeClass('active-p');
    $(this).find('button').removeClass('active-button');
}

function notAllowed(obj) {
    $(obj).removeClass('active-div');
    $(obj).find('p').removeClass('active-p');
    $(obj).find('button').removeClass('active-button');
}

function checkTime() {
    var start = $("#start").val();
    var end = $("#end").val();

    if(start === " " || end === " ") {
        layer.alert('时间都不选，重新选一下吧？', {icon: 6});
        return false;
    }
    var startYear = Number(start.split('-')[0]);
    var endYear = Number(end.split('-')[0]);

    if(endYear === startYear) {
        var startMonth = Number(start.split('-')[1]);
        var endMonth = Number(end.split('-')[1]);
        if(endMonth === startMonth) {
            var startDay = Number(start.split('-')[2].split(' ')[0]);
            var endDay = Number(end.split('-')[2].split(' ')[0]);
            if(endDay === startDay) {
                var stratHour = Number(start.split(' ')[1].split(':')[0]);
                var stratMin = Number(start.split(' ')[1].split(':')[1]);
                var endHour = Number(end.split(' ')[1].split(':')[0]);
                var endMin = Number(end.split(' ')[1].split(':')[1]);
                if(endHour > stratHour) {
                    return true;
                } else if (endHour === stratHour && (endMin-stratMin) >= 30) {
                    return true;
                } else if (endHour === stratHour && (endMin-stratMin) <= 30) {
                    layer.alert('开会时间太短了呀，重新选一下吧？', {icon: 6});
                } else {
                    layer.alert('时间选错了呀，重新选一下吧？', {icon: 6});
                }
            } else {
                layer.alert('日期选错了呀，重新选一下吧？', {icon: 6});
            }
        } else {
            layer.alert('月份选错了呀，重新选一下吧？', {icon: 6});
        }
    } else {
        layer.alert('年份选错了呀，重新选一下吧？', {icon: 6});
    }

    return false;
}

// 监听事件控件的值，清空时将值变为“ ”以保证样式
var targetNode1 = $('#start')[0];
var targetNode2 = $('#end')[0];

var observerConfig = { attributes: true, childList: true, subtree: true };

var callback = function(mutationsList) {
    for(var i in mutationsList) {
        if (mutationsList[i].type == 'attributes') {
            if(!$(mutationsList[i].target).val()) {
                $(mutationsList[i].target).val(" ");
            }
        }
    }
};

var observer = new MutationObserver(callback);
observer.observe(targetNode1, observerConfig);
observer.observe(targetNode2, observerConfig);