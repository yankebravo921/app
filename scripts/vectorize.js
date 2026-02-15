import potrace from 'potrace';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../public/New Project (2).png');
const outputPath = path.join(__dirname, '../public/logo.svg');

console.log(`Processing: ${inputPath}`);

// The logo is GREEN on WHITE/transparent background.
// Green in grayscale ≈ 134. White = 255. Transparent treated as white.
// With blackOnWhite=true, pixels BELOW threshold are "foreground".
// So threshold=180 means green(134) < 180 → foreground ✓, white(255) > 180 → background ✓

function traceWithSettings(settings) {
    return new Promise((resolve, reject) => {
        potrace.trace(inputPath, settings, (err, svg) => {
            if (err) reject(err);
            else resolve(svg);
        });
    });
}

async function main() {
    try {
        console.log('Tracing with blackOnWhite=true, threshold=180...');
        const svg = await traceWithSettings({
            threshold: 180,
            blackOnWhite: true,
            turdSize: 2,
            optTolerance: 0.2,
        });

        if (!svg || svg.includes('d=""')) {
            console.error('ERROR: SVG path is empty. Try adjusting threshold.');
            process.exit(1);
        }

        fs.writeFileSync(outputPath, svg);
        console.log(`Success! SVG saved to: ${outputPath}`);
        console.log('Preview:', svg.substring(0, 400));
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
}

main();
