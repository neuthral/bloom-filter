const Bloom = require('../index.js')
const nReadlines = require('n-readlines')
const yargs = require('yargs')
const fs = require('fs')

const options = yargs
 .usage(' ')
 .usage('Usage: -f <filename> -i <num items> -p <false positive> -s <savefile>')
 .usage(' ')
 .usage('this tool calculates the optimal hash count and array length in bytes')
 .usage('from -i items and -p false positive percentage')
 .option('f', { alias: 'filename',       describe: 'values.txt', type: 'string', demandOption: true })
 .option('i', { alias: 'items',          describe: '10000',      type: 'number', demandOption: true })
 .option('p', { alias: 'falsePositives', describe: '0.001, false positive percentage in float', type: 'float',  demandOption: true })
 .option('s', { alias: 'savefile',       describe: 'bloom.bin, overt to run simulation', type: 'string', demandOption: false })
 .argv;

//const greeting = `Hello, ${options.filename}!`
//console.log(greeting)

const ITEMS = options.items
const FALSE_POS = options.falsePositives
const ARRAY_LENGTH = Bloom.getSize(ITEMS, FALSE_POS)
const HASH_FUNCTIONS = Bloom.getHashCount(ARRAY_LENGTH, ITEMS)

let filter = new Bloom(undefined, HASH_FUNCTIONS, ARRAY_LENGTH)
const openFile = new nReadlines(options.filename)

let idxs
while (line = openFile.next()) {
    idxs = filter.save(line.toString('ascii'))
    if(!options.savefile) console.log(idxs, line.toString('ascii'))
}

if(options.savefile) {
    try {
        fs.writeFileSync(options.savefile, Buffer.from(filter.BLOOM_FILTER))
        fs.writeFileSync(options.savefile+'.json', JSON.stringify({
            file: options.savefile,
            items: ITEMS,
            falsePos: FALSE_POS,
            hashes: HASH_FUNCTIONS,
            size: ARRAY_LENGTH
        }))
        console.log('saved', options.savefile, 'and metadata', options.savefile+'.json')
    } catch (error) {
        console.error(error)
    }
}
console.log('Array length in bytes', filter.ARRAY_LENGTH, 'Hash count', filter.HASHES)
const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

//let savedBloom = fs.readFileSync('./frank.bin')

