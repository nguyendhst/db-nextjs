import {
    faChevronLeft,
    faChevronRight,
    faCircleInfo,
    faEdit,
    faFilter,
    faSearch,
    faSquarePlus,
    faTrashCan,
    faXmark,
    faUserGroup,
    faPlugCircleBolt,
    faPlusCircle,
    faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useState } from "react";
import {
    Table,
    Badge,
    Text,
    Pagination,
    Button,
    Grid,
    Container,
    useAsyncList,
    useCollator,
} from "@nextui-org/react";

import axios from "axios";

const scheduleAPI = "http://localhost:3000/api/schedule";

const col = [
    {
        uid: "class_name",
        label: "Class Name",
    },
    {
        uid: "class_id",
        label: "Class ID",
    },
    {
        uid: "schedule_id",
        label: "Schedule ID",
    },
    {
        uid: "room_id",
        label: "Room ID",
    },
    {
        uid: "start_time",
        label: "Start Time",
    },
    {
        uid: "end_time",
        label: "End time",
    },
];

const getEndTime = (str, p) => {
    const s = str.split(":");
    const per = p * 45;
    const end = new Date();
    end.setHours(s[0]);
    end.setMinutes(s[1]);
    end.setSeconds(0);
    end.setMilliseconds(0);
    end.setMinutes(end.getMinutes() + per);
    return end.toLocaleTimeString();
};

const toLocaleTimeString = (str) => {
    const s = str.split(":");
    const d = new Date();
    d.setHours(s[0]);
    d.setMinutes(s[1]);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d.toLocaleTimeString();
};


function ScheduleTable() {
    const [id, setId] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // get id from url
        const url = window.location.href;
        const id = url.substring(url.lastIndexOf("/") + 1).toUpperCase();
        setId(id);

        const fetchData = async () => {
            try {
                const result = await axios.get(scheduleAPI + "?id=" + id);
                console.log(result.data.results[0]);
                setData(result.data.results[0]);
            } catch (error) {
                setError(error);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <Container>
            <Grid.Container gap={2} justify="flex-start">
                <Grid xs={12} md={8}>
                    <Text h2 color="primary">
                        Schedule Table
                    </Text>
                </Grid>
                <Grid xs={12} md={12}>
                    <Text h4 color="secondary">
                        Student ID: {id}
                    </Text>
                </Grid>
            </Grid.Container>
            {/* Table */}
            <Table
                css={{
                    height: "auto",
                    width: "100%",
                }}
                selectionMode="single"
                bordered
                shadow={false}
            >
                <Table.Header columns={col}>
                    {(column) => (
                        <Table.Column key={column.uid}>
                            {column.label}
                        </Table.Column>
                    )}
                </Table.Header>
                <Table.Body items={data}>
                    {(item) => (
                        <Table.Row key={item.schedule_id}>
                            <Table.Cell>{item.class_name}</Table.Cell>
                            <Table.Cell>{item.class_id}</Table.Cell>
                            <Table.Cell>{item.schedule_id}</Table.Cell>
                            <Table.Cell>{item.room_id}</Table.Cell>
                            <Table.Cell>{toLocaleTimeString(item.start_time)}</Table.Cell>
                            <Table.Cell>
                                {getEndTime(item.start_time, item.period)}
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </Container>
    );
}

export default ScheduleTable;
