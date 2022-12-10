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
    Container,
} from "@nextui-org/react";

import axios from "axios";

const API = "http://localhost:3000/api/students";
const actionsAPI = ["list", "create"];

const col = [
    {
        id: "student_id",
        label: "Student ID",
    },
    {
        id: "student_name",
        label: "Name",
    },
    {
        id: "gender",
        label: "Gender",
    },
    {
        id: "email",
        label: "Email",
    },
    {
        id: "phone",
        label: "Phone",
    },
];

function Students() {
    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("refetch");
        setLoading(true);
        axios
            .get(`${API}/${actionsAPI[0]}`, { params: { page, limit } })
            .then((res) => {
                console.log(res.data);
                setStudents(res.data.results[0]);
                setTotalPages(res.data.totalPages);
                setTotalStudents(res.data.totalStudents);
                setLoading(false);
            })
            .then(console.log("refetch done"));
    }, [page, limit]);

    const handlePageChange = (page) => {
        setPage(page);
    };

    const handleLimitChange = (limit) => {
        setLimit(limit);
    };

    const handleDelete = (id) => {
        setLoading(true);
        fetch(`${API}/delete?id=${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setStudents(
                        students.filter((student) => student.student_id !== id)
                    );
                }
                setLoading(false);
            });
    };

    return (
        //  header
        <Container>
            <Grid.Container gap={2} justify="space-between">
                <Grid xs={12}>
                    <h2>Students Management</h2>
                </Grid>
            </Grid.Container>
            {/* Table */}
            <Table
                css={{
                    height: "auto",
                    width: "100%",
                }}
            >
                <Table.Header columns={col}>
                    {(column) => (
                        <Table.Column key={column.id}>
                            {column.label}
                        </Table.Column>
                    )}
                </Table.Header>
                <Table.Body items={students}>
                    {(student) => (
                        <Table.Row key={student.student_id}>
                            <Table.Cell>{student.student_id}</Table.Cell>
                            <Table.Cell>
                                {student.fname + " " + student.lname}
                            </Table.Cell>
                            <Table.Cell>{student.gender}</Table.Cell>
                            <Table.Cell>{student.email}</Table.Cell>
                            <Table.Cell>{student.phone}</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </Container>
    );
}

export default Students;

// <Table.Header columns={columns}>
//                                 {(column) => (
//                                     <Table.Column
//                                         key={column.key}

//                                     >
//                                         {column.name}
//                                     </Table.Column>

//                                 )}
//                             </Table.Header>
//                             <Table.Body items={filteredData}>
//                                 {(item) => (
//                                     <Table.Row key={item.key}>
//                                         <Table.Cell>{item.id}</Table.Cell>
//                                         <Table.Cell>{item.assigned}</Table.Cell>
//                                         <Table.Cell>

//                                             <Badge
//                                                 color={matchStatusBadgeColor(item.status)}
//                                                 size="md"
//                                                 style={{ width: "60px" }}
//                                             >
//                                                 {item.status}
//                                             </Badge>

//                                         </Table.Cell>
//                                         <Table.Cell>
//                                             <FontAwesomeIcon icon={faCircleInfo} />
//                                         </Table.Cell>
//                                         <Table.Cell>2021-05-01 12:00:00</Table.Cell>
//                                         <Table.Cell>
//                                             <Grid.Container gap={1}>
//                                                 <Grid xs={4}>
//                                                     <Button
//                                                         color="primary"
//                                                         size="xs"
//                                                         className="rounded-10"
//                                                         icon={<FontAwesomeIcon icon={faEdit} />}

//                                                     >
//                                                         Edit
//                                                     </Button>
//                                                 </Grid>
//                                                 <Grid xs={2}>
//                                                     <Button
//                                                         color="error"
//                                                         size="xs"
//                                                         className="rounded-10"
//                                                         icon={<FontAwesomeIcon icon={faTrashCan} />}
//                                                     >
//                                                         Delete
//                                                     </Button>
//                                                 </Grid>
//                                             </Grid.Container>
//                                         </Table.Cell>
//                                     </Table.Row>
//                                 )}

//                             </Table.Body>

//                         </Table>
//                     </div>
//                     <div
//                         className="pagination d-flex align-items-center py-4 border-top px-2"
//                         style={{
//                             position: "sticky",
//                             bottom: 0,
//                             boxShadow: "0px 0px 1px #fff",
//                             backgroundColor: "#000",
//                         }}
