'use client'
import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "@/components/FooterUser";

const HomePage: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  const handleClick = (id: number) => {
    setSelected(id === selected ? null : id); // Toggle the selected state
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="relative w-full h-screen">
          <Slider {...settings}>
            <div>
              <div
                className="relative w-full h-screen bg-cover bg-center"
                style={{ backgroundImage: "url('/assets/fond3.jpg')" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <h1 className="text-3xl md:text-5xl font-bold text-center text-white">
                    Oubliez les fichiers Excel
                  </h1>
                </div>
              </div>
            </div>
            <div>
              <div
                className="relative w-full h-screen bg-cover bg-center"
                style={{ backgroundImage: "url('/assets/fond8.jpg')" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-3xl md:text-5xl font-bold text-center text-white">
                    DUERPENLIGNE crée votre DUERP facilement
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div
                className="relative w-full h-screen bg-cover bg-center"
                style={{ backgroundImage: "url('/assets/fond12.jpg')" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-3xl md:text-5xl font-bold text-center text-white">
                    DUERPENLIGNE offre un guide complet et sécurisé pour évaluer
                    les risques professionnels
                  </p>
                </div>
              </div>
            </div>
          </Slider>
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <button className="text-blue-900 font-bold bg-white border border-blue-900 py-2 px-6 text-lg md:text-2xl flex items-center justify-center hover:bg-blue-900 hover:text-white transition-colors duration-300 rounded-full">
              Voir les détails
            </button>
            <button className="text-blue-900 font-bold bg-white border border-blue-900 py-2 px-6 text-lg md:text-2xl flex items-center justify-center hover:bg-blue-900 hover:text-white transition-colors duration-300 rounded-full">
              Lancez dès maintenant
            </button>
          </div>
        </div>

        <h1 className="m-auto text-center font-waterfall text-4xl md:text-7xl text-purple-600 font-bold my-14 md:my-28">
          Comment garantir la sécurité au travail efficacement ?
        </h1>

        <section className="flex flex-col md:flex-row justify-center p-8 mt-28 space-y-8 md:space-y-0 md:space-x-8">
          <div
            className="bg-white shadow-md rounded-lg p-6 transition-transform duration-300 ease-in-out transform hover:scale-105"
            style={{
              maxWidth: "24rem",
              color: "#0732EF",
              border: "4px solid white",
              boxShadow:
                "0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)",
            }}
          >
            <Image
              src="/assets/gif4.gif"
              alt="Description de l'image 1"
              width={60}
              height={40}
              className="rounded-md m-auto"
            />
            <h5 className="text-xl font-bold mb-4 text-center md:text-left">
              Quelles sont vos obligations?
            </h5>
            <p className="text-base text-center md:text-left">
              En tant qu'employeur, vous devez assurer la sécurité et la santé
              des travailleurs (Art. L. 4121-1). Le non-respect de cette
              obligation peut entraîner une amende de 1.500 €, doublée en cas de
              récidive dans un an (C. Trav., R. 4741-1).
            </p>
          </div>

          <div
            className="bg-white shadow-md rounded-lg p-6 transition-transform duration-300 ease-in-out transform hover:scale-105"
            style={{
              maxWidth: "24rem",
              color: "#0732EF",
              border: "4px solid white",
              boxShadow:
                "0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)",
            }}
          >
            <Image
              src="/assets/gif2.gif"
              alt="Description de l'image 2"
              width={60}
              height={40}
              className="rounded-md m-auto"
            />
            <h5 className="text-xl font-bold mb-4 text-center md:text-left">
              Un accompagnement sur-mesure pour répondre à vos besoins
              spécifiques
            </h5>
            <p className="text-base text-center md:text-left">
              Que vous soyez novice en matière de prévention des risques
              professionnels ou que vous souhaitiez simplement fiabiliser votre
              démarche, notre site vous offre un accompagnement sur-mesure.
            </p>
          </div>

          <div
            className="bg-white shadow-md rounded-lg p-6 transition-transform duration-300 ease-in-out transform hover:scale-105"
            style={{
              maxWidth: "24rem",
              color: "#0732EF",
              border: "4px solid white",
              boxShadow:
                "0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19)",
            }}
          >
            <Image
              src="/assets/gif3.gif"
              alt="Description de l'image 3"
              width={80}
              height={60}
              className="rounded-md m-auto"
            />
            <h5 className="text-xl font-bold mb-4 text-center md:text-left">
              Un gain de temps et d'expertise pour une prévention efficiente
            </h5>
            <p className="text-base text-center md:text-left">
              DUERPenligne vous fait gagner du temps et vous aide à vous
              concentrer sur
              l'essentiel en automatisant les tâches et en fournissant une
              expertise personnalisée, assurant une prévention des risques
              professionnels conforme.
            </p>
          </div>
        </section>

        <div className="flex justify-center mt-16">
          <button className="text-blue-900 font-bold bg-white border border-blue-900 py-3 px-8 text-lg md:text-2xl hover:bg-blue-900 hover:text-white transition-colors duration-300 rounded-full">
            Prenez le départ
          </button>
        </div>
      </div>

      <section className="relative flex flex-col md:flex-row h-auto mt-20 md:mt-36 bg-[#D9E0E8]">
        <div className="flex-1 max-w-full md:max-w-1/2 text-center p-6 md:p-32">
          <h1 className="text-2xl md:text-4xl font-bold text-[#0732EF] mb-4 md:mb-8 transition-transform transform hover:scale-110 duration-500">
            Un DUERP complet et conforme
          </h1>
          <h3 className="text-lg md:text-2xl text-gray-700 mb-4 md:mb-6 transition-opacity duration-500 hover:opacity-75">
            DUERP en ligne : Fini le papier, vivez la prévention durable
          </h3>
          <p className="text-base md:text-xl text-gray-800 leading-relaxed transition-transform transform hover:translate-x-2 duration-500">
            Accédez à votre DUERP personnalisé, modifiable et accessible à tout
            moment, depuis n'importe où, sans gaspillage de papier.
          </p>
          <div className="flex justify-center md:justify-start mt-8 md:mt-16">
          <button className="text-white font-bold bg-blue-900 py-3 px-8 text-lg md:text-2xl hover:bg-blue-700 transition-colors duration-300 rounded-full">
              En savoir plus
            </button>
          </div>
        </div>

        <div className="flex-1 max-w-full md:max-w-1/2 flex justify-center items-center">
          <Image
            src="/assets/duerp-digital.png"
            alt="Illustration DUERP digital"
            width={500}
            height={400}
            className="rounded-lg shadow-lg transform transition-transform hover:scale-105 duration-300"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
