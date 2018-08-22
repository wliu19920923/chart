//7110行情白天，7111行情晚上，7120交易白天，7121交易晚上
var server_url ="http://test.jrw88.com//api";
var hq_ws_url="ws://heishi.f3322.net:7111";//行情 ws接口地址
var sys_ws_url = "ws://heishi.f3322.net:7121"; //报单 ws接口地址
document.onkeydown = function(e) {
        var keyCode = e.keyCode || e.which || e.charCode;
        var ctrlKey = e.ctrlKey || e.metaKey;

        //按键监控
        //alert(keyCode);
        if(keyCode==38){
            (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta++)) ||  (e.originalEvent.detail && (e.originalEvent.detail++));
        }
}

var sys_ws = null;


function lj_sys_ws(u,p) {
    //登录ws 连接报单系统
                if ("WebSocket" in window) {
                    sys_ws = new WebSocket(sys_ws_url);
                    sys_ws.onopen = function () {
                        var data = {
                            e:"login",
                            request:{
                                "username":u,
                                "password": p,
                            }
                         }
                         sys_ws.send(JSON.stringify(data));
                    };

                    sys_ws.onmessage = function (evt)
                   {
                      var received_msg = evt.data;
                      pyjs.jslog(received_msg);
                      ws_callback(received_msg);
                   };
                    sys_ws.onclose = function()
                       {
                          // 关闭 websocket
                            pyjs.jslog("报单系统断开");
                       };
                }
                 //登录ws 连接报单系统
}
//ws 反馈信息回调处理
function  ws_callback(res) {

    if(res=='Invalid username or password.'){//帐号登录失败
        pyjs.jslog("帐号错误 sys_ws登录失败.");
        sys_ws=null;
    }

}

//用户注册
function userReg(that) {

    var user = $("input[name='user']").val();
    var pwd = $("input[name='pwd']").val();
    var repwd = $("input[name='repwd']").val();
    var tel = $("input[name='tel']").val();
    var mail = $("input[name='mail']").val();

    if(!/^[a-zA-Z0-9_-]{6,16}$/.test(user)){
        layer.alert("用户名格式不符合要求");
        return false;
    }
    if(!/^[a-zA-Z0-9_-]{6,16}$/.test(pwd)){
        layer.alert("密码格式不符合要求");
        return false;
    }
     if(pwd!=repwd){
        layer.alert("重复密码不一致");
        return false;
    }

    if(tel && !/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(tel)){
        layer.alert("手机号码格式不正确");
        return false;
    }
    if(mail && !/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(mail)){
        layer.alert("邮箱格式不正确");
        return false;
    }

    $.ajax({
        //提交数据的类型 POST GET
        type:'post',
        //提交的网址
        url:server_url+$(that).attr('action'),
        //提交的数据
        data:$(that).serialize(),
        //返回数据的格式
        datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
        //在请求之前调用的函数
        beforeSend:function(){},
        //成功返回之后调用的函数
        success:function(data){
            layer.alert(data.info,{},function (index) {
                layer.close(index);
                if(data.status){
                  $('#regmodal').modal('hide');
                 $(that)[0].reset();
                 $('#loginmodal').modal('show');
                }
            });

        },
        //调用出错执行的函数
        error: function(){
            //请求出错处理
        }
    });

    return false;
}
//用户的登录
function userLogin(that) {

    var user = $("input[name='login_user']").val();
    var pwd = $("input[name='login_pwd']").val();

    if(!/^[a-zA-Z0-9_-]{4,16}$/.test(user)){
        layer.alert("请输入正确格式的用户名");
        return false;
    }
    if(!/^[a-zA-Z0-9_-]{6,16}$/.test(pwd)){
        layer.alert("请输入正确格式的");
        return false;
    }
    $.ajax({
        //提交数据的类型 POST GET
        type:'post',
        //提交的网址
        url:server_url+$(that).attr('action'),
        //提交的数据
        data:$(that).serialize(),
        //返回数据的格式
        datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
        //在请求之前调用的函数
        beforeSend:function(){},
        //成功返回之后调用的函数
        success:function(data){
            layer.alert(data.info,{},function (index) {
                layer.close(index);
                if(data.status){
                  $('#loginmodal').modal('hide');
                  $(that)[0].reset();
                  //获取持仓列表
                  getUserChicang(data.data.id);
                  pyjs.loaduser(JSON.stringify(data.data));

                }
            });
        },
        //调用出错执行的函数
        error: function(){
            //请求出错处理
        }
    });
    return false;
}
//用户的自动登录
function autoLogin(uid,token,key) {

    if(!uid || !token){
        return false;
    }
    $.ajax({
        //提交数据的类型 POST GET
        type:'post',
        //提交的网址
        url:server_url+'/user/autologin',
        //提交的数据
        data:{uid:uid,token:token},
        //返回数据的格式
        datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
        //在请求之前调用的函数
        beforeSend:function(){},
        //成功返回之后调用的函数
        success:function(data){

            if(data.status){
                //获取持仓列表
                getUserChicang(uid);
                pyjs.loaduser(JSON.stringify(data.data));
            }

        },
        //调用出错执行的函数
        error: function(){
            //请求出错处理
        }
    });
}
//设置用户
function setNowUser(user) {

    nowUser = user;
    if(null===user){
        $('#login_no').show();
        $('#login_ed').hide();
        $('.newOrder').addClass('disable');
        return false;
    }
    $('#nowUserNmae').text(user.username);
    $('#login_no').hide();
    $('#login_ed').show();
    $('.newOrder').removeClass('disable');
}
//用户退出
function userLoginOut() {
     pyjs.logoutUser(function (res) {
         setNowUser(null);
         chiCang={};;
     });

}

