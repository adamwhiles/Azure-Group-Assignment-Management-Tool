import { useEffect, useState } from "react";
import { Providers } from "@microsoft/mgt-element";
import GroupInfo from "../components/group-lookup/GroupInfo";
import Modal from "../components/modal/Modal";
import styles from "./grouplookup.module.css";
import { unstable_useViewTransitionState } from "react-router-dom";

export default function GroupLookup() {
  const [gGroupName, sGroupName] = useState();
  const [getGroupInfo, setGroupInfo] = useState();
  const [showModal, setShowModal] = useState(false); // New state variable for controlling the modal visibility

  const lookupGroup = async () => {
    if (!gGroupName) { // Check if the input field is empty
      setShowModal(true); // Show the modal
      return; // Return to prevent the rest of the code from executing
    }
    const client = Providers.globalProvider.graph.client;
    const response = await client.api(`/groups?$filter=(displayName eq '${gGroupName}')&$select=id,displayName,groupTypes,membershipRule,members`).get();
    console.log(response);
    setGroupInfo(response);
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
      {showModal ? <Modal onClose={() => setShowModal(false)}>Empty Group</Modal> : null}
    </div>
  );
}