import { useContext } from "react"
import { UserContext } from "../context/userContext"
import { Navigate, Outlet } from "react-router-dom"

export const PrivateRouteUser = () => {
    const [myContext] = useContext(UserContext)
    return (
        <>
        {!localStorage.getItem("token") ? (
                <Navigate to="/" />
            ) : myContext?.isLogin && myContext.user?.role === "user" ? (
                <Outlet />
            ) : (
                myContext?.isLogin && myContext.user.role === "admin" && <Navigate to="/" />
            )}
        </>
    )
}

