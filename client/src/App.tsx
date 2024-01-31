import { useEffect, useState } from "react";
import "./App.css";
import { Rant } from "./Rant";

export type RantData = {
    date: number;
    text: Array<RantLineData>;
    tags: Array<string>;
};

export type RantLineData = {
    speaker: string;
    text: string;
};

function App() {
    const [rants, setRants] = useState([] as Array<RantData>);

    useEffect(() => {
        fetch(window.location.origin + "/data.json").then((r) =>
            r.json().then((d: Array<RantData>) => {
                setRants(d);
                console.log(`got ${d.length} rants`);
            })
        );
    }, []);

    return (
        <div
            style={{
                backgroundColor: "#111111",
                width: "100vw",
                minHeight: "100vh",
            }}
        >
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
                    <Rant rant={r} />
                ))}
            </div>
        </div>
    );
}

export default App;
