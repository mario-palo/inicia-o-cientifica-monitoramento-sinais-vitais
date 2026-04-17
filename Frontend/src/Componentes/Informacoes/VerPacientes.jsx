import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Users, UserPlus, ShieldPlus, Menu, X, Activity, Search, ChevronRight, Loader2 } from "lucide-react";
import '../../css/VerPacientes.css';

const VerPacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);
  const [busca, setBusca] = useState("");

  const buscarPacientes = useCallback(async () => {
    try {
      setCarregando(true);
      const { data } = await axios.get('http://localhost:8080/pacientes');
      setPacientes(data);
    } catch (err) {
      setPacientes([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscarPacientes();
  }, [buscarPacientes]);

  const pacientesFiltrados = pacientes.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  if (carregando) {
    return (
      <div className="status-screen">
        <Loader2 className="spinner" size={40} />
        <p>SINCRONIZANDO BANCO DE DADOS...</p>
      </div>
    );
  }

  return (
    <div className="lista-screen">
      <div className="side-menu-container">
        <button className="menu-toggle-btn" onClick={() => setMenuAberto(!menuAberto)}>
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {menuAberto && (
          <div className="floating-menu">
            <Link to="/config/verPacientes" className="menu-item active">
              <Users size={18} />
              <span>Ver Pacientes</span>
            </Link>
            <Link to="/config/cadastrarPaciente" className="menu-item">
              <UserPlus size={18} />
              <span>Cadastrar Paciente</span>
            </Link>
            <Link to="/config/cadastrarProfissional" className="menu-item">
              <ShieldPlus size={18} />
              <span>Cadastrar Profissional</span>
            </Link>
          </div>
        )}
      </div>

      <div className="lista-content">
        <header className="lista-header">
          <div className="header-titles">
            <div className="badge-system">SISTEMA DE MONITORAMENTO</div>
            <h1>PACIENTES INTERNADOS</h1>
          </div>
          
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="BUSCAR PELO NOME..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </header>

        <div className="grid-pacientes">
          {pacientesFiltrados.length > 0 ? (
            pacientesFiltrados.map(paciente => (
              <Link to={`/config/paciente/${paciente.id}`} key={paciente.id} className="card-paciente">
                <div className="card-visual">
                  <div className="foto-avatar">
                    {paciente.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="pulse-indicator"></div>
                </div>
                
                <div className="card-info">
                  <h3>{paciente.nome.toUpperCase()}</h3>
                  <div className="meta-info">
                    <span className="leito-badge">LEITO: {paciente.leito || 'N/A'}</span>
                  </div>
                </div>

                <div className="card-arrow">
                  <ChevronRight size={20} />
                </div>
              </Link>
            ))
          ) : (
            <div className="empty-state">
              <Activity size={40} strokeWidth={1} />
              <p>NENHUM REGISTRO LOCALIZADO NO MOMENTO</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerPacientes;