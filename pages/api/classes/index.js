import executeQuery from "../../../services/db";

export default async function handler(req, res) {
    // get params from request
    // /classes?center=[]&course=[]

    if (req.method !== "GET") {
        return res.status("405").json({ message: "Method not allowed" });
    }

    const { center, course } = req.query;

    // default query
    let currentCenter = center ? center : null;
    let currentCourse = course ? course : null;

    if (currentCenter !== null && currentCourse !== null) {
        // validate number
        if (isNaN(currentCenter) || isNaN(currentCourse)) {
            return res.status("400").json({ message: "Invalid input" });
        }
        // return classes info of the center
        let classes;
        let query = (cen, cou) => {
            let query = `CALL \`getCourseClasses\`(${cou}, ${cen});`;
            return query;
        };
        try {
            classes = await executeQuery(query(currentCenter, currentCourse));
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status("200").json({
            results: classes,
        });
    }

    // 500
    return res.status("500").json({ message: "Internal server error" });
}
