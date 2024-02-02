import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { accentColor } from "./style";

type Params = {
    text?: string;
    action: () => void;
    icon?: IconProp;
    color?: string;
    baseColor?: string;
};

export default function IconedButton(params: Params) {
    const [hover, setHover] = useState(false);
    const clr = hover ? params.color ?? accentColor : params.baseColor ?? "#333333";
    return (
        <div
            style={{
                cursor: "pointer",
                background: "#000",
                margin: 3,
                color: clr,
                padding: 5,
                borderStyle: "solid",
                borderColor: clr,
                borderWidth: 2,
                flexGrow: 0,
                width: "max-content",
                paddingLeft: 8,
                paddingRight: 13,
            }}
            onMouseEnter={() => {
                setHover(true);
            }}
            onMouseLeave={() => {
                setHover(false);
            }}
            onClick={() => {
                params.action();
            }}
        >
            {params.icon && <FontAwesomeIcon icon={params.icon} color={clr} />}
            <span style={{ marginLeft: 5 }}>{params.text}</span>
        </div>
    );
}
