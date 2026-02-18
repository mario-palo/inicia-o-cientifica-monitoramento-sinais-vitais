import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../css/VerPacientes.css'

const VerPacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarPacientes = async () => {
      try {
        // Chamada para a rota que criamos no Backend
        const res = await axios.get('http://localhost:8080/pacientes');
        setPacientes(res.data);
      } catch (err) {
        console.error("Erro ao carregar lista de pacientes", err);
      } finally {
        setCarregando(false);
      }
    };

    buscarPacientes();
  }, []);

  if (carregando) return <p>Carregando pacientes...</p>;

  return (
    <div className="lista-container">
      <h2>Pacientes Internados</h2>
      <div className="grid-pacientes">
        {pacientes.map(paciente => (
          <Link to={`/paciente/${paciente.id}`} key={paciente.id} className="card-paciente">
            <div className="foto-perfil">
              {/* Se não tiver foto no banco, usamos as iniciais ou um placeholder */}
              {paciente.nome.charAt(0)}
            </div>
            <div className="info-resumo">
              <h3>{paciente.nome}</h3>
              <p>Leito: {paciente.leito || 'N/A'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VerPacientes;