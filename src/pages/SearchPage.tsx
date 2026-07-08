import React from 'react';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { ResultsList } from '../components/ResultsList';
import { RegulationDetail } from '../components/RegulationDetail';
import { useRegulationSearch } from '../hooks/useRegulationSearch';

export const SearchPage: React.FC = () => {
  const {
    filters,
    updateFilter,
    resetFilters,
    results,
    selectedRegulation,
    setSelectedRegulation,
    activeFilterCount,
  } = useRegulationSearch();

  return (
    <>
      <SearchBar
        query={filters.query}
        onQueryChange={(q) => updateFilter('query', q)}
        resultCount={results.length}
      />

      <FilterPanel
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        activeFilterCount={activeFilterCount}
      />

      <ResultsList results={results} onSelect={setSelectedRegulation} />

      {selectedRegulation && (
        <RegulationDetail
          regulation={selectedRegulation}
          onClose={() => setSelectedRegulation(null)}
        />
      )}
    </>
  );
};
