import fs from "fs";
import path from "path";

function walk(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== "node_modules") {
            walk(full, files);
        } else if (entry.isFile() && /\.tsx?$/.test(entry.name)) {
            files.push(full);
        }
    }
    return files;
}

const replacements = [
    ['<Card shadow="sm">', '<Card className="border border-default-200/70 shadow-soft">'],
    ['shadow="sm"\n                                className={`border', 'className={`border shadow-soft'],
    ['shadow="sm"\n                            className={`border', 'className={`border shadow-soft'],
    ['shadow="sm"\n                    className={`border', 'className={`border shadow-soft'],
    ['shadow="sm"\n                className={`border', 'className={`border shadow-soft'],
    ['shadow="sm"\n            className={`border', 'className={`border shadow-soft'],
    ['shadow="sm"\n            shadow="sm"', 'className="shadow-soft"'],
    [
        'shadow="sm" className="border border-primary/20 overflow-hidden"',
        'className="border border-primary/20 shadow-soft overflow-hidden"',
    ],
    [
        'shadow="sm" className="border border-success/30 overflow-hidden"',
        'className="border border-success/30 shadow-soft overflow-hidden"',
    ],
    [
        'shadow="sm" className="border border-warning/30"',
        'className="border border-warning/30 shadow-soft"',
    ],
    [
        'shadow="sm" className="border border-primary/30"',
        'className="border border-primary/30 shadow-soft"',
    ],
    [
        'shadow="sm" className="border border-success/30 overflow-hidden"',
        'className="border border-success/30 shadow-soft overflow-hidden"',
    ],
    [
        'className="border border-danger/30 bg-danger/10" shadow="sm"',
        'className="border border-danger/30 bg-danger/10 shadow-soft"',
    ],
    [
        'className="border border-warning/30 bg-warning/10" shadow="sm"',
        'className="border border-warning/30 bg-warning/10 shadow-soft"',
    ],
    [
        'rounded-3xl border border-default-200 bg-content1',
        'rounded-4xl border border-default-200/70 bg-content1 shadow-soft',
    ],
    [
        'rounded-3xl border border-default-200 bg-default-100',
        'rounded-4xl border border-default-200/70 bg-default-100 shadow-soft',
    ],
    ['shadow="sm"', 'className="shadow-soft"'],
];

const srcDir = path.join(process.cwd(), "src");
let changed = 0;

for (const file of walk(srcDir)) {
    let content = fs.readFileSync(file, "utf8");
    const original = content;

    for (const [from, to] of replacements) {
        content = content.split(from).join(to);
    }

    if (content !== original) {
        fs.writeFileSync(file, content);
        changed++;
        console.log("updated:", path.relative(process.cwd(), file));
    }
}

console.log("Total files updated:", changed);
