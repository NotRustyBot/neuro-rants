import { useState } from "react";
import { RantData } from "./App";
import { RantHead } from "./RantHead";
import { RantLine } from "./RantLine";
import { headColor, headColorDark } from "./style";
import IconedButton from "./IconedButton";
import { faCheck, faCropSimple, faCross, faCrosshairs, faPen, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import { Divider } from "./Divider";
import { origin, saveToken } from "./util";
import { useNavigate } from "react-router-dom";
import { Navigation } from "./Navigation";

type Params = {
    rant: RantData;
    approvable?: boolean;
    editable?: boolean;
};

export function Rant(params: Params) {
    const [hover, setHover] = useState(false);
    const [approved, setApproved] = useState(undefined as boolean | undefined);
    const navigate = useNavigate();
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
                        textShadow: "3px 3px 0px #ffffff33",
                    }}
                >
                    “
                </div>
                <div
                    style={{
                        position: "relative",
                    }}
                >
                    {rant.text.map((t) => (
                        <RantLine speaker={t.speaker} text={t.text} />
                    ))}
                </div>
                {params.approvable && approved == undefined && (
                    <div style={{ marginTop: 10 }}>
                        <Divider />
                        <div style={{ marginTop: 10, display: "flex" }}>
                            <IconedButton
                                text="Approve"
                                icon={faCheck}
                                baseColor="#226622"
                                color="#44aa44"
                                action={() => {
                                    fetch(origin() + "/approve", {
                                        method: "POST",
                                        body: JSON.stringify({ token: saveToken(), id: rant.id, allow: true }),
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                    }).then((r) => {
                                        setApproved(true);
                                    });
                                }}
                            />
                            <IconedButton
                                text="Deny"
                                icon={faTrash}
                                baseColor="#662222"
                                color="#aa4444"
                                action={() => {
                                    fetch(origin() + "/approve", {
                                        method: "POST",
                                        body: JSON.stringify({ token: saveToken(), id: rant.id, allow: false }),
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                    }).then((r) => {
                                        if (r.status == 200) {
                                            setApproved(false);
                                        } else {
                                            if (r.status == 401) alert("Authentication error");
                                        }
                                    });
                                }}
                            />
                        </div>
                    </div>
                )}
                {params.approvable && approved != undefined && (
                    <div
                        style={{
                            marginTop: 10,
                            color: approved ? "#669966" : "#996666",
                        }}
                    >
                        {approved ? "Approved" : "Denied"}
                    </div>
                )}
                {params.editable && (
                    <div style={{ marginTop: 10 }}>
                        <Divider />
                        <IconedButton text="Edit" icon={faPen} baseColor="#334499" color="#5588ff" action={() => {
                            navigate(`/edit?${rant.id}`)
                        }} />
                    </div>
                )}
            </div>
        </div>
    );
}
