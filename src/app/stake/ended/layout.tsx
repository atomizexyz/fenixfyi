const pageTitle = "Ended Stakes";

export const metadata = {
  title: pageTitle,
  openGraph: {
    title: pageTitle,
    images: [
      {
        url: "/images/open-graph/open-graph-ended-stakes.jpg",
        width: 2560,
        height: 1280,
        alt: "FENIX",
      },
    ],
  },
  twitter: {
    title: pageTitle,
    images: ["/images/open-graph/open-graph-ended-stakes.jpg"],
  },
};

export default function EndedStakesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
