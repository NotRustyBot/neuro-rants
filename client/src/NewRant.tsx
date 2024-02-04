import { useEffect, useState } from "react";
import "./App.css";
import { Rant } from "./Rant";
import { NewRantLine } from "./NewRantLine";
import { inputStyle, pageBg } from "./style";
import { RantData } from "./App";
import { disclaimerTexts, origin, saveToken, speakerOptions } from "./util";
import IconedButton from "./IconedButton";
import { faCheck, faLock, faPlus, faRepublican, faUpload } from "@fortawesome/free-solid-svg-icons";
import { Divider } from "./Divider";
import { useAuthContext } from "./AuthContext";

function NewRant() {
    const [newRant, setNewRant] = useState({ date: 0, tags: [], text: [{ speaker: speakerOptions[0], text: "" }], author: "", id: undefined } as RantData);
    const { authToken, updateAuthToken } = useAuthContext();
    const post = () => {
        const unauth = () => {
            window.open("/login");
            const interval = setInterval(() => {
                const newToken = saveToken();
                if (newToken) {
                    updateAuthToken(newToken);
                    clearInterval(interval);
                }
            }, 500);
        };
        if (authToken) {
            fetch(origin() + "/new", {
                method: "POST",
                body: JSON.stringify({ ...newRant, author: authToken }),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((r) => {
                if (r.status == 401) {
                    updateAuthToken(undefined);
                    unauth();
                } else {
                    window.location.href = "/";
                }
            });
        } else {
            unauth();
        }
    };
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
                    display: "flex",
                    gap: 10,
                    padding: 10,
                    flexDirection: "column",
                }}
            >
                {newRant.text.map((rant, index) => (
                    <NewRantLine
                        rantLine={rant}
                        update={(d) => {
                            newRant.text[index] = d;
                            setNewRant({ ...newRant });
                        }}
                        remove={() => {
                            newRant.text.splice(index, 1);
                            setNewRant({ ...newRant });
                        }}
                    />
                ))}
                <IconedButton
                    action={() => {
                        newRant.text.push({ speaker: speakerOptions[0], text: "" });
                        setNewRant({ ...newRant });
                    }}
                    text="Add speaker"
                    icon={faPlus}
                    color="#449966"
                />
                <Divider />
                <p style={{ color: "#fff" }}>
                    {disclaimerTexts.map((t) => (
                        <>
                            <span>{t}</span>
                            <br />
                        </>
                    ))}
                </p>
                <IconedButton action={post} text={authToken ? "Publish" : "Authenticate"} icon={authToken ? faCheck : faLock} color="#669999" baseColor="#224444" />
            </div>
        </div>
    );
}

export default NewRant;
