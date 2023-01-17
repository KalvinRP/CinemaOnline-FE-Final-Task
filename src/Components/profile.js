import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { API } from '../config/api';

export default function Profile() {
    let { data: history } = useQuery('transCache', async () => {
        const response = await API.get('/account');
        return response.data.data;
    });

    let [userData, setData] = useState({})

    useEffect(() => {
        if (history) {
            setData({
                name: history[0].users.Name,
                email: history[0].users.Email,
                ID: history[0].users.ID,
                Image: history[0].users.Image,
            })
            // eslint-disable-next-line
        }}, [history])

    return (
        <div className='d-flex'>

            {/* Biodata */}
            <div className='Profile'>
                <h1 className='mb-3 text-white'>My Profile</h1>
                <div className='d-flex'>
                    <img
                        alt="profile"
                        src={userData.Image}
                        width="50%"
                        height="50%"
                        className='Image'
                    />
                    <div className='Overview'>
                        <br />
                        <h4>ID</h4>
                        <p>{userData.ID}</p>
                        <h4>Full Name</h4>
                        <p>{userData.name}</p>
                        <br />
                        <h4>Email</h4>
                        <p>{userData.email}</p>
                        <br />
                    </div>
                </div>
            </div>

            <div class="vl"></div>

            {/* Transaction History */}
            <div style={{ width: '50%' }}>
                <h1 className='text-white mb-3'>Transaction History</h1>
                <div className='boughtContainer'>
                    {/* To be Mapped */}
                    {history?.map((film) => (
                    <div key={film.id} className='boughtFilm' style={{ backgroundImage: `url(${film.films.image})` }}>
                        <p className='text-white fw-bold mb-1 fs-4'>{film.films.title}</p>
                        <p className='text-white mb-1'>{film.films.genre.name}</p>
                        <p className='text-white fw-bold mb-1'>Total : Rp. {film.films.price.toLocaleString()}</p>
                        <div className='bg-success boughtStatus'>
                            <p className='font-success fw-bold text-center'>{film.status}</p>
                        </div>
                    </div>
                    ))}
                    {/* Finish of Map */}
                </div>
            </div>
        </div>
    )
}