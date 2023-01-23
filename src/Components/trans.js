import { Container, Dropdown, Pagination, Table } from "react-bootstrap"
import { useQuery } from "react-query";
import { API } from "../config/api";
import Arrow from "../asset/Action.png"
import { useState } from "react";

export default function Trans() {
    // GET TRANSACTION
    let { data: records } = useQuery('orderCache', async () => {
        const response = await API.get('/transaction');
        return response.data.data;
    });
    let no = 1
    
    // GET DATE
    function Dating(x) {
        const LocalMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const string = new Date(x)
        let Hour = string.getHours()
        if (Hour < 10) {Hour = '0' + string.getHours()}
        let Minute = string.getMinutes()
        if (Minute < 10) {Minute = '0' + string.getMinutes()}
        const date = `${LocalMonth[string.getMonth()]} ${string.getDate()}, ${string.getFullYear()} ${Hour}:${Minute}`

        return date
    }

    // PAGINATION
    let [target, setTarget] = useState(1)
    let [ellipse, setEllipse] = useState(0)

    let items = [];
    let page = Math.ceil(records?.length / 10)
    for (let number = 1+(ellipse*5); number <= (1+ellipse)*5; number++) {
        items.push(
            <Pagination.Item style={{width:'3vw', textAlign:'center', fontWeight:'bold'}} key={number} active={number === target} disabled={page < number} onClick={() => setTarget(number)}>
                {number}
            </Pagination.Item>
        );
    }

    console.log(target)

    return (
        <Container className="mt-1 w-75">
            <h1 className="text-white">Incoming Transactions</h1>
            <Table variant="dark" className="mt-4" striped>
                <thead className="px-3">
                    <tr>
                        <th className="py-2">No</th>
                        <th className="py-2 pe-3">Users</th>
                        <th className="py-2 pe-3">Film</th>
                        <th className="py-2 pe-3">Order Date</th>
                        <th className="py-2 pe-1">Status Payment</th>
                        {/* <th className="py-2 pe-3">Action</th> */}
                    </tr>
                </thead>
                <tbody>
                    {records?.slice((target-1)*10, target*10).map((orders) => (
                        <tr key={orders.id}>
                            <td className="py-2">{(target-1)*10+(no++)}</td>
                            <td className="py-2 pe-3">{orders.users.Name}</td>
                            <td className="py-2 pe-3">{orders.films.title}</td>
                            <td className="py-2 pe-1">{Dating(`${orders.buydate}`)}</td>
                            {
                                orders.status === "pending" ?
                                    <td className="py-2 fw-bold text-warning">Pending</td> :
                                    orders.status === "success" ?
                                        <td className="py-2 fw-bold text-success">Approved</td> :
                                        <td className="py-2 fw-bold text-secondary">Failed</td>
                            }
                            {/* <td className="py-2">
                            <Dropdown>
                                <Dropdown.Toggle id="dropdown-basic" style={{ backgroundColor: 'transparent', color: 'transparent', border: 'none', padding: 0 }}>
                                    <img alt="action" src={Arrow} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </td> */}
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination style={{position: "absolute", right:"13vw", bottom: "10vh"}}>
                <Pagination.First disabled={target === 1} onClick={() => {setEllipse(0); setTarget(1)}} />
                <Pagination.Ellipsis disabled={target < 5} onClick={() => {setEllipse(ellipse-1); setTarget(((ellipse-1)*5)+1)}} />
                {items}
                <Pagination.Ellipsis disabled={page-target < 5} onClick={() => {setEllipse(ellipse+1); setTarget(((ellipse+1)*5)+1)}} />
                <Pagination.Last disabled={target === page} onClick={() => {setEllipse(Math.floor((page-1)/5)); setTarget(page)}} />
            </Pagination>
        </Container>
    )
}