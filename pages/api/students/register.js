import executeQuery from "../../../services/db";

const bcrypt = require("bcrypt");

export default async function handler(req, res) {
    // PORT /students/register

    if (req.method !== "POST") {
        return res.status("405").json({ message: "Method not allowed" });
    }

    // body
    // student_id: studentID,
    // student_fname: student.fname,
    // student_lname: student.lname,
    // student_email: student.email,
    // student_phone: student.phone,
    // dob: student.dob,
    // student_address: student.address,
    // username: student.username,
    // password: student.password,
    const {
        student_id,
        fname,
        lname,
        email,
        gender,
        phone,
        dob,
        address,
        username,
        password,
        center_id,
        course_id,
    } = req.body;

    // call procedure register student

    // CALL registerStudent('John', 'Doe', '1990-01-01', 'female', '123 Main St', '121566880', 'dsd@gmail.com', 'S10008', 1, 1, 'reeeeee22', 'dwdwd356778654', @pid);
    const query = (
        fname,
        lname,
        dob,
        gender,
        address,
        phone,
        email,
        student_id,
        center_id,
        course_id,
        username,
        password
    ) => {
        return `CALL registerStudent('${fname}', '${lname}', '${dob}', '${gender}', '${address}', '${phone}', '${email}', '${student_id}', ${center_id}, ${course_id}, '${username}', '${password}', \@pid);`;
    };
    try {
        const result = await executeQuery(
            query(
                fname,
                lname,
                dob,
                gender,
                address,
                phone,
                email,
                student_id,
                center_id,
                course_id,
                username,
                password
            )
        );

        console.log("result: ", result);

        res.status(200).json({ message: "Student registered successfully" });
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json({ message: "Error registering student" });
    }
}
