import { useSupport } from '../../context/SupportContext.jsx';
import { TabIcon } from './supportIcons.jsx';

const tabs = [
  ['home', 'Home'],
  ['messages', 'Messages'],
  ['help', 'Help'],
];

// Bottom tab bar of the support panel. Hidden while reading an article or inside the chat.
export default function SupportNav() {
  const { state, selectTab } = useSupport();
  return (
    <nav className="nv-support-nav" aria-label="Support sections">
      {tabs.map(([id, label]) => (
        <button key={id} type="button" className={state.tab === id ? 'is-active' : ''} aria-current={state.tab === id ? 'page' : undefined} onClick={() => selectTab(id)}>
          <TabIcon name={id} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
