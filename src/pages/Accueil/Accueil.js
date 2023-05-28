import React from "react";
import "./Accueil.css";
import Card from "../../components/card/Card";
import scans from "../../assets/data/scans.json";

function Accueil() {
  // Trouver le scan avec le numéro de chapitre le plus élevé
  const latestChapter = scans.reduce((prevScan, currentScan) =>
    parseInt(prevScan.scan, 10) > parseInt(currentScan.scan, 10) ? prevScan : currentScan
  );

  return (
    <div className="Accueil">
      <h2> Dernières sorties </h2>
      <ul>
        {scans.map((scan) => (
          <li key={scan.scan}>
            <Card
              scan={scan.scan}
              title={scan.title}
              pages={scan.pages}
              isNew={scan.scan === latestChapter.scan} // Vérifier si le scan est le plus récent
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Accueil;
