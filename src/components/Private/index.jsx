import { ROLE_KEY } from "../../constants";
import React from "react";

export function isAdmin() {
    const currentUserRole = localStorage.getItem(ROLE_KEY)
    const adminRoles = ['authenticated'];
    const isAdmin = adminRoles.includes(currentUserRole);

    return isAdmin;
}

const Private = ({ children }) => {
    return (
        <>
            {isAdmin() && (
                <>
                    {children}
                </>
            )}
        </>
    );
}

export default Private;