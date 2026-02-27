import { globby, convertPathToPattern } from "globby";
import { dirname, join } from "node:path";
import { join as posixJoin } from "node:path/posix";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import { readFile, writeFile } from "node:fs/promises";

const previewsDirectory = join(dirname(fileURLToPath(import.meta.url)), "..", "previews");
const search = posixJoin(convertPathToPattern(previewsDirectory), "**/*.html")
console.log("Searching", search)
const files = await globby(search);
console.log(`Rewriting ${files.length} files`)

try {
    for (const filePath of files) {
        const data = await readFile(filePath, { encoding: "utf8" });
        if (!data) continue;
        /** @type {JSDOM} */
        const dom = new JSDOM(data);
        dom.window.document.body.innerHTML = "<p>preview page intended for bots</p>";
        const queries = [
            "script",
            "style",
            `link[rel="stylesheet"]`,
            `link[rel="preconnect"]`,
            `link[title="RSS Feed"]`,
            `meta[property="og:image:url"]`,
            `meta[name="twitter:image"]`,
            `meta[name="twitter:card"]`,
        ]
        for (const query of queries) {
            const elements = dom.window.document.querySelectorAll(query);
            for (const element of elements) {
                element.remove();
            }
        }
        const ogImage = dom.window.document.querySelector(`meta[property="og:image"]`);
        if (ogImage && ogImage.getAttribute("content") === "https://blog.strawberryhome.org/static/og-image.png") {
            ogImage.setAttribute("content", "https://blog.strawberryhome.org/static/icon.png")
        }
        const content = dom.serialize();
        await writeFile(filePath, content, { encoding: "utf8" });
    };
} catch (error) {
    console.error(error);
}
