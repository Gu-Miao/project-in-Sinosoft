$(function() {

    fetch("../data.json", { method: "get" }).then(function(res) {
        res.text().then(function(data) {
            seatData = JSON.parse(data);

            for(let i = 0; i < data.length; ++i) {
                for(let j = 0; j < data[i].length; ++j) {
                    loadData(data[i][j]);
                }
            }
    
            // 初始化座位画布
            initSeatCanvas("t1");
            initSeatCanvas("t2");
            initSeatCanvas("t3");
    
            // 初始化座位序号画布
            initSeatNumberSideCanvas();
            initSeatNumberBottomCanvas();
    
            var seatCanvas = $(".seat-canvas");
    
            // 给画布绑定事件方法
            $(seatCanvas).click(clickCanvas);
            $(seatCanvas).mousemove(changePointer);
            $(seatCanvas).mouseout(function() {
                $("body").css("cursor", "default");
            });
    
            // 给按钮绑定事件方法
            $('.seating-menu-content button:eq(0)').click(manualSortTip);
            $('.seating-menu-content button:eq(2)').click(reserveTip);
            $('.seating-menu-content button:eq(3)').click(cancelReserveTip);
            $('.seating-menu-content button:eq(4)').click(resetTip);
            $('.modal-dialog-tip [data-func="publishTip"]').click(publish);
            $('.modal-dialog-tip [data-func="manualSortTip"]').click(initManualSortPanel);
            $('.modal-dialog-tip [data-func="reserveTip"]').click(reserve);
            $('.modal-dialog-tip [data-func="cancelReserveTip"]').click(cancelReserve);
            $('.modal-dialog-tip [data-func="resetTip"]').click(reset);
            $('.manual-sort-bottom button:eq(0)').click(manualSortSubmit);
        });
    });

    // // 同步请求
    // $.ajaxSetup({ 
    //     async : false 
    // });

    // // 获取数据
    // $.getJSON("https://gu-miao.github.io/project-in-Sinosoft/../data.json", function(data) {
    //     // seatData = data;
    //     for(let i = 0; i < data.length; ++i) {
    //         for(let j = 0; j < data[i].length; ++j) {
    //             loadData(data[i][j]);
    //         }
    //     }

    //     // 初始化座位画布
    //     initSeatCanvas("t1");
    //     initSeatCanvas("t2");
    //     initSeatCanvas("t3");

    //     // 初始化座位序号画布
    //     initSeatNumberSideCanvas();
    //     initSeatNumberBottomCanvas();

    //     var seatCanvas = $(".seat-canvas");

    //     // 给画布绑定事件方法
    //     $(seatCanvas).click(clickCanvas);
    //     $(seatCanvas).mousemove(changePointer);
    //     $(seatCanvas).mouseout(function() {
    //         $("body").css("cursor", "default");
    //     });

    //     // 给按钮绑定事件方法
    //     $('.seating-menu-content button:eq(0)').click(manualSortTip);
    //     $('.seating-menu-content button:eq(2)').click(reserveTip);
    //     $('.seating-menu-content button:eq(3)').click(cancelReserveTip);
    //     $('.seating-menu-content button:eq(4)').click(resetTip);
    //     $('.modal-dialog-tip [data-func="publishTip"]').click(publish);
    //     $('.modal-dialog-tip [data-func="manualSortTip"]').click(initManualSortPanel);
    //     $('.modal-dialog-tip [data-func="reserveTip"]').click(reserve);
    //     $('.modal-dialog-tip [data-func="cancelReserveTip"]').click(cancelReserve);
    //     $('.modal-dialog-tip [data-func="resetTip"]').click(reset);
    //     $('.manual-sort-bottom button:eq(0)').click(manualSortSubmit);
    // });

    /*
    ** 加载数据
    ** @seat    { Object }  座位数据
    */
    function loadData(seat) {
        var row = convertColToCanvas(seat.col).row;
        var col = seat.row-1;
        var target = convertColToCanvas(seat.col).target;

        if(!seatData[target].seats[row]) { seatData[target].seats[row] = []; }

        seatData[target].seats[row][col] = {
            state: seat.state,
            owner: seat.owner
        };
    }

    /*
    ** 渲染画布
    ** @target  { string }  目标画布
    */
    function initSeatCanvas(target) {

        // 获取 canvas
        var canvas = $(".seat-canvas")[target.split("t")[1]-1];

        if($(canvas).length === 0) {
            return null;
        }

        canvas.width = seatData[target].width;
        canvas.height = seatData[target].height;
        var ctx = canvas.getContext("2d");
    
        // 初始化标题
        ctx.fillStyle = '#ccc';
        ctx.font = "bold 14px '字体','字体','微软雅黑','宋体'";
        ctx.textBaseline = 'hanging';
        ctx.fillText(seatData[target].text, seatData[target].textPosition.x, seatData[target].textPosition.y);

        var ss = {};
    
        for(let i = 0; i <= 5; ++i) {
            ss["ss"+i] = new Image();
            ss["ss"+i].src = "images/ss" + i + ".png";
        }

        ss.ss5.onload = function() {
            for(let i = 0; i < seatData[target].row; ++i) {
                for(let j = 0; j < seatData[target].col; ++j) {
                    var img = ss["ss"+seatData[target].seats[i][j].state];
                    ctx.drawImage(img, 0, 0, img.width, img.height, seatData[target].firstPadding.x+i*(seatData.seatSize.width+seatData[target].seatMargin.x), seatData[target].firstPadding.y+j*(seatData.seatSize.height+seatData[target].seatMargin.y), seatData.seatSize.width, seatData.seatSize.width);
                }
            }
        }
    }

    /* 
    ** 初始化左侧座位序号画布
    */
    function initSeatNumberSideCanvas() {

        var canvas = $('.seating-seatnumber-side')[0];

        // 获取 canvas
        canvas.width = seatData.s1.width;
        canvas.height = seatData.s1.height;
        var ctx = canvas.getContext("2d");

        // 设置字体样式
        ctx.fillStyle = '#fff';
        ctx.textAlign = "center";
        ctx.font = "bold 14px '微软雅黑'";
        ctx.textBaseline = 'middle';
        

        for(let i = 0; i < seatData.s1.length; ++i) {
            ctx.roundRect(seatData.s1.firstPadding.x, seatData.s1.firstPadding.y+i*seatData.s1.margin, seatData.seatSize.width, seatData.seatSize.height, 7, "#ccc", "fill");
            ctx.fillText(i+1 , seatData.s1.firstPadding.x+(seatData.seatSize.width/2), seatData.s1.firstPadding.y+(seatData.seatSize.height/2)+i*seatData.s1.margin);
        }
    }

    /* 
    ** 初始化底部座位序号画布
    */
    function initSeatNumberBottomCanvas() {

        var canvas = $('.seating-seatnumber-bottom')[0];

        // 获取 canvas
        canvas.width = seatData.s2.width;
        canvas.height = seatData.s2.height;
        var ctx = canvas.getContext("2d");

        // 设置字体样式
        ctx.fillStyle = '#fff';
        ctx.textAlign = "center";
        ctx.font = "bold 14px '微软雅黑'";
        ctx.textBaseline = 'middle';

        var count = 27;
        for(let i = 1; i <= 3; ++i) {
            for(let j = 0; j < seatData.s2["p"+i].length; ++j) {
                ctx.roundRect(seatData.s2["p"+i].firstPadding.x+j*seatData.s2.margin, seatData.s2["p"+i].firstPadding.y, seatData.seatSize.width, seatData.seatSize.height, 7, "#ccc", "fill");
                ctx.fillText(count, seatData.s2["p"+i].firstPadding.x+(seatData.seatSize.width/2)+j*seatData.s2.margin, seatData.s2["p"+i].firstPadding.y+(seatData.seatSize.height/2));
                if(count%2 && count !== 1) {
                    count -= 2;
                } else if(count === 1) {
                    count++;
                } else {
                    count += 2;
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

            addCheckedInfo(position, state, target);
            checkSeat(position, state, target);

        } else {
            console.log("没有点中座位");
        }
    }

    /*
    ** 判断鼠标是否在座位上
    ** @x       { Number }      鼠标在画布中的横坐标
    ** @y       { Number }      鼠标在画布中的纵坐标
    ** @target  { String }      目标画布
    ** @return  { Boolean }     true: 在座位上, false: 不在座位上
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
    ** @x       { Number }      鼠标在画布中的横坐标
    ** @y       { Number }      鼠标在画布中的纵坐标
    ** @target  { String }      目标画布
    ** @return  { Object }     包含位置信息的对象
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
    ** 判断座位状态, 修改数据中的座位的状态码, 重新渲染画布相应位置
    ** @position    { Object }      座位的行列信息
    ** @state       { Number }      座位的状态码
    ** @target      { String }      目标画布
    */
    function checkSeat(position, state, target) {

        // console.log(position, target, state);

        var canvas = $(".seat-canvas")[target.split("t")[1]-1];
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
    ** 显示选中的座位信息
    ** @position    { Object }      座位的行列信息
    ** @state       { Number }      座位的状态码
    ** @target      { String }      画布序号
    */
    function addCheckedInfo(position, state, target) {
        var $target = $(".selected-box");
        if(state%2) { // 改为选中
            if($target.find(".selected:eq(0)").html() === "未选择座位") {
                $target.find(".selected").remove();
            }
            $target.append('<span class="selected" data-select="' + (position.row-1) + '-' + (position.col-1) + '-' + target.split("t")[1] +'">' + position.col + '排' + convertColToAll(position.row-1, target) +'座</span>');
        } else { // 取消选中
            $target.find('[data-select="' + (position.row-1) + '-' + (position.col-1) + '-' + target.split("t")[1] +'"]').remove();
            if(!$target.find(".selected").length) {
                $target.append('<span class="selected">未选择座位</span>');
            }
        }
    }

    /*
    ** 获取画布序号
    ** @event   { Object }      event对象
    ** @return  { String }      目标画布
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

    /*
    ** 画布中的列数转换成总体列数
    ** @row     { Number }      画布中的列数
    ** @target  { String }      画布序号
    ** @return  { Number }      总体列数
    */
    function convertColToAll(row, target) {
        if(target === "t1") {
            return 27-row*2;
        } else if(target === "t2") {
            if(row >= 0 && row < 5) {
                return 11-row*2;
            } else if(row === 5) {
                return 1;
            } else {
                return 2+(row-6)*2;
            }
        } else if(target === "t3") {
            return 12+row*2;
        }

        return null;
    }

    /*
    ** 总体列数转换成画布中的列数
    ** @col     { Number }      总体列数
    ** @return  { Object }      画布序号, 画布中的列数
    */
    function convertColToCanvas(col) {
        if(col%2 && col >=13 && col <=27) {
            return {
                target: "t1",
                row: (27-col)/2
            }
        } else if(!(col%2) && col >= 12 && col <=26) {
            return {
                target: "t3",
                row: (col-12)/2
            }
        } else if(col >= 1 && col <= 11) {
            if(col%2) {
                return {
                    target: "t2",
                    row: (11-col)/2
                }
            } else {
                return {
                    target: "t2",
                    row: (col-2)/2+6
                }
            }
        }

        return null;
    }

    /*
    ** 是否有座位被选中
    ** @return  { Object }  如果有元素被选中，返回一个包含位置和状态的对象，否则返回 null
    */
    function isSeatSelected() {

        var selected = $(".selected-box .selected");

        var selectedObj = {};
        selectedObj.isReserved = 0;
        selectedObj.length = 0;

        if(selected.length === 1 && selected.html() === "未选择座位") {
            console.log("未选择座位");
            return selectedObj;
        }
        
        for(let i = 0; i < selected.length; ++i, ++selectedObj.length) {
            var row = Number($(selected[i]).html().split("排")[0]);
            var col = convertColToCanvas(Number($(selected[i]).html().split("排")[1].split("座")[0])).row;
            var target = convertColToCanvas(Number($(selected[i]).html().split("排")[1].split("座")[0])).target;

            var state = seatData[target].seats[col][row-1].state;

            var position = {
                row: col+1,
                col: row
            }

            if(state === 5) { selectedObj.isReserved = 1; }

            selectedObj[i] = { position: position, state: state, target: target };
        }

        return selectedObj;
    }

    /*
    ** 判断座位是否已经被占有
    ** @positionText { String }  位置描述
    ** @return       { Object }  若座位被占有，返回一个带有位置和占有者的对象，否则返回 null
    */
    function isSeatHasOwner(positionText) {
        var row = Number(positionText.split("排")[0]);
        var col = convertColToCanvas(Number(positionText.split("排")[1].split("座")[0])).row;
        var target = convertColToCanvas(Number(positionText.split("排")[1].split("座")[0])).target;
        
        var state = seatData[target].seats[col][row-1].state;

        console.log(col, row-1, target, state);
        if(state === 3) {
            return {
                position: {
                    row: col+1,
                    col: row
                },
                target: target,
                owner: seatData[target].seats[col][row-1].owner
            }
        }

        return null;
    }

    /*
    ** 判断员工是否有座位
    ** @name    { String }  员工姓名
    ** @return  { Ojbect }  若有，返回座位的位置信息，否则返回 null
    */
    function isWorkerHasSeat(name) {
        for(let i = 1; i <= 3; ++i) {
            var target = "t" + i;
            for(let j = 0; j < seatData[target].seats.length; ++j) {
                for(let k = 0; k < seatData[target].seats[j].length; ++k) {
                    if(seatData[target].seats[j][k].state === 2 || seatData[target].seats[j][k].state === 3) {
                        if(name === seatData[target].seats[j][k].owner) {
                            return {
                                position: {
                                    row: j,
                                    col: k
                                },
                                target: target
                            };
                        }
                    }
                }
            }
        }

        return null;
    }
    
    /*
    ** 显示手动排序提示框
    ** 并根据当前选中的座位修改提示框的样式和提示信息
    */
    function manualSortTip() {

        // 获取 DOM 节点
        var tipDiv = $("#manualSortTip .modal-dialog-tip");
        var tipHeader = tipDiv.find(".modal-header");
        var tipBody = tipDiv.find(".modal-body");
        var tipFooter = tipDiv.find(".modal-footer");

        if(isSeatSelected().length) {
            tipHeader.removeClass("bg-danger").removeClass("text-danger");
            tipBody.find("span").html("您是否要对当前座位手动排座？");
            tipFooter.find(".hide").removeClass("hide");
        } else {
            tipHeader.addClass("bg-danger").addClass("text-danger");
            tipBody.find("span").html("您未选择座位！请选择后重试。");
            tipFooter.find('[data-func="reserve"]').addClass("hide");
        }
    }

    /*
    ** 显示预留提示框
    ** 并根据当前选中的座位修改提示框的样式和提示信息
    */
    function reserveTip() {

        // 获取 DOM 节点
        var tipDiv = $("#reserveTip .modal-dialog-tip");
        var tipHeader = tipDiv.find(".modal-header");
        var tipBody = tipDiv.find(".modal-body");
        var tipFooter = tipDiv.find(".modal-footer");

        if(isSeatSelected().length) {
            tipHeader.removeClass("bg-danger").removeClass("text-danger");
            tipBody.find("span").html("您是否要预留当前座位？");
            tipFooter.find(".hide").removeClass("hide");
        } else {
            tipHeader.addClass("bg-danger").addClass("text-danger");
            tipBody.find("span").html("您未选择座位！请选择后重试。");
            tipFooter.find('[data-func="reserve"]').addClass("hide");
        }
    }

    /*
    ** 显示取消预留提示框
    ** 并根据当前选中的座位修改提示框的样式和提示信息
    */
    function cancelReserveTip() {

        // 获取 DOM 节点
        var tipDiv = $("#cancelReserveTip .modal-dialog-tip");
        var tipHeader = tipDiv.find(".modal-header");
        var tipBody = tipDiv.find(".modal-body");
        var tipFooter = tipDiv.find(".modal-footer");

        if(isSeatSelected().isReserved) {
            tipHeader.removeClass("bg-danger").removeClass("text-danger");
            tipBody.find("span").html("您是否要取消当前预留座位？");
            tipFooter.find(".hide").removeClass("hide");
        } else {
            tipHeader.addClass("bg-danger").addClass("text-danger");
            tipBody.find("span").html("您未选择预留的座位！请选择后重试。");
            tipFooter.find('[data-func="cancelReserve"]').addClass("hide");
        }
    }

    /*
    ** 显示重置提示框
    ** 并根据当前选中的座位修改提示框的样式和提示信息
    */
    function resetTip() {

        // 获取 DOM 节点
        var tipDiv = $("#resetTip .modal-dialog-tip");
        var tipHeader = tipDiv.find(".modal-header");
        var tipBody = tipDiv.find(".modal-body");
        var tipFooter = tipDiv.find(".modal-footer");

        if(isSeatSelected().length) {
            tipHeader.removeClass("bg-danger").removeClass("text-danger");
            tipBody.find("span").html("您是否要重置当前座位？");
        } else {
            tipHeader.addClass("bg-danger").addClass("text-danger");
            tipBody.find("span").html("您是否要重置所有座位？");
        }
    }

    /*
    ** 初始化手动排序面板
    **/
    function initManualSortPanel() {

        console.log(seatData);

        var selected = $(".selected-box .selected");
        $('.manual-sort-left').empty();
        $('.manual-sort-right').empty();

        for(let i = 0; i < selected.length; ++i) {
            $('.manual-sort-left').append($('<div class="ms-selected" data-active="0" data-worker-text=""><span>' + $(selected[i]).html() + '</span><br><span></span></div>'));
            
            if(isSeatHasOwner($(selected[i]).html())) {
                $('.manual-sort-left .ms-selected:eq(' + i + ') span:eq(1)').html(isSeatHasOwner($(selected[i]).html()).owner);
                $('.manual-sort-left .ms-selected:eq(' + i + ')').attr("data-worker-text", isSeatHasOwner($(selected[i]).html()).owner);
            }
        }

        for(let i = 0; i < 30; ++i) {
            var name = rdName();
            $('.manual-sort-right').append($(''
                +'<div class="ms-worker-list" data-active="0" data-seat-text="">'
                    +'<div class="mswl-start">'
                         +'<img src="images/header.jpg">'
                    +'</div>'
                    +'<div class="mswl-center">'
                        +'<h3>' + name + '</h3>'
                        +'<p>工作时间：2018-07-23~至今</p>'
                        +'<p>所属部门：省局——直属单位</p>'
                    +'</div>'
                    +'<div class="mswl-end">'
                        +'<span></span>'
                    +'</div>'
                +'</div>'));
            if(isWorkerHasSeat(name)) {
                var a = isWorkerHasSeat(name);
                var row = convertColToAll(a.position.row, a.target);
                var col = a.position.col+1;

                $('.manual-sort-right .ms-worker-list:eq(' + i + ') .mswl-end span').html(col + "排" + row + "座");
                $('.manual-sort-right .ms-worker-list:eq(' + i + ')').attr("data-seat-text", col + "排" + row + "座");

            }
        }

        $('.ms-selected').click(manualSort);
        $('.ms-worker-list').click(manualSort);
    }

    /*
    ** 手动排序
    */
    function manualSort() {

        if($(this).attr("class") === "ms-selected") {

            // 将选中项激活，其他项不激活
            $('.ms-selected').attr("data-active", 0);
            $('.ms-selected').removeClass("left-selected");
            $(this).attr("data-active", 1);
            $(this).addClass("left-selected");

            // 判断右侧是否有激活项
            if($('.manual-sort-right').find('[data-active="1"]').length) {

                for(let i = 0; i < $('.ms-worker-list').length; ++i) {

                    // 遍历人名，查找是否有人已经占有此座位
                    if($('.ms-worker-list:eq(' + i + ') .mswl-end span:eq(0)').html() == $(this).find('span:eq(0)').html()) {

                        // 判断右侧激活项人员原本是否有座位，若有，进行“还座”操作
                        if($('.ms-worker-list:eq(' + i + ')').attr("data-seat-text")) {
                            $('.ms-worker-list:eq(' + i + ') .mswl-end span:eq(0)').html($('.ms-worker-list:eq(' + i + ')').attr("data-seat-text"));
                        } else {
                            $('.ms-worker-list:eq(' + i + ') .mswl-end span:eq(0)').html("");
                        }
                    }
                }

                for(let i = 0; i < $('.ms-selected').length; ++i) {

                    // 遍历座位，查找右侧激活项人员是否已经拥有座位
                    if($('.ms-selected:eq(' + i + ') span:eq(1)').html() === $('.manual-sort-right [data-active="1"] .mswl-center h3').html()) {
                        
                        // 判断左侧激活项座位原本是否有人占，若有，进行“还座”操作
                        if($('.ms-selected:eq(' + i + ')').attr("data-worker-text")) {
                            $('.ms-selected:eq(' + i + ') span:eq(1)').html($('.ms-selected:eq(' + i + ')').attr("data-worker-text"));
                        } else {
                            $('.ms-selected:eq(' + i + ') span:eq(1)').html("");
                        }
                    }
                }

                // 占座，并将所有项变为不激活状态
                $(this).find('span:eq(1)').html($('.manual-sort-right [data-active="1"] .mswl-center h3').html());
                $('.manual-sort-right [data-active="1"] .mswl-end span:eq(0)').html($(this).find('span:eq(0)').html());
                $(this).attr("data-active", 0);
                $(this).removeClass("left-selected");
                $('.manual-sort-right [data-active="1"]').removeClass("right-selected");
                $('.manual-sort-right [data-active="1"]').attr("data-active", 0);
            }
        } else {

            // 将选中项激活，其他项不激活
            $('.ms-worker-list').attr("data-active", 0);
            $('.ms-worker-list').removeClass("right-selected");
            $(this).attr("data-active", 1);
            $(this).addClass("right-selected");

            // 判断左侧是否有激活项
            if($('.manual-sort-left').find('[data-active="1"]').length) {

                for(let i = 0; i < $('.ms-worker-list').length; ++i) {

                    // 遍历人名，查找是否有人已经占有该座位
                    if($('.ms-worker-list:eq(' + i + ') .mswl-end span:eq(0)').html() == $('.manual-sort-left [data-active="1"] span:eq(0)').html()) {
                        
                        // 判断该人员原本是否有座位，若有，进行“还座”操作                      
                        if($('.ms-worker-list:eq(' + i + ')').attr("data-seat-text")) {
                            $('.ms-worker-list:eq(' + i + ') .mswl-end span:eq(0)').html($('.ms-worker-list:eq(' + i + ')').attr("data-seat-text"));
                        } else {
                            $('.ms-worker-list:eq(' + i + ') .mswl-end span:eq(0)').html("");
                        }      
                    }
                }

                for(let i = 0; i < $('.ms-selected').length; ++i) {

                    // 遍历座位，查找右侧激活项人员是否已经占有其他座位
                    if($('.ms-selected:eq(' + i + ') span:eq(1)').html() === $(this).find('.mswl-center h3').html()) {

                        // 判断该座位原本是否有人占，若有，进行“还座”操作
                        if($('.ms-selected:eq(' + i + ')').attr("data-worker-text")) {
                            $('.ms-selected:eq(' + i + ') span:eq(1)').html($('.ms-selected:eq(' + i + ')').attr("data-worker-text"));
                        } else {
                            $('.ms-selected:eq(' + i + ') span:eq(1)').html("");
                        }

                    }
                }

                // 占座，并将所有项变为不激活状态
                $(this).find('.mswl-end span:eq(0)').html($('.manual-sort-left').find('[data-active="1"]').find('span:eq(0)').html());
                $('.manual-sort-left').find('[data-active="1"]').find('span:eq(1)').html($(this).find('.mswl-center h3').html());
                $(this).attr("data-active", 0);
                $(this).removeClass("right-selected");
                $('.manual-sort-left').find('[data-active="1"]').removeClass("left-selected");
                $('.manual-sort-left').find('[data-active="1"]').attr("data-active", 0);
            }
        }
    }

    /*
    ** 提交手动排序
    ** 重新渲染画布中对应位置
    */
    function manualSortSubmit() {
        var selected = $('.manual-sort-left .ms-selected');
        for(let i = 0; i < selected.length; ++i) {
            var row = $(selected[i]).find('span:eq(0)').html().split("排")[0];
            var col = convertColToCanvas(Number($(selected[i]).find('span:eq(0)').html().split("排")[1].split("座")[0])).row;
            var target = convertColToCanvas(Number($(selected[i]).find('span:eq(0)').html().split("排")[1].split("座")[0])).target;
            var state;

            console.log(row, col, target);

            if($(selected[i]).find('span:eq(1)').html() === "") {
                state = seatData[target].seats[col][row-1].state-1;
            } else {
                state = 2;
                seatData[target].seats[col][row-1].owner = $(selected[i]).find('span:eq(1)').html();
            }

            var position = {
                row: col+1,
                col: row
            }

            // console.log(position);

            checkSeat(position, state, target);
            addCheckedInfo(position, state, target);
        }
    }

    /*
    ** 预留座位
    ** 将所有选择的座位变为预留的座位
    */
    function reserve() {
        var selectedObj = isSeatSelected();

        for(let i = 0; i < selectedObj.length; ++i) {

            var position = selectedObj[i].position;
            var target = selectedObj[i].target;

            checkSeat(position, 4, target);
            addCheckedInfo(position, 4, target);
        }
    }

    /*
    ** 取消预留
    ** 将预留的座位变为可选的座位，将其他的座位变为对应的未选中状态
    */
    function cancelReserve() {
        var selectedObj = isSeatSelected();

        for(let i = 0; i < selectedObj.length; ++i) {

            var position = selectedObj[i].position;
            var target = selectedObj[i].target;
            var state = selectedObj[i].state;

            if(state === 5) {
                state = 0;
            } else {
                state--;
            }

            checkSeat(position, state, target);
            addCheckedInfo(position, state, target);
        }
    }

    /*
    ** 重置
    ** 将所有选择的座位变为可选的座位，若未选择则将所有座位变为可选
    */
    function reset() {
        var selectedObj = isSeatSelected();

        // console.log(selectedObj);

        if(selectedObj.length) {
            for(let i = 0; i < selectedObj.length; ++i) {

                var position = selectedObj[i].position;
                var target = selectedObj[i].target;
    
                checkSeat(position, 0, target);
                addCheckedInfo(position, 0, target);
            }
        } else {
            for(let i = 1; i <= 3; ++i) {
                var target = "t" + i;
                console.log(target);
                for(let j = 0; j < seatData[target].seats.length; ++j) {
                    for(let k = 0; k < seatData[target].seats[j].length; ++k) {
                        var position = {
                            row: seatData[target].seats[j][k].row,
                            col: seatData[target].seats[j][k].col
                        }

                        checkSeat(position, 0, target);
                        addCheckedInfo(position, 0, target);
                    }
                }
            }
        }
    }

    /*
    ** 发布
    */
    function publish() {
        alert("发布成功！");
    }

});


/* 
** 绘制圆角矩形
** @x       { Number }    起始横坐标
** @y       { Number }    起始纵坐标
** @width   { Number }    矩形宽度
** @height  { Number }    举行高度
** @radius  { Number }    圆角半径
** @color   { String }    颜色
** @type    { String }    填充/描边
*/
CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius, color, type) {

    this.save();

    this.beginPath();
    this.moveTo(x, y+radius);
    this.lineTo(x, y+height-radius);
    this.quadraticCurveTo(x, y+height, x+radius, y+height);
    this.lineTo(x+width-radius, y+height);
    this.quadraticCurveTo(x+width, y+height, x+width, y+height-radius);
    this.lineTo(x+width, y+radius);
    this.quadraticCurveTo(x+width, y, x+width-radius, y);
    this.lineTo(x+radius, y);
    this.quadraticCurveTo(x, y, x, y+radius);
    this[type + 'Style'] = color || params.color;
    this.closePath();
    this[type]();

    this.restore();
}
