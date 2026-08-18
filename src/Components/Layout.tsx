import { Outlet } from "react-router-dom";
import { useAppContext } from "../Hooks/AppContext";

const Layout = () => {
    const { isLoading, logout, currentUser } = useAppContext();

    const logOut = () => {
        logout();
    };
    
    return (
        <>
            { isLoading && <div className="spinner" title="Loading..."></div> }

            { currentUser &&
                <div className="header">
                    <span>{ currentUser.firstName } { currentUser.lastName }</span>
                    <button onClick={ logOut }>(logout)</button>
                </div>
            }

            <Outlet />
        </>
    );
};

export default Layout;