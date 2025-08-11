import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PLAN_CONFIGS } from '@/lib/types';
import { Check, X, Zap, Users, Shield } from 'lucide-react';

export interface PricingCardProps {
  planId: 'anonymous' | 'free' | 'pro' | 'team';
  isCurrentPlan?: boolean;
  isPopular?: boolean;
  onSelectPlan?: (planId: string) => void;
  className?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  planId,
  isCurrentPlan = false,
  isPopular = false,
  onSelectPlan,
  className
}) => {
  const plan = PLAN_CONFIGS[planId];
  
  if (!plan) {
    return null;
  }

  const getPlanIcon = () => {
    switch (planId) {
      case 'pro':
        return <Zap className="h-6 w-6" />;
      case 'team':
        return <Users className="h-6 w-6" />;
      case 'free':
        return <Shield className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const getButtonText = () => {
    if (isCurrentPlan) {
      return 'Current Plan';
    }
    
    if (planId === 'anonymous') {
      return 'Try Now';
    }
    
    if (planId === 'free') {
      return 'Sign Up Free';
    }
    
    return 'Upgrade Now';
  };

  const handleSelectPlan = () => {
    if (onSelectPlan && !isCurrentPlan) {
      onSelectPlan(planId);
    }
  };

  return (
    <Card className={cn(
      'relative w-full',
      isPopular && 'border-blue-500 shadow-lg',
      isCurrentPlan && 'border-green-500',
      className
    )}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-600 text-white px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Plan Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {getPlanIcon()}
              <h3 className="text-xl font-bold">{plan.name}</h3>
            </div>
            
            <div className="mb-4">
              {plan.price_usd ? (
                <div>
                  <span className="text-3xl font-bold">${plan.price_usd}</span>
                  <span className="text-gray-600">/month</span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-green-600">Free</span>
              )}
            </div>

            <div className="text-sm text-gray-600">
              {plan.monthly_limit === -1 ? (
                <span className="font-semibold text-blue-600">Unlimited</span>
              ) : (
                <>
                  <span className="font-semibold">{plan.monthly_limit}</span> generations
                </>
              )} per month
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-600">
              Features
            </h4>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Limitations (for free plans) */}
          {planId === 'anonymous' && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-600">
                Limitations
              </h4>
              <ul className="space-y-1">
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">No usage dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">No regeneration capability</span>
                </li>
              </ul>
            </div>
          )}

          {/* CTA Button */}
          <Button
            onClick={handleSelectPlan}
            disabled={isCurrentPlan}
            variant={isPopular ? 'default' : 'outline'}
            className={cn(
              'w-full',
              isCurrentPlan && 'bg-green-600 hover:bg-green-700',
              isPopular && 'bg-blue-600 hover:bg-blue-700'
            )}
          >
            {getButtonText()}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCard;