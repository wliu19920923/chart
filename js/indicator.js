function MA(data, period) {
    var result = new Array()
    for (var i = 0; i < data.length; i++) {
        if (i > period) {
            var value = 0;
            for (var j = i - period; j < i; j++) {
                value += parseFloat(data[j][4]);
            }
            result[i] = [  DateToUnix(data[i][0]), value / period]
        } else {
            result[i] = [  DateToUnix(data[i][0]), null]
        }
    }
    return result
}

function EMA(data, period) {
    var result = new Array()
    var alpha = 2 / (period + 1)
    var ema = parseFloat(data[0][4])
    result[0] = [  DateToUnix(data[0][0]), ema]
    for (var i = 1; i < data.length; i++) {
        ema = alpha *  parseFloat(data[i][4]) + (1 - alpha) * ema
        result[i] = [DateToUnix(data[i][0]), ema]
    }
    return result
}

function DIF(data) {
    var result = new Array()
    var ema12 = EMA(data, 12)
    var ema26 = EMA(data, 26)
    for (var i = 0; i < data.length; i++) {
        var dif = ema12[i][1] - ema26[i][1]
        result[i] = [DateToUnix(data[i][0]), dif]
    }
    return result
}

function DEA(data, period) {
    var result = new Array()
    var dif = DIF(data)
    for (var i = 0; i < data.length; i++) {
        if (i > period) {
            var dea = 0
            for (var j=i-period; j<i; j++) {
                dea += dif[j][1]
            }
            result[i] = [DateToUnix(data[i][0]), dea / period]
        } else {
            result[i] = [DateToUnix(data[i][0]), 0]
        }
    }
    return result
}

function MACD(data) {
    var result = new Array()
    var dif = DIF(data)
    var dea = DEA(data, 9)
    for (var i = 0; i < data.length; i++) {
        result[i] = [DateToUnix(data[i][0]), (dif[i][1] - dea[i][1]) * 2]
    }
    return result
}