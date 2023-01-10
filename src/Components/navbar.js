import icon from '../asset/Icon.svg';
import { Container, Dropdown, Row, Col, Button, Form, Modal, Image } from 'react-bootstrap';
import React, { useState, useEffect } from "react";
import bill from '../asset/bill.svg';
import user from '../asset/user.svg';
import logout from '../asset/logout.svg';
import pp from '../asset/lilpp.svg';
import admin from '../asset/Admin Icon.png'
import journey from '../asset/journey.svg';
// import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

function NavbarUnlog(props) {
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
        fullname:"",
        email:"",
        password:"",
        phone:"",
        address:"",
      }
    );

    let RegTyped = (e) => {
      setReg({
        ...reg,
        [e.target.name]: e.target.value,
      })
    };

    let RegSubmitted = (event) => {
      event.preventDefault()
      setShowReg(false)
      setShowLog(true)
      if (localStorage.getItem(reg.email) != null)
          {alert('Email sudah digunakan!')}
      else
          {localStorage.setItem(reg.email, JSON.stringify(reg))}
    };

    let [login, setLogin] = useState(
      {
        email:"",
        password:"",
      }
    );

    let LogTyped = (e) => {
      setLogin({
        ...login,
        [e.target.name]: e.target.value,
      })
    };
    
    // const redirect = useNavigate()

    let LogSubmitted = (e) => {
      e.preventDefault()
      setShowLog(false)
      
      let account = JSON.parse(localStorage.getItem(login.email))
      let savedAcc = {email:(account.email), password:(account.password)}
      
      _.isEqual(login, savedAcc) ? LoggingIn() : alert("Email atau sandi salah!")

      if (login.email.match("@dewetour.com")) {AdminCheck()}
    };

    let AdminCheck = () => {
      localStorage.setItem("adminstate", "true")
      // redirect("/transactions")
      window.location.reload(true)
    }

    let LoggingIn = () => {
      props.handleLog(true)
      localStorage.setItem("loginstate", true)
      localStorage.setItem("activeAcc", login.email)
      // window.location.reload(true)
    }

    return(
        <>  
        <Button style={{border:'none', backgroundColor:'transparent'}} href='/'>
            <img
                alt="icon"
                src={icon}
                width='20%'
                style={{position:'absolute', top:'2vw', left:'10vw'}}
                />
        </Button>          

        <Button variant='outline-light' size='lg' className='position-absolute px-5' style={{top:'4vw', left:'70vw',}} onClick={handleShowLog}>Login</Button>
        <Button variant='warning' size='lg' className='position-absolute px-5' style={{top:'4vw', left:'80vw',}} onClick={handleShowReg}>Register</Button>

        <Modal show={showLog} onHide={handleCloseLog}>
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
                onChange={LogTyped}
                className='border border-secondary'
              />
            <div className='w-100 me-0 mt-2 pe-0 d-flex'>
            <p style={{width:'45%'}}>Don't have an account? Click</p>
            <button onClick={handleSwitchReg} style={{border:'none', backgroundColor:'transparent', padding:'0px'}}>
              <p className='fw-bold text-primary'><u>here.</u></p>
            </button>
            </div>
            </Form.Group>
          </Form>
          <Button variant="warning" onClick={LogSubmitted}>
            Login
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={showReg} onHide={handleCloseReg}>
        <Modal.Body>
          <Modal.Title className='fw-bold mx-auto text-center fs-1 pb-2 mb-5'>Register</Modal.Title>
          <Form className='w-75 m-auto'>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold fs-4">Full Name</Form.Label>
              <Form.Control
                name="fullname"
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
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold fs-4">Phone</Form.Label>
              <Form.Control
                name="phone"
                type="text"
                onChange={RegTyped}
                className='border border-secondary'
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold fs-4">Address</Form.Label>
              <Form.Control as="textarea" name='address' onChange={RegTyped} rows={3} className='border border-secondary' />
            </Form.Group>
          <Button variant="warning" className='text-light text-center fw-bold p-2 w-100 my-3' onClick={RegSubmitted}>
            Register
          </Button>
          </Form>
        </Modal.Body>
      </Modal>
        </>
    )
}

