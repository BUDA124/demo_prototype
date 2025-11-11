import { useState, useEffect } from 'react';

// Definimos un tipo genérico para que el hook pueda ser reutilizado con diferentes estructuras de datos.
type DruidData<T> = T;

const useDruidQuery = <T,>(query: string) => {
  // Usamos el tipo genérico para el estado de los datos.
  const [data, setData] = useState<DruidData<T>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          let errorDetails = 'Error al obtener los datos';
          try {
            const errorData = await response.json();
            if (errorData && errorData.details) {
              errorDetails = typeof errorData.details === 'object'
                ? JSON.stringify(errorData.details)
                : errorData.details;
            } else if (errorData) {
              errorDetails = JSON.stringify(errorData);
            }
          } catch (jsonError) {
            console.error("Failed to parse error response as JSON:", jsonError);
            errorDetails = `Error: ${response.status} ${response.statusText}`;
          }
          throw new Error(errorDetails);
        }

        const result = await response.json();
        setData(result);
      } catch (err: unknown) {
        console.error("Druid query failed:", err); // Log the original error
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocurrió un error inesperado: ' + String(err)); // Ensure it's a string
        }
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchData();
    }
  }, [query]);

  return { data, loading, error };
};

export default useDruidQuery;
