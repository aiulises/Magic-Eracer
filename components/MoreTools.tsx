import React from 'react';

const tools = [
  {
    title: 'Vandmærke Fjerner',
    description: 'Fjern nemt vandmærker fra billeder GRATIS & uden tilmelding.',
    link: '#processor',
  },
  {
    title: 'Video Tekst Fjerner',
    description: 'Tekstfjernelse i høj kvalitet fra videoer GRATIS & uden tilmelding.',
    link: '#processor',
  },
  {
    title: 'Fjern Undertekster fra Video',
    description: 'Fjern alle undertekster fra dine videoer GRATIS.',
    link: '#processor',
  },
];

const MoreTools: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Opdag Flere Online Billede & Video AI Værktøjer</h2>
        <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">
          Udforsk vores omfattende pakke af AI-drevne værktøjer til alle dine medie-redigeringsbehov.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tools.map((tool, index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg p-8 flex flex-col items-start hover:ring-2 hover:ring-purple-500 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-3">{tool.title}</h3>
            <p className="text-gray-400 mb-6 flex-grow">{tool.description}</p>
            <a href={tool.link} className="text-purple-400 hover:text-purple-300 font-semibold flex items-center group">
              Prøv det nu
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MoreTools;