//获取期货列表
function getcode() {

    $.ajax({
        //提交数据的类型 POST GET
        type:'post',
        //提交的网址
        url:server_url+'/index/getcode',
        //提交的数据
        //data:{uid:uid,token:token},
        //返回数据的格式
        datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
        //在请求之前调用的函数
        beforeSend:function(){},
        //成功返回之后调用的函数
        success:function(data){
            if(data.status){
                code=data.data;
                    var html='';
                    var tt=1;
                    for (i in code)
                    {
                        console.log(code[i]);
                        if(tt==1){
                            setNowInfo(code[i].code);
                            pyjs.Kline('Au1806',setKline);

                            //checkOrder(code[i].code);
                        }
                        html+='<tr data-code="'+code[i].code+'" class="'+code[i].code+'"><td>'+tt+'</td><td>'+code[i].name+'</td><td class="buyprice">--</td><td class="sellprice">--</td></tr>';
                        tt++;
                    }
                    $('#code_list').html(html);
                    $('#code_list tr').eq(0).addClass("on");
                    getQihuo();

            }
        },
        //调用出错执行的函数
        error: function(){
            //请求出错处理
        }
    });
}
//获取期货行情
function getQihuo(){
    if ("WebSocket" in window)
            {
               //alert("您的浏览器支持 WebSocket!");

               // 打开一个 web socket
                ws = new WebSocket(hq_ws_url);

               ws.onopen = function()
               {
                  // Web Socket 已连接上，使用 send() 方法发送数据
                 // ws.send("发送数据");

               };

               ws.onmessage = function (evt)
               {
                  var received_msg = JSON.parse(evt.data);
				  //console.log(received_msg);
				  //console.log(received_msg.depth.bids[0]);
				  var buyarr = received_msg.depth.bids[0]
				  var sellarr = received_msg.depth.asks[0];
                  received_msg.buy=buyarr[0];
                  received_msg.sell=sellarr[0];

                  received_msg.buyNum=buyarr[1];
                  received_msg.sellNum=sellarr[1];
                  received_msg.price=received_msg.buy;
                  received_msg.zde = received_msg.buy-received_msg.pre_close_price;
                  received_msg.zdf = (((received_msg.price-received_msg.pre_close_price)/received_msg.pre_close_price)*100).toFixed(2);
                  received_msg.style = received_msg.zde < 0 ? 'green':'red';

				  code[received_msg.code] = $.extend(code[received_msg.code], received_msg);
                  setInfo(received_msg.code,code[received_msg.code]);

               };

               ws.onclose = function()
               {
                  // 关闭 websocket
                  alert("连接已关闭...");
               };
            }

            else
            {
               // 浏览器不支持 WebSocket
               alert("您的浏览器不支持 WebSocket!");
            }
}
//设置信息
function setInfo(code,data) {
        $('.'+code+' .buyprice').text(data.buy);
        $('.'+code+' .sellprice').text(data.sell);
        $('.'+code+' .price').text(data.buy);
        $('.'+code+' .open-price').text(data.open_price);
        $('.'+code+' .max-price').text(data.highest_price);
        $('.'+code+' .min-price').text(data.lowest_price);
        $('.'+code+' .close-price').text(data.last_price);
        $('.'+code+' .yestoday-price').text(data.pre_close_price);
        $('.'+code+' .amount').text(data.chicang);
        $('.'+code+' .volume').text(data.volume);
        $('.'+code+' .buy-amount').text(data.buyNum);
        $('.'+code+' .sell-amount').text(data.sellNum);
        $('.'+code+' .trade-time').text(parseInt(data.time));
        $('.'+code+' .amt-value').text(data.zde.toFixed(2));
        $('.'+code+' .amt').text(data.zdf+'%');
        $('.'+code+' .name').text(data.name);

        $('.'+code+' .qhcode').text(code);
}
//设置当前期货
 function setNowInfo(qhcode) {
        nowcode = qhcode;
        setOrderBox(qhcode);
        $('#box-futures-hq-wrap').removeClass(Object.keys(code).join(" ")).addClass(qhcode);
        $('.qihuo_title').removeClass(Object.keys(code).join(" ")).addClass(qhcode);
 }
