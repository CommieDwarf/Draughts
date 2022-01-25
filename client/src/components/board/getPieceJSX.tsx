import React from "react";

export type Type = "normal" | "selected" | "locked" | "killable";
export type Color = "black" | "white" | "";

export function getPieceJSX(color: Color, type: Type, queen: boolean = false) {
  if (!color) {
    return <div></div>;
  }
  let [baseClass, centerClass] = getSpecialClass(type, color);


  let piece;

  if (queen) {
    piece = getQueen(color, type);
  } else {
    switch (color) {
      case "black":
        piece = (
          <div className={"piece piece-black " + baseClass}>
            {" "}
            <div className={"piece-center piece-center-black " + centerClass}>
              {" "}
            </div>{" "}
          </div>
        );
        break;
      case "white":
        piece = (
          <div className={"piece piece-white " + baseClass}>
            {" "}
            <div className={"piece-center piece-center-white " + centerClass}>
              {" "}
            </div>{" "}
          </div>
        );
        break;
    }
  }
  return piece;
}

function getQueen(color: Color, type: Type) {
  let [baseClass, centerClass] = getSpecialClass(type, color);
  if (color == "white") {
    return (
      <div className={"piece piece-white " + baseClass}>
        <div className={"piece-center piece-center-white " + centerClass}>
          <div className="pionowa-lewa"></div>
          <div className="pionowa-srodkowa"></div>
          <div className="pionowa-prawa"></div>
          <div className="pozioma-belka">
            <div className="cien-kula1 cien-white cien-kula"></div>
            <div className="cien-kula2 cien-white cien-kula"></div>
            <div className="cien-kula3 cien-white cien-kula"></div>
          </div>
          <div className="cien1 cien-white cien"></div>
          <div className="cien2 cien-white cien"></div>
          <div className="cien3 cien-white cien"></div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={"piece piece-black " + baseClass}>
        <div className={"piece-center piece-center-black " + centerClass}>
          <div className="pionowa-lewa black-crown pionowa-lewa-czarna"></div>
          <div className="pionowa-srodkowa black-crown pionowa-srodkowa-czarna"></div>
          <div className="pionowa-prawa black-crown pionowa-prawa-czarna"></div>
          <div className="pozioma-belka black-crown pozioma-belka-czarna">
            <div className="cien-kula1 cien-black cien-kula"></div>
            <div className="cien-kula2 cien-black cien-kula"></div>
            <div className="cien-kula3 cien-black cien-kula"></div>
          </div>
          <div className="cien1 cien-black cien"></div>
          <div className="cien2 cien-black cien"></div>
          <div className="cien3 cien-black cien"></div>
        </div>
      </div>
    );
  }
}

function getSpecialClass(type: Type, color: Color) {
  let baseClass = "";
  let centerClass = "";
  if (color == "white") {
    switch (type) {
      case "selected":
        baseClass = "white-selected";
        centerClass = "white-center-selected";
        break;
      case "locked":
        baseClass = "white-locked";
        centerClass = "white-center-locked";
        break;
      case "killable":
          baseClass="white-killable";
          centerClass = "white-center-killable";
          break;
      default:
        baseClass = "";
        centerClass = "";
        break;
    }
  } else {
    switch (type) {
      case "selected":
        baseClass = "black-selected";
        centerClass = "black-center-selected";
        break;
        case "killable":
          baseClass = "black-killable";
          centerClass = "black-center-killable";
          break;
      case "locked":
        baseClass = "black-locked";
        centerClass = "black-center-locked";
        break;
      default:
        baseClass = "";
        centerClass = "";
        break;
    }
  }
  return [baseClass, centerClass];
}
