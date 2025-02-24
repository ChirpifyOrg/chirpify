export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // 아무것도 감싸지 않음 (root layout 적용 안 됨)
}
