const fs = require('fs')
const request = require('sync-request')
const { createGzip } = require('zlib')

// 车次查重
const trainNo = []

// 时间处理函数
const time = i => {
    const z = new Date()
    z.setDate(z.getDate() + i)
    const Year = z.getFullYear()
    let Month = z.getMonth() + 1
    let Day = z.getDate()
    if (String(Month).length === 1) {
        Month = '0' + Month
    }
    if (String(Day).length === 1) {
        Day = '0' + Day
    }
    return `${Year}-${Month}-${Day}`
}

// 读取本地的文件做数据处理,如果不存在网络读取
const getBody = () => {
    const url = 'https://kyfw.12306.cn/otn/resources/js/query/train_list.js'
    const r = request('GET', url)
    const body = r.getBody('utf-8')
    return body
}

// 数据处理函数,默认处理15天的数据 后续待定
const reptile = saveData => {
    const body = getBody()
    const data = JSON.parse(body.replace('var train_list =', ''))
    for (var i = 0; i < 15; i++) {
        const date = time(i)
        saveData[date] = []
        const trainData = data[date]
        // 处理数据
        const keys = Object.keys(trainData)
        for (let j = 0; j < keys.length; j++) {
            const keyData = trainData[keys[j]]
            for (let k = 0; k < keyData.length; k++) {
                const a = keyData[k].station_train_code.split('(')
                const o = {}
                if (!trainNo.includes(a[0])) {
                    trainNo.push(a[0])
                }
                o.trainNo = a[0]
                o.depart = a[1].split('-')[0]
                o.arrive = a[1].split('-')[1].replace(')', '')
                saveData[date].push(o)
            }
        }
    }
}


// 写入数据并压缩打包
const writeData = (saveData, path) => {
    fs.writeFileSync(path, JSON.stringify(saveData, null, 2))
    fs.writeFileSync('trainNo.json', JSON.stringify(trainNo))
    const rs = fs.createReadStream(path)
    const ws = fs.createWriteStream(path + '.gz')
    rs.pipe(createGzip()).pipe(ws)
}

const _main = path => {
    const saveData = {}
    reptile(saveData)
    writeData(saveData, path)
}

_main('train.json')









