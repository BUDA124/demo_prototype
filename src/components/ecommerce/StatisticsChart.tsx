import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import useDruidQuery from "../../hooks/useDruidQuery"; // Import the hook

interface HourlyActivityData {
  hour_of_day: string;
  human_edits: number;
  robot_edits: number;
}

export default function DailyActivityTrendsChart() {
  const druidQuery = `
    SELECT
      TIME_FORMAT("__time", 'HH') AS hour_of_day,
      COUNT(*) FILTER (WHERE "isRobot" = FALSE) AS human_edits,
      COUNT(*) FILTER (WHERE "isRobot" = TRUE) AS robot_edits
    FROM wikipedia
    WHERE "__time" >= TIMESTAMP '2016-06-27 00:00:00' AND "__time" < TIMESTAMP '2016-06-28 00:00:00'
    GROUP BY 1
    ORDER BY 1
  `;

  const { data, loading, error } = useDruidQuery<HourlyActivityData>(druidQuery);

  const [chartSeries, setChartSeries] = useState([
    { name: "Human Edits", data: Array(24).fill(0) },
    { name: "Robot Edits", data: Array(24).fill(0) },
  ]);

  const categories = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0") + ":00"
  );

  useEffect(() => {
    if (data && data.length > 0) {
      const humanEditsByHour: { [key: string]: number } = {};
      const robotEditsByHour: { [key: string]: number } = {};

      data.forEach((item) => {
        humanEditsByHour[item.hour_of_day] = item.human_edits;
        robotEditsByHour[item.hour_of_day] = item.robot_edits;
      });

      const newHumanEditsData = categories.map((hourLabel) => {
        const hour = hourLabel.substring(0, 2);
        return humanEditsByHour[hour] || 0;
      });

      const newRobotEditsData = categories.map((hourLabel) => {
        const hour = hourLabel.substring(0, 2);
        return robotEditsByHour[hour] || 0;
      });

      setChartSeries([
        { name: "Human Edits", data: newHumanEditsData },
        { name: "Robot Edits", data: newRobotEditsData },
      ]);
    } else if (!loading && !error) {
      setChartSeries([
        { name: "Human Edits", data: Array(24).fill(0) },
        { name: "Robot Edits", data: Array(24).fill(0) },
      ]);
    }
  }, [data, loading, error]);

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        format: "HH:00",
      },
    },
    xaxis: {
      type: "category",
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "Number of Edits",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
    },
  };

  if (loading) return <div>Loading daily activity trends...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Daily Activity Trends
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Hourly comparison of human vs. robot edits
          </p>
        </div>
        {/* ChartTab removed as it's not relevant for single-day hourly view */}
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={chartSeries} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
