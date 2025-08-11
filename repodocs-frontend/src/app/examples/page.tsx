import React from "react";
import Layout from "@/components/templates/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExamplesPage() {
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Examples</h1>
        <Card>
          <CardHeader>
            <CardTitle>Coming soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Curated examples of generated documentation will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
