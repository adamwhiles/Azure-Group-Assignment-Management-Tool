import { useEffect, useState } from "react";
import { ConfigurationProfile } from "../../models/ConfigurationProfile";
import { Assignment } from "../../models/Assignment";
import { ProviderState, Providers } from "@microsoft/mgt-element";
import styles from "./Remediations.module.css";

export default function Remediations(props) {
  const [getRemediations, setRemediations] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchRemediations = async () => {
    if (ProviderState.SignedIn) {
      setIsLoading(true);
      // Iterate over Remediations
      let [deviceHealthScripts] = await Promise.all([
        Providers.client
          .api("/deviceManagement/deviceHealthScripts")
          .expand("assignments")
          .version("beta")
          .get(),
      ]);
      const remediations = [
        ...deviceHealthScripts.value.map((scripts) => ({
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
      // Update the state with the remediations
      setRemediations(remediations);
      setIsLoading(false);
      console.log(remediations);
    }
  };
  useEffect(() => {
    fetchRemediations();
  }, [ProviderState]);
  return (
    <div className={styles.card}>
    {isLoading && <div className={styles.loader}></div>}
      <div className={styles.container}>
      <h2>Proactive Remediations</h2>
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
            {!isLoading && getRemediations ? (
              getRemediations
                .filter((remediation) => {
                  // Filter the remediations to only show remediations with an active assignment for the designated group
                  return remediation.assignments.some(
                    (assignment) => assignment.groupId === props.groupId
                  );
                })
                .map((remediation) => {
                  // Find the assignment with the matching groupId
                  let matchingAssignment = remediation.assignments.find(
                    (assignment) => assignment.groupId === props.groupId
                  );
                  // Get the intent of the matching assignment, or an empty string if not found
                  let intent = matchingAssignment
                    ? matchingAssignment.intent
                    : "";
                  return (
                    <tr key={remediation.id}>
                      <td>{remediation.displayName}</td>
                      <td>{intent}</td>
                      <td>{remediation.modifiedDate}</td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td>No remediations</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
