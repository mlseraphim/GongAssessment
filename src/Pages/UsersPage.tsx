import { useEffect, useState } from "react";
import type { IUser } from "../Infrastructure/Interfaces";
import { useApiCaller } from "../Hooks/ApiCallerHook";

/*
Note: this was my own attempt without using Copilot but I ran into issues displaying the hierarchy tree properly.
I left it here for reference but I have used UsersPageAI instead where Copilot helped with generating the tree hierarchy and I added onto this file once that was done.
*/

const UsersPage = () => {
    const apiCaller = useApiCaller();

    const [usersByLevel, setUsersByLevel] = useState<Array<IUser[]>>([]);


    const showLink = (managerId: number | undefined) => {
        return <span className="userLink">{ managerId && managerId > 0 ? '+' : '-' } </span>;
    };

    const showBadge = (user: IUser) => {
        const altText = `${ user.firstName } ${ user.lastName }`;

        return (
            <span className="userBadge" title={ altText }>
                {user.photo ? (
                    <img src={ user.photo } alt={ altText } />
                ) : (
                    <span>{ user.firstName.charAt(0) }{ user.lastName.charAt(0) }</span>
                )}
            </span>
        );
    };

    const createHierarchy = (data: IUser[]) => {
        const userLevels: Array<IUser[]> = [];
        let remainingList: IUser[] = [...data];

        const topLevel = remainingList.filter(u => u.managerId == null);
        userLevels.push(topLevel);

        remainingList = remainingList.filter(u => u.managerId != null);

        let level = 0;

        while (remainingList.length > 0) {
            const managerIds = new Set(userLevels[level].map(u => u.id));

            const reportingUsers = remainingList.filter(u => u.managerId != null && managerIds.has(u.managerId));

            if (reportingUsers.length === 0) {
                break;
            }

            userLevels.push(reportingUsers);

            remainingList = remainingList.filter(u => !reportingUsers.some(ru => ru.id === u.id));

            level++;
        }

        setUsersByLevel(userLevels);
    };

    const writeReportingUsers = (managerId: number) => {
        const reportingUsers = usersByLevel.flat().filter(u => u.managerId === managerId);

        return (
            <ul>
                { reportingUsers.map(user => (
                    <li key={ user.id }>
                        { showLink(user.managerId) }
                        { showBadge(user) }
                        { user.firstName} { user.lastName } { user.email }
                    </li>
                )) }
            </ul>
        );
    };

    useEffect(() => {
        apiCaller.UsersGet().then(respUsers => {
            if (respUsers) {
                createHierarchy(respUsers);
            }
        });
    }, []);
    
    return (
        <>
            <h1>Hierarchy Tree</h1>

            { usersByLevel && usersByLevel.length > 0 &&
                <ul className="userList">
                    { usersByLevel[0].map(manager => (
                        <li key={ manager.id }>
                            { showLink(manager.managerId) }
                            { showBadge(manager) }
                            { manager.firstName} { manager.lastName } { manager.email }
                            { writeReportingUsers(manager.id) }
                        </li>
                    ))}
                </ul>
            }
        </>
    );
};

export default UsersPage;