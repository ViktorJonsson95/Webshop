import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import TestShop from './dev/TestShop';
import ProductPage from './components/ProductPage';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
     
      <ProductPage />
    </QueryClientProvider>
  )
}

export default App