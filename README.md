# VinQl - A GraphQL Wine Explorer & Learning Project
 
A full-stack GraphQL learning project using React (Apollo Client) and Apollo Server with TypeScript, focused on exploring wine data.

## Project Plan

### **Project Structure Overview (Monorepo)**

```
graphql-wine/
├── package.json         # Root package.json with workspaces
├── node_modules/        # Shared dependencies (hoisted)
├── client/              # React frontend (current Vite setup)
│   ├── package.json     # Client-specific dependencies
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/       # Custom Apollo hooks
│   │   ├── graphql/     # Queries, mutations, fragments
│   │   └── ...
│   ├── vite.config.ts
│   └── tsconfig.json
├── server/              # Apollo Server backend (new)
│   ├── package.json     # Server-specific dependencies
│   ├── src/
│   │   ├── schema/      # GraphQL schema definitions
│   │   ├── resolvers/   # Resolver functions
│   │   ├── data/        # Static JSON data files
│   │   ├── types/       # TypeScript types
│   │   └── index.ts     # Server entry point
│   └── tsconfig.json
└── shared/              # Shared types/utilities between client/server
    ├── package.json     # Optional: shared package
    └── src/
        └── types/       # Shared TypeScript types
```

### **Phase 0: Monorepo Setup**

**0.1 Root Configuration**
- Update root `package.json` to use npm workspaces:
  - Add `"workspaces": ["client", "server", "shared"]`
  - Add root-level scripts for running both client and server concurrently
  - Install shared dev dependencies at root (TypeScript, ESLint, etc.)
- Create root `.gitignore` if needed
- Consider using `concurrently` or `npm-run-all` for running multiple scripts

**0.2 Workspace Structure**
- Move current client code into `client/` directory (if not already)
- Create `server/` directory for backend
- Optionally create `shared/` directory for shared types/utilities
- Each workspace has its own `package.json` with workspace-specific dependencies

### **Phase 1: Backend Setup (Apollo Server)**

**1.1 Server Foundation**
- Create `server/` directory with its own `package.json`
- Install dependencies in server workspace:
  - `@apollo/server`
  - `graphql`
  - `typescript`, `ts-node`, `nodemon` (dev)
  - Optional: `apollo-server-express` if you want Express integration
- Set up TypeScript config for Node.js
- Create basic server entry point
- Use workspace-aware npm commands: `npm install -w server <package>`

**1.2 Data Layer: Static JSON**
- Create `server/src/data/` directory
- Create JSON files for different entities:
  - `varietals.json` - Array of varietal objects
  - `wineries.json` - Array of winery objects
  - `wines.json` - Array of wine objects (with varietalId and wineryId references)
- Structure data with proper relationships (using IDs for references)
- Create a simple data access layer:
  - `dataAccess.ts` or `dataLoader.ts` with functions to:
    - Load JSON files
    - Filter/find by ID
    - Filter by relationships (e.g., get wines by varietalId or wineryId)
    - Simple in-memory operations (no database queries needed)
- Consider using `fs.readFileSync` or `import` statements to load JSON
- Data can be manually curated or seeded from a public wine dataset for initial setup

**1.3 GraphQL Schema Design**
- Define core types: `Varietal`, `Winery`, `Wine`
- Design relationships (Varietal → Wines, Winery → Wines, etc.)
- Start with queries (read operations)
- Add mutations later (create/update/delete) - these will update in-memory data or JSON files
- Consider pagination, filtering, sorting

**1.4 Resolvers**
- Implement query resolvers (e.g., `varietals`, `varietal(id)`, `wineries`, `wines`)
- Handle relationships (nested resolvers that use data access functions)
- Add basic error handling
- For mutations: update in-memory data (or optionally write back to JSON files)

### **Phase 2: Frontend Setup (Apollo Client)**

**2.1 Apollo Client Configuration**
- Install in client workspace: `@apollo/client`, `graphql`
- Use workspace-aware npm commands: `npm install -w client <package>`
- Set up Apollo Client provider in React app
- Configure cache (InMemoryCache)
- Set up HTTP link to point to Apollo Server endpoint
- Handle development vs production URLs
- In monorepo, can reference shared types from `shared/` package if needed

**2.2 GraphQL Operations**
- Create `src/graphql/` directory structure:
  - `queries/` - All GraphQL queries
  - `mutations/` - All GraphQL mutations
  - `fragments/` - Reusable fragments
- Use `gql` template literals for type safety
- Consider code generation (GraphQL Code Generator) for TypeScript types

- Create custom hooks (e.g., `useVarietals`, `useVarietal(id)`, `useWineries`, `useWines`)
- Use `useQuery` and `useMutation` hooks
- Build components that consume GraphQL data
- Handle loading, error, and success states

### **Phase 3: Core Features (Incremental Learning)**

**3.1 Basic Queries**
- List all varietals
- Varietal details page showing associated wines
- List all wineries
- Wine details including varietal and winery info

- Search/filter wines (by varietal, winery, price range, rating)
- Pagination (cursor-based or offset-based using array slicing)
- Sorting (using array sort methods)
- Field selection (let GraphQL handle what fields to fetch)

