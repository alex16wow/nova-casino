import { faq } from '../../data/lobby.jsx';
import { SectionTitle } from '../../components/ui/SectionHead.jsx';
import { ChevronDown } from '../../components/ui/icons.jsx';

export default function FaqSection() {
  return (
    <section className="faq-section" id="faq" aria-labelledby="faqHeading">
      <div className="section-head"><SectionTitle id="faqHeading" icon="faq-icon.webp" title="Frequently Asked Questions" /></div>
      <div className="faq-list">
        {faq.map((item) => (
          <details key={item.question} className="faq-item">
            <summary><span className="faq-question">{item.question}</span><span className="faq-arrow"><ChevronDown /></span></summary>
            <div className="faq-answer"><p>{item.answer}</p></div>
          </details>
        ))}
      </div>
    </section>
  );
}
