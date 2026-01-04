import { Suspense } from 'react';
import Search from '../../components/Search';

export const metadata = {
  title: 'Search - Sports Data Hub',
  description: 'Search for leagues, teams, and fixtures across all sports',
};

export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Search Sports Data</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Suspense fallback={<div className="p-8 text-center">Loading search...</div>}>
          <Search />
        </Suspense>
      </div>
    </div>
  );
}

