'use client';
import { useEffect, useState } from 'react';

const STATUS_LABELS = {
  NEW: 'Nuevo',
  CONTACTED: 'Contactado',
  QUOTED: 'Cotizado',
  SCHEDULED: 'Agendado',
  WON: 'Ganado',
  LOST: 'Perdido',
};

const SOURCE_LABELS = {
  META_ADS: 'Meta Ads',
  MESSENGER: 'Messenger',
  INSTAGRAM_DM: 'Instagram DM',
  MANUAL: 'Manual',
  REFERRAL: 'Referido',
  WEBSITE: 'Sitio web',
  OTHER: 'Otro',
};

const STATUS_COLORS = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-amber-100 text-amber-800',
  QUOTED: 'bg-purple-100 text-purple-800',
  SCHEDULED: 'bg-cyan-100 text-cyan-800',
  WON: 'bg-green-100 text-green-800',
  LOST: 'bg-red-100 text-red-800',
};

export default function CrmLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch('/api/crm-leads');
        const data = await res.json();
        if (data.success) {
          setLeads(data.leads);
          setFilteredLeads(data.leads);
        } else {
          setError(data.error || 'No se pudieron cargar los leads del CRM.');
        }
      } catch (err) {
        console.error('Error al cargar leads del CRM', err);
        setError('No se pudieron cargar los leads del CRM.');
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFilteredLeads(
      leads.filter(
        (lead) =>
          lead.fullName?.toLowerCase().includes(value) ||
          lead.email?.toLowerCase().includes(value) ||
          lead.phone?.toLowerCase().includes(value)
      )
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Leads del CRM</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Leads de Meta Lead Ads, Messenger, Instagram DM y entradas manuales, sincronizados
        desde el Sistema Leads PrimeTV.
      </p>

      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Buscar por nombre, email o teléfono"
        className="border rounded p-2 mb-4 w-full max-w-md"
      />

      {loading ? (
        <p className="text-gray-500">Cargando leads...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filteredLeads.length === 0 ? (
        <p className="text-gray-500">No hay leads para mostrar.</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Nombre</th>
                <th className="border p-2 text-left">Contacto</th>
                <th className="border p-2 text-left">Estado</th>
                <th className="border p-2 text-left">Fuente</th>
                <th className="border p-2 text-left">Campaña</th>
                <th className="border p-2 text-left">Agente</th>
                <th className="border p-2 text-left">Valor estimado</th>
                <th className="border p-2 text-left">Creado</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td className="border p-2">
                    {lead.fullName}
                    {lead.lastMessagePreview && (
                      <div className="text-xs text-gray-400 truncate max-w-[200px]">
                        {lead.lastMessagePreview}
                      </div>
                    )}
                  </td>
                  <td className="border p-2">
                    {lead.phone && <div>{lead.phone}</div>}
                    {lead.email && <div className="text-gray-500">{lead.email}</div>}
                  </td>
                  <td className="border p-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_COLORS[lead.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {STATUS_LABELS[lead.status] || lead.status}
                    </span>
                  </td>
                  <td className="border p-2">{SOURCE_LABELS[lead.source] || lead.source}</td>
                  <td className="border p-2">{lead.metaCampaignName || '—'}</td>
                  <td className="border p-2">{lead.assignedTo || 'Sin asignar'}</td>
                  <td className="border p-2">
                    {lead.estimatedValue != null
                      ? `$${Number(lead.estimatedValue).toLocaleString('en-US')}`
                      : '—'}
                  </td>
                  <td className="border p-2">
                    {new Date(lead.createdAt).toLocaleDateString('es-MX')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
