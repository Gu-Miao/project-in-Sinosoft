var player = null; // 播放器对象
var index = 0; // 当前视频是第几集

$(function () {

    // 初始化折叠按钮
    initToggleButton();

    // 加载视频名
    $.ajax({
        type: "get",
        url: "./data/initPage.json",
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
            $('.video-name span:eq(1)').html(data.name);

            // 初始化播放器的方法，返回播放器的对象
            player = initPlayer(data.url, data.poster);
        },
        error: function (err) {

        }
    });

    // 加载菜单
    $.ajax({
        type: "get",
        url: "./data/initMenu.json",
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

/**
 * 初始化折叠按钮
 */
function initToggleButton() {
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
}

/**
 * 加载目录
 * @param {*} data  数据
 * @param {*} i     索引
 */
function loadSeries(data, i) {

    var name = data.name;
    var state = data.state;
    var duration = data.duration;
    var playClass = "";
    switch (state) {
        case "0":
            playClass = "cd-play";
            break;
        case "1":
            playClass = "cd-played";
            break;
        case "2":
            playClass = "cd-finish";
            break;
        default:
            break;
    }

    // 格式化序号
    if (i < 9) {
        i = '00' + i;
    } else if (i < 99) {
        i = '0' + i;
    }

    // 声明 html 元素
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

        var $this = $(this);

        // 如果是没看过的视频
        if ($this.find('.cd-timeline-img').hasClass('cd-play')) {

            // 发送请求修改视频状态
            $.ajax({
                type: "get",
                url: "./data/changeVideoState.json",
                // data: "data",
                dataType: "json",
                success: function (data) {
                    if (data.flag == 1) {
                        $this.find('.cd-timeline-img').removeClass('cd-play').addClass('cd-played');
                    }
                },
                error: function (err) {

                }
            });
        }

        // 改变正在播放的目录项
        $('.menu-playing').removeClass('menu-playing');
        $(this).addClass('menu-playing');

        // 重新初始化播放器
        player = changeVideoSrc($dom.attr('data-url'), data.poster);
    });

    $('#cd-timeline').append($dom);
}

/**
 * 初始化播放器
 * @param {*} player 
 */
function initPlayer(src, poster) {
    return videojs('player', {
        height: 600,
        width: 900,
        controlBar: {
            volumePanel: {
                inline: false
            },
        },
        src: src,
        sources: [
            {
                src: src,
                type: 'video/mp4'
            },
            {
                src: src,
                type: 'video/webm'
            },
            {
                src: src,
                type: 'video/ogg'
            },
            {
                src: src,
                type: 'video/mkv'
            },
            {
                src: src,
                type: 'video/avi'
            }
        ]
    }, function () {
        console.log(this);
        this.poster(poster);

        addVideoEvent(this);
    });
}

/**
 * 给播放器添加事件
 * @param {*} player 
 */
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
        var $menuState = $('.menu-playing .cd-timeline-img');

        if (!$menuState.hasClass('cd-finish')) {

            // 修改视频播放状态 
            $.ajax({
                type: "get",
                url: "../../data/playEnd.json",
                // data: "data",
                dataType: "json",
                success: function (data) {

                    if (data.flag == 1) {

                        // 修改播放状态
                        $menuState.removeAttr('class');
                        $menuState.attr('class', 'cd-timeline-img cd-finish');
                    }
                }
            });
        }

        // 自动播放下一集
        if ($('.menu-playing').next().length) {
            var $content = ''
                + '<div class="next">'
                + '<span>ｘ</span>'
                + '<span>5秒后播放下一集</span>'
                + '<button>立即播放</button>'
                + '</div>';

            //询问框
            layer.open({
                type: 1,
                content: $content,
                title: false,
                shade: 0,
                closeBtn: 0,
                area: ['200px', '30px'],
                resize: false,
                offset: ['528px', '5px'],
                success: function ($dom, index) {

                    var time = 4;

                    // 位置
                    $dom.css('position', 'relative');
                    $('div.video-js').append($dom);

                    // 5秒倒计时
                    var timer = setInterval(function () {
                        $dom.find('.next span:eq(1)').html(time + '秒后播放下一集');
                        time--;
                        if (time === -1) {
                            $('.menu-playing').next().trigger('click');
                            layer.close(index);
                        }
                    }, 1000);

                    // 关闭按钮
                    $dom.find('.next span:eq(0)').click(function () {
                        clearInterval(timer)
                        layer.close(index);
                    });

                    // 立即播放
                    $dom.find('.next button').click(function () {
                        clearInterval(timer)
                        $('.menu-playing').next().trigger('click');
                        layer.close(index);
                    });
                }
            });
        } else {
            console.log('没有下一集了');
        }
    });
}

/**
 * 修改视频地址
 * @param {*} src 视频地址
 * @param {*} poster 封面地址
 */
function changeVideoSrc(src, poster) {

    // 销毁播放器
    player.dispose();

    $('.ysp-player').append($(''

        + '<video id="player" width="900" height="600" class="video-js vjs-big-play-centered" controls preload="auto"'
        + 'poster="./res/images/poster.jpg" data-setup="{}">'

        + '<source src="./res/video/popstar.mkv" type="video/mp4">'
        + '</source>'
        + '<source src="./res/video/popstar.mkv" type="video/webm">'
        + '</source>'
        + '<source src="./res/video/popstar.mkv" type="video/ogg">'
        + '</source>'
        + '<source src="./res/video/popstar.mkv" type="video/mkv">'
        + '</source>'
        + '<p class="vjs-no-js">'
        + 'To view this video please enable JavaScript, and consider upgrading to a web browser that'
        + '<a href="http://videojs.com/html5-video-support/" target="_blank">'
        + 'supports HTML5 video'
        + '</a>'
        + '</p>'
        + '</video>'
    ));

    // 重新实例化
    return initPlayer(src, poster);
}
