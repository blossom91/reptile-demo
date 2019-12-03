const fs = require('fs')
const data = require('./allunivlist')
const { createGzip } = require('zlib')
const arr = data.allUnivList
// console.log(data)
// console.log(arr[0].provs[0].univs)
// console.log(arr[1].univs)
let list = []
for (let index = 0; index < arr.length; index++) {
    const e = arr[index]
    if (e.univs instanceof Array) {
        for (let i = 0; i < e.univs.length; i++) {
            const m = e.univs[i]
            // console.log(m)
            if (m.name) {
                list.push(m.name)
            }
        }
    } else if (e.provs instanceof Array) {
        for (let j = 0; j < e.provs.length; j++) {
            const n = e.provs[j]
            if (n.univs instanceof Array) {
                for (let k = 0; k < n.univs.length; k++) {
                    const g = n.univs[k]
                    if (g.name) {
                        list.push(g.name)
                    }
                }
            }
        }
    }
}

const writeData = (list, path) => {
    fs.writeFileSync(path, JSON.stringify(list, null, 2))
    const rs = fs.createReadStream(path)
    const ws = fs.createWriteStream(path + '.gz')
    rs.pipe(createGzip()).pipe(ws)
}
writeData(list, './allunivlist.json')
