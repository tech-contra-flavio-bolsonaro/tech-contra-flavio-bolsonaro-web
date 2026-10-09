import Image from "next/image";
import Link from "next/link";
import type { BlogArticle } from "@/app/lib/blog/types";
import { blogDate, blogPermalink } from "@/app/lib/blog/urls";
export function BlogTags({ tags }: { tags: string[] }) {
  return tags.length ? (
    <ul className="blog-tags" aria-label="Tags do artigo">
      {tags.map((tag, index) => (
        <li key={`${tag}-${index}`}>#{tag}</li>
      ))}
    </ul>
  ) : null;
}
export function BlogCard({
  article,
  featured = false,
  featuredLabel,
}: {
  article: BlogArticle;
  featured?: boolean;
  featuredLabel?: string;
}) {
  return (
    <article
      className={`blog-card${featured ? " blog-card-featured" : ""}${article.coverImage ? "" : " blog-card-no-cover"}`}
    >
      {article.coverImage ? (
        <Image
          className="blog-card-cover"
          src={article.coverImage}
          alt=""
          width={640}
          height={420}
          unoptimized
        />
      ) : null}
      <div className="blog-card-copy">
        {featuredLabel ? <p className="blog-label blog-section-label blog-featured-label">{featuredLabel}</p> : null}
        <BlogTags tags={article.tags} />
        <h2>
          <Link href={blogPermalink(article)}>{article.title}</Link>
        </h2>
        <p className="blog-card-description">{article.description}</p>
        <p className="blog-card-author">{article.author.name}</p>
        <div className="blog-card-bottom">
          <p>
            <span>{article.readingMinutes} min de leitura</span>
            <time dateTime={article.publishedAt}>
              {blogDate(article.publishedAt)}
            </time>
          </p>
          <Link className="blog-read" href={blogPermalink(article)}>
            Ler artigo ↗
          </Link>
        </div>
      </div>
    </article>
  );
}
