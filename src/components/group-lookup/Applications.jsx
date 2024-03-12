import { useEffect, useState } from "react";
import { ProviderState, Providers } from "@microsoft/mgt-element";
import { Application } from "../../models/Application";
import { Assignment } from "../../models/Assignment";
import styles from "./Applications.module.css";
import React, { memo } from 'react';

const Applications = memo (({ groupId }) => {
  const [getApps, setApps] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const fetchApps = async () => {
    if (ProviderState.SignedIn) {
      console.log("fetching apps");
      setIsLoading(true);
      // Get all Apps from Intune
      const apps = await Providers.client
        .api("/deviceAppManagement/mobileApps")
        .version("beta")
        .select("id, displayName, lastModifiedDateTime")
        .get();

      // Iterate over apps
      let applicationsList = await Promise.all(
        apps.value.map(async (app) => {
          let assignments = []; // Array to hold the applications assignments
          let date = new Date(app.lastModifiedDateTime);
          let formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
          // Get assignments for current app
          const appAssignments = await Providers.client
            .api(`/deviceAppManagement/mobileApps/%7B${app.id}%7D/assignments`)
            .version("beta")
            .get();

          // Iterate over assignments, if a group assignment store it in object
          await appAssignments.value.map((a) => {
            if (
              a.target["@odata.type"] ===
              "#microsoft.graph.groupAssignmentTarget"
            ) {
              let assignment = new Assignment(a.intent, a.target.groupId);
              assignments.push(assignment);
            }
          });
          // Create a new application object with the app details
          let newApp = new Application(
            app.id,
            app.displayName,
            formattedDate,
            assignments
          );
          // Return and add to applicationsList array
          return newApp;
        })
      );
      // Update the state with the loaded applicationsList
      setApps(applicationsList);
      console.log("done loading apps");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [ProviderState]);

  return (
    <div className={styles.card}>
    {isLoading && <div className={styles.loader}></div>}
    <div className={styles.container}>
      <h2>Applications</h2>
      <div className={styles.tablecontainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Intent</th>
              <th>Modified Date</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && getApps ? (
              getApps
                .filter((app) => {
                  // Filter the apps to only show apps with an active assignment for the designated group
                  return app.assignments.some(
                    (assignment) => assignment.groupId === groupId
                  );
                })
                .map((app) => {
                  // Find the assignment with the matching groupId
                  let matchingAssignment = app.assignments.find(
                    (assignment) => assignment.groupId === groupId
                  );
                  // Get the intent of the matching assignment, or an empty string if not found
                  let intent = matchingAssignment
                    ? matchingAssignment.intent
                    : "";
                  return (
                    <tr key={app.id}>
                      <td>{app.displayName}</td>
                      <td>{intent}</td>
                      <td>{app.modifiedDate}</td>
                    </tr>
                  );
                })
                ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
});

export default Applications;
