// Icons used only by the support widget. Same stroke style as the site's nav icons.

const icon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };

export const TabIcon = ({ name }) => ({
  home: <svg {...icon} width="22" height="22"><path d="M3 10.5 12 3l9 7.5v10H3z" /><path d="M9 20v-6h6v6" /></svg>,
  messages: <svg {...icon} width="22" height="22"><path d="M4 5h16v11H9l-5 4V5Z" /><path d="M8 9.5h8M8 12.5h5" /></svg>,
  help: <svg {...icon} width="22" height="22"><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.3" /><path d="M12 17h.01" strokeWidth="2.4" /></svg>,
})[name];

export const SendIcon = () => <svg {...icon} width="18" height="18" strokeWidth="2"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>;
export const ArrowIcon = () => <svg {...icon} width="20" height="20" strokeWidth="2"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;
export const SearchIcon = () => <svg {...icon} width="18" height="18" strokeWidth="2"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>;
export const ChatIcon = () => <svg {...icon} width="34" height="34" strokeWidth="1.6"><path d="M4 5h16v11H9l-5 4V5Z" /><path d="M8 9.5h8M8 12.5h5" /></svg>;
export const AgentIcon = () => <svg {...icon} width="22" height="22"><path d="M4 13v-2a8 8 0 0 1 16 0v2M4 11H2v7h4v-7H4Zm16 0h2v7h-4v-7h2Zm0 7c0 3-3 4-7 4" /><path d="M10 21h4" /></svg>;

// "Was this helpful?" faces.
export const FaceIcon = ({ mood }) => (
  <svg {...icon} width="26" height="26" strokeWidth="1.7">
    <circle cx="12" cy="12" r="9" />
    <path d="M9 10h.01M15 10h.01" strokeWidth="2.6" />
    {mood === 'bad' && <path d="M8.5 16.5a4.5 4.5 0 0 1 7 0" />}
    {mood === 'ok' && <path d="M9 15.5h6" />}
    {mood === 'good' && <path d="M8.5 14a4.5 4.5 0 0 0 7 0" />}
  </svg>
);
