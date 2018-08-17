$(function() {


    // 初始化座位画布
    initSeatCanvas(seatData, "t1");
    initSeatCanvas(seatData, "t2");
    initSeatCanvas(seatData, "t3");

    var seatCanvas = $(".seat-canvas");

    $(seatCanvas).click(clickCanvas);
    $(seatCanvas).mousemove(changePointer);
    $(seatCanvas).mouseout(function() {
        $("body").css("cursor", "default");
    });

    /*
    ** 渲染画布
    ** @data    { object }  传入的数据
    ** @target  { string }  目标画布
    */
    function initSeatCanvas(data, target) {

        // 获取 canvas
        var canvas = $("canvas")[target.split("t")[1]-1];
        canvas.width = data[target].width;
        canvas.height = data[target].height;
        var ctx = canvas.getContext("2d");
    
        // // 初始化标题
        // ctx.fillStyle = '#ccc';
        // ctx.font = "bold 14px '字体','字体','微软雅黑','宋体'";
        // ctx.textBaseline = 'hanging';
        // ctx.fillText('左侧区: 座位号13~29(奇数)' ,19 ,17);

        var ss = {};
    
        for(let i = 0; i <= 5; ++i) {
            ss["ss"+i] = new Image();
            ss["ss"+i].src = "images/ss" + i + ".png";
        }

        ss.ss5.onload = function() {
            for(let i = 0; i < seatData[target].row; ++i) {
                for(let j = 0; j < seatData[target].col; ++j) {
                    var img = ss["ss"+data[target].seats[i][j].state];
                    ctx.drawImage(img, 0, 0, img.width, img.height, seatData[target].firstPadding.x+i*(seatData.seatSize.width+seatData[target].seatMargin.x), seatData[target].firstPadding.y+j*(seatData.seatSize.height+seatData[target].seatMargin.y), seatData.seatSize.width, seatData.seatSize.width);
                }
            }
        }
    }

    /*
    ** 鼠标在座位上划过时改变指针样式
    **  @event event对象
    */
    function changePointer(event) {

        var target = getCanvasIndex(event);

        if(isOnSeat(event.offsetX, event.offsetY, target)) {
            $("body").css("cursor", "pointer");
        } else {
            $("body").css("cursor", "default");
        }
    }

    /*
    ** 点击画布的回调函数
    ** @event event对象
    */
    function clickCanvas(event) {

        var target = getCanvasIndex(event);

        if(isOnSeat(event.offsetX, event.offsetY, target)){
            var position = getSeatPosition(event.offsetX, event.offsetY, target);
            var state = seatData[target].seats[position.row-1][position.col-1].state;
            console.log(state%2);
            if(state%2) {
                state--;
            } else {
                state++;
            }

            addCheckedInfo(position, state, ".selected-box");
            checkSeat(position, state, target);

        } else {
            console.log("没有点中座位");
        }
    }

    /*
    ** 判断鼠标是否在座位上
    ** @x: 鼠标在画布中的横坐标
    ** @y: 鼠标在画布中的纵坐标
    ** @target 目标画布
    ** @return true: 在座位上, false: 不在座位上
    */
    function isOnSeat(x, y, target) {
        for(let i = 0; i < seatData[target].row; ++i) {
            if(x >= seatData[target].firstPadding.x+i*(seatData.seatSize.width+seatData[target].seatMargin.x) && x <= (seatData[target].firstPadding.x+seatData.seatSize.width)+i*(seatData.seatSize.width+seatData[target].seatMargin.x)) {
                for(let j = 0; j < seatData[target].col; ++j) {
                    if(y >= seatData[target].firstPadding.y+j*(seatData.seatSize.height+seatData[target].seatMargin.y) && y <= (seatData[target].firstPadding.y+seatData.seatSize.height)+j*(seatData.seatSize.height+seatData[target].seatMargin.y)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
    
    /*
    ** 获取座位位置
    ** @x: 鼠标在画布中的横坐标
    ** @y: 鼠标在画布中的纵坐标
    ** @target 画布序号
    ** @return 包含位置信息的对象
    */
    function getSeatPosition(x, y, target) {
        let row = 0, col = 0;
        row = Math.ceil((x-seatData[target].firstPadding.x)/(seatData.seatSize.width+seatData[target].seatMargin.x));
        col = Math.ceil((y-seatData[target].firstPadding.y)/(seatData.seatSize.height+seatData[target].seatMargin.y));

        return {
            row: row,
            col: col
        }
    }

    /*
    ** 判断座位状态, 修改数据中的座位的状态码
    ** @position 座位的行列信息
    ** @state 座位的状态码
    ** @target 更改的座位表
    */
    function checkSeat(position, state, target) {
        var canvas = $("canvas")[target.split("t")[1]-1];
        var ctx = canvas.getContext("2d");

        // 修改数据中的座位的状态码
        seatData[target].seats[position.row-1][position.col-1].state = state;

        // 清除需要替换的区域
        ctx.clearRect(seatData[target].firstPadding.x+(position.row-1)*(seatData.seatSize.width+seatData[target].seatMargin.x), seatData[target].firstPadding.y+(position.col-1)*(seatData.seatSize.height+seatData[target].seatMargin.y), seatData.seatSize.width, seatData.seatSize.height);

        // 重新渲染
        var img = new Image();
        img.src = "images/ss" + state + ".png";
        img.onload = function() {
            ctx.drawImage(img, 0, 0, img.width, img.height, seatData[target].firstPadding.x+(position.row-1)*(seatData.seatSize.width+seatData[target].seatMargin.x), seatData[target].firstPadding.y+(position.col-1)*(seatData.seatSize.height+seatData[target].seatMargin.y), seatData.seatSize.width, seatData.seatSize.height);
        }
    }

    /*
    ** 修改选中的座位信息
    ** @position 座位的行列信息
    ** @state 座位的状态码
    ** @target 座位信息容器
    */
    function addCheckedInfo(position, state, target) {
        var $target = $(target);
        if(state%2) { // 改为选中
            if($target.find(".selected:eq(0)").html() === "未选择座位") {
                $target.find(".selected").remove();
            }
            $target.append('<span class="selected">' + position.col + '排' + position.row +'座</span>');
        } else { // 取消选中
            $target.find(".selected:eq(-1)").remove();
            if(!$target.find(".selected").length) {
                $target.append('<span class="selected">未选择座位</span>');
            }
        }
    }

    /*
    ** 获取画布序号
    ** @event event对象
    ** @return 画布序号
    */
    function getCanvasIndex(event) {
        if($(event.target).index() == 1) {
            return "t1";
        } else if($(event.target).index() == 3) {
            return "t2";
        } else if($(event.target).index() == 5) {
            return "t3";
        }

        return "";
    }
});