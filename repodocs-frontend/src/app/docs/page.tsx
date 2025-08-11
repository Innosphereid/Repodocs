import React from "react";
import Layout from "@/components/templates/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DocsPage() {
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Documentation</h1>
        <Card>
          <CardHeader>
            <CardTitle>API & Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Developer documentation will be added here.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
