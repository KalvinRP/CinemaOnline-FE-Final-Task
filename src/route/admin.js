import { useContext } from "react"
import { UserContext } from "../context/userContext"
import { Navigate, Outlet } from "react-router-dom"

export const PrivateRouteAdmin = () => {
    const [myContext] = useContext(UserContext)
    return (
        <>
        {!localStorage.getItem("token") ? (
                <Navigate to="/" />
            ) : myContext?.isLogin && myContext.user?.role === "admin" ? (
                <Outlet />
            ) : (
                myContext?.isLogin && myContext.user.role === "user" && <Navigate to="/" />
            )}
        </>
    )
}

