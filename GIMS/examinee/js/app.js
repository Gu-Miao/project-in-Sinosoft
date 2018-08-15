$(function() {

    // 获取 DOM 元素
    var tab = $(".tab");
    var tabBox = $(".tab-box");
    var examineeBox = $(".examinee-box");

    // 绑定点击事件
    tab.click(changeTab);

    // 默认A标签激活
    $(".tab:eq(0)").addClass("tab-active");
    $(".examinee-panel:eq(0)").removeClass("hide");

    // 切换标签
    function changeTab() {
        if(!$(this).hasClass("tab-active")) {

            // 获取当前点击的标签的索引和已经激活的标签的索引
            var thisIndex = $(this).index();
            var activeIndex = tabBox.find(".tab-active").index();

            // 找到激活的标签移除激活样式并为点击的标签添加激活样式
            tabBox.find(".tab-active").removeClass("tab-active");
            $(this).addClass("tab-active");
            
            // 获取已经激活的面板并将它隐藏
            examineeBox.find(".examinee-panel:eq(" + activeIndex + ")").addClass("hide");
            
            // 显示点击的标签对应的面板
            examineeBox.find(".examinee-panel:eq(" + thisIndex + ")").removeClass("hide");
        }
    }
});