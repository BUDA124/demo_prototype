const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001; // Puerto para el backend

// Configuración de CORS para permitir peticiones desde el frontend
app.use(cors());
app.use(express.json());

// URL del Broker de Druid (accesible a través de Docker)
const druidBrokerUrl = 'http://localhost:8888/druid/v2/sql';

// Endpoint para recibir consultas y pasarlas a Druid
app.post('/api/data', async (req, res) => {
  try {
    const druidQuery = req.body.query;

    if (!druidQuery) {
      return res.status(400).json({ error: 'La propiedad "query" es requerida en el body' });
    }

    console.log('Recibida la consulta para Druid:', druidQuery);

    const response = await axios.post(druidBrokerUrl, {
      query: druidQuery
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Respuesta de Druid:', response.data);
    res.json(response.data);
  } catch (error) {
    // MEJORA: Imprimir el objeto de error completo para un mejor diagnóstico
    console.error('Error al consultar Druid:', error); 
    
    res.status(500).json({ 
      error: 'Error al conectar con Druid', 
      // MEJORA: Enviar un mensaje de error más claro al frontend
      details: error.response ? error.response.data : String(error)
    });
  }
});

app.listen(port, () => {
  console.log(`Backend escuchando en http://localhost:${port}`);
});
