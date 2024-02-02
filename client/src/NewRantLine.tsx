import { useState } from "react";
import { headColor, headColorDark, inputStyle } from "./style";
import { speakerColor, speakerOptions } from "./util";
import IconedButton from "./IconedButton";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { RantLineData } from "./App";

type Params = {
    remove: () => void;
    update: (data: RantLineData) => void;
    rantLine: RantLineData;
};

export function NewRantLine(params: Params) {
    return (
        <div style={{ display: "flex", flexDirection: "column", background: headColorDark, borderRadius: 20, overflow: "hidden", boxShadow: "2px 2px 0px rgba(55, 155, 155, 0.3)" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 10,
                    background: headColor,
                }}
            >
                <input
                    placeholder="speaker"
                    type="text"
                    id="autocomplete"
                    list="options"
                    style={{ ...inputStyle, color: speakerColor(params.rantLine.speaker), fontWeight: "bold" }}
                    value={params.rantLine.speaker}
                    onChange={(v) => {
                        params.update({ ...params.rantLine, speaker: v.target.value });
                    }}
                />
                <IconedButton
                    action={() => {
                        params.remove();
                    }}
                    icon={faTrash}
                    text="Remove"
                    color="#993333"
                />
            </div>
            <div
                style={{
                    padding: 20,
                }}
            >
                <datalist id="options">
                    {speakerOptions.map((s) => (
                        <option value={s} />
                    ))}
                </datalist>
                <textarea
                    placeholder="Rant text"
                    style={{ ...inputStyle, resize: "none", width: "100%", minHeight: "4em", height: params.rantLine.text.split("\n").length * 1.25 + "em" }}
                    value={params.rantLine.text}
                    onChange={(v) => {
                        params.update({ ...params.rantLine, text: v.target.value });
                    }}
                />
            </div>
        </div>
    );
}
