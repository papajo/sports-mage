import { Suspense } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Sports Data Hub - Home',
  description: 'Real-time sports data for multiple sports',
};

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Sports Data Hub</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your one-stop destination for real-time sports data, live scores, and comprehensive statistics
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/betting"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Start Betting
          </Link>
          <Link
            href="/live"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium"
          >
            View Live Scores
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-3">Sports Betting</h2>
          <p className="text-gray-600 mb-4">
            Place bets on live and upcoming matches with real-time odds and instant payouts.
          </p>
          <Link href="/betting" className="text-blue-600 hover:text-blue-800 font-medium">
            Start Betting →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-3">Live Scores</h2>
          <p className="text-gray-600 mb-4">
            Get real-time updates on ongoing matches across multiple sports and leagues.
          </p>
          <Link href="/live" className="text-blue-600 hover:text-blue-800 font-medium">
            View Live Scores →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-3">Bet History</h2>
          <p className="text-gray-600 mb-4">
            Track all your bets, view winnings, and manage your betting activity.
          </p>
          <Link href="/betting/history" className="text-blue-600 hover:text-blue-800 font-medium">
            View My Bets →
          </Link>
        </div>
      </div>
    </div>
  );
}

