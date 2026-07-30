// Snap & Tag Form - HTML5 Camera API (input capture="environment") + upload ke Cloudinary/Supabase

import SnapTagForm from "@/components/snap/SnapTagForm";

export default function SnapPage() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4 text-white text-center">📸 Snap & Tag</h1>
      <SnapTagForm />
    </main>
  );
}
