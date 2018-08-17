// 模拟座位的数据

// 状态码
// 可选的座位           0
// 选中可选的座位       1
// 已选的座位           2
// 选中已选的座位       3
// 预留的座位           4
// 选中预留的座位       5

var seatData = {};

seatData.seatSize = {
    width: 32,
    height: 32
}

seatData.t1 = {

    // 表一的大小
    width: 327,
    height: 656,

    // 第一个座位的内边距
    firstPadding: {
        x: 16,
        y: 39
    },

    // 座位之间的间距
    seatMargin: {
        x: 6,
        y: 11
    },

    // 行列数量
    row: 8,
    col: 14,

    // 座位信息
    seats: []
}

// 模拟数据，随机状态码进行初始化
for(let i = 0; i < 8; ++i) {
    seatData.t1.seats[i] = [];
    for(let j = 0; j < 14; ++j) {
        seatData.t1.seats[i].push({
            row: i+1,
            col: j+1,
            x: seatData.t1.firstPadding.x+(seatData.seatSize.width+seatData.t1.seatMargin.x)*i,
            y: seatData.t1.firstPadding.y+(seatData.seatSize.height+seatData.t1.seatMargin.y)*j,
            state: getEvenNum(Math.round(Math.random()*5))
        });
        seatData.t1.seats[i][j].owner = getOwner(seatData.t1.seats[i][j].state);
        console.log(i+1, j+1, seatData.t1.seats[i][j].owner);
    }
}

// 保存座位信息的数据不会保存座位是非被选中的状态
// 模拟的数据都用未选中的座位
function getEvenNum(num) {
    if(num%2) {
        console.log()
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

    var na = Math.round(Math.random()*a.length);
    var nb = Math.round(Math.random()*b.length);

    return a[na]+b[nb];
}