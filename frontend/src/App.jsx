import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProductPage from './pages/ProductPage'
import './App.css'

// skapar client
const queryClient = new QueryClient()

const App = () => {
  return (
      <QueryClientProvider client={queryClient}>
        <ProductPage />
      </QueryClientProvider>
    )
  }

export default App
