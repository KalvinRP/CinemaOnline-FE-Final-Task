import { useQuery } from "react-query";
import { API } from "../config/api";
import { useParams } from "react-router-dom";

export default function Myfilm() {
    let { filmid } = useParams()
    let { data: films } = useQuery('transCache', async () => {
        const response = await API.get('/own-films');
        return response.data.data;
    });

    return (
        <div className='mh-100'>
            <h1 className='subtitle'>My Film List</h1>
            <div className='listrecom mt-2'>

                {/* List Film */}
                {films?.map((film) => (
                <div key={film.id} className='recom'>
                    <img
                        alt={film?.films?.title}
                        src={film?.films?.image}
                    />
                </div>
                ))}
            </div>
            {/* <iframe src=`${films?.films?.full_url}/preview` width="640" height="480" allow="autoplay"></iframe> */}
        </div>
    )
}