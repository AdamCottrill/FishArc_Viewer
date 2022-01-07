import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import "./App.css";

import theme from "./theme";
import Nav from "./components/Nav";

import { ProjectList } from "./pages/ProjectList";
import { ProjectDetail } from "./pages/ProjectDetail";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
          <BrowserRouter>
            <Nav />
            <Routes>
              <Route path="/" element={<ProjectList />}></Route>
              <Route
                path="project_detail/:prj_cd"
                element={<ProjectDetail />}
              />
              <Route
                path="*"
                element={
                  <main style={{ padding: "1rem" }}>
                    <p>There's nothing here!</p>
                  </main>
                }
              />
            </Routes>
          </BrowserRouter>
        </ChakraProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}

export default App;
