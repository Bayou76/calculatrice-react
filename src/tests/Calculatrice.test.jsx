import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import Calculatrice from "../components/Calculatrice"; // Assure-toi que ce chemin correspond à ta structure de dossiers

// Groupe de tests pour le composant Calculatrice
describe("Calculatrice", () => {

  // Test initial : vérifier que l'affichage démarre bien à 0
  test("affiche 0 au démarrage", () => {
    render(<Calculatrice />);
    const display = screen.getByTestId("display"); // Sélectionne l'affichage par son data-testid
    expect(display).toHaveTextContent("0"); // Vérifie que le texte est "0"
  });

  // Test d'addition simple : 1 + 2 = 3
  test("affiche le bon résultat après une addition simple", () => {
    render(<Calculatrice />);
    // Sélection des boutons par leur texte
    const button1 = screen.getByText("1");
    const buttonPlus = screen.getByText("+");
    const button2 = screen.getByText("2");
    const buttonEqual = screen.getByText("=");

    // Simule les clics successifs sur les boutons
    fireEvent.click(button1);
    fireEvent.click(buttonPlus);
    fireEvent.click(button2);
    fireEvent.click(buttonEqual);

    // Vérifie que l'affichage montre bien "3"
    const display = screen.getByTestId("display");
    expect(display).toHaveTextContent("3");
  });

  // Test suppression du dernier caractère avec la touche "Del"
  test("efface le dernier caractère avec Del", () => {
    render(<Calculatrice />);
    const button1 = screen.getByText("1");
    const button2 = screen.getByText("2");
    const buttonDel = screen.getByText("Del");

    // Tape "12"
    fireEvent.click(button1);
    fireEvent.click(button2);
    expect(screen.getByTestId("display")).toHaveTextContent("12");

    // Supprime le dernier chiffre "2"
    fireEvent.click(buttonDel);
    expect(screen.getByTestId("display")).toHaveTextContent("1");
  });

  // Test réinitialisation de l'affichage avec "C"
  test("réinitialise avec C", () => {
    render(<Calculatrice />);
    const button1 = screen.getByText("1");
    const buttonC = screen.getByText("C");

    // Tape "1"
    fireEvent.click(button1);
    expect(screen.getByTestId("display")).toHaveTextContent("1");

    // Réinitialise à 0
    fireEvent.click(buttonC);
    expect(screen.getByTestId("display")).toHaveTextContent("0");
  });

  // Test calcul racine carrée "√"
  test("calcule racine carrée √", () => {
    render(<Calculatrice />);
    const button9 = screen.getByText("9");
    const buttonSqrt = screen.getByText("√");

    // Tape "9" puis racine carrée
    fireEvent.click(button9);
    fireEvent.click(buttonSqrt);

    // Vérifie que l'affichage est "3"
    expect(screen.getByTestId("display")).toHaveTextContent("3");
  });

  // Test gestion d'erreur : opération invalide (ex: + =)
  test("affiche Erreur pour une opération invalide", () => {
    render(<Calculatrice />);
    const buttonPlus = screen.getByText("+");
    const buttonEqual = screen.getByText("=");

    // Tape "+", puis "=" sans opérandes valides
    fireEvent.click(buttonPlus);
    fireEvent.click(buttonEqual);

    // Vérifie que l'affichage affiche "Erreur"
    expect(screen.getByTestId("display")).toHaveTextContent("Erreur");
  });
});
