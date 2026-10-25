import { ChevronDown } from './icons.jsx';

// Expandable question / answer cards, as in the lobby FAQ. items: [{ question, answer }].
export default function FaqList({ items }) {
  return (
    <div className="faq-list">
      {items.map((item) => (
        <details key={item.question} className="faq-item">
          <summary><span className="faq-question">{item.question}</span><span className="faq-arrow"><ChevronDown /></span></summary>
          <div className="faq-answer"><p>{item.answer}</p></div>
        </details>
      ))}
    </div>
  );
}
