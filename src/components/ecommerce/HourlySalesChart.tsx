import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useState, useEffect } from "react";
import useDruidQuery from "../../hooks/useDruidQuery"; // Import the hook

interface HourlySalesData {
  hour_of_day: string;
  sales: number;
}

export default function HourlySalesChart() {
  const druidQuery = `
    SELECT
      TIME_FORMAT("__time", 'HH') AS hour_of_day,
      COUNT(*) AS sales
    FROM wikipedia
    WHERE "__time" >= TIMESTAMP '2016-06-27 00:00:00' AND "__time" < TIMESTAMP '2016-06-28 00:00:00'
    GROUP BY 1
    ORDER BY 1
  `;

  const { data, loading, error } = useDruidQuery<HourlySalesData>(druidQuery);

  const [chartSeries, setChartSeries] = useState([
    {
      name: "Edits",
      data: Array(24).fill(0), // Initialize with 24 zeros
    },
  ]);

  const categories = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0") + ":00"
  );

  useEffect(() => {
    console.log("Druid Data:", data);
    console.log("Loading:", loading);
    console.log("Error:", error);

    if (data && data.length > 0) {
      const salesByHour: { [key: string]: number } = {};
      data.forEach((item) => {
        salesByHour[item.hour_of_day] = item.sales;
      });

      const newSeriesData = categories.map((hourLabel) => {
        const hour = hourLabel.substring(0, 2); // Extract "HH" from "HH:00"
        return salesByHour[hour] || 0;
      });

      setChartSeries([
        {
          name: "Edits",
          data: newSeriesData,
        },
      ]);
    } else if (!loading && !error) {
      // If no data and not loading/error, reset to all zeros
      setChartSeries([
        {
          name: "Edits",
          data: Array(24).fill(0),
        },
      ]);
    }
  }, [data, loading, error]);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  if (loading) return <div>Loading hourly sales data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Hourly Edits
        </h3>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={chartSeries} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
