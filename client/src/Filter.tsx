import { Tag } from "./Tag";
import { headColor, headColorDark } from "./style";
import { speakerOptions, tags } from "./util";

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
            <b style={{
                marginBottom: 10
            }}>Filter by tags</b>
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
