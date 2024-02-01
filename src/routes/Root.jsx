// RootLayout.jsx
import React, { useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/navbar";
import "./Root.module.css";

export default function RootLayout({ store, updateKeys }) {
  const [hasAppId, setHasAppId] = useState(false);
  const [getAppId, setAppId] = useState("");
  const [getTenantId, setTenantId] = useState("");
  const dialogRef = useRef();

  // Get the appId and tenant id from the store
  const fetchAppId = async () => {
    const appId = await store.get("CLIENT_ID");
    const tenantId = await store.get("TENANT_ID");
    if (appId && tenantId) {
      setHasAppId(true);
    } else {
      // Show the modal popup if no app id exists in the store
      dialogRef.current.showModal();
    }
  };

  // Handle the change of the input value
  const handleAppIdChange = (e) => {
    setAppId(e.target.value);
  };

  // Handle the change of the input value
  const handleTenantIdChange = (e) => {
    setTenantId(e.target.value);
  };

  // Handle the submit of the form and app id to the store
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Save the userKey to the store
    await store.set("CLIENT_ID", getAppId);
    await store.set("TENANT_ID", getTenantId);
    await store.save();
    // Close the modal popup
    dialogRef.current.close();
    // Set the hasAppId state to true
    setHasAppId(true);
    updateKeys(getAppId, getTenantId);
  };

  // Call the getAppId function when the component mounts
  React.useEffect(() => {
    fetchAppId();
  }, []);

  return (
    <>
      <Navbar />
      <Outlet />
      {hasAppId ? null : ( // Render the dialog element conditionally based on the hasAppId state
        <dialog ref={dialogRef}>
          <p>
            An Azure App Registration is required, please enter the Application
            (client) ID and Tenant ID:
          </p>
          <form onSubmit={handleSubmit}>
            <input
              id="client_id"
              type="text"
              value={getAppId}
              onChange={handleAppIdChange}
              placeholder="App ID"
              required
            />
            <input
              id="tenant_id"
              type="text"
              value={getTenantId}
              onChange={handleTenantIdChange}
              placeholder="Tenant ID"
              required
            />
            <button type="submit">OK</button>
          </form>
        </dialog>
      )}
    </>
  );
}
