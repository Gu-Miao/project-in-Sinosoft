var fs = require("fs");

// 座位数据
var data = [];

for(let i = 0; i < 27; ++i) {
    data[i] = [];
    for(let j = 0; j < 14; ++j) {
        data[i].push({
            row: j+1,
            col: i+1,
            state: getEvenNum(Math.round(Math.random()*5)),
        });
        data[i][j].owner = getOwner(data[i][j].state);
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

fs.writeFile("./data.json", JSON.stringify(data), function(err) {
    console.log(err);
});