import { useEffect, useState } from "react";
import { Col, Container, Dropdown, Image, Row } from 'react-bootstrap';
import { useQuery } from "react-query";
import { ReactComponent as Addfilm } from '../asset/Add Film.svg';
import icon from '../asset/Icon.svg';
import trans from '../asset/transaction.png'
import { ReactComponent as Logout } from '../asset/logout.svg';
import Myfilm from '../asset/myFilm.svg';
import { ReactComponent as User } from '../asset/user.svg';
import { API } from "../config/api";
import { useNavigate } from "react-router-dom";

export default function HeadLog(props) {
    let navigate = useNavigate()
    let LoggingOut = () => {
        navigate('/')
        props.dispatch({
          type: 'LOGOUT',
        });
      };
    
      const [form, setForm] = useState({
        image: '',
        name: '',
    });
    
      let { data: profile, refetch } = useQuery('proCache', async () => {
        const response = await API.get('/useracc');
        return response.data.data;
    });
    
    // let currentid = tripsid
    
    useEffect(() => {
        if (profile) {
            setForm({
                ...form,
                image: profile.image,
                name: profile.name,
            });
        }
        refetch()
        // eslint-disable-next-line
    }, [profile]);
    
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

                    {/* Pic Dropdown */}
                    <Dropdown>
                        <div className="ButtonContainer">
                            <Dropdown.Toggle id="dropdown-basic" style={{ backgroundColor: 'transparent', color: 'transparent', border: 'none', padding: 0 }}>
                                <Image roundedCircle
                                    alt="admin"
                                    src={form.image}
                                    height="80vh"
                                    width="80vw"
                                    style={{ border: "solid #CD2E71" }}
                                />
                            </Dropdown.Toggle>
                        </div>

                        {/* Check Role */}
                        { props.state.user.role === "admin"
                        
                        ?

                            // Dropdown Admin
                            <Dropdown.Menu variant="dark">
                                <Dropdown.Item href="/modify-film/add">
                                    <Container>
                                        <Row>
                                            <Col className='p-0'>
                                                <Addfilm />
                                            </Col>
                                            <Col className='p-0 fw-bold'>Add Film</Col>
                                        </Row>
                                    </Container>
                                </Dropdown.Item>
                                <Dropdown.Item href="/trans-list">
                                    <Container>
                                        <Row>
                                            <Col className='p-0'>
                                                <img alt='trans' src={trans} height='30vw'/>
                                            </Col>
                                            <Col className='p-0 fw-bold'>Transac...</Col>
                                        </Row>
                                    </Container>
                                </Dropdown.Item>
                                <hr />
                                <Dropdown.Item onClick={LoggingOut}>
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
                                <Dropdown.Item href="/my-films/all">
                                    <Container>
                                        <Row>
                                            <Col className='p-0'>
                                            <img
                                                    alt="bill"
                                                    src={Myfilm}
                                                    height="25vw"
                                                />    
                                            </Col>
                                            <Col className='fw-bold'>Films</Col>
                                        </Row>
                                    </Container>
                                </Dropdown.Item>
                                <hr />
                                <Dropdown.Item onClick={LoggingOut}>
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