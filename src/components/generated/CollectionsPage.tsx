import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaFolder } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { getCollectionById, getAllCollections, type Collection } from "@/lib/collections";
import { getPostBySlug } from "@/lib/content";

export function CollectionsPage() {
  const { language } = useLanguage();
  const { collectionId } = useParams();

  const collection = useMemo<Collection | null>(() => {
    if (collectionId) {
      return getCollectionById(collectionId);
    }
    return null;
  }, [collectionId]);

  const allCollections = useMemo(() => {
    return getAllCollections();
  }, []);

  // 如果没有指定 collectionId，显示所有集合列表
  if (!collectionId) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary mb-8"
          >
            <FaArrowLeft className="h-4 w-4" />
            <span>{language === "zh" ? "返回博客列表" : "Back to Blog List"}</span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-8">
            {language === "zh" ? "文章集合" : "Collections"}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allCollections.map((col) => (
              <Link
                key={col.id}
                to={`/blog/collections/${col.id}`}
                className="p-6 bg-card border border-border rounded-lg hover:border-foreground/20 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FaFolder className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {language === "zh" ? col.name.zh : col.name.en}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-3">
                      {language === "zh" ? col.description.zh : col.description.en}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {col.items.length} {language === "zh" ? "篇文章" : "posts"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 显示特定集合的文章列表
  if (!collection) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog/collections"
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary mb-8"
          >
            <FaArrowLeft className="h-4 w-4" />
            <span>{language === "zh" ? "返回集合列表" : "Back to Collections"}</span>
          </Link>

          <div className="p-6 bg-card border border-border rounded-lg">
            <h2 className="text-xl font-bold text-foreground mb-2">
              {language === "zh" ? "集合不存在" : "Collection Not Found"}
            </h2>
            <p className="text-muted-foreground">
              {language === "zh" ? "该集合不存在或已被删除。" : "The collection you are looking for does not exist."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog/collections"
          className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary mb-8"
        >
          <FaArrowLeft className="h-4 w-4" />
          <span>{language === "zh" ? "返回集合列表" : "Back to Collections"}</span>
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FaFolder className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              {language === "zh" ? collection.name.zh : collection.name.en}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {language === "zh" ? collection.description.zh : collection.description.en}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {language === "zh" ? `共 ${collection.items.length} 篇文章` : `${collection.items.length} posts in total`}
          </p>
        </div>

        {collection.items.length > 0 ? (
          <div className="space-y-4">
            {collection.items.map((item) => {
              const post = getPostBySlug(item.slug, item.category as any);
              return (
                <Link
                  key={`${item.category}-${item.slug}`}
                  to={post ? `/blog/${item.category}/${item.slug}` : "#"}
                  className="block p-6 bg-card border border-border rounded-lg hover:border-foreground/20 hover:shadow-lg transition-all duration-200 group"
                >
                  <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {post?.title || item.title}
                  </h2>
                  <p className="text-muted-foreground mb-3 line-clamp-2">{post?.excerpt || ""}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <FaCalendarAlt className="h-3 w-3" />
                      {item.date}
                    </span>
                    <span className="text-xs px-2 py-1 bg-muted rounded">
                      {item.category}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-6 bg-card border border-border rounded-lg text-center">
            <p className="text-muted-foreground">
              {language === "zh" ? "该集合下暂无文章" : "No posts in this collection"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
