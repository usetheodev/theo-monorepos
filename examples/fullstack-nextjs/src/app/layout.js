export const metadata = {
  title: "fullstack-nextjs",
  description: "Fullstack Next.js — Deployed with Theo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
