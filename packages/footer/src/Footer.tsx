import React from "react";
import logo from "@vr/shared/src/assets/logo.png";
import "./styles/main.css";

const year = new Date().getFullYear();

const Footer: React.FC = () => {
  return (
    <footer className="bg-vr-dark text-vr-dark-text mt-12" role="contentinfo">
      <div className="mx-auto max-w-vr-content px-5 pt-8 pb-6 grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)] gap-8">
        <div className="flex flex-col gap-3">
          <img
            src={logo}
            alt="VR"
            className="block w-12 h-12 rounded-xl object-contain"
            width={48}
            height={48}
          />
          <span className="text-base text-[#a5b1aa] max-w-70">
            Conectando bem-estar e produtividade.
          </span>
        </div>

        <nav className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6" aria-label="Rodape">
          <div className="flex flex-col gap-2">
            <h3 className="m-0 mb-2 text-sm uppercase tracking-wider text-white">Produto</h3>
            <a
              className="text-vr-dark-text text-base no-underline transition-colors hover:text-vr-primary focus-visible:text-vr-primary focus-visible:outline-none"
              href="#"
            >
              Catalogo
            </a>
            <a
              className="text-vr-dark-text text-base no-underline transition-colors hover:text-vr-primary focus-visible:text-vr-primary focus-visible:outline-none"
              href="#"
            >
              Beneficios
            </a>
            <a
              className="text-vr-dark-text text-base no-underline transition-colors hover:text-vr-primary focus-visible:text-vr-primary focus-visible:outline-none"
              href="#"
            >
              Parceiros
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="m-0 mb-2 text-sm uppercase tracking-wider text-white">Empresa</h3>
            <a
              className="text-vr-dark-text text-base no-underline transition-colors hover:text-vr-primary focus-visible:text-vr-primary focus-visible:outline-none"
              href="#"
            >
              Sobre
            </a>
            <a
              className="text-vr-dark-text text-base no-underline transition-colors hover:text-vr-primary focus-visible:text-vr-primary focus-visible:outline-none"
              href="#"
            >
              Carreiras
            </a>
            <a
              className="text-vr-dark-text text-base no-underline transition-colors hover:text-vr-primary focus-visible:text-vr-primary focus-visible:outline-none"
              href="#"
            >
              Imprensa
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="m-0 mb-2 text-sm uppercase tracking-wider text-white">Suporte</h3>
            <a
              className="text-vr-dark-text text-base no-underline transition-colors hover:text-vr-primary focus-visible:text-vr-primary focus-visible:outline-none"
              href="#"
            >
              Central de ajuda
            </a>
            <a
              className="text-vr-dark-text text-base no-underline transition-colors hover:text-vr-primary focus-visible:text-vr-primary focus-visible:outline-none"
              href="#"
            >
              Contato
            </a>
            <a
              className="text-vr-dark-text text-base no-underline transition-colors hover:text-vr-primary focus-visible:text-vr-primary focus-visible:outline-none"
              href="#"
            >
              Status
            </a>
          </div>
        </nav>
      </div>

      <div className="border-t border-white/10 px-5 py-4 max-w-vr-content mx-auto flex flex-wrap justify-between gap-2 text-sm text-[#8a958e]">
        <span>&copy; {year} VR Beneficios. Todos os direitos reservados.</span>
        <span>Teste tecnico - Module Federation</span>
      </div>
    </footer>
  );
};

export default Footer;
