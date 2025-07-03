"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import {
  diagnosePlantDisease,
  type DiagnosePlantDiseaseOutput,
} from "@/ai/flows/diagnose-plant-disease";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "./ui/button";
import { UploadCloud, X, BrainCircuit, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { SpeakButton } from "./speak-button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function DiseaseDiagnosis() {
  const { language, t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosePlantDiseaseOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFileClear = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const photoDataUri = await fileToBase64(file);
      const diagnosisResult = await diagnosePlantDisease({ photoDataUri, language });
      setResult(diagnosisResult);
    } catch (err) {
      setError(t('errorOccurred'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!previewUrl && (
        <div
          className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="w-10 h-10 text-muted-foreground" />
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {t('uploadPrompt')}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t('uploadHint')}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
          />
        </div>
      )}

      {previewUrl && (
        <div className="relative w-full max-w-sm mx-auto">
          <Image
            src={previewUrl}
            alt="Plant preview"
            width={400}
            height={400}
            className="rounded-lg object-cover w-full aspect-square shadow-md"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full h-8 w-8 shadow-lg"
            onClick={handleFileClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div>
        <Button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="w-full text-md py-5"
        >
          {loading ? (
            <>
              <BrainCircuit className="mr-2 h-5 w-5 animate-pulse" />
              {t('analyzingButton')}
            </>
          ) : (
             <>
              <BrainCircuit className="mr-2 h-5 w-5" />
              {t('diagnoseButton')}
             </>
          )}
        </Button>
      </div>

      {error && (
          <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
          </Alert>
      )}

      {loading && (
        <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
      )}

      {result && (
        <div className="space-y-4 pt-2 animate-fade-in-up">
          <Card className="bg-background/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-lg"><CheckCircle2 className="text-green-500" />{t('diagnosisResultTitle')}</CardTitle>
              <SpeakButton text={result.diagnosis} lang={language} />
            </CardHeader>
            <CardContent>
              <p className="text-base">{result.diagnosis}</p>
            </CardContent>
          </Card>
          <Card className="bg-background/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">{t('remediesResultTitle')}</CardTitle>
              <SpeakButton text={result.remedies} lang={language} />
            </CardHeader>
            <CardContent>
              <p className="text-base whitespace-pre-wrap">{result.remedies}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
