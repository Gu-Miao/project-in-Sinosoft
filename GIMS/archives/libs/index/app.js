// 全局变量
var tabData; // 记录是哪个当前标签页，和选中的上一级列表项的信息

$(function () {

    $('#layuicss-layer').remove();

    // 初始化页面
    initPage();
});

/**
 * 初始化页面
 */
function initPage() {

    // 解除绑定方法
    $('.dropdown-menu .dropdown-item').unbind();

    // 初始化标签
    initTabs();

    // 初始化面板
    initPanel();

    // 事件绑定可以放在下面
    // 新增
    $('.dropdown-menu .dropdown-item:contains(新增)').click(newlyAdded);
}

/**
 * 加载标签页
 */
function initTabs() {
    $.ajax({
        url: '/data/tab.json',
        type: 'get',
        success: function (data) {

            // 清空标签
            $('.tab-container .tab').remove();

            // 解析 data
            var data = JSON.parse(data);
            console.log("加载标签页的数据：\n", data);

            // 加载标签
            for (let i = 0; i < data.length; ++i) {
                $('.select-container').before($(''
                    + '<div class="tab" data-TABLE_NAME="' + data[i].TABLE_NAME + '">'
                    + data[i].TABLE_CHN_NAME
                    + '</div>')
                );
            }

            // 激活第一个标签
            $('.tab-container .tab:eq(0)').addClass('tab-active');

            // 给标签绑定事件
            $('.tab-container .tab').click(switchTab);
        },
        error: function (err) {
            layer.msg('加载失败，请刷新页面');
            console.log("加载标签页失败，错误信息：\n", err);
        }
    });
}


/**
 * 切换标签页
 */
function switchTab() {

    // 切换激活状态
    $('.tab-container .tab').removeClass('tab-active');
    $(this).addClass('tab-active');

    // 初始化面板
    initPanel();

}

/**
 * 初始化面板
 */
function initPanel() {
    // 删除旧的面板，新建新的面板
    $('.tab-panel').remove();
    $('.tab-panel-container').append($('<div class="tab-panel"></div>'));

    // 添加表格
    $('.tab-panel').append($(''
        + '<table id="table" class="table table-bordered table-striped table-hover table-condensed table-responsive">'
        + '<thead>'
        + '<tr></tr>'
        + '</thead>'
        + '<tbody></tbody>'
        + '</table>')
    );

    // 加载表头
    initTableHead();

    // 加载表格内容
    initTableBody();
}

/**
 * 加载表头
 */
function initTableHead() {
    $.ajax({
        url: "/data/form.json",
        type: "get",
        success: function (data) {
            var data = JSON.parse(data);
            console.log("加载表头的数据：\n", data);

            // 获取激活的标签
            var TABLE_NAME = $('.tab-active').attr('data-TABLE_NAME');
            var usefullData = [];

            for (let i = 0; i < data.length; ++i) {
                if (data[i].TABLE_NAME === TABLE_NAME) {
                    usefullData.push(data[i]);
                }
            }

            console.log("有用的数据\n", usefullData);

            // 加载表头
            for (let i = 0; i < usefullData.length; ++i) {
                if (usefullData[i].COLUMN_AS_SIMQUERY === "T") {
                    $('table thead tr').append($('<th>' + usefullData[i].COLUMN_CHN_NAME + '</th>'));
                }
            }
            $('table thead tr').prepend($('<th>选择</th>'));

        },
        error: function (err) {
            layer.msg('加载失败，请刷新页面');
            console.log("加载表头失败，错误信息：\n", err);
        }
    });
}

/**
 * 加载表格内容
 */
function initTableBody() {

}

/**
 * 新增操作
 */
function newlyAdded() {
    layer.open({
        type: 2,
        title: '新增',
        content: './form.html',
        area: ['800px', 'auto'],
        offset: '30px',
        resize: false,
        maxmin: true,
        success: function (layero, index) {
            // layer.iframeAuto(index);
        },
        full: function (layero) {

            // 让 iframe 高度自适应
            layero.find('iframe').css('max-height', 'none');
        },
        restore: function (layero) {

            // 让 iframe 最高高度为 500px
            layero.find('iframe').css('max-height', '500px');
        }
    });
}

/**
 * 加载标签页表格
 */
// function loadPanelTable() {

//     $('.boostrap-table').before($(''
//         + '<table id="t' + $('.tab-panel-container .tab-panel').not('.hide').index() + '"></table>'
//     ));
//     $('.boostrap-table').remove();

//     var data = [];
//     for (let i = 0; i < 989; ++i) {
//         data.push({
//             id: i,
//             name: String(Math.ceil(Math.random() * i)),
//             price: '$' + (Math.ceil(Math.random() * i))
//         });
//     }

//     var index = $('.tab-panel-container .tab-panel').not('.hide').index();
//     console.log('index', index);
//     $('#t' + (index + 1)).bootstrapTable({
//         striped: true, // 条纹样式
//         undefinedText: "", // 当数据为 undefined 时显示的字符
//         sortClass: undefined, // 被排序的td元素的类名
//         height: 500, // 表格高度，可用于固定表头
//         pagination: true, // 是否分页，默认为否
//         paginationLoop: false, // 分页无限循环，默认为是
//         onlyInfoPagination: false, // 设置为 true 只显示总数据数，而不显示分页按钮。需要设置 pagination='true'
//         sidePagination: 'client', // 设置在哪里进行分页，可选值为 'client' 或者 'server'。设置 'server'时，必须设置服务器数据地址（url）或者重写ajax方法
//         pageNumber: 1, // 如果设置了分页，首页页码
//         pageSize: 30, // 如果设置了分页，页面数据条数
//         pageList: [30, 50, 100, 'all'], // 如果设置了分页，设置可供选择的页面数据条数。设置为 All 或者 Unlimited，则显示所有记录
//         columns: [
//             {
//                 field: 'id',
//                 title: 'Item ID'
//             },
//             {
//                 field: 'name',
//                 title: 'Item Number'
//             },
//             {
//                 field: 'price',
//                 title: 'Item Price'
//             }],
//         data: data
//     });
// }