// Mock data for development (before database is populated)

export interface MockStory {
  id: string;
  title: string;
  slug: string;
  blurb: string;
  readingLevel: 'early' | 'independent' | 'confident' | 'advanced';
  genre: string;
  primaryVirtue: string;
  secondaryVirtues: string[];
  contentTags: string[];
  chapterCount: number;
  totalWordCount: number;
  estimatedReadMinutes: number;
  coverImageUrl: string;
  publishedAt: string;
}

export interface MockChapter {
  id: string;
  storyId: string;
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
}

export const mockStories: MockStory[] = [
  {
    id: '1',
    title: 'The Brave Little Lighthouse',
    slug: 'the-brave-little-lighthouse',
    blurb: 'A small lighthouse learns that even the smallest light can guide ships safely home during a fierce storm.',
    readingLevel: 'early',
    genre: 'Adventure',
    primaryVirtue: 'Courage',
    secondaryVirtues: ['Perseverance', 'Hope'],
    contentTags: ['mild-peril', 'heartwarming', 'nature-outdoors'],
    chapterCount: 3,
    totalWordCount: 1500,
    estimatedReadMinutes: 6,
    coverImageUrl: '/images/lighthouse-cover.jpg',
    publishedAt: '2026-02-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'The Secret Garden Club',
    slug: 'the-secret-garden-club',
    blurb: 'Three friends discover that working together creates something more beautiful than any of them could make alone.',
    readingLevel: 'independent',
    genre: 'Friendship',
    primaryVirtue: 'Teamwork',
    secondaryVirtues: ['Creativity', 'Kindness'],
    contentTags: ['friendship-focused', 'nature-outdoors', 'heartwarming'],
    chapterCount: 5,
    totalWordCount: 5000,
    estimatedReadMinutes: 20,
    coverImageUrl: '/images/garden-cover.jpg',
    publishedAt: '2026-02-02T00:00:00Z',
  },
  {
    id: '3',
    title: 'The Truth About Tommy\'s Trophy',
    slug: 'the-truth-about-tommys-trophy',
    blurb: 'When Tommy wins a trophy he didn\'t really earn, he must decide whether winning dishonestly is worth the price.',
    readingLevel: 'independent',
    genre: 'School',
    primaryVirtue: 'Honesty',
    secondaryVirtues: ['Courage', 'Responsibility'],
    contentTags: ['school-setting', 'mild-conflict', 'competition'],
    chapterCount: 5,
    totalWordCount: 5200,
    estimatedReadMinutes: 21,
    coverImageUrl: '/images/trophy-cover.jpg',
    publishedAt: '2026-02-03T00:00:00Z',
  },
  {
    id: '4',
    title: 'Luna\'s Lunar Laboratory',
    slug: 'lunas-lunar-laboratory',
    blurb: 'A young scientist on a moon base must solve a critical problem when her experiments don\'t go as planned.',
    readingLevel: 'confident',
    genre: 'Science Fiction',
    primaryVirtue: 'Perseverance',
    secondaryVirtues: ['Creativity', 'Responsibility'],
    contentTags: ['space-scifi', 'suspense-mystery', 'female-protagonist'],
    chapterCount: 7,
    totalWordCount: 10500,
    estimatedReadMinutes: 42,
    coverImageUrl: '/images/lunar-lab-cover.jpg',
    publishedAt: '2026-02-04T00:00:00Z',
  },
  {
    id: '5',
    title: 'The Kindness Ripple',
    slug: 'the-kindness-ripple',
    blurb: 'One small act of kindness spreads through an entire town in unexpected ways.',
    readingLevel: 'early',
    genre: 'Family',
    primaryVirtue: 'Kindness',
    secondaryVirtues: ['Gratitude', 'Generosity'],
    contentTags: ['urban-city', 'heartwarming', 'family-dynamics'],
    chapterCount: 3,
    totalWordCount: 1400,
    estimatedReadMinutes: 6,
    coverImageUrl: '/images/kindness-cover.jpg',
    publishedAt: '2026-02-05T00:00:00Z',
  },
  {
    id: '6',
    title: 'The Dragon Who Couldn\'t Fly',
    slug: 'the-dragon-who-couldnt-fly',
    blurb: 'A young dragon with small wings discovers that true strength comes in many forms.',
    readingLevel: 'independent',
    genre: 'Fantasy',
    primaryVirtue: 'Courage',
    secondaryVirtues: ['Perseverance', 'Self-acceptance'],
    contentTags: ['fantasy-magic', 'animal-characters', 'heartwarming', 'disability-representation'],
    chapterCount: 5,
    totalWordCount: 4800,
    estimatedReadMinutes: 19,
    coverImageUrl: '/images/dragon-cover.jpg',
    publishedAt: '2026-02-06T00:00:00Z',
  },
  {
    id: '7',
    title: 'The Missing Melody',
    slug: 'the-missing-melody',
    blurb: 'When the town\'s music mysteriously disappears, a shy girl must find her voice to bring it back.',
    readingLevel: 'confident',
    genre: 'Mystery',
    primaryVirtue: 'Courage',
    secondaryVirtues: ['Creativity', 'Determination'],
    contentTags: ['suspense-mystery', 'urban-city', 'female-protagonist'],
    chapterCount: 7,
    totalWordCount: 11000,
    estimatedReadMinutes: 44,
    coverImageUrl: '/images/melody-cover.jpg',
    publishedAt: '2026-01-28T00:00:00Z',
  },
  {
    id: '8',
    title: 'The Grateful Heart',
    slug: 'the-grateful-heart',
    blurb: 'A child who has everything learns the true meaning of thankfulness from someone who has very little.',
    readingLevel: 'independent',
    genre: 'Family',
    primaryVirtue: 'Gratitude',
    secondaryVirtues: ['Kindness', 'Generosity'],
    contentTags: ['family-dynamics', 'heartwarming', 'urban-city'],
    chapterCount: 5,
    totalWordCount: 4900,
    estimatedReadMinutes: 20,
    coverImageUrl: '/images/grateful-cover.jpg',
    publishedAt: '2026-01-30T00:00:00Z',
  },
  {
    id: '9',
    title: 'Star Keeper\'s Promise',
    slug: 'star-keepers-promise',
    blurb: 'A young astronomer must keep a promise that seems impossible when dark clouds threaten the biggest meteor shower in decades.',
    readingLevel: 'advanced',
    genre: 'Science Fiction',
    primaryVirtue: 'Responsibility',
    secondaryVirtues: ['Honesty', 'Perseverance'],
    contentTags: ['space-scifi', 'suspense-mystery', 'mild-peril'],
    chapterCount: 10,
    totalWordCount: 20000,
    estimatedReadMinutes: 80,
    coverImageUrl: '/images/star-keeper-cover.jpg',
    publishedAt: '2026-01-25T00:00:00Z',
  },
  {
    id: '10',
    title: 'The Forgiveness Garden',
    slug: 'the-forgiveness-garden',
    blurb: 'Two best friends must tend a magical garden that only blooms when they learn to forgive each other.',
    readingLevel: 'confident',
    genre: 'Fantasy',
    primaryVirtue: 'Forgiveness',
    secondaryVirtues: ['Friendship', 'Patience'],
    contentTags: ['fantasy-magic', 'friendship-focused', 'nature-outdoors', 'heartwarming'],
    chapterCount: 6,
    totalWordCount: 9000,
    estimatedReadMinutes: 36,
    coverImageUrl: '/images/forgiveness-garden-cover.jpg',
    publishedAt: '2026-01-27T00:00:00Z',
  },
  {
    id: '11',
    title: 'The Underwater Explorer',
    slug: 'the-underwater-explorer',
    blurb: 'A curious young explorer discovers a hidden ocean world and must choose between sharing the discovery or protecting it.',
    readingLevel: 'confident',
    genre: 'Adventure',
    primaryVirtue: 'Wisdom',
    secondaryVirtues: ['Courage', 'Responsibility'],
    contentTags: ['underwater-ocean', 'action-adventure', 'mild-peril', 'nature-outdoors'],
    chapterCount: 7,
    totalWordCount: 10000,
    estimatedReadMinutes: 40,
    coverImageUrl: '/images/underwater-cover.jpg',
    publishedAt: '2026-02-01T00:00:00Z',
  },
  {
    id: '12',
    title: 'The Farmer\'s Faithful Helper',
    slug: 'the-farmers-faithful-helper',
    blurb: 'A hardworking farm dog proves that responsibility means doing what\'s right even when no one is watching.',
    readingLevel: 'early',
    genre: 'Animals',
    primaryVirtue: 'Responsibility',
    secondaryVirtues: ['Loyalty', 'Diligence'],
    contentTags: ['animal-characters', 'farm-rural', 'heartwarming'],
    chapterCount: 3,
    totalWordCount: 1600,
    estimatedReadMinutes: 6,
    coverImageUrl: '/images/farm-dog-cover.jpg',
    publishedAt: '2026-01-29T00:00:00Z',
  },
];

