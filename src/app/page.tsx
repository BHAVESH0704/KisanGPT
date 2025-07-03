'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, DollarSign, ScrollText, Languages } from "lucide-react";
import { DiseaseDiagnosis } from "@/components/disease-diagnosis";
import { MarketTrends } from "@/components/market-trends";
import { SchemeInfo } from "@/components/scheme-info";
import { useLanguage, type Language } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-10 relative">
          <div className="absolute top-0 right-0">
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

          <div className="flex justify-center items-center gap-4 mb-2">
            <Leaf className="h-12 w-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary">
              {t('title')}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {t('description')}
          </p>
        </header>

        <Tabs defaultValue="disease" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-12 rounded-lg">
            <TabsTrigger value="disease" className="py-2.5 text-base gap-2">
              <Leaf className="h-5 w-5" />
              {t('diseaseDiagnosisTab')}
            </TabsTrigger>
            <TabsTrigger value="market" className="py-2.5 text-base gap-2">
              <DollarSign className="h-5 w-5" />
              {t('marketTrendsTab')}
            </TabsTrigger>
            <TabsTrigger value="schemes" className="py-2.5 text-base gap-2">
              <ScrollText className="h-5 w-5" />
              {t('govtSchemesTab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="disease" className="mt-6">
            <DiseaseDiagnosis />
          </TabsContent>
          <TabsContent value="market" className="mt-6">
            <MarketTrends />
          </TabsContent>
          <TabsContent value="schemes" className="mt-6">
            <SchemeInfo />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
