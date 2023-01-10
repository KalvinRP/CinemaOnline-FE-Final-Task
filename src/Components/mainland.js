import React from "react";
import { Button, Card } from "react-bootstrap";
import banner from "../asset/Banner.svg";
import Film1 from "../asset/Film1.svg";
import Film2 from "../asset/Film2.svg";
import Film3 from "../asset/Film3.svg";
import Film4 from "../asset/Film4.svg";
import Film5 from "../asset/Film5.svg";
import Film6 from "../asset/Film6.svg";

export default function Mainland() {
    const recommendation = [
        {
            Pic: Film1,
        },
        {
            Pic: Film2,
        },
        {
            Pic: Film3,
        },
        {
            Pic: Film4,
        },
        {
            Pic: Film5,
        },
        {
            Pic: Film6,
        },
    ]
    return (
        <>

            {/* Banner Utama Halaman */}
            <div className="Landing">
                <Card className="bg-dark text-white w-75">
                    <Card.Img src={banner} alt="Thumbnail" style={{ border: "none" }} />
                    <Card.ImgOverlay className="MainBanner">
                        <Card.Title className="MainTitle">DEAD POOL</Card.Title>
                        <Card.Text className="MainGenre">Action</Card.Text>
                        <Card.Text className="MainPrice">Rp. 99,000</Card.Text>
                        <Card.Text className="lh-lg">
                            Hold onto your chimichangas, folks. From the studio that brought you all 3 Taken films comes the block-busting, fourth-wall-breaking masterpiece about Marvel Comics' sexiest anti-hero! Starring God's perfect idiot Ryan Reynolds and a bunch of other "actors," DEADPOOL is a giddy slice of awesomeness packed with more twists than Deadpool's enemies' intestines and more action than prom night. Amazeballs!
                        </Card.Text>
                        <Button className="Button-pink fw-bold" size='md'>Buy Now</Button>
                    </Card.ImgOverlay>
                </Card>
            </div>

            {/* Rekomendasi Film */}
            <h3 className="subtitle">List Film</h3>

            <div className="listrecom">
                <div className="recom">
                {recommendation.map((film, index) => (
                    <div key={index}>
                        <a href={index}>
                            <img
                                alt={film.Pic}
                                src={film.Pic}
                                className="d-inline-block"
                            />
                        </a>
                    </div>
                ))}
                </div>
            </div>
        </>
    )
}