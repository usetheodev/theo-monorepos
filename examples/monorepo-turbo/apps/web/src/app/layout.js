export const metadata = {
  title: "monorepo-turbo",
  description: "Deployed with Theo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
