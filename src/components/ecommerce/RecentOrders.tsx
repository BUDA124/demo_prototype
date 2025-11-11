import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState, useEffect } from "react";
import useDruidQuery from "../../hooks/useDruidQuery"; // Import the hook

// Define the TypeScript interface for the table rows
interface Edit {
  __time: string;
  page: string;
  comment: string;
  countryName: string;
}

export default function RecentEdits() {
  const druidQuery = `
    SELECT
      "__time",
      "page",
      "comment",
      "countryName"
    FROM wikipedia
    WHERE "__time" >= TIMESTAMP '2016-06-27 00:00:00' AND "__time" < TIMESTAMP '2016-06-28 00:00:00'
    ORDER BY "__time" DESC
    LIMIT 7
  `;

  const { data, loading, error } = useDruidQuery<Edit>(druidQuery);

  const [recentEdits, setRecentEdits] = useState<Edit[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setRecentEdits(data);
    } else if (!loading && !error) {
      setRecentEdits([]);
    }
  }, [data, loading, error]);

  if (loading) return <div>Loading recent edits...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Edits
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Latest Wikipedia edits
          </p>
        </div>

        {/* Filter and See all buttons removed */}
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Time
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Page
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Comment
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Country
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentEdits.length > 0 ? (
              recentEdits.map((edit, index) => (
                <TableRow key={index} className="">
                  <TableCell className="py-3">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {new Date(edit.__time).toLocaleTimeString()}
                    </p>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {edit.page}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {edit.comment || "No comment"}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {edit.countryName || "Unknown"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-3 text-center text-gray-500">
                  No recent edits found for June 27, 2016.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
