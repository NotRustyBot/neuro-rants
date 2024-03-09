import { tagColor } from "./util";

export function Tag(params: { tag: string; selected?: Array<string>; click?: () => void }) {
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
                color: tagColor(params.tag),
                opacity: params.selected && !params.selected.includes(params.tag) ? 0.5 : 1,
                cursor: params.click ? "pointer" : "default",
                flexShrink: 0
            }}
            onClick={params.click}
        >
            {params.tag}
        </div>
    );
}
