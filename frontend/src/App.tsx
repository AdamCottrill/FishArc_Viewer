import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import "./App.css";

import theme from "./theme";
import Nav from "./components/Nav";

import { ProjectList } from "./pages/ProjectList";
import { ProjectDetail } from "./pages/ProjectDetail";
import { FN121 } from "./pages/FN121";
import { FN123 } from "./pages/FN123";
import { FN125 } from "./pages/FN125";
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
              <Route path="samples/:prj_cd" element={<FN121 />} />
              <Route path="catch_counts/:prj_cd" element={<FN123 />} />
              <Route path="biosamples/:prj_cd" element={<FN125 />} />

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
