import {
    faChevronLeft,
    faChevronRight,
    faCircleInfo,
    faEdit,
    faFilter,
    faSearch,
    faSquarePlus,
    faTrashCan,
    faXmark,
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
            .then(console.log("refetch done"))
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
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
            <Grid.Container gap={2} justify="flex-start">
                <Grid xs={12} md={8}>
                    <h2>Students Management</h2>
                </Grid>
            </Grid.Container>
            {/* Buttons */}
            <Grid.Container gap={2} justify="flex-start">
                <Grid>
                    <Button
                        color="gradient"
                        auto
                        size={"md"}
                        iconRight={<FontAwesomeIcon icon={faSquarePlus} />}
                    >
                        Add Student
                    </Button>
                </Grid>
                <Grid>
                    <Button
                        color="gradient"
                        auto
                        size={"md"}
                        iconRight={<FontAwesomeIcon icon={faXmark} />}
                    >
                        Delete
                    </Button>
                </Grid>
            </Grid.Container>
            {/* Table */}
            <Table
                css={{
                    height: "auto",
                    width: "100%",
                }}
                selectionMode="multiple"
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