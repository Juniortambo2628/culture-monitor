const fs = require('fs');
const path = require('path');

function cleanClasses(content) {
    // 1. Remove font-black
    content = content.replace(/\bfont-black\b/g, '');
    
    // 2. Remove uppercase
    content = content.replace(/\buppercase\b/g, '');
    
    // 3. Remove tracking-* except tight and tighter
    content = content.replace(/\btracking-(?!(tight|tighter)\b)[a-z\[\]0-9.-]+\b/g, '');
    
    // 4. Specifically target CardHeader components and remove bg-muted/30, bg-muted/50, and border-b
    // We look for CardHeader followed by a className attribute
    content = content.replace(/(<CardHeader[^>]*className=(?:"([^"]*)"|{`([^`]*)`})[^>]*>)/g, (match, p1, p2, p3) => {
        let classes = p2 || p3 || "";
        // Remove the specific header classes
        let cleaned = classes.replace(/\b(bg-muted\/30|bg-muted\/50|border-b)\b/g, '').replace(/\s{2,}/g, ' ').trim();
        if (p2 !== undefined) return p1.replace(`className="${p2}"`, `className="${cleaned}"`);
        if (p3 !== undefined) return p1.replace(`className={\`${p3}\`}`, `className={\`${cleaned}\`}`);
        return match;
    });

    // 5. General cleanup of double spaces and spaces near quotes/brackets in className attributes
    content = content.replace(/className=(?:"([^"]*)"|{`([^`]*)`})/g, (match, p1, p2) => {
        let classes = p1 || p2 || "";
        let cleaned = classes.replace(/\s{2,}/g, ' ').trim();
        if (p1 !== undefined) return `className="${cleaned}"`;
        if (p2 !== undefined) return `className={\`${cleaned}\`}`;
        return match;
    });

    return content;
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            processDirectory(filePath);
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                const newContent = cleanClasses(content);
                if (newContent !== content) {
                    fs.writeFileSync(filePath, newContent, 'utf-8');
                    console.log(`Cleaned: ${filePath}`);
                }
            } catch (err) {
                console.error(`Error processing ${filePath}: ${err.message}`);
            }
        }
    }
}

processDirectory('c:\\wamp64\\www\\culture-monitor-app\\frontend\\src');
