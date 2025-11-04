import axios from "axios";
// import httpStatus from "http-status";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";


export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${server}/api/v1/users`
})


export const AuthProvider = ({ children }) => {

    // const authContext = useContext(AuthContext);


    const [userData, setUserData] = useState(null);


    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            const res = await client.post("/register", {
                name: name,
                username: username,
                password: password
            })


            if (res.status === 201) {
                return res.data.message;
            }
        } catch (err) {
            const message = err?.response?.data?.message || "Request failed.";
  throw new Error(message);
        }
    }

    const handleLogin = async (username, password) => {
        try {
            const res = await client.post("/login", {
                username: username,
                password: password
            });

            console.log(username, password)
            console.log(res.data)

            if (res.status === 200) {
                localStorage.setItem("token", res.data.token);
                router("/home")
                return res.data.message || "Login successful";
            }
        } catch (err) {
            const message = err?.response?.data?.message || "Login failed.";
  throw new Error(message);
        }
    };

    const getHistoryOfUser = async () => {
        try {
            const res = await client.get("/get_all_activity", {
                // params: {
                //     token: localStorage.getItem("token")
                // }
                headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
            });
            return res.data
        } catch
         (err) {
            throw err;
        }
    }

    const addToUserHistory = async (meetingCode) => {
        try {
            const res = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            },
            {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
        );
            return res
        } catch (e) {
            throw e;
        }
    }


    const data = {
        userData, setUserData, addToUserHistory, getHistoryOfUser, handleRegister, handleLogin
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )

}
