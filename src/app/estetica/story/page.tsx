import type { Metadata, Viewport } from "next";
import StoryDeck from "@/components/estetica/story/StoryDeck";

export const metadata: Metadata = {
  title: "Story",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#12110f",
  viewportFit: "cover",
};

export default function StoryMaquetaPage() {
  return <StoryDeck />;
}
