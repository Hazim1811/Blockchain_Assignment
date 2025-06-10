// backend/scripts/uploadMetadata.js
import { NFTStorage, File } from 'nft.storage'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

async function main() {
  const client = new NFTStorage({ token: process.env.NFT_STORAGE_KEY })
  const metadata = await client.store({
    name: "Certificate Name",
    description: "Awarded for ...",
    student: "0x...",
    grade: "A+",
    issuedAt: new Date().toISOString(),
    // you can also attach a file:
    // image: new File([await fs.promises.readFile(path.join(__dirname,'../cert.png'))], 'cert.png', { type: 'image/png' })
  })
  console.log("📦 IPFS metadata URI:", metadata.url)
}

main().catch(console.error)
