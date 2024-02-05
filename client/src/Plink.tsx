import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { accentColor } from "./style";

type Params = {
    text: string;
    page: string;
};

export function Plink(params: Params) {
    const navigate = useNavigate();
    const [hover, setHover] = useState(false);
    return (
        <span
            onMouseEnter={() => {
                setHover(true);
            }}
            onMouseLeave={() => {
                setHover(false);
            }}
            style={{
                color: hover ? accentColor : "#fff",
                textDecoration: window.location.pathname == params.page ? "underline" : "none",
                cursor: "pointer"
            }}
            onClick={()=>{
                navigate(params.page);
            }}
        >
            {params.text}
        </span>
    );
}
