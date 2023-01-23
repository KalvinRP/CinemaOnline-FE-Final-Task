import React, { useEffect, useState } from "react";
import { Button, Card, Accordion, useAccordionButton } from "react-bootstrap";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { API } from "../config/api";
import Mustwatch from '../asset/mustwatch.png'
import Topsale from '../asset/topsale.png'
import { ThreeCircles } from "react-loader-spinner";

export default function Mainland() {
    let { data: topfilms, isLoading } = useQuery('topCache', async () => {
        const response = await API.get('/topfilms');
        return response.data.data;
    });
    let length = topfilms?.length - 1
    let [show, setShow] = useState(0)

    const less = () => {
        if (show === 0) { setShow(length) }
        else { setShow(show - 1) }
    }

    const add = () => {
        if (show === length) { setShow(0) }
        else { setShow(show + 1) }
    }

    useEffect(() => {
        let interval = setInterval(() => {
            add()
        }, 10000);
        return () => clearInterval(interval);
        //eslint-disable-next-line
    }, [show])

    let { data: recommendation } = useQuery('manyfilmCache', async () => {
        const response = await API.get('/films');
        return response.data.data;
    });


    return (
        <>

            {/* Banner Utama Halaman */}
            <div className="Landing">
                {isLoading ? <ThreeCircles
                    height="100"
                    width="100"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="three-circles-rotating"
                    outerCircleColor="#cd2e71"
                    innerCircleColor="white"
                    middleCircleColor="#cd2e71"
                />
                    :
                    <Card className="bg-dark text-white w-75">
                        {topfilms?.slice(show, show + 1).map((n) => (
                            <Link to={`/film/${n.id}`} key={n.id} style={{ textDecoration: "none", color: "white" }}>
                                <Card.Img src={n.image} alt="Thumbnail" height={"500vh"} style={{ border: "none", objectFit: "cover", filter: "brightness(50%)" }} />
                                <Card.ImgOverlay className="MainBanner">
                                    <Card.Title className="MainTitle" style={{ fontSize: "2.5em" }}>{n.title}</Card.Title>
                                    <Card.Text className="MainGenre">{n.genre.name}</Card.Text>
                                    <Card.Text className="MainPrice">Rp. {n.price.toLocaleString()}</Card.Text>
                                    <Card.Text className="lh-lg">
                                        {n.desc}
                                    </Card.Text>
                                    <Button className="Button-pink fw-bold position-absolute" style={{ bottom: "20%" }} size='md'>Buy Now</Button>
                                </Card.ImgOverlay>
                                {n.status === "ad" ? <img alt="ribbon" style={{ width: "20%", height: "40%", position: "absolute", top: -6, right: -8 }} src={Mustwatch} /> : <img alt="ribbon" style={{ width: "20%", height: "40%", position: "absolute", top: -6, right: -8 }} src={Topsale} />}
                            </Link>
                        ))}
                        <button className="prev" onClick={less}>
                            <FiChevronLeft />
                        </button>
                        <button className="next" onClick={add}>
                            <FiChevronRight />
                        </button>
                    </Card>}
            </div>

            {/* Rekomendasi Film */}
            <h3 className="subtitle">List Film</h3>

            <div className="listrecom">
                <div className="recom">
                    {recommendation?.slice(0, 6).map((film) => (
                        <Link to={`/film/${film.id}`} key={film.id} className='text-decoration-none text-dark'>
                            <div key={film.id}>
                                <div>
                                    <img
                                        alt={film.image}
                                        src={film.image}
                                        height="250vh"
                                        width="180vw"
                                        className="d-inline-block"
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Accordion defaultActiveKey="1">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CustomToggle eventKey="0" />
                </div>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <div className="listrecom">
                            <div className="recom" style={{ justifyContent: "space-around" }}>
                                {recommendation?.map((film) => (
                                    <Link to={`/film/${film.id}`} key={film.id} className='text-decoration-none text-dark'>
                                        <div key={film.id}>
                                            <div>
                                                <img
                                                    alt={film.image}
                                                    src={film.image}
                                                    height="250vh"
                                                    width="180vw"
                                                    className="d-inline-block p-2"
                                                />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </Card.Body>
                </Accordion.Collapse>
            </Accordion>
        </>
    )
}

function CustomToggle({ children, eventKey }) {
    const [cond, setCond] = useState(false)
    const decoratedOnClick = useAccordionButton(eventKey, () =>
        setCond(!cond),
    );

    return (
        <button
            type="button"
            className="text-white fs-4"
            style={{ backgroundColor: '#CD2E71', width: '85%', height: '5vh', marginTop: '2%', marginBottom: '2%' }}
            onClick={decoratedOnClick}
        >
            {cond ? "See Less" : "See More"}
        </button>
    );
}