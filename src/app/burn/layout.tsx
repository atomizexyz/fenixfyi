const pageTitle = "Burn XEN";

export const metadata = {
  title: pageTitle,
  openGraph: {
    title: pageTitle,
    images: [
      {
        url: "/images/open-graph/open-graph-burn-xen.jpg",
        width: 2560,
        height: 1280,
        alt: "FENIX",
      },
    ],
  },
  twitter: {
    title: pageTitle,
    images: ["/images/open-graph/open-graph-burn-xen.jpg"],
  },
};

export default function BurnXENLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
