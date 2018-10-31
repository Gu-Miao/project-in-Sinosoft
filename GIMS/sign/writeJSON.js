var fs = require('fs');

var people = [];

// 初始化人员数组
for (let i = 0; i < 99999; ++i) {
    people[i] = getFormattedNumber(i);
}

var t = setInterval(function () {
    var data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

    console.log("data", data);

    var length = Math.round(Math.random() * 5);
    for (let i = 0; i < length; ++i) {
        var index = Math.round(Math.random() * 99999);
        if (index !== 500) { data.push(people[index]); }
    }

    fs.writeFileSync('./data.json', JSON.stringify(data), (err) => {
        console.log(err);
    });
}, 1000);

// 格式化编号
function getFormattedNumber(number) {
    // console.log("number", number);
    if (number <= 9) {
        return "000000" + number;
    } else if (number <= 99) {
        return "00000" + number;
    } else if (number <= 999) {
        return "0000" + number;
    } else if (number <= 9999) {
        return "000" + number;
    } else if (number <= 99999) {
        return "00" + number;
    } else if (number <= 999999) {
        return "0" + number;
    }

    return String(number);
}