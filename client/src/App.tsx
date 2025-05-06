import { createBrowserRouter, RouterProvider } from "react-router";
import Hitters from "./components/Hitters/Hitters";
import Pitchers from "./components/Pitchers/Pitchers";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div
          style={{ display: "flex", flexDirection: "column", padding: "4rem" }}
        >
          <a href="/hitters" style={{ marginBottom: "2rem" }}>
            Hitters
          </a>
          <a href="/pitchers">Pitchers</a>
        </div>
      ),
    },
    { path: "/hitters", element: <Hitters /> },
    { path: "/pitchers", element: <Pitchers /> },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
