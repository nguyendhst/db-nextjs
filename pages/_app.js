// import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Sidebar from "../components/Sidebar";
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'fontawesome-4.7/css/font-awesome.min.css';
import "../styles/globals.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";

import { NextUIProvider } from '@nextui-org/react';

const auth = {
    status: true,
};

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [path, setPath] = useState(null);

    useEffect(() => {
        if (!router.isReady) return;
        setPath(router.asPath.slice(1).split("/")[0]);

        if (!auth.status) {
            router.push("/login");
            return;
        }

        if (router.asPath === "/" ) {
            router.push("/employees");
        }
    }, [router.asPath]);

    return (
        <NextUIProvider>
            <Sidebar currentPath={path} auth={auth} />
            <div className="AppContainer">
                <Component {...pageProps} />
            </div>
        </NextUIProvider>
    );
}

export default MyApp;
