import DeportivaShell from "@/components/climbing/DeportivaShell";

export default function DeportivaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DeportivaShell>{children}</DeportivaShell>;
}
