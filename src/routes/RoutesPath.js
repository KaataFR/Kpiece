import React from "react";
import { Routes, Route, BrowserRouter, Redirect } from "react-router-dom";
import Layout from "../layouts/Layout";
import Accueil from "../pages/Accueil/Accueil";
import Scan from "../pages/Scan/Scan";
import Recherche from "../pages/Recherche/Recherche";
import NotFound from "../pages/NotFound/NotFound";

function RoutesPath() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              window.location.pathname === "/" ||
              window.location.pathname === "/accueil" ? (
                <Redirect to="/accueil" />
              ) : (
                <Accueil />
              )
            }
          />
          <Route path="/scans/:scan" element={<Scan />} />
          <Route path="/recherche/:searchTerm" element={<Recherche />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default RoutesPath;
