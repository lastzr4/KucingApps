import CatCard, { type CatCardData } from "./CatCard";

export default function CatCardGrid({ cats }: { cats: CatCardData[] }) {
  if (cats.length === 0) {
    return (
      <p className="text-slate-400 text-sm">
        Tiada kucing lagi. Guna Snap & Tag untuk daftar kucing pertama!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cats.map((cat) => (
        <a key={cat.id} href={`/cats/${cat.id}`}>
          <CatCard cat={cat} />
        </a>
      ))}
    </div>
  );
}
