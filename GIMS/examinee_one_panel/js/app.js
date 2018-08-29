$(function() {

    // 获取 DOM 元素
    var tab = $(".tab");
    var tabBox = $(".tab-box");

    // 绑定点击事件
    tab.click(changeTab);

    // 默认A标签激活
    $(".tab:eq(0)").trigger("click");

    // 切换标签
    function changeTab() {

        // 判断当前标签是否已激活, 是, 不执行下列语句; 否, 执行下列语句;
        if(!$(this).hasClass("tab-active")) {

            // 获取当前点击的标签的索引(作为参数获取列表信息)
            var thisIndex = $(this).index();

            // 找到激活的标签移除激活样式并为点击的标签添加激活样式
            tabBox.find(".tab-active").removeClass("tab-active");
            $(this).addClass("tab-active");
            
            // 调用接口渲染列表或内容
            switch(thisIndex) {
                case 0:
                    renderPanel(0);
                    break;
                case 1:
                    renderPanel(1);
                    break;
                case 2:
                    renderPanel(2);
                    break;
                case 3:
                    renderPanel(3);
                    break;
                default:
                    break;
            }
        }
    }

    // 渲染面板
    function renderPanel(index) {

        var inner = ['A', 'B', 'C', 'D'];
        var panel = $('.examinee-panel');
        panel.empty();
        panel.append($('<p>内容' + inner[index] + '正在面板上显示...<p>'));
        panel.find('p').css({
            ['font-size']: '36px',
            ['margin']: '50px 0 0 30px'
        })
    }
});