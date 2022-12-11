import { useEffect, useState } from "react";
import {
    Badge,
    Text,
    Pagination,
    Button,
    Grid,
    Container,
    Input,
    Dropdown,
    Spacer,
} from "@nextui-org/react";

const API = "http://localhost:3000/api/students/register";

const fields = [
    {
        uid: "student_id",
        label: "Student ID",
    },
    {
        uid: "fname",
        label: "First Name",
    },
    {
        uid: "lname",
        label: "Last Name",
    },
    {
        uid: "gender",
        label: "Gender",
    },
    {
        uid: "email",
        label: "Email",
    },
    {
        uid: "phone",
        label: "Phone",
    },
    {
        uid: "address",
        label: "Address",
    },
    {
        uid: "center_id",
        label: "Center ID",
    },
    {
        uid: "course_id",
        label: "Course ID",
    },
    {
        uid: "programme_id",
        label: "Programme ID",
    },
];

function RegisterForm() {
    const [student, setStudent] = useState({});
    const [center, setCenter] = useState({});

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(student);
    };

    return (

        <Container>
            <Spacer y={2} />
            {/*  2 x 2 Grid boxes */}
            <Grid.Container gap={2}>
                <Grid xs={12} sm={6}>
                    {/* Center id dropdown select and generated student id */}
                    <Container xs={12}>
                        {/* Title */}
                        <Text color="primary" h4>
                            1. Select Center
                        </Text>

                        <Grid.Container
                            gap={2}
                            style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                borderRadius: "20px",
                            }}
                        >
                            <Grid xs={12} sm={12}>
                                <Text h5>Center ID:</Text>
                                <Spacer y={1} x={2} />
                                <Dropdown>
                                    <Dropdown.Button
                                        flat
                                        color="secondary"
                                        css={{ tt: "capitalize" }}
                                    >
                                        {center.label || "Select Center"}
                                    </Dropdown.Button>
                                    <Dropdown.Menu
                                        aria-label="Single selection actions"
                                        color="secondary"
                                        disallowEmptySelection
                                        selectionMode="single"
                                        selectedKeys={center.key}
                                        onSelectionChange={(key) => {
                                            setCenter({
                                                key,
                                                label: key,
                                            });
                                        }}
                                    >
                                        <Dropdown.Item key="1">
                                            Center 1
                                        </Dropdown.Item>
                                        <Dropdown.Item key="2">
                                            Center 2
                                        </Dropdown.Item>
                                        <Dropdown.Item key="3">
                                            Center 3
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Grid>
                            <Grid xs={12} sm={12}>
                                <Text h5>Student ID:</Text>
                                <Spacer y={1} x={2} />
                                <Input
                                    name="student_id"
                                    placeholder="Student ID"
                                    value={student.student_id}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid.Container>
                    </Container>
                </Grid>
                <Grid xs={12} sm={6}>
                    2 of 4
                </Grid>
                <Grid xs={12} sm={6}>
                    3 of 4
                </Grid>
                <Grid xs={12} sm={6}>
                    4 of 4
                </Grid>
            </Grid.Container>
        </Container>
    );
}

export default RegisterForm;
