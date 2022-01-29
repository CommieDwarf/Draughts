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
          <div className={"piece piece--black " + baseClass}>
            {" "}
            <div className={"piece__center piece__center--black " + centerClass}>
              {" "}
            </div>{" "}
          </div>
        );
        break;
      case "white":
        piece = (
          <div className={"piece piece--white " + baseClass}>
            {" "}
            <div className={"piece__center piece__center--white " + centerClass}>
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
      <div className={"piece piece--white " + baseClass}>
        <div className={"piece__center piece__center--white " + centerClass}>
          <div className="piece__vertical-bar-left piece__vertical-bar-left--white"></div>
          <div className="piece__vertical-bar-mid piece__vertical-bar-mid--white" ></div>
          <div className="piece__vertical-bar-right piece__vertical-bar-right--white"></div>
          <div className="piece__horizontal-bar piece__horizontal-bar--white">
            <div className="piece__circle piece__circle--1 piece__circle--white"></div>
            <div className="piece__circle piece__circle--2 piece__circle--white"></div>
            <div className="piece__circle piece__circle--3 piece__circle--white"></div>
          </div>
          <div className="piece__shadow-bar piece__shadow-bar--1 piece__shadow-bar--white"></div>
          <div className="piece__shadow-bar piece__shadow-bar--2 piece__shadow-bar--white"></div>
          <div className="piece__shadow-bar piece__shadow-bar--3 piece__shadow-bar--white"></div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={"piece piece--black " + baseClass}>
        <div className={"piece__center piece__center--black " + centerClass}>
          <div className="piece__vertical-bar-left piece__vertical-bar-left--black"></div>
          <div className="piece__vertical-bar-mid piece__vertical-bar-mid--black"></div>
          <div className="piece__vertical-bar-right piece__vertical-bar-right--black"></div>
          <div className="piece__horizontal-bar piece__horizontal-bar--black">
            <div className="piece__circle piece__circle--1 piece__circle--black"></div>
            <div className="piece__circle piece__circle--2 piece__circle--black"></div>
            <div className="piece__circle piece__circle--3 piece__circle--black"></div>
          </div>
          <div className="piece__shadow-bar piece__shadow-bar--1 piece__shadow-bar--black"></div>
          <div className="piece__shadow-bar piece__shadow-bar--2 piece__shadow-bar--black"></div>
          <div className="piece__shadow-bar piece__shadow-bar--3 piece__shadow-bar--black"></div>
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
        baseClass = "piece--white-selected";
        centerClass = "piece__center--white-selected";
        break;
      case "locked":
        baseClass = "piece--white-locked";
        centerClass = "piece__center--white-locked";
        break;
      case "killable":
          baseClass="piece--white-killable";
          centerClass = "piece__center--white-killable";
          break;
      default:
        baseClass = "";
        centerClass = "";
        break;
    }
  } else {
    switch (type) {
      case "selected":
        baseClass = "piece--black-selected";
        centerClass = "piece__center--black-selected";
        break;
        case "killable":
          baseClass = "piece--black-killable";
          centerClass = "piece__center--black-killable";
          break;
      case "locked":
        baseClass = "piece--black-locked";
        centerClass = "piece__-center-black-locked";
        break;
      default:
        baseClass = "";
        centerClass = "";
        break;
    }
  }
  return [baseClass, centerClass];
}
