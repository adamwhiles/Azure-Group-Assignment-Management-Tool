import { useEffect, useState } from "react";
import { Get } from "@microsoft/mgt-react";
import GroupInfo from "../components/group-lookup/GroupInfo";
import styles from "./grouplookup.module.css";
import { unstable_useViewTransitionState } from "react-router-dom";

export default function GroupLookup() {
  const [gGroupName, sGroupName] = useState();
  const [getGroupName, setGroupName] = useState();
  const [getGroupInfo, setGroupInfo] = useState();

  const lookupGroup = () => {
    setGroupName(gGroupName);
  };

  return (
    <div className="container">
      <h2>Group Lookup</h2>
      <div className={styles.lookup}>
        <input onInput={(e) => sGroupName(e.target.value)} />
        <button onClick={lookupGroup}>Lookup</button>
      </div>
      {getGroupName ? console.log("in get") : null}
      {getGroupName ? (
        <Get
          resource={`/groups?$filter=(displayName eq '${getGroupName}')&$select=id,displayName,groupTypes,membershipRule,members`}
        >
          <GroupInfo template="value" />
        </Get>
      ) : null}
    </div>
  );
}
