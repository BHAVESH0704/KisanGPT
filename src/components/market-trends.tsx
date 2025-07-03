"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  summarizeMarketTrends,
  type SummarizeMarketTrendsOutput,
} from "@/ai/flows/summarize-market-trends";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
      const trendsResult = await summarizeMarketTrends(values);
      setResult(trendsResult);
    } catch (err) {
      setError("An error occurred while fetching market trends. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Market Price Trends
        </CardTitle>
        <CardDescription className="text-center">
          Get recent market trends and future price predictions for your crop.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="crop"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Wheat, Tomato" {...field} />
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
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Punjab, Maharashtra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full text-lg py-6">
              {loading ? (
                <>
                  <BrainCircuit className="mr-2 h-5 w-5 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                 <BarChart className="mr-2 h-5 w-5" />
                 Get Trends
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
            <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        )}

        {result && (
            <div className="space-y-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle>Market Summary</CardTitle>
                        <SpeakButton text={result.summary} />
                    </CardHeader>
                    <CardContent>
                        <p>{result.summary}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle>Price Prediction</CardTitle>
                        <SpeakButton text={result.prediction} />
                    </CardHeader>
                    <CardContent>
                        <p>{result.prediction}</p>
                    </CardContent>
                </Card>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
