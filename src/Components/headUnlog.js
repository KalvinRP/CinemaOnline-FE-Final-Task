import React, { useState, useEffect } from "react";
import { Button, Modal, Form, CloseButton } from 'react-bootstrap';
import icon from '../asset/Icon.svg';
import '../style/custom.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from "react-query";
import { API } from "../config/api";
import Swal from "sweetalert2";

export default function HeadUnlog(props) {
    const redirect = useNavigate()

    /* MODAL CONTROL */
    // Login
    let [showLog, setShowLog] = useState(false);
    let handleCloseLog = () => {
        setShowLog(false);
        if (nilname) { setNilName(false) };
        if (emailErr) { setEmailErr(false) };
        if (pwdError) { setPwdError(false) };
    }
    let handleShowLog = () => setShowLog(true);

    // Register
    let [showReg, setShowReg] = useState(false);
    let handleCloseReg = () => {
        setShowReg(false);
        if (nilname) { setNilName(false) }
        if (emailErr) { setEmailErr(false) }
        if (pwdError) { setPwdError(false) }
    }
    let handleShowReg = () => setShowReg(true);

    // Don't have account
    let handleSwitchReg = (event) => {
        event.preventDefault()
        setShowLog(false)
        setShowReg(true)
    }

    // Have account
    let handleSwitchLog = (event) => {
        event.preventDefault()
        setShowReg(false)
        setShowLog(true)
    }

    // Reset password
    const [reset, setReset] = useState(false)
    const [notsame, setNotsame] = useState(false)
    let handleCloseReset = () => {
        setReset(false)
        redirect('/')
    }

    let [sure, setSure] = useState(
        {
            password: "",
            password2: ""
        }
    );

    let [resetform, setResetform] = useState(
        {
            token: "",
            password: ""
        }
    );

    let ReseTyped = (e) => {
        setSure({
            ...sure,
            [e.target.name]: e.target.value,
        });
        if (notsame) { setNotsame(false) }
        if (pwdError) { setPwdError(false) }
        console.log(sure)
    };

    let ForgetSubmitted = useMutation(async (e) => {
        try {
            e.preventDefault()
            let response = await API.post('/forget', login)
            if (response.data.code === 200) {
                setForget(false)
                setLogin({
                    email: "",
                })
                await Swal.fire(
                    "We send an email for you.",
                    "Please confirm and create your new password.",
                    "info"
                )
                redirect('/')
            };
        } catch (error) {
            await Swal.fire({
                title: error.response.data.message,
                icon: 'error',
                timer: 2000
            })
        }
    });

    let samevalue = () => {
        setResetform({
            ...resetform,
            password: sure.password,
        })
        return sure.password === sure.password2
    }

    let ReseSubmitted = useMutation(async (e) => {
        try {
            e.preventDefault()
            if (samevalue()) {
                if (validPassword.test(sure.password)) {
                    let response = await API.patch('/reset', resetform)
                    if (response.data.code === 200) {
                        setReset(false)
                        setSure({})
                        setResetform({})
                        await Swal.fire(
                            'Password changed!',
                            'Keep your password safe for yourself.',
                            'success'
                        )
                        redirect('/')
                    }
                }
            else {
                setPwdError(true)
            }}
            else { setNotsame(true) }
        }
        catch (error) {
            console.log(error)
            await Swal.fire({
                title: "Something went wrong!",
                icon: 'warning',
                timer: 2000
            })
        }
    })

    const { resetcode } = useParams()
    useEffect(() => {
        if (resetcode !== undefined) {
            setReset(true)
        }
    }, [resetcode])

    /* FORM VALIDATION */
    const validEmail = /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/
    const validPassword = /^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$/

    const [nilname, setNilName] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [pwdError, setPwdError] = useState(false);
    const validate = (e) => {
        if (e.name === "") {
            setNilName(true);
            return false
        }
        if (!validEmail.test(e.email)) {
            setEmailErr(true);
            return false
        }
        if (!validPassword.test(e.password)) {
            setPwdError(true);
            return false
        }
        return true
    };

    /* FORM HANDLE */
    // Handle Register
    let [reg, setReg] = useState(
        {
            name: "",
            email: "",
            password: "",
        }
    );

    let RegTyped = (e) => {
        setReg({
            ...reg,
            [e.target.name]: e.target.value,
        });
        if (nilname) { setNilName(false) }
        if (emailErr) { setEmailErr(false) }
        if (pwdError) { setPwdError(false) }
    };

    let RegSubmitted = useMutation(async (e) => {
        try {
            e.preventDefault()
            if (validate(reg)) {
                let response = await API.post('/register', reg);
                if (response.data.code === 200) {
                    setShowReg(false)
                    setShowLog(true)
                    setReg({})
                    await Swal.fire(
                        'Verification email sent!',
                        'Please check your incoming messages',
                        'success'
                    )
                }
            }
        } catch (error) {
            await Swal.fire({
                title: error.response.data.message,
                icon: 'error',
                timer: 2000
            })
            setReg({})
        }
    });


    // Handle Login
    let [forget, setForget] = useState(false)

    let [login, setLogin] = useState(
        {
            email: "",
        }
    );

    let LogTyped = (e) => {
        setLogin({
            ...login,
            [e.target.name]: e.target.value,
        })
        if (emailErr) { setEmailErr(false) }
        if (pwdError) { setPwdError(false) }
    };

    let LogSubmitted = useMutation(async (e) => {
        try {
            e.preventDefault()
            if (validate(login)) {
                let response = await API.post('/login', login)
                if (response.data.code === 200) {
                    setShowLog(false)
                    setReg({})
                    props.dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: response.data.data,
                    })
                    await Swal.fire({
                        title: response.data.data.role === "user" ? 'Enjoy your film, ' + response.data.data.name + '!' : 'Good day, ' + response.data.data.name + '!',
                        icon: 'success',
                        timer: 2000
                    })
                    redirect('/')
                }
            };
        } catch (error) {
            await Swal.fire({
                title: error.response.data.message,
                icon: 'error',
                timer: 2000
            })
        }
    });

    return (
        <>
            <div className="Background">
                <div className="Container">
                    {/* Logo/Home Button */}
                    <a className="Link" href="/">
                        <img
                            alt="home"
                            src={icon}
                            height="100%"
                            width="200%"
                            className="d-inline-block"
                        />
                    </a>

                    {/* Login/Register Button */}
                    <div className="ButtonContainer">
                        <Button variant='outline-light' onClick={handleShowLog} size='lg'>Login</Button>
                        <Button className="Button-pink" onClick={handleShowReg} size='lg'>Register</Button>
                    </div>
                </div>
            </div>

            {/* Modal Login */}
            <Modal show={showLog} onHide={handleCloseLog}>
                <div style={{ backgroundColor: "#212121" }}>
                    {forget ?
                        <Modal.Body>
                            <div className="d-flex justify-content-between">
                                <Modal.Title className='ModalText'>Reset Password</Modal.Title>
                                <button onClick={() => setForget(false)} style={{ border: 'none', backgroundColor: 'transparent', padding: '0px' }}>
                                    <p className='fw-bold text-white'>Back to Login</p>
                                </button>
                            </div>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        name="email"
                                        type="email"
                                        value={login.email}
                                        placeholder="Type Your email here."
                                        onChange={LogTyped}
                                        className='border border-secondary bg-secondary text-white'
                                    />
                                    {emailErr && <p className="text-danger">Your email is invalid</p>}
                                </Form.Group>
                            </Form>
                            <Button className="w-100 mt-1 Button-pink" onClick={(e) => ForgetSubmitted.mutate(e)}>
                                Change Password
                            </Button>
                            <div className='w-100 me-0 mt-2 pe-0 d-flex'>
                                <p style={{ width: '45%', color: "whitesmoke" }}>Don't have an account? Click</p>
                                <button onClick={handleSwitchReg} style={{ border: 'none', backgroundColor: 'transparent', padding: '0px' }}>
                                    <p className='fw-bold text-white'><u>here.</u></p>
                                </button>
                            </div>
                        </Modal.Body>
                        :
                        <Modal.Body>
                            <Modal.Title className='ModalText'>Login</Modal.Title>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        name="email"
                                        type="email"
                                        value={login.email}
                                        placeholder="Email"
                                        onChange={LogTyped}
                                        className='border border-secondary bg-secondary text-white'
                                    />
                                    {emailErr && <p className="text-danger">Your email is invalid</p>}
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        name="password"
                                        type="password"
                                        value={login.password}
                                        placeholder="Password"
                                        autoComplete="current-password"
                                        onChange={LogTyped}
                                        className='border border-secondary bg-secondary'
                                    />
                                    {pwdError && <p className="text-danger">Your password is invalid</p>}
                                </Form.Group>
                            </Form>
                            <Button className="w-100 mt-1 Button-pink" onClick={(e) => LogSubmitted.mutate(e)}>
                                Login
                            </Button>
                            <div className="w-100 d-flex justify-content-end">
                                <button onClick={() => setForget(true)} style={{ border: 'none', backgroundColor: 'transparent', padding: '0px' }}>
                                    <p className='fw-bold text-white'><u>Forget Password?</u></p>
                                </button>
                            </div>
                            <div className='w-100 me-0 pe-0 d-flex'>
                                <p style={{ width: '45%', color: "whitesmoke" }}>Don't have an account? Click</p>
                                <button onClick={handleSwitchReg} style={{ border: 'none', backgroundColor: 'transparent', padding: '0px' }}>
                                    <p className='fw-bold text-white'><u>here.</u></p>
                                </button>
                            </div>
                        </Modal.Body>
                    }
                </div>
            </Modal>

            {/* Modal Register */}
            <Modal show={showReg} onHide={handleCloseReg}>
                <div style={{ backgroundColor: "#212121" }}>
                    <Modal.Body>
                        <Modal.Title className='ModalText'>Register</Modal.Title>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    name="name"
                                    type="text"
                                    onChange={RegTyped}
                                    placeholder="Full Name"
                                    className='border border-secondary bg-secondary text-white'
                                />
                                {nilname && <p className="text-danger">Name should not be empty</p>}
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    name="email"
                                    type="email"
                                    onChange={RegTyped}
                                    placeholder="Email"
                                    className='border border-secondary bg-secondary text-white'
                                />
                                {emailErr && <p className="text-danger">Your email is invalid</p>}
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    name="password"
                                    type="password"
                                    onChange={RegTyped}
                                    placeholder="Password"
                                    className='border border-secondary bg-secondary text-white'
                                />
                                {pwdError && <p className="text-danger">Password require number, letter, and 8 characters minimum</p>}
                            </Form.Group>
                            <Button className='w-100 mt-1 Button-pink' onClick={(e) => RegSubmitted.mutate(e)}>
                                Register
                            </Button>
                            <div className='w-100 me-0 mt-2 pe-0 d-flex'>
                                <p style={{ width: '45%', color: "whitesmoke" }}>Don't have an account? Click</p>
                                <button onClick={handleSwitchLog} style={{ border: 'none', backgroundColor: 'transparent', padding: '0px' }}>
                                    <p className='fw-bold text-white'><u>here.</u></p>
                                </button>
                            </div>
                        </Form>
                    </Modal.Body>
                </div>
            </Modal>

            {/* Modal Reset */}
            <Modal
                show={reset}
                onHide={handleCloseReset}
                backdrop="static"
                keyboard={false}
            >
                <div style={{ backgroundColor: "#212121" }}>
                    <Modal.Header>
                        <div className="w-100 d-flex justify-content-between">
                            <Modal.Title style={{ fontWeight: "bold", fontSize: "2em", color: "#CD2E71" }}>Reset Password</Modal.Title>
                            <CloseButton variant="white" onClick={handleCloseReset} />
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    name="password"
                                    type="password"
                                    placeholder="Input your new password."
                                    onChange={ReseTyped}
                                    className='border border-secondary bg-secondary text-white'
                                />
                                {pwdError && <p className="text-danger">Your password is invalid</p>}
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    name="password2"
                                    type="password"
                                    placeholder="Confirm your password."
                                    onChange={ReseTyped}
                                    className='border border-secondary bg-secondary text-white'
                                />
                                {notsame && <p className="text-danger">The email you input is different.</p>}
                            </Form.Group>
                        </Form>
                        <Button className="w-100 mt-1 Button-pink" onClick={(e) => ReseSubmitted.mutate(e)}>
                            Create New Password
                        </Button>
                        <div className='w-100 me-0 mt-2 pe-0 d-flex'>
                            <p style={{ width: '45%', color: "whitesmoke" }}>Don't have an account? Click</p>
                            <button onClick={handleSwitchReg} style={{ border: 'none', backgroundColor: 'transparent', padding: '0px' }}>
                                <p className='fw-bold text-white'><u>here.</u></p>
                            </button>
                        </div>
                    </Modal.Body>
                </div>
            </Modal>
        </>
    )
}