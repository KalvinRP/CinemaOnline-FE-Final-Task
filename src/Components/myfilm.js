import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import Startfilm from "../asset/startfilm.png";
import { API } from "../config/api";

export default function Myfilm() {
    let { filmid } = useParams()
    let { data: films } = useQuery('transCache', async () => {
        const response = await API.get('/own-films');
        return response.data.data;
    });

    // eslint-disable-next-line
    let idx = films?.findIndex(x => x.films.id == filmid)

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '20%', marginLeft: '5%' }}>
                    <h1 style={{ width: '100%', marginBottom: '10%', color:'white' }}>My Film List</h1>
                    <div style={{ width: '100%', height: '65vh', overflowY: 'scroll' }}>
                        {films?.map((film) => (
                            <Link key={film.id} to={`/my-films/${film.films?.id}`} style={{textDecoration: 'none'}}>
                            <div className='boughtFilm2' style={{ backgroundImage: `url(${film.films?.image})`, overflow: 'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis' }}>
                                <p className='text-white fs-2' style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{film.films.title}</p>
                            </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div style={{ height: '80vh', width: '80vw' }}>
                    {films?.length === 0 ?
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                    <img alt="empty" height='40%' src="https://img.icons8.com/cotton/256/null/empty-box.png"/>
                    <br/>
                    <h1>You don't have any films</h1>
                    </div>

                    :

                    filmid === "all" ?
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                    <img alt="enjoy" height='40%' src={Startfilm}/>
                    <br/>
                    <h1>Click your films to start watching!</h1>
                    </div>
                    
                    :

                    films?.slice(idx, idx + 1).map((current) =>
                    (<div key={current.id} style={{ width: '90%', height: '100%', marginLeft: '5%' }}>
                        <h1 className="text-white">{current?.films.title}</h1>
                        <br />
                        <iframe title="film" src={`https://drive.google.com/file/d/${current?.films.full_url}/preview`} width="100%" height="80%" allow="autoplay"></iframe>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    )
}