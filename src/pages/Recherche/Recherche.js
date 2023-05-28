import React from "react";
import scansData from "../../assets/data/scans.json";
import Card from "../../components/card/Card";
import { useParams } from "react-router-dom";
import './Recherche.css';

function Recherche() {
  const { searchTerm } = useParams();

  // Effectuer la recherche en filtrant les scans correspondant au terme de recherche
  const searchResults = scansData.filter((scan) =>
    scan.scan.includes(searchTerm)
  );

  return (
    <div className="search-wrap">
      <h1>Résultats de recherche pour <span className="search-number"> "{searchTerm}"  </span> </h1>

      <ul className="card-list">
        {searchResults.map((scan) => (
          <li key={scan.scan}>
            <Card
              scan={scan.scan}
              title={scan.title}
              pages={scan.pages}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recherche;
