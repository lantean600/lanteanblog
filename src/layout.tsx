import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* TODO: If Header component is created, import and add <Header /> here */}
      <main className="flex-1">
        <Outlet />
      </main>
      {/* TODO: If Footer component is created, import and add <Footer /> here */}
    </div>
  );
}
