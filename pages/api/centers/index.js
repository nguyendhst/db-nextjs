import executeQuery from "../../../services/db";

export default async function handler(req, res) {
    // get params from request
    // /centers

    if (req.method !== "GET") {
        return res.status("405").json({ message: "Method not allowed" });
    }

    // get all centers
    let centers;
    let getCentersQuery = () => {
        return `CALL \`getCentersFullInfo\`();`;
    };
    try {
        centers = await executeQuery(getCentersQuery());
        console.log(centers)

        return res.status("200").json({
            results: centers,
        });
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    // 500
    return res.status("500").json({ message: "Internal server error" });
}
