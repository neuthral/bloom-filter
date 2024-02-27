const Bloom = require('../index.js')
const fs = require('fs')

const metaData = JSON.parse(fs.readFileSync('./words.json'))
const savedFilter = fs.readFileSync(metaData.file)
const filter = new Bloom(savedFilter, metaData.hashes)

const searchValues = [
    "innovation's", "bluring", "stuccos", "knifed", "mestizoes", "unhappiest",
    "Bester", "brashest", "vacter", "mutilate"
]

// values bluring, Bester and vacter shold show as false
searchValues.forEach(item => {
    let res = filter.check(item)
    console.log(res, item)
})
