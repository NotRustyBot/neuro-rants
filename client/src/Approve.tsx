import { useEffect, useState } from "react";
import "./App.css";
import { Rant } from "./Rant";
import { pageBg } from "./style";
import { saveToken } from "./util";

export type RantData = {
    date: number;
    text: Array<RantLineData>;
    tags: Array<string>;
    author: string;
};

export type RantLineData = {
    speaker: string;
    text: string;
};

function Approve() {
    const [rants, setRants] = useState([] as Array<RantData>);
    const [moderator, setModerator] = useState(undefined as undefined | boolean);

    useEffect(() => {
        fetch(window.location.origin + "/moderator", {
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
        fetch(window.location.origin + "/pending.json").then((r) =>
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
                    {rants.map((r) => (
                        <Rant rant={r} approvable={true} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Approve;
