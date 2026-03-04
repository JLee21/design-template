# Export Handoff to Google Docs

## Purpose
Converts the HANDOFF.md document to a format that can be easily pasted into Google Docs with formatting preserved.

## When to Use
Run this skill after generating HANDOFF.md when you need to share via Google Docs.

## Method: HTML Export (No Dependencies)

### Steps

#### 1. Read the Handoff Document
```bash
cat docs/HANDOFF.md
```

#### 2. Convert to Styled HTML
Create `docs/HANDOFF.html` with:
- Clean, readable styles optimized for Google Docs paste
- Proper heading hierarchy
- Code blocks with monospace font and background
- Tables with borders

#### 3. HTML Template
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1 { color: #031b4e; border-bottom: 2px solid #0069ff; padding-bottom: 10px; }
    h2 { color: #031b4e; margin-top: 30px; }
    h3 { color: #404040; }
    h4 { color: #525252; }
    code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'SF Mono', Monaco, monospace;
    }
    pre {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      border: 1px solid #e5e5e5;
    }
    pre code {
      background: none;
      padding: 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
    }
    th, td {
      border: 1px solid #d4d4d4;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background: #f5f5f5;
    }
    .status-new {
      background: #dbeafe;
      color: #1e40af;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
    }
    .status-modified {
      background: #fef3c7;
      color: #92400e;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
    }
    .status-existing {
      background: #d1fae5;
      color: #065f46;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  [Converted markdown content here]
</body>
</html>
```

#### 4. Instructions for User
After creating the HTML file:

1. Open `docs/HANDOFF.html` in your browser
2. Press Cmd+A to select all
3. Press Cmd+C to copy
4. Open Google Docs and press Cmd+V to paste
5. Formatting should be preserved

### Alternative: Plain Copy
If HTML doesn't work well, the markdown itself can be pasted into Google Docs - it just won't have formatting. Most people find the HTML method works better.

## Output
- Create `docs/HANDOFF.html`
- Open in default browser (or provide instructions)
- Confirm ready for copy/paste
