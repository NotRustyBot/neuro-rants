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
                padding: 20,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <span
                    style={{
                        color: "#ffffff",
                        background: "#222222",
                        padding: 3,
                        borderRadius: 3,
                    }}
                >
                    {dateString}
                </span>
                <span
                    style={{
                        color: "#ffffff",
                        background: "#222222",
                        padding: 3,
                        borderRadius: 3,
                        marginLeft: 20,
                    }}
                >
                    by {rant.author}
                </span>
            </div>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: 10,
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
