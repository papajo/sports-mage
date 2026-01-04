import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Sports Data Hub - Layout',
  description: 'Real-time sports data for multiple sports including Tennis and Cricket',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Link href="/" className="flex-shrink-0 flex items-center">
                    <span className="text-xl font-bold">Sports Data Hub</span>
                  </Link>
                  <nav className="ml-10 flex items-center space-x-4">
                    <Link href="/live" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                      Live Scores
                    </Link>
                    <Link href="/leagues" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                      Leagues
                    </Link>
                    <Link href="/teams" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                      Teams
                    </Link>
                    <Link href="/fixtures" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                      Fixtures
                    </Link>
                    <Link href="/tennis-cricket" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                      Tennis & Cricket
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center">
                  <Link href="/search" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                    Search
                  </Link>
                  <Link href="/payment" className="ml-4 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                    Subscribe
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <main>{children}</main>

          <footer className="bg-white">
            <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
              <nav className="flex flex-wrap justify-center">
                <div className="px-5 py-2">
                  <Link href="/about" className="text-base text-gray-500 hover:text-gray-900">
                    About
                  </Link>
                </div>
                <div className="px-5 py-2">
                  <Link href="/contact" className="text-base text-gray-500 hover:text-gray-900">
                    Contact
                  </Link>
                </div>
                <div className="px-5 py-2">
                  <Link href="/terms" className="text-base text-gray-500 hover:text-gray-900">
                    Terms
                  </Link>
                </div>
                <div className="px-5 py-2">
                  <Link href="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                    Privacy
                  </Link>
                </div>
              </nav>
              <p className="mt-8 text-center text-base text-gray-400">
                &copy; 2025 Sports Data Hub. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
