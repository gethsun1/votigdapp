const { SecretNetworkClient, Wallet } = require("secretjs");
const dotenv = require("dotenv");
dotenv.config({ path: "../../polygon/.env" });

const wallet = new Wallet(process.env.MNEMONIC);

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://lcd.pulsar-3.secretsaturn.net",
  wallet: wallet,
  walletAddress: wallet.address,
});

// secret contract info
let contractCodeHash = process.env.CODE_HASH;
let contractAddress = process.env.SECRET_ADDRESS;

let get_keys = async () => {
  try {
    let query = await secretjs.query.compute.queryContract({
      contract_address: contractAddress,
      query: {
        get_keys: {},
      },
      code_hash: contractCodeHash,
    });

    if (query && query.public_key) {
      const publicKeyString = query.public_key.join(",");
      console.log(publicKeyString);
    } else {
      console.error("Public key not found in the query result.");
    }

  } catch (error) {
    console.error("Error querying the contract:", error.message);
  }
};

get_keys();













