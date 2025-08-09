export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">URWRITER</h1>
            </div>
            <nav className="flex space-x-8">
              <a href="/jobs" className="text-gray-600 hover:text-gray-900">Find Work</a>
              <a href="/writers" className="text-gray-600 hover:text-gray-900">Find Writers</a>
              <a href="/login" className="text-blue-600 hover:text-blue-800">Sign In</a>
              <a href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Get Started</a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Writer-First Freelance Marketplace
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Professional writing services with editorial collaboration, brand governance, escrow protection, and compliance-grade data labeling.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <a
                href="/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700"
              >
                Start Hiring
              </a>
              <a
                href="/writers"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-50"
              >
                Find Work
              </a>
            </div>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900">Editorial Collaboration</h3>
                  <p className="mt-2 text-gray-600">Real-time collaborative editor with version control and quality assurance.</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900">Brand Governance</h3>
                  <p className="mt-2 text-gray-600">Enforce brand guidelines, tone, and style across all content.</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900">Escrow Protection</h3>
                  <p className="mt-2 text-gray-600">Secure milestone-based payments with dispute resolution.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; 2025 URWRITER. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
