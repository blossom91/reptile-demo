// 模拟真实游览器获取数据的爬取方法
const http = require('http')
const https = require('https')
// chrome 环境工具
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
// 异步函数转换promise函数
const { promisify } = require('util')

// 爬取资源是url的处理函数
const urlToImg = promisify(url => {
    // 判断什么格式开头
    const mod = /^https:/.test(url) ? https : http
    // 获取扩展名
    const ext = path.extname(url)
    // 拼接文件名
    const file = path.join(__dirname, 'images', `${Date.now()}${ext}`)
    // 请求获取文件流写入文件,结束的时候打印
    mod.get(url, res => {
        res.pipe(fs.createWriteStream(file)).on('finish', () => {
            console.log(file)
        })
    })
})
// 爬取资源是base64的处理函数
const base64ToImg = async base64Str => {
    // promise化writeFile函数
    const writeFile = promisify(fs.writeFile)
    // base64格式开头一般是data:image/jpeg;base64,/content...   依据此分割
    const matches = base64Str.match(/^data:(.+?);base64,(.+)$/)
    // 获取扩展名
    const ext = matches[1].split('/')[1].replace('jpeg', 'jpg')
    // 拼接文件名
    const file = path.join(__dirname, 'images', `base64${Date.now()}.${ext}`)
    // 将base64格式的数据写入文件
    try {
        await writeFile(file, matches[2], 'base64')
        console.log(file)
    } catch (e) {
        console.log('读取文件错误')
    }
}

// 爬取逻辑
const reptile = async() => {
    // 创建一个beowser服务
    const browser = await puppeteer.launch()
    // 打开一张页面
    const page = await browser.newPage()
    // 前往爬取网址
    await page.goto('https://image.baidu.com/')
    // 设置宽高
    await page.setViewport({
        width: 1920,
        height: 1080
    })
    console.log('reset viewport')
    // 获取输入框焦点
    await page.focus('#kw')
    // 输入
    await page.keyboard.sendCharacter('狗')
    // 点击搜索
    await page.click('.s_search')
    console.log('go to search list')
    // 页面加载结束触发
    page.on('load', async() => {
        console.log('page loading done, start fetch...')
        // 返回查询数组
        const srcs = await page.evaluate(() => {
            const images = document.querySelectorAll('img.main_img')
            return Array.prototype.map.call(images, img => img.src)
        })
        console.log(`get ${srcs.length} images, start download`)
        // 根据src不同分别处理
        srcs.forEach(async src => {
            await page.waitFor(200)
            // 正则匹配  返回bool
            if (/\.(jpg|png|gif)$/.test(src)) {
                await urlToImg(src)
            } else {
                await base64ToImg(src)
            }
        })
        // 关闭beowser服务
        await browser.close()
    })
}

reptile()