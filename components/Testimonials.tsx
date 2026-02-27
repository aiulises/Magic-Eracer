import React from 'react';

const StarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const GeminiStarIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block h-8 w-8 text-purple-400">
        <path d="M12 2L9.44 9.44L2 12L9.44 14.56L12 22L14.56 14.56L22 12L14.56 9.44L12 2Z" fill="currentColor"/>
    </svg>
);


const testimonials = [
  {
    name: 'Maria K.',
    role: 'Digital Kunstner',
    quote: 'Penselværktøjet er en game-changer! Jeg kan fjerne komplekse og uregelmæssige logoer fra mine billeder med utrolig præcision. Resultatet er fejlfrit hver gang.',
  },
  {
    name: 'Jonas P.',
    role: 'Social Media Manager',
    quote: 'Hastigheden er imponerende. Jeg behandler dusinvis af billeder og videoklip dagligt, og dette værktøj sparer mig for utallige timer. Kvaliteten er altid i top.',
  },
  {
    name: 'Emil Nielsen',
    role: 'Marketing Koordinator',
    quote: 'Jeg er ikke teknisk anlagt, men Unwatermark er så intuitivt. Jeg uploadede, markerede og fjernede et vandmærke på under et minut. Fantastisk og helt gratis!',
  },
   {
    name: 'Sophie L.',
    role: 'Freelance Videograf',
    quote: 'Endelig et værktøj, der virker lige godt til både video og billeder. Beskæringsfunktionen, kombineret med fjernelse, gør min redigeringsproces meget mere strømlinet.',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center justify-center gap-3">
            <GeminiStarIcon /> Drevet af Fantastiske Resultater
        </h2>
        <p className="max-w-xl mx-auto mt-4 text-lg text-gray-400">
            Se hvorfor kreative og professionelle elsker at bruge vores værktøj.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-gray-800 p-8 rounded-lg border border-gray-700">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
            </div>
            <p className="text-gray-300 italic mb-6">"{testimonial.quote}"</p>
            <div>
              <p className="font-bold text-white">{testimonial.name}</p>
              <p className="text-gray-400">{testimonial.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
