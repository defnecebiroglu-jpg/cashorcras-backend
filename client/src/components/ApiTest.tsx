import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";

export default function ApiTest() {
  const [testResult, setTestResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const testApiConnection = async () => {
    setIsLoading(true);
    setTestResult("Testing API connection...");
    
    try {
      // Test health endpoint
      const response = await api.get("/health");
      setTestResult(`✅ API Connection Successful!\n\nResponse: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      setTestResult(`❌ API Connection Failed!\n\nError: ${error.message}\n\nDetails: ${JSON.stringify(error.response?.data || error, null, 2)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLoginEndpoint = async () => {
    setIsLoading(true);
    setTestResult("Testing login endpoint...");
    
    try {
      // Test admin login endpoint (this will fail but we can see the response)
      const response = await api.post("/api/auth/admin", { password: "test" });
      setTestResult(`✅ Login Endpoint Accessible!\n\nResponse: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setTestResult(`✅ Login Endpoint Accessible! (Expected 401 for invalid credentials)\n\nStatus: ${error.response.status}\nMessage: ${error.response.data?.message || 'Unauthorized'}`);
      } else {
        setTestResult(`❌ Login Endpoint Error!\n\nError: ${error.message}\n\nDetails: ${JSON.stringify(error.response?.data || error, null, 2)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>API Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testApiConnection} 
            disabled={isLoading}
            variant="default"
          >
            Test Health Endpoint
          </Button>
          <Button 
            onClick={testLoginEndpoint} 
            disabled={isLoading}
            variant="outline"
          >
            Test Login Endpoint
          </Button>
        </div>
        
        {testResult && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Test Result:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {testResult}
            </pre>
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <p><strong>API Base URL:</strong> {import.meta.env.VITE_API_URL || "https://cashorcras-backend.onrender.com"}</p>
          <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
        </div>
      </CardContent>
    </Card>
  );
}
