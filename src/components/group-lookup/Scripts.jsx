import { useEffect, useState } from "react";
import { ProviderState, Providers } from "@microsoft/mgt-element";
import styles from "./Scripts.module.css";

export default function Scripts(props) {
  const [getScripts, setScripts] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchScripts = async () => {
    if (ProviderState.SignedIn) {
      setIsLoading(true);
      // Iterate over Scripts
      let [deviceShellScripts, deviceManagementScripts] = await Promise.all([
        Providers.client
          .api("/deviceManagement/deviceShellScripts")
          .expand("assignments")
          .version("beta")
          .get(),
        Providers.client
          .api("/deviceManagement/deviceManagementScripts")
          .expand("assignments")
          .version("beta")
          .get(),
      ]);
      const Scripts = [
        ...deviceShellScripts.value.map((scripts) => ({
          id: scripts.id,
          displayName: scripts.displayName,
          modifiedDate: new Date(scripts.lastModifiedDateTime).toLocaleString(
            "en-US",
            { year: "numeric", month: "2-digit", day: "2-digit" }
          ),
          assignments: scripts.assignments?.map((item) => ({
            groupId: item.id.substring(item.id.indexOf(":") + 1),
            intent:
              item.target["@odata.type"] ===
              "#microsoft.graph.exclusionGroupAssignmentTarget"
                ? "excluded"
                : "required",
          })),
        })),
        ...deviceManagementScripts.value.map((scripts) => ({
          id: scripts.id,
          displayName: scripts.displayName,
          modifiedDate: new Date(scripts.lastModifiedDateTime).toLocaleString(
            "en-US",
            { year: "numeric", month: "2-digit", day: "2-digit" }
          ),
          assignments: scripts.assignments?.map((item) => ({
            groupId: item.id.substring(item.id.indexOf(":") + 1),
            intent:
              item.target["@odata.type"] ===
              "#microsoft.graph.exclusionGroupAssignmentTarget"
                ? "excluded"
                : "required",
          })),
        })),
      ];
      // Update the state with the Scripts
      setScripts(Scripts);
      setIsLoading(false);
      console.log(Scripts);
    }
  };
  useEffect(() => {
    fetchScripts();
  }, [ProviderState]);

  return (
    <div className={styles.card}>
    {isLoading && <div className={styles.loader}></div>}
      <div className={styles.container}>
      <h2>Scripts</h2>
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
            {!isLoading && getScripts ? (
              getScripts
                .filter((script) => {
                  // Filter the Scripts to only show Scripts with an active assignment for the designated group
                  return script.assignments.some(
                    (assignment) => assignment.groupId === props.groupId
                  );
                })
                .map((script) => {
                  // Find the assignment with the matching groupId
                  let matchingAssignment = script.assignments.find(
                    (assignment) => assignment.groupId === props.groupId
                  );
                  // Get the intent of the matching assignment, or an empty string if not found
                  let intent = matchingAssignment
                    ? matchingAssignment.intent
                    : "";
                  return (
                    <tr key={script.id}>
                      <td>{script.displayName}</td>
                      <td>{intent}</td>
                      <td>{script.modifiedDate}</td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td>No Scripts</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
