const fs = require('fs')
const sky = fs.readFileSync('sky.json')
const data = JSON.parse(sky).flight
const flightNo = []
for (var i = 0; i < data.length; i++) {
    const id = data[i].fightNo
    if (!flightNo.includes(id)) {
        flightNo.push(id)
    }
}
fs.writeFileSync('flightNo.json', JSON.stringify(flightNo))