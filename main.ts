import * as fs from 'node:fs';
import * as path from 'node:path';

interface VideoMetadata {
  url?: unknown;
}

/**
 * Entry execution script for make.fun bounty grader.
 * Validates and copies VIDEO.json from bot directory to output directory.
 */
function run(): void {
  try {
    const botDir: string = process.env.MAKEFUN_BOT_DIR || '/bot';
    const outputDir: string = process.env.MAKEFUN_OUTPUT_DIR || '/output';

    const sourcePath: string = path.join(botDir, 'VIDEO.json');
    const targetPath: string = path.join(outputDir, 'VIDEO.json');

    if (!fs.existsSync(sourcePath)) {
      console.error(`Error: Source file does not exist at ${sourcePath}`);
      process.exit(1);
    }

    const rawContent: string = fs.readFileSync(sourcePath, 'utf8');
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(rawContent);
    } catch {
      console.error(`Error: Could not parse ${sourcePath} as valid JSON`);
      process.exit(1);
    }

    if (
      typeof parsedData !== 'object' ||
      parsedData === null ||
      typeof (parsedData as VideoMetadata).url !== 'string' ||
      ((parsedData as VideoMetadata).url as string).trim() === ''
    ) {
      console.error(`Error: VIDEO.json must contain a non-empty 'url' string`);
      process.exit(1);
    }

    fs.mkdirSync(outputDir, { recursive: true });
    fs.copyFileSync(sourcePath, targetPath);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`Fatal error copying video pointer: ${errorMsg}`);
    process.exit(1);
  }
}

run();
