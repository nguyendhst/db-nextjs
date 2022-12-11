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
    faUserGroup,
    faPlugCircleBolt,
    faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useState } from "react";
import {
    Table,
    Badge,
    Text,
    Pagination,
    Button,
    Grid,
    Container,
    useAsyncList,
    useCollator,
} from "@nextui-org/react";


const API = "http://localhost:3000/api/students";
const actionsAPI = ["list", "create"];

const col = [
    {
        id: "student_id",
        label: "Student ID",
    },
    {
        id: "fname",
        label: "First Name",
    },
    {
        id: "lname",
        label: "Last Name",
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
    {
        id: "actions",
        label: "Actions",
    },
];

function Students() {
    const [students, setStudents] = useState([]);

    const [totalStudents, setTotalStudents] = useState(0);
    const [loading, setLoading] = useState(true);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");

    const collator = useCollator({ numeric: true, localeMatcher: "best fit" });

    useEffect(() => {
        // re-render when the totalStudents changes
        console.log("totalStudents: ", totalStudents);

        setLoading(false);
        setTotalPages(Math.ceil(totalStudents / itemsPerPage));
    }, [totalStudents]);

    async function load({ signal }) {
        const res = await fetch(`${API}/${actionsAPI[0]}`, {
            signal,
        });
        const json = await res.json();
        console.log("json:  ", json.results[0]);
        setTotalStudents(json.totalStudents);
        return {
            items: json.results[0],
        };
    }

    async function sort({ items, sortDescriptor }) {
        return {
            items: items.sort((a, b) => {
                let first = a[sortDescriptor.column];
                console.log("f", first);
                let second = b[sortDescriptor.column];
                let cmp = collator.compare(first, second);
                if (sortDescriptor.direction === "descending") {
                    cmp *= -1;
                }
                return cmp;
            }),
        };
    }

    const list = useAsyncList({ load, sort });

    const handleDelete = (id) => {
        setLoading(false);
        fetch(`${API}/delete?id=${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setStudents(
                        students.filter((student) => student.student_id !== id)
                    );
                }
            });
    };

    return (
        //  header
        <Container>
            <Grid.Container gap={2} justify="flex-start">
                <Grid xs={12} md={8}>
                    <Text h2 color="primary">
                        Student Management
                    </Text>
                </Grid>
            </Grid.Container>
            {/* Buttons */}
            <Grid.Container gap={2} justify="flex-start">
                <Grid>
                    <Button
                        color="gradient"
                        auto
                        size={"md"}
                        iconRight={<FontAwesomeIcon icon={faPlusCircle} />}
                        onClick={() => {
                            // redirect to register student page
                            window.location.href = "/students/register";
                        }}
                    >
                        Register Student
                    </Button>
                </Grid>
                <Grid>
                    <Button
                        color="gradient"
                        auto
                        size={"md"}
                        iconRight={<FontAwesomeIcon icon={faUserGroup} />}
                    >
                        Arrange Class
                    </Button>
                </Grid>
            </Grid.Container>
            {/* Table */}
            <Table
                css={{
                    height: "auto",
                    width: "100%",
                }}
                selectionMode="single"
                bordered
                shadow={false}
                sortDescriptor={list.sortDescriptor}
                onSortChange={list.sort}
            >
                <Table.Header columns={col}>
                    {(column) => (
                        <Table.Column
                            allowsSorting={column.id !== "actions"}
                            hideHeader={column.id === "actions"}
                            key={column.id}
                        >
                            {column.label}
                        </Table.Column>
                    )}
                </Table.Header>
                <Table.Body items={list.items} loadingState={list.loadingState}>
                    {(student) => (
                        <Table.Row key={student.student_id}>
                            <Table.Cell>{student.student_id}</Table.Cell>
                            <Table.Cell>{student.fname}</Table.Cell>
                            <Table.Cell>{student.lname}</Table.Cell>
                            <Table.Cell>{student.gender}</Table.Cell>
                            <Table.Cell>{student.email}</Table.Cell>
                            <Table.Cell>{student.phone}</Table.Cell>
                            {/* Actions */}
                            <Table.Cell>
                                <Grid.Container gap={2} justify="flex-start">
                                    <Grid>
                                        <Button
                                            color="gradient"
                                            auto
                                            size={"xs"}
                                            iconRight={
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                />
                                            }
                                        >
                                            Edit
                                        </Button>
                                    </Grid>
                                    <Grid>
                                        <Button
                                            color="error"
                                            auto
                                            size={"xs"}
                                            iconRight={
                                                <FontAwesomeIcon
                                                    icon={faTrashCan}
                                                />
                                            }
                                            onClick={() =>
                                                handleDelete(student.student_id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </Grid>
                                </Grid.Container>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
                {loading ? null : (
                    <Table.Pagination
                        total={totalPages}
                        color="gradient"
                        shadow
                        noMargin
                        align="center"
                        rowsPerPage={itemsPerPage}
                        onPageChange={(page) => console.log({ page })}
                    />
                )}
            </Table>
        </Container>
    );
}

export default Students;
