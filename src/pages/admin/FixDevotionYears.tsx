import { useState, useEffect } from "react";
import { useGetMonthsByYearQuery, useGetDevotionsByYearAndMonthQuery, useBatchUpdateDevotionYearsMutation } from "@/redux/api-slices/apiSlice";
import { Devotion } from "@/redux/types";
import LoadingPage from "@/pages/user/LoadingPage";
import { ethiopianMonths } from "@/features/devotions/devotionUtils";
import { Folder, FolderOpen } from "@phosphor-icons/react";

interface DevotionWithYear extends Devotion {
  selectedYear?: number;
}

const FixDevotionYears = () => {
  const TARGET_YEAR = 2018;
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [loadedMonths, setLoadedMonths] = useState<Record<string, DevotionWithYear[]>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResults, setUpdateResults] = useState<{ success: number; errors: any[] } | null>(null);
  const [batchUpdateDevotionYears] = useBatchUpdateDevotionYearsMutation();

  // Get all months for year 2018
  const { isLoading: isLoadingMonths, error: monthsError } = useGetMonthsByYearQuery(TARGET_YEAR);

  // Load devotions for selected month
  const { data: monthDevotions, isLoading: isLoadingMonth } = useGetDevotionsByYearAndMonthQuery(
    { year: TARGET_YEAR, month: selectedMonth || "" },
    { skip: !selectedMonth || !!loadedMonths[selectedMonth || ""] }
  );

  // Get all Ethiopian months (all 13 months)
  const allMonths = ethiopianMonths.filter(month => month !== ""); // Remove empty string

  // Update loaded months cache when data arrives
  useEffect(() => {
    if (monthDevotions && selectedMonth) {
      const initialized = monthDevotions.map((devotion) => ({
        ...devotion,
        selectedYear: devotion.year || TARGET_YEAR,
      }));
      setLoadedMonths((prev) => ({
        ...prev,
        [selectedMonth]: initialized,
      }));
    }
  }, [monthDevotions, selectedMonth]);

  const handleMonthClick = (month: string) => {
    if (selectedMonth === month) {
      setSelectedMonth(null);
    } else {
      setSelectedMonth(month);
    }
  };

  const handleYearChange = (devotionId: string, newYear: number) => {
    if (!selectedMonth) return;
    
    setLoadedMonths((prev) => ({
      ...prev,
      [selectedMonth]: prev[selectedMonth].map((devotion) =>
        devotion._id === devotionId ? { ...devotion, selectedYear: newYear } : devotion
      ),
    }));
  };

  const handleBatchUpdate = async () => {
    if (!selectedMonth || !loadedMonths[selectedMonth]) {
      alert("Please select a month first");
      return;
    }

    const devotions = loadedMonths[selectedMonth];
    const updates = devotions
      .filter((devotion) => devotion.selectedYear !== devotion.year && devotion._id)
      .map((devotion) => ({
        id: devotion._id!,
        year: devotion.selectedYear || TARGET_YEAR,
      }));

    if (updates.length === 0) {
      alert("No changes to save for this month");
      return;
    }

    if (!confirm(`Are you sure you want to update ${updates.length} devotions in ${selectedMonth}?`)) {
      return;
    }

    setIsUpdating(true);
    setUpdateResults(null);

    try {
      const response = await batchUpdateDevotionYears({ updates }).unwrap();

      setUpdateResults({
        success: response.results?.length || 0,
        errors: response.errors || [],
      });

      // Update the cache with new years
      setLoadedMonths((prev) => ({
        ...prev,
        [selectedMonth]: prev[selectedMonth].map((devotion) => {
          const updated = response.results?.find((r: any) => r.id === devotion._id);
          if (updated) {
            return { ...devotion, year: updated.year, selectedYear: updated.year };
          }
          return devotion;
        }),
      }));

      alert(`Successfully updated ${response.results?.length || 0} devotions`);
    } catch (error: any) {
      console.error("Error updating devotions:", error);
      alert(`Error: ${error.data?.error || error.message || "Failed to update devotions"}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSelectAllYear = (year: number) => {
    if (!selectedMonth || !loadedMonths[selectedMonth]) return;
    
    setLoadedMonths((prev) => ({
      ...prev,
      [selectedMonth]: prev[selectedMonth].map((devotion) => ({
        ...devotion,
        selectedYear: year,
      })),
    }));
  };

  // Helper to get smaller image URL (if using ImageKit or similar, add transformation)
  const getSmallImageUrl = (imageUrl: string | undefined): string | undefined => {
    if (!imageUrl || typeof imageUrl !== "string") return undefined;
    
    // If it's an ImageKit URL, add transformation for smaller size
    if (imageUrl.includes("imagekit.io")) {
      return `${imageUrl}?tr=w-200,h-200,c-maintain_ratio`;
    }
    
    // For other URLs, return as is (you can add more transformations here)
    return imageUrl;
  };

  if (isLoadingMonths) return <LoadingPage />;
  if (monthsError) return <div>Error: {(monthsError as Error).message}</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Fix Devotion Years - 2018</h1>
        <p className="text-gray-600">
          Click on a month folder to view and update devotions for year 2018.
        </p>
      </div>

      {/* Update Results */}
      {updateResults && (
        <div className={`mb-6 p-4 rounded-lg ${
          updateResults.errors.length > 0 ? "bg-yellow-50 border border-yellow-200" : "bg-green-50 border border-green-200"
        }`}>
          <p className="font-semibold">
            Updated {updateResults.success} devotions successfully
            {updateResults.errors.length > 0 && ` (${updateResults.errors.length} errors)`}
          </p>
          {updateResults.errors.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-sm text-red-600">
              {updateResults.errors.map((err: any, idx: number) => (
                <li key={idx}>ID {err.id}: {err.error}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Month Folders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {allMonths.map((month) => {
          const isSelected = selectedMonth === month;
          const hasData = !!loadedMonths[month];
          const isLoading = isSelected && isLoadingMonth && !hasData;
          const devotionsCount = hasData ? loadedMonths[month].length : 0;

          return (
            <div
              key={month}
              onClick={() => handleMonthClick(month)}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                isSelected
                  ? "border-accent-6 bg-accent-6/10 shadow-lg"
                  : "border-gray-200 bg-white hover:border-accent-6/50 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-3">
                {isSelected ? (
                  <FolderOpen className="text-accent-6" size={32} />
                ) : (
                  <Folder className="text-gray-400" size={32} />
                )}
                <div>
                  <h3 className="font-bold text-lg">{month}</h3>
                  {hasData && (
                    <p className="text-sm text-gray-600">{devotionsCount} devotions</p>
                  )}
                  {isLoading && (
                    <p className="text-sm text-gray-500">Loading...</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Month Devotions */}
      {selectedMonth && loadedMonths[selectedMonth] && (
        <div className="mt-6">
          {/* Bulk Actions */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <label className="font-semibold">Bulk Select Year for {selectedMonth}:</label>
              <select
                defaultValue={TARGET_YEAR}
                onChange={(e) => handleSelectAllYear(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-6"
              >
                <option value={2017}>2017</option>
                <option value={2018}>2018</option>
              </select>
              <button
                onClick={handleBatchUpdate}
                disabled={isUpdating}
                className="px-6 py-2 bg-accent-6 text-white rounded-md hover:bg-accent-7 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Updating..." : "Save Changes for " + selectedMonth}
              </button>
            </div>
          </div>

          {/* Devotions Grid - Square Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {loadedMonths[selectedMonth].map((devotion) => (
              <div
                key={devotion._id}
                className={`aspect-square border rounded-lg p-2 flex flex-col ${
                  devotion.selectedYear !== devotion.year
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                {/* Square Image */}
                <div className="w-full aspect-square mb-2 flex-shrink-0">
                  {devotion.image && typeof devotion.image === "string" ? (
                    <img
                      src={getSmallImageUrl(devotion.image)}
                      alt={devotion.title}
                      className="w-full h-full object-cover rounded-md"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                {/* Date Info */}
                <div className="mb-2 flex-shrink-0">
                  <div className="text-xs font-semibold text-gray-700 mb-1">
                    {devotion.month} {devotion.day}
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-600">Year: </span>
                    <span className={`font-bold ${
                      devotion.year ? "text-gray-800" : "text-red-600"
                    }`}>
                      {devotion.year || "Not Set"}
                    </span>
                  </div>
                </div>

                {/* Title - Truncated */}
                <div className="mb-2 flex-shrink-0 min-h-[2.5rem]">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-2">
                    {devotion.title}
                  </p>
                </div>

                {/* Year Selector */}
                <div className="mt-auto">
                  <select
                    value={devotion.selectedYear || TARGET_YEAR}
                    onChange={(e) =>
                      devotion._id && handleYearChange(devotion._id, parseInt(e.target.value))
                    }
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value={2017}>2017</option>
                    <option value={2018}>2018</option>
                  </select>
                  {devotion.selectedYear !== devotion.year && (
                    <p className="mt-1 text-xs text-yellow-600">
                      → {devotion.selectedYear}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {selectedMonth && isLoadingMonth && !loadedMonths[selectedMonth] && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-6"></div>
          <p className="mt-2 text-gray-600">Loading devotions for {selectedMonth}...</p>
        </div>
      )}

      {/* No Data State */}
      {selectedMonth && !isLoadingMonth && !loadedMonths[selectedMonth] && (
        <div className="text-center py-12 text-gray-500">
          No devotions found for {selectedMonth} in year {TARGET_YEAR}
        </div>
      )}
    </div>
  );
};

export default FixDevotionYears;
