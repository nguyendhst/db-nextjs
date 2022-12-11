import { useEffect, useState, useMemo } from "react";
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
    Modal,
} from "@nextui-org/react";

import axios from "axios";

const API = "http://localhost:3000/api/students/register";

const fields2 = [
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
];

const fields = [
    {
        uid: "student_id",
        label: "Student ID",
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

const getValueFromSet = (set) => {
    const value = Array.from(set)[0];
    return value;
};

const compareStudentID = (a, b) => {
    const aID = a.student_id.split("S")[1];
    const bID = b.student_id.split("S")[1];
    return aID - bID;
};

const generateNextStudentID = (list) => {
    const newlist = list.sort((a, b) => {
        return compareStudentID(a, b);
    });
    if (newlist.length == 0) {
        return "S00000";
    }
    const lastStudentID = newlist[newlist.length - 1].student_id;
    const lastStudentIDNum = parseInt(lastStudentID.split("S")[1]);
    const nextStudentIDNum = lastStudentIDNum + 1;
    const nextStudentID = "S" + nextStudentIDNum.toString().padStart(5, "0");
    return nextStudentID;
};

const studentIDAPI = "http://localhost:3000/api/students/list?getid=";
const programmesAPI = "http://localhost:3000/api/courses?programmes=";
const coursesAPI = "http://localhost:3000/api/courses";
const centerAPI = "http://localhost:3000/api/centers";

function RegisterForm() {
    const [student, setStudent] = useState({});
    const [center, setCenter] = useState(new Set(["Select"]));
    const [centersList, setCentersList] = useState([]);
    const [programme, setProgramme] = useState(new Set(["Select"]));
    const [programmesList, setProgrammesList] = useState([]);
    const [course, setCourse] = useState(new Set(["Select"]));
    const [coursesList, setCoursesList] = useState([]);
    const [studentID, setStudentID] = useState("S00000");
    const [studentIDList, setStudentIDList] = useState([]);

    // inital fetch
    useEffect(() => {
        axios.get(programmesAPI + "all").then((res) => {
            console.log("p:", res.data.results[0]);
            setProgrammesList(res.data.results[0]);
        });

        axios.get(centerAPI).then((res) => {
            console.log("centers:", res.data.results[0]);
            setCentersList(res.data.results[0]);
        });
    }, []);

    // on center change rewrite student id TODO
    useEffect(() => {
        // fetch student id list
        console.log("center: ", getValueFromSet(center));
        if (getValueFromSet(center) == "Select") {
            return;
        }

        axios.get(studentIDAPI + getValueFromSet(center)).then((res) => {
            console.log(res.data);
            setStudentIDList(res.data.results);
        });
    }, [center]);

    useEffect(() => {
        console.log("programme list", programmesList);
        if (programme == "Select") {
            return;
        }
        const pr = getValueFromSet(programme);
        // find id of programme
        const programmeID =
            programmesList.find((p) => p.name == pr)?.programme_id ?? -1;
        console.log("programme id", programmeID);
        if (programmeID < 0) {
            return;
        }
        axios
            .get(
                coursesAPI +
                    "?center=" +
                    getValueFromSet(center) +
                    "&programme=" +
                    programmeID
            )
            .then((res) => {
                console.log(res.data);
                setCoursesList(res.data.results[0]);
            });
        // reload course dropdown
        setCourse(new Set(["Select"]));
    }, [programme]);

    const selectedCenter = useMemo(() => center, [center]);

    const selectedProgramme = useMemo(() => programme, [programme]);

    const selectedCourse = useMemo(() => course, [course]);

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
        console.log("change", e.target.name, e.target.value);
        console.log(student);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let newData = {
            student_id: studentID,
            center_id: getCenterID(center),
            fname: student.fname,
        };
    };

    const handleSchedule = (e) => {
        e.preventDefault();
        console.log("schedule");
    };

    return (
        <Container>
            <Grid.Container gap={2} justify="flex-start">
                <Grid xs={12} md={8}>
                    <Spacer y={2} />
                    <Text
                        h4
                        color="secondary"
                        onClick={() => {
                            window.location.href = "/students";
                        }}
                    >
                        Student Management/
                    </Text>
                    <Spacer x={1} />
                    <Text h2 color="primary">
                        Student Registration
                    </Text>
                </Grid>
            </Grid.Container>

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
                        <Spacer y={1} />

                        <Grid.Container
                            gap={2}
                            style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                borderRadius: "20px",
                            }}
                        >
                            <Grid xs={12} sm={12}>
                                {/* TODO: center name */}
                                <Text h5>Center ID:</Text>
                                <Spacer y={1} x={2} />
                                <Dropdown>
                                    <Dropdown.Button
                                        flat
                                        color="secondary"
                                        css={{ tt: "capitalize" }}
                                    >
                                        {selectedCenter}
                                    </Dropdown.Button>
                                    <Dropdown.Menu
                                        aria-label="Single selection actions"
                                        color="secondary"
                                        disallowEmptySelection
                                        selectionMode="single"
                                        selectedKeys={center}
                                        onSelectionChange={setCenter}
                                    >
                                        {centersList.map((c) => (
                                            <Dropdown.Item
                                                key={c.center_id}
                                                value={c.center_id}
                                            >
                                                {c.center_name}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Grid>
                            <Grid xs={12} sm={12}>
                                <Text h5>Student ID:</Text>
                                <Spacer y={1} x={2} />
                                <Input
                                    name="student_id"
                                    onChange={handleChange}
                                    value={generateNextStudentID(studentIDList)}
                                />
                            </Grid>
                        </Grid.Container>
                    </Container>
                </Grid>
                <Grid xs={12} sm={6}>
                    {/* Course and classes */}
                    <Container xs={12}>
                        {/* Title */}
                        <Text color="primary" h4>
                            3. Course Selection
                        </Text>
                        <Spacer y={1} />

                        <Grid.Container
                            gap={2}
                            style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                borderRadius: "20px",
                            }}
                        >
                            <Grid xs={12} sm={6}>
                                <Text h5>Programme:</Text>
                                <Spacer y={1} x={2} />
                                <Dropdown>
                                    <Dropdown.Button
                                        flat
                                        color="secondary"
                                        css={{ tt: "capitalize" }}
                                    >
                                        {selectedProgramme}
                                    </Dropdown.Button>
                                    <Dropdown.Menu
                                        aria-label="Single selection actions"
                                        color="secondary"
                                        disallowEmptySelection
                                        selectionMode="single"
                                        selectedKeys={programme}
                                        onSelectionChange={setProgramme}
                                    >
                                        {programmesList.map((programme) => (
                                            <Dropdown.Item key={programme.name}>
                                                {programme.name}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Grid>
                            <Grid xs={12} sm={12} md={6}>
                                <Text h5>Course:</Text>
                                <Spacer y={1} x={2} />
                                <Dropdown>
                                    <Dropdown.Button
                                        flat
                                        color="secondary"
                                        css={{ tt: "capitalize" }}
                                    >
                                        {selectedCourse}
                                    </Dropdown.Button>
                                    <Dropdown.Menu
                                        aria-label="Single selection actions"
                                        color="secondary"
                                        disallowEmptySelection
                                        selectionMode="single"
                                        selectedKeys={course}
                                        onSelectionChange={setCourse}
                                    >
                                        {coursesList.map((course) => (
                                            <Dropdown.Item
                                                key={course.course_name}
                                            >
                                                {course.course_name}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Grid>
                            <Grid xs={12} sm={12}>
                                <Button
                                    shadow
                                    type="button"
                                    color="gradient"
                                    style={{ width: "100%" }}
                                    onClick={handleSchedule}
                                >
                                    Scheduling
                                </Button>
                            </Grid>
                        </Grid.Container>
                    </Container>
                </Grid>
                <Grid xs={12} sm={6}>
                    {/* Personal info form */}
                    <Container xs={12}>
                        {/* Title */}
                        <Text color="primary" h4>
                            2. Personal Information
                        </Text>
                        <Spacer y={1} />

                        <Grid.Container
                            gap={2}
                            style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                borderRadius: "20px",
                            }}
                        >
                            <Spacer y={1} />
                            {fields2.map((field) => (
                                <Grid xs={12} sm={12}>
                                    <Spacer y={2} />
                                    <Input
                                        fullWidth
                                        labelLeft={field.label}
                                        name={field.uid}
                                        onChange={handleChange}
                                        placeholder={field.label}
                                        clearable
                                        bordered
                                        required
                                    />
                                </Grid>
                            ))}
                        </Grid.Container>
                    </Container>
                </Grid>
                <Grid xs={12} sm={6}>
                    {/* Invoice */}
                    <Container xs={12}>
                        {/* Title */}
                        <Text color="primary" h4>
                            4. Invoice
                        </Text>
                        <Spacer y={1} />

                        <Grid.Container
                            gap={2}
                            style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                borderRadius: "20px",
                            }}
                        >
                            <Grid xs={12} sm={12}>
                                <Text h5>Invoice ID:</Text>

                                <Spacer y={1} x={2} />
                                <Input
                                    name="invoice_id"
                                    initialValue="Not set"
                                />
                            </Grid>
                            {/* submit button */}
                            <Grid xs={12} sm={12}>
                                <Spacer y={2} />
                                <Button
                                    shadow
                                    type="button"
                                    size="large"
                                    color="gradient"
                                    onClick={handleSubmit}
                                    style={{ width: "100%" }}
                                >
                                    Register Student
                                </Button>
                            </Grid>
                        </Grid.Container>
                    </Container>
                </Grid>
            </Grid.Container>
        </Container>
    );
}

export default RegisterForm;
