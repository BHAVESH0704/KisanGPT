"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  testSoil,
  type TestSoilOutput,
} from "@/ai/flows/test-soil";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "./ui/button";
import { UploadCloud, X, BrainCircuit, FlaskConical } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  soilDescription: z.string().min(10, "Description must be at least 10 characters."),
});

export function SoilTesting() {
  const { language, t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<TestSoilOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      soilDescription: "",
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleFileClear = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const photoDataUri = file ? await fileToBase64(file) : undefined;
      const testResult = await testSoil({ ...values, photoDataUri, language });
      setResult(testResult);
    } catch (err) {
      setError(t('errorOccurred'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="soilDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('soilDescriptionLabel')}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t('soilDescriptionPlaceholder')} className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {!previewUrl ? (
             <div
                className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}>
                <UploadCloud className="w-8 h-8 text-muted-foreground" />
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    {t('uploadPrompt')}
                </p>
                 <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          ) : (
             <div className="relative w-full max-w-sm mx-auto">
                <Image src={previewUrl} alt="Soil preview" width={200} height={200} className="rounded-lg object-cover w-full aspect-square shadow-md" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 rounded-full h-8 w-8" onClick={handleFileClear}><X className="h-4 w-4" /></Button>
             </div>
          )}

          <Button type="submit" disabled={loading} className="w-full text-md py-5">
            {loading ? (
              <>
                <BrainCircuit className="mr-2 h-5 w-5 animate-pulse" />
                {t('analyzingSoilButton')}
              </>
            ) : (
              <>
               <FlaskConical className="mr-2 h-5 w-5" />
               {t('testSoilButton')}
              </>
            )}
          </Button>
        </form>
      </Form>
      
      {error && (
          <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
          </Alert>
      )}

      {loading && (
          <div className="space-y-2 pt-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
          </div>
      )}

      {result && result.report && (
        <div className="pt-2 animate-fade-in-up">
            <Card className="bg-background/50">
                <CardHeader>
                    <CardTitle className="text-lg">{t('soilReportTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div>
                        <h4 className="font-semibold text-primary">{t('phLevel')}</h4>
                        <p className="text-muted-foreground">{result.report.phLevel}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-primary">{t('nutrientDeficiencies')}</h4>
                        <p className="text-muted-foreground">{result.report.nutrientDeficiencies}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-primary">{t('recommendations')}</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">{result.report.recommendations}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
