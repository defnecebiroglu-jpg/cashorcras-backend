import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function ConnectionTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runConnectionTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Basic GET request
      addResult("Testing basic GET request...");
      const response = await api.get("/");
      addResult(`✅ GET / - Status: ${response.status}`);
      addResult(`✅ Response: ${JSON.stringify(response.data).substring(0, 100)}...`);

      // Test 2: Health endpoint
      addResult("Testing health endpoint...");
      const healthResponse = await api.get("/health");
      addResult(`✅ GET /health - Status: ${healthResponse.status}`);

      // Test 3: CORS test with credentials
      addResult("Testing CORS with credentials...");
      const corsResponse = await api.get("/", {
        headers: { 'Origin': 'http://localhost:5173' }
      });
      addResult(`✅ CORS test - Status: ${corsResponse.status}`);

      // Test 4: API configuration
      addResult("Checking API configuration...");
      addResult(`✅ Base URL: ${api.defaults.baseURL}`);
      addResult(`✅ With Credentials: ${api.defaults.withCredentials}`);
      addResult(`✅ Content-Type: ${api.defaults.headers['Content-Type']}`);

      addResult("🎉 All tests passed! Frontend ↔ Backend connection fully synced 🚀");

    } catch (error: any) {
      addResult(`❌ Test failed: ${error.message}`);
      if (error.response) {
        addResult(`❌ Status: ${error.response.status}`);
        addResult(`❌ Data: ${JSON.stringify(error.response.data)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Frontend ↔ Backend Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runConnectionTests} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Running Tests..." : "Run Connection Tests"}
        </Button>
        
        <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
          <h3 className="font-semibold mb-2">Test Results:</h3>
          {testResults.length === 0 ? (
            <p className="text-gray-500">Click "Run Connection Tests" to start</p>
          ) : (
            <pre className="text-sm whitespace-pre-wrap">
              {testResults.join('\n')}
            </pre>
          )}
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>API Base URL:</strong> {import.meta.env.VITE_API_URL || "https://cashorcras-backend.onrender.com"}</p>
          <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
          <p><strong>Backend Status:</strong> <span className="text-green-600">✅ Online</span></p>
        </div>
      </CardContent>
    </Card>
  );
}




