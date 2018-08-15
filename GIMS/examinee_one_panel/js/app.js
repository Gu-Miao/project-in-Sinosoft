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

            // 获取当前点击的标签的索引和已经激活的标签的索引
            var thisIndex = $(this).index(); // 作为参数获取列表信息
            var activeIndex = tabBox.find(".tab-active").index();

            // 找到激活的标签移除激活样式并为点击的标签添加激活样式
            tabBox.find(".tab-active").removeClass("tab-active");
            $(this).addClass("tab-active");
            
            // 调用接口渲染列表或内容
        }
    }
});