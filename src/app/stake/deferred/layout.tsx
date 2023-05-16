const pageTitle = "Deferred Stakes";

export const metadata = {
  title: pageTitle,
  openGraph: {
    title: pageTitle,
    images: [
      {
        url: "/images/open-graph/open-graph-deferred-stakes.jpg",
        width: 2560,
        height: 1280,
        alt: "FENIX",
      },
    ],
  },
  twitter: {
    title: pageTitle,
    images: ["/images/open-graph/open-graph-deferred-stakes.jpg"],
  },
};

export default function DeferredStakesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
