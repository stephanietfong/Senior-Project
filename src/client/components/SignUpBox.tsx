import React from "react";

interface SignUpBoxProps {
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
  borderRadius?: string | number;
  children?: React.ReactNode;
}

export const SignUpBox: React.FC<SignUpBoxProps> = ({
  width = "590px",
  height = "615px",
  backgroundColor = "#7793C2",
  borderRadius = "5px",
  children,
}) => {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor,
        borderRadius,
        padding: "27px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#9CADD8",
          borderRadius,
        }}
      >
        {children}
      </div>
    </div>
  );
};
