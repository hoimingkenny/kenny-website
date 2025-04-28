# Introduction

##### TypeScript
- A typed superset of JavaScript
- Add static typing to JavaScript

##### React
- Component-based development library
- Features: Virtual DOM, State Management...

##### Next.js
- A React-based full-stack framework that support user to write both frontend and backend in the same project
- Features: Server-Side Rendering(SSR), Built-in Routing(file system based routing), API Routing(APIs are created in pages/api directory)
- App Route vs Page Route
  - App Route: Uses app/ directory for routes
  - Page Route: Uses pages/ directory for routes

##### Server Side Rendering 
- Server renders HTML before sending it to the client
- Data fetched on the server

##### Client Side Rendering
- Browser renders HTML after receiving JavaScript
- Data fetched in the browser
- `use client` in Next.js

##### `.d.ts`
- `.d.ts` stands for "declaration TypeScript"
- Not exactly a Class(class should have methods and behaviors)
- To provide TypeScript with type information for type-checking purposes
- Purely for type-checking during development and are not runtime code - they don't affect the final JS output
```
// wallpaper.d.ts
export interface Wallpaper {
  id: number;
  name: string;
}
```

##### `export default function`
- Allow the function to be used as a default export

### React Hook
##### useEffect
- To perform side effects in React components inclduing data fetching, setting up subscriptions, and manually changing the DOM in React components
```
useEffect(() => {
    fetchWallpapers();
  }, []);
```
- `[]`: the second argument is an array of dependencies
    - Non-empty array: the effect will run every time the dependencies change
    - Empty array: means the effect will only run once on mount


### JS
##### Arrow Function(in Next.js)
```
export default async (req, res) => {
  const data = await fetch("https://your-bucket.s3.amazonaws.com/data.json");
  res.status(200).json(await data.json());
};
```