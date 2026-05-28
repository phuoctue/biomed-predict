import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes/router";
import { AppProviders } from "./app/providers/app-providers";

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
