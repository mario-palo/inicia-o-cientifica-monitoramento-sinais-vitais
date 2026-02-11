import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import LayoutHeader from "./LayoutHeader.jsx";
import LayoutSemHeader from "./LayoutSemHeader.jsx";
import Principal from "./Componentes/Principal/Principal.jsx";

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Temperatura from './Componentes/Principal/Temperatura.jsx';
import Eletrocardio from './Componentes/Principal/Eletrocardiograma.jsx';
import Oxigenacao from './Componentes/Principal/Oxigenacao.jsx';
import Historico from './Componentes/Historico/Historico.jsx';
import CadastrarPaciente from './Componentes/Informacoes/CadastrarPaciente.jsx';
import CadastrarProfissional from './Componentes/Informacoes/CadastrarProfissional.jsx';
import Paciente from './Componentes/Informacoes/Paciente.jsx';
import VerPacientes from './Componentes/Informacoes/VerPacientes.jsx';
import VerificadorDeCodigo from './Componentes/Informacoes/VerificadorDeCodigo.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutHeader />,
    children: [
      { path: "/", element: <Principal /> },
      { path: "ecg", element: <Eletrocardio /> },
      { path: "temperatura", element: <Temperatura /> },
      { path: "oxigenacao", element: <Oxigenacao /> },
      { path: "historico", element: <VerificadorDeCodigo><Historico /></VerificadorDeCodigo> },
    ],
  },

  {
    path: "/",
    element: <LayoutSemHeader />,
    children: [
      { path: "paciente", element: <VerificadorDeCodigo><Paciente /></VerificadorDeCodigo> },
      { path: "cadastrarPaciente", element: <CadastrarPaciente /> },
      { path: "cadastrarProfissional", element: <CadastrarProfissional/> },
      { path: "verPacientes", element: <VerPacientes /> },
    ],
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
