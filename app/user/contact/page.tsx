'use client'
import Navbar from '@/components/Navbar';  // Importation du composant Navbar
import { useState, FormEvent } from "react";
import Image from "next/image";
import Footer from '@/components/FooterUser';

export default function ContactPage() {
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [requete, setRequete] = useState<string>("Information");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="mx-20 lg:mx-60 my-28">
        <h1 className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold mb-8 italic text-blue-600 text-center animate-slide">
          Nous sommes là pour vous aider
        </h1>
      </div>

      <div className="flex justify-center items-center bg-gray-100 py-8">
        <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-4 lg:mx-auto">
          {/* Formulaire */}
          <div className="lg:w-1/2 border-l-4 border-r-4 border-gray-200 p-8 shadow-md rounded-md bg-white">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label htmlFor="fullname">Nom</label>
              <input
                type="text"
                id="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Votre nom"
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:border-blue-500"
              />

              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre mail professionnel"
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:border-blue-500"
              />

              <label htmlFor="phone">Téléphone</label>
              <div className="flex items-center border border-gray-300 rounded-md w-full">
                <span className="p-2 bg-gray-200 text-gray-700">+33</span>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="123456789"
                  className="p-2 rounded-md w-full focus:outline-none focus:border-blue-500"
                  style={{ border: 'none' }}
                />
              </div>

              <label htmlFor="requete">Requête</label>
              <select
                id="requete"
                value={requete}
                onChange={(e) => setRequete(e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:border-blue-500"
              >
                <option value="Information">Information</option>
                <option value="Réclamation">Réclamation</option>
                <option value="Autre">Autre</option>
              </select>

              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Entrez votre message ici..."
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:border-blue-500"
                rows={5}
              ></textarea>

              <button
                type="submit"
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
              >
                Envoyer
              </button>
            </form>
          </div>

          {/* Image */}
          <div className="lg:w-1/2 flex flex-col items-center">
            <h1 className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold mb-16 italic text-blue-600 text-center">
              Pour toute question ou assistance supplémentaire, veuillez remplir ce
              formulaire ou contactez-nous directement aux coordonnées
              fournies.
            </h1>
            <div className="max-w-full">
              <Image
                src="/assets/contact.jpg"
                alt="contact"
                layout="responsive"
                width={500}
                height={800}
                className="rounded-md object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}