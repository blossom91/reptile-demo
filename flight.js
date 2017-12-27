// Nodejs  模拟IP 爬取页面

const cheerio = require('cheerio')
const _ = require('underscore')
const superagent = require('superagent')
const fs = require('fs')
const { createGzip } = require('zlib')


// 错误页面
const error = []

// 获取ip
const getIp = () => _.random(1, 254)
    + '.' + _.random(1, 254)
    + '.' + _.random(1, 254)
    + '.' + _.random(1, 254)

// 休眠
// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// 爬取函数
const reptile = (url, ip) => new Promise((resolve, reject) => {
    superagent.get(url).set('X-Forwarded-For', ip).end((err, body) => {
        if (err) {
            reject(err)
        } else {
            resolve(body)
        }
    })
})

// 获取爬取url列表
const getUrlList = async() => {
    const ip = getIp()
    const url = 'http://www.variflight.com/sitemap/flight?AE71649A58c77='
    try {
        const urllist = []
        const body = await reptile(url, ip)
        const e = cheerio.load(body.text)
        const list = e('#wrap > div')
        for (let i = 0; i < list.length; i++) {
            const ee = cheerio.load(list[i])
            const eee = ee('a')
            for (let j = 0; j < eee.length; j++) {
                const url = eee[j].attribs.href
                urllist.push('http://www.variflight.com' + url)
            }
        }
        return urllist
    } catch (e) {
        error.push(url)
        console.log(`页面${url}爬取错误:${e},错误数量${error.length}`)
    }
}

// 写入每个页面航班数据
const getFlightData = async(url, ws) => {
    const ip = getIp()
    try {
        const body = await reptile(url, ip)
        const e = cheerio.load(body.text)
        const list = e('#list > li')
        for (let j = 0; j < list.length; j++) {
            const ee = cheerio.load(list[j])
            const o = {}
            o.company = ee('div > span.w260 > b > a:nth-child(1)').text()
            o.fightNo = ee('div > span.w260 > b > a:nth-child(2)').text()
            o.depart = ee('div > span:nth-child(4)').text()
            o.arrive = ee('div > span:nth-child(7)').text()
            ws.write(JSON.stringify(o) + ',\n')
        }
    } catch (e) {
        error.push(url)
        console.log(`页面${url}爬取错误:${e},错误数量${error.length}`)
        console.log('尝试再次爬取')
        await getFlightData(url, ws)
    }
}

// 压缩gzip包
const getZip = path => {
    const rs = fs.createReadStream(path)
    const zip = fs.createWriteStream(path + '.gz')
    rs.pipe(createGzip()).pipe(zip)
}


const _main = async path => {
    console.log('创建写入文件' + path)
    const ws = fs.createWriteStream(path)
    ws.write('{ "flight": [')

    console.log('开始获取需要爬取页面')
    const urllist = await getUrlList()
    console.log('获取成功:' + urllist.length + '个页面需要爬取')

    for (let i = 0; i < urllist.length; i++) {
        const url = urllist[i]
        // await sleep(100)
        await getFlightData(url, ws)
        console.log(`页面${url}爬取成功,已爬取${i + 1}个页面`)
    }
    ws.write('{}]}')
    ws.end()
    console.log('爬取结束,爬取失败页面如下:如无重复,表示已经再次爬取成功')
    for (let i = 0; i < error.length; i++) {
        console.log(error[i])
    }
    getZip(path)
}

_main('flight.json')









