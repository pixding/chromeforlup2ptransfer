
$(function(){
  setTimeout(function(){
    $("#tradeCode").val("这里是交易密码");
    $("#inputValid").focus();
  },100);

  $(".product-list").on("click",function(){
    var that = $(this);
    var _url = that.find(".product-name a").attr("href").split("?")[1];
    var productId = getUrlParam(_url,"productId");
    var amount = that.find(".product-amount .num-style").text().replace(',','');
    var param = {
      productId:productId,
      amount:amount,
      source:0,
      isCheckSQ:1
    }
    investcheck(param);
  })

  //investcheck(param);
})


function investcheck(param){
  var investurl = "https://list.lu.com/list/invest-check";
  //var investurl = "https://list.lu.com/list/itrading/invest-check";
  $.ajax({
    type:'POST',
    url:investurl,
    data:param,
    dataType:'json',
    success:function(d){
      var data = d;
      if(data.code=="66"){
        console.log(data);
        console.log(data.code);
        var sid = data.sid;
        var param2 = {
          sid:sid,
          productId:param.productId,
          curStep:"TRADE_INFO"
        }
        //location.href = "https://trading.lu.com/trading/trade-info?productId="+param.productId+"&sid="+data.sid;
        tradecheck(param2,function(){
          param2.curStep = "CONTRACT";
          tradecheck(param2,function(){
            var url = "https://trading.lu.com/trading/security-valid?productId="+param.productId+"&sid="+data.sid;
            window.open(url);
          })


        })

        //


      }else{
        alert(data.code+":"+data.message);
      }

    }

  })
}


function tradecheck(param,cb){
  var tradeurl ="https://trading.lu.com/trading/service/trade/trace";
  $.ajax({
    type:'POST',
    url:tradeurl,
    data:param,
    dataType:'json',
    success:function(data){
      cb(data);
    }

  })

}

function getUrlParam(uri,name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = uri.match(reg);
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
