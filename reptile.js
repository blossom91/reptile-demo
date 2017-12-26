// 模拟真实游览器获取数据的爬取方法
// chrome 环境工具
const puppeteer = require('puppeteer')
const fs = require('fs')

var flight = { flight: [] }
// const ws = fs.createWriteStream('./json.json')
// ws.write('{ "flight": [')
// 爬取逻辑
const reptile = async() => {
    // 创建一个beowser服务
    // const browser = await puppeteer.launch({ headless: false })
    const browser = await puppeteer.launch()
    // 打开一张页面
    const page = await browser.newPage()

    await page.goto('http://www.variflight.com/sitemap/flight?AE71649A58c77=')

    console.log('load end')

    for (var i = 1; i <= 60; i++) {
        for (var j = 1; j <= 59; j++) {
            var url = await page.$eval(`#wrap > div:nth-child(${i}) > a:nth-child(${j})`, el => el.href)
            flight.flight.push(url)
        }
    }
    console.log(flight.flight.length)
    fs.writeFileSync('url.json', JSON.stringify(flight, null, 2))

    // console.log(urllist.length)
    // for (var i = 0; i < urllist.length; i++) {
    //     await page.goto(urllist[i])
    //     await page.waitFor(2 * 1000)
    //     console.log('goto:', urllist[i])
    //     const list = await page.$$eval('#list > li', divs => divs.length)
    //     for (var j = 1; j <= list; j++) {
    //         const o = {}
    //         o.company = await page.$eval(`#list > li:nth-child(${j}) > div > span.w260 > b > a:nth-child(1)`, el => el.innerHTML)
    //         o.fightNo = await page.$eval(`#list > li:nth-child(${j}) > div > span.w260 > b > a:nth-child(2)`, el => el.innerHTML)
    //         o.depart = await page.$eval(`#list > li:nth-child(${j}) > div > span:nth-child(4)`, el => el.innerHTML)
    //         o.arrive = await page.$eval(`#list > li:nth-child(${j}) > div > span:nth-child(7)`, el => el.innerHTML)
    //         ws.write(JSON.stringify(o) + ',\n')
    //     }
    // }
    // 设置宽高
    // await page.setViewport({
    //     width: 1920,
    //     height: 1080
    // })
    // console.log('end')
    // ws.write(']}')
    // ws.end()
    // await browser.close()
}

reptile()