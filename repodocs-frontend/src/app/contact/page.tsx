import React from "react";
import Layout from "@/components/templates/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Contact</h1>
        <Card>
          <CardHeader>
            <CardTitle>Get in touch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Questions or feedback? We&apos;d love to hear from you.
            </p>
            <Button asChild>
              <a href="mailto:support@repodocs.ai">Email Support</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
