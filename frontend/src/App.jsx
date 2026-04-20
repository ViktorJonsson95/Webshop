import "./App.css"
import Startpage from "./components/Startpage"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import TestShop from "./dev/TestShop"

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* TestShop ska bytas ut mot startpage */}
      <Startpage></Startpage>
    </QueryClientProvider>
  )
}

export default App
