var fs = require('fs');

var people = [];

// 初始化人员数组
for(let i = 0; i < 500; ++i) {
    people[i] = getFormattedNumber(i);
}

var t = setInterval(function() {
    var data = [];
    var length = Math.round(Math.random()*5);
    for(let i = 0; i < length; ++i) {
        var index = Math.round(Math.random()*500);
        if(index !== 500) { data.push(people[index]); }
    }
    
    fs.writeFileSync('./data.json', JSON.stringify(data), (err) => {
        console.log(err);
    });
}, 10000);

// 格式化编号
function getFormattedNumber(number) {
    if(number <= 9) {
        return "00" + number;
    } else if(number <= 99) {
        return "0" + number;
    }

    return String(number);
}