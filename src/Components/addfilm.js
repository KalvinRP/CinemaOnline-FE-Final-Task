import { useRef, useState, useEffect } from "react";
import { Button, Container, Form, InputGroup, Modal, Table } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Attach from "../asset/Attach Icon.svg";
import Trash from "../asset/trash.png";
import { API } from "../config/api";
import '../style/custom.css';

export default function Filmform() {
    let { mode } = useParams()
    return (
        <>
            {mode === "edit" ? <Editfilm /> : <Morefilm />}
        </>
    )
}

export function Morefilm() {
    let [showGenre, setshowGenre] = useState(false);
    let handleShowGenre = () => setshowGenre(true)
    let handleHideGenre = () => {
        setshowGenre(false)
        setEdit(false)
        setEntry({})
        setEditing(null)
    }

    let { data: genre, refetch } = useQuery('genreCache', async () => {
        const response = await API.get('/genre');
        return response.data.data;
    });

    let [entry, setEntry] = useState({});
    let [edit, setEdit] = useState(false);
    let [editing, setEditing] = useState(null);

    let newGenre = (e) => {
        setEntry({
            name: e.target.value,
        })
    };

    let handleEdit = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            EditGenre.mutate(e)
            setEdit(false)
        }
        if (e.key === "Escape") {
            e.preventDefault()
            setEdit(false)
        }
    }

    let EditGenre = useMutation(async () => {
        try {
            await API.patch('/genre/' + editing, entry);
            refetch();
        } catch (error) {
            console.log(error)
        }
    });

    let AddGenre = useMutation(async (e) => {
        try {
            e.preventDefault()
            await API.post('/genre', entry);
            refetch();
        } catch (error) {
            console.log(error)
        }
    });

    const deleteById = useMutation(async (id) => {
        try {
            await API.delete('/genre/' + id);
            refetch();
        } catch (error) {
            console.log(error);
        }
    });

    const [film, setFilm] = useState({
        title: "",
        image: "",
        genre_id: 0,
        price: 0,
        desc: "",
        status: "",
        ytid: "",
        full_url: ""
    });

    const [fill, setFill] = useState(false)

    let SubmitFilm = useMutation(async (e) => {
        try {
            setFill(false)
            e.preventDefault()
            if (validate(film)) {

                const config = {
                    headers: {
                        'Content-type': 'multipart/form-data',
                    },
                };

                const formData = new FormData();
                formData.set('title', film.title);
                formData.set('genre_id', parseInt(film.genre_id, 10));
                formData.set('price', parseInt(film.price, 10));
                formData.set('desc', film.desc);
                formData.set('status', film.status);
                // eslint-disable-next-line
                formData.set('ytid', film.ytid.match(/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/)[1]);
                // eslint-disable-next-line
                formData.set('full_url', film.full_url.match(/https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_\-]*)/)[1]);
                formData.set('image', film.image[0]);

                const response = await API.post('/films', formData, config)
                if (response.data.code === 200) {
                    await Swal.fire({
                        title: 'Successfully adding film!',
                        icon: 'success',
                        timer: 2000
                    })
                    setFilm({
                        title: "",
                        genre_id: 0,
                        price: 0,
                        image: null,
                        desc: "",
                        status: "",
                        ytid: "",
                        full_url: ""
                    })
                    setThumb("")
                }
            }
        } catch (error) {
            console.log(error)
        }
    });

    const inputFile = useRef(null);
    let [thumbnail, setThumb] = useState("")
    let [showThumbnail, setshowThumb] = useState(false);
    let handleShowThumbnail = () => setshowThumb(true)
    let handleHideThumbnail = () => setshowThumb(false)

    let FilmTyped = (e) => {
        setFilm({
            ...film,
            // eslint-disable-next-line
            [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
        });
        e.target.type === "file" && setThumb(URL.createObjectURL(e.target.files[0]))
        setFalseytUrl(false)
        setFalsegdUrl(false)
        setFill(false)
    };

    /* CONDITIONING */
    // Conditioning URL and get YTID
    const [falseytUrl, setFalseytUrl] = useState(false);
    const [falsegdUrl, setFalsegdUrl] = useState(false);

    const validate = (link) => {
        let IsFilled = Object.values(link).every(check)

        function check(data) {
            return data !== '' && data !== 0
        }

        if (IsFilled) {
            // eslint-disable-next-line
            const validytUrl = /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})/gm;
            let boolyt = validytUrl.test(link.ytid)
            if (boolyt === false) { setFalseytUrl(true) }

            // eslint-disable-next-line
            const validgdUrl = /https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_\-]*)/
            let boolgd = validgdUrl.test(link.full_url)
            if (boolgd === false) { setFalsegdUrl(true) }
            return boolyt && boolgd
        }
        else {
            setFill(true)
            return false
        }
    }

    return (
        <>
            {fill &&
                <div className="mb-3 text-white bg-danger fs-5 bg-opacity-50">
                    <p style={{ marginLeft: '5%', marginBottom: 0 }}>Please fill in all required fields and thumbnail.</p>
                </div>
            }

            <Container className="mt-5 w-50">
                <h1 className="mb-2 text-white">Add Film</h1>

                <Form>
                    <div className="d-flex">
                        <Form.Group className="mb-3 w-75">
                            <Form.Control value={film.title} name="title" type="text" placeholder="Title" onChange={FilmTyped} style={{ backgroundColor: '#474747', color: "white" }} />
                        </Form.Group>
                        <div className="w-25 position-relative">
                            {thumbnail === "" ?
                                <Button style={{ width: '95%', position: "absolute", display: 'flex', justifyContent: 'space-between', right: 0, backgroundColor: '#474747', border: "none" }}
                                    onClick={() => inputFile.current.click()}>Attach Thumbnail
                                    <img alt="attachment" src={Attach} />
                                </Button> :
                                <Button className="Button-upload" style={{ width: '95%', position: "absolute", display: 'flex', justifyContent: 'space-between', right: 0, backgroundColor: '#474747', border: "none" }}
                                    onMouseEnter={handleShowThumbnail}>Hover to See Thumbnail
                                </Button>}

                            <input
                                name="image"
                                // value={film.image}
                                type="file"
                                onChange={FilmTyped}
                                ref={inputFile}
                                hidden />
                        </div>
                    </div>

                    <Form.Group className="mb-3">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Form.Select value={film.genre_id} name="genre_id" onChange={FilmTyped} style={{ backgroundColor: '#474747', color: "white", width: "84%" }}>
                                <option>Genre</option>
                                {genre?.map((things) => (
                                    <option key={things.id} value={things.id}>{things.name}</option>
                                ))}
                            </Form.Select>
                            <Button onClick={handleShowGenre} style={{ width: '15%', backgroundColor: '#474747', border: 'none' }}>
                                Edit Genre
                            </Button>
                        </div>
                    </Form.Group>

                    <InputGroup className="mb-3">
                        <InputGroup.Text className="bg-black text-white">Rp</InputGroup.Text>
                        <Form.Control value={film.price} name="price" type="text" maxLength={12} onChange={FilmTyped} style={{ backgroundColor: '#474747', color: "white" }} />
                    </InputGroup>

                    <Form.Group className="mb-3">
                        <Form.Control value={film.ytid} name="ytid" type="text" onChange={FilmTyped} placeholder="Trailer Link (YouTube)" style={{ backgroundColor: '#474747', color: "white" }} />
                        {falseytUrl && <p className="text-danger">Enter a valid YouTube URL</p>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control value={film.full_url} name="full_url" type="url" placeholder="Full Film URL" onChange={FilmTyped} style={{ backgroundColor: '#474747', color: "white" }} />
                        {falsegdUrl && <p className="text-danger">Enter a valid Full Film URL</p>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Select value={film.status} name="status" onChange={FilmTyped} style={{ backgroundColor: '#474747', color: "white" }}>
                            <option>Type of Post</option>
                            <option value="reg">Regular Post</option>
                            <option value="new">Hot Post</option>
                            <option value="ad">Advertised Post</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            name="desc"
                            value={film.desc}
                            as="textarea"
                            placeholder="Description"
                            onChange={FilmTyped}
                            style={{ height: '20vh', backgroundColor: '#474747', color: "white" }}
                        />
                    </Form.Group>

                    <Container className="w-100 position-relative">
                        <Button className="bg-secondary position-absolute start-0" size='lg'><a href="/trans-list" className="text-decoration-none text-black">Cancel Add</a></Button>
                        <Button className="Button-pink position-absolute end-0" size='lg' onClick={(e) => SubmitFilm.mutate(e)}>Add Film</Button>
                    </Container>
                </Form>

                <Modal show={showThumbnail} onMouseLeave={handleHideThumbnail}>
                    <img width="100%" alt="thumbnail" src={thumbnail} />
                    <Button style={{ width: '100%', backgroundColor: '#474747', border: "none" }}
                        onClick={() => inputFile.current.click()}>Change Thumbnail
                        <img alt="attachment" src={Attach} />
                    </Button>
                </Modal>

                <Modal show={showGenre} onHide={handleHideGenre}>
                    <div style={{ backgroundColor: "#212121" }}>
                        <Modal.Body>
                            <Modal.Title className='ModalText'>Edit Genre</Modal.Title>
                            <Table>
                                <thead>
                                    <tr>
                                        <th className="w-75 fs-4 text-white">Added Genres</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {genre?.map((things) => (
                                        <tr key={things.id}>
                                            {edit && editing === things.id ?
                                                <td>
                                                    <Form.Control value={things.name} onChange={newGenre} autoFocus={true} onKeyDown={handleEdit} />
                                                    <p style={{ color: "red", fontSize: "12px", marginBottom: "0px" }}>Press Enter to keep changes or Esc to exit</p>
                                                </td> :
                                                <td onClick={() => { setEdit(true); setEditing(things.id) }} className='text-white'>{things.name}</td>}
                                            <td className="p-0">
                                                <Button onClick={() => deleteById.mutate((things.id))} className="p-0" style={{ border: 'none', backgroundColor: 'transparent' }}>
                                                    <img
                                                        alt="trash"
                                                        src={Trash}
                                                        width='30%'
                                                    />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td><Form.Control type="text" autoFocus placeholder="or add new genre" onChange={newGenre} style={{ backgroundColor: '#C4C4C4', width: '85%' }} disabled={edit ? true : false} /></td>
                                        <td>
                                            <Button variant="success" className='text-light text-center w-100' onClick={(e) => AddGenre.mutate(e)} disabled={edit ? true : false}>
                                                Add
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Modal.Body>
                    </div>
                </Modal>
            </Container>
        </>
    )
}

export function Editfilm() {
    const id = useLocation()
    const redirect = useNavigate()

    let [showGenre, setshowGenre] = useState(false);
    let handleShowGenre = () => setshowGenre(true)
    let handleHideGenre = () => {
        setshowGenre(false)
        setEdit(false)
        setEntry({})
        setEditing(null)
    }

    let { data: genre, refetch } = useQuery('genreCache', async () => {
        const response = await API.get('/genre');
        return response.data.data;
    });

    let { data: filed } = useQuery('filedCache', async () => {
        const response = await API.get('/films/' + id.state);
        return response.data.data;
    });

    useEffect(() => {
        setFilm({
            title: filed?.title,
            genre_id: filed?.genre_id,
            price: filed?.price,
            desc: filed?.desc,
            status: filed?.status,
            ytid: "https://www.youtube.com/watch?v=" + filed?.ytid,
            full_url: "https://drive.google.com/file/d/" + filed?.full_url
        })
    }, [filed])

    let [entry, setEntry] = useState({});
    let [edit, setEdit] = useState(false);
    let [editing, setEditing] = useState(null);

    let newGenre = (e) => {
        setEntry({
            name: e.target.value,
        })
    };

    let handleEdit = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            EditGenre.mutate(e)
            setEdit(false)
        }
        if (e.key === "Escape") {
            e.preventDefault()
            setEdit(false)
        }
    }

    let EditGenre = useMutation(async () => {
        try {
            await API.patch('/genre/' + editing, entry);
            refetch();
        } catch (error) {
            console.log(error)
        }
    });

    let AddGenre = useMutation(async (e) => {
        try {
            e.preventDefault()
            await API.post('/genre', entry);
            refetch();
        } catch (error) {
            console.log(error)
        }
    });

    const deleteById = useMutation(async (id) => {
        try {
            await API.delete('/genre/' + id);
            refetch();
        } catch (error) {
            console.log(error);
        }
    });

    const [film, setFilm] = useState({
        title: "",
        image: "",
        genre_id: 0,
        price: 0,
        desc: "",
        status: "",
        ytid: "",
        full_url: ""
    });
    console.log(film)

    const [fill, setFill] = useState(false)

    let SubmitFilm = useMutation(async (e) => {
        try {
            setFill(false)
            e.preventDefault()
            if (validate(film)) {

                const config = {
                    headers: {
                        'Content-type': 'multipart/form-data',
                    },
                };

                const formData = new FormData();
                formData.set('title', film.title);
                formData.set('genre_id', parseInt(film.genre_id, 10));
                formData.set('price', parseInt(film.price, 10));
                formData.set('desc', film.desc);
                formData.set('status', film.status);
                // eslint-disable-next-line
                formData.set('ytid', film.ytid.match(/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/)[1]);
                // eslint-disable-next-line
                formData.set('full_url', film.full_url.match(/https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_\-]*)/)[1]);
                if (film.image) {formData.set('image', film.image[0])}

                const response = await API.patch('/films/' + id.state, formData, config)
                if (response.data.code === 200) {
                    await Swal.fire({
                        title: 'Successfully updating film!',
                        icon: 'success',
                        timer: 2000
                    })
                    redirect('/film/' + id.state)
                }
            }
        } catch (error) {
            console.log(error)
        }
    });

    const inputFile = useRef(null);
    let [thumbnail, setThumb] = useState("")
    let [showThumbnail, setshowThumb] = useState(false);
    let handleShowThumbnail = () => setshowThumb(true)
    let handleHideThumbnail = () => setshowThumb(false)

    let FilmTyped = (e) => {
        setFilm({
            ...film,
            // eslint-disable-next-line
            [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
        });
        e.target.type === "file" && setThumb(URL.createObjectURL(e.target.files[0]))
        setFalseytUrl(false)
        setFalsegdUrl(false)
        setFill(false)
    };

    const deleteFilm = useMutation(async () => {
            Swal.fire({
                title: 'Do you want to delete \n' + film?.title + '?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                customClass: {
                  actions: 'my-actions',
                  cancelButton: 'order-1 right-gap',
                  confirmButton: 'order-2',
                  denyButton: 'order-3',
                }
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire('Film deleted!')
                  API.delete('/films/' + id.state);
                  redirect('/')
                }
              })
    });

    /* CONDITIONING */
    // Conditioning URL and get YTID
    const [falseytUrl, setFalseytUrl] = useState(false);
    const [falsegdUrl, setFalsegdUrl] = useState(false);

    const validate = (link) => {
        let IsFilled = Object.values(link).every(check)

        function check(data) {
            return data !== '' && data !== 0
        }

        if (IsFilled) {
            // eslint-disable-next-line
            const validytUrl = /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})/gm;
            let boolyt = validytUrl.test(link.ytid)
            if (boolyt === false) { setFalseytUrl(true) }

            // eslint-disable-next-line
            const validgdUrl = /https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_\-]*)/
            let boolgd = validgdUrl.test(link.full_url)
            if (boolgd === false) { setFalsegdUrl(true) }
            return boolyt && boolgd
        }
        else {
            setFill(true)
            return false
        }
    }

    return (
        <>
            {fill &&
                <div className="mb-3 text-white bg-danger fs-5 bg-opacity-50">
                    <p style={{ marginLeft: '5%', marginBottom: 0 }}>Please fill in all required fields and thumbnail.</p>
                </div>
            }

            <Container className="mt-5 w-50">
                <h1 className="mb-2 text-white">Edit Film: {film?.title}</h1>

                <Form>
                    <div className="d-flex">
                        <Form.Group className="mb-3 w-75">
                            <Form.Control value={film?.title || ''} name="title" type="text" placeholder="Title" onChange={FilmTyped} style={{ backgroundColor: '#474747', color: "white" }} />
                        </Form.Group>
                        <div className="w-25 position-relative">
                            {thumbnail === "" ?
                                <Button style={{ width: '95%', position: "absolute", display: 'flex', justifyContent: 'space-between', right: 0, backgroundColor: '#474747', border: "none" }}
                                    onClick={() => inputFile.current.click()}>New Thumbnail
                                    <img alt="attachment" src={Attach} />
                                </Button> :
                                <Button className="Button-upload" style={{ width: '95%', position: "absolute", display: 'flex', justifyContent: 'space-between', right: 0, backgroundColor: '#474747', border: "none" }}
                                    onMouseEnter={handleShowThumbnail}>Hover to See Thumbnail
                                </Button>}

                            <input
                                name="image"
                                // value={film?.image}
                                type="file"
                                onChange={FilmTyped}
                                ref={inputFile}
                                hidden />
                        </div>
                    </div>

                    <Form.Group className="mb-3">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Form.Select value={film?.genre_id || 0} name="genre_id" onChange={FilmTyped} style={{ backgroundColor: '#474747', color: "white", width: "84%" }}>
                                <option>Genre</option>
                                {genre?.map((things) => (
                                    <option key={things.id} value={things.id}>{things.name}</option>
                                ))}
                            </Form.Select>
                            <Button onClick={handleShowGenre} style={{ width: '15%', backgroundColor: '#474747', border: 'none' }}>
                                Edit Genre
                            </Button>
                        </div>
                    </Form.Group>

                    <InputGroup className="mb-3">
                        <InputGroup.Text className="bg-black text-white">Rp</InputGroup.Text>
                        <Form.Control value={film?.price || ''} name="price" type="text" maxLength={12} onChange={FilmTyped} style={{ backgroundColor: '#474747', color: "white" }} />
                    </InputGroup>

                    <Form.Group className="mb-3">
                        <Form.Control value={film?.ytid || ''} name="ytid" type="text" onChange={FilmTyped} placeholder="Trailer Link (YouTube)" style={{ backgroundColor: '#474747', color: "white" }} />
                        {falseytUrl && <p className="text-danger">Enter a valid YouTube URL</p>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control value={film?.full_url || ''} name="full_url" type="url" placeholder="Full Film URL" onChange={FilmTyped} style={{ backgroundColor: '#474747', color: "white" }} />
                        {falsegdUrl && <p className="text-danger">Enter a valid Full Film URL</p>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Select value={film?.status || ''} name="status" onChange={FilmTyped} style={{ backgroundColor: '#474747', color: "white" }}>
                            <option>Type of Post</option>
                            <option value="reg">Regular Post</option>
                            <option value="new">Hot Post</option>
                            <option value="ad">Advertised Post</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            name="desc"
                            value={film?.desc}
                            as="textarea"
                            placeholder="Description"
                            onChange={FilmTyped}
                            style={{ height: '20vh', backgroundColor: '#474747', color: "white" }}
                        />
                    </Form.Group>

                    <Container className="w-100 position-relative">
                        <Button className="bg-secondary position-absolute start-0" size='lg'><a href={`/film/${id.state}`} className="text-decoration-none text-black">Cancel Edit</a></Button>
                        <Button className="position-absolute" style={{right: '40%', backgroundColor:'red'}} size='lg' onClick={() => deleteFilm.mutate()}>Delete Film</Button>
                        <Button className="Button-pink position-absolute end-0" size='lg' onClick={(e) => SubmitFilm.mutate(e)}>Update Film</Button>
                    </Container>
                </Form>

                <Modal show={showThumbnail} onMouseLeave={handleHideThumbnail}>
                    <img width="100%" alt="thumbnail" src={thumbnail} />
                    <Button style={{ width: '100%', backgroundColor: '#474747', border: "none" }}
                        onClick={() => inputFile.current.click()}>Change Thumbnail
                        <img alt="attachment" src={Attach} />
                    </Button>
                </Modal>

                <Modal show={showGenre} onHide={handleHideGenre}>
                    <div style={{ backgroundColor: "#212121" }}>
                        <Modal.Body>
                            <Modal.Title className='ModalText'>Edit Genre</Modal.Title>
                            <Table>
                                <thead>
                                    <tr>
                                        <th className="w-75 fs-4 text-white">Added Genres</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {genre?.map((things) => (
                                        <tr key={things.id}>
                                            {edit && editing === things.id ?
                                                <td>
                                                    <Form.Control value={things.name} onChange={newGenre} autoFocus={true} onKeyDown={handleEdit} />
                                                    <p style={{ color: "red", fontSize: "12px", marginBottom: "0px" }}>Press Enter to keep changes or Esc to exit</p>
                                                </td> :
                                                <td onClick={() => { setEdit(true); setEditing(things.id) }} className='text-white'>{things.name}</td>}
                                            <td className="p-0">
                                                <Button onClick={() => deleteById.mutate((things.id))} className="p-0" style={{ border: 'none', backgroundColor: 'transparent' }}>
                                                    <img
                                                        alt="trash"
                                                        src={Trash}
                                                        width='30%'
                                                    />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td><Form.Control type="text" autoFocus placeholder="or add new genre" onChange={newGenre} style={{ backgroundColor: '#C4C4C4', width: '85%' }} disabled={edit ? true : false} /></td>
                                        <td>
                                            <Button variant="success" className='text-light text-center w-100' onClick={(e) => AddGenre.mutate(e)} disabled={edit ? true : false}>
                                                Add
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Modal.Body>
                    </div>
                </Modal>
            </Container>
        </>
    )
}