import ProjectDoor from "@/components/estetica/ProjectDoor";
import {
  deportivaShots,
  muroShots,
  presentacionShots,
  type ArchivoShot,
} from "@/components/estetica/archivo";

function ShotGrid({
  folder,
  shots,
}: {
  folder: "muro" | "deportiva" | "presentacion";
  shots: ArchivoShot[];
}) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
      {shots.map((shot) => (
        <ProjectDoor
          key={shot.file}
          src={`/estetica/${folder}/${shot.file}`}
          alt={shot.title}
          title={shot.title}
          score={shot.score}
          use={shot.use}
          note={shot.note}
        />
      ))}
    </div>
  );
}

export default function ArchivoFotos() {
  return (
    <section id="fotos" className="border-t border-rule py-20 md:py-28">
      <div className="page-shell">
        <p className="kicker">Archivo</p>
        <h2 className="font-display mt-4 text-3xl md:text-5xl">Muro</h2>
        <ShotGrid folder="muro" shots={muroShots} />

        <h2 className="font-display mt-24 text-3xl md:text-5xl">Deportiva</h2>
        <ShotGrid folder="deportiva" shots={deportivaShots} />

        <h2 className="font-display mt-24 text-3xl md:text-5xl">
          Guía · presentación
        </h2>
        <ShotGrid folder="presentacion" shots={presentacionShots} />
      </div>
    </section>
  );
}
