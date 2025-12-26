import { useState, useEffect } from 'react';
import { Upload, Download, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import EquipeBlock from './EquipeBlock';
import MetricsCard from './MetricsCard';
import '../styles/Dashboard.css';
import * as XLSX from 'xlsx';

export default function Dashboard({ onLogout }) {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('Todas as equipes');
  const [metrics, setMetrics] = useState({
    totalOMs: 0,
    emAndamento: 0,
    concluido: 0,
    cancelado: 0,
    reprogramado: 0,
    impedimento: 0,
  });
  const [fileInput, setFileInput] = useState(null);

  // Carregar dados do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('buster_services');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setServices(data);
      } catch (e) {
        console.error('Erro ao carregar dados:', e);
      }
    }
  }, []);

  // Atualizar métricas quando serviços mudam
  useEffect(() => {
    updateMetrics();
    filterServices();
  }, [services, selectedTeam]);

  const updateMetrics = () => {
    const toCount = selectedTeam === 'Todas as equipes' ? services : services.filter(s => s.equipe === selectedTeam);
    
    setMetrics({
      totalOMs: toCount.length,
      emAndamento: toCount.filter(s => s.status === 'EM ANDAMENTO').length,
      concluido: toCount.filter(s => s.status === 'CONCLUÍDO').length,
      cancelado: toCount.filter(s => s.status === 'CANCELADO').length,
      reprogramado: toCount.filter(s => s.status === 'REPROGRAMADO').length,
      impedimento: toCount.filter(s => s.status === 'IMPEDIMENTO OPERACIONAL').length,
    });
  };

  const filterServices = () => {
    if (selectedTeam === 'Todas as equipes') {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter(s => s.equipe === selectedTeam));
    }
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'array' });
        const newServices = [];

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet);

          rows.forEach((row) => {
            if (row.OM) {
              newServices.push({
                id: Date.now() + Math.random(),
                data: row.Data || new Date().toISOString().split('T')[0],
                om: String(row.OM || ''),
                operacao: row.Operação || '',
                local: row.Local || '',
                centroTrabalho: row.Centro_Trabalho || '',
                horaInicio: row.Hora_Inicio || '',
                horaFim: row.Hora_Fim || '',
                equipe: row.Equipe || sheetName,
                pessoas: row.Pessoas_Equipe || '',
                status: 'EM ANDAMENTO',
                comentario: row.Comentario_Inicial || '',
                repassado: 'NÃO',
              });
            }
          });
        });

        const updated = [...services, ...newServices];
        setServices(updated);
        localStorage.setItem('buster_services', JSON.stringify(updated));
        alert(`${newServices.length} serviços importados com sucesso!`);
      } catch (error) {
        console.error('Erro ao importar:', error);
        alert('Erro ao importar planilha');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    if (services.length === 0) {
      alert('Nenhum serviço para exportar');
      return;
    }

    const exportData = services.map(s => ({
      Data: s.data,
      OM: s.om,
      Operação: s.operacao,
      Local: s.local,
      Centro_Trabalho: s.centroTrabalho,
      Hora_Inicio: s.horaInicio,
      Hora_Fim: s.horaFim,
      Equipe: s.equipe,
      Pessoas_Equipe: s.pessoas,
      Status: s.status,
      Comentário: s.comentario,
      Repassado: s.repassado,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
    XLSX.writeFile(workbook, `Relatorio_BUSTER_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleUpdateService = (id, updates) => {
    const updated = services.map(s => s.id === id ? { ...s, ...updates } : s);
    setServices(updated);
    localStorage.setItem('buster_services', JSON.stringify(updated));
  };

  const handleDeleteService = (id) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    localStorage.setItem('buster_services', JSON.stringify(updated));
  };

  const teams = ['Todas as equipes', ...new Set(services.map(s => s.equipe))];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <img src="/logo.png" alt="BUSTER" className="header-logo" />
            <div className="header-title">
              <h1>Análise de Desempenho</h1>
              <p>BUSTER</p>
            </div>
          </div>
          <button className="logout-button" onClick={onLogout}>
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Filters */}
        <div className="filters-section">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="team-filter"
          >
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>

        {/* Metrics */}
        <div className="metrics-grid">
          <MetricsCard
            title="Total OMs"
            value={metrics.totalOMs}
            color="#0066cc"
            icon="📊"
          />
          <MetricsCard
            title="Em Andamento"
            value={metrics.emAndamento}
            color="#ffc107"
            icon="⏳"
          />
          <MetricsCard
            title="Concluído"
            value={metrics.concluido}
            color="#28a745"
            icon="✓"
          />
          <MetricsCard
            title="Cancelado"
            value={metrics.cancelado}
            color="#dc3545"
            icon="✕"
          />
          <MetricsCard
            title="Reprogramado"
            value={metrics.reprogramado}
            color="#9c27b0"
            icon="🔄"
          />
          <MetricsCard
            title="Impedimento"
            value={metrics.impedimento}
            color="#ff9800"
            icon="⚠"
          />
        </div>

        {/* Import Section */}
        <div className="import-section">
          <h2>Importar Planilha do Dia</h2>
          <div className="import-controls">
            <label className="file-input-label">
              <Upload size={20} />
              Escolher Arquivo
              <input
                ref={setFileInput}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileImport}
                style={{ display: 'none' }}
              />
            </label>
            <span className="file-status">
              {fileInput?.files?.[0]?.name || 'nenhum arquivo selecionado'}
            </span>
          </div>
        </div>

        {/* Services */}
        <div className="services-section">
          <h2>Serviços</h2>
          {filteredServices.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum serviço cadastrado. Importe uma planilha para começar.</p>
            </div>
          ) : (
            <div className="equipes-list">
              {teams
                .filter(team => team !== 'Todas as equipes')
                .filter(team => selectedTeam === 'Todas as equipes' || team === selectedTeam)
                .map(team => (
                  <EquipeBlock
                    key={team}
                    teamName={team}
                    services={services.filter(s => s.equipe === team)}
                    onUpdateService={handleUpdateService}
                    onDeleteService={handleDeleteService}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Export Section */}
        {services.length > 0 && (
          <div className="export-section">
            <button className="export-button" onClick={handleExport}>
              <Download size={20} />
              Exportar Excel do Dia
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>Desenvolvido por <strong>Jean Viana</strong></p>
      </footer>
    </div>
  );
}
