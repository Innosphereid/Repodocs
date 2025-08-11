import React from "react";
import Layout from "@/components/templates/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChangelogPage() {
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Changelog</h1>
        <Card>
          <CardHeader>
            <CardTitle>Work in progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Release notes will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
