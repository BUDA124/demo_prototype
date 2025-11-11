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
          const errorData = await response.json();
          throw new Error(errorData.details || 'Error al obtener los datos');
        }

        const result = await response.json();
        // El resultado se asigna directamente, asumiendo que la API devuelve un array del tipo esperado.
        setData(result);
      } catch (err: unknown) { // Usamos 'unknown' para manejar el error de forma segura.
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocurrió un error inesperado');
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
