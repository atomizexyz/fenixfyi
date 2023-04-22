const pageTitle = "Approve Burn";

export const metadata = {
  title: pageTitle,
  openGraph: {
    title: pageTitle,
    images: [
      {
        url: "/images/open-graph/open-graph-approve-burn.jpg",
        width: 2560,
        height: 1280,
        alt: "FENIX",
      },
    ],
  },
  twitter: {
    title: pageTitle,
    images: ["/images/open-graph/open-graph-approve-burn.jpg"],
  },
};

export default function ApproveBurnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
