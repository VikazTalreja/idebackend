import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// API proxy for Gemini
app.post('/api/gemini', async (req, res) => {
  const { prompt, apiKey } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  // Use the provided API key or fall back to demo mode
  const key = apiKey && apiKey !== 'TEST_KEY_FOR_DEVELOPMENT' 
    ? apiKey 
    : process.env.GEMINI_API_KEY;
  
  // If no valid API key is available, use demo mode
  if (!key || key === 'TEST_KEY_FOR_DEVELOPMENT') {
    console.log('Using demo mode for Gemini');
    // Simulate a delay to make it feel real
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a predefined response based on the prompt
    const demoResponses = [
      "Based on the code you've shared, I can see you're working with React and trying to build a web application. Here are some suggestions:\n\n1. Consider adding proper error handling for your API calls\n2. You might want to implement loading states for better UX\n3. Think about adding TypeScript for type safety\n\nLet me know if you need help with implementing any of these!",
      
      "Looking at your React component, I notice you're using useState and useEffect correctly. A few things to consider:\n\n- For data fetching, you might want to use a custom hook\n- Consider adding memoization with useMemo or useCallback for performance\n- Add proper validation for your props\n\nWould you like me to show an example of any of these patterns?",
      
      "I see you're using the Monaco Editor in your application. Some tips for working with it:\n\n1. You can customize the editor with themes and settings\n2. For better performance, consider using the editor's model system\n3. You can add custom language support and code completion\n\nHere's an example of customizing the editor:\n\n```jsx\n<MonacoEditor\n  height=\"500px\"\n  language=\"javascript\"\n  theme=\"vs-dark\"\n  value={code}\n  onChange={handleCodeChange}\n  options={{\n    minimap: { enabled: false },\n    fontSize: 14,\n    wordWrap: 'on'\n  }}\n/>\n```"
    ];
    
    // Select a response based on the content of the prompt
    let responseIndex = 0;
    if (prompt.toLowerCase().includes('editor') || prompt.toLowerCase().includes('monaco')) {
      responseIndex = 2;
    } else if (prompt.toLowerCase().includes('react') || prompt.toLowerCase().includes('component')) {
      responseIndex = 1;
    }
    
    return res.json({ response: demoResponses[responseIndex] });
  }
  
  try {
    // Call the actual Gemini API
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key
        }
      }
    );
    
    // Extract the text from the response
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini API";
    res.json({ response: text });
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    res.json({ 
      response: `Error from Gemini API: ${error.response?.data?.error?.message || error.message}\n\nPlease check your API key and try again.` 
    });
  }
});

// API proxy for Claude
app.post('/api/claude', async (req, res) => {
  const { prompt, apiKey } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  // Use the provided API key or fall back to demo mode
  const key = apiKey && apiKey !== 'TEST_KEY_FOR_DEVELOPMENT' 
    ? apiKey 
    : process.env.CLAUDE_API_KEY;
  
  // If no valid API key is available, use demo mode
  if (!key || key === 'TEST_KEY_FOR_DEVELOPMENT') {
    console.log('Using demo mode for Claude');
    // Simulate a delay to make it feel real
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a predefined response
    const demoResponses = [
      "I've examined your code and here are my observations:\n\n1. Your file structure looks well-organized\n2. The React component architecture seems solid\n3. You might want to consider adding more comments for better documentation\n\nIf you have specific questions about the implementation or need help with a particular feature, feel free to ask!",
      
      "Looking at your React state management approach, I have a few thoughts:\n\n- Consider using the reducer pattern for complex state\n- You could extract some of this logic into custom hooks\n- For shared state, you might want to look into Context API or Redux\n\nHere's an example of converting to a reducer pattern:\n\n```javascript\nfunction reducer(state, action) {\n  switch(action.type) {\n    case 'setUser':\n      return { ...state, user: action.payload };\n    case 'setLoading':\n      return { ...state, loading: action.payload };\n    case 'setError':\n      return { ...state, error: action.payload };\n    default:\n      return state;\n  }\n}\n\n// In your component\nconst [state, dispatch] = useReducer(reducer, { \n  user: null, \n  loading: true, \n  error: null \n});\n```",
      
      "I notice you're working with file systems in your code. Here's a function that might be helpful for determining the language based on file extension:\n\n```javascript\nconst getLanguageForFile = (filename) => {\n  if (!filename) return 'javascript';\n  \n  const extension = filename.split('.').pop().toLowerCase();\n  const languageMap = {\n    js: 'javascript',\n    jsx: 'javascript',\n    ts: 'typescript',\n    tsx: 'typescript',\n    py: 'python',\n    java: 'java',\n    html: 'html',\n    css: 'css',\n    json: 'json',\n    md: 'markdown'\n  };\n  \n  return languageMap[extension] || 'plaintext';\n};\n```"
    ];
    
    // Select a response based on the content of the prompt
    let responseIndex = 0;
    if (prompt.toLowerCase().includes('file') || prompt.toLowerCase().includes('language')) {
      responseIndex = 2;
    } else if (prompt.toLowerCase().includes('state') || prompt.toLowerCase().includes('hook')) {
      responseIndex = 1;
    }
    
    return res.json({ response: demoResponses[responseIndex] });
  }

  try {
    // Call the Claude API
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01'
        }
      }
    );
    
    const text = response.data?.content?.[0]?.text || "No response from Claude API";
    res.json({ response: text });
  } catch (error) {
    console.error('Claude API error:', error.response?.data || error.message);
    res.json({ 
      response: `Error from Claude API: ${error.response?.data?.error?.message || error.message}\n\nPlease check your API key and try again.` 
    });
  }
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 
