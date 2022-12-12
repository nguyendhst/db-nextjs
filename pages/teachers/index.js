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
    faEye,
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

const API = "http://localhost:3000/api/teachers";
const actionsAPI = ["list", "create"];

const col = [
    {
        id: "teacher_id",
        label: "Teacher ID",
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

function Teachers() {
    const [teachers, setTeachers] = useState([]);

    const [totalTeachers, setTotalTeachers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");

    const collator = useCollator({ numeric: true, localeMatcher: "best fit" });

    useEffect(() => {
        // re-render when the totalTeachers changes
        console.log("totalTeachers: ", totalTeachers);

        setLoading(false);
        setTotalPages(Math.ceil(totalTeachers / itemsPerPage));
    }, [totalTeachers]);

    async function load({ signal }) {
        const res = await fetch(`${API}/${actionsAPI[0]}`, {
            signal,
        });
        const json = await res.json();
        console.log("json:  ", json.results[0]);
        setTotalTeachers(json.totalTeachers);
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
                    setTeachers(
                        teachers.filter((teacher) => teacher.teacher_id !== id)
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
                        Teacher Management
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
                        // onClick={() => {
                        //     // redirect to register teacher page
                        //     // window.location.href = "/teachers/register";
                        // }}
                    >
                        Register Teacher
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
                    {(teacher) => (
                        <Table.Row key={teacher.teacher_id}>
                            <Table.Cell>{teacher.teacher_id}</Table.Cell>
                            <Table.Cell>{teacher.fname}</Table.Cell>
                            <Table.Cell>{teacher.lname}</Table.Cell>
                            <Table.Cell>{teacher.gender}</Table.Cell>
                            <Table.Cell>{teacher.email}</Table.Cell>
                            <Table.Cell>{teacher.phone}</Table.Cell>
                            {/* Actions */}
                            <Table.Cell>
                                <Grid.Container gap={2} justify="flex-end">
                                    <Grid>
                                        <Button
                                            color="gradient"
                                            auto
                                            size={"xs"}
                                            iconRight={
                                                <FontAwesomeIcon icon={faEye} />
                                            }
                                        >
                                            View
                                        </Button>
                                    </Grid>
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
                                                handleDelete(teacher.teacher_id)
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

export default Teachers;
