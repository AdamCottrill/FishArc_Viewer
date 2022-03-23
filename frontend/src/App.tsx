import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
//import { ReactQueryDevtools } from "react-query/devtools";
import { Provider } from "react-redux";

import "./App.css";

import theme from "./theme";
import Nav from "./components/Nav";
import { store } from "./store/store";

import FN011List from "./pages/FN011List";
import ProjectDetail from "./pages/ProjectDetail";
import FN121 from "./pages/FN121";
import FN123 from "./pages/FN123";
import FN125 from "./pages/FN125";
import FieldStats from "./pages/FieldStats";
import FieldFinder from "./pages/FieldFinder";

const refetchInterval = 1000 * 60 * 60 * 24;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: refetchInterval,
    },
  },
});

const base_url = import.meta.env.BASE_URL;

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <ChakraProvider theme={theme}>
            <BrowserRouter>
              <Nav />

              <Routes>
                <Route
                  path={`${base_url}:source/`}
                  element={<FN011List />}
                ></Route>
                <Route
                  path={`${base_url}:source/project_detail/:prj_cd/`}
                  element={<ProjectDetail />}
                />
                <Route
                  path={`${base_url}:source/samples/:prj_cd/`}
                  element={<FN121 />}
                />
                <Route
                  path={`${base_url}:source/catch_counts/:prj_cd/`}
                  element={<FN123 />}
                />
                <Route
                  path={`${base_url}:source/biosamples/:prj_cd/`}
                  element={<FN125 />}
                />

                <Route
                  path={`${base_url}field_stats/`}
                  element={<FieldStats />}
                />
                <Route
                  path={`${base_url}field_finder/`}
                  element={<FieldFinder />}
                />

                <Route
                  path={`${base_url}`}
                  element={<Navigate to="glarc/" />}
                />

                <Route
                  path={`${base_url}*`}
                  element={
                    <main style={{ padding: "1rem" }}>
                      <p>There's nothing here!</p>
                    </main>
                  }
                />
              </Routes>
            </BrowserRouter>
          </ChakraProvider>
        </QueryClientProvider>
      </Provider>
    </div>
  );
}

export default App;
