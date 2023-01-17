import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useQuery, useMutation } from 'react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { API } from '../config/api'

export default function Synopsis() {
    let navigate = useNavigate()
    let { id } = useParams()
    let { data: film } = useQuery('filmCache', async () => {
        const response = await API.get('/films/' + id);
        return response.data.data;
    });

    let [form, setForm] = useState({
        id: '',
        image: '',
        title:'',
        ytid:'',
        genre:'',
        price:0,
        desc:''
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
            let midresponse = await API.post('/transactions', transstr)
            // console.log(midresponse)
            let token = midresponse.data.data.token

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
                  alert("you closed the popup without finishing the payment");
                },
              });
        } catch (error) {
            console.log(error)
        }
    });

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
                        <Button className='Button-pink Buy' onClick={(e) => WriteOrder.mutate(e)}>
                            Buy Now
                        </Button>
                    </div>
                    <iframe
                        title='trailer'
                        width="100%"
                        height="360"                        
                        src={`http://youtube.com/embed/${form?.ytid}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen />
                    <h3 style={{ color: "#7E7E7E", marginTop: '3%' }}>{form?.genre}</h3>
                    <h3 style={{ color: "#CD2E71" }}>Rp. {form?.price?.toLocaleString()}</h3>
                    <p className='fs-4 text-white lh-lg'>{form?.desc}</p>
                </div>
            </div>
        </>
    )
}