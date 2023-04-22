const pageTitle = "Get XEN";

export const metadata = {
  title: pageTitle,
  openGraph: {
    title: pageTitle,
    images: [
      {
        url: "/images/open-graph/open-graph-get-xen.jpg",
        width: 2560,
        height: 1280,
        alt: "FENIX",
      },
    ],
  },
  twitter: {
    title: pageTitle,
    images: ["/images/open-graph/open-graph-get-xen.jpg"],
  },
};

export default function GetXENLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
