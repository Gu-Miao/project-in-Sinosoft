// 进入全屏
function launchFullscreen(element) {
    // 此方法不可以在异步任务中执行，否则火狐无法全屏
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.oRequestFullscreen) {
        element.oRequestFullscreen();
    }
    else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen();
    } else {

        var docHtml = document.documentElement;
        var docBody = document.body;
        var videobox = document.getElementById('videobox');
        var cssText = 'width:100%;height:100%;overflow:hidden;';
        docHtml.style.cssText = cssText;
        docBody.style.cssText = cssText;
        videobox.style.cssText = cssText + ';' + 'margin:0px;padding:0px;';
        document.IsFullScreen = true;
    }
}
// 退出全屏
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
        console.log("exit");
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.oRequestFullscreen) {
        document.oCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else {
        var docHtml = document.documentElement;
        var docBody = document.body;
        var videobox = document.getElementById('videobox');
        docHtml.style.cssText = "";
        docBody.style.cssText = "";
        videobox.style.cssText = "";
        document.IsFullScreen = false;
    }
}

// 视频会在 5 秒后自动检测是否为全屏，若是，则退出全屏（请勿开启页面内开发者工具）
document.getElementById('video').onplay = function () {
    if (!t) {
        var t = setTimeout(function () {

            // 检查浏览器是否处于全屏
            console.log(document.IsFullScreen);
            if (checkFull()) {
                exitFullscreen();
                console.log(1);
            }
            document.getElementById('video').pause();
        }, 5 * 1000);
    }
}

function checkFull() {
    //使用html5中的API判断是否全屏(返回当前全屏的元素)
    var FullEl = document.fullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement;

    //若是不支持Html5中的API，可以使用以最原始的判断方式，但需要将页面的滚动条去掉
    if (FullEl === null) {
        return isFullscreenForNoScroll();
    }

    return true;
}

/**
 * 支持无滚动条的页面以 Fullscreen api启动的全屏 或是 按f11启动的全屏
 * 不支持有滚动条的页面
 * @returns {boolean}
 */
function isFullscreenForNoScroll() {
    var explorer = window.navigator.userAgent.toLowerCase();
    if (explorer.indexOf('chrome') > 0) {//webkit
        if (document.body.scrollHeight === window.screen.height && document.body.scrollWidth === window.screen.width) {
            console.log("全屏");
            return true;
        } else {
            console.log("不全屏");
            return false;
        }
    } else {//IE 9+  fireFox
        if (window.outerHeight === window.screen.height && window.outerWidth === window.screen.width) {
            console.log("全屏");
            return true;
        } else {
            console.log("不全屏");
            return false;
        }
    }
}