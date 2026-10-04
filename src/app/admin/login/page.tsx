"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e: any) {
    e.preventDefault();
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (res.ok) router.push("/admin/dashboard");
    else setError("Invalid credentials");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full rounded-lg border px-4 py-2" />
        <input required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full rounded-lg border px-4 py-2" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-full bg-brand-600 py-2.5 font-semibold text-white">Login</button>
      </form>
    </div>
  );
}
