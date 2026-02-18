import { Outlet } from "react-router-dom"
import Dock from "./Componentes/Base/Dock"
import Header from "./Componentes/Base/Header";
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from "react-icons/vsc"
import { useNavigate } from 'react-router-dom';

export default function LayoutHeader() {

  const navigate = useNavigate();

  const items = [
    {
      icon: <VscHome size={18} />,
      label: 'Principal',
      onClick: () => navigate('/'),
    },
    {
      icon: <VscArchive size={18} />,
      label: 'Histórico',
      onClick: () => navigate('/historico'),
    },
    {
      icon: <VscAccount size={18} />,
      label: 'Paciente',
      onClick: () => navigate('/paciente/1'),
    },
    {
      icon: <VscSettingsGear size={18} />,
      label: 'Configurações',
      onClick: () => navigate('/config'),
    },
  ];


  return (
    <div>
      <Header />
      <Dock items={items} />
      <div>
        <Outlet />
      </div>
    </div>
  )
}
