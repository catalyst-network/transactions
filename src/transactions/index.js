import Web3 from 'web3';

async function loadProvider() {
    const mnemonic = 'silly funny task remove diamond maximum rack awesome sting chalk recycle also social banner verify';
    const { HDWalletProvider } = (await import('@catalyst-net-js/truffle-provider'));
    return new HDWalletProvider(mnemonic, 'http://localhost:5005/api/eth/request');
}

async function loadTxLib() {
    return import('@catalyst-net-js/tx');
}

const RandExp = require('randexp');
const { numberToHex, toWei, bytesToHex } = Web3.utils;

// export async function sendTransaction(to, value, gasPrice, gasLimit) {
//     const provider = (await loadProvider());
//     const web3 = new Web3(provider);
//     const address = provider.getAddress(0);
//     console.log(address);

//     await web3.eth.sendTransaction({
//     from: address,
//     to: to,
//     value: numberToHex(toWei(value.toString(), 'ether')),
//     gasPrice: numberToHex(toWei(gasPrice.toString(), 'gwei')),
//     gasLimit: numberToHex(gasLimit),
//     data: '0x0',
//     }, function(error, hash){
//     if(error) console.error(error);
//     console.log('Hash: ', hash);
//     return hash;
//     });
// }

const web3 = new Web3('http://localhost:5005/api/eth/request');

function broadcastTransaction(raw) {
    return new Promise((resolve, reject) => {
        web3.eth.sendSignedTransaction(raw, function (error, hash) {
            if (error)
                reject(error);
            console.log('Hash: ', hash);
            return resolve(hash);
        });
    });
}

async function constructTransaction(nonce, gasPrice, gasLimit, to, value) {
    const { Transaction } = (await loadTxLib());
    const tx = new Transaction({
        nonce: `0x${parseInt(nonce, 16)}`,
        gasPrice: numberToHex(toWei(gasPrice.toString(), 'gwei')),
        gasLimit: numberToHex(gasLimit),
        to: to,
        value: numberToHex(toWei(value.toString(), 'ether')),
        data: '0x0',
    });
    return tx;
}

export async function sendRawTransaction(to, value, gasPrice, gasLimit) {

    const provider = (await loadProvider());
    const address = provider.getAddress(0);
    const nonce = await web3.eth.getTransactionCount(address);

    // Construct transaction
    const tx = await constructTransaction(nonce, gasPrice, gasLimit, to, value);

    await tx.sign(provider.wallets[address].getPrivateKey());

    const raw = bytesToHex(tx.serialize());

    // broadcast transaction
    return broadcastTransaction(raw);

}

export async function spamTransactions(transactionsNo) {
    const provider = (await loadProvider());
    const address = provider.getAddress(0);
    const nonce = await web3.eth.getTransactionCount(address);
    // const accounts = web3.eth.getAccounts(console.log);
    

    let transactions = [];
    for (let i = 0; i < transactionsNo; i++) {
        let to = new RandExp("^0x[0-9a-fA-F]{40}$").gen(); //'0x91470b2c2ab22f6eccf7b347138a43c781b8b831'
        // console.log(to);
        const tx = await constructTransaction(
            nonce, (3 + 4 * Math.random()).toFixed(2),
            (21005 + 3000 * Math.random()).toFixed(0),
            to,
            (0.05 + 0.1 * Math.random()).toString()
        );

        await tx.sign(provider.wallets[address].getPrivateKey());
        transactions.push(broadcastTransaction(bytesToHex(tx.serialize())));
    }

    return transactions;
}

