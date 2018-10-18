// 全局变量
var studyTime = 0; // 学习时长

$(function () {
    $("#play").click(function () {
        layer.open({
            type: 1,
            title: "视频播放",

            // 播放弹框宽度，根据情况修改
            area: ['90%', 'auto'],
            content: '<div class="video-container">'
                + '<video id="video" src="./video/glassySky.mp4" autoplay controls ></video>'
                + '</div>',
            resize: false,
            zIndex: 19891017,
            success: function (dom, index) {

                // 视频加载完成，让弹框大小和 video 一样
                $('#video').bind('loadeddata', function () {
                    dom.find('.layui-layer-content').css('overflow', 'visible');
                    dom.height(dom.height() - dom.find('.layui-layer-content').height() + dom.find('#video').height());
                    dom.find('.layui-layer-content').height(dom.find('#video').height());
                    $('#video').unbind('loadeddata');
                });

                // 视频播放时，记录学习时间
                $('#video').bind('play', function () {
                    window.studyTimer = window.setInterval(function () {
                        makeSureStudyTime($('#video'), index);
                    }, 1000);
                });

                // 视频暂停时，注销定时器
                $('#video').bind('pause', function () {
                    console.log('pausing...');
                    if (window.studyTimer !== undefined && window.studyTimer) {
                        window.clearInterval(window.studyTimer);
                    }
                });
            }
        });
    });

    /**
	 * 让用户确认学习时间
	 * @param $video            { JQuery }          video 标签的 JQuery 对象
	 * @param playLayerIndex    { Number }          视频播放 layer 的 index
	 */
    function makeSureStudyTime($video, playLayerIndex) {
        ++studyTime;
        console.log('studyTime', studyTime);

        // 当学习多就时，让用户确认学习时长，可以调低方便调试（单位：秒）
        if (studyTime === 10) {

            // 注销学习时长定时器
            window.clearInterval(window.studyTimer);

            // 清空学习时长
            studyTime = 0;

            // 暂停视频
            $video[0].pause();

            // 确认学习时间弹框
            layer.alert('请在<span>10</span>秒内确认学习时长', {
                btn: ['确认'],
                
                // 确认回调
                yes: function (index) {

                    // 注销确认时间定时器
                    if (window.makeSureStudyTime) window.clearInterval(window.makeSureStudyTime);

                    // 关闭本弹窗
                    layer.close(index);

                    // 继续播放视频
                    $video[0].play();

                    // 保存学习时长
                    saveStudyTime();
                },

                // 弹框加载完成的回调
                success: function (dom, index) {

                    // 注销学习时长定时器
                    if (window.studyTimer) window.clearInterval(window.studyTimer);

                    // 初始化确认时间
                    var makeSureStudyTimeTimeout = 10;

                    // 声明确认时间定时器
                    window.makeSureStudyTime = window.setInterval(function () {
                        makeSureStudyTimeTimeout--;
                        if (makeSureStudyTimeTimeout) {
                            dom.find('.layui-layer-content').html('请在<span>' + (makeSureStudyTimeTimeout) + '</span>秒内确认学习时长');
                            if (makeSureStudyTimeTimeout <= 3) {
                                dom.find('.layui-layer-content span').css('color', 'red');
                            }
                        } else { // 确认时间内用户未确认学习时间

                            // 注销学习时间定时器
                            window.clearInterval(window.makeSureStudyTime);

                            // 关闭本弹窗和视频播放弹窗
                            layer.close(index);
                            layer.close(playLayerIndex);
                        }
                    }, 1000);
                },
                closeBtn: 0,
                resize: false,
                zIndex: 19891018
            });
        }
    }

    // 保存学习时长，ajax 可以写在这里
    function saveStudyTime() {

    }
});