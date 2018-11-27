var player = null;
var index = 0;

$(function () {

    // 隐藏菜单按钮
    $('.extend_hide').click(function () {
        $('.ysp-player-menu').hide();
        player.width(1250);
        $('.extend_show').show();
        $('.video-name').css('margin-top', '-90px');
    });

    // 显示菜单按钮
    $('.extend_show').click(function () {
        $(this).hide();
        player.width(900);
        $('.ysp-player-menu').show();
        $('.video-name').css('margin-top', '0');
    });

    // 加载视频名
    $.ajax({
        type: "get",
        url: "./d1.json",
        // data: "data",
        dataType: "json",
        success: function (data) {

            // 解析 data
            console.log(data);
            var data = data;

            // 获取当前视频是第几集
            index = data.number;

            // 加载视频名字
            $('.ysp-player-menu-title span').html(data.series);
            $('.video-name span:eq(0)').html(data.series + ":");
            $('.video-name span:eq(1)').html('第' + data.number + '集');
            $('.video-name span:eq(2)').html(data.name);

            // 初始化播放器的方法，返回播放器的对象
            player = videojs('player', {
                height: 600,
                width: 900,
                controlBar: {
                    volumePanel: {
                        inline: false
                    },
                },
                src: data.url,
                sources: [
                    {
                        src: data.url,
                        type: 'video/mp4'
                    },
                    {
                        src: data.url,
                        type: 'video/webm'
                    },
                    {
                        src: data.url,
                        type: 'video/ogg'
                    },
                    {
                        src: data.url,
                        type: 'video/mkv'
                    }
                ]
            }, function () {
                console.log(this);
                this.poster(data.poster);

                addVideoEvent(this)
            });

        },
        error: function (err) {

        }
    });

    // 加载菜单
    $.ajax({
        type: "get",
        url: "./d2.json",
        dataType: "json",
        success: function (data) {

            // 解析 data
            console.log(data);
            var data = data;

            // 加载视频目录
            for (let i = 0; i < data.length; ++i) {
                loadSeries(data[i], i);
            }

            // 给当前播放的视频添加样式
            $('#cd-timeline .cd-timeline-block:eq(' + (index - 1) + ')').addClass('menu-playing');

            // 修改伪类高度，即垂直线高度
            $('style#timeline').html('#cd-timeline::before { height: ' + ($('#cd-timeline').children().length * 36 - 36) + 'px; }');

        },
        error: function (err) {

        }
    });
});

// 加载目录
function loadSeries(data, i) {

    var name = data.name;
    var state = data.state;
    var duration = data.duration;
    var playClass = "";
    switch (state) {
        case "0":
            playClass = "cd-played";
            break;
        case "1":
            playClass = "cd-play";
            break;
        case "2":
            playClass = "cd-playing";
            break;
        default:
            break;
    }

    if (i < 9) {
        i = '00' + i;
    } else if (i < 99) {
        i = '0' + i;
    }

    var $dom = $(''
        + '<div class="cd-timeline-block" data-url="' + data.url + '">'
        + '<div class="cd-timeline-number">'
        + '<span class="cd-date">' + i + '</span>'
        + '</div>'
        + '<div class="cd-timeline-img ' + playClass + '"></div>'
        + '<div class="cd-timeline-content">'
        + '<span class="cd-date fl">' + name + '</span>'
        + '<span class="cd-date" style="display: none;">' + duration + '</span > '
        + '</div>'
        + '</div>'
    );

    $dom.click(function () {

        // 如果是没看过的视频
        if ($(this).find('.cd-timeline-img').hasClass('play')) {

            // 发送请求修改
            // $.ajax({
            //     type: "method",
            //     url: "url",
            //     data: "data",
            //     dataType: "dataType",
            //     success: function (response) {
            //     }
            // });
        }

        // 改变正在播放的目录项
        $('.menu-playing').removeClass('menu-playing');
        $(this).addClass('menu-playing');

        player.src($dom.attr('data-url'));
        player.poster(data.poster);
        player.load();
    });

    $('#cd-timeline').append($dom);
}

function addVideoEvent(player) {

    // 视频播放时
    player.on('play', function () {
        console.log('play');
    });

    // 视频暂停时时
    player.on('pause', function () {
        console.log('pause');
    });

    // 视频播放结束
    player.on('ended', function () {

        console.log('end');

        // 修改视频播放状态 
        // $.ajax({
        //     type: "post",
        //     url: "url",
        //     data: "data",
        //     dataType: "dataType",
        //     success: function (response) {

        //     }
        // });

        // 自动播放下一集
        if($('.menu-playing').next().length) {
            $('.menu-playing').next().trigger('click');
        } else {
            console.log('没有下一集了');
        }
        
    });
}

// setTimeout(function () {
    //     console.log('time arrived')

    //     player.src('./res/video/popstar.mkv');

    //     player.load();

    //     // 销毁播放器
    //     // player.dispose();

    //     // $('.ysp-player').append($(''

    //     //     + '<video id="player" width="900" height="600" class="video-js vjs-big-play-centered" controls preload="auto"'
    //     //     + 'poster="./res/images/poster.jpg" data-setup="{}">'

    //     //     + '<source src="./res/video/popstar.mkv" type="video/mp4">'
    //     //     + '</source>'
    //     //     + '<source src="./res/video/popstar.mkv" type="video/webm">'
    //     //     + '</source>'
    //     //     + '<source src="./res/video/popstar.mkv" type="video/ogg">'
    //     //     + '</source>'
    //     //     + '<source src="./res/video/popstar.mkv" type="video/mkv">'
    //     //     + '</source>'
    //     //     + '<p class="vjs-no-js">'
    //     //     + 'To view this video please enable JavaScript, and consider upgrading to a web browser that'
    //     //     + '<a href="http://videojs.com/html5-video-support/" target="_blank">'
    //     //     + 'supports HTML5 video'
    //     //     + '</a>'
    //     //     + '</p>'
    //     //     + '</video>'
    //     // ));

    //     // // 重新实例化
    //     // player = videojs('player', {
    //     //     height: 600,
    //     //     width: 900,
    //     //     controlBar: {
    //     //         volumePanel: {
    //     //             inline: false
    //     //         },
    //     //     },
    //     //     src: './res/video/popstar.mkv',
    //     //     sources: [{
    //     //         src: './res/video/popstar.mkv',
    //     //         type: 'video/mp4'
    //     //     }, {
    //     //         src: './res/video/popstar.mkv',
    //     //         type: 'video/webm'
    //     //     }]
    //     // }, function () {
    //     //     console.log(this);
    //     // });

    // }, 3 * 1000);