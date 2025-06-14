const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

async function deployContract(hre) {
    try {
        const [deployer] = await hre.ethers.getSigners();
        console.log("Deploying with account:", deployer.address);

        const TokoDigital = await hre.ethers.getContractFactory("TokoDigital");
        const toko = await TokoDigital.deploy();
        await toko.waitForDeployment();

        const deployedAddress = await toko.getAddress();
        console.log("✅ TokoDigital deployed at:", deployedAddress);

        // Read seeder data
        const seederPath = path.resolve(__dirname, "seeder.json");
        console.log("📄 Reading seeder data from:", seederPath);
        const seederData = JSON.parse(fs.readFileSync(seederPath, "utf8"));

        // Run seeder
        console.log("🌱 Running seeder...");
        for (const product of seederData.products) {
            await toko.tambahProduk(
                product.nama,
                ethers.parseEther(product.harga),
                product.deskripsi,
                product.gambar
            );
        }
        console.log(`🌱 Seeder completed: ${seederData.products.length} products added`);

        // Copy seeder.json to react
        const reactSeederDir = path.resolve(__dirname, "../../react/src/seeders");
        const reactSeederPath = path.join(reactSeederDir, "seeder.json");
        console.log("📁 Copying seeder to:", reactSeederPath);
        if (!fs.existsSync(reactSeederDir)) {
            fs.mkdirSync(reactSeederDir, { recursive: true });
            console.log("📁 Created seeders directory:", reactSeederDir);
        }
        fs.copyFileSync(seederPath, reactSeederPath);
        console.log("📄 Seeder copied to:", reactSeederPath);

        // Save contract artifacts
        const outDir = path.resolve(__dirname, "../../react/src/contracts");
        console.log("📁 Output directory for contract artifacts:", outDir);
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
            console.log("📁 Created output directory:", outDir);
        }

        const addressData = {
            address: deployedAddress,
            network: "localhost",
        };
        const addressPath = path.join(outDir, "contract-address.json");
        fs.writeFileSync(addressPath, JSON.stringify(addressData, null, 2));
        console.log("📄 Saved contract address to:", addressPath);

        const artifactPath = path.resolve(__dirname, "../artifacts/contracts/TokoDigital.sol/TokoDigital.json");
        console.log("📄 Reading artifact from:", artifactPath);
        const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
        const abiData = {
            abi: artifact.abi,
        };
        const abiPath = path.join(outDir, "TokoDigital.json");
        fs.writeFileSync(abiPath, JSON.stringify(abiData, null, 2));
        console.log("📄 Saved ABI to:", abiPath);
    } catch (error) {
        console.error("❌ Failed to deploy contract:", error.message);
        throw error;
    }
}

async function main() {
    try {
        console.log("🚀 Starting deployment...");
        await deployContract(require("hardhat"));
    } catch (error) {
        console.error("❌ Main execution failed:", error.message);
        process.exit(1);
    }
}

main();