import { useState, useEffect } from "react";
import Link from "next/link";

const NavSelection = (props) => {
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        if (!props.currentPath || !props.label) return;
        if (props.label.toLowerCase().includes(props.currentPath)) setSelected(true);
        else setSelected(false);
    }, [props.currentPath]);

    return (
        <div className={`navSelContainer ${selected ? "selected" : ""}`}>
            {props.label}
            <style jsx>{`
                .navSelContainer {
                    position: relative;
                    width: 100%;
                    padding: 20px 30px;

                    border-radius: 100px;
                    z-index: 1;

                    font-weight: 500;
                    transition: ease-in-out 100ms 100ms;

                    color: #edf0f5;
                }

                .navSelContainer:hover {
                    color: #2d3039;
                    font-weight: 700;
                }

                .navSelContainer:before {
                    content: "";

                    position: absolute;
                    inset: 0 0 0 0;
                    margin: 0 auto;

                    width: 50%;
                    height: 100%;

                    opacity: 0;

                    background-color: #edf0f5;
                    border-radius: 100px;

                    transition: ease-in-out 200ms;

                    z-index: -1;
                }

                .navSelContainer:hover:before {
                    width: 100%;
                    opacity: 1;
                }

                .selected {
                    background-color: #edf0f5;
                    color: #2d3039;
                    font-weight: 700;
                }
            `}</style>
        </div>
    );
};

const Sidebar = (props) => {
    return (
        <div className="sideBarContainer">
            <div className="navContainer">
                {props.auth.status ? (
                    <>
                        <Link href="/employees" style={{ width: "100%" }}>
                            <NavSelection label="Employee Management" currentPath={props.currentPath} />
                        </Link>
                        <Link href="/students" style={{ width: "100%" }}>
                            <NavSelection label="Student Management" currentPath={props.currentPath} />
                        </Link>
                        <Link href="/settings" style={{ width: "100%" }}>
                            <NavSelection label="Account Settings" currentPath={props.currentPath} />
                        </Link>
                    </>
                ) : (
                    <Link href="/login" style={{ width: "100%" }}>
                        <NavSelection label="Login" currentPath={props.currentPath} />
                    </Link>
                )}
            </div>
            <style jsx>
                {`
                    .sideBarContainer {
                        position: absolute;
                        left: 0;

                        width: 300px;
                        height: 100%;

                        padding: 10px;

                        background-color: #2d3039;

                        display: flex;
                    }

                    .navContainer {
                        width: 100%;

                        display: flex;
                        flex-wrap: wrap;
                        align-content: flex-start;
                        gap: 5px;
                    }
                `}
            </style>
        </div>
    );
};

export default Sidebar;
