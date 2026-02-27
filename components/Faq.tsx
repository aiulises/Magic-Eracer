import React, { useState } from 'react';

const faqData = [
  {
    question: 'Hvordan fjerner man video vandmærke med Unwatermark.ai vandmærke fjerner?',
    answer: 'Du skal blot uploade din video, bruge vores markeringsværktøj til at fremhæve vandmærket, klikke på "Fjern", og vores AI vil behandle den. Du kan derefter forhåndsvise og downloade resultatet.',
  },
  {
    question: 'Er der en grænse for de videoer, der kan uploades?',
    answer: 'I øjeblikket understøtter vi videoer på op til 500 MB. Understøttede formater inkluderer MP4, MOV, AVI, MKV og WEBM.',
  },
  {
    question: 'Understøtter Unwatermark fjernelse af vandmærker fra lange videoer?',
    answer: 'Ja, Unwatermark kan håndtere videoer af forskellige længder, fra få sekunder til flere minutter lange, så længe de er inden for filstørrelsesgrænsen på 500 MB.',
  },
  {
    question: 'Kan jeg bruge Unwatermark video fjerner på min mobiltelefon?',
    answer: 'Absolut! Vores værktøj er webbaseret og fuldt responsivt, så du kan bruge det på din computer, tablet eller mobiltelefon. Vi tilbyder også en praktisk mobilapp.',
  },
  {
    question: 'Er det helt gratis at fjerne video vandmærke med Unwatermark.ai?',
    answer: 'Ja, Unwatermark tilbyder en gratis service til fjernelse af vandmærker. Du kan bruge vores værktøj uden tilmelding eller betaling for at behandle dine videoer.',
  },
];

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-700">
      <button
        className="w-full flex justify-between items-center text-left py-5 px-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold">{question}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <p className="text-gray-400 pb-5 px-2">{answer}</p>
      </div>
    </div>
  );
};

const Faq: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ofte Stillede Spørgsmål</h2>
        <p className="max-w-xl mx-auto mt-4 text-lg text-gray-400">
            Almindelige spørgsmål om vores video vandmærke fjerner.
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        {faqData.map((item, index) => (
          <FaqItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
};

export default Faq;
