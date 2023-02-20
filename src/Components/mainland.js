import React, { useEffect, useState, useCallback } from "react";
import { Button, Card } from "react-bootstrap";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { ThreeCircles } from "react-loader-spinner";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import Mustwatch from '../asset/mustwatch.png';
import Topsale from '../asset/topsale.png';
import { API } from "../config/api";

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

    const add = useCallback(() => {
        if (show === length) { setShow(0) }
        else { setShow(show + 1) }
    }, [show])

    useEffect(() => {
        let interval = setInterval(() => {
            add()
        }, 10000);
        return () => clearInterval(interval);
        //eslint-disable-next-line
    }, [show])

    return (
        <>
            {/* Loading Circle */}
            <div className="Landing">
                {isLoading ?
                    <ThreeCircles
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
                        {/* Banner Utama Halaman */}
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
                    </Card>
                }
            </div>
        </>
    )
}