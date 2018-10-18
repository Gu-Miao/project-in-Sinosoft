$(function () {

    // 点击按钮弹出视频信息页面
    $("#video-info").click(function () {
        layer.open({
            type: 2,
            title: '视频信息',
            shadeClose: true,
            shade: 0.8,
            area: ['70%', '90%'],
            content: './page/play.html',
            resize: false
        });
    });
});