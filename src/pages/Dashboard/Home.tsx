import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import useDruidQuery from "../../hooks/useDruidQuery";

const DruidMetrics = () => {
  // Ejemplo de consulta: Contar el número total de eventos en el datasource 'wikiticker'
  const { data, loading, error } = useDruidQuery('SELECT COUNT(*) as event_count FROM wikiticker');

  if (loading) return <p>Cargando métricas de Druid...</p>;
  if (error) return <p className="text-red-500">Error al cargar métricas: {error}</p>;

  // Extraer la métrica del primer resultado
  const eventCount = data.length > 0 ? data[0].event_count : 0;

  return (
    <div className="bg-white dark:bg-boxdark shadow-md rounded p-4">
      <h3 className="text-lg font-semibold">Métricas de Druid</h3>
      <p className="text-2xl font-bold">{eventCount.toLocaleString()}</p>
      <p className="text-sm text-gray-500">Eventos totales en Druid</p>
    </div>
  );
};


export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <h2 className="mb-4 text-3xl font-semibold text-gray-900 dark:text-white">
        Welcome, Admin!
      </h2>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          {/* Reemplazamos EcommerceMetrics con nuestro nuevo componente */}
          <DruidMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
