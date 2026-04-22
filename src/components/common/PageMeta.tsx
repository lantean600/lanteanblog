import { Helmet, HelmetProvider } from 'react-helmet-async';

interface PageMetaProps {
  title: string;
  description?: string;
  keywords?: string[] | string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  twitterCard?: "summary" | "summary_large_image";
}

export const PageMeta: React.FC<PageMetaProps> = (props) => {
  const {
    title,
    description,
    keywords,
    image = "https://lanteanblog.pages.dev/images/avatar-fallback.svg",
    url = "https://lanteanblog.pages.dev",
    type = "website",
    siteName = "Lantean's Blog",
    twitterCard = "summary_large_image",
  } = props;
  const keywordsContent = Array.isArray(keywords)
    ? keywords.join(', ')
    : keywords;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      {!!keywords?.length && <meta name='keywords' content={keywordsContent} />}
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:type' content={type} />
      <meta property='og:url' content={url} />
      <meta property='og:site_name' content={siteName} />
      <meta property='og:image' content={image} />
      <meta property='og:image:alt' content={`${siteName} avatar`} />
      <meta name='twitter:card' content={twitterCard} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />
    </Helmet>
  );
};

export const HelmetProviderWrapper: React.FC<React.PropsWithChildren> = (
  props,
) => {
  return <HelmetProvider>{props.children}</HelmetProvider>;
};
