import { useEffect, useState } from "react";
import { ConfigurationProfile } from "../../models/ConfigurationProfile";
import { Assignment } from "../../models/Assignment";
import { ProviderState, Providers} from "@microsoft/mgt-element";
import { PageIterator } from "@microsoft/microsoft-graph-client/lib/src/tasks/PageIterator";
import styles from "./ConfigurationProfiles.module.css";

export default function ConfigurationProfiles(props) {
  const [getConfigs, setConfigs] = useState();
  const [getAssignedConfigs, setAssignedConfigs] = useState();

  const fetchConfigurations = async () => {
    if (ProviderState.SignedIn) {
      // Iterate over configurations
      let [deviceConfigs, gpConfigs] = await Promise.all([
        Providers.client
          .api("/deviceManagement/deviceConfigurations")
          .expand("assignments")
          .version("beta")
          .get(),
        Providers.client
          .api("/deviceManagement/groupPolicyConfigurations")
          .expand("assignments")
          .version("beta")
          .get(),
      ]);

      let configPolicies = [];

const messages = await Providers.client
  .api("/deviceManagement/configurationPolicies")
  .expand("assignments")
  .version("beta")
  .get();

if (!messages) {
  console.log("No configuration policies found.");
} else {
  const pageIterator = await new PageIterator(
    Providers.client,
    messages,
    (policy) => {
      // Handle each configuration policy (e.g., add it to the configPolicies array)
      configPolicies.push(policy);
      // Add any other processing logic as needed
      return true; // Continue iterating
    },
    (request) => {
      // Configure subsequent page requests (if necessary)
      // For example, add headers or query parameters
      return request;
    }
  );

  await pageIterator.iterate();
}

      const configs = [
        ...deviceConfigs.value.map((config) => ({
          id: config.id,
          displayName: config.displayName,
          modifiedDate: new Date(config.lastModifiedDateTime).toLocaleString(
            "en-US",
            { year: "numeric", month: "2-digit", day: "2-digit" }
          ),
          assignments: config.assignments?.map((item) => ({
            groupId: item.id.substring(item.id.indexOf("_") + 1),
            intent:
              item.target["@odata.type"] ===
              "#microsoft.graph.exclusionGroupAssignmentTarget"
                ? "excluded"
                : "required",
          })),
        })),
        ...gpConfigs.value.map((config) => ({
          id: config.id,
          displayName: config.displayName,
          modifiedDate: new Date(config.lastModifiedDateTime).toLocaleString(
            "en-US",
            { year: "numeric", month: "2-digit", day: "2-digit" }
          ),
          assignments: config.assignments?.map((item) => ({
            groupId: item.id.substring(item.id.indexOf("_") + 1),
            intent:
              item.target["@odata.type"] ===
              "#microsoft.graph.exclusionGroupAssignmentTarget"
                ? "excluded"
                : "required",
          })),
        })),
        ...configPolicies.map((config) => ({
          id: config.id,
          displayName: config.name,
          modifiedDate: new Date(config.lastModifiedDateTime).toLocaleString(
            "en-US",
            { year: "numeric", month: "2-digit", day: "2-digit" }
          ),
          assignments: config.assignments?.map((item) => ({
            groupId: item.id.substring(item.id.indexOf("_") + 1),
            intent:
              item.target["@odata.type"] ===
              "#microsoft.graph.exclusionGroupAssignmentTarget"
                ? "excluded"
                : "required",
          })),
        })),
      ];
      // Update the state with the configurations
      setConfigs(configs);
    }
  };
  useEffect(() => {
    fetchConfigurations();
  }, [ProviderState]);

  return (
    <div>
      <h2>Configuration Profiles</h2>
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
            {getConfigs ? (
              getConfigs
                .filter((config) => {
                  // Filter the configurations to only show configurations with an active assignment for the designated group
                  return config.assignments.some(
                    (assignment) => assignment.groupId === props.groupId
                  );
                })
                .map((config) => {
                  // Find the assignment with the matching groupId
                  let matchingAssignment = config.assignments.find(
                    (assignment) => assignment.groupId === props.groupId
                  );
                  // Get the intent of the matching assignment, or an empty string if not found
                  let intent = matchingAssignment
                    ? matchingAssignment.intent
                    : "";
                  return (
                    <tr key={config.id}>
                      <td>{config.displayName}</td>
                      <td>{intent}</td>
                      <td>{config.modifiedDate}</td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td>No configs</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
