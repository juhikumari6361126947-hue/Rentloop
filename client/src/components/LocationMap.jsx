import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { formatCoordinate } from "../utils/geo";

const hasPoint = (point) => Number.isFinite(Number(point?.lat)) && Number.isFinite(Number(point?.lng));

const getMarkerStyle = (point, bounds) => {
  const latSpan = bounds.maxLat - bounds.minLat || 0.01;
  const lngSpan = bounds.maxLng - bounds.minLng || 0.01;
  return {
    left: `${((point.lng - bounds.minLng) / lngSpan) * 78 + 11}%`,
    top: `${(1 - (point.lat - bounds.minLat) / latSpan) * 68 + 16}%`
  };
};

export default function LocationMap({ pickup, delivery, className = "" }) {
  const points = [pickup, delivery].filter(hasPoint);

  if (!points.length) {
    return (
      <div className={`rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 ${className}`}>
        Location map will appear after coordinates are added.
      </div>
    );
  }

  const lats = points.map((point) => Number(point.lat));
  const lngs = points.map((point) => Number(point.lng));
  const bounds = {
    minLat: Math.min(...lats) - 0.01,
    maxLat: Math.max(...lats) + 0.01,
    minLng: Math.min(...lngs) - 0.01,
    maxLng: Math.max(...lngs) + 0.01
  };
  const mapLink = `https://www.openstreetmap.org/?mlat=${points[0].lat}&mlon=${points[0].lng}#map=14/${points[0].lat}/${points[0].lng}`;

  return (
    <div className={`overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="relative h-64 bg-[linear-gradient(90deg,#e2e8f0_1px,transparent_1px),linear-gradient(180deg,#e2e8f0_1px,transparent_1px)] bg-[size:36px_36px]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-sky-50 to-white" />
        {hasPoint(pickup) ? (
          <div className="absolute -translate-x-1/2 -translate-y-full text-teal" style={getMarkerStyle(pickup, bounds)}>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-lg ring-4 ring-teal/20">
              <MapPin size={22} />
            </div>
            <span className="mt-1 block rounded-md bg-ink px-2 py-1 text-xs font-semibold text-white">Pickup</span>
          </div>
        ) : null}
        {hasPoint(delivery) ? (
          <div className="absolute -translate-x-1/2 -translate-y-full text-coral" style={getMarkerStyle(delivery, bounds)}>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-lg ring-4 ring-coral/20">
              <Navigation size={22} />
            </div>
            <span className="mt-1 block rounded-md bg-ink px-2 py-1 text-xs font-semibold text-white">Delivery</span>
          </div>
        ) : null}
      </div>
      <div className="grid gap-3 border-t border-slate-200 p-4 text-sm text-slate-600 sm:grid-cols-2">
        {hasPoint(pickup) ? (
          <div>
            <p className="font-semibold text-ink">Product available at</p>
            <p>{pickup.label || "Pickup location"}</p>
            <p className="text-xs">{formatCoordinate(pickup.lat)}, {formatCoordinate(pickup.lng)}</p>
          </div>
        ) : null}
        {hasPoint(delivery) ? (
          <div>
            <p className="font-semibold text-ink">Deliver to</p>
            <p>{delivery.label || "Delivery location"}</p>
            <p className="text-xs">{formatCoordinate(delivery.lat)}, {formatCoordinate(delivery.lng)}</p>
          </div>
        ) : null}
        <a className="inline-flex items-center gap-1 font-semibold text-teal sm:col-span-2" href={mapLink} target="_blank" rel="noreferrer">
          Open in map <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
