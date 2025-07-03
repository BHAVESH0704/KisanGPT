'use client';

import { Leaf, DollarSign, ScrollText, Languages, CloudSun, Store } from "lucide-react";
import Image from "next/image";
import { DiseaseDiagnosis } from "@/components/disease-diagnosis";
import { MarketTrends } from "@/components/market-trends";
import { SchemeInfo } from "@/components/scheme-info";
import { WeatherForecast } from "@/components/weather-forecast";
import { AgroShops } from "@/components/agro-shops";
import { useLanguage, type Language } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary tracking-tight">
              {t('title')}
            </h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Languages className="h-4 w-4 mr-2" />
                {language.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={language}
                onValueChange={(value) => setLanguage(value as Language)}
              >
                <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="hi">हिंदी (Hindi)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="mr">मराठी (Marathi)</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    {t('title')}
                  </h1>
                   <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    {t('description')}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                  <Image
                    src="https://placehold.co/400x400.png"
                    alt="Farmer"
                    width={400}
                    height={400}
                    className="rounded-full object-cover shadow-2xl"
                    data-ai-hint="happy farmer"
                  />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Leaf className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{t('diseaseDiagnosisTab')}</CardTitle>
                  </div>
                   <CardDescription>{t('uploadTitle')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <DiseaseDiagnosis />
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{t('marketTrendsTab')}</CardTitle>
                  </div>
                  <CardDescription>{t('marketDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <MarketTrends />
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <ScrollText className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{t('govtSchemesTab')}</CardTitle>
                  </div>
                  <CardDescription>{t('schemeDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <SchemeInfo />
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CloudSun className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{t('weatherTab')}</CardTitle>
                  </div>
                  <CardDescription>{t('weatherDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <WeatherForecast />
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Store className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{t('agroShopsTab')}</CardTitle>
                  </div>
                  <CardDescription>{t('agroShopsDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <AgroShops />
                </CardContent>
              </Card>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
