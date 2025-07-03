"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import {
  diagnosePlantDisease,
  type DiagnosePlantDiseaseOutput,
} from "@/ai/flows/diagnose-plant-disease";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { UploadCloud, X, BrainCircuit } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { SpeakButton } from "./speak-button";

export function DiseaseDiagnosis() {
  const { language, t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosePlantDiseaseOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {t('uploadTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!previewUrl && (
          <div
            className="flex flex-col items-center justify-center w-full p-10 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="w-12 h-12 text-muted-foreground" />
            <p className="mt-4 text-center text-muted-foreground">
              <span className="font-semibold text-primary">{t('uploadPrompt').split(' ').slice(0, 2).join(' ')}</span>{" "}
              {t('uploadPrompt').split(' ').slice(2).join(' ')}
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
              className="rounded-lg object-cover w-full aspect-square"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 rounded-full h-8 w-8"
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
            className="w-full text-lg py-6"
          >
            {loading ? (
              <>
                <BrainCircuit className="mr-2 h-5 w-5 animate-pulse" />
                {t('analyzingButton')}
              </>
            ) : (
              t('diagnoseButton')
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
            <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        )}

        {result && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>{t('diagnosisResultTitle')}</CardTitle>
                <SpeakButton text={result.diagnosis} lang={language} />
              </CardHeader>
              <CardContent>
                <p className="text-base">{result.diagnosis}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>{t('remediesResultTitle')}</CardTitle>
                <SpeakButton text={result.remedies} lang={language} />
              </CardHeader>
              <CardContent>
                <p className="text-base whitespace-pre-wrap">{result.remedies}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
