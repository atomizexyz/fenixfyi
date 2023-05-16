const pageTitle = "End Stake";

export const metadata = {
  title: pageTitle,
  openGraph: {
    title: pageTitle,
    images: [
      {
        url: "/images/open-graph/open-graph-end-stake.jpg",
        width: 2560,
        height: 1280,
        alt: "FENIX",
      },
    ],
  },
  twitter: {
    title: pageTitle,
    images: ["/images/open-graph/open-graph-end-stake.jpg"],
  },
};

export default function EndStakeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
