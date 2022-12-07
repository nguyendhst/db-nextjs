import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Table, Pagination, Button} from "@nextui-org/react";

const columns = [
    {
        key: "id",
        name: "ID",
        selector: "id",
        sortable: true,
    },
    {
        key: "fname",
        name: "FNAME",
        selector: "action",
        sortable: true,
    },
    {
        key: "lname",
        name: "LNAME",
        selector: "action",
        sortable: true,
    },
    {
        key: "gender",
        name: "GENDER",
        selector: "action",
        sortable: true,
    },
    {
        key: "dateOfBirth",
        name: "DATE OF BIRTH",
        selector: "action",
        sortable: true,
    },
    {
        key: "email",
        name: "EMAIL",
        selector: "action",
        sortable: true,
    },
    {
        key: "phone",
        name: "PHONE",
        selector: "action",
        sortable: true,
    },
    {
        key: "hireDay",
        name: "HIRE DAY",
        selector: "action",
        sortable: true,
    },
    {
        key: "LastModified",
        name: "LAST MODIFIED",
        selector: "action",
        sortable: true,
    },
    {
        key: "role",
        name: "ROLE",
        selector: "action",
        sortable: true,
    },
    {
        key: "action",
        name: "ACTION",
        selector: "action",
        sortable: false,
    },
]


function generateWorkers() {
    let a = Math.floor(Math.random() * 2)
    let b = Math.floor(Math.random() * 2)
    return {
        id:  Math.floor(Math.random() * 1000000),
        fname: a ? "Lenh" : "Truong",
        lname: b ? "Ho Xung" : "Vo Ky",
        email: (a ? "Lenh" : "Truong") + (b ? "HoXung" : "VoKy") + "@gmail.com",
        phone: "090" + Math.floor(Math.random() * 10000000),
        gender: Math.floor(Math.random() * 2) ? "Male" : "Female",
        dateOfBirth: "2002-" + Math.ceil(Math.random() * 31) % 32 + "-" + Math.ceil(Math.random() * 12) % 13, 
        role: Math.floor(Math.random() * 2) ? "Collector" : "Janitor",
        hireDay: "2022-" + Math.ceil(Math.random() * 31) % 32 + "-" + Math.ceil(Math.random() * 12) % 13,
    };
};


function generateTableData() {
    const data = [];
    for (let i = 0; i < 100; i++) {
        data.push(generateWorkers());
    }  
    return data;
}

const Workers = () => {
    const [tableData, setTableData] = useState([]);
    const [setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(9);


    useEffect(() => {
        setTableData(generateTableData());
    }, []);


    useEffect(() => {
        setFilteredData(
            tableData.filter((item) => {
                return item;
            })
            .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
        );
    }, [tableData, currentPage]);


    return <div>    
        <div style={{ height: "100%" }}>
            <div className="p-3 border-bottom">
                <h4 className="m-0">Worker Management</h4>
            </div>

            <div className="container my-4">
                <div className="p-4 border">
                    <div className="home-filter d-flex align-items-center border-bottom pb-3">
                        <div className="input-group w-25">
                            <div className="btn border input-group-text">
                                <i class="fa fa-search" aria-hidden="true"></i>
                            </div>

                            <input type="text" className="form-control" placeholder="Search worker" />

                            <button className="btn border text-nowrap">
                                <i class="fa fa-filter" aria-hidden="true"></i>
                                <span className="ms-2">Sort</span>
                            </button>
                        </div>
                    </div>

                    <div className="table-content">
                        <Table compact>
                            <Table.Header columns={columns}>
                                {(column) => (<Table.Column key={column.key}> {column.name} </Table.Column>)}
                            </Table.Header>   
                             
                            <Table.Body items={filteredData}> 
                                {(item) => (
                                    <Table.Row key={item.key}>
                                        <Table.Cell>{item.id}</Table.Cell>
                                        <Table.Cell>{item.fname}</Table.Cell>
                                        <Table.Cell>{item.lname}</Table.Cell>
                                        <Table.Cell>{item.gender}</Table.Cell>
                                        <Table.Cell>{item.dateOfBirth}</Table.Cell>
                                        <Table.Cell>{item.email}</Table.Cell>
                                        <Table.Cell>{item.phone}</Table.Cell>
                                        <Table.Cell>{item.hireDay}</Table.Cell>
                                        <Table.Cell>2022-11-30 10:53:24</Table.Cell>
                                        <Table.Cell>{item.role}</Table.Cell>
                                        <Table.Cell>
                                        <div className="container ">
                                            <div className="btn">
                                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>                                                                                                
                        </Table>
                    </div>





                <div
                    className="pagination py-4 border-top"
                    style={{
                        position: "sticky",
                        bottom: 0,
                        backgroundColor: "#edf0f4",
                    }}
                >
                    <button className="btn border">
                        <i class="fa fa-plus-square-o" aria-hidden="true"></i>
                        <span className="ms-2"> New worker</span>
                    </button>
                    <button className="btn border">
                        <i class="fa fa-minus-square-o" aria-hidden="true"></i>
                        <span className="ms-2">Remove</span>
                    </button>
                    <div className="ms-auto">
                        <Pagination 
                            total={100}
                            current={currentPage}
                            onChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>;
};

export default Workers;
