/**
 * 数组根据数组对象中的某个属性值进行排序
 * 用法：arr.sort(sortBy('COLUMN_ORDER', false)) 表示根据 COLUMN_ORDER 属性对 arr 进行降序排列，若第二个参数不传递，默认表示升序排序
 * @param attr 排序的属性，只支持 Number 类型，或者 String 类型的数字
 * @param rev true 表示升序排列，false 降序排序
 */
function sortByNumber(attr, rev) {
    //第二个参数没有传递 默认升序排列
    if (rev == undefined) {
        rev = 1;
    } else {
        rev = (rev) ? 1 : -1;
    }

    return function (a, b) {
        a = Number(a[attr]);
        b = Number(b[attr]);
        if (a < b) {
            return rev * -1;
        }
        if (a > b) {
            return rev * 1;
        }
        return 0;
    }
}

/**
 * 对于数组对象的拓展，删除指定内容的数组元素
 * 用法：arr = [1, "asdf", 44]; arr.removeItem("asdf"); 结果：[1, 44]
 * @param ArrayItem 必需，指定的内容，只支持 Number, String 类型
 * @return 返回修改后的数组对象
 */
Array.prototype.removeItem = function (ArrayItem) {

    if (ArrayItem === undefined) throw new Error("arg is required and no undefined!");

    for (let i = 0; i < this.length; ++i) {
        if (ArrayItem === this[i]) {
            this.splice(i, 1);
            break;
        }
    }

    return this;
}

/**
 * 打印彩色文字
 * @param str 要打印的文本
 * @param color 文本色
 */
function logColorStr(str, color) {
    console.log("%c" + str, "color: " + color + ";");
}