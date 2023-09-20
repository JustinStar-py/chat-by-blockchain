import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Chat from './components /Chat';
import App from './App';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, polygon } from 'wagmi/chains'

const chains = [arbitrum, mainnet, polygon]
const projectId = '824db33d55d77991289fffda032dfbfc'

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

ReactDOM.render(
    <BrowserRouter>
       <WagmiConfig config={wagmiConfig}>
          <Switch>
                  <Route exact path="/" component={App}/>
                  <Route exact path="/chat" component={Chat}/>
          </Switch>
       </WagmiConfig>
       <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </BrowserRouter>,
    document.getElementById('root')
);