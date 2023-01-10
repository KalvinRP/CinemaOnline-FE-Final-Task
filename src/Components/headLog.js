import React from "react";
import { Col, Container, Dropdown, Image, Row } from 'react-bootstrap';
import admin from '../asset/Admin Icon.png';
import icon from '../asset/Icon.svg';
import { ReactComponent as Logout } from '../asset/logout.svg';
import { ReactComponent as User } from '../asset/user.svg';
import { ReactComponent as Addfilm } from '../asset/Add Film.svg';
import Myfilm from '../asset/myFilm.svg'
// import { useNavigate } from 'react-router-dom';

export default function HeadLog(props) {
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

                    {/* Pic Dropdown */}
                    <Dropdown>
                        <div className="ButtonContainer">
                            <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ backgroundColor: 'transparent', color: 'transparent', border: 'none', padding: 0 }}>
                                <Image roundedCircle
                                    alt="admin"
                                    src={admin}
                                    height="100%"
                                    width="300%"
                                    style={{ border: "solid #CD2E71" }}
                                />
                            </Dropdown.Toggle>
                        </div>

                        {/* Check Role */}
                        { false
                        
                        ?

                            // Dropdown Admin
                            <Dropdown.Menu variant="dark">
                                <Dropdown.Item href="/detail-trip">
                                    <Container>
                                        <Row>
                                            <Col className='p-0'>
                                                <Addfilm />
                                            </Col>
                                            <Col className='p-0 fw-bold'>Add Film</Col>
                                        </Row>
                                    </Container>
                                </Dropdown.Item>
                                <hr />
                                <Dropdown.Item>
                                    <Container>
                                        <Row>
                                            <Col className='p-0'><Logout /></Col>
                                            <Col className='p-0 fw-bold'>Logout</Col>
                                        </Row>
                                    </Container>
                                </Dropdown.Item>
                            </Dropdown.Menu>

                            :

                            // Dropdown User
                            <Dropdown.Menu variant="dark">
                                <Dropdown.Item href="/profile">
                                    <Container>
                                        <Row>
                                            <Col className='p-0'><User stroke="#CD2E71" /></Col>
                                            <Col className='p-0 fw-bold'>Profile</Col>
                                        </Row>
                                    </Container>
                                </Dropdown.Item>
                                <br/>
                                <Dropdown.Item href="/payment">
                                    <Container style={{width: "10vw"}}>
                                        <Row>
                                            <Col className='p-0'>
                                            <img
                                                    alt="bill"
                                                    src={Myfilm}
                                                    height="30vw"
                                                />    
                                            </Col>
                                            <Col className='fw-bold'>My Film List</Col>
                                        </Row>
                                    </Container>
                                </Dropdown.Item>
                                <hr />
                                <Dropdown.Item>
                                    <Container>
                                        <Row>
                                            <Col className='p-0'><Logout /></Col>
                                            <Col className='p-0 fw-bold'>Logout</Col>
                                        </Row>
                                    </Container>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        }
                    </Dropdown>
                </div>
            </div>
        </>
    )
}