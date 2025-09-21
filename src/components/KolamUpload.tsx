import React, { useState, useCallback } from 'react';
import { Upload, FileImage, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface KolamUploadProps {
  onUpload: (file: File) => void;
  isProcessing?: boolean;
}

export const KolamUpload: React.FC<KolamUploadProps> = ({ onUpload, isProcessing = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }, []);

  const handleAnalyze = useCallback(() => {
    if (selectedFile) {
      onUpload(selectedFile);
      toast({
        title: "Analysis started",
        description: "Your kolam is being analyzed...",
      });
    }
  }, [selectedFile, onUpload, toast]);

  return (
    <div className="space-y-6">
      <Card className="cultural-border sacred-glow">
        <CardContent className="p-8">
          <div
            className={`upload-zone kolam-pattern p-12 rounded-lg text-center transition-all ${
              dragActive ? 'dragover' : ''
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              {selectedFile ? (
                <div className="space-y-4">
                  <FileImage className="w-16 h-16 mx-auto text-primary" />
                  <div>
                    <p className="text-lg font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button 
                    onClick={handleAnalyze}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze Kolam
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-16 h-16 mx-auto text-neon neon-pulse" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      Upload Your Kolam Image
                    </h3>
                    <p className="text-muted-foreground">
                      Drag and drop your kolam image here, or click to browse
                    </p>
                  </div>
                  <input
                    type="file"
                    id="kolam-upload"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label htmlFor="kolam-upload">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>Choose File</span>
                    </Button>
                  </label>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};