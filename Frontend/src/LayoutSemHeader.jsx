import { Outlet, useNavigate } from "react-router-dom";
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from "react-icons/vsc";
import Dock from "./Componentes/Base/Dock";

export default function LayoutSemHeader() {
  const navigate = useNavigate();

  const items = [
    {
      icon: <VscHome size={18} />,
      label: "Principal",
      onClick: () => navigate("/app/home"),
    },
    {
      icon: <VscArchive size={18} />,
      label: "Histórico",
      onClick: () => navigate("/app/historico"),
    },
    {
      icon: <VscAccount size={18} />,
      label: "Paciente",
      onClick: () => {
        const id = localStorage.getItem("selected_user_id") || "1";
        navigate(`/config/paciente/${id}`);
      },
    },
    {
      icon: <VscSettingsGear size={18} />,
      label: "Configurações",
      onClick: () => navigate("/config/configuracoes"),
    },
  ];

  return (
    <>
      <Dock items={items} />
      <Outlet />
    </>
  );
}