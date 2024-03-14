import { Tag } from "./Tag";
import { headColor, headColorDark } from "./style";
import { speakerOptions, tags } from "./util";
import IconedButton from "./IconedButton";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

type Params = {
    tags: Array<string>;
    setTags: (newTAgs: Array<string>) => void;
};

export function Filter(params: Params) {
    return (
        <div
            style={{
                color: "#fff",
                padding: 20,
                borderRadius: 20,
                background: headColor,
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <b
                    style={{
                        marginBottom: 10,
                    }}
                >
                    Filter by tags
                </b>
                <IconedButton
                    icon={faFilter}
                    text={params.tags.length == 0 ? "Enable All" : "Disable All"}
                    action={() => {
                        if (params.tags.length == 0) {
                            params.setTags([...tags, ...speakerOptions]);
                        } else {
                            params.setTags([]);
                        }
                    }}
                />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                <br />
                {[...tags, ...speakerOptions].map((t) => (
                    <Tag
                        tag={t}
                        selected={params.tags}
                        key={t}
                        click={() => {
                            const index = params.tags.findIndex((a) => a == t);
                            if (index == -1) {
                                params.tags.push(t);
                            } else {
                                params.tags.splice(index, 1);
                            }
                            params.setTags([...params.tags]);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
