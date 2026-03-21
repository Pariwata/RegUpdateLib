import React from 'react';
import { SearchBar } from './components/SearchBar';
import { FilterPanel } from './components/FilterPanel';
import { ResultsList } from './components/ResultsList';
import { RegulationDetail } from './components/RegulationDetail';
import { useRegulationSearch } from './hooks/useRegulationSearch';
import { AgentChat } from './components/AgentChat';
import './App.css';

function App() {
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
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Regulatory Search</h1>
          <p className="app-subtitle">
            Search and explore regulatory updates across agencies and
            jurisdictions
          </p>
        </div>
      </header>

      <main className="app-main">
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
      </main>

      {selectedRegulation && (
        <RegulationDetail
          regulation={selectedRegulation}
          onClose={() => setSelectedRegulation(null)}
        />
      )}

      <AgentChat />
    </div>
  );
}

export default App;
