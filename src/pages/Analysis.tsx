import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KolamResults } from '@/components/KolamResults';
import { GeneratedKolams } from '@/components/GeneratedKolams';
import { useNavigate } from 'react-router-dom';
import { useKolamAnalysis } from '@/hooks/useKolamAnalysis';

export const Analysis: React.FC = () => {
  const navigate = useNavigate();
  const { 
    analysisData, 
    isProcessing, 
    downloadAnalysisImage, 
    openDesmos,
    hasResults 
  } = useKolamAnalysis();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="sacred-glow"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Upload
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Kolam Analysis Results</h1>
            <p className="text-muted-foreground">Discover the cultural significance and mathematical beauty</p>
          </div>
        </div>
        
        <div className="space-y-12">
          {isProcessing && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Processing your kolam analysis...</p>
            </div>
          )}
          
          {hasResults && (
            <KolamResults 
              analysisData={analysisData}
              onDownloadImage={downloadAnalysisImage}
              onViewDesmos={openDesmos}
            />
          )}
          
          <GeneratedKolams />
        </div>
      </div>
    </div>
  );
};

export default Analysis;