import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-8">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
               </svg>
              <span className="text-2xl font-bold">Unwatermark</span>
            </div>
             <p className="text-gray-400">Den Ultimative AI Løsning til Fjernelse af Vandmærker.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Ressourcer</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-purple-400">Hjælpecenter</a></li>
              <li><a href="#" className="hover:text-purple-400">Dokumentation</a></li>
              <li><a href="#" className="hover:text-purple-400">Køreplan</a></li>
              <li><a href="#" className="hover:text-purple-400">Ændringslog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Funktioner</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-purple-400">Partnere</a></li>
              <li><a href="#" className="hover:text-purple-400">Portal</a></li>
              <li><a href="#" className="hover:text-purple-400">Jobs</a></li>
              <li><a href="#" className="hover:text-purple-400">Sponsorer</a></li>
            </ul>
          </div>
           <div>
            <h3 className="font-semibold mb-4">Firma</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-purple-400">Om</a></li>
              <li><a href="#" className="hover:text-purple-400">Priser</a></li>
              <li><a href="#" className="hover:text-purple-400">Karriere</a></li>
              <li><a href="#" className="hover:text-purple-400">Blog</a></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold mb-4">Tilmeld dig vores nyhedsbrev</h3>
            <form className="flex">
              <input type="email" placeholder="Indtast din email" className="w-full bg-gray-800 border border-gray-700 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-r-md">Tilmeld</button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Unwatermark. Alle rettigheder forbeholdes. Lavet med ♥ af Ulises.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
             <a href="#" className="text-gray-500 hover:text-white"><span className="sr-only">Twitter</span><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></a>
            {/* Add more social icons here */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
