const pageTitle = "Reward Pool";

export const metadata = {
  title: pageTitle,
  openGraph: {
    title: pageTitle,
    images: [
      {
        url: "/images/open-graph/open-graph-reward-pool.jpg",
        width: 2560,
        height: 1280,
        alt: "FENIX",
      },
    ],
  },
  twitter: {
    title: pageTitle,
    images: ["/images/open-graph/open-graph-reward-pool.jpg"],
  },
};

export default function RewardPoolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
