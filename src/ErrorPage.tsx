import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <>
            <h1>Error 404</h1>
            <p>This page does not exist.</p>
        </>
    )
}