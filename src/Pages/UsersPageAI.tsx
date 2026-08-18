import { useEffect, useState, type JSX } from "react";
import type { IUser } from "../Infrastructure/Interfaces";
import { useApiCaller } from "../Hooks/ApiCallerHook";

/*
Note: as per my note on UsersPage.tsx...
UsersPage.tsx was my own attempt without using Copilot but I ran into issues displaying the hierarchy tree properly.
I left UsersPage.tsx there for reference but I have used this page instead where Copilot helped with generating the tree hierarchy and I added onto this file once that was done.
*/

const UsersPage = () => {
  const apiCaller = useApiCaller();

  const [tree, setTree] = useState<IUser[]>([]);
  const [expandedUsers, setExpandedUsers] = useState<Record<number, boolean>>({});


  const showLink = (userId: number, hasReportingUsers: boolean) => {
    const icon = hasReportingUsers ? (expandedUsers[userId] ? '-' : '+') : '';

      return <span className="userLink" onClick={() => toggleUser(userId)}>{ icon }</span>
  };
  
  const showBadge = (user: IUser) => {
    const altText = `${user.firstName} ${user.lastName}`;

    return (
      <span className="userBadge" title={altText}>
        {user.photo ? (
          <img src={user.photo} alt={altText} />
        ) : (
          <span>
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </span>
        )}
      </span>
    );
  };

  const toggleUser = (userId: number) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const buildHierarchy = (users: IUser[]): IUser[] => {
    const userMap = new Map<number, IUser>();
    const roots: IUser[] = [];

    users.forEach(user => {
      user.reportingUsers = [];
      userMap.set(user.id, user);
    });

    users.forEach(user => {
      if (user.managerId && userMap.has(user.managerId)) {
        const manager = userMap.get(user.managerId);

        if (manager) {
          manager.reportingUsers = manager.reportingUsers || [];
          manager.reportingUsers.push(user);
        }
      }
      else {
        roots.push(user);
      }
    });

    return roots;
  };

  const renderUser = (user: IUser): JSX.Element => {
    const isExpanded = !!expandedUsers[user.id];
    const hasReportingUsers = user.reportingUsers && user.reportingUsers.length > 0;

    return (
      <li key={ user.id } className={ isExpanded ? "expanded" : "" }>
        <div className="userRow">
          { showLink(user.id, Boolean(hasReportingUsers)) }
          { showBadge(user) }
          { user.firstName } { user.lastName } { user.email }
        </div>

        { hasReportingUsers && (
          <ul>
            { user.reportingUsers!.map(reportingUser => renderUser(reportingUser)) }
          </ul>
        )}
      </li>
    );
  };


  useEffect(() => {
    apiCaller.UsersGet().then(respUsers => {
      if (respUsers) {
        const rootUsers = buildHierarchy(respUsers);

        setTree(rootUsers);
      }
    });
  }, []);


  return (
    <>
      <h1>Hierarchy Tree</h1>

      {tree.length > 0 && (
        <ul className="userList">
          { tree.map(user => renderUser(user)) }
        </ul>
      )}
    </>
  );
};

export default UsersPage;