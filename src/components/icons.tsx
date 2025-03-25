import * as React from "react";

import { IconSvgProps } from "@/types";

export const Logo: React.FC<IconSvgProps> = ({
  size = 36,
  height,
  ...props
}) => (
  <svg
    fill="none"
    height={size || height}
    viewBox="0 0 32 32"
    width={size || height}
    {...props}
  >
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const DiscordIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z"
        fill="currentColor"
      />
    </svg>
  );
};

export const TwitterIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"
        fill="currentColor"
      />
    </svg>
  );
};

export const GithubIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const MoonFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
      fill="currentColor"
    />
  </svg>
);

export const SunFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g fill="currentColor">
      <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
      <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
    </g>
  </svg>
);

export const HeartFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z"
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);

export const SearchIcon = (props: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

export const CashRegisterIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      width={size || width}
      height={size || height}
      viewBox="0 0 24 24"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* 1) Pantalla superior */}
      <rect x="4" y="2" width="16" height="4" rx="1" fill="currentColor" />
      
      {/* 2) Cuerpo principal */}
      <rect x="2" y="6" width="20" height="8" rx="2" fill="currentColor" />
      
      {/* 3) Cajón inferior */}
      <rect x="2" y="14" width="20" height="4" rx="1" fill="currentColor" />
      
      {/* 4) Líneas que simulan teclas (con menor opacidad) */}
      <line
        x1="6" y1="7"
        x2="18" y2="7"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      <line
        x1="6" y1="9"
        x2="18" y2="9"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      <line
        x1="6" y1="11"
        x2="18" y2="11"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      <line
        x1="6" y1="13"
        x2="18" y2="13"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
    </svg>
  );
};
export const VerticalDotsIcon = (props:any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 
           2-.9 2-2-.9-2-2-2zm0-6c-1.1 
           0-2 .9-2 2s.9 2 2 2 
           2-.9 2-2-.9-2-2-2zm0 
           12c-1.1 0-2 .9-2 2s.9 
           2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      />
    </svg>
  );
};


export const SENAIcon: React.FC<IconSvgProps> = ({
  size = 36, // tamaño por defecto
  width,
  height,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || width}         // prioridad al prop size, si no, width
      height={size || height}       // prioridad al prop size, si no, height
      viewBox="0 0 900 600"         // viewBox original para mantener proporciones
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <g
        transform="translate(0,600) scale(0.1,-0.1)"
        fill="currentColor"         // Usa currentColor para controlarlo con CSS/Tailwind
        stroke="none"
      >
        <path d="M4420 5994 c-155 -28 -259 -82 -371 -194 -71 -69 -94 -101 -127 -170 -114 -238 -88 -496 71 -705 79 -104 181 -176 316 -222 65 -23 93 -27 196 -27 106 -1 130 2 208 28 166 54 311 179 386 330 184 375 -10 822 -409 940 -55 17 -222 29 -270 20z"/>
        <path d="M2185 4450 c-239 -17 -389 -80 -436 -185 -31 -67 -21 -136 27 -202 48 -63 185 -109 494 -163 197 -35 265 -60 265 -99 0 -54 -110 -88 -245 -77 -133 11 -190 40 -190 98 l0 28 -190 0 -190 0 0 -39 c0 -65 47 -140 110 -178 102 -62 226 -83 478 -83 393 0 612 84 638 245 15 97 -41 181 -153 233 -64 30 -128 44 -473 108 -171 32 -228 88 -129 128 26 11 71 16 132 16 115 0 182 -20 206 -61 l16 -29 178 0 177 0 0 30 c0 79 -72 153 -183 189 -116 37 -335 54 -532 41z"/>
        <path d="M3110 4000 l0 -440 540 0 540 0 0 95 0 95 -342 2 -343 3 0 85 0 85 303 3 302 2 0 90 0 90 -302 2 -303 3 -3 68 -3 67 331 0 330 0 0 95 0 95 -525 0 -525 0 0 -440z"/>
        <path d="M4350 4000 l0 -440 190 0 190 0 0 297 0 297 38 -44 c20 -25 102 -119 182 -211 80 -91 179 -205 220 -252 l75 -87 258 0 257 0 0 440 0 440 -190 0 -190 0 -2 -291 -3 -290 -260 290 -260 290 -252 0 -253 1 0 -440z"/>
        <path d="M6108 4028 c-157 -227 -293 -425 -303 -440 l-17 -28 196 0 196 0 46 80 47 80 308 0 308 0 43 -80 43 -80 218 0 c172 0 217 3 211 13 -4 6 -99 152 -211 322 -113 171 -239 363 -281 427 l-77 118 -221 0 -221 0 -285 -412z m485 -116 c-102 -1 -188 0 -191 3 -5 5 58 113 146 249 l44 68 94 -158 93 -159 -186 -3z"/>
        <path d="M1420 3105 l0 -235 888 0 887 0 52 -24 c58 -27 83 -64 83 -120 0 -43 -23 -88 -277 -526 -590 -1020 -814 -1412 -811 -1419 2 -4 80 -80 174 -169 l171 -160 116 201 c63 111 184 321 267 467 84 146 371 645 638 1110 267 465 518 902 558 972 41 70 74 130 74 133 0 3 -634 5 -1410 5 l-1410 0 0 -235z"/>
        <path d="M4740 3335 c0 -3 66 -117 147 -253 142 -240 338 -571 958 -1622 497 -842 576 -975 584 -983 7 -7 106 82 309 278 l33 31 -532 915 c-292 503 -538 930 -546 949 -18 42 -13 119 11 155 10 15 41 37 69 51 l52 24 883 0 882 0 0 230 0 230 -1425 0 c-784 0 -1425 -2 -1425 -5z"/>
        <path d="M4258 2447 c-204 -347 -937 -1594 -1224 -2082 l-94 -160 206 -103 c113 -57 207 -102 208 -100 1 2 162 273 357 603 619 1048 673 1138 700 1157 53 39 135 40 187 1 23 -18 135 -201 777 -1276 l289 -486 208 107 c114 59 208 111 208 116 0 5 -13 30 -29 55 -16 25 -199 327 -406 671 -208 344 -442 731 -520 860 -78 129 -249 413 -380 630 -131 217 -241 398 -244 402 -4 4 -113 -173 -243 -395z"/>
      </g>
    </svg>
  );
};

