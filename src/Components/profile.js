import { useEffect, useRef, useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AiOutlineEdit } from 'react-icons/ai';
import { useMutation, useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API } from '../config/api';

export default function Profile() {
    let { data: history } = useQuery('transCache', async () => {
        const response = await API.get('/account');
        return response.data.data;
    });

    let { data: user, refetch } = useQuery('userCache', async () => {
        const response = await API.get('/useracc');
        return response.data.data;
    });

    let [userData, setData] = useState({
        name: '',
        email: '',
    })

    useEffect(() => {
        if (user) {
            setData({
                name: user.name,
                email: user.email,
                ID: user.id,
                Image: user.image,
            })
            // eslint-disable-next-line
        }
    }, [user])

    // EDIT PROFILE
    let [mode, setMode] = useState(false)
    let [picture, setPicture] = useState("")
    const inputFile = useRef(null);
    let inputEdit = (e) => {
        e.preventDefault()
        setData({
            ...userData,
            [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
        })
        e.target.type === "file" && setPicture(URL.createObjectURL(e.target.files[0]))
    }

    let Submit = useMutation(async (e) => {
        try {
            e.preventDefault()
            const config = {
                headers: {
                    'Content-type': 'multipart/form-data',
                },
            };

            const formData = new FormData();
                formData.set('name', userData.name);
                formData.set('email', userData.email);
                if (typeof userData.image == "object") {formData.set('image', userData.image[0])}

            const response = await API.patch('/user', formData, config)
            if (response.data.code === 200) {
                await Swal.fire({
                    title: 'Successfully updating profile!',
                    icon: 'success',
                    timer: 2000
                })
            }
            setMode(false)
            setPicture("")
            refetch()
        } catch (error) {
            console.log(error)
        }
    });
s
    return (
        <div className='d-flex'>

            {/* Biodata */}
            <div className='Profile'>
                <div className='d-flex'>
                    <h1 className='mb-3 me-2 text-white'>My Profile</h1>
                    <AiOutlineEdit size={'2em'} color={'#E696B8'} onClick={() => setMode(!mode)} />
                </div>
                <div className='d-flex'>
                    {mode ?
                    <OverlayTrigger
                    key="message"
                    placement="bottom"
                    overlay={
                      <Tooltip id={`tooltip-top`} className={'bg-light'}>
                        Click the profile picture to change it.
                      </Tooltip>
                    }
                  >
                    <img
                            alt="editedprofile"
                            src={picture !== '' ? picture : userData.Image}
                            width="50%"
                            height="50%"
                            className='Image'
                            onClick={() => inputFile.current.click()}
                        />
                  </OverlayTrigger>
                         :
                        <img
                            alt="profile"
                            src={userData.Image}
                            width="50%"
                            height="50%"
                            className='Image'
                        />}
                    <input
                        name="image"
                        type="file"
                        onChange={inputEdit}
                        ref={inputFile}
                        hidden />
                    <div className='Overview'>
                        <div className='d-flex'>
                            <div className='me-4'>
                                <h4>ID</h4>
                                <p className='text-center'>{userData.ID}</p>
                            </div>
                            <div>
                                <h4>Transactions</h4>
                                <p className='text-center'>{history?.length}</p>
                            </div>
                        </div>
                        <h4>Full Name</h4>
                        {mode ?
                            <input type={'text'} value={userData.name} name="name" onChange={inputEdit} /> :
                            <p>{userData.name}</p>}
                        <h4>Email</h4>
                        {mode ?
                            <input type={'text'} value={userData.email} name="email" onChange={inputEdit} /> :
                            <p>{userData.email}</p>}
                        {mode && <Button style={{ height: '2em', marginTop: 12, padding: 0, position: 'absolute', right: 40, backgroundColor: '#CD2E71', border: 'none' }} onClick={(e) => Submit.mutate(e)}>Apply Change</Button>}
                    </div>
                </div>
            </div>

            <div className="vl"></div>

            {/* Transaction History */}
            <div style={{ width: '50%' }}>
                <h1 className='text-white mb-3'>Transaction History</h1>
                {history?.length === 0 ? <div>
                    <p className='text-white'>You have no transactions</p> </div> :
                    <div className='boughtContainer' style={{overflowY:'scroll'}}>
                        {/* To be Mapped */}
                        {history?.map((film) => (
                            film.status === 'success' ?
                                <Link to={`/my-films/${film.films_id}`} key={film.id} className='text-decoration-none text-dark'>
                                    <div className='boughtFilm' style={{ backgroundImage: `url(${film.films.image})` }}>
                                        <p className='text-white fw-bold mb-1 fs-4'>{film.films.title}</p>
                                        <p className='text-white mb-1'>{film.films.genre.name}</p>
                                        <p className='text-white fw-bold mb-1'>Total : Rp. {film.films.price.toLocaleString()}</p>
                                        {
                                            film.status === "failed" ?
                                                <div className='bg-danger boughtStatus'>
                                                    <p className='fw-bold text-center'>{film.status}</p>
                                                </div> :
                                                film.status === "pending" ?
                                                    <div className='bg-warning boughtStatus'>
                                                        <p className='fw-bold text-center'>{film.status}</p>
                                                    </div> :
                                                    <div className='bg-success boughtStatus'>
                                                        <p className='fw-bold text-center'>{film.status}</p>
                                                    </div>}
                                    </div>
                                </Link> :
                                <Link to={`/film/${film.films_id}`} key={film.id} className='text-decoration-none text-dark'>
                                    <div className='boughtFilm' style={{ backgroundImage: `url(${film.films.image})` }}>
                                        <p className='text-white fw-bold mb-1 fs-4'>{film.films.title}</p>
                                        <p className='text-white mb-1'>{film.films.genre.name}</p>
                                        <p className='text-white fw-bold mb-1'>Total : Rp. {film.films.price.toLocaleString()}</p>
                                        {
                                            film.status === "failed" ?
                                                <div className='bg-danger boughtStatus'>
                                                    <p className='fw-bold text-center'>{film.status}</p>
                                                </div> :
                                                film.status === "pending" ?
                                                    <div className='bg-warning boughtStatus'>
                                                        <p className='fw-bold text-center'>{film.status}</p>
                                                    </div> :
                                                    <div className='bg-success boughtStatus'>
                                                        <p className='fw-bold text-center'>{film.status}</p>
                                                    </div>}
                                    </div>
                                </Link>
                        ))}
                        {/* Finish of Map */}
                    </div>}
            </div>
        </div>
    )
}