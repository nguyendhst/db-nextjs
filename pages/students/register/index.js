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
    Table,
    Checkbox,
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

const validateForm = (form) => {
    // student_id must be of the form S00000
    const student_id = form.student_id;
    const student_id_regex = /^S\d{5}$/;
    if (!student_id_regex.test(student_id)) {
        return "Student ID must be of the form S00000";
    }
    // fname must be between 2 and 50 characters
    const fname = form.fname;
    if (fname.length < 2 || fname.length > 50) {
        return "First name must be between 2 and 50 characters";
    }
    // lname must be between 2 and 50 characters
    const lname = form.lname;
    if (lname.length < 2 || lname.length > 50) {
        return "Last name must be between 2 and 50 characters";
    }
    // email must be a valid email
    const email = form.email;
    const email_regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email_regex.test(email)) {
        return "Email must be a valid email";
    }
    // phone must be a valid phone number
    const phone = form.phone;
    const phone_regex = /^\d{12}$/;
    if (!phone_regex.test(phone)) {
        return "Phone must be a valid phone number";
    }
    // address must be at most 100 characters
    const address = form.address;
    if (address.length > 100) {
        return "Address must be at most 100 characters";
    }
    // center_id must be a valid center_id
    const center_id = form.center_id;
    if (isNaN(center_id)) {
        return "Center ID must be a valid center ID";
    }
    // course_id must be a valid course_id
    const course_id = form.course_id;
    if (isNaN(course_id)) {
        return "Course ID must be a valid course ID";
    }
    // username must be between 5 and 50 characters
    const username = form.username;
    if (username.length < 5 || username.length > 50) {
        return "Username must be between 5 and 50 characters";
    }
    // password must be between 5 and 50 characters
    const password = form.password;
    if (password.length < 5 || password.length > 50) {
        return "Password must be between 5 and 50 characters";
    }
    // dob must be a valid date
    const dob = form.dob;
    const dob_regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dob_regex.test(dob)) {
        return "Date of birth must be a valid date";
    } else {
        // must be atleast 10 years old
        const dobDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - dobDate.getFullYear();
        if (age < 10) {
            return "Student must be atleast 10 years old";
        }
    }
    return null;
};

const studentIDAPI = "http://localhost:3000/api/students/list?getid=";
const programmesAPI = "http://localhost:3000/api/courses?programmes=";
const coursesAPI = "http://localhost:3000/api/courses";
const centerAPI = "http://localhost:3000/api/centers";
const classAPI = "http://localhost:3000/api/classes";
const studentRegisterAPI = "http://localhost:3000/api/students/register";

