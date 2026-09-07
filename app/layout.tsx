import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Semantic ISR Lab',
  description: 'Active Neural Gatekeeper Evaluation Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}