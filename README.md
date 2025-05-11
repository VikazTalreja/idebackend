# Sereno.ai Web IDE

A web-based AI-powered IDE with Gemini integration, featuring a fake filesystem for demonstration purposes. This is a web version of the original Electron-based Sereno.ai IDE.

## Features

- Web-based code editor with syntax highlighting via Monaco Editor
- File explorer with a fake filesystem that persists in the browser
- AI Assistant powered by Gemini AI
- Dark/light theme support
- Create, edit, and delete files and folders in a virtual filesystem

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ai-ide
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev:full
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### Build for Production

1. Build the application:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

## Using the Web IDE

### Filesystem Navigation

- Use the explorer panel on the left to navigate through the virtual filesystem
- Click on folders to expand/collapse them
- Click on files to open them in the editor
- Right-click (or hover and use the action icons) on files/folders for additional options

### Creating and Editing Files

- Click the "New File" button in the explorer header to create a new file
- Click the "New Folder" button to create a new folder
- Edit files in the Monaco Editor
- Press Ctrl+S (or Cmd+S on Mac) to save changes

### Using the AI Assistant

- Open a file you want to get AI assistance with
- Type your question in the assistant panel on the right
- Click "Send" or press Enter to submit your query
- The assistant has context of your currently open file

### Settings

- Click the gear icon in the AI Assistant panel to open settings
- You can provide your own Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- Change between dark and light themes

## Keyboard Shortcuts

- **Ctrl+S**: Save the current file
- **Ctrl+O**: Open folder browser (simulated in web version)
- **Ctrl+,**: Open settings

## Technical Details

- React-based frontend
- Monaco Editor for code editing
- Simulated filesystem using browser storage (LocalForage)
- Express.js backend for API proxying to Gemini

## License

MIT
