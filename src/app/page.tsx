'use client';

import { Leaf, DollarSign, ScrollText, Languages, CloudSun, Store, Sprout, TestTube2, Users, Search, User } from "lucide-react";
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
import { CropRecommendations } from "@/components/crop-recommendations";
import { SoilTesting } from "@/components/soil-testing";
import { FarmerCommunity } from "@/components/farmer-community";

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
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
            </Button>
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
                    src="https://placehold.co/500x500.png"
                    alt="Farmer"
                    width={500}
                    height={500}
                    className="rounded-full object-cover shadow-2xl"
                    data-ai-hint="indian farmer smiling"
                  />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-10">{t('featuresTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Leaf className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{t('uploadTitle')}</CardTitle>
                  </div>
                   <CardDescription>{t('diseaseDiagnosisTab')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <DiseaseDiagnosis />
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{t('marketDescription')}</CardTitle>
                  </div>
                  <CardDescription>{t('marketTrendsTab')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <MarketTrends />
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <ScrollText className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{t('schemeDescription')}</CardTitle>
                  </div>
                  <CardDescription>{t('govtSchemesTab')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <SchemeInfo />
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CloudSun className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{t('weatherDescription')}</CardTitle>
                  </div>
                  <CardDescription>{t('weatherTab')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <WeatherForecast />
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Store className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{t('agroShopsDescription')}</CardTitle>
                  </div>
                  <CardDescription>{t('agroShopsTab')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <AgroShops />
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Sprout className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{t('cropRecommendationsDescription')}</CardTitle>
                  </div>
                  <CardDescription>{t('cropRecommendationsTab')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CropRecommendations />
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <TestTube2 className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{t('soilTestingDescription')}</CardTitle>
                  </div>
                  <CardDescription>{t('soilTestingTab')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <SoilTesting />
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{t('farmerCommunityDescription')}</CardTitle>
                  </div>
                  <CardDescription>{t('farmerCommunityTab')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <FarmerCommunity />
                </CardContent>
              </Card>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
