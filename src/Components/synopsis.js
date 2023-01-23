import React, { useContext, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { API } from '../config/api'
import { UserContext } from '../context/userContext'

export default function Synopsis() {
    let navigate = useNavigate()
    let [state] = useContext(UserContext)
    let route = 'public-films'
    if (state.isLogin) { route = 'films' }
    let { id } = useParams()
    let { data: film, refetch } = useQuery('filmCache', async () => {
        const response = await API.get(`/${route}/` + id);
        return response.data.data;
    });

    let [form, setForm] = useState({
        id: '',
        image: '',
        title: '',
        ytid: '',
        genre: '',
        price: 0,
        desc: '',
        token: ''
    });

    useEffect(() => {
        if (film) {
            setForm({
                ...form,
                id: film.id,
                image: film.image,
                title: film.title,
                ytid: film.ytid,
                genre: film.genre?.name,
                price: film.price,
                desc: film.desc,
                token: film.token
            });
        }
        // eslint-disable-next-line
    }, [film]);

    let intid = parseInt(id, 10)

    let trans = {
        films_id: intid,
        status: "pending",
    };

    let transstr = JSON.stringify(trans);

    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        //change this according to your client-key
        const myMidtransClientKey = "SB-Mid-client-ywlswT2baBw2sc_j";

        let scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);

        document.body.appendChild(scriptTag);
        return () => {
            document.body.removeChild(scriptTag);
        };
    }, []);


    let WriteOrder = useMutation(async (e) => {
        try {
            e.preventDefault()
            if (!state.isLogin) {
                Swal.fire({
                    title: 'You need to log in first',
                    icon: 'info',
                    timer: 2000,
                })
            } else {

                let midresponse = await API.post('/transactions', transstr)
                let token = midresponse.data.data.token

                snap(token)
            };
        } catch (error) {
            console.log(error)
        }
    });

    let snap = (token) => {
        window.snap.pay(token, {
            onSuccess: function (result) {
                console.log(result);
                navigate("/profile");
            },
            onPending: function (result) {
                console.log(result);
                navigate("/profile");
            },
            onError: function (result) {
                console.log(result);
            },
            onClose: function () {
                alert("You closed the popup without finishing the payment.");
                refetch()
            },
        })
    }

    useEffect(() => {
        refetch()
        // eslint-disable-next-line
    }, [state])

    return (
        <>
            <div key={form?.id} className='d-flex'>
                {/* Cover Film */}
                <img
                    alt={form?.image}
                    src={form?.image}
                    className='FilmCover'
                />

                {/* Detail Film */}
                <div className='FilmDetail'>
                    <div className='Titling'>
                        <h1 className='fw-bold text-white'>{form?.title}</h1>
                        {
                            state?.user.role === "admin" ?
                                <Button className='Button-pink Buy' onClick={() => navigate('/modify-film/edit', {state: intid})}>
                                    Edit Film
                                </Button> :
                                form?.token !== '' ?
                                    <Button className='Button-pink Buy' onClick={() => snap(form?.token)}>
                                        Continue Payment
                                    </Button> :
                                    form?.price !== 0 ?
                                        <Button className='Button-pink Buy' onClick={(e) => WriteOrder.mutate(e)}>
                                            Buy Now
                                        </Button> :
                                        null
                        }
                    </div>
                    <iframe
                        title='trailer'
                        width="100%"
                        height="360"
                        src={`http://youtube.com/embed/${form?.ytid}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen />
                    <h3 style={{ color: "#7E7E7E", marginTop: '3%' }}>{form?.genre}</h3>
                    {form?.price !== 0 && <h3 style={{ color: "#CD2E71" }}>Rp. {form?.price?.toLocaleString()}</h3>}
                    <p className='fs-4 text-white lh-lg'>{form?.desc}</p>
                </div>
            </div>
        </>
    )
}