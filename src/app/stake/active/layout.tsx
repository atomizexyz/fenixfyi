const pageTitle = "Active Stakes";

export const metadata = {
  title: pageTitle,
  openGraph: {
    title: pageTitle,
    images: [
      {
        url: "/images/open-graph/open-graph-active-stakes.jpg",
        width: 2560,
        height: 1280,
        alt: "FENIX",
      },
    ],
  },
  twitter: {
    title: pageTitle,
    images: ["/images/open-graph/open-graph-active-stakes.jpg"],
  },
};

export default function ActiveStakesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
