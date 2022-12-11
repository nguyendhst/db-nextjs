import executeQuery from "../../../services/db";

export default async function handler(req, res) {
    // get params from request
    // /list

    if (req.method !== "GET") {
        return res.status("405").json({ message: "Method not allowed" });
    }

    const { getid } = req.query;

    // default query
    let currentGetid = getid ? getid : 0;
    if (currentGetid !== 0) {
        if (isNaN(currentGetid) || currentGetid <= 0) {
            return res.status("400").json({ message: "Invalid id" });
        } 
        // return all student id of the center
        let students;
        let getStudentsQuery = (cen_id) => {
            const query = `SELECT \`student_id\` FROM \`Student\` WHERE \`center_id\` = ${cen_id};`;
            return query;
        };
        try {
            students = await executeQuery(getStudentsQuery(currentGetid));
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status("200").json({
            results: students,
        });
    }

    // get total students
    let totalStudents;
    try {
        totalStudents = await executeQuery(
            "SELECT COUNT(*) AS scount FROM `Student`;"
        );
        console.log(totalStudents);
    } catch (error) {
        console.log("[FETCH01]:", error);
        return res.status("500").json({ message: error.message });
    }

    // get students
    let students;
    let getStudentsQuery = () => {
        return `CALL \`getStudentsFullInfo\`();`;
    };
    try {
        students = await executeQuery(getStudentsQuery());
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    // return response
    res.status("200").json({
        results: students,
        totalStudents: totalStudents[0].scount,
    });
}
