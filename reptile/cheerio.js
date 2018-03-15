// 引用2个库 第一个用于下载网页  第二个用于解析网页
const request = require('sync-request')
const cheerio = require('cheerio')
const fs = require('fs')
// 定义需要的类
class Movie {
    constructor() {
        this.name = ''
        this.score = 0
        this.quote = ''
        this.ranking = 0
        this.coverUrl = ''
        this.ratings = 0
        this.year = ''
        this.area = ''
        this.type = ''
    }
}

// 处理每个数据获取需要的内容
const movieFromDiv = function(d) {
    const e = cheerio.load(d)
    // 获取数据
    const movie = new Movie()
    movie.name = e('.title').text()
    movie.score = e('.rating_num').text()
    movie.quote = e('.inq').text()
    movie.ratings = e('.star')
        .find('span')
        .last()
        .text()
        .slice(0, -3)
    const pic = e('.pic')
    movie.ranking = pic.find('em').text()
    movie.coverUrl = pic.find('img').attr('src')
    const bd = e('.bd')
        .find('p:first-child')
        .text()
        .split('\n')
    movie.year = Number(bd[bd.length - 2].split('/')[0])
    movie.area = bd[bd.length - 2].split('/')[1].slice(1, 3)
    movie.type = bd[bd.length - 2].split('/')[2].slice(1, 3)
    return movie
}

// 读取页面
const saveUrl = function() {
    const path = 'douban.html'
    const exists = fs.existsSync(path)
    // 如果文件存在直接读取
    if (exists) {
        const data = fs.readFileSync(path)
        return data
    } else {
        // 不存在创建文件下载top250所有内容
        fs.writeFileSync(path, '')
        for (let i = 0; i < 10; i++) {
            const num = i * 25
            const url = 'https://movie.douban.com/top250?start=' + num
            const r = request('GET', url)
            const body = r.getBody('utf-8')
            fs.appendFileSync(path, body)
        }
        return fs.readFileSync(path)
    }
}

// 处理页面
const movieFromUrl = function() {
    const body = saveUrl()
    // 格式化处理body为可操作dom
    const e = cheerio.load(body)
    const movieDivs = e('.item')
    const movies = []
    for (let i = 0; i < movieDivs.length; i++) {
        // 获取每个item的html
        const div = movieDivs[i]
        const d = e(div).html()
        const m = movieFromDiv(d)
        movies.push(m)
    }
    return movies
}

// 保存爬虫资料
const saveMovie = function(movies) {
    const s = JSON.stringify(movies, null, 2)
    const path = 'douban.txt'
    fs.writeFileSync(path, s)
}

// 图片下载
const downloadCovers = function(movies) {
    const images = fs.readdirSync('images').length
    if (images >= 250) {
        return
    } else {
        const request = require('request')
        for (let i = 0; i < movies.length; i++) {
            const m = movies[i]
            const url = m.coverUrl
            const name = m.name.split('/')[0] + '.jpg'
            const path = 'images/' + name
            request(url).pipe(fs.createWriteStream(path))
        }
    }
}

const _main = function() {
    const movies = movieFromUrl()
    saveMovie(movies)
    downloadCovers(movies)
}

_main()
