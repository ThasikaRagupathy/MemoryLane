import { Memory, MemoryCollection, MemoryLaneData, ScrapbookBoard } from "@/types/memory";
import { MOOD_LIST } from "./constants";
import { getTodayDateString } from "./date-utils";

// Curated high quality editorial photographs from Unsplash with warm film aesthetics
const SAMPLE_PHOTOS = {
  cafe: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
  dinner: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  roadtrip: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
  notebook: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
  rainWindow: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80",
  flowers: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80",
  sunsetPath: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
  lanterns: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
  teaCup: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
  seaBreeze: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  autumnWalk: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1200&q=80",
};

export function getInitialSampleMemories(): Memory[] {
  const todayStr = getTodayDateString();
  const [todayYear, todayMonth, todayDay] = todayStr.split("-");
  const priorYear1 = (parseInt(todayYear, 10) - 1).toString();
  const priorYear2 = (parseInt(todayYear, 10) - 2).toString();

  // Dynamic date matching today's month & day in prior year so "On This Day" always shines
  const todayPriorDate1 = `${priorYear1}-${todayMonth}-${todayDay}`;
  const todayPriorDate2 = `${priorYear2}-${todayMonth}-${todayDay}`;

  return [
    {
      id: "mem-cafe-sea",
      title: "The café by the sea",
      date: "2025-10-27",
      createdAt: "2025-10-27T14:30:00.000Z",
      updatedAt: "2025-10-27T14:30:00.000Z",
      note: "A slow afternoon, salt in the air, and nowhere else to be. The tide came in gently while we finished the pot of Earl Grey and talked about old records.",
      mood: "peaceful",
      place: "Portsmouth Coastal Path",
      tags: ["coast", "coffee", "quiet"],
      favorite: true,
      collectionIds: ["col-quiet-sundays"],
      photos: [
        {
          id: "photo-cafe-1",
          name: "cafe-terrace.jpg",
          mimeType: "image/jpeg",
          dataUrl: SAMPLE_PHOTOS.cafe,
          altText: "A weathered wooden table with ceramic coffee cup by the sea",
        },
        {
          id: "photo-cafe-2",
          name: "sea-breeze.jpg",
          mimeType: "image/jpeg",
          dataUrl: SAMPLE_PHOTOS.seaBreeze,
          altText: "Gentle ocean waves washing over smooth stones",
        },
      ],
    },
    {
      id: "mem-table-stories",
      title: "A table full of stories",
      date: "2026-02-14",
      createdAt: "2026-02-14T21:15:00.000Z",
      updatedAt: "2026-02-14T21:15:00.000Z",
      note: "Good food, familiar voices, and a night that ran late. Someone brought warm sourdough, wine was poured into mismatched glasses, and we laughed until our ribs ached.",
      mood: "loved",
      place: "Clara's Kitchen",
      tags: ["dinner", "friends", "winter"],
      favorite: true,
      collectionIds: ["col-people-home"],
      photos: [
        {
          id: "photo-dinner-1",
          name: "dinner-table.jpg",
          mimeType: "image/jpeg",
          dataUrl: SAMPLE_PHOTOS.dinner,
          altText: "Candlelit wooden dining table with shared bread and plates",
        },
      ],
    },
    {
      id: "mem-first-light",
      title: "First light on the road",
      date: "2026-03-09",
      createdAt: "2026-03-09T06:10:00.000Z",
      updatedAt: "2026-03-09T06:10:00.000Z",
      note: "The trip started before sunrise, with music and sleepy laughter. The mist over the valley turned amber just as the highway opened up before us.",
      mood: "excited",
      place: "Route 101 North",
      tags: ["roadtrip", "morning", "adventure"],
      favorite: false,
      collectionIds: ["col-little-adventures"],
      photos: [
        {
          id: "photo-road-1",
          name: "morning-highway.jpg",
          mimeType: "image/jpeg",
          dataUrl: SAMPLE_PHOTOS.roadtrip,
          altText: "Open road winding through morning misty mountains",
        },
      ],
    },
    {
      id: "mem-quiet-progress",
      title: "A quiet kind of progress",
      date: "2026-04-18",
      createdAt: "2026-04-18T17:45:00.000Z",
      updatedAt: "2026-04-18T17:45:00.000Z",
      note: "One small step that felt bigger than it looked. Finally turned the page on a chapter I was worried would stay stuck forever. Celebrated with peppermint tea and absolute silence.",
      mood: "grateful",
      place: "Corner desk at home",
      tags: ["work", "writing", "milestone"],
      favorite: true,
      collectionIds: ["col-quiet-sundays"],
      photos: [
        {
          id: "photo-notebook-1",
          name: "journal-desk.jpg",
          mimeType: "image/jpeg",
          dataUrl: SAMPLE_PHOTOS.notebook,
          altText: "Open linen notebook with fountain pen and warm table lamp",
        },
      ],
    },
    {
      id: "mem-rain-window",
      title: "Rain against the window",
      date: "2024-10-27",
      createdAt: "2024-10-27T16:00:00.000Z",
      updatedAt: "2024-10-27T16:00:00.000Z",
      note: "Tea cooling beside me while the whole world softened. The raindrops raced down the pane and for two hours the clock on the wall didn't seem to tick at all.",
      mood: "nostalgic",
      place: "Living room nook",
      tags: ["rain", "autumn", "tea"],
      favorite: false,
      collectionIds: ["col-quiet-sundays"],
      photos: [
        {
          id: "photo-rain-1",
          name: "rain-glass.jpg",
          mimeType: "image/jpeg",
          dataUrl: SAMPLE_PHOTOS.rainWindow,
          altText: "Soft raindrops on a warm window pane with autumn trees in blur",
        },
      ],
    },
    {
      id: "mem-sunday-flowers",
      title: "Sunday flowers",
      date: "2026-05-03",
      createdAt: "2026-05-03T11:20:00.000Z",
      updatedAt: "2026-05-03T11:20:00.000Z",
      note: "A tiny bunch of color for an ordinary day. Ranuculus and chamomile bought from the elderly grower at the farmers market. Wrapped in brown butcher paper with rough twine.",
      mood: "joyful",
      place: "Old Market Square",
      tags: ["market", "flowers", "weekend"],
      favorite: true,
      collectionIds: ["col-little-adventures"],
      photos: [
        {
          id: "photo-flowers-1",
          name: "market-bouquet.jpg",
          mimeType: "image/jpeg",
          dataUrl: SAMPLE_PHOTOS.flowers,
          altText: "Fresh pastel flowers in rustic kraft paper wrapping",
        },
      ],
    },
    {
      id: "mem-long-way-home",
      title: "The long way home",
      date: "2025-06-12",
      createdAt: "2025-06-12T19:50:00.000Z",
      updatedAt: "2025-06-12T19:50:00.000Z",
      note: "Took the longer route and noticed things I usually miss. The honeysuckle blooming along the stone wall, the bicycle leaning against the baker's door, the amber light stretching across the pavement.",
      mood: "reflective",
      place: "High Street & Mill Lane",
      tags: ["walk", "evening", "neighborhood"],
      favorite: false,
      collectionIds: ["col-little-adventures"],
      photos: [
        {
          id: "photo-path-1",
          name: "sunset-stroll.jpg",
          mimeType: "image/jpeg",
          dataUrl: SAMPLE_PHOTOS.sunsetPath,
          altText: "Quiet neighborhood street bathed in golden hour light",
        },
      ],
    },
    {
      id: "mem-little-celebration",
      title: "A little celebration",
      date: "2025-02-14",
      createdAt: "2025-02-14T20:30:00.000Z",
      updatedAt: "2025-02-14T20:30:00.000Z",
      note: "A reminder that simple moments can stay with us. A single candle in a slice of orange almond cake, eating off paper plates on the floor while unpacking moving boxes.",
      mood: "loved",
      place: "The empty apartment",
      tags: ["celebration", "moving", "home"],
      favorite: true,
      collectionIds: ["col-people-home"],
      photos: [
        {
          id: "photo-cake-1",
          name: "candle-cake.jpg",
          mimeType: "image/jpeg",
          dataUrl: SAMPLE_PHOTOS.bakery,
          altText: "Artisanal pastry with a single glowing celebration candle",
        },
      ],
    },
    {
      id: "mem-autumn-lanterns",
      title: "Lanterns in the dusk",
      date: todayPriorDate1,
      createdAt: `${todayPriorDate1}T18:40:00.000Z`,
      updatedAt: `${todayPriorDate1}T18:40:00.000Z`,
      note: "Walking through the orchard as twilight fell. Paper lanterns swayed in the apple branches, casting warm amber circles on the fallen leaves. A pocket of time that felt suspended from the rest of the world.",
      mood: "nostalgic",
      place: "Hilltop Orchard",
      tags: ["autumn", "twilight", "lanterns"],
      favorite: true,
      collectionIds: ["col-little-adventures"],
      photos: [
        {
          id: "photo-lanterns-1",
          name: "orchard-lanterns.jpg",
          mimeType: "image/jpeg",
          dataUrl: SAMPLE_PHOTOS.lanterns,
          altText: "Warm paper lanterns glowing among autumn branches at dusk",
        },
      ],
    },
    {
      id: "mem-steaming-tea",
      title: "Steaming tea & quiet conversations",
      date: todayPriorDate2,
      createdAt: `${todayPriorDate2}T10:15:00.000Z`,
      updatedAt: `${todayPriorDate2}T10:15:00.000Z`,
      note: "The morning was crisp and frosty. We sat wrapped in wool blankets on the porch, watching the steam curl into the cold air. No rush, no agenda.",
      mood: "peaceful",
      place: "The Cabin Porch",
      tags: ["morning", "tea", "quiet"],
      favorite: false,
      collectionIds: ["col-quiet-sundays"],
      photos: [
        {
          id: "photo-tea-1",
          name: "steaming-tea.jpg",
          mimeType: "image/jpeg",
          dataUrl: SAMPLE_PHOTOS.teaCup,
          altText: "Warm ceramic tea cup with gentle steam in natural morning light",
        },
      ],
    },
    {
      id: "mem-yellow-leaves",
      title: "Golden leaves beneath boots",
      date: "2026-09-24",
      createdAt: "2026-09-24T15:20:00.000Z",
      updatedAt: "2026-09-24T15:20:00.000Z",
      note: "The first true afternoon of autumn. Every breath smelled like woodsmoke and damp earth. Kicked leaves the entire way to the library.",
      mood: "joyful",
      place: "Chestnut Park",
      tags: ["autumn", "leaves", "walk"],
      favorite: false,
      collectionIds: ["col-little-adventures"],
      photos: [
        {
          id: "photo-walk-1",
          name: "golden-leaves.jpg",
          mimeType: "image/jpeg",
          dataUrl: SAMPLE_PHOTOS.autumnWalk,
          altText: "Footpath covered in thick golden maple and oak leaves",
        },
      ],
    },
  ];
}

