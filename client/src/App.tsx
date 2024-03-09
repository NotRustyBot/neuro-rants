import { useEffect, useState } from "react";
import "./App.css";
import { Rant } from "./Rant";
import { pageBg } from "./style";
import { origin, saveToken } from "./util";
import { useAuthContext } from "./AuthContext";

export type RantData = {
    date: number;
    text: Array<RantLineData>;
    tags: Array<string>;
    author: string;
    id: string | undefined;
};

export type RantLineData = {
    speaker: string;
    text: string;
};

function App() {
    const [rants, setRants] = useState([] as Array<RantData>);
    const { moderator } = useAuthContext();

    useEffect(() => {
        fetch(origin() + "/data.json").then((r) =>
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
                    <Rant rant={r} editable={moderator} />
                ))}
            </div>
        </div>
    );
}

export default App;
