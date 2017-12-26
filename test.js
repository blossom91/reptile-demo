// Nodejs  模拟IP 爬取图片

const cheerio = require('cheerio')
const _ = require('underscore')
const superagent = require('superagent')
const fs = require('fs')

const urllist = require('./url.json').flight

const ws = fs.createWriteStream('./json.json')
ws.write('{ "flight": [')
// 3572
const reptile = () => {
    for (var i = 0; i < urllist.length; i++) {
        const url = urllist[i]
        const ip = _.random(1, 254)
        + '.' + _.random(1, 254)
        + '.' + _.random(1, 254)
        + '.' + _.random(1, 254)
        superagent.get(url).set('X-Forwarded-For', ip).end((err, body) => {
            if (err) {
                console.log('error:', url)
                return
            }
            const e = cheerio.load(body.text)
            const list = e('#list > li')

            for (var j = 0; j < list.length; j++) {
                var ee = cheerio.load(list[j])
                const o = {}
                o.company = ee('div > span.w260 > b > a:nth-child(1)').text()
                o.fightNo = ee('div > span.w260 > b > a:nth-child(2)').text()
                o.depart = ee('div > span:nth-child(4)').text()
                o.arrive = ee('div > span:nth-child(7)').text()
                ws.write(JSON.stringify(o) + ',\n')
            }
        })
    }
}
reptile()









