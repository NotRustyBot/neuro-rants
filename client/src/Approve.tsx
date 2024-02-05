import { useEffect, useState } from "react";
import "./App.css";
import { Rant } from "./Rant";
import { headColor, pageBg } from "./style";
import { origin, saveToken } from "./util";
import { RantData } from "./App";

export type RantLineData = {
    speaker: string;
    text: string;
};

function Approve() {
    const [rants, setRants] = useState([] as Array<RantData>);
    const [moderator, setModerator] = useState(undefined as undefined | boolean);

    useEffect(() => {
        fetch(origin() + "/moderator", {
            method: "POST",
            body: JSON.stringify({ token: saveToken() }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((r) =>
            r.json().then((d: { moderator: boolean }) => {
                console.log(d);
                setModerator(d.moderator);
                if (!d.moderator) window.location.href = "/";
            })
        );
    }, []);

    useEffect(() => {
        fetch(origin() + "/pending.json").then((r) =>
            r.json().then((d: Array<RantData>) => {
                setRants(d);
                console.log(`got ${d.length} rants`);
            })
        );
    }, []);

    return (
        <div
            style={{
                backgroundColor: pageBg,
                width: "100vw",
                minHeight: "100vh",
            }}
        >
            {moderator && (
                <div
                    style={{
                        maxWidth: 600,
                        marginRight: "auto",
                        marginLeft: "auto",
                        gap: 30,
                        display: "flex",
                        padding: 10,
                        flexDirection: "column",
                    }}
                >
                    <span
                        style={{
                            color: "#ffffff",
                            padding: 5,
                            background: headColor
                        }}
                    >
                        {rants.length} rants to be approved
                    </span>
                    {rants.map((r) => (
                        <Rant rant={r} approvable={true} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Approve;
