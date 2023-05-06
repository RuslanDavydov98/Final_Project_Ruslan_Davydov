import { createContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
    const {user} = useAuth0();

    //Extract the unique ID from the user information 
    let currentUserId = null;
    if (user) {
        const uniqueId = user?.sub.split("|");
        currentUserId = uniqueId[1];
    }

    const [currentUserFetch, setCurrentUserFetch] = useState(null);

    useEffect(() => {
        if(user){
            fetch(`users/${currentUserId}`)
            .then(res => res.json())
            .then(resData => setCurrentUserFetch(resData.data))
        }
    }, [user])
    return (
        <UserContext.Provider value={ {user, currentUserId, currentUserFetch} }>
            {children}
        </UserContext.Provider>
    )
};

export default UserProvider