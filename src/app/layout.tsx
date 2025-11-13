import "@hdfclife-insurance/one-x-ui/styles.css";
import type { Metadata } from "next";
import { AuthProvider } from "../contexts/AuthContext";
import { ClaimsProvider } from "../contexts/ClaimsContext";

export const metadata: Metadata = {
  title: "HDFC Life Insurance Dashboard",
  description: "Manage your insurance business efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ClaimsProvider>
            {children}
          </ClaimsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}