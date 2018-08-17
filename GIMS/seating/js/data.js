// 动态数据
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

    // 座位信息
    seats: []
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
for(let i = 0; i < seatData.t1.row; ++i) {
    seatData.t1.seats[i] = [];
    seatData.t3.seats[i] = [];
    for(let j = 0; j < seatData.t1.col; ++j) {
        seatData.t1.seats[i].push({
            row: i+1,
            col: j+1,
            x: seatData.t1.firstPadding.x+(seatData.seatSize.width+seatData.t1.seatMargin.x)*i,
            y: seatData.t1.firstPadding.y+(seatData.seatSize.height+seatData.t1.seatMargin.y)*j,
            state: getEvenNum(Math.round(Math.random()*5))
        });
        seatData.t1.seats[i][j].owner = getOwner(seatData.t1.seats[i][j].state);

        seatData.t3.seats[i].push({
            row: i+1,
            col: j+1,
            x: seatData.t3.firstPadding.x+(seatData.seatSize.width+seatData.t3.seatMargin.x)*i,
            y: seatData.t3.firstPadding.y+(seatData.seatSize.height+seatData.t3.seatMargin.y)*j,
            state: getEvenNum(Math.round(Math.random()*5))
        });
        seatData.t3.seats[i][j].owner = getOwner(seatData.t3.seats[i][j].state);
    }
}

for(let i = 0; i < seatData.t2.row; ++i) {
    seatData.t2.seats[i] = [];
    for(let j = 0; j < seatData.t2.col; ++j) {
        seatData.t2.seats[i].push({
            row: i+1,
            col: j+1,
            x: seatData.t2.firstPadding.x+(seatData.seatSize.width+seatData.t2.seatMargin.x)*i,
            y: seatData.t2.firstPadding.y+(seatData.seatSize.height+seatData.t2.seatMargin.y)*j,
            state: getEvenNum(Math.round(Math.random()*5))
        });
        seatData.t2.seats[i][j].owner = getOwner(seatData.t2.seats[i][j].state);
    }
}

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