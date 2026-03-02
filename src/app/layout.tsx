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
      "streetAddress": "Av. Des. Antônio Quirino de Araújo, 121 - Areão",
      "addressLocality": "Cuiabá",
      "addressRegion": "MT",
      "postalCode": "78010-650",
      "addressCountry": "BR"
    },
    "telephone": "+5565992334612"
  };

  return (
    <html lang="pt-BR">
      <head>
        {/* Force redeploy - GTM Sync */}
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KWB68VQQ');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KWB68VQQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
