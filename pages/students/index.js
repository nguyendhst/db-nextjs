import {
    faChevronLeft,
    faChevronRight,
    faCircleInfo,
    faEdit,
    faFilter,
    faSearch,
    faSquarePlus,
    faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useState } from "react";
import {
    Table,
    Badge,
    Pagination,
    Button,
    Grid,
} from "@nextui-org/react";

const status = ["Stable", "Near", "Full", "Inactive"];

let idCounter = 0;

function matchStatusBadgeColor(status) {
    switch (status) {
        case "Stable":
            return "primary";
        case "Near":
            return "warning";
        case "Full":
            return "error";
        case "Inactive":
            return "neutral";
        default:
            return "neutral";
    }
}

function generateRandomMCPs() {
    idCounter++;
    return {
        key: idCounter,
        id:  randomID(),
        assigned: Math.floor(Math.random() * 100) + "SA-" + Math.floor(Math.random() * 10000),
        status: status[Math.floor(Math.random() * 4)],
    };
};


function randomID() {
    // format: XX0000
    // XX: 2 random letters
    // 0000: 4 random numbers
    return (
        String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
        String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
        Math.floor(Math.random() * 10000).toString().padEnd(4, "0")
    );
}

function generateTableData() {
    const data = [];
    for (let i = 0; i < 100; i++) {
        data.push(generateRandomMCPs());
    }  
    return data;
}


const columns = [
    {
        key: "id",
        name: "ID",
        selector: "id",
        sortable: true,
    },
    {
        key: "assigned",
        name: "Assigned Vehicle",
        selector: "assigned",
        sortable: true,
    },
    {
        key: "status",
        name: "Status",
        selector: "status",
        sortable: true,
    },
    {
        key: "info",
        name: "Info",
        selector: "info",
        sortable: false,
    },
    {
        key: "lastUpdate",
        name: "Last Updated",
        selector: "lastUpdated",
        sortable: true,
    },
    {
        key: "actions",
        name: "Action",
        selector: "action",
        sortable: false,
    },
]

// columns includes: ID, Assigned Vehicle, Status, Info, Last Updated, Action

const MCPs = () => {
    const [tableData, setTableData] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        setTableData(generateTableData());
    }, []);

    useEffect(() => {
        if (!tableData) return;

        setFilteredData(
            tableData.filter((item) => {
                return (
                    item.assigned.toLowerCase().includes(search.toLowerCase())
                );
            })
            .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
        );
    }, [search, tableData, currentPage]);


    return (
        <div style={{ height: "100%" }}>
            <div className="p-3 border-bottom">
                    <h4 className="m-0">Quản lý MCPs</h4>
            </div>
            <div className="container my-4">
                <div className="status-filter">
                    <button
                        className="btn btn-primary-outline text-white border rounded-0 rounded-top"
                        onClick={() => setFilteredData(
                            tableData.filter((item) => {
                                return (
                                    item.assigned.toLowerCase().includes(search.toLowerCase())
                                );
                            })
                            .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                        )}
                    >
                        All
                    </button>
                    <button
                        className="btn btn-primary-outline text-white border rounded-0 rounded-top"
                        onClick={() => setFilteredData(
                            tableData.filter((item) => {
                                return (
                                    item.status !== "Inactive" &&
                                    item.assigned.toLowerCase().includes(search.toLowerCase())
                                );
                            })
                            .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                        )}
                    >
                        Available
                    </button>

                    <button
                        className="btn btn-primary-outline text-white border rounded-0 rounded-top"
                        onClick={() => setFilteredData(
                            tableData.filter((item) => {
                                return (
                                    item.status === "Inactive" &&
                                    item.assigned.toLowerCase().includes(search.toLowerCase())
                                );
                            }
                            )
                            .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                        )}
                    >
                        Inactive
                    </button>
                </div>
                <div className="p-4 border">
                    <div className="filter-bar">
                        <div className="d-flex align-items-center">
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon
                                    icon={faFilter}
                                    className="me-2"
                                />
                                <span className="me-2">Filter</span>
                                <select
                                    className="form-select form-select-sm"
                                    aria-label=".form-select-sm example"
                                >
                                    <option defaultValue="0">Choose...</option>
                                    <option value="1">Stable MCPs</option>
                                    <option value="2">Near Full MCPs</option>
                                    <option value="3">Full MCPs</option>
                        

                                </select>

                            </div>
                            <div className="d-flex align-items-center ms-4">
                                <FontAwesomeIcon

                                    icon={faSearch}
                                    className="me-2"
                                />
                                <input

                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Search"
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                            </div>
                            <div className="d-flex align-items-center ms-4">
                                {/* Add MCP Button */}
                                <Button variant="primary" size="sm" className="rounded-10">
                                    <FontAwesomeIcon

                                        icon={faSquarePlus}
                                        className="me-2"
                                    />
                                    Add New MCP
                                </Button>
                            </div>
                            <div className="d-flex align-items-center ms-4">
                                <Button variant="primary" size="sm" className="rounded-10">
                                    <FontAwesomeIcon

                                        icon={faSquarePlus}
                                        className="me-2"
                                    />
                                    Assign Vehicles
                                </Button>
                            </div>
                            <div className="d-flex align-items-center ms-4">
                                <Button variant="primary" size="sm" className="rounded-10">
                                    Open Monitor Dashboard
                                </Button>
                            </div>
                        </div>
                    </div>


                    <div className="table-wrapper">
                        {/* table column align center */}
                        <Table 
                        compact
                        >
                            <Table.Header columns={columns}>
                                {(column) => (
                                    <Table.Column
                                        key={column.key}
                                        
                                    >
                                        {column.name}
                                    </Table.Column>

                                )}
                            </Table.Header>
                            <Table.Body items={filteredData}>
                                {(item) => (
                                    <Table.Row key={item.key}>
                                        <Table.Cell>{item.id}</Table.Cell>
                                        <Table.Cell>{item.assigned}</Table.Cell>
                                        <Table.Cell>

                                            <Badge
                                                color={matchStatusBadgeColor(item.status)}
                                                size="md"
                                                style={{ width: "60px" }}
                                            >
                                                {item.status}
                                            </Badge>

                                        </Table.Cell>
                                        <Table.Cell>
                                            <FontAwesomeIcon icon={faCircleInfo} />
                                        </Table.Cell>
                                        <Table.Cell>2021-05-01 12:00:00</Table.Cell>
                                        <Table.Cell>
                                            <Grid.Container gap={1}>
                                                <Grid xs={4}>
                                                    <Button
                                                        color="primary"
                                                        size="xs"
                                                        className="rounded-10"
                                                        icon={<FontAwesomeIcon icon={faEdit} />}

                                                    >
                                                        Edit
                                                    </Button>
                                                </Grid>
                                                <Grid xs={2}>
                                                    <Button
                                                        color="error"
                                                        size="xs"
                                                        className="rounded-10"
                                                        icon={<FontAwesomeIcon icon={faTrashCan} />}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Grid>
                                            </Grid.Container>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                                
                            </Table.Body>
                            
                        </Table>
                    </div>
                    <div
                        className="pagination d-flex align-items-center py-4 border-top px-2"
                        style={{
                            position: "sticky",
                            bottom: 0,
                            boxShadow: "0px 0px 1px #fff",
                            backgroundColor: "#000",
                        }}
                    >
                        <Pagination
                            total={tableData.length / rowsPerPage}
                            current={currentPage}
                            onChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default MCPs;