export function getInitialCollections(memories: Memory[]): MemoryCollection[] {
  // Build 8 default mood collections
  const moodCollections: MemoryCollection[] = MOOD_LIST.map((m) => {
    const matchingMemIds = memories
      .filter((mem) => mem.mood === m.id)
      .map((mem) => mem.id);

    const coverMem = memories.find((mem) => mem.mood === m.id && mem.photos.length > 0);

    return {
      id: `col-mood-${m.id}`,
      name: m.label,
      slug: m.id,
      description: m.description,
      kind: "mood",
      mood: m.id,
      coverMemoryId: coverMem?.id,
      memoryIds: matchingMemIds,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    };
  });

  // Custom user collections
  const customCollections: MemoryCollection[] = [
    {
      id: "col-little-adventures",
      name: "Little adventures",
      slug: "little-adventures",
      description: "Day trips, spontaneous turns, and journeys that began with no itinerary.",
      kind: "custom",
      coverMemoryId: "mem-first-light",
      memoryIds: ["mem-first-light", "mem-sunday-flowers", "mem-long-way-home", "mem-autumn-lanterns", "mem-yellow-leaves"],
      createdAt: "2024-02-10T10:00:00.000Z",
      updatedAt: "2024-02-10T10:00:00.000Z",
    },
    {
      id: "col-people-home",
      name: "People who feel like home",
      slug: "people-who-feel-like-home",
      description: "Those who make anywhere feel safe, warm, and easy to be yourself.",
      kind: "custom",
      coverMemoryId: "mem-table-stories",
      memoryIds: ["mem-table-stories", "mem-little-celebration"],
      createdAt: "2024-02-14T12:00:00.000Z",
      updatedAt: "2024-02-14T12:00:00.000Z",
    },
    {
      id: "col-quiet-sundays",
      name: "Quiet Sundays",
      slug: "quiet-sundays",
      description: "Slow kettles, unhurried reading, and the soft rhythm of a restful afternoon.",
      kind: "custom",
      coverMemoryId: "mem-cafe-sea",
      memoryIds: ["mem-cafe-sea", "mem-quiet-progress", "mem-rain-window", "mem-steaming-tea"],
      createdAt: "2024-03-01T09:00:00.000Z",
      updatedAt: "2024-03-01T09:00:00.000Z",
    },
  ];

  return [...moodCollections, ...customCollections];
}

