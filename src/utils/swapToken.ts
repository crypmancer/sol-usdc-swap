import { Connection, VersionedTransaction } from '@solana/web3.js';
import fetch from 'cross-fetch';
import { WalletContextState } from '@solana/wallet-adapter-react';
import toast from 'react-hot-toast';

const swapToken = async (connection: Connection, wallet: WalletContextState, amount: number) => {
    console.log("connection => ", connection)
    const amountStr = (amount * 10 ** 9).toString();
    const fetchUri = `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=${amountStr}&slippageBps=50`
    
    try {
        
        // Swapping SOL to USDC with input 0.1 SOL and 0.5% slippage
        const quoteResponse = await (
          await fetch(fetchUri)
        ).json();
    
        console.log('quote response => ', quoteResponse)
        
        // get serialized transactions for the swap
        const { swapTransaction } = await (
          await fetch('https://quote-api.jup.ag/v6/swap', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              // quoteResponse from /quote api
              quoteResponse,
              // user public key to be used for the swap
              userPublicKey: wallet.publicKey!.toString(),
              // auto wrap and unwrap SOL. default is true
              wrapAndUnwrapSol: true,
              // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
              // feeAccount: "fee_account_public_key"
            })
          })
        ).json();
        
        // deserialize the transaction
        const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
        var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
        console.log(transaction);
        
        // sign the transaction
        await wallet.signTransaction!(transaction);
    
        // send and confirm
        const signature = await wallet.sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, "confirmed");
    
        const log = `\x1b[32mTransaction Success!🎉\nhttps://solscan.io/tx/${signature}`;
        console.log(log);
        toast.success("Token swap success!")
    } catch (error) {
        console.log("token swapping error => ", error);
        toast.error("Transaction failed!")
    }

}

export default swapToken