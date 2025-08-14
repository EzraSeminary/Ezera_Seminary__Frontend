import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchAvailableYears,
  fetchDevotionsByYear,
  createDevotionsForNewYear,
  setSelectedYear,
} from '@/redux/devotionsSlice';
import { getCurrentEthiopianYear } from './devotionUtils';
import { toast } from 'react-toastify';

interface YearManagementProps {
  onYearChange?: (year: number) => void;
}

const YearManagement: React.FC<YearManagementProps> = ({ onYearChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { availableYears, selectedYear } = useSelector(
    (state: RootState) => state.devotions
  );
  const [sourceYear, setSourceYear] = useState<number>(0);
  const [targetYear, setTargetYear] = useState<number>(getCurrentEthiopianYear() + 1);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchAvailableYears());
  }, [dispatch]);

  const handleYearChange = (year: number) => {
    dispatch(setSelectedYear(year));
    dispatch(fetchDevotionsByYear(year));
    if (onYearChange) {
      onYearChange(year);
    }
  };

  const handleCreateNewYear = async () => {
    if (!sourceYear || !targetYear) {
      toast.error('Please select both source and target years');
      return;
    }

    if (sourceYear === targetYear) {
      toast.error('Source and target years cannot be the same');
      return;
    }

    if (availableYears.includes(targetYear)) {
      toast.error(`Year ${targetYear} already exists`);
      return;
    }

    setIsCreating(true);
    try {
      const result = await dispatch(
        createDevotionsForNewYear({ sourceYear, targetYear })
      );
      
      if (result.payload) {
        toast.success(`Successfully created devotions for year ${targetYear}`);
        dispatch(fetchAvailableYears()); // Refresh available years
        setSourceYear(0);
        setTargetYear(getCurrentEthiopianYear() + 1);
      }
    } catch (error) {
      toast.error('Failed to create devotions for new year');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-accent-6 mb-4">Year Management</h2>
      
      {/* Year Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-accent-6 mb-2">
          Select Year to View/Edit
        </label>
        <select
          className="w-full border-2 border-accent-6 bg-white outline-accent-7 rounded-md px-3 py-2 text-accent-6 cursor-pointer"
          value={selectedYear}
          onChange={(e) => handleYearChange(Number(e.target.value))}
        >
          <option value={getCurrentEthiopianYear()}>
            {getCurrentEthiopianYear()} (Current)
          </option>
          {availableYears
            .filter((year) => year !== getCurrentEthiopianYear())
            .map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>
      </div>

      {/* Create New Year Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-accent-6 mb-4">
          Create Devotions for New Year
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-accent-6 mb-2">
              Copy From Year (Source)
            </label>
            <select
              className="w-full border-2 border-accent-6 bg-white outline-accent-7 rounded-md px-3 py-2 text-accent-6 cursor-pointer"
              value={sourceYear}
              onChange={(e) => setSourceYear(Number(e.target.value))}
              disabled={isCreating}
            >
              <option value={0}>Select source year</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-accent-6 mb-2">
              Create For Year (Target)
            </label>
            <input
              type="number"
              className="w-full border-2 border-accent-6 bg-white outline-accent-7 rounded-md px-3 py-2 text-accent-6"
              value={targetYear}
              onChange={(e) => setTargetYear(Number(e.target.value))}
              disabled={isCreating}
              min={1900}
              max={2100}
            />
          </div>
        </div>

        <button
          onClick={handleCreateNewYear}
          disabled={isCreating || !sourceYear || !targetYear}
          className="bg-accent-6 hover:bg-accent-7 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
        >
          {isCreating ? 'Creating...' : 'Create New Year Devotions'}
        </button>

        <div className="mt-4 text-sm text-gray-600">
          <p>
            <strong>Note:</strong> This will copy all devotions from the source year
            and create new entries for the target year. You can then edit individual
            devotions as needed.
          </p>
        </div>
      </div>

      {/* Year Statistics */}
      {availableYears.length > 0 && (
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold text-accent-6 mb-4">
            Available Years
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {availableYears.map((year) => (
              <div
                key={year}
                className={`p-2 text-center rounded border ${
                  year === getCurrentEthiopianYear()
                    ? 'bg-accent-6 text-white'
                    : 'bg-gray-100 text-accent-6'
                }`}
              >
                {year}
                {year === getCurrentEthiopianYear() && (
                  <span className="block text-xs">(Current)</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default YearManagement;
