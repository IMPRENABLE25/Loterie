# 🎰 Web3 Lottery DApp

Une application de loterie décentralisée transparente et automatisée, construite avec **Next.js 16**, **Wagmi v2**, et **Chainlink VRF/Automation**.

##  Aperçu
Cette DApp permet aux utilisateurs de participer à une loterie sur le réseau **Sepolia**. 
- **Sécurité** : Le gagnant est choisi de manière aléatoire via Chainlink VRF.
- **Automatisation** : Les tirages sont déclenchés automatiquement par Chainlink Automation.
- Protection contre les doubles entrées, mise à jour en temps réel via les événements blockchain

## Tech Stack
- **Frontend** : Next.js 16 (App Router), Tailwind CSS 4.
- **Web3 Interface** : Wagmi v2, Viem, RainbowKit.
- **Smart Contracts** : Solidity, Chainlink VRF v2.5, Chainlink Automation.
- **Network** : Ethereum Sepolia Testnet.

## ⚙️ Configuration

### Variables d'Environnement
Créez un fichier `.env.local` à la racine :
```env
NEXT_PUBLIC_WC_PROJECT_ID=votre_project_id_walletconnect
NEXT_PUBLIC_LOTTERY_ADDRESS=0x7fE7faE184f570aB5A51bBEAa8D3AB366E80b5E7
```
## Installation 
npm install
npm run dev

