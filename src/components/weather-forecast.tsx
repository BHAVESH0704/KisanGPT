"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  getWeatherForecast,
  type GetWeatherForecastOutput,
} from "@/ai/flows/get-weather-forecast";
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
import { BrainCircuit, CloudSun as CloudSunIcon, Sun, Cloud, Cloudy, CloudRain, Wind, Thermometer } from "lucide-react";
import { SpeakButton } from "./speak-button";

const formSchema = z.object({
  location: z.string().min(2, "Location must be at least 2 characters."),
});

type IconName = 'Sun' | 'Cloud' | 'Cloudy' | 'CloudRain' | 'CloudSun' | 'Wind' | 'Thermometer';

const weatherIcons: Record<IconName, React.ReactNode> = {
    Sun: <Sun className="h-12 w-12 text-yellow-500" />,
    Cloud: <Cloud className="h-12 w-12 text-gray-400" />,
    Cloudy: <Cloudy className="h-12 w-12 text-gray-500" />,
    CloudRain: <CloudRain className="h-12 w-12 text-blue-500" />,
    CloudSun: <CloudSunIcon className="h-12 w-12 text-yellow-400" />,
    Wind: <Wind className="h-12 w-12 text-gray-400" />,
    Thermometer: <Thermometer className="h-12 w-12 text-red-500" />,
};

const WeatherIcon = ({ iconName }: { iconName: IconName }) => {
    return weatherIcons[iconName] || <CloudSunIcon className="h-12 w-12 text-gray-400" />;
}

export function WeatherForecast() {
  const { language, t } = useLanguage();
  const [result, setResult] = useState<GetWeatherForecastOutput | null>(null);
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
      const forecastResult = await getWeatherForecast({ ...values, language });
      setResult(forecastResult);
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
                {t('analyzingWeatherButton')}
              </>
            ) : (
              <>
               <CloudSunIcon className="mr-2 h-5 w-5" />
               {t('getForecastButton')}
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
          <div className="flex justify-between gap-4 pt-4">
              {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center space-y-2 flex-1 p-4 bg-muted/50 rounded-lg">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                  </div>
              ))}
          </div>
      )}

      {result && result.forecast && (
          <div className="space-y-4 pt-2 animate-fade-in-up">
              <Card className="bg-background/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg">{t('forecastResultTitle')}</CardTitle>
                      {result.summary && <SpeakButton text={result.summary} lang={language} />}
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        {result.forecast.map((dayForecast, index) => (
                            <div key={index} className="flex flex-col items-center p-4 rounded-lg bg-muted/50 space-y-2">
                                <p className="font-bold text-lg">{dayForecast.day}</p>
                                <WeatherIcon iconName={dayForecast.icon as IconName} />
                                <p className="font-semibold text-xl">{dayForecast.temperature}</p>
                                <p className="text-sm text-muted-foreground">{dayForecast.description}</p>
                            </div>
                        ))}
                    </div>
                  </CardContent>
              </Card>
          </div>
      )}
    </div>
  );
}
