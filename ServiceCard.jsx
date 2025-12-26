import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import '../styles/ServiceCard.css';

const STATUS_OPTIONS = [
  'EM ANDAMENTO',
  'CONCLUÍDO',
  'CANCELADO',
  'REPROGRAMADO',
  'IMPEDIMENTO OPERACIONAL'
];

export default function ServiceCard({ service, onUpdate, onDelete }) {
  const [comentario, setComentario] = useState(service.comentario);
  const [repassado, setRepassado] = useState(service.repassado);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handleStatusChange = (status) => {
    onUpdate({ status });
    setShowStatusMenu(false);
  };

  const handleSave = () => {
    onUpdate({ comentario, repassado });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'EM ANDAMENTO': return '#ffc107';
      case 'CONCLUÍDO': return '#28a745';
      case 'CANCELADO': return '#dc3545';
      case 'REPROGRAMADO': return '#9c27b0';
      case 'IMPEDIMENTO OPERACIONAL': return '#ff9800';
      default: return '#0066cc';
    }
  };

  return (
    <div className="service-card">
      <div className="service-header">
        <div className="service-om">
          <span className="label">OM:</span>
          <span className="value">{service.om}</span>
        </div>
        <button
          className="delete-button"
          onClick={onDelete}
          title="Deletar serviço"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="service-body">
        <div className="service-field">
          <label>Operação:</label>
          <p>{service.operacao}</p>
        </div>

        <div className="service-field">
          <label>Pessoas:</label>
          <p>{service.pessoas}</p>
        </div>

        <div className="service-field">
          <label>Descrição do Serviço:</label>
          <p>{service.local || 'N/A'}</p>
        </div>

        <div className="service-field">
          <label>Status do Serviço:</label>
          <div className="status-selector">
            <button
              className="status-button"
              style={{ borderColor: getStatusColor(service.status) }}
              onClick={() => setShowStatusMenu(!showStatusMenu)}
            >
              <span
                className="status-indicator"
                style={{ backgroundColor: getStatusColor(service.status) }}
              ></span>
              {service.status}
            </button>
            {showStatusMenu && (
              <div className="status-menu">
                {STATUS_OPTIONS.map(status => (
                  <button
                    key={status}
                    className="status-option"
                    onClick={() => handleStatusChange(status)}
                    style={{ borderLeftColor: getStatusColor(status) }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="service-field">
          <label>Comentário:</label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Adicione um comentário..."
            rows={3}
            className="comment-input"
          />
        </div>

        <div className="service-field">
          <label>Serviço foi repassado?</label>
          <div className="repassado-selector">
            <button
              className={`repassado-button ${repassado === 'SIM' ? 'active' : ''}`}
              onClick={() => setRepassado('SIM')}
            >
              SIM
            </button>
            <button
              className={`repassado-button ${repassado === 'NÃO' ? 'active' : ''}`}
              onClick={() => setRepassado('NÃO')}
            >
              NÃO
            </button>
          </div>
        </div>

        <button
          className="save-button"
          onClick={handleSave}
        >
          Salvar
        </button>
      </div>
    </div>
  );
}
