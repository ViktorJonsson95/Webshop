import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import TestShop from './components/TestShop';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <h1>App</h1>
      <TestShop></TestShop>
    </QueryClientProvider>
  )
}

export default App