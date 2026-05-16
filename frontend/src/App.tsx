import { AppRouter } from './router'

/**
 * Root application component.
 * Keeps App.tsx clean — it renders the router and nothing else.
 * Cross-cutting concerns (auth initialization, theme) live here or in providers.
 */
export default function App() {
  return <AppRouter />
}
