import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useSearch } from "../context/SearchContext";
import Navbar from "./navbar/Navbar";
import Loader from "./Loader";

export default function Layout() {
  const { loading, checkAuth } = useApp();
  const { setSearchTerm } = useSearch();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <Navbar onSearch={setSearchTerm} />
      <Outlet />
      {loading && <Loader />}
    </>
  );
} 