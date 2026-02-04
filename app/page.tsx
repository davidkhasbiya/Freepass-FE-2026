"use client";
import { useState, useEffect } from "react";

interface todo {
  id: number;
  title: string;
  complete: boolean;
}

export default function TodoPage() {
  const [todos, setTodos] = useState<todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=10");
        if (!response.ok) {
          throw new Error("Gagal mengambil data dari server.")
        }

        const data = await response.json();
        const contohTugas = [
          "Belajar Next.js Dasar", "Mengerjakan Tugas Kuliah", "Membeli Makan Untuk Makan Siang",
          "Tidur Jam 8 Malam", "Membersihkan Kamar", "Main Bareng Teman", "Sarapan",
          "Olahraga Pagi (Gym)", "Olahrage Sore (Renang)", "Membaca Buku"
        ];

        const formattedData = data.map((item: any, index: number) => ({
          id: item.id,
          title: contohTugas[index] || item.title,
          complete: item.completed,
        }));
        setTodos(formattedData);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan koneksi.");
      } finally {
        setIsLoading(false);
      }
    };

    const saved = localStorage.getItem("my-todo-list");
    if (saved !== null) {
      setTodos(JSON.parse(saved));
      setIsLoading(false);
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("my-todo-list", JSON.stringify(todos));
  }, [todos]);

  const addTodo = async () => {
    if (!newTodo) return;
    try {
      const itemBaru = { id: Date.now(), title: newTodo, complete: false };
      setTodos([itemBaru, ...todos]);
      setNewTodo("");
    } catch (err) {
      setError("Gagal menambah tugas.");
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      setError("Gagal menghapus tugas.");
    }
  };

  const toggleComplete = (id: number) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, complete: !t.complete } : t)));
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center border border-gray-100 rounded-2xl shadow-sm p-8 bg-gray-50">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2 font-sans">My Todo List</h1>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed text-sm">Manajemen tugas harian dan untuk persyaratan
            <span className="text-blue-600 font-semibold">Free Pass BCC Filkom UB 2026</span></p>
          <p className="text-[10px] text-gray-400 mt-4 italic">Assisted by Gemini AI</p>
        </div>

        <p className="text-sm text-blue-800 font-semibold mb-4 bg-blue-50 w-fit px-3 py-1 rounded-full">Kamu punya {todos.length} tugas hari ini</p>

        <div className="flex flex-col sm:flex-row gap-2 mb-8">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Isi tugas harian baru..."
            className="flex-1 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black transition-all"
          />
          <button
            onClick={addTodo}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-800 transition-all font-bold 
            shadow-lg shadow-blue-100 active:scale-95 cursor-pointer"
          >
            Tambah
          </button>
        </div>

        {error && (
          <div className="p-4 mb-4 bg-red-50 text-red-600 rounded-lg text-center border border-red-100">
            ⚠️ {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center p-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {todos.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                <p className="text-gray-400 font-medium">HORE! Tidak ada tugas tersisa hari ini.</p>
              </div>
            ) : (
              todos.map((todo) => (
                <div key={todo.id} className="group p-4 border border-gray-100 rounded-xl shadow-sm flex 
                items-center bg-white hover:border-blue-200 transition-all">
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all ${todo.complete ?
                      "bg-green-500 border-green-500 cursor-pointer" : "border-gray-300 hover:border-green-400 cursor-pointer"}`}
                  >
                    {todo.complete && <span className="text-white text-[10px]">✓</span>}
                  </button>

                  <span
                    className={`flex-1 text-gray-800 font-medium transition-all ${todo.complete ? "line-through text-gray-400" : ""}`}
                  >
                    {todo.title}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors px-2 py-1 opacity-40 group-hover:opacity-100 cursor-pointer font-medium"
                  >
                    Hapus
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}