- Save favorite wines (update in-memory state or JSON)
- Rate wines
- Create tasting lists
- Note: With static JSON, mutations can update in-memory data during server runtime, or optionally write back to JSON files using `fs.writeFileSync`

- Update Apollo cache after mutations
- Optimistic UI updates
- Cache invalidation strategies

### **Phase 4: Advanced GraphQL Concepts**

**4.1 Fragments**
- Create reusable fragments for Varietal, Winery, Wine, etc.
- Use fragments in queries to reduce duplication

**4.2 Subscriptions** (optional, more advanced)
- Real-time updates using WebSockets
- Requires `graphql-ws` or `subscriptions-transport-ws`
- Note: With static JSON, subscriptions would update when in-memory data changes

**4.3 Error Handling**
- GraphQL error handling
- Network error handling
- User-friendly error messages

**4.4 Performance**
- Query batching
- Cache strategies
- Field-level caching
- Note: Data loaders less critical with static JSON, but can still be useful for batching

### **Development Workflow Recommendations (Monorepo)**

1. **Monorepo Tooling**
   - Use **npm workspaces** (built into npm 7+)
   - Root `package.json` defines workspaces: `"workspaces": ["client", "server", "shared"]`
   - Install dependencies:
     - Root level: `npm install <package>` (shared dev dependencies)
     - Workspace level: `npm install -w client <package>` or `npm install -w server <package>`
   - Dependencies are hoisted to root `node_modules` when possible
   - Each workspace can have its own scripts and dependencies

2. **Running Both Servers**
   - **Option A: Root scripts** (recommended)
     - Add to root `package.json`:
       ```json
       "scripts": {
         "dev": "concurrently \"npm run dev -w client\" \"npm run dev -w server\"",
         "dev:client": "npm run dev -w client",
         "dev:server": "npm run dev -w server"
       }
       ```
     - Run both: `npm run dev` from root
   - **Option B: Individual workspaces**
     - Frontend: `npm run dev -w client` (Vite dev server, typically port 5173)
     - Backend: `npm run dev -w server` (Apollo Server, e.g., port 4000)
   - Install `concurrently` or `npm-run-all` at root for running both simultaneously

3. **Shared Code & Types**
   - Create `shared/` workspace for shared TypeScript types
   - Reference shared package in client/server: `"shared": "workspace:*"`
   - Generate TypeScript types from GraphQL schema (can be shared)
   - Use GraphQL Code Generator to generate types that both client and server can use
   - Define TypeScript interfaces matching JSON structure in shared package

4. **Type Safety**
   - Generate TypeScript types from GraphQL schema
   - Use GraphQL Code Generator or similar
   - Keep client and server types in sync via shared package or codegen
   - Define TypeScript interfaces matching JSON structure

5. **Development Tools**
   - Apollo Studio (GraphQL playground)
   - React DevTools
   - Apollo Client DevTools browser extension
   - Use workspace-aware commands: `npm run <script> -w <workspace>`

### **Learning Path Suggestions**

1. Start simple: static JSON data, basic queries
2. Add relationships: nested queries, resolvers
3. Add mutations: update cache, optimistic updates (in-memory or JSON write-back)
4. Add complexity: pagination, filtering, search (using array methods)
5. Optimize: caching strategies, query batching
6. Advanced: subscriptions, authentication (if needed)

### **Data Model Suggestion**

For wine data, consider this JSON structure:

**varietals.json**
```json
[
  {
    "id": "1",
    "name": "Cabernet Sauvignon",
    "color": "Red",
    "description": "Full-bodied red with notes of dark fruit and oak."
  }
]
```

**wineries.json**
```json
[
  {
    "id": "1",
    "name": "Silver Oak Cellars",
    "region": "Napa Valley",
    "country": "USA",
    "founded": 1972,
    "description": "Known for Cabernet Sauvignon wines aged in American oak."
  }
]
```

**wines.json**
```json
[
  {
    "id": "1",
    "name": "Silver Oak Napa Valley Cabernet Sauvignon 2018",
    "varietalId": "1",
    "wineryId": "1",
    "vintage": 2018,
    "abv": 14.2,
    "price": 125,
    "tastingNotes": "Blackberry, cassis, dark chocolate, and toasted oak."
  }
]
```

This provides enough relationships to learn GraphQL concepts without database complexity.

### **Benefits of Static JSON Approach**

- ✅ Simpler setup - no database installation or configuration
- ✅ Easy to modify data - just edit JSON files
- ✅ Fast development - no migrations or seed scripts needed
- ✅ Perfect for learning - focus on GraphQL concepts, not database
- ✅ Portable - easy to share or version control data
- ✅ Can easily migrate to database later if needed

### **Benefits of Monorepo Setup**

- ✅ Single repository - easier to manage and version control
- ✅ Shared dependencies - hoisted to root, reducing duplication
- ✅ Shared types - easy to share TypeScript types between client/server
- ✅ Atomic commits - changes to client and server together
- ✅ Simplified development - run both servers with one command
- ✅ Code generation - GraphQL schema can generate types for both workspaces
- ✅ Easier refactoring - rename types/utilities across workspaces
