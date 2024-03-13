import { useEffect, useState } from "react";
import { Providers } from "@microsoft/mgt-element";
import GroupInfo from "../components/group-lookup/GroupInfo";
import Modal from "../components/modal/Modal";
import styles from "./grouplookup.module.css";
import { unstable_useViewTransitionState } from "react-router-dom";

export default function GroupLookup() {
  const [gGroupName, sGroupName] = useState();
  const [getGroupInfo, setGroupInfo] = useState();
  const [showModal, setShowModal] = useState(false);
  const [getError, setError] = useState();

  const lookupGroup = async () => {
    // Trigger error modal if no group name is entered
    if (!gGroupName) {
      setError('Please enter a group name to lookup');
      setShowModal(true); 
      return; 
    }
    // Call Graph API to get group information
    try {
      const client = Providers.globalProvider.graph.client;
      const response = await client.api(`/groups?$filter=(displayName eq '${gGroupName}')&$select=id,displayName,groupTypes,membershipRule,members`).get();
      // Check that a group was found
      if (!response.value || response.value.length === 0) {
        throw new Error('No group found with that name. Please try again.');
      } else {
        // Set group state variable with API response
        setGroupInfo(response);
      }      
    } catch (error) {
      setError(error.message);
      setShowModal(true); 
    }
  };

  return (
    <div className="container">
      <h2>Group Lookup</h2>
      <div className={styles.lookup}>
        <input onInput={(e) => sGroupName(e.target.value)} />
        <button onClick={lookupGroup}>Lookup</button>
      </div>
      {getGroupInfo ? (
        <GroupInfo groupInfo={getGroupInfo} />
      ) : null}
      {showModal ? <Modal onClose={() => setShowModal(false)}>{getError}</Modal> : null}
    </div>
  );
}