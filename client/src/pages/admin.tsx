import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { CompanyManagement } from "@/components/admin/company-management";
import { CurrencyManagement } from "@/components/admin/currency-management";
import { TeamManagement } from "@/components/admin/team-management";

export default function Admin() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-slate-900">Admin Panel</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Cash or Crash - Administration</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="companies" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="companies">Companies</TabsTrigger>
                <TabsTrigger value="currencies">Currencies</TabsTrigger>
                <TabsTrigger value="teams">Teams</TabsTrigger>
              </TabsList>
              
              <TabsContent value="companies" className="mt-6">
                <CompanyManagement />
              </TabsContent>
              
              <TabsContent value="currencies" className="mt-6">
                <CurrencyManagement />
              </TabsContent>
              
              <TabsContent value="teams" className="mt-6">
                <TeamManagement />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
