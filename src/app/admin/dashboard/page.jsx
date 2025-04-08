'use client';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx'; // al principio del archivo

const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(filteredLeads);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
  XLSX.writeFile(workbook, "leads-primetv.xlsx");
};

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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard de Leads</h1>

      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Buscar por nombre o email"
        className="border rounded p-2 mb-4 w-full"
      />

      {loading ? (
        <p className="text-gray-500">Cargando leads...</p>
      ) : filteredLeads.length === 0 ? (
        <p className="text-gray-500">No hay leads para mostrar.</p>
      ) : (
        <div className="overflow-auto">
          <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Buscar por nombre o email"
            className="border rounded p-2 w-full max-w-md"
          />
          <button
            onClick={exportToExcel}
            className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Exportar a Excel
          </button>
        </div>

          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Teléfono</th>
                <th className="border p-2">Fecha</th>
                <th className="border p-2">TV</th>
                <th className="border p-2">Tamaño</th>
                <th className="border p-2">Comentarios</th>
                <th className="border p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead._id}>
                  <td className="border p-2">{lead.fullName}</td>
                  <td className="border p-2">{lead.email}</td>
                  <td className="border p-2">{lead.phone}</td>
                  <td className="border p-2">{new Date(lead.createdAt).toLocaleString()}</td>
                  <td className="border p-2">{lead.brandOrType}</td>
                  <td className="border p-2">{lead.tvSize}</td>
                  <td className="border p-2">{lead.comments}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDelete(lead._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Eliminar
                    </button>
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
