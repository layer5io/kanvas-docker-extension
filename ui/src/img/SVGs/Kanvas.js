import React from "react";

const Kanvas = ({ height = 70, width = 72, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 135 136"
      height={height}
      width={width}
      fill="none"
      {...props}
    >
      <defs>
        <linearGradient id="paint0_linear_4485_12569" x1="47.8243" y1="132.582" x2="112.578" y2="2.09647" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00B39F"/>
          <stop offset="1" stopColor="#00D3A9"/>
        </linearGradient>
      </defs>
      <path
        d="M0 0H107.969C123.574 0 135 11.4264 135 27.0312V135.188H27.0312C11.4264 135.188 0 123.761 0 108.156V0Z"
        fill="url(#paint0_linear_4485_12569)"
      />
      <path
        d="M41.3506 26.7969H54.1025V48.4219H48.2822V32.6172H41.3506V26.7969Z"
        fill="white"
      />
      <path
        d="M41.3506 63.8906H54.1025V69.7109H41.3506V63.8906Z"
        fill="white"
      />
      <path
        d="M41.3506 85.5156H54.1025V91.3359H41.3506V85.5156Z"
        fill="white"
      />
      <path
        d="M69.7109 26.7969H82.4629V48.4219H76.6426V32.6172H69.7109V26.7969Z"
        fill="white"
      />
      <path
        d="M69.7109 63.8906H82.4629V69.7109H69.7109V63.8906Z"
        fill="white"
      />
      <path
        d="M69.7109 85.5156H82.4629V91.3359H69.7109V85.5156Z"
        fill="white"
      />
    </svg>
  );
};

export default Kanvas;
