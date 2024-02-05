import { RantData } from "./App";
import { Tag } from "./Tag";
import { accentColor } from "./style";
import { YYYYMMDD } from "./util";

type Params = {
    rant: RantData;
};

export function RantHead(params: Params) {
    const rant = params.rant;
    const dateString = YYYYMMDD(new Date(rant.date));
    return (
        <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: 20,
                }}
            >
                <span
                    style={{
                        color: "#ffffff",
                        padding: 3,
                        background: "#222222",
                        borderRadius: 3,
                    }}
                >
                    {dateString}
                </span>
                <span
                    style={{
                        color: "#ffffff",
                        padding: 3,
                        background: "#222222",
                        borderRadius: 3,
                        marginLeft: 20
    
                    }}
                >
                    by {rant.author}
                </span>
                <div
                    style={{
                        display: "flex",
                        marginLeft: 10,
                        gap: 10,
                        justifyContent: "end",
                        flexGrow: 1,
                    }}
                >
                    {rant.tags.map((t) => (
                        <Tag tag={t} />
                    ))}
                </div>
            </div>
    );
}
