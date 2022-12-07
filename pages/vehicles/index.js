import {
    faChevronLeft,
    faChevronRight,
    faCircleInfo,
    faEdit,
    faFilter,
    faSearch,
    faSquarePlus,
    faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import VehiclesEdit from "../../components/VehiclesComponents/VehiclesEdit"
import VehiclesDetail from "../../components/VehiclesComponents/VehiclesDetail"

//fake Data
const createRandomVehicles = () => {
    return {
        id: "V" + Math.floor(Math.random() * 1000),
        licencePlate: Math.floor(Math.random() * 100) + "SA-" + Math.floor(Math.random() * 10000),
        status: Math.floor(Math.random() * 10) > 5 ? 0 : 1,
        dateAdded: new Date(),
        weight: 510000,
        capacity: "2 tons",
        fuelComsume: "1",
        type: "Collecting vehicle",
    };
};

const vehicles = Array(100)
    .fill(null)
    .map((item) => createRandomVehicles());

//main component
const Vehicles = () => {
    const [vehiclesData, setVehiclesData] = useState([]);
    const [records, setRecords] = useState([]);
    const [page, setPage] = useState({
        pageSize: 10,
        currentPage: 1,
    });

    // Get data from the first render
    useEffect(() => {
        setVehiclesData(vehicles);
    }, []);

    // When page change
    useEffect(() => {
        setRecords(vehiclesData.slice(startIndex - 1, endIndex - 1));
    }, [page]);

    // get vehicles by status
    const workingVehicles = vehiclesData.filter((item) => item.status === 0);
    const availVehicles = vehiclesData.filter((item) => item.status === 1);

    //Calulate number of page
    let numOfPages = Math.ceil(vehiclesData.length / page.pageSize);

    // Calculate index of records
    let startIndex = (page.currentPage - 1) * page.pageSize + 1;
    let endIndex =
        page.currentPage * page.pageSize > vehiclesData.length ? vehiclesData.length : page.currentPage * page.pageSize;

    // const handleStatusFilter = (lists) => {
    //     setVehiclesData(lists);
    // };

    const handleChangePage = (index) => {
        if (index === 0) {
            return;
        } else if (index > numOfPages) {
            return;
        } else {
            setPage({ ...page, currentPage: index });
        }
    };

    // Display Modal
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)

    return (
        <>
            {showEditModal && <VehiclesEdit setShowEditModal={setShowEditModal} />}
            {showDetailModal && <VehiclesDetail setShowDetailModal={setShowDetailModal} />}

            <div style={{ height: "100%" }}>
                <div className="p-3 border-bottom">
                    <h4 className="m-0">Quản lý vehicles</h4>
                </div>
                <div className="container my-4">
                    <div className="status-filter">
                        <button
                            className="btn btn-primary-outline text-white border rounded-0 rounded-top"
                        //onClick={() => setVehiclesData(allVehicles)}
                        >
                            All({vehicles.length})
                        </button>
                        <button
                            className="btn btn-primary-outline text-white border rounded-0 rounded-top"
                        //onClick={() => handleStatusFilter(availVehicles)}
                        >
                            Available({availVehicles.length})
                        </button>

                        <button
                            className="btn btn-primary-outline text-white border rounded-0 rounded-top"
                        //onClick={() => handleStatusFilter(workingVehicles)}
                        >
                            Working({workingVehicles.length})
                        </button>
                    </div>

                    <div className="p-4 border">
                        {/* Home filter */}
                        <div className="home-filter d-flex align-items-center border-bottom pb-3">
                            <div className="input-group w-25">
                                <div className="input-group-text">
                                    <FontAwesomeIcon icon={faSearch} />
                                </div>
                                <input type="text" className="form-control" placeholder="Search vehicles...." />
                            </div>
                            <button className="btn btn-primary-outline text-white border ms-2 text-nowrap">
                                <FontAwesomeIcon icon={faFilter} />
                                <span className="ms-2">Sort</span>
                            </button>
                            <button className="btn btn-primary ms-auto">
                                <FontAwesomeIcon icon={faSquarePlus} />
                                <span className="ms-2"> Add new vehicles</span>
                            </button>
                        </div>

                        {/* Table vehicles info */}
                        <table className="table table-dark text-center">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Licence Plate</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Date added</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(records.length > 0 ? records : vehicles.slice(startIndex, endIndex)).map(
                                    (item, index) => (
                                        <tr key={index}>
                                            <th>{item.id}</th>
                                            <td>{item.licencePlate}</td>
                                            <td>{item.status === 0 ? "Available" : "Working"}</td>
                                            <td>{item.dateAdded.toLocaleString()}</td>
                                            <td className="d-flex align-items-center justify-content-center">
                                                <button onClick={() => setShowEditModal(true)} className="btn btn-outline p-2">
                                                    <FontAwesomeIcon size="lg" className="text-warning" icon={faEdit} />
                                                </button>
                                                <div className="btn-btn-outline p-2">
                                                    <FontAwesomeIcon
                                                        size="lg"
                                                        className="text-danger mx-3"
                                                        icon={faTrashCan}
                                                    />
                                                </div>
                                                <button onClick={() => setShowDetailModal(true)} className="btn btn-outline p-2">
                                                    <FontAwesomeIcon size="lg" className="text-info" icon={faCircleInfo} />
                                                </button>
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div
                            className="pagination d-flex align-items-center py-4 border-top px-2"
                            style={{
                                position: "sticky",
                                bottom: 0,
                                boxShadow: "0px 0px 1px #fff",
                                backgroundColor: "#000",
                            }}
                        >
                            <span className="text-white">{`${startIndex} - ${endIndex} / ${vehiclesData.length}`}</span>
                            <div className="ms-auto me-3">
                                <span className="text-white">Records per page: </span>
                                <select
                                    className="px-3 rounded"
                                    style={{ appearance: "none" }}
                                    defaultValue={page.pageSize}
                                    onChange={(e) => {
                                        setPage({ ...page, pageSize: e.target.value, currentPage: 1 });
                                    }}
                                >
                                    <option>10</option>
                                    <option>15</option>
                                    <option>20</option>
                                    <option>50</option>
                                </select>
                            </div>
                            <div>
                                <button
                                    className="btn text-white border"
                                    onClick={() => handleChangePage(page.currentPage - 1)}
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                                {new Array(numOfPages).fill(0).map((item, index) => (
                                    <button
                                        className={`page-item btn text-white border mx-1 ${index + 1 === page.currentPage ? "btn-primary" : ""
                                            }`}
                                        key={index}
                                        onClick={() => {
                                            index + 1 !== page.currentPage && handleChangePage(index + 1);
                                        }}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    className="btn text-white border"
                                    onClick={() => handleChangePage(page.currentPage + 1)}
                                >
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Vehicles;
