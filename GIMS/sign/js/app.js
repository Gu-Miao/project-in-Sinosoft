var $list = $('.signed-list ul');
var $signedCount = $('.sign-info span:eq(1) strong');
var $signedNumber = $('.sign-info span:eq(2) strong');
var t = 0;
var count = 0;
var signedCount = 0;
var lastSign = "";


console.log(Promise);


setInterval(function() {

    fetch("./data.json", { method: "get" }).then(function(res) {
        res.text().then(function (data) {
            var data = JSON.parse(data);
            console.log("data: ", data);
            console.log(lastSign, data[data.length-1])
            if(lastSign !== data[data.length-1]) {
                for(let i = 0; i < data.length; ++i) {
                    $list.append($('<li>编号' + data[i] + '</li>'));
                }
                signedCount += data.length;
        
                $signedCount.html(signedCount);
                $signedNumber.html(data[data.length-1]);
                lastSign = data[data.length-1];
            }
        });
    });
    // $.ajaxSetup({ 
    //     async : false 
    // });

    // // 获取数据
    // $.getJSON("../data.json", function(data) {
    //     console.log("data: ", data);
    //     console.log(lastSign, data[data.length-1])
    //     if(lastSign !== data[data.length-1]) {
    //         for(let i = 0; i < data.length; ++i) {
    //             $list.append($('<li>编号' + data[i] + '</li>'));
    //         }
    //         signedCount += data.length;
    
    //         $signedCount.html(signedCount);
    //         $signedNumber.html(data[data.length-1]);
    //         lastSign = data[data.length-1];
    //     }
    // });
    
    
}, 2000);

var t1 = setInterval(function() {
    if($list.children().length > 10) {
        t += 3;
        count++;
        if(count > 17) {
            t = 0;
            count = 0;
            // clearInterval(t1);
        
            if($list.children().length > 10) {
                $list.find('li:eq(0)').remove();
            }
            
        }
        $list.scrollTop(t);
    }
}, 50);