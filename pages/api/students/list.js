import executeQuery from "../../../services/db";

export default async function handler(req, res) {
    // get params from request
    // list?page=1&limit=10

    if (req.method !== "GET") {
        return res.status("405").json({ message: "Method not allowed" });
    }
    const { page, limit } = req.query;
    console.log("page: " + page);
    console.log("limit: " + limit);

    // set default values
    const currentPage = page || 1;
    const currentLimit = limit || 10;

    // calculate offset
    const offset = (currentPage - 1) * currentLimit;

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

    // get total pages
    const totalPages = Math.ceil(totalStudents[0].scount / currentLimit);

    // get students
    let students;
    let getStudentsQuery = (lim, off) => {
        return `CALL \`getStudentsFullInfo\`(${lim},${off});`;
    };
    try {
        students = await executeQuery(getStudentsQuery(currentLimit, offset));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    // return response
    res.status("200").json({
        results: students,
        totalPages,
        totalStudents: totalStudents[0].scount,
    });
}
