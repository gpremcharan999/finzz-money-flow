import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, BarChart3, PieChart } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

const Compare = () => {
  const [compareType, setCompareType] = useState<'days' | 'months' | 'years' | null>(null);

  const handleCompareType = (type: 'days' | 'months' | 'years') => {
    setCompareType(type);
    // TODO: Navigate to comparison page with the selected type
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-6 rounded-b-3xl shadow-glow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Compare</h1>
            <p className="text-primary-foreground/80">Analyze your spending patterns</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-6">
        {/* Compare Type Selection */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Choose Comparison Type</CardTitle>
            <CardDescription>Select the time period you want to compare</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-16 flex-col space-y-2 hover:bg-primary/5 hover:border-primary transition-all duration-300"
              onClick={() => handleCompareType('days')}
            >
              <Calendar className="w-6 h-6" />
              <span className="font-medium">Compare Days</span>
              <span className="text-xs text-muted-foreground">Compare specific dates</span>
            </Button>

            <Button
              variant="outline"
              className="w-full h-16 flex-col space-y-2 hover:bg-primary/5 hover:border-primary transition-all duration-300"
              onClick={() => handleCompareType('months')}
            >
              <Calendar className="w-6 h-6" />
              <span className="font-medium">Compare Months</span>
              <span className="text-xs text-muted-foreground">Compare monthly spending</span>
            </Button>

            <Button
              variant="outline"
              className="w-full h-16 flex-col space-y-2 hover:bg-primary/5 hover:border-primary transition-all duration-300"
              onClick={() => handleCompareType('years')}
            >
              <Calendar className="w-6 h-6" />
              <span className="font-medium">Compare Years</span>
              <span className="text-xs text-muted-foreground">Compare yearly trends</span>
            </Button>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg">What You'll Get</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium">Side-by-Side Bar Charts</p>
                <p className="text-sm text-muted-foreground">Compare total spending visually</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-income rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 text-success-foreground" />
              </div>
              <div>
                <p className="font-medium">Category Breakdown</p>
                <p className="text-sm text-muted-foreground">See spending by category for each period</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-expense rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-expense-foreground" />
              </div>
              <div>
                <p className="font-medium">Flexible Filtering</p>
                <p className="text-sm text-muted-foreground">Filter by specific categories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Advanced Comparison Coming Soon</h3>
            <p className="text-muted-foreground text-sm">
              Detailed comparison features with charts and analytics are being developed.
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Compare;