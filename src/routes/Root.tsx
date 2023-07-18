import { Outlet } from "react-router-dom";
import '@fontsource/roboto';
// import '@fontsource/pt_serif'

export default function Root() {

    return (
        <>
            <div className="container mx-auto max-w-sm h-screen flex items-center justify-center flex-col font-[Roboto] text-white">
                <div className="h-full  w-full bg-[url('/assets/bg.png')] bg-no-repeat bg-cover bg-center relative overflow-y-hidden">
                    <Outlet />
                </div>
            </div>
        </>
    )
}