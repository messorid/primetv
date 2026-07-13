'use client';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export default function DashboardPage() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch('/api/leads');
        const data = await res.json();
        if (data.success) {
          setLeads(data.leads);
          setFilteredLeads(data.leads);
        }
      } catch (error) {
        console.error('Error al cargar leads', error);
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
          lead.email?.toLowerCase().includes(value)
      )
    );
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este lead?')) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setLeads(leads.filter((lead) => lead._id !== id));
        setFilteredLeads(filteredLeads.filter((lead) => lead._id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar lead', error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, "leads-primetv.xlsx");
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Leads</h1>
        <button
          onClick={exportToExcel}
          className="self-start sm:self-auto bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition"
        >
          Exportar a Excel
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Buscar por nombre o email…"
        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 w-full mb-4"
      />

      {loading ? (
        <p className="text-center py-20 text-gray-400">Cargando leads…</p>
      ) : filteredLeads.length === 0 ? (
        <p className="text-center py-16 text-gray-400">No hay leads para mostrar.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="border-b border-gray-100 px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide whitespace-nowrap">Nombre</th>
                  <th className="border-b border-gray-100 px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide whitespace-nowrap">Email</th>
                  <th className="border-b border-gray-100 px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide whitespace-nowrap">Teléfono</th>
                  <th className="border-b border-gray-100 px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide whitespace-nowrap">Fecha</th>
                  <th className="border-b border-gray-100 px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide whitespace-nowrap">TV</th>
                  <th className="border-b border-gray-100 px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide whitespace-nowrap">Tamaño</th>
                  <th className="border-b border-gray-100 px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide whitespace-nowrap">Comentarios</th>
                  <th className="border-b border-gray-100 px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{lead.fullName}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.email}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.phone}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.brandOrType}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.tvSize}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">{lead.comments}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold transition"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
