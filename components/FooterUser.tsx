import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF } from 'react-icons/fa';
import { AiOutlineTwitter, AiFillYoutube } from 'react-icons/ai';
import { BiLogoPinterestAlt } from 'react-icons/bi';

interface Icon {
  icon: JSX.Element;
  href: string;
  label: string;
}

interface LinkItem {
  href: string;
  label: string;
}

interface FooterSectionProps {
  title: string;
  links: LinkItem[];
}

function FooterSection({ title, links }: FooterSectionProps) {
  return (
    <div className="flex flex-col w-full md:w-1/3 py-4 gap-4 md:gap-6 items-center md:items-start text-center md:text-left">
      <p className="text-xl md:text-2xl font-bold text-white">{title}</p>
      {links.map(({ href, label }, index) => (
        <Link key={index} href={href}>
          <span className="text-base md:text-lg text-white cursor-pointer hover:text-pink-600">
            {label}
          </span>
        </Link>
      ))}
    </div>
  );
}

function Footer() {
  const iconsTab: Icon[] = [
    { icon: <FaFacebookF />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <AiOutlineTwitter />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <AiFillYoutube />, href: 'https://youtube.com', label: 'YouTube' },
    { icon: <BiLogoPinterestAlt />, href: 'https://pinterest.com', label: 'Pinterest' },
  ];

  const legalLinks: LinkItem[] = [
    { href: '/conditions', label: "Conditions d'utilisation" },
    { href: '/confidentialite', label: 'Politique de confidentialité' },
    { href: '/mention-legale', label: 'Mention légale' },
  ];

  const navigationLinks: LinkItem[] = [
    { href: '/Accueil', label: 'Accueil' },
    { href: '/QuiSommesnous', label: 'Qui Sommes-nous' },
    { href: '/Politique', label: 'Politique' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <footer className="bg-gray-700 w-full">
      <div className="container mx-auto py-8 md:py-16 px-4 md:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-0">
          {/* Logo and Social Icons */}
          <div className="flex flex-col w-full md:w-1/3 py-4 gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
            <Link href="/">
              <Image
                src="/assets/logo.png"
                alt="logo"
                width={150}
                height={52}
                className="h-13"
                priority
              />
            </Link>
            <div className="flex gap-4 text-2xl text-gray-600 justify-center md:justify-start">
              {iconsTab.map(({ icon, href, label }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Lien vers ${label}`}
                  className="bg-gray-200 p-2 rounded-full hover:bg-pink-600 hover:text-white transition-all duration-300"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Legal Section */}
          <FooterSection title="Mention Légales" links={legalLinks} />

          {/* Navigation Section */}
          <FooterSection title="Navigation" links={navigationLinks} />
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-8 md:mt-12">
          <p className="text-base md:text-lg font-medium text-white">
            DUERP En ligne | © {new Date().getFullYear()} <br />
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;