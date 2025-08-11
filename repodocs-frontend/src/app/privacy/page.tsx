import React from "react";
import Layout from "@/components/templates/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Privacy Policy</h1>
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We access only the data required to generate documentation for
              public repositories.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
