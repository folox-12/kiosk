import { readFileSync } from "fs";
import { textDirectory } from "../assets.js";

export const getAboutText = async (
    path = `${textDirectory}/ensemble/about.txt`
) => {
    try {
        const readAboutFile = readFileSync(path, { flag: "r" });
        return { text: readAboutFile.toString() };
    } catch (err) {
        console.error(err);
    }
};
