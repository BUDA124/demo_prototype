import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import CountryMap from "./CountryMap";
import useDruidQuery from "../../hooks/useDruidQuery"; // Import the hook

interface CountryEditData {
  countryName: string;
  edit_count: number;
}

export default function EditorDemographicCard() {
  const druidQuery = `
    SELECT
      "countryName",
      COUNT(*) AS edit_count
    FROM wikipedia
    WHERE "__time" >= TIMESTAMP '2016-06-27 00:00:00' AND "__time" < TIMESTAMP '2016-06-28 00:00:00'
    GROUP BY 1
    ORDER BY edit_count DESC
    LIMIT 5
  `;

  const { data, loading, error } = useDruidQuery<CountryEditData>(druidQuery);

  const [totalEdits, setTotalEdits] = useState(0);
  const [countryStats, setCountryStats] = useState<
    { name: string; count: number; percentage: number }[]
  >([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const total = data.reduce((sum, item) => sum + item.edit_count, 0);
      setTotalEdits(total);

      const stats = data.map((item) => ({
        name: item.countryName,
        count: item.edit_count,
        percentage: total > 0 ? (item.edit_count / total) * 100 : 0,
      }));
      setCountryStats(stats);
    } else if (!loading && !error) {
      setTotalEdits(0);
      setCountryStats([]);
    }
  }, [data, loading, error]);

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  if (loading) return <div>Loading editor demographic data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Editors Demographic
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Number of edits based on country
          </p>
        </div>
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
      <div className="px-4 py-6 my-6 overflow-hidden border border-gary-200 rounded-2xl dark:border-gray-800 sm:px-6">
        <div
          id="mapOne"
          className="mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]"
        >
          {/* CountryMap component might need specific data or adjustments */}
          <CountryMap />
        </div>
      </div>

      <div className="space-y-5">
        {countryStats.map((country, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Removed country flag images for simplicity */}
              <div>
                <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                  {country.name || "Unknown"}
                </p>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {country.count} Edits
                </span>
              </div>
            </div>

            <div className="flex w-full max-w-[140px] items-center gap-3">
              <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                <div
                  className="absolute left-0 top-0 flex h-full rounded-sm bg-brand-500 text-xs font-medium text-white"
                  style={{ width: `${country.percentage.toFixed(0)}%` }}
                ></div>
              </div>
              <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {country.percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
        {countryStats.length === 0 && !loading && (
          <p className="text-center text-gray-500">No data available for this date.</p>
        )}
      </div>
    </div>
  );
}
