import executeQuery from "../../../services/db";

export default async function handler(req, res) {
    // GET /api/schedule?id=[]

    if (req.method !== "GET") {
        return res.status("405").json({ message: "Method not allowed" });
    }

    const { id } = req.query;

    // default query
    let currentId = id ? id : null;

    const student_id_regex = new RegExp("^S[0-9]{5}$");

    if (currentId !== null) {
        // validate number
        if (!student_id_regex.test(currentId)) {
            return res.status("400").json({ message: "Invalid input" });
        }
        // return schedule info of the class
        let schedule;
        let query = (id) => {
            let query = `CALL \`getScheduleOfID\`('${id}');`;
            return query;
        };
        try {
            schedule = await executeQuery(query(currentId));
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status("200").json({
            results: schedule,
        });
    }
}
