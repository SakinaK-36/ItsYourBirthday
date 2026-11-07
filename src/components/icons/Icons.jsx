const baseProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  width: '1em',
  height: '1em',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
};

function Svg({ children, ...props }) {
  return (
    <svg {...baseProps} {...props}>
      {children}
    </svg>
  );
}

export function Heart(props) {
  return (
    <Svg {...props}>
      <path
        fill="currentColor"
        stroke="none"
        d="M12 21s-7.5-4.35-9.5-8.5C1.1 9.4 2.7 5.5 6.3 4.6c2.2-.5 4.4.5 5.7 2.4 1.3-1.9 3.5-2.9 5.7-2.4 3.6.9 5.2 4.8 3.8 7.9C19.5 16.65 12 21 12 21Z"
      />
    </Svg>
  );
}

export function Sparkle(props) {
  return (
    <Svg {...props}>
      <path
        fill="currentColor"
        stroke="none"
        d="M12 1.8c.55 5.5 3.15 8.1 8.65 8.65-5.5.55-8.1 3.15-8.65 8.65-.55-5.5-3.15-8.1-8.65-8.65C8.85 9.9 11.45 7.3 12 1.8Z"
      />
    </Svg>
  );
}

export function Close(props) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}

export function Pencil(props) {
  return (
    <Svg {...props}>
      <path d="M4 20l4.2-1 10.6-10.6a2.1 2.1 0 0 0-3-3L5.2 16 4 20Z" />
      <path d="m13.8 6.2 3 3" />
    </Svg>
  );
}

export function Plus(props) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function Trash(props) {
  return (
    <Svg {...props}>
      <path d="M4 7h16M9 7V5h6v2M7 7l1 12h8l1-12M10 11v4M14 11v4" />
    </Svg>
  );
}

export function Camera(props) {
  return (
    <Svg {...props}>
      <path d="M3 8.5h3l1.3-2h9.4l1.3 2h3v10H3v-10Z" />
      <circle cx="12" cy="13.2" r="3.2" />
    </Svg>
  );
}

export function Calendar(props) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M7.5 3v4M16.5 3v4M3.5 9.5h17" />
    </Svg>
  );
}

export function Check(props) {
  return (
    <Svg {...props}>
      <path d="m5 12.5 4.2 4.2L19 6.8" />
    </Svg>
  );
}

export function Music(props) {
  return (
    <Svg {...props}>
      <path d="M9 18V6.5l10-2v11" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="15.5" r="2.5" />
    </Svg>
  );
}

export function Play(props) {
  return (
    <Svg {...props}>
      <path fill="currentColor" stroke="none" d="M8 5.2v13.6L19 12 8 5.2Z" />
    </Svg>
  );
}

export function Prev(props) {
  return (
    <Svg {...props}>
      <path d="m15 6-6 6 6 6" />
    </Svg>
  );
}

export function Next(props) {
  return (
    <Svg {...props}>
      <path d="m9 6 6 6-6 6" />
    </Svg>
  );
}

export function ArrowRight(props) {
  return (
    <Svg {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </Svg>
  );
}

export function ArrowUp(props) {
  return (
    <Svg {...props}>
      <path d="M12 20V5M6 10l6-6 6 6" />
    </Svg>
  );
}

export function Envelope(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </Svg>
  );
}

export function Quote(props) {
  return (
    <Svg {...props}>
      <path d="M9 10H5c0-3 1.2-5 4-6M19 10h-4c0-3 1.2-5 4-6" />
      <path d="M5 10v4h4v-4M15 10v4h4v-4" />
    </Svg>
  );
}

export function Moon(props) {
  return (
    <Svg {...props}>
      <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />
    </Svg>
  );
}

export function CloudRain(props) {
  return (
    <Svg {...props}>
      <path d="M7 15.5a4.5 4.5 0 1 1 .8-8.9A5.7 5.7 0 0 1 19 9.4a3.2 3.2 0 0 1 .5 6.1H7Z" />
      <path d="m8 18-.7 2M12.5 18l-.7 2M17 18l-.7 2" />
    </Svg>
  );
}

export function Leaf(props) {
  return (
    <Svg {...props}>
      <path d="M20 4C11 4 4 8 4 15c0 3 2 5 5 5 7 0 11-7 11-16Z" />
      <path d="M4 20c2-5 6-9 12-12" />
    </Svg>
  );
}

export function Shield(props) {
  return (
    <Svg {...props}>
      <path d="M12 3 5 6v5.5c0 4.3 2.8 7.4 7 9.5 4.2-2.1 7-5.2 7-9.5V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  );
}

export function Sun(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Svg>
  );
}

export function Star(props) {
  return (
    <Svg {...props}>
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
    </Svg>
  );
}

export function MapPin(props) {
  return (
    <Svg {...props}>
      <path d="M12 21s6.5-5.4 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10" r="2.3" />
    </Svg>
  );
}

export function Utensils(props) {
  return (
    <Svg {...props}>
      <path d="M7 3v7M4.5 3v4.5A2.5 2.5 0 0 0 7 10a2.5 2.5 0 0 0 2.5-2.5V3M7 10v11M16 3c-1.7 2.8-2 6.7 0 9v9M16 3c2 1.5 2.5 6 0 9" />
    </Svg>
  );
}

export function Compass(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.1 5-5 2.1 2.1-5 5-2.1Z" />
    </Svg>
  );
}

export function Coffee(props) {
  return (
    <Svg {...props}>
      <path d="M4 8h13v6.5A4.5 4.5 0 0 1 12.5 19h-4A4.5 4.5 0 0 1 4 14.5V8Z" />
      <path d="M17 9.5h1.5a2.5 2.5 0 0 1 0 5H17M7 3.5c0 1 1 1.3 1 2.5M11 3.5c0 1 1 1.3 1 2.5" />
    </Svg>
  );
}

export function Lock(props) {
  return (
    <Svg {...props}>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" />
    </Svg>
  );
}

export function ImageIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m4 17 5-5 4.5 4.5 2.5-2.5 4 4" />
    </Svg>
  );
}

export function Sliders(props) {
  return (
    <Svg {...props}>
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </Svg>
  );
}

export function Download(props) {
  return (
    <Svg {...props}>
      <path d="M12 3v12M7 10l5 5 5-5M4 20h16" />
    </Svg>
  );
}

export function Upload(props) {
  return (
    <Svg {...props}>
      <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
    </Svg>
  );
}
