const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const ignoredDirectories = new Set(['.git', 'node_modules']);
const requiredPaths = [
    'index.html',
    'main.html',
    'pages/userinsight.html',
    'pages/workbench.html',
    'assets/css/app.css',
    'js/app.js',
    'mock/data.js',
    'docs/interaction.html',
    'annotations/annotations.js',
    'memory/project.md'
];

function walk(directory, extensions) {
    const files = [];

    fs.readdirSync(directory, { withFileTypes: true }).forEach(entry => {
        if (ignoredDirectories.has(entry.name)) return;

        const absolutePath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...walk(absolutePath, extensions));
        } else if (extensions.has(path.extname(entry.name))) {
            files.push(absolutePath);
        }
    });

    return files;
}

function isLocalReference(reference) {
    return !/^(?:[a-z]+:|#|\/|data:|mailto:|javascript:)/i.test(reference);
}

function resolveReference(sourceFile, reference) {
    const cleanReference = reference.split(/[?#]/)[0];
    return path.resolve(path.dirname(sourceFile), cleanReference);
}

function validateRequiredPaths(errors) {
    requiredPaths.forEach(relativePath => {
        if (!fs.existsSync(path.join(root, relativePath))) {
            errors.push(`Missing required path: ${relativePath}`);
        }
    });
}

function validateHtmlReferences(errors) {
    const attributePattern = /\b(?:src|href)\s*=\s*["']([^"']+)["']/g;

    walk(root, new Set(['.html'])).forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        for (const match of content.matchAll(attributePattern)) {
            if (!isLocalReference(match[1])) continue;
            if (!fs.existsSync(resolveReference(file, match[1]))) {
                errors.push(`${path.relative(root, file)} -> ${match[1]}`);
            }
        }
    });
}

function validateCssReferences(errors) {
    const referencePattern = /(?:@import\s+url\(|url\()\s*["']?([^"')]+)["']?\s*\)/g;

    walk(root, new Set(['.css'])).forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        for (const match of content.matchAll(referencePattern)) {
            if (!isLocalReference(match[1])) continue;
            if (!fs.existsSync(resolveReference(file, match[1]))) {
                errors.push(`${path.relative(root, file)} -> ${match[1]}`);
            }
        }
    });
}

function validateJavaScript(errors) {
    walk(root, new Set(['.js'])).forEach(file => {
        const result = spawnSync(process.execPath, ['--check', file], {
            encoding: 'utf8'
        });

        if (result.status !== 0) {
            errors.push(
                `${path.relative(root, file)}: ${result.stderr.trim() || 'syntax check failed'}`
            );
        }
    });
}

function parseAttributes(source) {
    const attributes = {};
    const attributePattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

    for (const match of source.matchAll(attributePattern)) {
        attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
    }

    return attributes;
}

function lineNumberAt(content, index) {
    return content.slice(0, index).split('\n').length;
}

function validateHtmlStructure(errors) {
    walk(root, new Set(['.html'])).forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const relativePath = path.relative(root, file);
        const sanitized = content
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
        const tagPattern = /<\/?div\b[^>]*>/gi;
        const stack = [];
        const tabPanes = [];

        for (const match of sanitized.matchAll(tagPattern)) {
            if (/^<\//.test(match[0])) {
                if (!stack.length) {
                    errors.push(`${relativePath}:${lineNumberAt(sanitized, match.index)}: unexpected </div>`);
                    continue;
                }
                stack.pop();
                continue;
            }

            const attributes = parseAttributes(match[0].replace(/^<div\b|>$/gi, ''));
            const node = {
                id: attributes.id || '',
                classes: (attributes.class || '').split(/\s+/).filter(Boolean),
                line: lineNumberAt(sanitized, match.index)
            };
            const parent = stack[stack.length - 1] || null;

            if (node.classes.includes('tab-pane')) {
                tabPanes.push({ node, parent });
            }
            stack.push(node);
        }

        if (stack.length) {
            const first = stack[stack.length - 1];
            errors.push(`${relativePath}:${first.line}: unclosed <div>${first.id ? `#${first.id}` : ''}`);
        }

        tabPanes.forEach(({ node, parent }) => {
            if (!parent || !parent.classes.includes('tab-content')) {
                const actualParent = parent
                    ? `${parent.id ? `#${parent.id}` : ''}${parent.classes.length ? `.${parent.classes.join('.')}` : ''}`
                    : 'none';
                errors.push(
                    `${relativePath}:${node.line}: .tab-pane${node.id ? `#${node.id}` : ''} must be a direct child of .tab-content; parent is ${actualParent}`
                );
            }
        });

        if (relativePath === 'pages/userinsight.html') {
            const requiredTabPanes = ['channel-effect', 'cultivation-op', 'user-group-insight'];
            requiredTabPanes.forEach(id => {
                if (!tabPanes.some(({ node }) => node.id === id)) {
                    errors.push(`${relativePath}: missing required tab pane #${id}`);
                }
            });
        }
    });
}

const errors = [];
validateRequiredPaths(errors);
validateHtmlReferences(errors);
validateCssReferences(errors);
validateHtmlStructure(errors);
validateJavaScript(errors);

if (errors.length) {
    console.error('Project validation failed:\n');
    errors.forEach(error => console.error(`- ${error}`));
    process.exit(1);
}

console.log('Project validation passed.');
