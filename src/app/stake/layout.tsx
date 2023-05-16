const pageTitle = "Start Stake";

export const metadata = {
  title: pageTitle,
  openGraph: {
    title: pageTitle,
    images: [
      {
        url: "/images/open-graph/open-graph-start-stake.jpg",
        width: 2560,
        height: 1280,
        alt: "FENIX",
      },
    ],
  },
  twitter: {
    title: pageTitle,
    images: ["/images/open-graph/open-graph-start-stake.jpg"],
  },
};

export default function StartStakeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
