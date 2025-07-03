"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  getGovernmentSchemeInfo,
  type GetGovernmentSchemeInfoOutput,
} from "@/ai/flows/get-government-scheme-info";
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
import { Textarea } from "./ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Skeleton } from "./ui/skeleton";
import { BrainCircuit, BookOpen } from "lucide-react";
import { SpeakButton } from "./speak-button";

const formSchema = z.object({
  farmerDetails: z.string().min(10, "Please provide more details about your farming situation."),
  query: z.string().min(5, "Query must be at least 5 characters."),
});

export function SchemeInfo() {
  const [result, setResult] = useState<GetGovernmentSchemeInfoOutput | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      farmerDetails: "",
      query: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const schemeResult = await getGovernmentSchemeInfo(values);
      setResult(schemeResult);
    } catch (err) {
      setError("An error occurred while fetching scheme information. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Government Scheme Navigator
        </CardTitle>
        <CardDescription className="text-center">
          Find relevant government schemes based on your profile and needs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="farmerDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farmer Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Small farmer from Karnataka, growing rice and cotton."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Question</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., How to apply for crop insurance?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full text-lg py-6">
              {loading ? (
                <>
                  <BrainCircuit className="mr-2 h-5 w-5 animate-pulse" />
                  Searching...
                </>
              ) : (
                <>
                  <BookOpen className="mr-2 h-5 w-5" />
                  Find Schemes
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
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        )}

        {result && (
          <div>
            {result.schemes.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {result.schemes.map((scheme, index) => {
                  const schemeText = `Scheme: ${scheme.name}. Eligibility: ${scheme.eligibility}. Application Process: ${scheme.applicationProcess}. Status Updates: ${scheme.statusUpdates}.`;
                  return (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="text-lg">
                        {scheme.name}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 text-base">
                        <div className="flex justify-end">
                            <SpeakButton text={schemeText} />
                        </div>
                        <div>
                          <h4 className="font-semibold">Eligibility</h4>
                          <p>{scheme.eligibility}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Application Process</h4>
                          <p>{scheme.applicationProcess}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Status Updates</h4>
                          <p>{scheme.statusUpdates}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <Alert>
                <AlertTitle>No Schemes Found</AlertTitle>
                <AlertDescription>
                  We couldn't find any specific schemes based on your query. Please try rephrasing or providing more details.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
