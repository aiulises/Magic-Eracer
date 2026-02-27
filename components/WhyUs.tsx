import React from 'react';

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);


const features = [
    { title: "Perfekt til AI-genereret Indhold", description: "Fjernelse med ét klik for at gendanne din video til dens oprindelige perfektion. Lad dit kreative indhold skinne vandmærkefrit på tværs af alle sociale platforme." },
    { title: "Fungerer med Alle Sociale Medier", description: "Fjern ubesværet vandmærker fra videoer på tværs af populære sociale platforme. Sig farvel til distraherende logoer og nyd en renere seeroplevelse." },
    { title: "Præcis Fjernelse med Pensel & Rektangel", description: "Fjern nemt vandmærker, logoer, billedtekster og andre uønskede elementer ved hjælp af alsidige værktøjer som pensler og markeringsrammer for fuld kontrol." },
    { title: "Videooutput i Høj Kvalitet", description: "Vores banebrydende AI bevarer den originale videokvalitet. Download videoer i høj opløsning og ukomprimeret format." },
    { title: "Understøtter Forskellige Formater & Enheder", description: "Understøtter MP4, M4V, MOV og mere. Brug vores værktøj online på enhver enhed, uanset om det er computer, tablet eller mobil." },
    { title: "Gratis & Ingen Tilmelding Nødvendig", description: "Et gratis online værktøj. Oplev vores funktioner gratis uden at skulle logge ind og se resultater med det samme." }
];

const WhyUs: React.FC = () => {
    return (
        <section className="py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">Kraftfulde Funktioner til Fjernelse af Video Vandmærker</h2>
                    <ul className="space-y-6">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                                <CheckIcon className="h-6 w-6 text-purple-500 mr-4 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg">{feature.title}</h3>
                                    <p className="text-gray-400">{feature.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="order-1 lg:order-2 flex justify-center">
                    <img src="https://images.unsplash.com/photo-1574717519105-04ac4631349f?q=80&w=1200&auto=format&fit=crop" alt="Video editing showcase" className="rounded-2xl shadow-2xl max-w-sm w-full lg:max-w-md aspect-[6/7] object-cover"/>
                </div>
            </div>
        </section>
    );
};

export default WhyUs;
