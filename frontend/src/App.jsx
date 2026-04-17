import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import TestShop from './dev/TestShop';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* TestShop ska bytas ut mot startpage */}
      <TestShop></TestShop>
    </QueryClientProvider>
  )
}

export default App