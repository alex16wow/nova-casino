import { faq } from '../../data/lobby.jsx';
import { SectionTitle } from '../../components/ui/SectionHead.jsx';
import FaqList from '../../components/ui/FaqList.jsx';

export default function FaqSection() {
  return (
    <section className="faq-section" id="faq" aria-labelledby="faqHeading">
      <div className="section-head"><SectionTitle id="faqHeading" icon="faq-icon.webp" title="Frequently Asked Questions" /></div>
      <FaqList items={faq} />
    </section>
  );
}
