import React, { memo, useState } from "react";
import { Accordion, Card, useAccordionButton } from "react-bootstrap";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { API } from "../config/api";

function Listfilms() {
    let { data: recommendation } = useQuery('manyfilmCache', async () => {
        const response = await API.get('/films');
        return response.data.data;
    });

    return (
        <>
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
        style={{ backgroundColor: '#CD2E71', width: '85%', height: '5vh', marginTop: '2%', marginBottom: '2%'}}
        onClick={decoratedOnClick}
      >
        {cond ? "See Less" : "See More"}
      </button>
    );
  }

export default memo(Listfilms)