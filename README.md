# Herb Supply Chain Traceability App

## Overview
This application provides full traceability for herb batches using blockchain-backed records, QR code integration, and a modern dashboard for farmers, manufacturers, admins, and consumers. It is built with a React frontend and Node.js/Express backend, using MongoDB for data storage and ethers.js for blockchain integration.

## Features
- **Batch Registration:** Farmers can register new herb batches with all details.
- **Blockchain Logging:** Each batch is recorded on the blockchain, storing transaction hash and metadata.
- **Admin Verification:** Admins can verify batches, add remarks, and approve batches.
- **Manufacturer Actions:** Manufacturers can update batch status, add processing details, and track batch lifecycle.
- **Consumer Portal:** Consumers can scan QR codes to view full batch details, including hash, certifications, and lifecycle.
- **QR Code Integration:** Each batch has a QR code linking to its detail page for instant traceability.
- **Certification & Verified Badges:** Batch detail page displays certification badges and a verified badge.
- **Lab Certificate Image:** Batch detail page includes a sample lab certificate image.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Blockchain:** ethers.js (Ethereum-compatible)

## Folder Structure
```
backend/
  index.js
  package.json
  controllers/
    authController.js
    batchController.js
  middleware/
    auth.js
  models/
    Batch.js
    user.js
  routes/
    auth.js
    batches.js
frontend/
  src/
    api.js
    App.jsx
    i18n.js
    index.css
    main.jsx
    components/
      LanguageSwitcher.jsx
      Layout.jsx
      Navbar.jsx
      ThemeToggleButton.jsx
    pages/
      AdminDashboard.jsx
      ConsumerPortal.jsx
      FarmerDashboard.jsx
      LoginPage.jsx
      RegisterPage.jsx
      BatchDetailPage.jsx
```

## How It Works
- **Batch Registration:**
  - Farmers register batches via the dashboard.
  - Batch data is saved in MongoDB and recorded on the blockchain.
- **Verification & Processing:**
  - Admins verify batches, add remarks, and approve them.
  - Manufacturers update batch status and processing details.
- **Consumer Portal:**
  - Consumers scan QR codes to view batch details.
  - Batch detail page shows all info: farmer, manufacturer, admin, hash, certifications, verified badge, and lab certificate image.

## Hardcoded Demo Mode
- The batch detail page is hardcoded for demo purposes, showing example data including blockchain hash, certifications, verified badge, and a sample lab certificate image.

## Setup Instructions
1. **Install dependencies:**
   - Backend: `npm install` in `backend/`
   - Frontend: `npm install` in `frontend/`
2. **Configure environment:**
   - Add `.env` file in `backend/` with your MongoDB URI and blockchain config.
3. **Seed demo data:**
   - Run `node seedUsers.js` and `node seedBatch.js` in `backend/` to seed hardcoded users and batches.
4. **Start servers:**
   - Backend: `node index.js`
   - Frontend: `npm run dev` in `frontend/`
5. **Access the app:**
   - Frontend: Open `http://localhost:5173` in your browser.

## QR Code Usage
- Each batch has a QR code linking to `/batch/{batchId}`.
- Scanning the QR code opens the batch detail page with full traceability info.

## Customization
- To use real data, remove hardcoded demo mode from `BatchDetailPage.jsx` and connect to the backend API.
- Replace the sample lab certificate image URL with your own certificate.

## Authors
- 
- Team paaradox

## License
MIT
