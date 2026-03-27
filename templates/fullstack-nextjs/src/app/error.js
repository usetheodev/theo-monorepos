"use client";

export default function Error({ error, reset }) {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Something went wrong</h1>
      <p>{error?.message || "An unexpected error occurred."}</p>
      <button onClick={() => reset()}>Try again</button>
    </main>
  );
}
