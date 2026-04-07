export const metadata = {
  title: "node-nextjs",
  description: "Deployed with Theo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
