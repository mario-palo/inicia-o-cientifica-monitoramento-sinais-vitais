import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './index.css';

import LayoutHeader from "./LayoutHeader.jsx";
import LayoutSemHeader from "./LayoutSemHeader.jsx";
import Principal from "./Componentes/Principal/Principal.jsx";
import Temperatura from './Componentes/Principal/Temperatura.jsx';
import Eletrocardio from './Componentes/Principal/Eletrocardiograma.jsx';
import Oxigenacao from './Componentes/Principal/Oxigenacao.jsx';
import Historico from './Componentes/Historico/Historico.jsx';
import CadastrarPaciente from './Componentes/Informacoes/CadastrarPaciente.jsx';
import CadastrarProfissional from './Componentes/Informacoes/CadastrarProfissional.jsx';
import Paciente from './Componentes/Informacoes/Paciente.jsx';
import VerPacientes from './Componentes/Informacoes/VerPacientes.jsx';
import VerificadorDeCodigo from './Componentes/Informacoes/VerificadorDeCodigo.jsx';
import RegistroInicialProfissional from './Componentes/Informacoes/RegistroInicialProfissional.jsx';
import EditarPaciente from './Componentes/Informacoes/EditarPaciente.jsx';
import Configuracoes from './Componentes/Configurações/Configuracoes.jsx';
import UserSelector from './Componentes/UserSelector.jsx';
import historicoLoader from "./Loaders/historicoLoader";

const router = createBrowserRouter([
  {
    path: "/registro-inicial",
    element: <RegistroInicialProfissional />
  },
  {
    path: "/",
    element: <VerificadorDeCodigo />
  },
  {
    path: "/userSelector",
    element: <UserSelector />
  },
  {
    path: "/app",
    element: <LayoutHeader />,
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: "home", element: <Principal /> },
      { path: "ecg", element: <Eletrocardio /> },
      { path: "temperatura", element: <Temperatura /> },
      { path: "oxigenacao", element: <Oxigenacao /> },
      { path: "historico", loader: historicoLoader, element: <Historico /> },
    ],
  },
  {
    path: "/config",
    element: <LayoutSemHeader />,
    children: [
      { index: true, element: <Navigate to="configuracoes" replace /> },
      { path: "paciente/:id", element: <Paciente /> },
      { path: "editarPaciente/:id", element: <EditarPaciente /> },
      { path: "verPacientes", element: <VerPacientes /> },
      { path: "cadastrarProfissional", element: <CadastrarProfissional /> },
      { path: "cadastrarPaciente", element: <CadastrarPaciente /> },
      { path: "configuracoes", element: <Configuracoes /> }
    ],
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);