import { Container, Dropdown, Table } from "react-bootstrap"
import Arrow from "../asset/Action.png"

export default function Trans() {
    
    return (
        <Container className="mt-5 w-75">
            <h1 className="text-white">Incoming Transactions</h1>
            <Table variant="dark" className="mt-3" striped>
                <thead className="px-3">
                    <tr>
                        <th className="py-4">No</th>
                        <th className="py-4 pe-3">Users</th>
                        <th className="py-4 pe-3">Film</th>
                        <th className="py-4 pe-3">Order Date</th>
                        <th className="py-4 pe-1">Status Payment</th>
                        <th className="py-4 pe-3">Action</th>
                        {/* <th className="py-4 pe-3">Proof</th> */}
                    </tr>
                </thead>
                <tbody>
                    {/* {records?.map((orders) => ( */}
                    <tr>
                        <td className="py-4">1</td>
                        <td className="py-4 pe-3">Andi</td>
                        <td className="py-4 pe-3">Tom & Jerry The Movie</td>
                        <td className="py-4 pe-1">3 Januari 2019</td>
                        {
                                /* orders.status === "pending" */ false ?
                                <td className="py-4 fw-bold text-warning">Pending</td> :
                                   /* orders.status === "Approved" */ true ?
                                    <td className="py-4 fw-bold text-success">Approved</td> :
                                    <td className="py-4 fw-bold text-secondary">Canceled</td>
                        }
                        <td className="py-4">
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
                        </td>
                    </tr>
                    {/* ))} */}
                </tbody>
            </Table>
        </Container>
    )
}