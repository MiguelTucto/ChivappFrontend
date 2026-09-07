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
    [
        'shadow="sm" className="border border-default-200"',
        'className="border border-default-200/70 shadow-soft"',
    ],
    [
        'shadow="sm" className="border border-default-200 overflow-hidden"',
        'className="border border-default-200/70 shadow-soft overflow-hidden"',
    ],
    [
        'shadow="sm" className="border border-secondary/30 overflow-hidden"',
        'className="border border-secondary/30 shadow-soft overflow-hidden"',
    ],
    [
        'shadow="sm" className="border border-danger/30 bg-danger/5"',
        'className="border border-danger/30 bg-danger/5 shadow-soft"',
    ],
    [
        'shadow="sm" className="border border-primary/20 bg-primary/5"',
        'className="border border-primary/20 bg-primary/5 shadow-soft"',
    ],
    [
        'shadow="sm" className="border border-warning/30 bg-warning/5"',
        'className="border border-warning/30 bg-warning/5 shadow-soft"',
    ],
    [
        'rounded-3xl border border-default-200 bg-gradient-to-br from-primary/15 via-content1 to-content1 px-6 py-6',
        'rounded-4xl border border-default-200/70 bg-gradient-to-br from-primary/15 via-content1 to-content1 px-6 py-6 shadow-soft overflow-hidden relative',
    ],
    [
        'rounded-3xl border border-default-200 bg-gradient-to-br from-secondary/15 via-content1 to-content1 px-6 py-6',
        'rounded-4xl border border-default-200/70 bg-gradient-to-br from-secondary/15 via-content1 to-content1 px-6 py-6 shadow-soft overflow-hidden relative',
    ],
    [
        'h-28 rounded-3xl bg-default-100 animate-pulse',
        'h-28 rounded-4xl bg-content1/60 border border-default-200/70 animate-pulse',
    ],
    [
        'h-64 rounded-3xl bg-default-100 animate-pulse',
        'h-64 rounded-4xl bg-content1/60 border border-default-200/70 animate-pulse',
    ],
    [
        'h-32 rounded-3xl bg-default-100 animate-pulse',
        'h-32 rounded-4xl bg-content1/60 border border-default-200/70 animate-pulse',
    ],
    [
        'h-48 rounded-3xl bg-default-100 animate-pulse',
        'h-48 rounded-4xl bg-content1/60 border border-default-200/70 animate-pulse',
    ],
    [
        'h-72 rounded-3xl bg-default-100 animate-pulse',
        'h-72 rounded-4xl bg-content1/60 border border-default-200/70 animate-pulse',
    ],
    [
        'sticky bottom-4 z-10 rounded-3xl border border-default-200 bg-content1/95 backdrop-blur-xl p-4 shadow-lg',
        'sticky bottom-4 z-10 rounded-4xl border border-default-200/70 bg-content1/90 backdrop-blur-xl p-4 shadow-elevated',
    ],
    [' shadow-sm', ' shadow-soft'],
    ['shadow-sm"', 'shadow-soft"'],
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
