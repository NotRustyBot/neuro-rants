export function YYMMDD(date: Date) {
    const year = date.getFullYear().toString().slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

const colors: Record<string, string> = {
    vedal: "rgb(50, 185, 69)",
    neuro: "#FFC0CB",
    evil: "#ff3333",
};

export function speakerColor(speaker: string) {
    return colors[speaker.toLowerCase()] ?? "#999999";
}


export function tagColor(tag: string) {
    return colors[tag.toLowerCase()] ?? "#ffffff";
}
