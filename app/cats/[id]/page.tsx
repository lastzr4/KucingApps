// Profil Detail Kucing - Sighting Logs, ulasan jiran, butang "Saya Nampak Kucing Ni Hari Ni!"

export default function CatDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Profil Kucing #{params.id}</h1>
      <p className="text-slate-300">Sejarah lokasi & ulasan jiran akan dipaparkan di sini.</p>
      <button className="mt-4 bg-amber-500 text-black font-bold px-4 py-2 rounded-lg">
        Saya Nampak Kucing Ni Hari Ni!
      </button>
    </main>
  );
}
