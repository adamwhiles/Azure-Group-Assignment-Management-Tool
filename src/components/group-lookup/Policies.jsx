import { useEffect, useState } from "react";
import { ProviderState, Providers } from "@microsoft/mgt-element";
import styles from "./Scripts.module.css";

export default function Policies(props) {
  const [getPolicies, setPolicies] = useState();

  const fetchPolicies = async () => {
    if (ProviderState.SignedIn) {
      // Iterate over Policies
      let [deviceCompliancePolicies, compliancePolicies] = await Promise.all([
        Providers.client
          .api("/deviceManagement/deviceCompliancePolicies")
          .expand("assignments")
          .version("beta")
          .get(),
        Providers.client
          .api("/deviceManagement/compliancePolicies")
          .expand("assignments")
          .version("beta")
          .get(),
      ]);
      const policies = [
        ...deviceCompliancePolicies.value.map((policies) => ({
          id: policies.id,
          displayName: policies.displayName,
          modifiedDate: new Date(policies.lastModifiedDateTime).toLocaleString(
            "en-US",
            { year: "numeric", month: "2-digit", day: "2-digit" }
          ),
          assignments: policies.assignments?.map((item) => ({
            groupId: item.id.substring(item.id.indexOf("_") + 1),
            intent:
              item.target["@odata.type"] ===
              "#microsoft.graph.exclusionGroupAssignmentTarget"
                ? "excluded"
                : "required",
          })),
        })),
        ...compliancePolicies.value.map((policies) => ({
          id: policies.id,
          displayName: policies.displayName,
          modifiedDate: new Date(policies.lastModifiedDateTime).toLocaleString(
            "en-US",
            { year: "numeric", month: "2-digit", day: "2-digit" }
          ),
          assignments: policies.assignments?.map((item) => ({
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
      setPolicies(policies);
      console.log(policies);
    }
  };
  useEffect(() => {
    fetchPolicies();
  }, [ProviderState]);

  return (
    <div>
      <h2>Policies</h2>
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
            {getPolicies ? (
              getPolicies
                .filter((policy) => {
                  // Filter the Policies to only show Policies with an active assignment for the designated group
                  return policy.assignments.some(
                    (assignment) => assignment.groupId === props.groupId
                  );
                })
                .map((policy) => {
                  // Find the assignment with the matching groupId
                  let matchingAssignment = policy.assignments.find(
                    (assignment) => assignment.groupId === props.groupId
                  );
                  // Get the intent of the matching assignment, or an empty string if not found
                  let intent = matchingAssignment
                    ? matchingAssignment.intent
                    : "";
                  return (
                    <tr key={policy.id}>
                      <td>{policy.displayName}</td>
                      <td>{intent}</td>
                      <td>{policy.modifiedDate}</td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td>No Policies</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