function NavbarLog(props) {
  // let redirect = useNavigate();
  let LoggingOut = () => {
    props.handleLog(false)
    localStorage.setItem("loginstate", false)
    localStorage.removeItem("activeAcc")
    if (localStorage.getItem("adminstate") != null) {localStorage.removeItem("adminstate")}
    // redirect("/")
  };

  return(
      <>            
              <Button style={{border:'none', backgroundColor:'transparent'}} href={!localStorage.getItem("adminstate") ? '/' : '/transactions'}>
                    <img
                        alt="icon"
                        src={icon}
                        width='20%'
                        style={{position:'absolute', top:'2vw', left:'10vw'}}
                        />
              </Button>

                      {localStorage.getItem("adminstate") ? 
                      
                      //menu admin
                      <Dropdown className='position-absolute' style={{top:'2vw', right:'10vw'}}>
                      <Dropdown.Toggle variant="success" id="dropdown-basic" style={{backgroundColor:'transparent', color:'transparent', border:'none'}}>
                          <Image roundedCircle
                              alt="admin"
                              src={admin}
                              width="75vw"
                          />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                      <Dropdown.Item href="/detail-trip">
                          <Container>
                              <Row>
                                  <Col className='p-0'>
                                        <img
                                          alt="trip"
                                          src={journey}
                                          height="30vw"
                                          />
                                  </Col>
                                  <Col className='p-0 fw-bold'>Trip</Col>
                              </Row>
                          </Container>
                      </Dropdown.Item>
                      <hr />
                      <Dropdown.Item onClick={LoggingOut}>
                      <Container>
                              <Row>
                                  <Col className='p-0'>
                                        <img
                                          href="#logout"
                                          alt="logout"
                                          src={logout}
                                          height="30vw"
                                          />
                                  </Col>
                                  <Col className='p-0 fw-bold'>Logout</Col>
                              </Row>
                          </Container>
                      </Dropdown.Item>
                      </Dropdown.Menu>
                </Dropdown>

                      
                      :
                      
                      //menu user
                      <Dropdown className='position-absolute' style={{top:'2vw', right:'10vw'}}>
                      <Dropdown.Toggle variant="success" id="dropdown-basic" style={{backgroundColor:'transparent', color:'transparent', border:'none'}}>
                          <img
                              alt="pp"
                              src={pp}
                              width="75vw"
                          />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                      <Dropdown.Item href="/profile">
                          <Container>
                              <Row>
                                  <Col className='p-0'>
                                        <img
                                          alt="user"
                                          src={user}
                                          height="30vw"
                                          />
                                  </Col>
                                  <Col className='p-0 fw-bold'>Profile</Col>
                              </Row>
                          </Container>
                      </Dropdown.Item>
                      <Dropdown.Item href="/payment">
                          <Container>
                              <Row>
                                  <Col className='p-0'>
                                        <img
                                          alt="bill"
                                          src={bill}
                                          height="30vw"
                                          />
                                  </Col>
                                  <Col className='p-0 fw-bold'>Pay</Col>
                              </Row>
                          </Container>
                      </Dropdown.Item>
                      <hr />
                      <Dropdown.Item onClick={LoggingOut}>
                      <Container>
                              <Row>
                                  <Col className='p-0'>
                                        <img
                                          alt="logout"
                                          src={logout}
                                          height="30vw"
                                          />
                                  </Col>
                                  <Col className='p-0 fw-bold'>Logout</Col>
                              </Row>
                          </Container>
                      </Dropdown.Item>
                  </Dropdown.Menu>            
                </Dropdown>
                      }
      </>
  )
}

// function AdminDrop(props) {
//   return(
//     <>
//           <Dropdown.Menu>
//           <Dropdown.Item href="#/action-2">
//               <Container>
//                   <Row>
//                       <Col className='p-0'>
//                             <img
//                               href="#bill"
//                               alt="bill"
//                               src={bill}
//                               height="30vw"
//                               />
//                       </Col>
//                       <Col className='p-0 fw-bold'>Pay</Col>
//                   </Row>
//               </Container>
//           </Dropdown.Item>
//           <hr />
//           <Dropdown.Item onClick={() => {props.LoggingOut()}}>
//           <Container>
//                   <Row>
//                       <Col className='p-0'>
//                             <img
//                               href="#logout"
//                               alt="logout"
//                               src={logout}
//                               height="30vw"
//                               />
//                       </Col>
//                       <Col className='p-0 fw-bold'>Logout</Col>
//                   </Row>
//               </Container>
//           </Dropdown.Item>
//           </Dropdown.Menu>
//   </>
//   )
// }

// function UserDrop(props) {
//   return(
//     <>
//           <Dropdown.Menu>
//           <Dropdown.Item href="#/action-1">
//               <Container>
//                   <Row>
//                       <Col className='p-0'>
//                             <img
//                               alt="user"
//                               src={user}
//                               height="30vw"
//                               />
//                       </Col>
//                       <Col className='p-0 fw-bold'>Profile</Col>
//                   </Row>
//               </Container>
//           </Dropdown.Item>
//           <Dropdown.Item href="#/action-2">
//               <Container>
//                   <Row>
//                       <Col className='p-0'>
//                             <img
//                               href="#bill"
//                               alt="bill"
//                               src={bill}
//                               height="30vw"
//                               />
//                       </Col>
//                       <Col className='p-0 fw-bold'>Pay</Col>
//                   </Row>
//               </Container>
//           </Dropdown.Item>
//           <hr />
//           <Dropdown.Item onClick={() => {props.LoggingOut()}}>
//           <Container>
//                   <Row>
//                       <Col className='p-0'>
//                             <img
//                               href="#logout"
//                               alt="logout"
//                               src={logout}
//                               height="30vw"
//                               />
//                       </Col>
//                       <Col className='p-0 fw-bold'>Logout</Col>
//                   </Row>
//               </Container>
//           </Dropdown.Item>
//       </Dropdown.Menu>
//     </>
//   )
// }

function Navbarcr() {
  const [isLogin, handleLog] = useState(false)
  
  useEffect(() => {
  const getState = JSON.parse(localStorage.getItem("loginstate"))
  if ( getState !== null) handleLog(getState)
  }, []);

return (
<>
  {!isLogin ? <NavbarUnlog handleLog={handleLog}/> : <NavbarLog handleLog={handleLog}/>}
</>
)
};

export default Navbarcr;