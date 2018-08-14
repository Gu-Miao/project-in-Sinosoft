$(function() {

    // 声明 DOM 元素
    var tab = $(".tab");
    var tabBox = $(".tab-box");

    // 绑定点击事件
    tab.click(changeTab);

    // 切换标签
    function changeTab() {
        if(!$(this).hasClass("tab-active")) {
            tabBox.find(".tab-active").removeClass("tab-active");
            $(this).addClass("tab-active");
            var hide = $(".hide");
            var active = hide.parent().find(".examinee-panel").not(hide);

            hide.removeClass("hide");
            active.addClass("hide");
        }
    }

    
});