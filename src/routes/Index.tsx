import Button from "../components/Button";
import { Link } from "react-router-dom";
import dealerImg from '../../src/assets/dealer.png'
import '@fontsource/pt-serif';

export default function Index() {

    return (
        <>
            <div className="flex flex-col justify-center gap-12 h-full items-start bg-[url('/assets/bg.png')] bg-no-repeat bg-cover bg-center ">
                {/* <Splash></Splash> */}
                <div className="flex flex-row items-center gap-2 justify-center place-self-center w-full pr-6 bg-gradient-to-t from-transparent via-[#12192c]/80 to-transparent h-96 floaty mb-72">
                    <div className="text-right w-2/3 font-[PT-Serif]">
                        <h1 className="text-[3.4rem] leading-[0.80]">React Blackjack</h1>
                        <p className="text-xs pl-1 pt-3 font-[Roboto]">made with ❤️ by endan</p>
                    </div>
                    <div className=" w-[112px] flex justify-center items-center">
                        <img src={dealerImg} />
                    </div>
                </div>

            </div>

            {/* absolute */}
            <div className="absolute bottom-0 left-0 ">
                <div className="h-20 bg-gradient-to-t to-transparent from-[#12192c]"></div>
                <div className="flex flex-col gap-4 justify-center items-center w-full p-6 bg-[#12192c]">
                    <div className=" flex flex-col gap-2 items-center w-full justify-center">
                        <p className="">Challenge the dealer and test your luck in this exciting game of blackjack. Aim for the highest win streak and see if you can come out on top!</p>
                        <Link to="game">
                            <Button className="w-48">PLAY</Button>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2 justify-center items-center w-full border-t border-t-white/25 pt-4 text-white/50">

                        <p className="text-xs">Disclaimer: This blackjack web app is purely for entertainment purposes and does not involve real money or gambling. It serves as a technical demonstration and skill showcase for my portfolio. Have fun!</p>
                        {/* exploring and experiencing the functionalities */}
                        <p className="text-xs" >🚀 powered by <a href="https://deckofcardsapi.com" className="underline">deckofcardsapi.com</a></p>
                    </div>
                </div>
            </div>

        </>
    )
}