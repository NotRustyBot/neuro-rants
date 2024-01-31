import { tagColor } from "./util";

export function Tag(params: { tag: string }) {
    return (
        <div
            style={{
                padding: 2,
                paddingLeft: 5,
                paddingRight: 5,
                margin: 2,
                background: "#222222",
                borderLeftWidth: 5,
                borderLeftColor: tagColor(params.tag),
                borderLeftStyle: "solid",
                color: tagColor(params.tag)
            }}
        >
            {params.tag}
        </div>
    );
}
