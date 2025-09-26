import type { SVGProps } from "react";

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={28}
    height={28}
    fill="none"
    {...props}
  >
    <path
      d="M12 2L2 7.5V16.5L12 22L22 16.5V7.5L12 2Z"
      stroke="hsl(var(--primary))"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 11L17 8.25"
      stroke="hsl(var(--primary))"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 11V16.5"
      stroke="hsl(var(--primary))"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 11L7 8.25"
      stroke="hsl(var(--primary))"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Logo;
