/**
 * @class Bloom
 * @method save
 * @method check
 * 
 * @return {class} new Class
 */
class Bloom {
    /**
     * @constructor
     * @param {buffer} LOAD load saved bloom filter otherwise create new one
     * @param {number} HASHES number of hashes to run each item 
     * @param {number} ARRAY_LENGTH array length in bytes
     */
    constructor(LOAD = undefined, HASHES = 3, ARRAY_LENGTH = 0) {
        if(LOAD == undefined) {
            this.ARRAY_LENGTH = ARRAY_LENGTH
            this.BLOOM_FILTER = Array(ARRAY_LENGTH).fill(0)
        } else {
            this.BLOOM_FILTER = Array.from(LOAD)
            this.ARRAY_LENGTH = this.BLOOM_FILTER.length
        }
        this.HASHES = HASHES
    }

    /**
     * save values into the bloom filter
     * @param {string} item 
     * 
     * @returns {array} [digests]
     */
    save(item) {
        let digests = []
        for(let i = 0; i < this.HASHES; i++) {
            try {
                let hash = Bun.hash.murmur32v3(item, i) //murmur.murmur3(item, i)
                let idx =  hash % this.ARRAY_LENGTH
                this.BLOOM_FILTER[idx] = 1
                digests.push(idx)
            } catch (error) {
                throw error
                break
            }
        }
        return digests
    }

    /**
     * Check for item againts bloom filter
     * @param {string} item 
     * 
     * @returns {boolean} true/false
     */
    check(item) {
        let taken = 0
        for (let i = 0; i < this.HASHES; i++) {
            let hash = Bun.hash.murmur32v3(item, i)
            let idx =  hash % this.ARRAY_LENGTH
            if(this.BLOOM_FILTER[idx]) {
                taken++
            }
        }
        return (taken == this.HASHES)
    }
}

/**
 * calculate optimal size for bloomfilter from number of items to store 
 * and desired false positive percentage
 * 
 * @param {number} items
 * @param {float} fp
 * 
 * @returns {number} size
 */
getSize = (items, fp) => Math.floor(-(items * Math.log(fp))/(Math.log(2)**2))

/**
 * Calculate optimal hash count from bloom filter size and  the 
 * number of items to store
 * 
 * @param {number} size
 * @param {number} items
 * 
 * @return {number} hashes
 */
getHashCount = (size, items) => Math.floor((size/items) * Math.log(2))

module.exports = Bloom
module.exports.getSize = getSize
module.exports.getHashCount = getHashCount