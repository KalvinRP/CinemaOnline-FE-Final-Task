import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { API } from "../config/api";
import { GiArchiveRegister } from "react-icons/gi"
import { CgSmileSad } from "react-icons/cg"
import { BsPatchExclamation } from "react-icons/bs"

export default function Verif() {
    let { code } = useParams()
    let verif = {
        token: code,
    }
    let [expire, setExpire] = useState(false)
    let [done, setDone] = useState(false)

    let MailCheck = async () => {
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            };
            await API.post('/verify', verif, config);
        } catch (error) {
            console.log(error.response.data.code)
            if (error.response.data.code === 401) {
                setExpire(true)
            }
            if (error.response.data.code === 409) {
                setDone(true)
            }
        }
    };
    console.log(expire)

    useEffect(() => {
        MailCheck()
        //eslint-disable-next-line
    }, [])

    return (
        <>
            {expire ?
                <div>
                    <h1 className="text-center" style={{ color: '#CD2E71' }}>Token Expired</h1>
                    <div className="d-flex justify-content-center my-3">
                        <CgSmileSad size={'10em'} color={'white'} />
                    </div>
                    <h3 className="text-center text-white">Your 15 minutes are up. Please register again.</h3>
                </div>
                :
            done ?
            <div>
            <h1 className="text-center" style={{ color: '#CD2E71' }}>You're registered.</h1>
            <div className="d-flex justify-content-center my-3">
                <BsPatchExclamation size={'10em'} color={'white'} />
            </div>
            <h3 className="text-center text-white">Click the login button then enjoy!</h3>
        </div>
            :
                <div>
                    <h1 className="text-center" style={{ color: '#CD2E71' }}>Email Verification</h1>
                    <div className="d-flex justify-content-center my-3">
                        <GiArchiveRegister size={'10em'} color={'white'} />
                    </div>
                    <h3 className="text-center text-white">Welcome to CinemaOnline! Your account is verified and you can login now.</h3>
                </div>
            }
        </>
    )
}