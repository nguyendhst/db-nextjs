import executeQuery from "../../../services/db";

export default async function handler(req, res) {
    // get params from request
    // /courses?programmes=[boolean]
    // /courses?center=[]&programme=[]

    if (req.method !== "GET") {
        return res.status("405").json({ message: "Method not allowed" });
    }

    const { center, programmes, programme } = req.query;

    // default query
    let currentProgrammes = programmes ? programmes : null;
    let currentCenter = center ? center : null;
    let currentProgramme = programme ? programme : null;
    if (currentProgrammes == "all") {
        // return programmes info
        let programmes;
        let query = `CALL \`getProgrammesFullInfo\`();`;
        try {
            programmes = await executeQuery(query);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status("200").json({
            results: programmes,
        });
    } else if (currentCenter !== null && currentProgramme !== null) {
        // return courses info of the center
        let courses;
        let query = (cen, pro) => {
            let query = `CALL \`getProgrammeCourses\`(${pro}, ${cen});`;
            return query;
        };
        try {
            courses = await executeQuery(
                query(currentCenter, currentProgramme)
            );
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status("200").json({
            results: courses,
        });
    }

    // 500
    return res.status("500").json({ message: "Internal server error" });
}
