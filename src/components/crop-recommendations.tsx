"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  getCropRecommendations,
  type GetCropRecommendationsOutput,
} from "@/ai/flows/get-crop-recommendations";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Skeleton } from "./ui/skeleton";
import { BrainCircuit, Sprout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const formSchema = z.object({
  location: z.string().min(2, "State name must be at least 2 characters."),
});

export function CropRecommendations() {
  const { language, t } = useLanguage();
  const [result, setResult] = useState<GetCropRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const recommendationResult = await getCropRecommendations({ ...values, language });
      setResult(recommendationResult);
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
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('stateLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('statePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full text-md py-5">
            {loading ? (
              <>
                <BrainCircuit className="mr-2 h-5 w-5 animate-pulse" />
                {t('analyzingCropsButton')}
              </>
            ) : (
              <>
               <Sprout className="mr-2 h-5 w-5" />
               {t('getRecommendationsButton')}
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
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
          </div>
      )}

      {result && (
        <div className="pt-2 animate-fade-in-up">
          {result.recommendations.length > 0 ? (
            <Card className="bg-background/50">
                <CardHeader>
                    <CardTitle className="text-lg">{t('recommendationsTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {result.recommendations.map((crop, index) => (
                        <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                            <p className="font-bold text-primary">{crop.name}</p>
                            <p className="font-semibold">{crop.plantingSeason}</p>
                            <p className="text-sm text-muted-foreground">{crop.reasoning}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
          ) : (
            <Alert>
              <AlertTitle>{t('noRecommendationsFoundTitle')}</AlertTitle>
              <AlertDescription>
                {t('noRecommendationsFoundDescription')}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
