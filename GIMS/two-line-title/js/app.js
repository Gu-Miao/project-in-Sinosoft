// 获取标题
var p = $('p')[0];

// 列表项加载完后运行
onPLoad();

function onPLoad() {

    // 显示标题内容
    var content = $(".title-content p");
    content.html($(p).html());

    // 判断标题文字是否溢出
    if (p.scrollWidth > p.clientWidth) {
        // wrap($(p).parent()[0], p);
        twoLineTitle(p);
    }
}

// 手动换行
function wrap(father, ele) {
    var text = $(ele).html();
    $(ele).html('');
    for (let i = 1; i <= text.length; ++i) {
        $(ele).html(text.substr(0, i));
        if (ele.scrollWidth > ele.clientWidth) {
            var index = $(father).find('p').length;
            if(index) {
                $(father).prepend($('<p>'+ text.substr(0, i - 1)+ '</p>'));
            } else {
                $(father).find('p:eq(' + index +')').after($('<p>'+ text.substr(0, i - 1)+ '</p>'));
            }
            $(ele).html(text.substr(i - 1, text.length));
            wrap(father, ele);
            break;
        }
        if(i === text.length) {
            
        }
    }
}

// 两行标题
function twoLineTitle(ele) {
    var text = $(ele).html();
    $(ele).html('');
    for (let i = 1; i <= text.length; ++i) {
        $(ele).html(text.substr(0, i));
        if (ele.scrollWidth > ele.clientWidth) {
            var twoLineText = text.substr(0, i-1) + '<br>' +text.substr(i - 1, text.length)
            $(ele).html(twoLineText);
            break;
        }
    }
}