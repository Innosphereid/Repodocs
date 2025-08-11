"use client";

import React, { useState } from "react";
import Layout from "@/components/templates/Layout";
import RepositoryInput from "@/components/molecules/RepositoryInput";
import ProgressTracker from "@/components/molecules/ProgressTracker";
import DocumentationPreview from "@/components/organisms/DocumentationPreview";
import PricingCard from "@/components/molecules/PricingCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useRepositoryAnalysis,
  useAuth,
  useRateLimit,
  useFeedback,
} from "@/lib/hooks";
import {
  Zap,
  Shield,
  Clock,
  Users,
  Star,
  GitPullRequest,
  Code,
  Bot,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const { isAuthenticated } = useAuth();
  const { isLimitReached } = useRateLimit();
  const {
    isAnalyzing,
    progress,
    result,
    error,
    analyzeRepository,
    regenerateDocumentation,
    reset,
  } = useRepositoryAnalysis();
  const { submitFeedback } = useFeedback();

  const handleSubmit = async () => {
    if (!repositoryUrl.trim()) return;

    await analyzeRepository(repositoryUrl);
  };

  const handleNewAnalysis = () => {
    reset();
    setRepositoryUrl("");
  };

  return (
    <Layout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-8 py-12">
          <div className="space-y-4">
            <Badge variant="secondary" className="px-4 py-2">
              ✨ AI-Powered Documentation Generator
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Generate Professional
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                README Files
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your GitHub repositories with AI-generated
              documentation. Simply paste your repository URL and get a
              comprehensive README.md through an automated pull request.
            </p>
          </div>

          {/* Repository Input */}
          <div className="max-w-2xl mx-auto">
            {!result && (
              <RepositoryInput
                value={repositoryUrl}
                onChange={setRepositoryUrl}
                onSubmit={handleSubmit}
                isLoading={isAnalyzing}
                error={error}
                disabled={isLimitReached}
              />
            )}

            {/* Rate Limit Warning */}
            {isLimitReached && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  You&apos;ve reached your monthly limit.
                  {!isAuthenticated &&
                    " Sign in with GitHub for more generations, or "}
                  upgrade your plan for unlimited access.
                </p>
              </div>
            )}
          </div>

          {/* Progress Tracker */}
          {(isAnalyzing || progress) && !result && (
            <div className="max-w-2xl mx-auto">
              <ProgressTracker
                analysis={
                  progress || {
                    analysis_id: "",
                    status: "pending",
                    progress_percentage: 0,
                    current_step: "Initializing analysis...",
                  }
                }
              />
            </div>
          )}

          {/* Documentation Preview */}
          {result && (
            <div className="max-w-4xl mx-auto space-y-6">
              <DocumentationPreview
                documentation={result.documentation}
                originalContent={result.documentation.original_readme_content}
                showDiff={true}
                onRegenerate={regenerateDocumentation}
                onFeedback={(rating, comment) =>
                  submitFeedback(result.documentation.id, rating, comment)
                }
              />

              <Button onClick={handleNewAnalysis} variant="outline" size="lg">
                Analyze Another Repository
              </Button>
            </div>
          )}
        </section>

        {!result && (
          <>
            {/* Features Section */}
            <section id="features" className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Why Choose RepoDocsAI?</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our AI-powered platform makes documentation generation
                  effortless and professional
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Bot className="h-6 w-6 text-blue-600" />
                      AI-Powered Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Advanced AI analyzes your entire codebase to understand
                      structure, dependencies, and purpose for comprehensive
                      documentation.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <GitPullRequest className="h-6 w-6 text-green-600" />
                      Pull Request Workflow
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Non-intrusive approach using GitHub pull requests. Review,
                      edit, and merge documentation on your terms.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Clock className="h-6 w-6 text-purple-600" />
                      Instant Generation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Get professional documentation in under 2 minutes. No
                      setup required, just paste your repository URL.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Code className="h-6 w-6 text-orange-600" />
                      Multi-Language Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Supports all major programming languages and frameworks.
                      Automatically detects and documents your tech stack.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Shield className="h-6 w-6 text-red-600" />
                      Privacy Focused
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Your code never leaves GitHub. We only access public
                      repositories and generate documentation without storing
                      your source code.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-teal-600" />
                      Professional Quality
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Generate documentation with proper formatting, badges,
                      code examples, and all essential sections developers
                      expect.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">
                  Simple, Transparent Pricing
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Start for free, upgrade when you need more. No hidden fees or
                  complex tiers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <PricingCard planId="anonymous" />
                <PricingCard planId="free" />
                <PricingCard planId="pro" isPopular />
                <PricingCard planId="team" />
              </div>
            </section>

            {/* Social Proof */}
            <section className="text-center space-y-8 py-12 bg-gray-50 rounded-2xl">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">
                  Trusted by Developers Worldwide
                </h2>
                <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>4.8/5 Average Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>10,000+ Repositories Documented</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span>2 Minute Average Generation Time</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}
