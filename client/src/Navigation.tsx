import { useNavigate } from "react-router-dom";
import { accentColor, headColor } from "./style";
import { Plink } from "./Plink";
import { useEffect, useState } from "react";
import { origin, saveToken } from "./util";
import IconedButton from "./IconedButton";
import { faArrowRight, faLock } from "@fortawesome/free-solid-svg-icons";
import { updateAuthToken, useAuthContext } from "./AuthContext";

export function Navigation() {
    const [moderator, setModerator] = useState(undefined as undefined | boolean);
    const [nick, setNick] = useState(undefined as undefined | string);
    const { authToken } = useAuthContext();
    useEffect(() => {
        fetch(origin() + "/nick", {
            method: "POST",
            body: JSON.stringify({ token: saveToken() }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((r) =>
            r.json().then((d: { nick: string }) => {
                setNick(d.nick);
            })
        );
    }, [authToken]);
    useEffect(() => {
        fetch(origin() + "/moderator", {
            method: "POST",
            body: JSON.stringify({ token: saveToken() }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((r) =>
            r.json().then((d: { moderator: boolean }) => {
                setModerator(d.moderator);
            })
        );
    }, []);
    return (
        <div style={{ background: "#000", display: "flex" }}>
            <div
                style={{
                    maxWidth: 1000,
                    margin: "auto",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "90%",
                }}
            >
                <div style={{ color: accentColor, padding: 5, display: "flex" }}>
                    <h1
                        style={{
                            background: headColor,
                            padding: 2,
                            margin: 0,
                        }}
                    >
                        <Plink page="/" text="Neuro-rants" />
                    </h1>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: 10,
                            gap: 10,
                        }}
                    >
                        <Plink page="/new" text="publish" />
                    </div>
                    {moderator && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: 10,
                                gap: 10,
                            }}
                        >
                            <Plink page="/approve" text="approve" />
                        </div>
                    )}
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                    }}
                >
                    {nick ? (
                        <>
                            <span
                                style={{
                                    color: "#fff",
                                }}
                            >
                                Logged in as{" "}
                                <span
                                    style={{
                                        color: accentColor,
                                    }}
                                >
                                    {nick}
                                </span>
                            </span>
                            <IconedButton
                                baseColor="#662222"
                                color="#aa4444"
                                action={() => {
                                    updateAuthToken(undefined);
                                    window.location.href = "/";
                                }}
                                text="Log out"
                                icon={faArrowRight}
                            />
                        </>
                    ) : (
                        <IconedButton
                            baseColor="#226622"
                            color="#44aa44"
                            action={() => {
                                window.location.href = "/login";
                            }}
                            text="Log in"
                            icon={faLock}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
