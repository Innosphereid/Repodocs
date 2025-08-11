import React from "react";
import Layout from "@/components/templates/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApiReferencePage() {
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">API Reference</h1>
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Public API reference will be published here.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
