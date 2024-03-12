import Applications from "./Applications";
import ConfigurationProfiles from "./ConfigurationProfiles";
import styles from "./GroupInfo.module.css";
import Remediations from "./Remediations";
import Scripts from "./Scripts";
import Policies from "./Policies";
import React, { memo } from 'react';

const areEqual = (prevProps, nextProps) => {
  // Do a deep comparison of groupInfo
  console.log("in areEqual")
  console.log(JSON.stringify(prevProps.groupInfo) === JSON.stringify(nextProps.groupInfo))
  return JSON.stringify(prevProps.groupInfo) === JSON.stringify(nextProps.groupInfo);
}

const GroupInfo = memo(({ groupInfo }) => {
  const group = groupInfo.value[0];
  console.log("in group info");
  console.log(group.displayName);
  return (
    <div>
      <div className={styles.wrapper}>
        <ul className={styles.groupinfo}>
          <li>
            <label htmlFor="group-name">Group Name</label>
            <input
              type="text"
              id="group-name"
              defaultValue={group ? group.displayName : null}
            ></input>
          </li>
          <li>
            <label htmlFor="group-id">Group ID</label>
            <input
              type="text"
              id="group-id"
              defaultValue={group ? group.id : null}
            ></input>
          </li>
          <li>
            <label htmlFor="group-type">Group Type</label>
            <input
              type="text"
              id="group-type"
              defaultValue={
                group.groupTypes.length > 0 ? group.groupTypes[0] : "Assigned"
              }
            ></input>
          </li>
          <li>
            <label htmlFor="group-rule">Rule</label>
            <input
              type="text"
              id="group-rule"
              defaultValue={
                group.membershipRule
                  ? group.membershipRule
                  : "Not a Dynamic Group"
              }
            ></input>
          </li>
        </ul>
      </div>
      <div className={styles.assignmentswrapper}>
        {group.id ? (<><Applications groupId={group.id} />
        <ConfigurationProfiles groupId={group.id} />
        <Remediations groupId={group.id} />
        <Scripts groupId={group.id} />
        <Policies groupId={group.id} /> </>): null}
      </div>
    </div>
  );
}, areEqual);

export default GroupInfo;