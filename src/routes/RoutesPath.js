import React from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import Layout from "../layouts/Layout";
import Accueil from "../pages/Accueil/Accueil";
import Scan from "../pages/Scan/Scan";
import Recherche from "../pages/Recherche/Recherche";
import NotFound from "../pages/NotFound/NotFound";

function RoutesPath() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/Kpiece/" element={<Accueil />} />
          <Route path="Kpiece/scans/:scan" element={<Scan />} />
          <Route path="Kpiece/recherche/:searchTerm" element={<Recherche />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default RoutesPath;
