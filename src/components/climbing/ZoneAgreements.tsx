import AgreementIcon from "@/components/climbing/AgreementIcon";

export type ZoneRule = {
  id: string;
  level: string;
  title: string;
  description: string;
  comment: string | null;
  icon: string | null;
};

const LEVEL_LABEL: Record<string, string> = {
  Critical: "Crítico",
  Important: "Importante",
  Recommended: "Recomendado",
};

export default function ZoneAgreements({ rules }: { rules: ZoneRule[] }) {
  if (rules.length === 0) return null;

  return (
    <div>
      <p className="kicker">Acuerdos</p>
      <h2 className="font-display mt-2 text-3xl">Reglas del lugar</h2>
      <ul className="mt-8 space-y-6">
        {rules.map((rule) => (
          <li key={rule.id} className="flex gap-3">
            <AgreementIcon icon={rule.icon} title={rule.title} size={32} />
            <div className="min-w-0">
              <p className="font-brown text-ink-soft text-[0.65rem] tracking-[0.12em] uppercase">
                {LEVEL_LABEL[rule.level] ?? rule.level}
              </p>
              <p className="font-display mt-1 text-xl leading-tight">
                {rule.title}
              </p>
              {rule.comment ? (
                <p className="font-brown mt-2 text-sm leading-relaxed">
                  {rule.comment}
                </p>
              ) : (
                <p className="font-brown text-ink-soft mt-2 text-sm leading-relaxed">
                  {rule.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
