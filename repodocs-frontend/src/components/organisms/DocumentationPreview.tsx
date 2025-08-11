import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import StatusBadge from '@/components/atoms/StatusBadge';
import { cn } from '@/lib/utils';
import { GeneratedDocumentation } from '@/lib/types';
import { 
  Eye, 
  Code, 
  GitPullRequest, 
  Download, 
  RefreshCw, 
  Star,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

export interface DocumentationPreviewProps {
  documentation: GeneratedDocumentation;
  originalContent?: string;
  showDiff?: boolean;
  onApprove?: () => void;
  onRegenerate?: () => void;
  onFeedback?: (rating: number, comment?: string) => void;
  className?: string;
}

const DocumentationPreview: React.FC<DocumentationPreviewProps> = ({
  documentation,
  originalContent,
  showDiff = false,
  onApprove,
  onRegenerate,
  onFeedback,
  className
}) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(documentation.generated_content);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([documentation.generated_content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFeedbackSubmit = () => {
    if (feedbackRating && onFeedback) {
      onFeedback(feedbackRating, feedbackComment.trim() || undefined);
      setFeedbackRating(null);
      setFeedbackComment('');
    }
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering - in production, use a proper markdown parser
    return (
      <div className="prose prose-gray max-w-none">
        <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg overflow-auto">
          {content}
        </pre>
      </div>
    );
  };

  const renderDiff = () => {
    if (!originalContent) {
      return (
        <Alert>
          <AlertDescription>
            No original README found. This will create a new README.md file.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm mb-2 text-red-600">Original README</h4>
            <div className="border rounded-lg p-4 bg-red-50 max-h-96 overflow-auto">
              <pre className="text-sm whitespace-pre-wrap">{originalContent}</pre>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2 text-green-600">Generated README</h4>
            <div className="border rounded-lg p-4 bg-green-50 max-h-96 overflow-auto">
              <pre className="text-sm whitespace-pre-wrap">{documentation.generated_content}</pre>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Generated Documentation
          </CardTitle>
          <div className="flex items-center gap-2">
            {documentation.pr_status && (
              <StatusBadge status={documentation.pr_status} />
            )}
            {documentation.github_pr_url && (
              <Button variant="outline" size="sm" asChild>
                <a 
                  href={documentation.github_pr_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View PR
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Content Sections Summary */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(documentation.content_sections).map((section) => (
            <Badge key={section} variant="secondary" className="capitalize">
              {section.replace('_', ' ')}
            </Badge>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="raw" className="gap-2">
              <Code className="h-4 w-4" />
              Raw Markdown
            </TabsTrigger>
            {showDiff && (
              <TabsTrigger value="diff" className="gap-2">
                <GitPullRequest className="h-4 w-4" />
                Diff
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            {renderMarkdown(documentation.generated_content)}
          </TabsContent>

          <TabsContent value="raw" className="mt-4">
            <div className="relative">
              <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
                {documentation.generated_content}
              </pre>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToClipboard}
                className="absolute top-2 right-2 gap-2"
              >
                {copiedToClipboard ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {showDiff && (
            <TabsContent value="diff" className="mt-4">
              {renderDiff()}
            </TabsContent>
          )}
        </Tabs>

        <Separator />

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {onApprove && (
            <Button onClick={onApprove} className="gap-2">
              <GitPullRequest className="h-4 w-4" />
              Create Pull Request
            </Button>
          )}
          
          {onRegenerate && (
            <Button variant="outline" onClick={onRegenerate} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
          )}

          <Button variant="outline" onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>

        {/* Feedback Section */}
        {onFeedback && (
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium">Rate this documentation</h4>
            
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFeedbackRating(rating)}
                  className={cn(
                    'p-1 rounded transition-colors',
                    feedbackRating && rating <= feedbackRating
                      ? 'text-yellow-500'
                      : 'text-gray-300 hover:text-yellow-400'
                  )}
                >
                  <Star className="h-5 w-5 fill-current" />
                </button>
              ))}
            </div>

            {feedbackRating && (
              <div className="space-y-3">
                <Textarea
                  placeholder="Optional: Share your thoughts on the generated documentation..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className="min-h-20"
                />
                <Button onClick={handleFeedbackSubmit} size="sm">
                  Submit Feedback
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentationPreview;