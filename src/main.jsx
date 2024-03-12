// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Providers } from "@microsoft/mgt-element";
import { Msal2Provider } from "@microsoft/mgt-msal2-provider";
import "./styles.css";
import GroupLookup from "./routes/grouplookup";
import RootLayout from "./routes/Root";
import { Store } from "tauri-plugin-store-api";

// set up tauri store for azure app id
const store = new Store(".appSettings.json");

// get the app id from the store
const appId = await store.get("CLIENT_ID");
const tenantId = await store.get("TENANT_ID");

// app permission scopes for graph api
const scopes = [
  "device.read.all",
  "group.read.all",
  "devicemanagementapps.read.all",
  "DeviceManagementConfiguration.Read.All",
];

if (appId != "" && tenantId != "") {
  Providers.globalProvider = new Msal2Provider({
    clientId: appId,
    scopes: scopes,
    authority: `https://login.microsoftonline.com/${tenantId}`,
  });
}

const updateKeys = (appId, tenantId) => {
  Providers.globalProvider = new Msal2Provider({
    clientId: appId,
    scopes: scopes,
    authority: `https://login.microsoftonline.com/${tenantId}`,
  });
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout store={store} updateKeys={updateKeys} />, // Pass the store as a prop to the RootLayout component
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

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);
