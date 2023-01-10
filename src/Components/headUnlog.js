import React, { useState } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import icon from '../asset/Icon.svg';
import '../style/custom.css';
// import { useNavigate } from 'react-router-dom';
// import { useMutation } from "react-query";

export default function HeadUnlog(props) {
    let [showLog, setShowLog] = useState(false);
    let handleCloseLog = () => setShowLog(false);
    let handleShowLog = () => setShowLog(true);

    let [showReg, setShowReg] = useState(false);
    let handleCloseReg = () => setShowReg(false);
    let handleShowReg = () => setShowReg(true);

    let handleSwitchReg = (event) => {
        event.preventDefault()
        setShowLog(false)
        setShowReg(true)
    }

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
        })
    };

    // let RegSubmitted = useMutation(async (e) => {
    //     try {
    //         e.preventDefault()
    //         setShowReg(false)
    //         setShowLog(true)
    //         // await API.post('/register', reg);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // });

    let [login, setLogin] = useState(
        {
            email: "",
            password: "",
        }
    );

    let LogTyped = (e) => {
        setLogin({
            ...login,
            [e.target.name]: e.target.value,
        })
    };

    // const redirect = useNavigate()

    // let LogSubmitted = useMutation(async (e) => {
    //     try {
    //         e.preventDefault()
    //         setShowLog(false)
    //         // const logging = await API.post('/login', login)

    //         // if (logging?.statusText === "OK") {
    //         //     props.dispatch({
    //         //         type: 'LOGIN_SUCCESS',
    //         //         payload: logging.data.data,
    //         //     })
    //         // };
    //         redirect('/')
    //     } catch (error) {
    //         alert("Password or email dont match!")
    //         console.log(error)
    //     }
    // });

    return (
        <>
            <div className="Background">
                <div className="Container">
                    {/* Logo/Home Button */}
                    <a className="Link" href="#home">
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

            <Modal show={showLog} onHide={handleCloseLog}>
                <div style={{ backgroundColor: "black" }}>
                    <Modal.Body>
                        <Modal.Title className='fw-bold mx-auto text-center fs-1 pb-2 mb-5'>Login</Modal.Title>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold fs-4">Email</Form.Label>
                                <Form.Control
                                    name="email"
                                    type="email"
                                    onChange={LogTyped}
                                    className='border border-secondary'
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold fs-4">Password</Form.Label>
                                <Form.Control
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    onChange={LogTyped}
                                    className='border border-secondary'
                                />
                                <div className='w-100 me-0 mt-2 pe-0 d-flex'>
                                    <p style={{ width: '45%' }}>Don't have an account? Click</p>
                                    <button onClick={handleSwitchReg} style={{ border: 'none', backgroundColor: 'transparent', padding: '0px' }}>
                                        <p className='fw-bold text-primary'><u>here.</u></p>
                                    </button>
                                </div>
                            </Form.Group>
                        </Form>
                        <Button variant="warning" /* onClick={(e) => LogSubmitted.mutate(e)} */>
                            Login
                        </Button>
                    </Modal.Body>
                </div>
            </Modal>

            <Modal show={showReg} onHide={handleCloseReg}>
                <div style={{ backgroundColor: "black" }}>
                    <Modal.Body>
                        <Modal.Title className='fw-bold mx-auto text-center fs-1 pb-2 mb-5'>Register</Modal.Title>
                        <Form className='w-75 m-auto'>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold fs-4">Full Name</Form.Label>
                                <Form.Control
                                    name="name"
                                    type="text"
                                    onChange={RegTyped}
                                    className='border border-secondary'
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold fs-4">Email</Form.Label>
                                <Form.Control
                                    name="email"
                                    type="email"
                                    onChange={RegTyped}
                                    className='border border-secondary'
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold fs-4">Password</Form.Label>
                                <Form.Control
                                    name="password"
                                    type="password"
                                    onChange={RegTyped}
                                    className='border border-secondary'
                                />
                            </Form.Group>
                            <Button variant="warning" className='text-light text-center fw-bold p-2 w-100 my-3' /* onClick={(e) => RegSubmitted.mutate(e)} */>
                                Register
                            </Button>
                        </Form>
                    </Modal.Body>
                </div>
            </Modal>
        </>
    )
}