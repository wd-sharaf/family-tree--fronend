import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
}

/**
 * Shared frame for the Login/Register screens.
 * A single hairline brass border stands in for the generic card-shadow
 * treatment — evoking a framed family document rather than a SaaS panel.
 */
export default function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <h1
        style={{
          fontSize: "38px",
          marginBottom: "36px",
          color: "var(--brass)",
        }}
      >
        شجرة العائلة
      </h1>

      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          border: "1px solid var(--ink-line)",
          borderRadius: "6px",
          padding: "36px 32px",
          background: "var(--ink-raised)",
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "28px", textAlign: "center" }}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
