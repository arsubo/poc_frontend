import { Navigate, createBrowserRouter } from "react-router-dom";
import { AssistantPage, OrthographyPage } from "../pages/";
import { DashboardLayout } from "../layouts/DashboardLayout";

export const menuRoutes = [
  {
    to: "/assistant",
    icon: "fa-solid fa-magnifying-glass",
    title: "Normativas",
    description: "Asistente normativo",
    component: <AssistantPage />,
  },
  {
    to: "/orthography",
    icon: "fa-solid fa-person-chalkboard",
    title: "Finanzas",
    description: "Experto financiero",
    component: <OrthographyPage />,
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />, //,
    children: [
      ...menuRoutes.map((route) => ({
        path: route.to,
        element: route.component,
      })),
      {
        path: "",
        element: <Navigate to={menuRoutes[0].to} />,
      },
    ],
  },
]);
