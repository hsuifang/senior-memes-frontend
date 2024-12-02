import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
// common
import Layout from "@/layout/Layout";
import NotFound from "@/NotFound";

// Client
import Home from "@/pages/home";

const RouterElement = () => (
  <>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </>
);

const router = createBrowserRouter(createRoutesFromElements(RouterElement()));

const Router = () => <RouterProvider router={router} />;

export default Router;
