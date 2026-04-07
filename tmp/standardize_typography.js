const fs = require('fs');
const path = require('path');

function cleanClasses(content, filePath) {
    // 1. Replace 9px-11px with 13px and ensure font-medium
    content = content.replace(/text-\[(9|10|11)px\]/g, 'text-[13px] font-medium');

    // 2. Identify and update CardTitle components to text-lg font-medium
    content = content.replace(/(<CardTitle[^>]*className=(?:"([^"]*)"|{`([^`]*)`})[^>]*>)/g, (match, p1, p2, p3) => {
        let classes = p2 || p3 || "";
        // Remove existing sizes and weights. Handling [ ] characters specifically.
        let cleaned = classes.replace(/\btext-[a-z0-9\[\]-]+\b/g, '').replace(/\bfont-[a-z]+\b/g, '').trim();
        // Remove rogue brackets that might have been left by previous failed regex
        cleaned = cleaned.replace(/\]/g, '').trim();
        
        cleaned = `text-lg font-medium ${cleaned}`.replace(/\s{2,}/g, ' ').trim();
        
        if (p2 !== undefined) return p1.replace(`className="${p2}"`, `className="${cleaned}"`);
        if (p3 !== undefined) return p1.replace(`className={\`${p3}\`}`, `className={\`${cleaned}\`}`);
        return match;
    });

    // 3. Update Button, Badge, Label, and sidebar items to font-medium
    const isLayout = filePath.includes('layout.tsx');
    
    content = content.replace(/className=(?:"([^"]*)"|{`([^`]*)`})/g, (match, p1, p2) => {
        let classes = (p1 || p2 || "").replace(/\]/g, '').trim();
        
        if (classes.includes('text-3xl')) {
            // Ensure SummaryCard value is font-bold
            let cleaned = classes.replace(/\bfont-(medium|black|semibold)\b/g, 'font-bold');
            if (!cleaned.includes('font-bold')) cleaned += ' font-bold';
            cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();
            if (p1 !== undefined) return `className="${cleaned}"`;
            if (p2 !== undefined) return `className={\`${cleaned}\`}`;
            return match;
        }

        if (classes.includes('font-medium') || classes.includes('text-[13px]') || isLayout || /font-(bold|black|semibold)/.test(classes)) {
            let cleaned = classes.replace(/\bfont-(bold|black|semibold)\b/g, 'font-medium');
            cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();
            cleaned = Array.from(new Set(cleaned.split(' '))).join(' ');
            
            if (p1 !== undefined) return `className="${cleaned}"`;
            if (p2 !== undefined) return `className={\`${cleaned}\`}`;
        }
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
             if (filePath.endsWith('SummaryCards.tsx')) {
                 // Even here we might want to check
             }
            
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                const newContent = cleanClasses(content, filePath);
                if (newContent !== content) {
                    fs.writeFileSync(filePath, newContent, 'utf-8');
                    console.log(`Fixed: ${filePath}`);
                }
            } catch (err) {
                console.error(`Error processing ${filePath}: ${err.message}`);
            }
        }
    }
}

processDirectory('C:/wamp64/www/culture-monitor-app/frontend/src');
