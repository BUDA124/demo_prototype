import React, { useState, useEffect } from 'react';

const DruidData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ejemplo de consulta a Druid: Obtener información de la tabla de metadatos.
        // En un caso real, aquí iría tu consulta SQL para los datos que ingieras.
        const druidQuery = "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'druid'";

        const response = await fetch('http://localhost:3001/api/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: druidQuery }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Error al obtener los datos');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 md:p-6 2xl:p-10">
      <h1 className="text-2xl font-bold mb-4">Datos de Apache Druid</h1>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {data && (
        <div className="bg-white dark:bg-boxdark shadow-md rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Respuesta de la API de Druid:</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DruidData;
