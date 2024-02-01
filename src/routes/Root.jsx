// RootLayout.jsx
import React, { useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/navbar";
import { Providers } from "@microsoft/mgt-element";
import { Msal2Provider } from "@microsoft/mgt-msal2-provider";
import "./Root.module.css";

export default function RootLayout({ store, updateKey }) {
  const [hasAppId, setHasAppId] = useState(false);
  const [userKey, setUserKey] = useState("");
  const dialogRef = useRef();

  // Get the appId from the store
  const getAppId = async () => {
    const appId = await store.get("CLIENT_ID");
    if (appId) {
      setHasAppId(true);
    } else {
      // Show the modal popup if no app id exists in the store
      dialogRef.current.showModal();
    }
  };

  // Handle the change of the input value
  const handleChange = (e) => {
    setUserKey(e.target.value);
  };

  // Handle the submit of the form and app id to the store
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Save the userKey to the store
    await store.set("CLIENT_ID", userKey);
    await store.save();
    // Close the modal popup
    dialogRef.current.close();
    // Set the hasAppId state to true
    setHasAppId(true);
    updateKey(userKey);
  };

  // Call the getAppId function when the component mounts
  React.useEffect(() => {
    getAppId();
  }, []);

  return (
    <>
      <Navbar />
      <Outlet />
      {hasAppId ? null : ( // Render the dialog element conditionally based on the hasAppId state
        <dialog ref={dialogRef}>
          <p>
            An Azure App Registration is required, please enter the Application
            (client) ID:
          </p>
          <form onSubmit={handleSubmit}>
            <input
              id="client_id"
              type="text"
              value={userKey}
              onChange={handleChange}
              required
            />
            <button type="submit">OK</button>
          </form>
        </dialog>
      )}
    </>
  );
}
