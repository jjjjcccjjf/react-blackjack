import { Outlet } from "react-router-dom";

export default function Root() {
    return (
        <>
            <div className="container bg-red-300 mx-auto max-w-sm h-screen p-4 flex items-center justify-center flex-col">
                <div className="pb-4 flex flex-col items-end w-full">
                    <button className="rounded-full h-10 w-10 bg-gray-600">?</button>
                </div>
                <div className="h-full bg-orange-500 w-full">
                    <Outlet />

                </div>
            </div>
        </>
    )
}