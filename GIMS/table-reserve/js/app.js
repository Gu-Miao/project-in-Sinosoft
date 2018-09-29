$(function () {
    var td = $('table td');

    // 给表格绑定点击事件
    td.click(tdClick);

    // 已经写好的点击回调
    function tdClick() {
        // 在执行此函时，先执行一个标识符函数，判断函数是否可以继续运行
        if (canReserve()) {
            $(this).css({
                ["background-color"]: "#08c",
                color: "white"
            }).html("可以预约");
        } else {
            if($(this).html() !== "已占用") {
                $(this).css({
                    ["background-color"]: "red",
                    color: "white"
                }).html("不可预约");
            }
        }
    }

    // 标识符函数，判断是否可预约
    function canReserve() {

        // 当前点击的 td 标签
        var $this = $(event.target);

        if($this.html() === "已占用") return false;

        // 当前点击的 td 标签在父元素即 tr 中的索引
        var thisTdIndex = $this.index();

        // 当前点击的行即 tr 元素的索引
        var thisTrIndex = $this.parent().index();

        var second = {
            tdIndex: thisTdIndex,
            trIndex: thisTrIndex,
            $secondChoise: $this
        };

        // 判断是否为上午
        var isMorning = ($this.parent().children().length === 9) ? 1 : 0;

        return hasObstacle(getFirstChoise(isMorning), second);

        /*
        ** 获取第一次选中的 td
        ** @isMorning   { Boolean }     是否为早上
        ** @return      { Object }      返回一个带有 td，td 索引值，tr 索引值的对象
        */
        function getFirstChoise(isMorning) {
            var tdIndex = 0;
            var trIndex = 1;
            var $firstChoise = null;
            var shouldBreak = 0;

            for (var i = thisTrIndex, count = 0; count < 2; i += isMorning ? 1 : (-1)) {

                for (var j = thisTdIndex; j != 0; --j) {
                    if ($('table tbody tr:eq(' + i + ') td:eq(' + j + ')').html() === "选中") {
                        
                        $firstChoise = $('table tbody tr:eq(' + i + ') td:eq(' + j + ')');
                        tdIndex = $firstChoise.index();
                        trIndex = $firstChoise.parent().index();

                        console.log("first:", $firstChoise[0]);

                        shouldBreak = 1;
                        break;
                    }
                }
                if (shouldBreak) break;
            }

            return {
                $firstChoise: $firstChoise,
                tdIndex: tdIndex,
                trIndex: trIndex
            };
        }

        /*
        ** 判断第一次选中的和第二次选中之间是否有“障碍”
        ** @first   { Object }      包含第一次选中的 td 节点，两个索引
        ** @second  { Object }      包含第二次选中的 td 节点，两个索引
        ** @return  { Boolean }     是否含有“障碍物”
        */
        function hasObstacle(first, second) {

            // 第二次点击与第一次相同
            if (first.$firstChoise[0] === second.$secondChoise[0]) return true;

            var firstTrIndex = first.trIndex;
            var firstTdIndex = first.tdIndex;
            var secondTrIndex = second.trIndex;
            var secondTdIndex = second.tdIndex;
            var length = 0;

            if (firstTrIndex === secondTrIndex) {
                length = (secondTdIndex - firstTdIndex - 1) * 2 + 1;
            } else if (firstTrIndex > secondTrIndex) {
                length = (secondTdIndex - firstTdIndex - 2) * 2;
            } else {
                length = (secondTdIndex - firstTdIndex + 1) * 2;
            }

            // 当前 td 元素
            var prsentTdElement = first.$firstChoise;

            console.log("second:", second.$secondChoise[0], "length:", length);

            for (var i = 0; i < length; ++i) {

                if (firstTrIndex % 2) {
                    firstTrIndex--;
                    firstTdIndex += 2;
                } else {
                    firstTrIndex++;
                    firstTdIndex--;
                }

                prsentTdElement = $('table tbody tr:eq(' + firstTrIndex + ') td:eq(' + firstTdIndex + ')');

                // console.log("prsentTdElement:", prsentTdElement[0], prsentTdElement[0] === second.$secondChoise[0]);

                if (prsentTdElement[0] === second.$secondChoise[0]) break;
                if (prsentTdElement.html() === "已占用") return false;
            }

            return true;
        }
    }
});