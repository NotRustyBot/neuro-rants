import { useEffect, useState } from "react";
import "./App.css";
import { NewRantLine } from "./NewRantLine";
import { inputStyle, pageBg } from "./style";
import { RantData } from "./App";
import { YYYYMMDD, allTags, disclaimerTexts, origin, saveToken, speakerOptions } from "./util";
import IconedButton from "./IconedButton";
import { faCheck, faLock, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Divider } from "./Divider";
import { useAuthContext } from "./AuthContext";
import { Tag } from "./Tag";

type Params = {
    edit: boolean;
};

function NewRant(params: Params) {
    const [newRant, setNewRant] = useState({ date: Date.now(), tags: [], text: [{ speaker: "", text: "" }], author: "", id: undefined } as RantData);

    useEffect(() => {
        console.log("yes");
        if (params.edit) {
            fetch(origin() + "/data.json").then((r) =>
                r.json().then((d: Array<RantData>) => {
                    const id = window.location.search.replace("?","");
                    console.log(id);
                    const found = d.find((a) => a.id == id);
                    if (found) setNewRant(found);
                })
            );
        }
    }, [params.edit, window.location.search]);

    const { authToken, updateAuthToken } = useAuthContext();
    const post = () => {
        const rantToSend = { ...newRant };
        rantToSend.tags = rantToSend.tags.concat(rantToSend.text.map((l) => l.speaker));
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
            if (params.edit) {
                fetch(origin() + "/modify", {
                    method: "POST",
                    body: JSON.stringify({ ...rantToSend, moderator: authToken }),
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
                fetch(origin() + "/new", {
                    method: "POST",
                    body: JSON.stringify({ ...rantToSend, author: authToken }),
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
            }
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
                <div style={{ display: "flex", color: "#fff", gap: 5 }}>
                    date
                    <input
                        value={YYYYMMDD(new Date(newRant.date))}
                        onChange={(v) => {
                            newRant.date = new Date(v.target.value).valueOf();
                            setNewRant({ ...newRant });
                        }}
                        style={{ ...inputStyle, colorScheme: "dark" }}
                        type="date"
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                    }}
                >
                    {allTags().map((t) => (
                        <Tag
                            tag={t}
                            key={t}
                            selected={newRant.tags}
                            click={() => {
                                const index = newRant.tags.findIndex((a) => a == t);
                                if (index == -1) {
                                    newRant.tags.push(t);
                                } else {
                                    newRant.tags.splice(index, 1);
                                }
                                setNewRant({ ...newRant });
                            }}
                        />
                    ))}
                </div>
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
