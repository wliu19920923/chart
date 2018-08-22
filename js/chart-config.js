/**
 * 蜡烛图表
 * @param <array> ohlc 行情数据，格式：[[时间戳（秒）, 开盘价, 最高价, 最低价, 收盘价, 成交量], ...]
 // * @param <array> ma 均线列表，格式：[[天数, 颜色], ...]
 */

function candlestickChart(ohlc, height, width) {
    var ma5 = MA(ohlc, 5);
    var ma10 = MA(ohlc, 10);
    var ma20 = MA(ohlc, 20);
    var ma30 = MA(ohlc, 30);
    // set the allowed units for data grouping
    var groupingUnits = [[
        'week',                         // unit name
        [1]                             // allowed multiples
    ], [
        'month',
        [1, 2, 3, 4, 6]
    ]];
    // create the chart
    $('#chart').highcharts('StockChart', {
        chart: {
            height: $(document).height() - 20,
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
                        fontWeight: 'bold'
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
            height: '100%',
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
        }, {
            name: 'ma10',
            color: '#ffbb22',
            type: 'spline',
            data: ma10,
        }, {
            name: 'ma20',
            color: '#9911dd',
            type: 'spline',
            data: ma20,
        }, {
            name: 'ma30',
            color: '#00ff00',
            type: 'spline',
            data: ma30,
        }]
    });
}