import { RouteObject } from "react-router-dom";
import { Layout } from "./layout";
import Home from "./pages/Home";
import { BlogList } from "./components/generated/BlogList";
import { BlogDetail } from "./components/generated/BlogDetail";
import { CollectionsPage } from "./components/generated/CollectionsPage";

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "blog",
        element: <BlogList />,
      },
      {
        path: "blog/collections/:collectionId",
        element: <CollectionsPage />,
      },
      {
        path: "blog/collections",
        element: <CollectionsPage />,
      },
      {
        path: "blog/:category/:slug",
        element: <BlogDetail />,
      },
      {
        path: "blog/:slug",
        element: <BlogDetail />,
      },
      {
        path: "*",
        element: <Home />,
      },
    ],
  },
];
