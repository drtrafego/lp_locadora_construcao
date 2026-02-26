import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Locadora da Construção - Equipamentos com Respaldo de Engenheiro",
  description: "Locação de equipamentos para construção civil em Cuiabá. 39 anos de experiência com suporte técnico de engenheiro.",
  openGraph: {
    title: "Locadora da Construção",
    description: "Equipamentos com respaldo de engenheiro em Cuiabá.",
    url: "https://locadoradaconstrucao.com.br",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Locadora da Construção",
    "image": "https://locadoradaconstrucao.com.br/logo.png",
    "description": "Locação de equipamentos para construção civil.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. das Torres, 1001, Bairro CPA III",
      "addressLocality": "Cuiabá",
      "addressRegion": "MT",
      "postalCode": "78090-770",
      "addressCountry": "BR"
    },
    "telephone": "+5565992334612"
  };

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
