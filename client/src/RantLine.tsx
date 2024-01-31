import { RantLineData } from "./App";
import { speakerColor } from "./util";

export function RantLine(params: RantLineData) {
    return (
        <div>
            <span
                style={{
                    marginRight: 5,
                    fontFamily: "monospace",
                }}
            >
                [<span
                style={{
                    fontWeight: "bold",
                    color: speakerColor(params.speaker)
                }}
                >{params.speaker}</span>
                ]:
            </span>
            <span>{params.text}</span>
        </div>
    );
}


