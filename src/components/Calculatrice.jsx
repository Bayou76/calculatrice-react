import React, { useState, useEffect, useCallback } from "react";

const Calculatrice = () => {
  // État pour la valeur affichée à l'écran
  const [displayValue, setDisplayValue] = useState("0");

  // Historique des calculs, chargé depuis le localStorage au démarrage
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("calc_history");
    return saved ? JSON.parse(saved) : [];
  });

  // Sauvegarde l'historique dans le localStorage à chaque mise à jour
  useEffect(() => {
    localStorage.setItem("calc_history", JSON.stringify(history));
  }, [history]);

  // Récupère le dernier nombre (après le dernier opérateur) dans la chaîne
  const getLastNumber = (str) => {
    const parts = str.split(/[+\-*/%]/);
    return parts[parts.length - 1];
  };

  // Remplace le dernier nombre dans la chaîne par une nouvelle valeur
  const replaceLastNumber = (str, newValue) => {
    const parts = str.split(/[+\-*/%]/);
    parts[parts.length - 1] = newValue;
    const operators = str.match(/[+\-*/%]/g) || [];
    let result = parts[0];
    for (let i = 0; i < operators.length; i++) {
      result += operators[i] + parts[i + 1];
    }
    return result;
  };

  // Gestionnaire de clics sur les boutons
  const handleClick = useCallback(
    (value) => {
      if (value === "C") {
        // Réinitialiser l'affichage
        setDisplayValue("0");
        return;
      }

      if (value === "Del") {
        // Supprimer le dernier caractère
        if (displayValue.length === 1 || displayValue === "Erreur") {
          setDisplayValue("0");
        } else {
          setDisplayValue(displayValue.slice(0, -1));
        }
        return;
      }

      if (value === "√") {
        // Calculer la racine carrée du dernier nombre
        try {
          const lastNumber = getLastNumber(displayValue);
          if (lastNumber === "") return;
          const sqrtValue = Math.sqrt(parseFloat(lastNumber));
          if (isNaN(sqrtValue)) {
            setDisplayValue("Erreur");
            return;
          }
          setDisplayValue(replaceLastNumber(displayValue, sqrtValue.toString()));
        } catch {
          setDisplayValue("Erreur");
        }
        return;
      }

      if (value === "%") {
        // Convertir le dernier nombre en pourcentage
        try {
          const lastNumber = getLastNumber(displayValue);
          if (lastNumber === "") return;
          const percentValue = parseFloat(lastNumber) / 100;
          setDisplayValue(replaceLastNumber(displayValue, percentValue.toString()));
        } catch {
          setDisplayValue("Erreur");
        }
        return;
      }

      if (value === "=") {
        // Évaluer l'expression mathématique
        try {
          // ATTENTION : eval peut être dangereux en vrai projet, utiliser un parser mathématique sécurisé
          const result = eval(displayValue);
          setHistory((prev) => [...prev, `${displayValue} = ${result}`]);
          setDisplayValue(String(result));
        } catch {
          setDisplayValue("Erreur");
        }
        return;
      }

      if (value === ".") {
        // Empêcher plusieurs points dans un même nombre
        const parts = displayValue.split(/[+\-*/%]/);
        const lastNumber = parts[parts.length - 1];
        if (lastNumber.includes(".")) {
          return;
        }
      }

      if (displayValue === "0" && /[0-9.]/.test(value)) {
        // Remplacer le 0 initial par un nombre
        setDisplayValue(value);
        return;
      }

      if (/[+\-*/%]/.test(value)) {
        // Gérer le remplacement des opérateurs successifs
        if (
          /[+\-*/%]$/.test(displayValue) &&
          !(value === "-" && displayValue.slice(-1) !== "-")
        ) {
          setDisplayValue(displayValue.slice(0, -1) + value);
          return;
        }
      }

      // Ajouter la valeur au display
      setDisplayValue(displayValue + value);
    },
    [displayValue]
  );

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;

      if (/[0-9]/.test(key)) {
        e.preventDefault();
        handleClick(key);
      } else if (key === ".") {
        e.preventDefault();
        handleClick(".");
      } else if (["+", "-", "*", "/", "%"].includes(key)) {
        e.preventDefault();
        handleClick(key);
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        handleClick("=");
      } else if (key === "Escape" || key.toLowerCase() === "c") {
        e.preventDefault();
        handleClick("C");
      } else if (key === "Backspace" || key === "Delete") {
        e.preventDefault();
        handleClick("Del");
      } else if (key === "r") {
        e.preventDefault();
        handleClick("√");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClick]);

  // Boutons de contrôle spéciaux
  const controlButtons = ["Del", "√", "%", "C"];

  // Boutons numériques et opérateurs
  const buttons = [
    "7",
    "8",
    "9",
    "+",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "*",
    "0",
    ".",
    "=",
    "/",
  ];

  // Classe CSS dynamique selon le type de bouton (utilisation de Tailwind CSS)
  const getButtonClass = (btn) => {
    if (btn === "=")
      return "bg-green-500 hover:bg-green-600 text-white shadow-md";
    if (btn === "C") return "bg-red-500 hover:bg-red-600 text-white shadow-md";
    if (["+", "-", "*", "/", "%", "√"].includes(btn))
      return "bg-yellow-400 hover:bg-yellow-500 shadow-inner";
    if (btn === "Del")
      return "bg-purple-500 hover:bg-purple-600 text-white shadow-md";
    return "bg-gray-300 hover:bg-gray-400 shadow-sm";
  };

  return (
    <div
      className="extravagant-wrapper p-6 rounded-xl max-w-xs mx-auto mt-10"
      style={{
        background:
          "linear-gradient(270deg, #ff004c, #ffb300, #00ffe7, #ff004c)",
        backgroundSize: "800% 800%",
        animation: "rainbow 20s ease infinite",
        boxShadow: "0 0 15px 5px rgba(255, 0, 76, 0.7)",
        borderRadius: "1rem",
        borderWidth: "4px",
        borderStyle: "solid",
        borderImageSlice: 1,
        borderImageSource:
          "linear-gradient(45deg, #ff004c, #ffb300, #00ffe7, #ff004c)",
        transition: "box-shadow 0.3s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 0 25px 10px rgba(255, 0, 76, 1), 0 0 40px 15px rgba(255, 179, 0, 0.8)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 0 15px 5px rgba(255, 0, 76, 0.7)";
      }}
    >
      {/* Animation du gradient */}
      <style>{`
        @keyframes rainbow {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }
      `}</style>

        <h1 className="text-4xl font-black mb-5 text-center text-orange-950 drop-shadow-2xl">
          Calculatrice Magique
        </h1>

      <div className="w-64 mx-auto">
        {/* Affichage du calcul en cours */}
        <div
          data-testid="display"
          className="bg-gray-100 p-4 text-right text-3xl mb-4 h-16 break-words rounded"
          style={{ userSelect: "none" }}
        >
          {displayValue}
        </div>

        {/* Boutons de contrôle (clear, delete, racine, %) */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {controlButtons.map((btn) => (
            <button
              key={btn}
              className={`${getButtonClass(btn)} p-4 rounded font-semibold select-none`}
              onClick={() => handleClick(btn)}
              type="button"
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Boutons numériques et opérateurs */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {buttons.map((btn) => (
            <button
              key={btn}
              className={`${getButtonClass(btn)} p-4 rounded font-semibold select-none`}
              onClick={() => handleClick(btn)}
              type="button"
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Historique des calculs */}
        <div className="bg-gray-50 p-3 rounded shadow max-h-40 overflow-auto text-sm text-gray-800">
          <h2 className="font-semibold mb-2 text-gray-700">Historique</h2>
          {history.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucune opération</p>
          ) : (
            <ul>
              {history.map((entry, index) => (
                <li key={index} className="border-b border-gray-200 py-1">
                  {entry}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculatrice;
