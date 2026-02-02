// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configurações (pode ser movido para .env)
const config = {
  whatsappNumber: process.env.WHATSAPP_NUMBER || '5514996130369',
  paymentApiUrl: process.env.PAYMENT_API_URL || 'https://bebcom-payments.onrender.com',
  storeLocation: {
    lat: -22.893485,
    lng: -48.443925,
    address: 'Rua Exemplo, 123 - Bauru/SP'
  }
};

// Rota para servir o HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para obter configurações (mais seguro que hardcoded no frontend)
app.get('/api/config', (req, res) => {
  // Retorna apenas o necessário, sem dados sensíveis completos
  res.json({
    whatsappNumber: config.whatsappNumber,
    storeLocation: config.storeLocation,
    features: {
      pixPayment: true,
      delivery: true,
      pickup: true
    }
  });
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rota mock para desenvolvimento (opcional)
if (process.env.NODE_ENV === 'development') {
  app.post('/api/mock-payment', (req, res) => {
    const { amount, method } = req.body;
    
    // Simular pagamento PIX
    if (method === 'pix') {
      res.json({
        success: true,
        paymentId: 'mock_' + Date.now(),
        qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmZmZmZmYiLz4KICA8dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UElYIE1PQ0s8L3RleHQ+Cjwvc3ZnPg==',
        pixCode: '00020101021226860014br.gov.bcb.pix2561qrcodepix.example.com/v2/abcdef520400005303986540510.005802BR5908MERCHANT6009SAO PAULO62070503***6304ABCD',
        expiresIn: 900000 // 15 minutos
      });
    } else {
      res.json({ success: true, message: 'Pagamento local confirmado' });
    }
  });
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📱 WhatsApp: ${config.whatsappNumber}`);
  console.log(`🏪 Loja: ${config.storeLocation.address}`);
});