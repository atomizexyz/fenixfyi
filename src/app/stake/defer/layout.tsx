const pageTitle = "Defer Stake";

export const metadata = {
  title: pageTitle,
  openGraph: {
    title: pageTitle,
    images: [
      {
        url: "/images/open-graph/open-graph-defer-stake.jpg",
        width: 2560,
        height: 1280,
        alt: "FENIX",
      },
    ],
  },
  twitter: {
    title: pageTitle,
    images: ["/images/open-graph/open-graph-defer-stake.jpg"],
  },
};

export default function DeferStakeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
