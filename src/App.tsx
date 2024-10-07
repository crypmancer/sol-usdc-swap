import { useMemo } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

//import page components
import Home from "./pages/Home";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { Toaster } from "react-hot-toast";
import "@solana/wallet-adapter-react-ui/styles.css";

function App() {
  const network = WalletAdapterNetwork.Mainnet;

  const walletLists = useMemo(
    () => [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={import.meta.env.VITE_RPC_ENDPOINT}>
      <WalletProvider wallets={walletLists} autoConnect>
        <WalletModalProvider>
          <HashRouter>
            <Routes>
              <Route path="/" Component={Home} />
            </Routes>
            <Toaster position="top-right" />
          </HashRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
