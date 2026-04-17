export default function PageWrapper({ children }) {
  return (
    <div className="relative min-h-screen">
      {/* grid */}
      <div className="pointer-events-none fixed inset-0 bg-grid-fine opacity-25" />

      {/* top glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(var(--primary)/0.06),transparent_60%)]" />

      {/* bottom glow */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-64 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary)/0.08),transparent_65%)]" />

      {children}
    </div>
  );
}