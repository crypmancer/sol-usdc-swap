import toast from "react-hot-toast";
import swapToken from "../utils/swapToken";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useState } from "react";

const Home = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { setVisible } = useWalletModal();

  const [amount, setAmount] = useState(0);

  const onClick = async () => {
    if (wallet.connected) {
      await swapToken(connection, wallet, amount);
    } else {
      toast.error("Wallet is not connected!");
    }
  };

  const handleWalletConnect = async () => {
    if (wallet.connected) {
      wallet.disconnect()
    } else {
      setVisible(true)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "30px",
      }}
    >
      <div>
        <button onClick={onClick}>Swap Token</button>
        <input type="number" step={0.0001} value={amount} onChange={(e: any) => setAmount(e.target.value)} placeholder="Input sol amount!" style={{width: '100px'}} /> sol
      </div>
      <button onClick={handleWalletConnect}>{wallet.connected?"DisConnect":"Connect"}</button>
    </div>
  );
};

export default Home;