function RegisterForm() {
    const [student, setStudent] = useState({});
    const [center, setCenter] = useState(new Set(["Select"]));
    const [centersList, setCentersList] = useState([]);
    const [programme, setProgramme] = useState(new Set(["Select"]));
    const [programmesList, setProgrammesList] = useState([]);
    const [course, setCourse] = useState(new Set(["Select"]));
    const [coursesList, setCoursesList] = useState([]);
    const [classs, setClass] = useState(new Set(["Select"]));
    const [classesList, setClassesList] = useState([]);
    const [studentID, setStudentID] = useState("S00000");
    const [studentIDList, setStudentIDList] = useState([]);

    const [scheduleVisible, setScheduleVisible] = useState(false);

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

        // reset all
        setProgramme(new Set(["Select"]));
        setCourse(new Set(["Select"]));
        setClass(new Set(["Select"]));
    }, [center]);

    useEffect(() => {
        console.log("programme list", programmesList);
        if (programme == "Select" || getValueFromSet(center) == "Select") {
            // reset
            // setProgramme(new Set(["Select"]));
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

    useEffect(() => {
        if (course == "Select") {
            return;
        }
        const c = getValueFromSet(course);
        console.log("getValueFromSet(course)", c);
        console.log("list", coursesList);
        const courseID =
            coursesList.find((p) => p.course_name == c)?.course_id ?? -1;
        console.log("course id", courseID);
        if (courseID < 0) {
            return;
        }
        axios
            .get(
                classAPI +
                    "?center=" +
                    getValueFromSet(center) +
                    "&course=" +
                    courseID
            )
            .then((res) => {
                console.log("class", res.data);
                setClassesList(res.data.results[0]);
            });
        // reload class dropdown
        // setClass(new Set(["Select"]));
    }, [course]);

    const selectedCenter = useMemo(() => center, [center]);

    const selectedProgramme = useMemo(() => programme, [programme]);

    const selectedCourse = useMemo(() => course, [course]);

    const selectedClass = useMemo(() => classs, [classs]);

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
        console.log("change", e.target.name, e.target.value);
        console.log(student);
        console.log("id: ", studentID);
    };

    const handleSubmit = () => {
        const courseID =
            coursesList.find((p) => p.course_name == getValueFromSet(course))
                ?.course_id ?? -1;
        if (courseID < 0) {
            return;
        }
        const data = {
            student_id: studentID,
            fname: student.fname,
            lname: student.lname,
            email: student.email,
            phone: student.phone,
            gender: student.gender,
            dob: student.dob,
            address: student.address,
            username: student.username,
            password: student.password,
            center_id: getValueFromSet(center),
            course_id: courseID.toString(),
        };
        let err;
        if ((err = validateForm(data))) {
            console.log(data);
            axios
                .post(studentRegisterAPI, data)
                .then((res) => {
                    console.log(res.data);
                    if (res.data.status == "success") {
                        // alert user
                        alert("Successfully registered");
                        // redirect to student management
                        window.location.href = "/students";
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            // alert user
            alert(err);
        }
    };

    const handleSchedule = () => {
        setScheduleVisible(true);
    };

    const handleCloseSchedule = () => {
        setScheduleVisible(false);
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

            <Spacer y={1} />

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
                                    value={() => {
                                        const id =
                                            generateNextStudentID(
                                                studentIDList
                                            );
                                        setStudentID(id);
                                        return id;
                                    }}
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

                            {/* <Grid xs={12} sm={12} md={6}>
                                <Text h5>Class:</Text>
                                <Spacer y={1} x={2} />
                                <Dropdown>
                                    <Dropdown.Button
                                        flat
                                        color="secondary"
                                        css={{ tt: "capitalize" }}
                                    >
                                        {selectedClass}
                                    </Dropdown.Button>
                                    <Dropdown.Menu
                                        aria-label="Single selection actions"
                                        color="secondary"
                                        disallowEmptySelection
                                        selectionMode="single"
                                        selectedKeys={classs}
                                        onSelectionChange={setClass}
                                    >
                                        {classesList.map((classs) => (
                                            <Dropdown.Item
                                                key={classs.class_name}
                                            >
                                                {classs.class_name}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Grid> */}
                            {/* <Grid xs={12} sm={12}>
                                <Button
                                    shadow
                                    ghost
                                    type="button"
                                    color="gradient"
                                    style={{ width: "100%" }}
                                    onClick={handleSchedule}
                                >
                                    Scheduling
                                </Button>
                                <Modal
                                    open={scheduleVisible}
                                    onClose={handleCloseSchedule}
                                    animated={false}
                                >
                                    <Modal.Header>
                                        <Text h4>Class Scheduling</Text>
                                    </Modal.Header>
                                    <Modal.Body>
                               
                                    </Modal.Body>
                                </Modal>
                            </Grid> */}
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
                            {/* date of birth */}
                            <Grid xs={12} sm={12}>
                                <Spacer y={2} />
                                <Input
                                    fullWidth
                                    type={"date"}
                                    labelLeft={"Date of Birth"}
                                    name={"dob"}
                                    onChange={handleChange}
                                    clearable
                                    bordered
                                    required
                                />
                            </Grid>
                        </Grid.Container>
                    </Container>
                </Grid>
                <Grid xs={12} sm={6}>
                    {/* Invoice */}
                    <Container xs={12}>
                        {/* Title */}
                        <Text color="primary" h4>
                            4. Create Account
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
                                <Text h5>Username:</Text>

                                <Spacer y={1} x={2} />
                                <Input
                                    name="username"
                                    initialValue="Not set"
                                    fullWidth
                                    labelLeft="Username"
                                    onChange={handleChange}
                                    clearable
                                    bordered
                                    required
                                />
                            </Grid>
                            <Grid xs={12} sm={12}>
                                <Text h5>Password:</Text>

                                <Spacer y={1} x={2} />
                                <Input.Password
                                    name="password"
                                    initialValue="Not set"
                                    fullWidth
                                    labelLeft="Password"
                                    onChange={handleChange}
                                    clearable
                                    bordered
                                    required
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
