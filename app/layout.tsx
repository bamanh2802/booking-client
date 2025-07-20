import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";
import { ConditionalNavbar } from "./conditional-navbar";

import StoreProvider from "@/StoreProvider";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: "VeXeNay.com - Vé xe này, Cho vay nhanh | Đặt vé xe online giá rẻ",
    template: `%s | VeXeNay.com - Vé xe này, Cho vay nhanh`,
  },
  description:
    "VeXeNay.com - Đặt vé xe này online giá rẻ, cho vay nhanh lãi suất thấp. Hơn 1000+ tuyến xe khách, limousine cao cấp. Vay tiền nhanh 24/7, duyệt tự động.",
  keywords: [
    "vé xe này",
    "vexenay",
    "vé xe",
    "đặt vé xe online",
    "xe khách giá rẻ",
    "cho vay nhanh",
    "vay tiền online",
    "vay tiền nhanh",
    "cho vay lãi suất thấp",
    "xe limousine",
    "xe giường nằm",
    "đặt xe khách",
    "vé xe bus",
    "booking xe khách",
    "vay tiền không thế chấp",
    "cho vay tín chấp",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://vexenay.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://vexenay.com",
    siteName: "VeXeNay.com",
    title: "VeXeNay.com - Vé xe này, Cho vay nhanh | Đặt vé xe online giá rẻ",
    description:
      "VeXeNay.com - Đặt vé xe này online giá rẻ, cho vay nhanh lãi suất thấp. Hơn 1000+ tuyến xe khách, limousine cao cấp. Vay tiền nhanh 24/7.",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VeXeNay.com - Vé xe này, Cho vay nhanh online",
      },
    ],
  },
  category: "travel",
  classification: "Business",
  icons: {
    icon: [
      { url: "/assets/logo.png" },
      { url: "/assets/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/assets/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/assets/favicon.ico",
  },
  manifest: "/manifest.json",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Ngăn zoom trên mobile
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="vi" // Đổi thành tiếng Việt
      dir="ltr"
    >
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* DNS Prefetch cho các domain thường dùng */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* Structured Data cho Business - Đa dịch vụ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["TravelAgency", "FinancialService"],
              name: "VeXeNay.com",
              alternateName: ["Vé xe này", "VeXeNay"],
              url: "https://vexenay.com",
              logo: "https://vexenay.com/assets/logo.png",
              description:
                "VeXeNay.com - Đặt vé xe này online giá rẻ, cho vay nhanh lãi suất thấp",
              areaServed: "VN",
              serviceType: ["Bus Ticket Booking", "Personal Loans"],
              priceRange: "$",
              telephone: "+84-xxx-xxx-xxx", // Thay số thật
              address: {
                "@type": "PostalAddress",
                addressCountry: "VN",
                addressLocality: "Hà Nội", // Thay địa chỉ thật
              },
              sameAs: [
                "https://facebook.com/vexenay", // Thay link thật
                "https://twitter.com/vexenay",
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Dịch vụ VeXeNay.com",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Đặt vé xe khách online",
                      description: "Đặt vé xe này online với giá tốt nhất",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Cho vay nhanh online",
                      description:
                        "Vay tiền nhanh với lãi suất thấp, duyệt tự động 24/7",
                    },
                  },
                ],
              },
            }),
          }}
        />

        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "VeXeNay.com",
                  item: "https://vexenay.com",
                },
              ],
            }),
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <StoreProvider>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="relative flex flex-col min-h-screen">
              <ConditionalNavbar />
              <main className="flex-1" id="main-content">
                {children}
              </main>
            </div>
          </Providers>
        </StoreProvider>

        {/* Skip to main content cho accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50"
        >
          Chuyển đến nội dung chính
        </a>
      </body>
    </html>
  );
}
