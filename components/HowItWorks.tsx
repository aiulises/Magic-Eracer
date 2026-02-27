
import React from 'react';

const steps = [
  {
    title: 'Upload Video',
    description: 'Vælg den fil du vil rense fra din enhed.',
  },
  {
    title: 'Markér Området',
    description: 'Brug vores smarte pensel til at male over vandmærket.',
  },
  {
    title: 'AI Behandling',
    description: 'Vores AI fjerner elementet og udfylder baggrunden.',
  },
  {
    title: 'Download',
    description: 'Hent dit vandmærkefrie resultat med det samme.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 bg-purple-600/5 rounded-[3rem] border border-purple-500/10 mb-20">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Sådan virker det</h2>
          <p className="text-gray-400 text-lg">Fire enkle trin til et professionelt resultat.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center group">
                <div className="w-16 h-16 bg-gray-900 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black text-purple-500 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-xl shadow-purple-500/5">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">{step.description}</p>
                {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(50%+4rem)] w-[calc(100%-8rem)] h-[1px] bg-gradient-to-r from-purple-500/20 to-transparent"></div>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
