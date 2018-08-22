/**
 * 时间戳转换日期
 * @param <int> unixTime    待时间戳(秒)
 * @returns {string}
 * @constructor
 */
function UnixToDate(unixTime) {
    unixTime = parseInt(unixTime);
    var time = new Date(unixTime);
    var ymdhis = "";
    ymdhis += time.getUTCFullYear() + "-";
    ymdhis += (time.getUTCMonth() + 1) + "-";
    ymdhis += time.getUTCDate();
    ymdhis += " " + time.getUTCHours() + ":";
    ymdhis += time.getUTCMinutes() + ":";
    ymdhis += time.getUTCSeconds();
    return ymdhis;
}

/**
 * 时间格式字符串转Unix时间戳
 * @param <string> date_str 时间格式字符串
 * @returns {number}
 * @constructor
 */
function DateToUnix(date_str) {
   var date = new Date(date_str);
   return Date.parse(date)
}

/**
 * 精确浮点数
 * @param <float> value 浮点数
 * @param <int> point   精确位数
 * @returns {string}
 * @constructor
 */
function VToF(value, point) {
    if (value == null){
        return '--';
    }else{
        return value.toFixed(point);
    }
}