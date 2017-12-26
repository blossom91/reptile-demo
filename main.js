// 引用2个库 第一个用于下载网页  第二个用于解析网页
var fs = require('fs')
// var request = require('sync-request')

// var url = 'https://kyfw.12306.cn/otn/resources/js/query/train_list.js'

// var r = request('GET', url)

// var body = r.getBody('utf-8')
var body = fs.readFileSync('train.json', 'utf8')

var data = JSON.parse(body.replace('var train_list =', ''))

var saveData = {}

for (var i = 0; i < 15; i++) {
    var z = new Date()
    z.setDate(z.getDate() + i)
    var Year = z.getFullYear()
    var Month = z.getMonth() + 1
    var Day = z.getDate()
    if (String(Month).length === 1) {
        Month = '0' + Month
    }
    if (String(Day).length === 1) {
        Day = '0' + Day
    }
    var date = `${Year}-${Month}-${Day}`
    saveData[date] = []
    var trainData = data[date]
    var keys = Object.keys(trainData)
    for (var j = 0; j < keys.length; j++) {
        var keyData = trainData[keys[j]]
        for (var k = 0; k < keyData.length; k++) {
            var a = keyData[j].station_train_code.split('(')
            var o = {}
            o.trainNo = a[0]
            o.depart = a[1].split('-')[0]
            o.arrive = a[1].split('-')[1].replace(')', '')
            saveData[date].push(o)
        }
    }
}
fs.writeFileSync('./train/train.json', JSON.stringify(saveData, null, 2))

const { createGzip } = require('zlib')

const rs = fs.createReadStream('./train/train.json')
const ws = fs.createWriteStream('./train.json.gz')
rs.pipe(createGzip()).pipe(ws)





