"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api";

export default function ConnectionTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runConnectionTests = async () => {
    setLoading(true);
    const results = [];

    // Test 1: Check if backend is reachable
    try {
      const response = await fetch('http://localhost:3007/api/v1/health');
      results.push({
        test: "Backend Health Check",
        status: response.ok ? "✅ CONNECTED" : "❌ FAILED",
        details: `Status: ${response.status}`,
        data: response.ok ? await response.text() : "No response"
      });
    } catch (error) {
      results.push({
        test: "Backend Health Check",
        status: "❌ FAILED",
        details: "Connection refused",
        data: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Test 2: Test Jobs API
    try {
      const jobsResponse = await apiClient.getJobs({ limit: 1 });
      results.push({
        test: "Jobs API",
        status: "✅ CONNECTED",
        details: `Found ${jobsResponse.total || 0} jobs`,
        data: JSON.stringify(jobsResponse, null, 2)
      });
    } catch (error) {
      results.push({
        test: "Jobs API",
        status: "❌ FAILED",
        details: "API call failed",
        data: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Test 3: Test Authentication endpoints
    try {
      const response = await fetch('http://localhost:3007/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          password: "testpass",
          userType: "FREELANCER"
        })
      });
      results.push({
        test: "Auth API Endpoint",
        status: response.status === 409 ? "✅ CONNECTED" : (response.ok ? "✅ CONNECTED" : "❌ FAILED"),
        details: `Status: ${response.status} (409 = user exists = working)`,
        data: await response.text()
      });
    } catch (error) {
      results.push({
        test: "Auth API Endpoint",
        status: "❌ FAILED",
        details: "Connection failed",
        data: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Test 4: Database connection (via API)
    try {
      const response = await fetch('http://localhost:3007/api/v1/jobs?limit=1');
      results.push({
        test: "Database Connection",
        status: response.ok ? "✅ CONNECTED" : "❌ FAILED",
        details: response.ok ? "Database queries working" : "Database connection issues",
        data: response.ok ? "Jobs endpoint returned data" : await response.text()
      });
    } catch (error) {
      results.push({
        test: "Database Connection",
        status: "❌ FAILED",
        details: "Cannot reach database via API",
        data: error instanceof Error ? error.message : "Unknown error"
      });
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Backend Connection Test
            </h1>
            <p className="text-slate-600">
              This page tests the connection between the frontend and backend services.
            </p>
          </div>

          <div className="mb-6">
            <button
              onClick={runConnectionTests}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Testing Connection...
                </div>
              ) : (
                "Run Connection Tests"
              )}
            </button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Test Results</h2>
              {testResults.map((result, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-slate-900">{result.test}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.status.includes('✅') 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{result.details}</p>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-purple-600 hover:text-purple-700">
                        View Response Data
                      </summary>
                      <pre className="mt-2 p-3 bg-slate-100 rounded text-xs overflow-auto max-h-32">
                        {typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Connection Status Indicators:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li><strong>✅ CONNECTED:</strong> Backend is running and API is responding</li>
              <li><strong>❌ FAILED:</strong> Backend is not reachable or API errors</li>
              <li><strong>Status 409:</strong> User already exists (means auth endpoint is working)</li>
              <li><strong>Backend URL:</strong> http://localhost:3007</li>
              <li><strong>Frontend URL:</strong> http://localhost:3001</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-2">How to Verify Backend Connection:</h3>
            <ol className="text-sm text-purple-800 space-y-1 list-decimal list-inside">
              <li>Check if backend server is running on port 3001</li>
              <li>Look for "🚀 URWRITER API running on port 3001" in terminal</li>
              <li>Run these connection tests to verify API endpoints</li>
              <li>Check browser Network tab for successful API calls</li>
              <li>Look for real data loading in dashboard and services pages</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
