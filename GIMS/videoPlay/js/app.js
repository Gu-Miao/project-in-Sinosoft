// 获取 DOM
var btn = $('.test button');

// 判断模态框中是否有 video 元素，若没有添加一个
btn.click(startPlay);


// 点击关闭按钮暂停并重置
$(".video-dialog .close").click(function() {
    $(this).parent().find("video")[0].pause();
    $(this).parent().find("video")[0].currentTime = 0;
});

function startPlay() {

    console.log(this);
    if(!$("#play .video-dialog video").length) {
        $("#play .video-dialog").append($('<video src="' + $(this).attr("data-src") + '" poster controls></video>'));
    } else {
        if($("#play .video-dialog video").attr("src") !== $(this).attr("data-src")) {
            $("#play .video-dialog video")[0].src = $(this).attr("data-src");
        }
    }
}