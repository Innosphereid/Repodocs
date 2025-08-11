import React from "react";
import Layout from "@/components/templates/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Terms of Service</h1>
        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              By using RepoDocsAI, you agree to our standard terms and
              conditions.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
