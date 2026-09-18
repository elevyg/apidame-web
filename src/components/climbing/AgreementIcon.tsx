import { readFile } from "node:fs/promises";
import { agreementIconFile } from "@/lib/guide/agreementIcons";

type AgreementIconProps = {
  icon: string | null;
  title: string;
  size?: number;
};

export default async function AgreementIcon({
  icon,
  title,
  size = 28,
}: AgreementIconProps) {
  const file = agreementIconFile(icon);
  if (!file) return null;
  const svg = await readFile(file, "utf8");
  return (
    <span
      role="img"
      aria-label={title}
      className="inline-flex shrink-0 [&_svg]:h-full [&_svg]:w-full"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
