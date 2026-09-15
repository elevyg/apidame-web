import { getPostCover, posts } from "@/components/estetica/feed/posts";
import NotasHomeCarousel from "@/components/estetica/NotasHomeCarousel";

export default function NotasHomeSection() {
  if (posts.length === 0) return null;

  const notes = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    cover: getPostCover(post),
  }));

  return <NotasHomeCarousel notes={notes} />;
}
