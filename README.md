# Walrus Design-to-Code

A starter template for building production-ready UI components using DigitalOcean's Walrus design system — directly from Cursor.

## What You Need

- **Cursor** — Request access through [IT Self-Service](https://do-internal.atlassian.net/wiki/spaces/IT/pages/2251456553/How+To+Access+Cursor), then download from [cursor.sh](https://cursor.sh)
- **A Figma account** with access to the design files
- **The `design-template` project folder** (shared with you by your team)

## Getting to Know Cursor

When you open a project in Cursor, you'll see a few key areas. Here's what they are and what they do.

### The file tree (left sidebar)

This shows all the files and folders in your project. Click any file to open it in the editor. You don't need to manually edit these files — the agent does that for you — but it's useful to see what's there.

### The editor (center)

When you click a file in the tree, it opens here. When the agent makes changes to a file, you'll see a **diff view** — green highlights for new code, red for removed code. You can review what changed, but you don't need to write or edit code yourself.

### The AI chat panel (Cmd+L)

This is where you talk to the agent. Press **Cmd+L** (Mac) or **Ctrl+L** (Windows) to open it. Type what you want in plain language and the agent will do the work. This is the main way you interact with the project.

### The terminal (Ctrl+`)

The agent uses this to run commands — installing dependencies, starting the dev server, etc. You'll see text scrolling here when the agent is working. You don't need to type anything in the terminal yourself; the agent handles it.

### Chat modes

The chat panel has four modes you can switch between using the mode selector at the top:

- **Agent mode** — The agent can read files, write code, and run commands. Use this when you want it to build or change something. This is the mode you'll use most.
- **Ask mode** — The agent can only read and answer questions. Nothing gets changed. Use this when you want to understand something or explore the codebase.
- **Plan mode** — The agent analyzes the task and proposes a step-by-step plan before doing anything. Use this when you want to think through an approach before committing to it.
- **Debug mode** — The agent investigates bugs and errors systematically. Use this when something is broken and you want to understand why before fixing it.

### Undoing changes

If the agent does something you don't like:

- **Cmd+Z** in any file to undo edits
- Or just tell the agent: *"Undo that"* or *"Revert the last change"*
- You can also reject changes in the diff view before they're applied

## First-Time Setup

### Step 1: Open the project

Open Cursor → **File → Open Folder** → select the `design-template` folder.

### Step 2: Connect to Figma

Go to **Cursor Settings → MCP** and click **"Connect"** next to Figma. A browser window will open — sign in with your Figma account and click **Authorize**.

### Step 3: Set up the project

Open the AI chat panel (**Cmd+L**) and say:

```
Set up the project for me
```

The agent will install everything the project needs. Wait for it to finish and give you a localhost link.

## Tutorial: Build Your First Prototype

Once setup is complete, try building something to see the workflow in action.

### 1. Start the server

Open chat (**Cmd+L**) and say:

```
Start the dev server
```

Click the localhost link it gives you to open the preview in your browser.

### 2. Describe what you want to build

Tell the agent what you're designing in plain language. You can start small with a single component or describe a full layout — whatever you have in mind.

**Start with a component:**

```
Build me a primary button that says "Create Droplet"
```

```
Build a card with a title, a short description, and a secondary button
```

**Describe a layout or page:**

```
Build a settings page with a header that says "General Settings", three form fields
for name, email, and team, and a save button at the bottom
```

```
Create a dashboard header with a welcome message, a search bar, and a "Create" button
on the right side
```

**Combine multiple components:**

```
Build a notification card that has a warning alert at the top, a list of three items
below it, and a "Dismiss all" button at the bottom
```

The agent will show you a **checkpoint table** — a summary of what it plans to build and which Walrus components match. Reply **"go"** to approve, or pick options to customize.

### 3. See it live

Your browser auto-refreshes with the prototype. Ask the agent to make changes in plain language:

```
Make the title larger
```

```
Change the button to secondary
```

```
Add a hover state
```

```
Move the search bar to the left of the Create button
```

### General tips for describing designs

- **Be specific about layout** — mention things like "side by side", "stacked vertically", "on the right side"
- **Name the components you want** — "a button", "a card", "a text input", "a dropdown"
- **Include content** — give it real text, labels, and placeholder values instead of generic "lorem ipsum"
- **Describe states** — "the button should be disabled", "show an error message below the email field"
- **Iterate** — start with the basic structure, then refine with follow-up messages

## Working with Figma

Once you're comfortable with the basic workflow, you can build directly from Figma designs.

In Figma, find the frame or component you want to build. **Right-click → Copy link.** Then tell the agent:

```
Implement this design from Figma.
@https://www.figma.com/design/XXXXX/YourFile?node-id=123-456
```

The agent fetches the design, analyzes every element, and shows you a checkpoint before writing any code.

**Tips for best results:**

- **Start with individual components** (a button, a card, an alert) rather than full screens
- **Review the checkpoint table** — it tells you what the agent found and what it plans to use
- **Break complex screens into pieces** — ask for one section at a time rather than an entire page

## Quick Reference

| You want to...           | Say this to the agent                                          |
| ------------------------ | -------------------------------------------------------------- |
| Set up the project       | "Set up the project for me"                                    |
| Start the dev server     | "Start the dev server"                                         |
| Build a component        | "Build me a primary button that says Create Droplet"           |
| Build a layout           | "Build a settings page with a header, three form fields..."    |
| Build from Figma         | "Implement this design from Figma. @(paste Figma link)"        |
| Tweak something          | Just describe what you want changed                            |
| Think through an approach| Switch to Plan mode and describe what you're trying to do      |
| Debug a problem          | Switch to Debug mode and describe what's broken                |
| Undo something           | "Undo that" or Cmd+Z                                          |
| Fix something broken     | Just describe the problem                                      |

## If Something Goes Wrong

Just describe it to the agent — it knows the project and common issues:

```
The browser is showing a blank white page
```

```
The dev server stopped
```

```
Figma isn't connecting
```

If the agent can't access Figma, go to **Cursor Settings → MCP** and check that Figma shows as connected. Click "Connect" again if needed.
