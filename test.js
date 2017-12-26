// Nodejs  模拟IP 爬取图片

var _ = require('underscore')
var cheerio = require('cheerio')
var superagent = require('superagent')
var async = require('async')
var mkdirp = require('mkdirp')
var fs = require('fs')
var http = require('http')
var urllist = require('./url.json').flight


// var dir = './test'


console.log(urllis.length)
// 创建目录
// mkdirp(dir, err => {
//     if (err) {
//         console.log(err)
//     }
// })

for (var i = 0; i < urllis.length; i++) {
    var url = urllis[i]
    var ip = _.random(1, 254)
    + '.' + _.random(1, 254)
    + '.' + _.random(1, 254)
    + '.' + _.random(1, 254)
    superagent
        .get(url)
        .set('X-Forwarded-For', ip)
        .end((err, body) => {
            if (err) {
                console.log(err)
                return
            }
            console.log(url)
            //     const list = await page.$$eval('#list > li', divs => divs.length)
            //     for (var j = 1; j <= list; j++) {
            //         const o = {}
            //         o.company = await page.$eval(`#list > li:nth-child(${j}) > div > span.w260 > b > a:nth-child(1)`, el => el.innerHTML)
            //         o.fightNo = await page.$eval(`#list > li:nth-child(${j}) > div > span.w260 > b > a:nth-child(2)`, el => el.innerHTML)
            //         o.depart = await page.$eval(`#list > li:nth-child(${j}) > div > span:nth-child(4)`, el => el.innerHTML)
            //         o.arrive = await page.$eval(`#list > li:nth-child(${j}) > div > span:nth-child(7)`, el => el.innerHTML)
            //         ws.write(JSON.stringify(o) + ',\n')
            //     }
            var e = cheerio.load(body.text)
            var list = e('#list > li')
            var data = []
            for (var i = 0; i < list.length; i++) {
                // 获取每个item的html
                var div = movieDivs[i]
                var d = e(div).html()
                var m = movieFromDiv(d)
                movies.push(m)
            }
            // fs.writeFile(dir + '/' + name, sres.body, 'binary', err => {
            //     if (err) throw err
            //     console.log('file saved ' + name)
            //     cb()
            // })
        })
}



// 本地存储目录


var imgList = new Array()


var url = 'http://www.easyicon.net/iconsearch/iconset:flatastic-icons'
// getData(url)

console.log(imgList.length)


function getData(url) {
    console.log('url', url)

    superagent.get(url).end((err, sres) => {
        if (err) {
            console.log(err)
            return
        }

        var $ = cheerio.load(sres.text)
        var pages_all = $('.pages_all')
        var thisPage = pages_all.find('span')
        var next = thisPage.next()

        var liList = $('#container').find('ol').find('li')

        var pages = new Array()
        _.each(liList, (item, index) => {
            if (index == 0) {
                return
            }
            var href = $(item).find('a').eq(0).attr('href')
            // 获取数据，下载
            // getHtml(href);

            pages.push(href)
        })

        console.log(pages.length)

        async.eachSeries(pages, (item, callback) => {
            console.log('-一轮结束111-')
            getHtml(item, () => {
                console.log('-一轮结束22-')
                callback(null)
            })
        }, (err, result) => {
            if (err) {
                console.log('-一轮结束-' + err)
            }

            console.log('-一轮结束-')
            var href = next.attr('href')
            if (href) {
                href = 'http://www.easyicon.net' + href
                getData(href)
            }
        })
    })
}


var getHtml = function(href, getHtmlCB) {
    var temp = 'http://www.easyicon.net' + href

    console.log(temp)

    superagent.get(temp).end((err, sres) => {
        if (err) {
            console.log(err)
            return
        }

        var $ = cheerio.load(sres.text)

        var name = $('.icon_img_one').find('img').attr('alt')
        if (name) {
            name = name.replace(/ /g, '_')
        }

        var a96 = $('img[width=96]').parent().find('a').eq(0)
        var href96 = a96.attr('href')

        var a64 = $('img[width=64]').parent().find('a').eq(0)
        var href64 = a64.attr('href')

        var a32 = $('img[width=32]').parent().find('a').eq(0)
        var href32 = a32.attr('href')

        // saveImg(href96 , dir , name + "@3x.png" );
        // saveImg(href64 , dir , name + "@2x.png" );
        // saveImg(href32 , dir , name + ".png" );

        console.log('---')

        async.parallel(
            [function(cb) {
                console.log('---11')
                saveImagea(href96, dir, name + '@3x.png', () => {
                    cb(null)
                })
            },
            function(cb) {
                saveImagea(href64, dir, name + '@2x.png', () => {
                    cb(null)
                })
            },
            function(cb) {
                saveImagea(href32, dir, name + '.png', () => {
                    cb(null)
                })
            }
            ], (err, results) => {
                if (err) {
                    console.log('下载出错')
                }

                getHtmlCB()
            })
    })
}


var saveImagea = function(url, dir, name, cb) {
    var ip = _.random(1, 254)
    + '.' + _.random(1, 254)
    + '.' + _.random(1, 254)
    + '.' + _.random(1, 254)

    console.log(url, ip)
    superagent
        .get(url)
        .set('X-Forwarded-For', ip)
        .end((err, sres) => {
            if (err) {
                console.log(err)
                return
            }sres
            // console.log(sres.body);
            fs.writeFile(dir + '/' + name, sres.body, 'binary', err => {
                if (err) throw err
                console.log('file saved ' + name)
                cb()
            })
        })
}



function saveImg(url, dir, name, cb) {
    http.get(url, res => {
        res.setEncoding('binary')
        var data = ''
        res.on('data', chunk => {
            data += chunk
        })
        res.on('end', () => {
            fs.writeFile(dir + '/' + name, data, 'binary', err => {
                if (err) throw err
                console.log('file saved ' + name)

                console.log('---')

                cb()
            })
        })
    }).on('error', e => {
        console.log('error' + e)
        cb()
    })
}
