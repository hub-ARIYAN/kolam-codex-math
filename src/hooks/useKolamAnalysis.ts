import { useState, useCallback } from 'react';
import { kolamApi, KolamAnalysisResponse } from '@/services/kolamApi';
import { useToast } from '@/hooks/use-toast';

export interface KolamAnalysisState {
  isUploading: boolean;
  isAnalyzing: boolean;
  analysisId: string | null;
  analysisData: KolamAnalysisResponse | null;
  error: string | null;
  uploadedFile: File | null;
}

export const useKolamAnalysis = () => {
  const [state, setState] = useState<KolamAnalysisState>({
    isUploading: false,
    isAnalyzing: false,
    analysisId: null,
    analysisData: null,
    error: null,
    uploadedFile: null,
  });

  const { toast } = useToast();

  // Upload kolam and start analysis
  const uploadKolam = useCallback(async (file: File) => {
    setState(prev => ({ 
      ...prev, 
      isUploading: true, 
      error: null, 
      uploadedFile: file 
    }));

    try {
      const uploadResponse = await kolamApi.uploadKolam(file);
      
      if (uploadResponse.success) {
        setState(prev => ({ 
          ...prev, 
          isUploading: false,
          isAnalyzing: true,
          analysisId: uploadResponse.analysisId 
        }));

        toast({
          title: "Upload successful",
          description: "Your kolam is being analyzed...",
        });

        // Poll for analysis completion
        pollAnalysisStatus(uploadResponse.analysisId);
      } else {
        throw new Error(uploadResponse.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setState(prev => ({ 
        ...prev, 
        isUploading: false,
        error: errorMessage 
      }));

      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Poll analysis status and fetch results when complete
  const pollAnalysisStatus = useCallback(async (analysisId: string) => {
    const maxAttempts = 30; // 5 minutes with 10-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const statusResponse = await kolamApi.getAnalysisStatus(analysisId);
        
        if (statusResponse.status === 'completed') {
          // Fetch complete analysis results
          const analysisData = await kolamApi.getAnalysisResults(analysisId);
          
          setState(prev => ({
            ...prev,
            isAnalyzing: false,
            analysisData,
            error: null,
          }));

          toast({
            title: "Analysis complete",
            description: "Your kolam analysis is ready!",
          });
          
          return;
        } else if (statusResponse.status === 'failed') {
          throw new Error('Analysis failed on server');
        } else if (attempts >= maxAttempts) {
          throw new Error('Analysis timed out');
        }

        // Continue polling
        attempts++;
        setTimeout(poll, 10000); // Poll every 10 seconds
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          error: errorMessage,
        }));

        toast({
          title: "Analysis failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    poll();
  }, [toast]);

  // Download analysis image
  const downloadAnalysisImage = useCallback(async () => {
    if (!state.analysisId) return;

    try {
      const blob = await kolamApi.downloadAnalysisImage(state.analysisId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kolam-analysis-${state.analysisId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "Analysis image is being downloaded...",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download analysis image",
        variant: "destructive",
      });
    }
  }, [state.analysisId, toast]);

  // Open Desmos with equations
  const openDesmos = useCallback(() => {
    if (state.analysisData?.desmosUrl) {
      window.open(state.analysisData.desmosUrl, '_blank');
    }
  }, [state.analysisData?.desmosUrl]);

  // Reset analysis state
  const resetAnalysis = useCallback(() => {
    setState({
      isUploading: false,
      isAnalyzing: false,
      analysisId: null,
      analysisData: null,
      error: null,
      uploadedFile: null,
    });
  }, []);

  // Manual data setters for development/testing
  const setAnalysisData = useCallback((data: KolamAnalysisResponse) => {
    setState(prev => ({ ...prev, analysisData: data }));
  }, []);

  const setAnalysisId = useCallback((id: string) => {
    setState(prev => ({ ...prev, analysisId: id }));
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    uploadKolam,
    downloadAnalysisImage,
    openDesmos,
    resetAnalysis,
    
    // Development helpers
    setAnalysisData,
    setAnalysisId,
    
    // Computed state
    isProcessing: state.isUploading || state.isAnalyzing,
    hasResults: !!state.analysisData,
    canDownload: !!state.analysisData?.analysisImageUrl,
    canViewDesmos: !!state.analysisData?.desmosUrl,
  };
};