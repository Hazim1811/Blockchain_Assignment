// src/App.js
import React, { useState, useEffect } from "react";
import { toUtf8Bytes, keccak256, getBytes } from "ethers";
import { getContract } from "./utils/getContract";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const ISSUER_ROLE   = keccak256(toUtf8Bytes("ISSUER_ROLE"));
const VERIFIER_ROLE = keccak256(toUtf8Bytes("VERIFIER_ROLE"));

function App() {
  // Connection & role state
  const [account, setAccount] = useState("");
  const [status, setStatus]   = useState("");

  // Grant Issuer form
  const [grantAddr, setGrantAddr] = useState("");

  // Mint form
  const [mintData, setMintData] = useState({ student: "", uri: "" });

  // View form & results
  const [viewId, setViewId]         = useState("");
  const [viewResult, setViewResult] = useState(null);
  const [viewMeta, setViewMeta]     = useState(null);

  // Verify form & result
  const [verifyId, setVerifyId]     = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  // Auto-connect on mount
  useEffect(() => {
    connectWallet();
  }, []);

  // — connect to MetaMask + show roles —
  async function connectWallet() {
    try {
      const { signer, contract } = await getContract();
      const addr = await signer.getAddress();
      setAccount(addr);

      // check roles
      const isAdmin    = await contract.hasRole(await contract.DEFAULT_ADMIN_ROLE(), addr);
      const isIssuer   = await contract.hasRole(ISSUER_ROLE, addr);
      const isVerifier = await contract.hasRole(VERIFIER_ROLE, addr);

      setStatus(
        `Connected as ${addr} ` +
        `${isAdmin    ? "[Admin]"    : ""} ` +
        `${isIssuer   ? "[Issuer]"   : ""} ` +
        `${isVerifier ? "[Verifier]" : ""}`
      );
    } catch (e) {
      setStatus("❌ " + e.message);
    }
  }

  // — 1) Grant Issuer Role (Admin only) —
  async function onGrantIssuer(e) {
    e.preventDefault();
    setStatus("⏳ Granting ISSUER_ROLE…");
    try {
      const { signer, contract } = await getContract();
      const tx = await contract.connect(signer).grantRole(ISSUER_ROLE, grantAddr);
      await tx.wait();
      setStatus(`✅ ISSUER_ROLE granted to ${grantAddr}`);
      setGrantAddr("");
    } catch (e) {
      setStatus("❌ " + e.message);
    }
  }

  // — 2) Mint Certificate (Issuer only) —
  async function onMint(e) {
    e.preventDefault();
    setStatus("⏳ Minting certificate…");
    try {
      const { signer, contract } = await getContract();
      // hash + sign URI
      const digestHex   = keccak256(toUtf8Bytes(mintData.uri));
      const digestBytes = getBytes(digestHex);
      const sig = await signer.signMessage(digestBytes);

      // callStatic to get the new tokenId
      const newId = await contract.callStatic.mintCertificate(
        mintData.student, mintData.uri, sig
      );

      // send the real tx
      const txRes = await contract.connect(signer).mintCertificate(
        mintData.student, mintData.uri, sig
      );
      await txRes.wait();

      setStatus(`✅ Minted token #${newId.toString()}`);
      setMintData({ student: "", uri: "" });
    } catch (e) {
      setStatus("❌ " + e.message);
    }
  }

  // — 3) View Certificate & fetch off-chain JSON —
  async function onView(e) {
    e.preventDefault();
    setStatus("⏳ Loading certificate…");
    try {
      const { signer, contract } = await getContract();
      // on-chain data
      const [uri, issuer, tsBig, signature] =
        await contract.connect(signer).viewCertificate(viewId);

      // off-chain fetch
      const url = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
      const metadata = await fetch(url).then(r => r.json());

      setViewResult({ uri, issuer, issuedAt: new Date(Number(tsBig) * 1000), signature });
      setViewMeta(metadata);
      setStatus("✅ Certificate loaded");
    } catch (e) {
      setStatus("❌ " + e.message);
      setViewResult(null);
      setViewMeta(null);
    }
  }

  // — 4) Verify Certificate (anyone) —
  async function onVerify(e) {
    e.preventDefault();
    setStatus("⏳ Verifying on-chain…");
    try {
      const { signer, contract } = await getContract();
      const ok = await contract.connect(signer).verifyCertificate(verifyId);
      setVerifyResult(ok);
      setStatus(ok ? "✅ Valid signature" : "❌ Invalid signature");
    } catch (e) {
      setStatus("❌ " + e.message);
      setVerifyResult(null);
    }
  }

  return (
    <div className="container py-4">
      <h1>🎓 CertificateNFT DApp</h1>
      <p><b>{status}</b></p>

      {/* 1) Grant Issuer */}
      <section className="my-4 p-3 border">
        <h2>Grant Issuer Role (Admin)</h2>
        <form onSubmit={onGrantIssuer} className="d-flex">
          <input
            className="form-control me-2"
            placeholder="Address to grant"
            value={grantAddr}
            onChange={e => setGrantAddr(e.target.value)}
            required
          />
          <button className="btn btn-success">Grant</button>
        </form>
      </section>

      {/* 2) Mint Certificate */}
      <section className="my-4 p-3 border">
        <h2>Mint Certificate (Issuer)</h2>
        <form onSubmit={onMint}>
          <input
            className="form-control mb-2"
            placeholder="Student Address"
            value={mintData.student}
            onChange={e => setMintData({...mintData, student: e.target.value})}
            required
          />
          <input
            className="form-control mb-2"
            placeholder="Metadata URI"
            value={mintData.uri}
            onChange={e => setMintData({...mintData, uri: e.target.value})}
            required
          />
          <button className="btn btn-primary">Mint</button>
        </form>
      </section>

      {/* 3) View Certificate */}
      <section className="my-4 p-3 border">
        <h2>View Certificate (Student/Verifier/Issuer)</h2>
        <form onSubmit={onView} className="d-flex">
          <input
            className="form-control me-2"
            placeholder="Token ID"
            value={viewId}
            onChange={e => setViewId(e.target.value)}
            required
          />
          <button className="btn btn-secondary">View</button>
        </form>
        {viewResult && (
          <div className="mt-3">
            <p><b>URI:</b> {viewResult.uri}</p>
            <p><b>Issuer:</b> {viewResult.issuer}</p>
            <p><b>Issued:</b> {viewResult.issuedAt.toLocaleString()}</p>
            <p><b>Signature:</b> {viewResult.signature}</p>
            <hr />
            <h5>Off‐Chain Metadata</h5>
            <p><b>Name:</b> {viewMeta.name}</p>
            <p><b>Description:</b> {viewMeta.description}</p>
            <p><b>Grade:</b> {viewMeta.grade}</p>
            <p><b>IssuedAt:</b> {viewMeta.issuedAt}</p>
          </div>
        )}
      </section>

      {/* 4) Verify Certificate */}
      <section className="my-4 p-3 border">
        <h2>Verify Certificate (Anyone)</h2>
        <form onSubmit={onVerify} className="d-flex">
          <input
            className="form-control me-2"
            placeholder="Token ID"
            value={verifyId}
            onChange={e => setVerifyId(e.target.value)}
            required
          />
          <button className="btn btn-warning">Verify</button>
        </form>
        {verifyResult !== null && (
          <p className="mt-3">
            {verifyResult ? "✅ Signature is valid" : "❌ Invalid signature"}
          </p>
        )}
      </section>
    </div>
  );
}

export default App;