//设置下单
 function setOrderBox(qhcode) {

      $('#input_order_code').val(qhcode);
      $('#ordermodal').removeClass(Object.keys(code).join(" ")).addClass(qhcode);
      $('#ordermodal .buyprice').text(code[qhcode].buy);
      $('#ordermodal .sellprice').text(code[qhcode].sell);
      $('#input_order_direction').val( (qhcode in chiCang) ? chiCang['qhcode'] : '0');

      if(qhcode in chiCang){
         if(chiCang[qhcode]=='0'){
            $('#buybtn').text('加多');
         }else{
              $('#buybtn').text('加空');
         }
         $('#sellbtn').text('平仓');

      }else{
        $('#buybtn').text('买多');
        $('#sellbtn').text('卖空');
      }
 }
 
 function  addOrder(type) {
    //  买，空    多空
    var direction = $('#input_order_direction').val();
    var qhcode = $('#input_order_code').val();
    var num = $('#input_order_num').val();

    var data={};
    data.volume=parseInt(num);
    data.code=qhcode;

    switch (type){
        case 0://买
            data.direction=direction;
            data.offset='0';
            break;
        case 1: //卖空  //平仓

            if(input_order_direction==0){ //买空
                data.direction=1;
                data.offset='0';
            }else{//平
                data.direction=direction;
                data.offset='1';
            }
            break;
    }
    if((data.offset=='0' && data.direction==0) || (data.offset=='1' && data.direction==1) ){
         data.price = code[qhcode].buy;
    }else{
         data.price = code[qhcode].sell;
    }
     var ws_data={};
     ws_data.e="order";
     ws_data.request=data;
     pyjs.jslog(JSON.stringify(ws_data));
     sys_ws.send(JSON.stringify(ws_data));
 }
//用户持仓
function getUserChicang(uid) {

     $.ajax({
        //提交数据的类型 POST GET
        type:'post',
        //提交的网址
        url:server_url+'/user/chicang',
        //提交的数据
        data:{uid:uid},
        //返回数据的格式
        datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
        //在请求之前调用的函数
        beforeSend:function(){},
        //成功返回之后调用的函数
        success:function(data){

            if(data.status){
                 chiCang=data.data;
                 pyjs.jslog('用户持仓：'+JSON.stringify(data.data));
            }
        },
        //调用出错执行的函数
        error: function(){
            //请求出错处理
        }
    });
}

$(function () {

    //点击切换
    $('#code_list').on("click","tr",function () {
            var qhcode = $(this).attr("data-code");
            $(this).addClass("on").siblings().removeClass("on");
            setNowInfo(qhcode)
            //setBaseInfo(qhcode);
            setInfo(qhcode,code[qhcode]);
            //checkOrder(qhcode);

    })

    // $.ajax({
    //                 url: "http://pdfm2.eastmoney.com/EM_UBG_PDTI_Fast/api/js?id=SC1905_INE&TYPE=r&rtntype=5&isCR=false&js=cb_1527142952906_59603381((x))",
    //                 type: "GET",
    //                 dataType: "jsonp", //指定服务器返回的数据类型
    //                 jsonpCallback: "cb_1527142952906_59603381",
    //                 success: function (data) {
    //                     console.log('期货分时数据',data);
    //                 }
    //             });

    $('.newOrder').click(function () {
        if($(this).hasClass('disable')){
            return false;
        }
        $('#ordermodal').modal('show');
    })


})


