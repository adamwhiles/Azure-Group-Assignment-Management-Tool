import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { Providers } from "@microsoft/mgt-element";
import { Msal2Provider } from "@microsoft/mgt-msal2-provider";
import "./styles.css";
import GroupLookup from "./routes/grouplookup";
import Navbar from "./components/navbar/navbar";
import RootLayout from "./routes/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <GroupLookup />,
      },
      {
        path: "/groupLookup",
        element: <GroupLookup />,
      },
    ],
  },
]);

Providers.globalProvider = new Msal2Provider({
  clientId: import.meta.env.VITE_CLIENT_ID,
  scopes: [
    "device.read.all",
    "group.read.all",
    "devicemanagementapps.read.all",
    "DeviceManagementConfiguration.Read.All",
  ],
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
