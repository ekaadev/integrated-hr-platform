# Modul AI (360 Feedback)

Tempat AI pipeline 360 Feedback: laporan individu ratee yang diproses LLM.

Aturan dari Architecture Document:

- Model lokal dipanggil **hanya dari backend ini**, tidak pernah dari frontend.
- Development memakai Ollama (`OLLAMA_URL`); vLLM dipertimbangkan bila throughput menjadi masalah.
- Output skor untuk PRISMA **tidak** melewati LLM; skor dihitung langsung dari data penilaian.
- Proses panjang dijalankan sebagai job asinkron (pg-boss atau proses async sederhana), tanpa Redis.
- Vector store (pgvector) dan RAG untuk pembuatan kuesioner ditunda setelah MVP.
- Ollama dijalankan langsung di mesin yang memiliki GPU, bukan di Docker, kecuali seluruh tim punya setup GPU yang sama.

Ikuti pola modul lain: `routes.ts` (tipis), `service.ts` (logika, tanpa Elysia), `schema.ts` (TypeBox).
