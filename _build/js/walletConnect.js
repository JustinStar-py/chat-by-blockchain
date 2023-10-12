import msgFactoryAbi from "../json/msg-factory-abi.json" assert { type: 'json' };

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;
const Web3 = window.Web3
const contractAddress = "0xa0b09cbEf5416677e325019424b77de2206CE76A";

let web3Modal;
let provider;

export let selectedAccount;
export let isConnected = false;
export let web3;
export let contract;

function init() {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "88a671205efd2627677b2d44e387f20b",
      }
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        // Mikko's TESTNET api key
        key: "pk_test_391E26A3B43A3350"
      }
    }
  };

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });
}

async function onConnect() {
  try {
     await web3Modal.connect().then(async (provider) => {
              // Get a Web3 instance for the wallet
        web3 = new Web3(provider);
        contract = new web3.eth.Contract(msgFactoryAbi,contractAddress);

        const accounts = await web3.eth.getAccounts();

        selectedAccount = accounts[0];
        isConnected = true;

        $("#connect-btn").text("connected").prop('disabled', true);
        $('#addr-input-disable').val(selectedAccount).prop('disabled', true)
     })
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }
}

async function onDisconnect() {

  console.log("Killing the wallet connection", provider);

  // TODO: Which providers have close method?
  if(provider.close) {
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = null;
  }

  selectedAccount = null;
}

// Initialize Web3
window.addEventListener('DOMContentLoaded', () => {
    init();
    $("#connect-btn").click(async function() {
      await onConnect()
    });
});
