"use client";
export default function DeleteButton({ url }: { url: string }) {
  return (
    <button
      className="text-red-600"
      onClick={async () => {
        if (!confirm("Delete?")) return;
        await fetch(url, { method: "DELETE" });
        location.reload();
      }}
    >
      Delete
    </button>
  );
}