export const mockChapters: Record<string, MockChapter[]> = {
  '1': [
    {
      id: 'ch1-1',
      storyId: '1',
      chapterNumber: 1,
      title: 'The Smallest Light',
      content: `The little lighthouse stood at the edge of the rocky shore. She was much smaller than the other lighthouses along the coast.\n\n"I'm so tiny," she would say to the waves. "My light can't possibly help anyone."\n\nThe big lighthouse down the beach had a light that could be seen for miles and miles. The lighthouse on the hill had a light so bright, it lit up the whole town.\n\nBut the little lighthouse? Her light was small and gentle, barely reaching past the nearest rocks.\n\n"Don't worry," said her keeper, an old sailor with kind eyes. "Every light has its purpose. You just haven't found yours yet."\n\nThe little lighthouse wasn't sure she believed him. How could such a small light matter?\n\nThen one evening, dark storm clouds rolled in from the sea.`,
      wordCount: 500,
    },
    {
      id: 'ch1-2',
      storyId: '1',
      chapterNumber: 2,
      title: 'The Storm Arrives',
      content: `The wind howled and the rain pounded against the little lighthouse's walls. The storm was the worst she had ever seen.\n\nShe watched as the big lighthouse's beam swept across the angry waves. She saw the hilltop lighthouse's bright glow piercing through the clouds.\n\n"At least they can help the ships," she thought.\n\nBut then—CRACK! Lightning struck the big lighthouse, and its light went out. Another bolt hit the power lines, and the hilltop lighthouse went dark too.\n\nNow the coast was in complete darkness. The little lighthouse trembled as she heard her keeper climbing the stairs.\n\n"It's up to you now," he said gently, lighting her lamp. "The ships out there need to find their way home. They need a light—any light—to guide them."\n\nThe little lighthouse's flame flickered nervously. Could her small light really make a difference?`,
      wordCount: 500,
    },
    {
      id: 'ch1-3',
      storyId: '1',
      chapterNumber: 3,
      title: 'The Light That Mattered',
      content: `The little lighthouse decided to try. She burned as brightly as she could, even though her light still seemed so small.\n\nThrough the storm, she kept her light steady. The rain tried to put it out, but she kept burning. The wind tried to blow it away, but she stayed strong.\n\nThen, through the darkness and the storm, she heard it—a ship's horn! A big cargo ship was lost in the storm, searching for the coast.\n\nThe captain saw the little lighthouse's gentle glow. It wasn't as bright as the other lighthouses, but in the darkness, it was exactly what he needed.\n\nFollowing her small but steady light, the ship safely made it past the rocks and into the harbor.\n\n"You saved us!" the captain radioed to the lighthouse keeper. "We couldn't see the big lights, but your little lighthouse guided us home."\n\nThe little lighthouse learned something important that night: it doesn't matter how small you are. What matters is that you shine your light, no matter what. Sometimes the smallest light is exactly the light someone needs.`,
      wordCount: 500,
    },
  ],
  '2': [
    {
      id: 'ch2-1',
      storyId: '2',
      chapterNumber: 1,
      title: 'The Empty Lot',
      content: `Maya kicked a pebble across the dusty lot. It used to be a community garden, but now it was just weeds and broken fence posts.\n\n"My grandma used to grow the most beautiful flowers here," she told her friends Jake and Sophie. "She said this garden brought the whole neighborhood together."\n\nJake looked at the tangled mess of weeds. "Could we... fix it?"\n\nSophie wrinkled her nose. "It would take forever. And we don't know anything about gardening."\n\nBut Maya's eyes were already shining with an idea. "What if we start small? Just one corner. We could each choose what to plant."\n\nJake shrugged. "I guess we could try..."\n\nSophie crossed her arms. "Fine. But I'm not touching any bugs."`,
      wordCount: 1000,
    },
    {
      id: 'ch2-2',
      storyId: '2',
      chapterNumber: 2,
      title: 'Three Different Dreams',
      content: `The next Saturday, they started clearing the corner of the lot.\n\nMaya wanted to plant sunflowers—tall, happy flowers that would make everyone smile.\n\nJake wanted a vegetable garden so he could donate fresh food to the community center.\n\nSophie wanted roses because they were beautiful and elegant.\n\n"We can't plant everything in the same space," Sophie pointed out. "We need to pick one thing."\n\n"But they're all good ideas," Maya said.\n\nJake had an idea. "What if we each get a section? Like... three small gardens instead of one big one?"\n\nThey marked out three areas with string. Maya's sunflower patch on the left, Jake's veggie plot in the middle, and Sophie's rose corner on the right.\n\nBut when they started planting, something unexpected happened...`,
      wordCount: 1000,
    },
    {
      id: 'ch2-3',
      storyId: '2',
      chapterNumber: 3,
      title: 'Learning to Share',
      content: `"My sunflowers need full sun," Maya realized. "But they'll shade Jake's vegetables!"\n\n"And my roses need the good soil," Sophie said. "But that's where Jake wanted his tomatoes."\n\nThey stood there, frustrated. This wasn't working.\n\nThen Maya's grandma stopped by. She smiled at the three separate plots. "You know what made this garden special?" she asked. "It wasn't that everyone planted the same thing. It was that we all planted together."\n\nShe showed them how the tall sunflowers could support Jake's climbing beans. How Sophie's roses could border the whole garden, making it beautiful. How they could share the good soil by building it up together with compost.\n\n"A good garden isn't about each person doing their own thing," Grandma explained. "It's about working together to make something better than any one person could make alone."`,
      wordCount: 1000,
    },
    {
      id: 'ch2-4',
      storyId: '2',
      chapterNumber: 4,
      title: 'Growing Together',
      content: `Over the next few weeks, the Secret Garden Club worked together every Saturday.\n\nSophie (who said she wouldn't touch bugs) ended up loving the ladybugs that helped protect the plants.\n\nJake discovered he actually liked flowers when he saw how they attracted bees to pollinate his vegetables.\n\nMaya learned about companion planting from Sophie's grandpa and helped design a garden where every plant helped the others grow.\n\nThey still had different ideas sometimes. They still disagreed about things. But they learned to listen to each other, combine their ideas, and create something even better than what they'd imagined.\n\nThe corner of the lot that had been full of weeds was now a beautiful garden—with sunflowers, vegetables, and roses all growing together.`,
      wordCount: 1000,
    },
    {
      id: 'ch2-5',
      storyId: '2',
      chapterNumber: 5,
      title: 'The Garden Grows',
      content: `Two months later, neighbors started asking about the garden.\n\n"Could we help?" asked Mrs. Chen from down the street.\n\n"I have some extra tools," offered Mr. Rodriguez.\n\nSoon, the Secret Garden Club wasn't so secret anymore. More and more people joined in, and the garden spread from their little corner to fill the whole lot.\n\nJust like Maya's grandma said, the garden brought the neighborhood together. But it wasn't the flowers or vegetables that did it.\n\nIt was the teamwork. It was learning that different ideas could work together. It was discovering that when people combine their different talents and dreams, they can create something amazing.\n\nAnd every time Maya, Jake, and Sophie looked at their garden, they remembered: the best things in life aren't grown alone. They're grown together.`,
      wordCount: 1000,
    },
  ],
};

export function getMockStory(slugOrId: string): MockStory | undefined {
  return mockStories.find(s => s.slug === slugOrId || s.id === slugOrId);
}

export function getMockChapters(storyId: string): MockChapter[] {
  return mockChapters[storyId] || [];
}
