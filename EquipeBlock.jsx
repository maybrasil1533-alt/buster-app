import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import ServiceCard from './ServiceCard';
import '../styles/EquipeBlock.css';

export default function EquipeBlock({ teamName, services, onUpdateService, onDeleteService }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="equipe-block">
      <button
        className="equipe-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="equipe-info">
          <h3>{teamName}</h3>
          <span className="equipe-count">{services.length} OM(s)</span>
        </div>
        {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </button>

      {isOpen && (
        <div className="equipe-content slide-down">
          <div className="services-grid">
            {services.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onUpdate={(updates) => onUpdateService(service.id, updates)}
                onDelete={() => onDeleteService(service.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
