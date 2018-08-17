$(function() {


    initCanvas(seatData, ".seating-canvas-left");

    var canvas = $("canvas");

    $(canvas).click(clickCanvas);
    $(canvas).mousemove(changePointer);
    $(canvas).mouseout(function() {
        $("body").css("cursor", "default");
    });

    /*
    ** 渲染画布
    ** @data 传入的数据
    */
    function initCanvas(data, target) {

        // 获取 canvas
        var canvas = $(target)[0];
        canvas.width = data.t1.width;
        canvas.height = data.t1.height;
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
            for(let i = 0; i < seatData.t1.row; ++i) {
                for(let j = 0; j < seatData.t1.col; ++j) {
                    var img = ss["ss"+data.t1.seats[i][j].state];
                    ctx.drawImage(img, 0, 0, img.width, img.height, seatData.t1.firstPadding.x+i*(seatData.seatSize.width+seatData.t1.seatMargin.x), seatData.t1.firstPadding.y+j*(seatData.seatSize.height+seatData.t1.seatMargin.y), seatData.seatSize.width, seatData.seatSize.width);
                }
            }
        }
    }

    /*
    ** 鼠标在座位上划过时改变指针样式
    **  @event event对象
    */
    function changePointer(event) {
        if(isOnSeat(event.offsetX, event.offsetY)) {
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
        if(isOnSeat(event.offsetX, event.offsetY)){
            var position = getSeatPosition(event.offsetX, event.offsetY);
            var state = seatData.t1.seats[position.row-1][position.col-1].state;
            console.log(state%2);
            if(state%2) {
                state--;
            } else {
                state++;
                
            }

            addCheckedInfo(position, state, ".selected-box");
            checkSeat(position, state, 1);

        } else {
            console.log("没有点中座位");
        }
    }

    /*
    ** 判断鼠标是否在座位上
    ** @x: 鼠标在画布中的横坐标
    ** @y: 鼠标在画布中的纵坐标
    ** @return true: 在座位上, false: 不在座位上
    */
    function isOnSeat(x, y) {
        for(let i = 0; i < seatData.t1.row; ++i) {
            if(x >= seatData.t1.firstPadding.x+i*(seatData.seatSize.width+seatData.t1.seatMargin.x) && x <= (seatData.t1.firstPadding.x+seatData.seatSize.width)+i*(seatData.seatSize.width+seatData.t1.seatMargin.x)) {
                for(let j = 0; j < seatData.t1.col; ++j) {
                    if(y >= seatData.t1.firstPadding.y+j*(seatData.seatSize.height+seatData.t1.seatMargin.y) && y <= (seatData.t1.firstPadding.y+seatData.seatSize.height)+j*(seatData.seatSize.height+seatData.t1.seatMargin.y)) {
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
    ** @return 包含位置信息的对象
    */
    function getSeatPosition(x, y) {
        let row = 0, col = 0;
        row = Math.ceil((x-16)/38);
        col = Math.ceil((y-39)/43);

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
        var canvas = $("canvas")[target-1];
        var ctx = canvas.getContext("2d");

        // 修改数据中的座位的状态码
        seatData["t"+target].seats[position.row-1][position.col-1].state = state;

        ctx.clearRect(16+(position.row-1)*38, 39+(position.col-1)*43, 32, 32);
        var img = new Image();
        img.src = "images/ss" + state + ".png";
        img.onload = function() {
            ctx.drawImage(img, 0, 0, img.width, img.height, 16+(position.row-1)*38, 39+(position.col-1)*43, 32, 32);
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
            $target.append('<span class="selected">' + position.row + '排' + position.col +'座</span>');
        } else { // 取消选中
            $target.find(".selected:eq(-1)").remove();
            if(!$target.find(".selected").length) {
                $target.append('<span class="selected">未选择座位</span>');
            }
        }
    }

    /*
    ** 获取选中的座位
    ** 
    */
});