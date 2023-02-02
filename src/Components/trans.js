import { useState } from "react";
import { Container, Pagination, Table, ButtonGroup, ToggleButton, Tooltip, OverlayTrigger } from "react-bootstrap";
import { useQuery } from "react-query";
import { API } from "../config/api";

export default function Trans() {
    // GET TRANSACTION
    let { data: records } = useQuery('orderCache', async () => {
        const response = await API.get('/transaction');
        return response.data.data;
    });
    let { data: revenue } = useQuery('soldCache', async () => {
        const response = await API.get('/films');
        return response.data.data;
    });

    let no = 1

    // GET DATE
    function Dating(x) {
        const LocalMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const string = new Date(x)
        let Hour = string.getHours()
        if (Hour < 10) { Hour = '0' + string.getHours() }
        let Minute = string.getMinutes()
        if (Minute < 10) { Minute = '0' + string.getMinutes() }
        const date = `${LocalMonth[string.getMonth()]} ${string.getDate()}, ${string.getFullYear()} ${Hour}:${Minute}`

        return date
    }

    // eslint-disable-next-line
    const [checked, setChecked] = useState(false);
    const [radioValue, setRadioValue] = useState('Users');

    const radios = [
        { name: 'Users', value: 'Users' },
        { name: 'Films', value: 'Films' },
    ];

    // PAGINATION
    let [target, setTarget] = useState(1)
    let [ellipse, setEllipse] = useState(0)

    let items = [];
    let page = radioValue === "Users" ? Math.ceil(records?.length / 10) : Math.ceil(revenue?.length / 10)
    for (let number = 1 + (ellipse * 5); number <= (1 + ellipse) * 5; number++) {
        items.push(
            <Pagination.Item style={{ width: '3vw', textAlign: 'center', fontWeight: 'bold' }} key={number} active={number === target} disabled={page < number} onClick={() => setTarget(number)}>
                {number}
            </Pagination.Item>
        );
    }

    return (
        <>
            {radioValue === "Users" ?
                <Container className="mt-1 w-75">
                    <div className="d-flex justify-content-between">
                        <h1 className="text-white">All Transactions</h1>
                        <ButtonGroup>
                            {radios.map((radio, idx) => (
                                <ToggleButton
                                    key={idx}
                                    id={`radio-${idx}`}
                                    type="radio"
                                    variant={idx % 2 ? 'outline-primary' : 'outline-danger'}
                                    name="radio"
                                    value={radio.value}
                                    checked={radioValue === radio.value}
                                    onChange={(e) => { setRadioValue(e.currentTarget.value); setTarget(1) }}
                                    style={{ height: '80%' }}
                                >
                                    {radio.name}
                                </ToggleButton>
                            ))}
                        </ButtonGroup>
                    </div>
                    <Table variant="dark" className="mt-4" striped>
                        <thead className="px-3">
                            <tr>
                                <th className="py-2 text-center" style={{ width: '1%' }}>No</th>
                                <th className="py-2 text-center" style={{ width: '5%' }}>Users</th>
                                <th className="py-2 text-center" style={{ width: '5%' }}>Film</th>
                                <th className="py-2 text-center" style={{ width: '5%' }}>Order Date</th>
                                <th className="py-2 text-center" style={{ width: '5%' }}>Status Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records?.slice((target - 1) * 10, target * 10).map((orders) => (
                                <tr key={orders.id}>
                                    <td className="py-2 text-center" style={{ width: '1%' }}>{(target - 1) * 10 + (no++)}</td>
                                    {
                                        <OverlayTrigger
                                            placement="auto"
                                            overlay={
                                                <Tooltip id={"tooltip-auto"}>
                                                    {orders.users.Name}
                                                </Tooltip>
                                            }
                                        >
                                            <td className="py-2 text-center" style={{ width: '5%' }}>{orders.users.Name.slice(0, 20)}{orders.users.Name.length > 20 ? '...' : null}</td>
                                        </OverlayTrigger>
                                    }
                                    {
                                        <OverlayTrigger
                                            placement="auto"
                                            overlay={
                                                <Tooltip id={"tooltip-auto"}>
                                                    {orders.films.title}
                                                </Tooltip>
                                            }
                                        >
                                            <td className="py-2 text-center" style={{ width: '5%' }}>{orders.films.title.slice(0, 25)}{orders.films.title.length > 25 ? '...' : null}</td>
                                        </OverlayTrigger>
                                    }
                                    <td className="py-2 text-center" style={{ width: '5%' }}>{Dating(`${orders.buydate}`)}</td>
                                    {
                                        orders.status === "pending" ?
                                            <td className="py-2 fw-bold text-center text-warning" style={{ width: '5%' }}>Pending</td> :
                                            orders.status === "success" ?
                                                <td className="py-2 fw-bold text-center text-success" style={{ width: '5%' }}>Approved</td> :
                                                <td className="py-2 fw-bold text-center text-secondary" style={{ width: '5%' }}>Failed</td>
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination style={{ position: "absolute", right: "13vw", bottom: "10vh" }}>
                        <Pagination.First disabled={target === 1} onClick={() => { setEllipse(0); setTarget(1) }} />
                        <Pagination.Ellipsis disabled={target < 5} onClick={() => { setEllipse(ellipse - 1); setTarget(((ellipse - 1) * 5) + 1) }} />
                        {items}
                        <Pagination.Ellipsis disabled={page - target < 5} onClick={() => { setEllipse(ellipse + 1); setTarget(((ellipse + 1) * 5) + 1) }} />
                        <Pagination.Last disabled={target === page} onClick={() => { setEllipse(Math.floor((page - 1) / 5)); setTarget(page) }} />
                    </Pagination>
                </Container>
                :
                <Container className="mt-1 w-75">
                    <div className="d-flex justify-content-between">
                        <h1 className="text-white">All Transactions</h1>
                        <ButtonGroup>
                            {radios.map((radio, idx) => (
                                <ToggleButton
                                    key={idx}
                                    id={`radio-${idx}`}
                                    type="radio"
                                    variant={idx % 2 ? 'outline-primary' : 'outline-danger'}
                                    name="radio"
                                    value={radio.value}
                                    checked={radioValue === radio.value}
                                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                                    style={{ height: '80%' }}
                                >
                                    {radio.name}
                                </ToggleButton>
                            ))}
                        </ButtonGroup>
                    </div>
                    <Table variant="dark" className="mt-4" striped>
                        <thead className="px-3">
                            <tr>
                                <th className="py-2 text-center" style={{ width: '1%' }}>No</th>
                                <th className="py-2 text-left" style={{ width: '5%' }}>Title</th>
                                <th className="py-2 text-center" style={{ width: '5%' }}>Price</th>
                                <th className="py-2 text-center" style={{ width: '5%' }}>Sold</th>
                                <th className="py-2 text-center" style={{ width: '5%' }}>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {revenue?.slice((target - 1) * 10, target * 10).map((data) => (
                                <tr key={data.id}>
                                    <td className="py-2 text-center" style={{ width: '1%' }}>{(target - 1) * 10 + (no++)}</td>
                                    {
        <OverlayTrigger
          placement="auto"
          overlay={
            <Tooltip id={"tooltip-auto"}>
              {data?.title}
            </Tooltip>
          }
        >
          <td className="py-2 text-left" style={{ width: '5%' }}>{data?.title.slice(0, 25)}{data?.title.length > 25 ? '...' : null}</td>
        </OverlayTrigger>
      }
                                    <td className="py-2 text-center" style={{ width: '5%' }}>Rp {data?.price?.toLocaleString()}</td>
                                    <td className="py-2 text-center" style={{ width: '5%' }}>{data?.sold} times</td>
                                    <td className="py-2 text-center" style={{ width: '5%' }}>Rp {(data?.price * data?.sold).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination style={{ position: "absolute", right: "13vw", bottom: "10vh" }}>
                        <Pagination.First disabled={target === 1} onClick={() => { setEllipse(0); setTarget(1) }} />
                        <Pagination.Ellipsis disabled={target < 5} onClick={() => { setEllipse(ellipse - 1); setTarget(((ellipse - 1) * 5) + 1) }} />
                        {items}
                        <Pagination.Ellipsis disabled={page - target < 5} onClick={() => { setEllipse(ellipse + 1); setTarget(((ellipse + 1) * 5) + 1) }} />
                        <Pagination.Last disabled={target === page} onClick={() => { setEllipse(Math.floor((page - 1) / 5)); setTarget(page) }} />
                    </Pagination>
                </Container>
            }
        </>
    )
}