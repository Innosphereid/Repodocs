import React from "react";
import Layout from "@/components/templates/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">About</h1>
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              RepoDocsAI helps developers eliminate documentation debt with
              AI-generated READMEs.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
