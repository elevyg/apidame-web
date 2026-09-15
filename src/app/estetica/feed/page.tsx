import type { Metadata } from "next";
import FeedPost from "@/components/estetica/feed/FeedPost";

export const metadata: Metadata = {
  title: "Feed",
  robots: { index: false, follow: false },
};

export default function FeedMaquetaPage() {
  return (
    <div className="h-dvh">
      <FeedPost />
    </div>
  );
}
