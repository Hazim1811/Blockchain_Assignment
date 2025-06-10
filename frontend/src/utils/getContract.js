// src/utils/getContract.js
import { BrowserProvider, Contract } from "ethers";
import CertificateNFT from "../contracts/CertificateNFT.json";

export async function getContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  // 1) connect to window.ethereum
  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  // 2) get the signer
  const signer = await provider.getSigner();

  // 3) instantiate the contract
  const contract = new Contract(
    process.env.REACT_APP_CONTRACT_ADDRESS,
    CertificateNFT.abi,
    signer
  );

  return { provider, signer, contract };
}