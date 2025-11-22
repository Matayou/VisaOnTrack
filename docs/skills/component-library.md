# Component Library - Reusable Patterns

## Tailwind CSS Components

All components use Tailwind's core utility classes only (no custom CSS needed).

### Buttons

**Primary Button**
```jsx
<button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg 
  hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200
  disabled:bg-gray-300 disabled:cursor-not-allowed">
  Generate
</button>
```

**Secondary Button**
```jsx
<button className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300
  hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200">
  Cancel
</button>
```

**Icon Button**
```jsx
<button className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors">
  <svg className="w-5 h-5" />
</button>
```

### Input Fields

**Text Input**
```jsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Prompt
  </label>
  <input 
    type="text"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg
      focus:ring-2 focus:ring-blue-500 focus:border-transparent
      placeholder:text-gray-400"
    placeholder="Describe what you want to create..."
  />
</div>
```

**Textarea (AI Prompt)**
```jsx
<textarea
  className="w-full px-4 py-3 border border-gray-300 rounded-lg
    focus:ring-2 focus:ring-blue-500 focus:border-transparent
    placeholder:text-gray-400 resize-none"
  rows={4}
  placeholder="Enter your prompt here..."
/>
```

**File Upload Dropzone**
```jsx
<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center
  hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
  <svg className="mx-auto h-12 w-12 text-gray-400" />
  <p className="mt-2 text-sm text-gray-600">
    <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
  </p>
  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
</div>
```

### Cards

**Basic Card**
```jsx
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <h3 className="text-lg font-semibold text-gray-900">Card Title</h3>
  <p className="mt-2 text-gray-600">Card content goes here...</p>
</div>
```

**Metric Card**
```jsx
<div className="bg-white rounded-lg shadow p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-600">Total Generations</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">1,234</p>
    </div>
    <div className="p-3 bg-blue-100 rounded-lg">
      <svg className="w-8 h-8 text-blue-600" />
    </div>
  </div>
  <div className="mt-4 flex items-center text-sm">
    <span className="text-green-600 font-medium">↑ 12%</span>
    <span className="text-gray-500 ml-2">from last month</span>
  </div>
</div>
```

**Glass Card (Glassmorphism)**
```jsx
<div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6">
  <h3 className="text-lg font-semibold text-white">Glass Card</h3>
  <p className="mt-2 text-white/80">Beautiful translucent effect</p>
</div>
```

### Chat Components

**User Message Bubble**
```jsx
<div className="flex justify-end mb-4">
  <div className="max-w-[70%] bg-blue-600 text-white rounded-lg px-4 py-2">
    <p>User's message goes here</p>
    <span className="text-xs text-blue-100 mt-1 block">2:34 PM</span>
  </div>
</div>
```

**AI Message Bubble**
```jsx
<div className="flex justify-start mb-4">
  <div className="flex gap-3 max-w-[70%]">
    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0" />
    <div className="bg-gray-100 rounded-lg px-4 py-2">
      <p className="text-gray-900">AI's response goes here...</p>
      <div className="flex gap-2 mt-2">
        <button className="text-xs text-gray-600 hover:text-gray-900">Copy</button>
        <button className="text-xs text-gray-600 hover:text-gray-900">Regenerate</button>
      </div>
    </div>
  </div>
</div>
```

**Typing Indicator**
```jsx
<div className="flex gap-1">
  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
</div>
```

### Navigation

**Top Navigation Bar**
```jsx
<nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16 items-center">
      <div className="flex items-center gap-8">
        <div className="text-xl font-bold text-gray-900">AI Studio</div>
        <div className="hidden md:flex gap-4">
          <a href="#" className="text-gray-700 hover:text-gray-900">Home</a>
          <a href="#" className="text-gray-700 hover:text-gray-900">Generate</a>
          <a href="#" className="text-gray-700 hover:text-gray-900">History</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <svg className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
      </div>
    </div>
  </div>
</nav>
```

**Sidebar Navigation**
```jsx
<aside className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col">
  <div className="p-4 border-b border-gray-800">
    <h1 className="text-xl font-bold">AI Studio</h1>
  </div>
  <nav className="flex-1 p-4 space-y-1">
    <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800 text-white">
      <svg className="w-5 h-5" />
      <span>Dashboard</span>
    </a>
    <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white">
      <svg className="w-5 h-5" />
      <span>Generate</span>
    </a>
    <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white">
      <svg className="w-5 h-5" />
      <span>History</span>
    </a>
  </nav>
  <div className="p-4 border-t border-gray-800">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
      <div>
        <p className="font-medium">John Doe</p>
        <p className="text-sm text-gray-400">Pro Plan</p>
      </div>
    </div>
  </div>
</aside>
```

### Feedback Components

**Toast Notification (Success)**
```jsx
<div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-sm">
  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
    <svg className="w-6 h-6 text-green-600" />
  </div>
  <div className="flex-1">
    <p className="font-semibold text-gray-900">Success!</p>
    <p className="text-sm text-gray-600">Your image has been generated</p>
  </div>
  <button className="text-gray-400 hover:text-gray-600">
    <svg className="w-5 h-5" />
  </button>
</div>
```

**Progress Bar**
```jsx
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span className="text-gray-700">Generating...</span>
    <span className="text-gray-500">73%</span>
  </div>
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{width: '73%'}} />
  </div>
</div>
```

**Skeleton Loader**
```jsx
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded w-full"></div>
  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
</div>
```

### Modal/Dialog

**Modal Overlay**
```jsx
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
  <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
    <div className="flex justify-between items-start mb-4">
      <h2 className="text-xl font-bold text-gray-900">Modal Title</h2>
      <button className="text-gray-400 hover:text-gray-600">
        <svg className="w-6 h-6" />
      </button>
    </div>
    <div className="mb-6">
      <p className="text-gray-600">Modal content goes here...</p>
    </div>
    <div className="flex justify-end gap-3">
      <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
        Cancel
      </button>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Confirm
      </button>
    </div>
  </div>
</div>
```

## React Components with State

### Image Generator Interface

```jsx
import { useState } from 'react';

function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setResult({ url: 'https://example.com/image.jpg' });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Create Image</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={6}
            placeholder="Describe your image..."
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg 
              hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </button>
        </div>

        {/* Preview Panel */}
        <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center min-h-[400px]">
          {isGenerating && (
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
              <p className="mt-4 text-gray-600">Generating your image...</p>
            </div>
          )}
          {result && !isGenerating && (
            <div>
              <img src={result.url} alt="Generated" className="rounded-lg" />
              <button className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg">
                Download
              </button>
            </div>
          )}
          {!result && !isGenerating && (
            <p className="text-gray-400">Your generated image will appear here</p>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Chat Interface with History

```jsx
import { useState } from 'react';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = { 
        role: 'assistant', 
        content: 'This is a simulated AI response...', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-xl font-bold">AI Chat Assistant</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-lg px-4 py-2 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border shadow-sm'
            }`}>
              <p>{msg.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Icon Libraries

**Lucide React** (recommended, available in artifacts)
```jsx
import { Sparkles, Upload, Download, Settings } from 'lucide-react';

<Sparkles className="w-5 h-5" />
```

**Common Icons for AI Apps:**
- Sparkles (AI generation)
- Wand (magic/generation)
- Upload/Download (file operations)
- Settings (configuration)
- RefreshCw (regenerate)
- Copy (copy text)
- Trash (delete)
- Edit (edit/modify)
- Check (success)
- X (close/error)
- ChevronRight/Left (navigation)
- Menu (hamburger menu)
