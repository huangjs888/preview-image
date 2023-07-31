/*
 * @Author: Huangjs
 * @Date: 2023-07-28 13:44:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-28 13:51:09
 * @Description: ******
 */
export const loadingIcon = `
  <svg width="100%" height="100%" viewBox="0 0 80 80">
    <defs>
      <linearGradient
        x1="94.0869141%"
        y1="0%"
        x2="94.0869141%"
        y2="90.559082%"
        id="linearGradient-1"
      >
        <stop stop-color="#fff" stop-opacity="0" offset="0%" />
        <stop stop-color="#fff" stop-opacity="0.3" offset="100%" />
      </linearGradient>
      <linearGradient
        x1="100%"
        y1="8.67370605%"
        x2="100%"
        y2="90.6286621%"
        id="linearGradient-2"
      >
        <stop stop-color="#fff" offset="0%" />
        <stop stop-color="#fff" stop-opacity="0.3" offset="100%" />
      </linearGradient>
    </defs>
    <g
      stroke="none"
      stroke-width="1"
      fill="none"
      fill-rule="evenodd"
      opacity="0.9"
    >
      <g>
        <path
          d="M40,0 C62.09139,0 80,17.90861 80,40 C80,62.09139 62.09139,80 40,80 L40,73 C58.2253967,73 73,58.2253967 73,40 C73,21.7746033 58.2253967,7 40,7 L40,0 Z"
          fill="url(#linearGradient-1)"
        />
        <path
          d="M40,0 L40,7 C21.7746033,7 7,21.7746033 7,40 C7,58.2253967 21.7746033,73 40,73 L40,80 C17.90861,80 0,62.09139 0,40 C0,17.90861 17.90861,0 40,0 Z"
          fill="url(#linearGradient-2)"
        />
        <circle id="Oval" fill="#fff" cx="40.5" cy="3.5" r="3.5" />
      </g>
      <animateTransform
        attributeName="transform"
        begin="0s"
        dur="1s"
        type="rotate"
        values="0 40 40;360 40 40"
        repeatCount="indefinite"
      />
    </g>
  </svg>
`;
export const loadingIcon2 = `
  <svg width="100%" height="100%" viewBox="0 0 32 32">
    <circle
      cx="16"
      cy="16"
      r="14"
      fill="none"
      stroke="#666"
      stroke-width="4"
    />
    <circle
      cx="16"
      cy="16"
      r="14"
      fill="none"
      stroke="#fff"
      stroke-width="4"
      stroke-dasharray="30"
      stroke-dashoffset="30"
      stroke-linecap="round"
    />
    <animateTransform
      attributeName="transform"
      dur="1s"
      type="rotate"
      from="0" to="360"
      repeatCount="indefinite"
    />
  </svg>
`;
export const errorIcon = `
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#fff">
    <path
      d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.763-15.864l.11 7.596h1.305l.11-7.596h-1.525zm.759 10.967c.512 0 .902-.383.902-.882 0-.5-.39-.882-.902-.882a.878.878 0 00-.896.882c0 .499.396.882.896.882z" />
  </svg>
`;
