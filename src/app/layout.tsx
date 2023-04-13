import "@/app/globals.css";
import { GlobalContainer } from "@/components/containers";
import { Header, Footer } from "@/components/ui";

export const metadata = {
  metadataBase: new URL(`https://${process.env.VERCEL_URL}`),
  title: {
    template: "%s | FENIX",
    default: "FENIX",
  },
  description: "Empower your crypto, earn while you hold!",
  openGraph: {
    title: "%s | FENIX",
    description: "Empower your crypto, earn while you hold!",
    url: "https://fenix-fyi",
    siteName: "fenix.fyi",
    images: [
      {
        url: "/image/open-graph/og.png",
        width: 800,
        height: 600,
      },
      {
        url: "/image/open-graph/og-alt.png",
        width: 1800,
        height: 1600,
        alt: "Open Graph Image Alt",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  icons: {
    icon: [{ url: "/image/icons/icon.png" }, new URL("/image/icons/icon.png", "https://fenix.fyi")],
    shortcut: ["/image/icons/shortcut-icon.png"],
    apple: [
      { url: "/image/icons/apple-icon.png" },
      { url: "/image/icons/apple-icon-x3.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/image/icons/apple-touch-icon-precomposed.png",
      },
    ],
  },
  manifest: "/manifest.json",
  twitter: {
    card: "summary_large_image",
    title: "%s | FENIX",
    description: "Empower your crypto, earn while you hold!",
    siteId: "1612469567934062592",
    creator: "@fenix_protocol",
    creatorId: "1612469567934062592",
    images: ["/image/open-graph/og.png"],
  },
  category: "cryptocurrency",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <GlobalContainer>
      <html className="h-full primary-background" lang="en">
        <body className="h-full">
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </GlobalContainer>
  );
}
