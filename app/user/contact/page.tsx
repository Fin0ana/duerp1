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
<div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 via-teal-50 to-indigo-50">
  <Navbar />

  <div className="flex justify-center items-center bg-gray-100 py-8 transition-all duration-500 my-28">
    <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-4 lg:mx-auto bg-white rounded-xl shadow-lg">
      {/* Formulaire */}
      <div className="lg:w-1/2 border-l-4 border-r-4 border-gray-200 p-8 shadow-md rounded-md bg-gradient-to-r from-blue-100 via-indigo-50 to-teal-50">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="fullname" className="text-gray-600 font-semibold">Nom</label>
          <input
            type="text"
            id="fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Votre nom"
            className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:border-blue-500 transition duration-300 hover:shadow-lg"
          />

          <label htmlFor="email" className="text-gray-600 font-semibold">E-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre mail professionnel"
            className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:border-blue-500 transition duration-300 hover:shadow-lg"
          />

          <label htmlFor="phone" className="text-gray-600 font-semibold">Téléphone</label>
          <div className="flex items-center border border-gray-300 rounded-md w-full">
            <span className="p-2 bg-gray-200 text-gray-700">+33</span>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="123456789"
              className="p-2 rounded-md w-full focus:outline-none focus:border-blue-500 transition duration-300 hover:shadow-lg"
              style={{ border: 'none' }}
            />
          </div>

          <label htmlFor="requete" className="text-gray-600 font-semibold">Requête</label>
          <select
            id="requete"
            value={requete}
            onChange={(e) => setRequete(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:border-blue-500 transition duration-300 hover:shadow-lg"
          >
            <option value="Information">Information</option>
            <option value="Réclamation">Réclamation</option>
            <option value="Autre">Autre</option>
          </select>

          <label htmlFor="message" className="text-gray-600 font-semibold">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Entrez votre message ici..."
            className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:border-blue-500 transition duration-300 hover:shadow-lg"
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
      <div className="lg:w-1/2 flex flex-col items-center p-8 bg-gradient-to-r from-teal-50 to-indigo-50 rounded-md shadow-md">
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
            className="rounded-md object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>
    </div>
  </div>

  <Footer />
</div>

  );
}