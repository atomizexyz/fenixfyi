import type { SVGProps } from "react";

export function FenixLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M26.287 9.8742C18.8709 4.6608 6.3882 4.07339 0 4C0.587429 10.6819 4.03852 16.3358 5.87421 18.3183C7.78332 15.4546 11.2834 13.4476 12.9967 12.8113C11.4547 11.563 10.9407 9.7273 10.9407 8.3322C14.8324 10.9756 19.8254 10.4134 23.2765 12.2238C26.7276 14.0342 27.1682 18.0246 27.0213 19.8603C25.4059 18.3917 22.2376 18.4075 20.7065 20.5946C17.6225 25.0002 24.0405 29.4152 28.8569 26.1751C33.85 22.8161 32.822 14.133 26.287 9.8742Z"
        fill="url(#fenix-logo-gradient)"
      />
      <defs>
        <linearGradient
          id="fenix-logo-gradient"
          x1="32.0157"
          y1="4.02766"
          x2="1.38497"
          y2="24.537"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F6781A" />
          <stop offset="1" stopColor="#F9386D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FenixWordmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="126"
      height="27"
      viewBox="0 0 126 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.52832 1.16706V26H2.37032V13.7882H9.87477V11.9462H2.37032V3.00906H13.0812V1.16706H0.52832Z"
        fill="currentColor"
      />
      <path
        d="M35.3848 11.9462H27.8804V3.00906H37.2951V1.16706H26.0384V26H38.5913V24.158H27.8804V13.7882H35.3848V11.9462Z"
        fill="currentColor"
      />
      <path
        d="M52.9142 0.348389V26H54.7562V5.39684L72.7328 26.8186V1.16706H70.8908V21.7702L52.9142 0.348389Z"
        fill="currentColor"
      />
      <path d="M89.5936 26V1.16706H87.7516V26H89.5936Z" fill="currentColor" />
      <path
        d="M125.34 25.4201L114.902 12.9695L124.351 1.71284L122.952 0.518944L113.708 11.5368L104.464 0.553055L103.066 1.71284L112.412 12.8672L101.872 25.4201L103.304 26.5799L113.606 14.2998L123.942 26.614L125.34 25.4201Z"
        fill="currentColor"
      />
    </svg>
  );
}
