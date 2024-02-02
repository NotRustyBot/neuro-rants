import { useState } from "react";
import { RantData } from "./App";
import { RantHead } from "./RantHead";
import { RantLine } from "./RantLine";
import { headColor, headColorDark } from "./style";

type Params = {
    rant: RantData;
    approvable?: boolean
};

export function Rant(params: Params) {
    const [hover, setHover] = useState(false);
    const rant = params.rant;
    return (
        <div
            style={{
                background: headColor,
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: hover ? "2px 2px 4px rgba(155, 255, 255, 0.5)" : "2px 2px 0px rgba(55, 155, 155, 0.3)",
                transition: "300ms",
            }}
            onMouseEnter={() => {
                setHover(true);
            }}
            onMouseLeave={() => {
                setHover(false);
            }}
        >
            <RantHead rant={rant} />
            <div
                style={{
                    background: headColorDark,
                    padding: 20,
                    fontSize: 18,
                    color: "#ffffff",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        fontSize: 120,
                        opacity: 1,
                        top: -20,
                        left: -5,
                        fontFamily: "Arial",
                        color: headColorDark,
                        textShadow: "3px 3px 0px #ffffff33"
                    }}
                >
                    “
                </div>
                <div
                style={{
                    position: "relative"
                }}
                >
                {rant.text.map((t) => (
                    <RantLine speaker={t.speaker} text={t.text} />
                ))}
                </div>
            </div>
        </div>
    );
}
