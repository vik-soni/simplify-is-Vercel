#!/usr/bin/env node
/**
 * Renders docs/Simplify_IS_Briefing.md to a print-friendly HTML file.
 * Usage: node scripts/renderBriefingPrint.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir = join(__dirname, "..", "docs");
const inputPath = join(docsDir, "Simplify_IS_Briefing.md");
const outputPath = join(docsDir, "Simplify_IS_Briefing.print.html");

let md = readFileSync(inputPath, "utf8");
if (!md.startsWith("# ")) {
  md = "# Simplify.is — Product Briefing\n\n" + md;
}

marked.setOptions({ gfm: true, breaks: false });

const body = marked.parse(md);

const html = `<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Simplify.is — Product Briefing (Print)</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 20mm 16mm;
    }
    * { box-sizing: border-box; }
    html { font-size: 10.5pt; }
    body {
      font-family: "Georgia", "Times New Roman", serif;
      line-height: 1.45;
      color: #1a1917;
      max-width: 100%;
      margin: 0;
      padding: 0;
    }
    h1 {
      font-family: "Helvetica Neue", Arial, sans-serif;
      font-size: 22pt;
      font-weight: 700;
      margin: 0 0 0.25em;
      line-height: 1.15;
      page-break-after: avoid;
    }
    h2 {
      font-family: "Helvetica Neue", Arial, sans-serif;
      font-size: 14pt;
      font-weight: 700;
      margin: 1.4em 0 0.5em;
      padding-bottom: 0.2em;
      border-bottom: 1px solid #ccc;
      page-break-after: avoid;
    }
    h3 {
      font-family: "Helvetica Neue", Arial, sans-serif;
      font-size: 11pt;
      font-weight: 600;
      margin: 1.1em 0 0.4em;
      page-break-after: avoid;
    }
    p, li { margin: 0.4em 0; }
    ul, ol { margin: 0.4em 0 0.6em 1.2em; padding: 0; }
    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 1.2em 0;
    }
    strong { font-weight: 700; }
    em { font-style: italic; }
    a { color: #822700; text-decoration: none; }
    a[href^="http"]::after {
      content: " (" attr(href) ")";
      font-size: 8pt;
      color: #666;
      word-break: break-all;
    }
    code {
      font-family: "Menlo", "Consolas", monospace;
      font-size: 9pt;
      background: #f5f3f0;
      padding: 0.1em 0.35em;
      border-radius: 2px;
    }
    pre {
      font-family: "Menlo", "Consolas", monospace;
      font-size: 8.5pt;
      background: #f5f3f0;
      border: 1px solid #e0dcd6;
      padding: 0.75em 1em;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
      page-break-inside: avoid;
    }
    pre code { background: none; padding: 0; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0.6em 0 1em;
      font-size: 9pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 0.35em 0.5em;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #f0ebe6;
      font-family: "Helvetica Neue", Arial, sans-serif;
      font-weight: 600;
    }
    tr:nth-child(even) td { background: #faf9f7; }
    blockquote {
      margin: 0.6em 0;
      padding-left: 1em;
      border-left: 3px solid #f2632d;
      color: #444;
    }
    .print-header {
      font-family: "Helvetica Neue", Arial, sans-serif;
      font-size: 9pt;
      color: #666;
      margin-bottom: 1.5em;
      padding-bottom: 0.5em;
      border-bottom: 2px solid #f2632d;
    }
    .print-footer {
      margin-top: 2em;
      padding-top: 0.5em;
      border-top: 1px solid #ddd;
      font-size: 8.5pt;
      color: #666;
      text-align: center;
    }
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      h2 { page-break-before: auto; }
      h2, h3 { page-break-after: avoid; }
      table, pre, blockquote { page-break-inside: avoid; }
      a { color: #1a1917; }
      a[href^="http"]::after { font-size: 7pt; }
    }
    @media screen {
      body {
        max-width: 210mm;
        margin: 2rem auto;
        padding: 0 1rem 3rem;
      }
      .no-screen { display: none; }
    }
  </style>
</head>
<body>
  <p class="print-header no-screen">
    <strong>Print:</strong> File → Print (or ⌘P) → Save as PDF · Paper A4 · Margins default · Background graphics on (optional)
  </p>
  <main>${body}</main>
  <p class="print-footer">Simplify.is Product Briefing · May 2026 · Confidential</p>
</body>
</html>`;

writeFileSync(outputPath, html, "utf8");
console.log(`Wrote ${outputPath}`);
