'use client';

export default function ExportButtons() {
  const handleExport = (format: string) => {
    window.open(`/api/export?format=${format}`, '_blank');
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => handleExport('json')}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors">
        JSON
      </button>
      <button onClick={() => handleExport('csv')}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
        CSV
      </button>
      <button onClick={() => handleExport('xlsx')}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
        XLSX
      </button>
    </div>
  );
}
