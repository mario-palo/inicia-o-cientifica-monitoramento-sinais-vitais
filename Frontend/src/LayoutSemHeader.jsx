import { Outlet, useNavigate } from "react-router-dom";
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from "react-icons/vsc";
import Dock from "./Componentes/Base/Dock";

export default function LayoutemHeader() {
  const navigate = useNavigate();

  const items = [
    {
      icon: <VscHome size={18} />,
      label: "Principal",
      onClick: () => navigate("/"),
    },
    {
      icon: <VscArchive size={18} />,
      label: "Histórico",
      onClick: () => navigate("/historico"),
    },
    {
      icon: <VscAccount size={18} />,
      label: "Paciente",
      onClick: () => navigate("/paciente"),
    },
    {
      icon: <VscSettingsGear size={18} />,
      label: "Configurações",
      onClick: () => navigate("/config"),
    },
  ];

  return (
    <>
      <Dock items={items} />
      <Outlet />
    </>
  );
}