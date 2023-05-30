import React from "react";
import scansData from "../../assets/data/scans.json";
import Card from "../../components/card/Card";
import { useParams } from "react-router-dom";
import './Recherche.css';

function Recherche() {
  const { searchTerm } = useParams();

  // Convertir le terme de recherche en minuscules (ou en majuscules) pour une recherche insensible à la casse
  const searchTermLowerCase = searchTerm.toLowerCase();

  // Effectuer la recherche en filtrant les scans correspondant au terme de recherche et à l'arc (insensible à la casse)
  const searchResults = scansData.filter((scan) =>
    scan.scan.toLowerCase().includes(searchTermLowerCase) ||
    scan.arc.toLowerCase().includes(searchTermLowerCase)
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
