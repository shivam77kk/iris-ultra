import "./globals.css";

export const metadata = {
  title: "IRIS ULTRA | Cost-Governed Embodied AI",
  description: "Cost-Aware AI Assistant with Sub-100ms 3D Avatar and Multi-Tier LLM Routing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