export function getInitialScrapbookBoards(): ScrapbookBoard[] {
  return [
    {
      id: "board-autumn-days",
      title: "Autumn Keepsakes & Quiet Days",
      createdAt: "2024-10-27T10:00:00.000Z",
      updatedAt: "2025-10-27T18:00:00.000Z",
      items: [
        {
          id: "sb-photo-1",
          type: "photo",
          photo: {
            id: "sb-p-1",
            name: "coastal-afternoon.jpg",
            mimeType: "image/jpeg",
            dataUrl: SAMPLE_PHOTOS.cafe,
            altText: "Ceramic cup at a seaside table",
          },
          x: 40,
          y: 60,
          rotation: -3,
          zIndex: 1,
          caption: "Salt in the air, Oct 27",
        },
        {
          id: "sb-note-1",
          type: "note",
          text: "Some afternoons don't need a destination. Just a quiet chair and warm tea.",
          style: "paper",
          x: 320,
          y: 75,
          rotation: 2,
          zIndex: 2,
        },
        {
          id: "sb-memory-1",
          type: "memory",
          memoryId: "mem-table-stories",
          x: 580,
          y: 50,
          rotation: -1.5,
          zIndex: 3,
        },
        {
          id: "sb-photo-2",
          type: "photo",
          photo: {
            id: "sb-p-2",
            name: "lanterns.jpg",
            mimeType: "image/jpeg",
            dataUrl: SAMPLE_PHOTOS.lanterns,
            altText: "Paper lanterns in the orchard",
          },
          x: 80,
          y: 350,
          rotation: 2.5,
          zIndex: 4,
          caption: "Orchard twilight",
        },
        {
          id: "sb-note-2",
          type: "note",
          text: "Things to keep:\n• The smell of rain on stone\n• Sourdough fresh from the oven\n• Unhurried conversations",
          style: "sage",
          x: 340,
          y: 330,
          rotation: -2,
          zIndex: 5,
        },
        {
          id: "sb-note-3",
          type: "note",
          text: "“Keep the things you don’t want time to blur.”",
          style: "butter",
          x: 620,
          y: 360,
          rotation: 1,
          zIndex: 6,
        },
      ],
    },
  ];
}

export function getDefaultMemoryLaneData(): MemoryLaneData {
  const memories = getInitialSampleMemories();
  const collections = getInitialCollections(memories);
  const scrapbookBoards = getInitialScrapbookBoards();

  return {
    schemaVersion: 1,
    memories,
    collections,
    scrapbookBoards,
    preferences: {
      motion: "system",
      cardDensity: "comfortable",
    },
  };
}
