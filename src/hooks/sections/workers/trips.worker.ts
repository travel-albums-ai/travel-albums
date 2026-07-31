import type { SectionItem } from '@/hooks/sections/useTransform_AllSections';
import { benchmarkFunction } from '@/hooks/utils';
import type { GalleryPhoto } from '@/lib/galleryData';

const BERLIN_LAT = 52.52;
const BERLIN_LON = 13.405;
const BERLIN_RADIUS_KM = 20;
const BERLIN_RADIUS_KM_SQ = BERLIN_RADIUS_KM * BERLIN_RADIUS_KM;

const CLUSTER_RADIUS_KM = 5;
const CLUSTER_RADIUS_KM_SQ = CLUSTER_RADIUS_KM * CLUSTER_RADIUS_KM;

const BERLIN_CONFIRMATIONS = 5;
const CELL_SIZE = 2;

type PreparedPhoto = GalleryPhoto & {
  _inBerlin: boolean;
};

type LocationCluster = {
  lat: number;
  lon: number;
  photos: GalleryPhoto[];
  _latSum: number;
  _lonSum: number;
};

export type Trip = {
  start: number;
  end: number;
  photos: GalleryPhoto[];
  clusters: LocationCluster[];
  mainCluster: LocationCluster | null;
  uniqueLocations: number;
};

function fastDistanceKmSq(lat1: number, lon1: number, lat2: number, lon2: number) {
  const dx = (lon2 - lon1) * 111 * Math.cos((lat1 * Math.PI) / 180);
  const dy = (lat2 - lat1) * 111;
  return dx * dx + dy * dy;
}

function markBerlin(photos: GalleryPhoto[]): PreparedPhoto[] {
  const out: PreparedPhoto[] = [];

  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    const lat = p.latitude;
    const lon = p.longitude;

    if (lat == null || lon == null || lat === 0 || lon === 0) continue;

    const dx = (lon - BERLIN_LON) * 111 * Math.cos((lat * Math.PI) / 180);
    const dy = (lat - BERLIN_LAT) * 111;
    const distSq = dx * dx + dy * dy;

    out.push({
      ...p,
      _inBerlin: distSq <= BERLIN_RADIUS_KM_SQ,
    });
  }

  return out;
}

function buildLocationClusters(photos: GalleryPhoto[]): LocationCluster[] {
  const clusters: LocationCluster[] = [];
  const grid = new Map<string, LocationCluster[]>();

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const lat = photo.latitude!;
    const lon = photo.longitude!;

    const gx = Math.floor(lat / CELL_SIZE);
    const gy = Math.floor(lon / CELL_SIZE);

    let best: LocationCluster | undefined;
    let bestDist = Infinity;

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const cell = grid.get(`${gx + dx}:${gy + dy}`);
        if (!cell) continue;

        for (let k = 0; k < cell.length; k++) {
          const c = cell[k];
          const d = fastDistanceKmSq(lat, lon, c.lat, c.lon);

          if (d <= CLUSTER_RADIUS_KM_SQ && d < bestDist) {
            bestDist = d;
            best = c;
          }
        }
      }
    }

    if (!best) {
      const cluster: LocationCluster = {
        lat,
        lon,
        photos: [photo],
        _latSum: lat,
        _lonSum: lon,
      };

      clusters.push(cluster);

      const key = `${gx}:${gy}`;
      const existing = grid.get(key);
      if (existing) existing.push(cluster);
      else grid.set(key, [cluster]);

      continue;
    }

    best.photos.push(photo);
    best._latSum += lat;
    best._lonSum += lon;

    const n = best.photos.length;
    best.lat = best._latSum / n;
    best.lon = best._lonSum / n;
  }

  return clusters.sort((a, b) => b.photos.length - a.photos.length);
}

function composeTrips(photos: PreparedPhoto[]): Trip[] {
  photos.sort((a, b) => a.takenAtTs - b.takenAtTs);

  const trips: Trip[] = [];
  let trip: Trip | null = null;
  let berlinStreak = 0;

  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];

    if (!trip) {
      if (p._inBerlin) continue;

      trip = {
        start: p.takenAtTs,
        end: p.takenAtTs,
        photos: [p],
        clusters: [],
        mainCluster: null,
        uniqueLocations: 0,
      };

      continue;
    }

    trip.photos.push(p);
    trip.end = p.takenAtTs;

    berlinStreak = p._inBerlin ? berlinStreak + 1 : 0;

    if (berlinStreak < BERLIN_CONFIRMATIONS) continue;

    trip.photos.length -= BERLIN_CONFIRMATIONS;

    if (trip.photos.length) {
      trip.end = trip.photos[trip.photos.length - 1].takenAtTs;
      trips.push(enrichTrip(trip));
    }

    trip = null;
    berlinStreak = 0;
  }

  if (trip?.photos.length) {
    trips.push(enrichTrip(trip));
  }

  return trips;
}

function enrichTrip(trip: Trip): Trip {
  const clusters = buildLocationClusters(trip.photos);

  return {
    ...trip,
    clusters,
    mainCluster: clusters[0] ?? null,
    uniqueLocations: clusters.length,
  };
}

export default function tripsWorker(
  photos: GalleryPhoto[],
): SectionItem[] {
  if (!photos?.length) return [];

  return benchmarkFunction(
    () => {
      const trips = composeTrips(markBerlin(photos));
      const result: SectionItem[] = [];

      for (let i = 0; i < trips.length; i++) {
        const trip = trips[i];

        if (trip.mainCluster?.lat === 0) continue;

        const airportSet = new Set<string>();

        for (const cluster of trip.clusters) {
          for (const photo of cluster.photos) {
            const city = photo.city?.name;
            if (city) airportSet.add(city);
          }
        }

        const startDate = new Date(trip.start * 1000).toDateString();
        const endDate =
          trip.start === trip.end
            ? startDate
            : new Date(trip.end * 1000).toDateString();

        result.push({
          ...trip,
          name: `${[...airportSet].join(' • ')} • ${i} • ${startDate}`,
          details: [
            startDate,
            endDate,
            `${trip.photos.length} photos`,
            `${trip.uniqueLocations} locations`,
          ],
        });
      }

      return result;
    },
    '🤖 tripsWorker',
    [`${photos.length} photos`],
  );
}
