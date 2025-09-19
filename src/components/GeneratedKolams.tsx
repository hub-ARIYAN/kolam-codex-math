import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const GeneratedKolams: React.FC = () => {
  // Placeholder data for generated kolams - will be connected to backend later
  const placeholderKolams = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Generated Kolam ${i + 1}`,
    pattern: `Pattern Type ${i + 1}`,
    complexity: Math.floor(Math.random() * 5) + 1,
  }));

  return (
    <Card className="cultural-border sacred-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <Sparkles className="w-6 h-6 text-nature mandala-spin" />
          Generated Kolam Gallery
        </CardTitle>
        <p className="text-muted-foreground">
          AI-generated kolam patterns based on traditional designs and mathematical principles
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholderKolams.map((kolam) => (
            <div 
              key={kolam.id}
              className="group relative bg-card/50 rounded-lg p-4 border border-nature/20 hover:border-nature/40 transition-all duration-300 kolam-pattern"
            >
              <div className="aspect-square bg-gradient-to-br from-nature/10 to-mystic/10 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 mx-auto border-2 border-nature rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-nature" />
                  </div>
                  <p className="text-xs text-muted-foreground">Generated Pattern</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">{kolam.title}</h4>
                <p className="text-sm text-muted-foreground">{kolam.pattern}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < kolam.complexity ? 'bg-nature' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">Complexity</span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add More Button */}
          <div className="group relative bg-card/30 rounded-lg p-4 border-2 border-dashed border-nature/30 hover:border-nature/50 transition-all duration-300 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto border-2 border-nature/50 rounded-full flex items-center justify-center group-hover:border-nature transition-colors">
                <Plus className="w-8 h-8 text-nature/50 group-hover:text-nature transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Generate More</p>
                <p className="text-xs text-muted-foreground">Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            disabled
            className="border-nature/30 text-nature/50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate New Kolams (Coming Soon)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};