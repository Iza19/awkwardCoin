const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculate_hash();
        this.nonce = 0;
    }

    calculate_hash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mine(difficulty) {
        while (this.hash.substring(0, difficulty) !== new Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculate_hash();
        }

        console.log('Block mined : ' + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.create_genesis_block()];
        this.difficulty = 9;
    }

    create_genesis_block() {
        return new Block(0, '01/01/2018', 'Genesis block', '0');
    }

    get_latest_block() {
        return this.chain[this.chain.length - 1];
    }

    add_block(new_block) {
        new_block.previousHash = this.get_latest_block().hash;
        new_block.mine(this.difficulty);
        this.chain.push(new_block);
    }

    valid_chain() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculate_hash() || currentBlock.previousHash !== previousBlock.hash)
                return false
        }
        return true
    }
}

let awkwardCoin = new Blockchain();

console.log('Mining block 1: ');
awkwardCoin.add_block(new Block(1, '01/02/2018', {amount: 9}));
console.log('Mining block 2: ');
awkwardCoin.add_block(new Block(2, '01/03/2018', {amount: 1}));

//console.log(JSON.stringify(awkwardCoin, null, 4));
//console.log('blockchain valid? ' + awkwardCoin.valid_chain());
//awkwardCoin.chain[1].data = { amount: 1000 };
//awkwardCoin.chain[1].hash = awkwardCoin.chain[1].calculate_hash();
//console.log('blockchain valid? ' + awkwardCoin.valid_chain());
