import {
  downArrowPath,
  pointerRadius,
  pointerRingWidth,
  type Point,
} from "@/lib/climbing/path";

type RouteMarkersProps = {
  start: Point | undefined;
  end: Point | undefined;
  hideStart?: boolean;
  label: string | number;
  color: string;
  routeStrokeWidth: number;
};

export default function RouteMarkers({
  start,
  end,
  hideStart,
  label,
  color,
  routeStrokeWidth,
}: RouteMarkersProps) {
  const radius = pointerRadius(routeStrokeWidth);
  const ring = pointerRingWidth(radius);
  const fontSize = radius * 1.05;

  return (
    <g>
      {!hideStart && start ? (
        <g transform={`translate(${start.x} ${start.y})`}>
          <circle r={radius} fill="#fff" />
          <circle
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={ring}
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill={color}
            fontSize={fontSize}
            fontWeight={600}
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            {label}
          </text>
        </g>
      ) : null}
      {end ? (
        <g transform={`translate(${end.x} ${end.y})`}>
          <circle r={radius} fill="#fff" />
          <circle
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={ring}
          />
          <path
            d={downArrowPath(radius)}
            fill="none"
            stroke={color}
            strokeWidth={ring}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ) : null}
    </g>
  );
}
