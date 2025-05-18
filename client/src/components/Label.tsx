import React from "react";
import letters from "./Letters";

interface Props {
  side: "top" | "bot" | "left" | "right";
};

export default function Label(props: Props) {
  const isSideTopOrBot = ["top", "bot"].includes(props.side);

  return (
    <div className={`board__${props.side}-label no-select`}>
      {letters.map((letter: string, index: number) => {
        return (
          <div
            className={`board__${props.side}-label-${
              isSideTopOrBot ? "letter" : "num"
            }`} key={index}
          >
            {isSideTopOrBot ? letter : index + 1}
          </div>
        );
      })}
    </div>
  );
}
