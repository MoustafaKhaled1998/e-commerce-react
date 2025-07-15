import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import CardDetails from "./pages/CardDetails";
import Wishlist from "./pages/Wishlist";

function AppContent() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: "login",
          element: <Login />
        },
        {
          path: "register",
          element: <Register />
        },
        {
          path: "cart",
          element: (
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          )
        },
        {
          path: "wishlist",
          element: <Wishlist />
        },
        {
          path: "card-details/:id",
          element: <CardDetails />
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <AppProvider>
      <CartProvider>
        <SearchProvider>
          <AppContent />
        </SearchProvider>
      </CartProvider>
    </AppProvider>
  );
}

export default App;
