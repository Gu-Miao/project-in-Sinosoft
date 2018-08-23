// 座位数据
var seatData = {};

seatData.seatSize = {
    width: 31,
    height: 31
}

seatData.t1 = {

    // 表一的大小
    width: 320,
    height: 585,

    // 第一个座位的内边距
    firstPadding: {
        x: 15,
        y: 40
    },

    // 座位之间的间距
    seatMargin: {
        x: 6,
        y: 8
    },

    // 行列数量
    row: 8,
    col: 14,

    // 标题文本
    text: '左侧区: 座位号13~29(奇数)',

    // 文本位置
    textPosition: {
        x: 19,
        y: 17
    },

    // 座位信息
    seats: []
}

seatData.t2 = {

    // 表二的大小
    width: 460,
    height: 585,

    // 第一个座位的内边距
    firstPadding: {
        x: 29.5,
        y: 40
    },

    // 座位之间的间距
    seatMargin: {
        x: 6,
        y: 8
    },

    // 行列数量
    row: 11,
    col: 14,

    // 标题文本
    text: '中间区: 座位号1~11(全部)',

    // 文本位置
    textPosition: {
        x: 19,
        y: 17
    },

    // 座位信息
    seats: []
}

seatData.t3 = {

    // 表三的大小
    width: 320,
    height: 585,

    // 第一个座位的内边距
    firstPadding: {
        x: 15,
        y: 40
    },

    // 座位之间的间距
    seatMargin: {
        x: 6,
        y: 8
    },

    // 行列数量
    row: 8,
    col: 14,

    // 标题文本
    text: '右侧区: 座位号12~28(偶数)',

    // 文本位置
    textPosition: {
        x: 19,
        y: 17
    },

    // 座位信息
    seats: []
}

seatData.s1 = {
    width: 50,
    height: 585
}

seatData.s1.firstPadding = {
    x: (seatData.s1.width-seatData.seatSize.width)/2,
    y: seatData.t1.firstPadding.y
}

seatData.s1.margin = seatData.t1.seatMargin.y+seatData.seatSize.height;

seatData.s1.length = seatData.t1.col;

seatData.s2 = {
    width: 1440,
    height: 50
}

seatData.s2.margin = seatData.t1.seatMargin.x+seatData.seatSize.width;

seatData.s2.p1 = {
    length: seatData.t1.row,
    firstPadding: {
        x: 100+seatData.t1.firstPadding.x,
        y: (seatData.s2.height-seatData.seatSize.height)/2
    }
}

seatData.s2.p2 = {
    length: seatData.t2.row,
    firstPadding: {
        x: 100+seatData.t1.width+80+seatData.t2.firstPadding.x,
        y: seatData.s2.p1.firstPadding.y
    }
}

seatData.s2.p3 = {
    length: seatData.t3.row,
    firstPadding: {
        x: 100+seatData.t1.width+80+seatData.t2.width+80+seatData.t3.firstPadding.x,
        y: seatData.s2.p1.firstPadding.y
    }
}

// 模拟座位的数据

// 状态码
// 可选的座位           0
// 选中可选的座位       1
// 已选的座位           2
// 选中已选的座位       3
// 预留的座位           4
// 选中预留的座位       5
// 模拟数据，随机状态码进行初始化

// for(let i = 0; i < seatData.t1.row; ++i) {
//     seatData.t1.seats[i] = [];
//     seatData.t3.seats[i] = [];
//     for(let j = 0; j < seatData.t1.col; ++j) {
//         seatData.t1.seats[i].push({
//             row: i+1,
//             col: j+1,
//             state: getEvenNum(Math.round(Math.random()*5))
//         });
//         seatData.t1.seats[i][j].owner = getOwner(seatData.t1.seats[i][j].state);

//         seatData.t3.seats[i].push({
//             row: i+1,
//             col: j+1,
//             state: getEvenNum(Math.round(Math.random()*5))
//         });
//         seatData.t3.seats[i][j].owner = getOwner(seatData.t3.seats[i][j].state);
//     }
// }

// for(let i = 0; i < seatData.t2.row; ++i) {
//     seatData.t2.seats[i] = [];
//     for(let j = 0; j < seatData.t2.col; ++j) {
//         seatData.t2.seats[i].push({
//             row: i+1,
//             col: j+1,
//             state: getEvenNum(Math.round(Math.random()*5))
//         });
//         seatData.t2.seats[i][j].owner = getOwner(seatData.t2.seats[i][j].state);
//     }
// }

// 保存座位信息的数据不会保存座位是非被选中的状态
// 模拟的数据都用未选中的座位
function getEvenNum(num) {
    if(num%2) {
        // console.log();
        return --num;
    }

    return num;
}

// 获取座位的拥有者
function getOwner(state) {
    if(state === 2) {
        return rdName();
    }
    return "";
}

// 随机名字
function rdName() {
    var a = ["赵", "钱", "孙", "李", "周", "吴", "郑", "王", "长孙", "张", "康", "郭", "朱", "公孙",];
    var b = ["强", "浩", "子一", "子英", "涛", "子阳", "无忌", "天渺", "元吉", "元庆", "靖", "素珍", "云长", "江", "悟空", "娜扎", "壮实", "凯", "琪琪", "二娘", "大"];

    var na = Math.round(Math.random()*(a.length-1));
    var nb = Math.round(Math.random()*(b.length-1));

    return a[na]+b[nb];
}