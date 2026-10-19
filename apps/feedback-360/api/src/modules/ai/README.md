# AI module (360 Feedback)

Home of the 360 Feedback AI pipeline: the individual ratee report processed by an LLM.

Rules from the Architecture Document:

- The local model is called **only from this backend**, never from the frontend.
- Development uses Ollama (`OLLAMA_URL`); vLLM is considered if throughput becomes a problem.
- The score output for PRISMA does **not** go through the LLM; scores are computed directly from the assessment data.
- Long-running work runs as asynchronous jobs (pg-boss or a simple async process), without Redis.
- The vector store (pgvector) and RAG for questionnaire generation are deferred until after the MVP.
- Ollama runs directly on the machine that has a GPU, not in Docker, unless the whole team has the same GPU setup.

Follow the pattern of the other modules: `routes.ts` (thin), `service.ts` (logic, no Elysia), `schema.ts` (TypeBox).
