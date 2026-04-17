import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from "react-icons/vsc";
import Dock from "./Componentes/Base/Dock";
import Header from "./Componentes/Base/Header";

export default function LayoutHeader() {
  const navigate = useNavigate();

  const [usuarioAtivo, setUsuarioAtivo] = useState(() => {
    const id = localStorage.getItem("selected_user_id");
    const nome = localStorage.getItem("selected_user_name");

    return id ? { id: Number(id), nome } : null;
  });

  const items = [
    {
      icon: <VscHome size={18} />,
      label: 'Principal',
      onClick: () => navigate('/app/home'),
    },
    {
      icon: <VscArchive size={18} />,
      label: 'Histórico',
      onClick: () => navigate('/app/historico'),
    },
    {
      icon: <VscAccount size={18} />,
      label: 'Paciente',
      onClick: () => navigate(`/config/paciente/${usuarioAtivo?.id || 1}`),
    },
    {
      icon: <VscSettingsGear size={18} />,
      label: 'Configurações',
      onClick: () => navigate('/config/configuracoes'),
    },
  ];

  return (
    <>
      <Header paciente={usuarioAtivo} />
      <Dock items={items} />
      <Outlet context={{ usuarioAtivo, setUsuarioAtivo }} />
    </>
  );
}