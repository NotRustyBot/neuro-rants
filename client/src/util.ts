import { updateAuthToken } from "./AuthContext";

export function YYYYMMDD(date: Date) {
        
    const year = date.getFullYear().toString();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

type Details = {
    speakers: Array<Speaker>;
    disclaimer: Array<string>;
    tags: Array<string>;
};

type Speaker = {
    name: string;
    color: string;
};

let speakers = new Map<string, Speaker>();
export let speakerOptions = new Array<string>();

export let disclaimerTexts = new Array<string>();
export let tags = new Array<string>();

export async function loadDetails() {
    const r = await fetch(origin() + "/details.json");
    const data: Details = await r.json();
    for (const speaker of data.speakers) {
        speakers.set(speaker.name.toLowerCase(), speaker);
        speakerOptions.push(speaker.name);
    }
    disclaimerTexts = data.disclaimer;
    tags = data.tags;
    console.log(data);
}

export function speakerColor(speaker: string) {
    return speakers.get(speaker.toLowerCase())?.color ?? "#999999";
}

export function tagColor(tag: string) {
    return speakers.get(tag.toLowerCase())?.color ?? "#ffffff";
}

export function saveToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const codeValue = urlParams.get("code");
    if (codeValue) {
        window.localStorage.setItem("ds-token", codeValue);
        updateAuthToken(codeValue);
    }

    return window.localStorage.getItem("ds-token");
}

export function allTags() {
    return tags;
}

export function origin() {
    const location = window.location.origin;
    return location;
}
