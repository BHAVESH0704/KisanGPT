"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  summarizeMarketTrends,
  type SummarizeMarketTrendsOutput,
} from "@/ai/flows/summarize-market-trends";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
import { BarChart, BrainCircuit } from "lucide-react";
import { SpeakButton } from "./speak-button";

const formSchema = z.object({
  crop: z.string().min(2, "Crop name must be at least 2 characters."),
  location: z.string().min(2, "Location must be at least 2 characters."),
});

export function MarketTrends() {
  const { language, t } = useLanguage();
  const [result, setResult] = useState<SummarizeMarketTrendsOutput | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop: "",
      location: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const trendsResult = await summarizeMarketTrends({...values, language});
      setResult(trendsResult);
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
            name="crop"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('cropLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('cropPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('locationLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('locationPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full text-md py-5">
            {loading ? (
              <>
                <BrainCircuit className="mr-2 h-5 w-5 animate-pulse" />
                {t('analyzingButton')}
              </>
            ) : (
              <>
               <BarChart className="mr-2 h-5 w-5" />
               {t('getTrendsButton')}
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
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
          </div>
      )}

      {result && (
          <div className="space-y-4 pt-2 animate-fade-in-up">
              <Card className="bg-background/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg">{t('marketSummaryTitle')}</CardTitle>
                      <SpeakButton text={result.summary} lang={language} />
                  </CardHeader>
                  <CardContent>
                      <p>{result.summary}</p>
                  </CardContent>
              </Card>
              <Card className="bg-background/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg">{t('pricePredictionTitle')}</CardTitle>
                      <SpeakButton text={result.prediction} lang={language} />
                  </CardHeader>
                  <CardContent>
                      <p>{result.prediction}</p>
                  </CardContent>
              </Card>
          </div>
      )}
    </div>
  );
}
