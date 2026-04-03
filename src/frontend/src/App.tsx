import { Toaster } from "@/components/ui/sonner";
import {
  Link,
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import { HomePage } from "./pages/HomePage";

export { useNavigate, useParams, Link, Navigate, Outlet };

// Root layout
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

// Public routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const eventDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/$id",
  component: EventDetailPage,
});

// Admin routes
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: AdminLoginPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
});

const adminEventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/events",
  component: AdminDashboard,
});

const adminPeopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/people",
  component: AdminDashboard,
});

const adminTimetableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/timetable",
  component: AdminDashboard,
});

const adminTicketsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/tickets",
  component: AdminDashboard,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  eventDetailRoute,
  adminLoginRoute,
  adminRoute,
  adminEventsRoute,
  adminPeopleRoute,
  adminTimetableRoute,
  adminTicketsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
