import "@/app/globals.css";
import { GlobalContainer } from "@/components/containers";
import { Header, Footer } from "@/components/ui";

export const metadata = {
  metadataBase: new URL(`https://${process.env.VERCEL_URL}`),
  title: {
    template: "FENIX",
    default: "FENIX",
  },
  description: "Empower your crypto, earn while you hold Fenix",
  openGraph: {
    title: "FENIX",
    description: "Empower your crypto, earn while you hold Fenix",
    url: "https://fenix-fyi",
    siteName: "fenix.fyi",
    images: [
      {
        url: "/images/open-graph/og-alt.jpg",
        width: 2560,
        height: 1280,
        alt: "FENIX",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  icons: {
    icon: [{ url: "/images/icons/icon.png" }, new URL("/images/icons/icon.png", "https://fenix.fyi")],
    shortcut: ["/images/icons/favicon.ico"],
    apple: [
      { url: "/images/icons/icon@60.png" },
      { url: "/images/icons/icon@152.png", sizes: "152x152", type: "image/png" },
      { url: "/images/icons/icon@180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/images/icons/icon@180.png",
      },
    ],
  },
  manifest: "/manifest.json",
  twitter: {
    card: "summary_large_image",
    title: "FENIX",
    description: "Empower your crypto, earn while you hold Fenix",
    siteId: "1612469567934062592",
    creator: "@fenix_protocol",
    creatorId: "1612469567934062592",
    images: ["/images/open-graph/og-alt.jpg"],
  },
  category: "cryptocurrency",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="h-full primary-background" lang="en">
      <GlobalContainer>
        <body className="h-full">
          <Header />
          {children}
          <Footer />
        </body>
      </GlobalContainer>
    </html>
  );
}
