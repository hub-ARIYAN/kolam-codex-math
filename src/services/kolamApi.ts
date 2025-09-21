// Central API service for all Kolam backend connections
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com' 
  : 'http://localhost:8000';

export interface KolamAnalysisResponse {
  culturalDescription: string;
  mathematicalAnalysis: string;
  analysisImageUrl: string;
  equations: string;
  desmosUrl: string;
  generatedKolams?: string[];
}

export interface KolamUploadResponse {
  success: boolean;
  analysisId: string;
  message: string;
}

class KolamApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Upload kolam image for analysis
  async uploadKolam(file: File): Promise<KolamUploadResponse> {
    const formData = new FormData();
    formData.append('kolam_image', file);

    const response = await fetch(`${this.baseUrl}/upload-kolam`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Get complete analysis results
  async getAnalysisResults(analysisId: string): Promise<KolamAnalysisResponse> {
    const response = await fetch(`${this.baseUrl}/analysis/${analysisId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Analysis fetch failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Get cultural description only
  async getCulturalDescription(analysisId: string): Promise<{ culturalDescription: string }> {
    const response = await fetch(`${this.baseUrl}/cultural-description/${analysisId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Cultural description fetch failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Get mathematical analysis text
  async getMathematicalAnalysis(analysisId: string): Promise<{ mathematicalAnalysis: string }> {
    const response = await fetch(`${this.baseUrl}/mathematical-analysis/${analysisId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Mathematical analysis fetch failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Get analysis visualization image
  async getAnalysisImage(analysisId: string): Promise<{ analysisImageUrl: string }> {
    const response = await fetch(`${this.baseUrl}/analysis-image/${analysisId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Analysis image fetch failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Download analysis image
  async downloadAnalysisImage(analysisId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/download-analysis/${analysisId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Image download failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Get parametric equations
  async getParametricEquations(analysisId: string): Promise<{ equations: string; desmosUrl: string }> {
    const response = await fetch(`${this.baseUrl}/parametric-equations/${analysisId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Equations fetch failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Get generated kolams
  async getGeneratedKolams(analysisId: string): Promise<{ generatedKolams: string[] }> {
    const response = await fetch(`${this.baseUrl}/generated-kolams/${analysisId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Generated kolams fetch failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Check analysis status
  async getAnalysisStatus(analysisId: string): Promise<{ status: 'processing' | 'completed' | 'failed' }> {
    const response = await fetch(`${this.baseUrl}/analysis-status/${analysisId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Export singleton instance
export const kolamApi = new KolamApiService();

// Export class for testing or custom instances
export { KolamApiService };