function setKline(data){

    data = eval(data);
            var ohlc = [],
                volume = [],
                ma5 = MA(data, 5),
                ma10 = MA(data, 10),
                ma20 = MA(data, 20),
                ma30 = MA(data, 30),
                dif = DIF(data),
                dea = DEA(data, 9),
                macd = MACD(data),
                dataLength = data.length,
                // set the allowed units for data grouping
                groupingUnits = [[
                    'week',                         // unit name
                    [1]                             // allowed multiples
                ], [
                    'month',
                    [1, 2, 3, 4, 6]
                ]],
                i = 0;
            for (i; i < dataLength; i += 1) {
                ohlc.push([
                    DateToUnix(data[i][0]), // the date
                    parseFloat(data[i][1]), // open
                    parseFloat(data[i][2]), // high
                    parseFloat(data[i][3]), // low
                    parseFloat(data[i][4]) // close
                ]);
                volume.push([
                    DateToUnix(data[i][0]), // the date
                    data[i][5] // the volume
                ]);
            }
            // create the chart
            $('#chart-main').highcharts('StockChart', {
                chart: {
                    backgroundColor: '#000',
                    animation: false,
                    alignTicks: false
                },
                rangeSelector: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                navigator: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                scrollbar: {
                    enabled: false
                },
                mapNavigation: {
                    enabled: true,
                    enableButtons: false
                },
                tooltip: {
                    formatter: function () {
                        var point = this.points[0].point
                        var index = point.index
                        var ohlc = point.options;
                        $('#date').html(UnixToDate(ohlc.x));
                        $('#open').html(ohlc.open);
                        $('#high').html(ohlc.high);
                        $('#low').html(ohlc.low);
                        $('#close').html(ohlc.close);
                        $('#volume').html(data[index][5]);
                        $('#ma5').html(VToF(ma5[index][1], 3));
                        $('#ma10').html(VToF(ma10[index][1], 3));
                        $('#ma20').html(VToF(ma20[index][1], 3));
                        $('#ma30').html(VToF(ma30[index][1], 3));
                        return false;
                    },
                    shared: true
                },
                xAxis: {
                    dateTimeLabelFormats: {
                        millisecond: '%H:%M:%S.%L',
                        second: '%H:%M:%S',
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%y-%m-%d',
                        week: '%y-%m-%d',
                        month: '%y-%m',
                        year: '%Y'
                    },
                    lineColor: '#fff',
                    tickColor: '#fff',
                },
                yAxis: [{
                    lineColor: '#fff',
                    tickAmount: 9,
                    tickColor: '#fff',
                    gridLineWidth: 0,
                    plotLines: [{
                        value: 7.96,
                        width: 1,
                        color: '#fff',
                        label: {
                            text: '7.96',
                            align: 'right',
                            y: -10,
                            x: -10,
                            style: {
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: "13px"
                            }
                        }
                    }],
                    labels: {
                        align: 'left',
                        style: {
                            color: "#fff",
                            fontSize: "11px"
                        }
                    },
                    crosshair: true,
                    height: '75%',
                    lineWidth: 1,

                }, {
                    lineColor: '#fff',
                    tickColor: '#fff',
                    gridLineWidth: 1,
                    gridLineColor: '#fff',
                    tickAmount: 3,
                    top: '75%',
                    height: '25%',
                    labels: {
                        align: 'left',
                        style: {
                            color: "#fff",
                            fontSize: "11px"
                        }
                    },
                    offset: 0,
                    lineWidth: 1,
                }],
                series: [{
                    type: 'candlestick',
                    color: 'skyblue',
                    lineColor: 'skyblue',
                    upColor: 'black',
                    upLineColor: 'red',
                    data: ohlc,
                    dataGrouping: {
                        units: groupingUnits
                    },
                }, {
                    name: 'ma5',
                    color: '#999999',
                    type: 'spline',
                    data: ma5,
                    lineWidth: 1,
                }, {
                    name: 'ma10',
                    color: '#ffbb22',
                    type: 'spline',
                    data: ma10,
                    lineWidth: 1,
                }, {
                    name: 'ma20',
                    color: '#9911dd',
                    type: 'spline',
                    data: ma20,
                    lineWidth: 1,
                }, {
                    name: 'ma30',
                    color: '#00ff00',
                    type: 'spline',
                    data: ma30,
                    lineWidth: 1,
                }, {
                    name: 'macd',
                    type: 'column',
                    data: macd,
                    yAxis: 1,
                    lineWidth: 1,
                }, {
                    name: 'dif',
                    color: '#999999',
                    type: 'spline',
                    data: dif,
                    yAxis: 1,
                    lineWidth: 1,
                }, {
                    name: 'dea',
                    color: '#ffbb22',
                    type: 'spline',
                    data: dea,
                    yAxis: 1,
                    lineWidth: 1,
                },]
            });
}