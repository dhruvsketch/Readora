import { 
  Profile, 
  Category, 
  Book, 
  BookChapter, 
  Article, 
  CommunityPost, 
  Comment, 
  BookListing,
  NotificationItem,
  ReportItem 
} from '../types/database';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'c1',
    name: 'Philosophy & Ideas',
    slug: 'philosophy-ideas',
    description: 'Reflections on ethics, existence, consciousness, and timeless wisdom.',
    icon: 'BookOpen',
    display_order: 1,
  },
  {
    id: 'c2',
    name: 'Literary Fiction',
    slug: 'literary-fiction',
    description: 'Classic and contemporary narrative works of literary merit.',
    icon: 'Feather',
    display_order: 2,
  },
  {
    id: 'c3',
    name: 'Technology & Society',
    slug: 'technology-society',
    description: 'Examining artificial intelligence, digital culture, and future frontiers.',
    icon: 'Cpu',
    display_order: 3,
  },
  {
    id: 'c4',
    name: 'History & Culture',
    slug: 'history-culture',
    description: 'Deep historical perspectives, civilizational narratives, and cultural heritage.',
    icon: 'Compass',
    display_order: 4,
  },
  {
    id: 'c5',
    name: 'Science & Nature',
    slug: 'science-nature',
    description: 'Cosmology, evolutionary biology, physics, and ecological harmony.',
    icon: 'Globe',
    display_order: 5,
  },
  {
    id: 'c6',
    name: 'Essays & Criticism',
    slug: 'essays-criticism',
    description: 'Incisive literary criticism, cultural commentary, and personal essays.',
    icon: 'Edit3',
    display_order: 6,
  },
];

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'u-admin-1',
    username: 'elena_rostova',
    full_name: 'Elena Rostova',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Editor-at-large at Readora. Author of "The Architecture of Solitude". Contemplative essayist and collector of rare 19th-century typography.',
    interests: ['philosophy-ideas', 'essays-criticism', 'literary-fiction'],
    website: 'https://readora.example/elena',
    role: 'admin',
    created_at: '2025-01-10T09:00:00Z',
  },
  {
    id: 'u-user-2',
    username: 'julian_vance',
    full_name: 'Dr. Julian Vance',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bio: 'Researcher in AI ethics, technology commons, and computational epistemology. Visiting fellow at Oxford.',
    interests: ['technology-society', 'science-nature', 'philosophy-ideas'],
    website: 'https://julianvance.ai',
    role: 'moderator',
    created_at: '2025-02-14T11:20:00Z',
  },
  {
    id: 'u-user-3',
    username: 'marcus_reader',
    full_name: 'Marcus Bell',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    bio: 'Classicist, bibliophile, and physical book preservationist in Cambridge, MA.',
    interests: ['history-culture', 'philosophy-ideas'],
    role: 'user',
    created_at: '2025-03-01T14:45:00Z',
  },
  {
    id: 'u-user-4',
    username: 'sophia_chen',
    full_name: 'Sophia Chen',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    bio: 'Narrative non-fiction writer and educator exploring memory and poetry.',
    interests: ['literary-fiction', 'essays-criticism'],
    role: 'user',
    created_at: '2025-03-12T16:10:00Z',
  }
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'b1',
    title: "Vanish Culture",
    slug: 'vanish-culture',
    description: 'A series of deeply personal reflections and private notes outlining cultural heritage, resilience, and traditions.',
    author: 'Marcus Aurelius',
    cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    category_id: 'c1',
    language: 'English',
    publisher: 'Readora Classics Library',
    publication_date: '180-01-01',
    format: 'Chapter-based',
    license: 'Public Domain',
    status: 'published',
    is_featured: true,
    reading_permissions: 'public',
    read_url: 'https://archive.org/details/vanishing-culture-2026/page/19/mode/2up?ref=ol',
    created_at: '2025-01-15T08:00:00Z',
    average_rating: 4.9,
    ratings_count: 142,
    chapters_count: 3,
  },
  {
    id: 'b2',
    title: 'The Architecture of Solitude',
    slug: 'the-architecture-of-solitude',
    description: 'An immersive examination of why deep thought requires quiet spaces, how digital hyper-fragmentation erodes our capacity for deep reading, and how reclaiming solitude restores creative and intellectual sovereignty.',
    author: 'Elena Rostova',
    cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    category_id: 'c6',
    language: 'English',
    publisher: 'Veritas Literary Press',
    publication_date: '2024-03-15',
    format: 'Chapter-based',
    license: 'Creative Commons BY-NC 4.0',
    status: 'published',
    is_featured: true,
    reading_permissions: 'public',
    created_at: '2025-01-20T10:30:00Z',
    average_rating: 4.8,
    ratings_count: 88,
    chapters_count: 2,
  },
  {
    id: 'b3',
    title: 'Letters from a Stoic: Epistles on Life',
    slug: 'letters-from-a-stoic',
    description: 'Lucius Annaeus Seneca’s timeless epistles to Lucilius offering ethical guidance, advice on coping with adversity, friendship, mortality, and the cultivation of true wisdom.',
    author: 'Seneca',
    cover_image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    category_id: 'c1',
    language: 'English',
    publisher: 'Classical Epistles Archive',
    publication_date: '1969-01-01',
    format: 'Chapter-based',
    license: 'Public Domain',
    status: 'published',
    is_featured: false,
    reading_permissions: 'public',
    created_at: '2025-02-01T12:00:00Z',
    average_rating: 4.7,
    ratings_count: 53,
    chapters_count: 2,
  },
  {
    id: 'b4',
    title: 'The Silicon Commons: Technology and Ethics',
    slug: 'the-silicon-commons',
    description: 'Investigating the moral landscape of generative algorithms, intellectual property rights in the age of neural networks, and how society can preserve human cognitive agency.',
    author: 'Dr. Julian Vance',
    cover_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    category_id: 'c3',
    language: 'English',
    publisher: 'Meridian Academic Publishing',
    publication_date: '2025-01-10',
    format: 'Chapter-based',
    license: 'Open Knowledge License',
    status: 'published',
    is_featured: true,
    reading_permissions: 'public',
    created_at: '2025-02-10T14:15:00Z',
    average_rating: 4.6,
    ratings_count: 39,
    chapters_count: 2,
  }
];

export const INITIAL_CHAPTERS: BookChapter[] = [
  {
    id: 'ch1',
    book_id: 'b1',
    chapter_number: 1,
    title: 'Book I: Debts and Lessons',
    summary: 'Aurelius systematically acknowledges debts to mentors, family, and tutors who shaped his character.',
    read_time_minutes: 6,
    is_published: true,
    created_at: '2025-01-15T08:00:00Z',
    content: `
      <h2>Book I: Debts and Lessons</h2>
      <p>From my grandfather Verus I learned good morals and the government of my temper.</p>
      <p>From the reputation and remembrance of my father, modesty and a manly character.</p>
      <p>From my mother, piety and beneficence, and abstinence, not only from evil deeds, but even from evil thoughts; and further, simplicity in my way of living, far removed from the habits of the rich.</p>
      <p>From my governor, to be neither of the green nor of the blue party at the games in the Circus, nor a partizan either of the Parmularius or the Scutarius at the gladiators' fights; from him too I learned endurance of labour, and to want little, and to work with my own hands, and not to meddle with other people's affairs, and not to be ready to listen to slander.</p>
      <p>From Diognetus, not to busy myself about trifling things, and not to give credit to what was said by miracle-workers and jugglers about incantations and the driving away of daemons and such things; and not to breed quails for fighting, nor to give myself up passionately to such things; and to endure freedom of speech; and to have become intimate with philosophy.</p>
      <blockquote>"To have had the benefit of hearing Rusticus... and to be acquainted with the discourses of Epictetus, which he communicated to me from his own collection."</blockquote>
      <p>From Apollonius I learned freedom of will and undeviating steadiness of purpose; to look to nothing else, not even for a moment, except to reason; and to be always the same, in sharp pains, on the occasion of the loss of a child, and in long illness.</p>
    `,
  },
  {
    id: 'ch2',
    book_id: 'b1',
    chapter_number: 2,
    title: 'Book II: On the River Gran, Among the Quadi',
    summary: 'Morning preparation for encountering human foibles and anchoring the mind in reason.',
    read_time_minutes: 8,
    is_published: true,
    created_at: '2025-01-15T08:30:00Z',
    content: `
      <h2>Book II: On the River Gran</h2>
      <p>When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. They are like this because they cannot distinguish good from evil.</p>
      <p>But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own—not of the same blood or birth, but the same mind, and possessing a share of the divine. And so none of them can hurt me. No one can implicate me in ugliness.</p>
      <blockquote>"We were made to work together like feet, like hands, like the rows of the upper and lower teeth. To obstruct each other is unnatural. To feel anger at someone, to turn your back on him: these are obstructions."</blockquote>
      <p>Whatever this is that I am, it is a little flesh and breath, and the ruling part. Despise the flesh: blood and bones and a network, a jumble of nerves, veins, and arteries. Consider the breath: wind, always changing, expelled and sucked back again. Third is the ruling intellect. Discard your distractions; be no longer pulled asunder; cultivate stillness.</p>
    `,
  },
  {
    id: 'ch3',
    book_id: 'b1',
    chapter_number: 3,
    title: 'Book III: The Fleetness of Life',
    summary: 'Seeing the intrinsic dignity and aesthetic truth in nature’s decay and lifecycle.',
    read_time_minutes: 7,
    is_published: true,
    created_at: '2025-01-15T09:00:00Z',
    content: `
      <h2>Book III: The Fleetness of Life</h2>
      <p>We ought to observe also that even the things which follow after the things which are produced according to nature contain something pleasing and attractive. For instance, when bread is baked some parts are split at the surface, and these parts which thus open, and have a certain fashion contrary to the purpose of the baker's art, are beautiful in a manner, and in a peculiar way excite a desire for eating.</p>
      <p>And again, figs, when they are quite ripe, gape open; and in the ripe olives the very circumstance of their being near to rottenness adds a peculiar beauty to the fruit. And the ears of corn bending down, and the lion's eyebrows, and the foam which flows from the mouth of wild boars, and many other things—though they are far from being beautiful, if a man considers them severally, yet because they follow upon things which are produced by nature, they help to adorn them, and they please the mind.</p>
    `,
  },
  {
    id: 'ch4',
    book_id: 'b2',
    chapter_number: 1,
    title: 'The Sanctuary of the Undivided Mind',
    summary: 'The distinction between loneliness and productive solitude in the modern age.',
    read_time_minutes: 5,
    is_published: true,
    created_at: '2025-01-20T10:30:00Z',
    content: `
      <h2>The Sanctuary of the Undivided Mind</h2>
      <p>To read deeply is an act of defiance against a hyper-fragmented century. When we surrender our attention to an endless stream of digital ephemera, we do not merely lose time; we surrender our cognitive sovereignty.</p>
      <p>Solitude is not isolation. Isolation is the painful absence of others, whereas solitude is the rich, generative presence of oneself. In the quiet sanctuary of an undivided mind, disparate memories synthesize, questions ripen into clarity, and language finds its cadence.</p>
      <blockquote>"The architecture of a library is the physical embodiment of patience. High ceilings, hushed corridors, the muted rustle of turned pages—these are sensory bulwarks against the tyranny of the immediate."</blockquote>
      <p>Consider the desk of the 19th-century naturalist or the philosopher's garden path. These were not luxuries of an idle class; they were deliberate architectures designed to insulate cognition from the cacophony of trivial urgency.</p>
    `,
  },
  {
    id: 'ch5',
    book_id: 'b2',
    chapter_number: 2,
    title: 'The Geometry of Silence',
    summary: 'Exploring physical and sensory environments that foster sustained concentration.',
    read_time_minutes: 6,
    is_published: true,
    created_at: '2025-01-20T11:00:00Z',
    content: `
      <h2>The Geometry of Silence</h2>
      <p>Silence is not the absence of sound, but the presence of room to think. When the room falls quiet, our internal monologue undergoes a phase shift. The immediate reactive impulses settle like sediment in still water, leaving behind a transparent current of contemplative thought.</p>
      <p>In this chapter, we investigate the physical environments that encourage contemplation: natural lighting, minimal clutter, tactile paper, and the rhythmic pacing of unbroken paragraphs.</p>
    `,
  },
  {
    id: 'ch6',
    book_id: 'b3',
    chapter_number: 1,
    title: 'Letter I: On Saving Time',
    summary: 'Seneca advises Lucilius on reclaiming, gathering, and preserving precious hours.',
    read_time_minutes: 4,
    is_published: true,
    created_at: '2025-02-01T12:00:00Z',
    content: `
      <h2>Letter I: On Saving Time</h2>
      <p>Greetings from Seneca to his friend Lucilius.</p>
      <p>Continue to act thus, my dear Lucilius: set yourself free for your own sake; gather and save your time, which till lately has been forced from you, or filched away, or has merely slipped through your fingers.</p>
      <p>Make yourself believe the truth of my words: that certain moments are torn from us, that some are gently removed, and that others glide beyond our reach. The most disgraceful kind of loss, however, is that due to carelessness.</p>
      <blockquote>"What man can you show me who places any value on his time, who reckons the worth of each passing day, who understands that he is dying daily?"</blockquote>
    `,
  },
  {
    id: 'ch7',
    book_id: 'b4',
    chapter_number: 1,
    title: 'Chapter 1: The Enclosure of Thought',
    summary: 'How artificial systems transform the public domain of human expression.',
    read_time_minutes: 7,
    is_published: true,
    created_at: '2025-02-10T14:15:00Z',
    content: `
      <h2>Chapter 1: The Enclosure of Thought</h2>
      <p>Every major technological transformation alters the commons of human thought. The printing press decentralized the ecclesiastical monopoly on scripture; the internet democratized distribution; generative intelligence now commodifies synthesis itself.</p>
      <p>When machines can rephrase all of recorded human literature in seconds, what becomes of the essay? What is the virtue of writing when generation requires zero contemplation? The answer lies not in resistance, but in the deepened defense of human interiority.</p>
    `,
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'a1',
    title: 'In Praise of Slow Reading in an Accelerated World',
    slug: 'in-praise-of-slow-reading',
    subtitle: 'Why the deepest insights emerge only when we refuse to skim.',
    content: `
      <p>There is a fundamental difference between acquiring information and reading literature. Information seeks velocity; literature demands resonance. When we skim a technical document or social feed, our eyes dart in search of keywords and conclusions. But when we open Montaigne, Virginia Woolf, or Ralph Waldo Emerson, the meaning resides within the cadence of the sentence itself.</p>
      <h2>The Atrophy of the Deep Reading Brain</h2>
      <p>Neuroscientists have documented how digital reading habits retrain our cognitive circuitry toward rapid triage rather than immersive contemplation. We scan for novelty, skipping parenthetical nuances, lingering metaphors, and philosophical pivots. In doing so, we forfeit the quiet communion between author and reader.</p>
      <blockquote>"Reading is an exercise in empathy—a deliberate surrender to the consciousness of another mind."</blockquote>
      <p>To slow down is not an admission of lethargy; it is an assertion of aesthetic judgment. It is the decision to allow a single paragraph to echo throughout an afternoon.</p>
    `,
    excerpt: 'Neuroscientists have documented how digital reading habits retrain our cognitive circuitry toward rapid triage rather than immersive contemplation.',
    cover_image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    author_id: 'u-admin-1',
    category_id: 'c6',
    tags: ['Reading Habits', 'Philosophy', 'Mindfulness', 'Literature'],
    read_time_minutes: 5,
    status: 'published',
    is_featured: true,
    seo_title: 'In Praise of Slow Reading — Readora',
    seo_description: 'An editorial essay exploring why slow, deep reading is essential for nuanced thought in the digital age.',
    views_count: 1420,
    likes_count: 84,
    comments_count: 19,
    average_rating: 4.9,
    ratings_count: 32,
    created_at: '2025-02-05T10:00:00Z',
    updated_at: '2025-02-05T10:00:00Z',
  },
  {
    id: 'a2',
    title: 'The Ethics of Digital Lending & The Future of Public Libraries',
    slug: 'ethics-of-digital-lending',
    subtitle: 'Preserving communal access to knowledge amid proprietary digital locks.',
    content: `
      <p>For centuries, the physical library operated under a simple, revolutionary principle: once a community purchased a book, that copy belonged to the community to lend, repair, preserve, and pass down across generations without ongoing licensing fees.</p>
      <h2>The Shift to Controlled Digital Lending</h2>
      <p>In the digital realm, however, ownership has been replaced by temporary subscription leases. Libraries frequently find themselves paying exorbitant recurring licenses for titles that can vanish at the publisher's discretion. As digital reading grows, we must ask: what happens to democratic access to literature when the public square is walled by DRM?</p>
      <p>Readora's lending initiative seeks to bridge this divide by pairing physical peer-to-peer book sharing with legally distributable open digital editions.</p>
    `,
    excerpt: 'Libraries frequently find themselves paying exorbitant recurring licenses for titles that can vanish at publisher discretion.',
    cover_image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    author_id: 'u-user-2',
    category_id: 'c3',
    tags: ['Libraries', 'Digital Rights', 'Technology', 'Community'],
    read_time_minutes: 7,
    status: 'published',
    is_featured: true,
    seo_title: 'The Ethics of Digital Lending — Readora',
    seo_description: 'Examining copyright, library rights, and physical book lending in the 21st century.',
    views_count: 980,
    likes_count: 62,
    comments_count: 11,
    average_rating: 4.7,
    ratings_count: 18,
    created_at: '2025-02-18T14:30:00Z',
    updated_at: '2025-02-18T14:30:00Z',
  },
  {
    id: 'a3',
    title: 'Rediscovering Stoic Calm in Chaotic Times',
    slug: 'rediscovering-stoic-calm',
    subtitle: 'Actionable lessons from Marcus Aurelius and Epictetus for everyday equanimity.',
    content: `
      <p>Stoicism is often mistakenly characterized as cold emotional detachment. In truth, ancient Stoics were passionate lovers of humanity, active civic leaders, and keen observers of psychology. Their central insight was simple: our distress arises not from events, but from the judgments we make about them.</p>
      <p>By dividing every experience into what is up to us (our intentions, actions, integrity) and what is not (reputation, weather, outcomes), we unlock an unshakeable inner citadel.</p>
    `,
    excerpt: 'Our distress arises not from external circumstances, but from the reflexive judgments we cast upon them.',
    cover_image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    author_id: 'u-user-3',
    category_id: 'c1',
    tags: ['Stoicism', 'Marcus Aurelius', 'Self-Development'],
    read_time_minutes: 4,
    status: 'published',
    is_featured: false,
    seo_title: 'Rediscovering Stoic Calm — Readora',
    seo_description: 'Practical reflections on applying Stoic principles to modern challenges.',
    views_count: 730,
    likes_count: 45,
    comments_count: 8,
    average_rating: 4.8,
    ratings_count: 14,
    created_at: '2025-03-02T09:15:00Z',
    updated_at: '2025-03-02T09:15:00Z',
  }
];

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'p1',
    user_id: 'u-admin-1',
    content: 'Currently re-reading Marcus Aurelius: "Look within; within is the fountain of all good, and it will ever bubble up, if you will ever dig." How often during the workday do we remember to pause and dig into that quiet well?',
    post_type: 'quote',
    related_book_id: 'b1',
    status: 'published',
    likes_count: 38,
    comments_count: 9,
    created_at: '2025-03-10T11:00:00Z',
  },
  {
    id: 'p2',
    user_id: 'u-user-2',
    content: 'Just put up my hardcover copy of "Gödel, Escher, Bach" for lending in Boston / Cambridge! Any local bibliophile looking for a 3-week deep dive into recursion and cognition is welcome to request it.',
    post_type: 'thought',
    status: 'published',
    likes_count: 24,
    comments_count: 4,
    created_at: '2025-03-14T15:20:00Z',
  },
  {
    id: 'p3',
    user_id: 'u-user-4',
    content: 'What is the one sentence in any book that permanently shifted how you view the passage of time? For me, it was Seneca’s "Life is long if you know how to use it."',
    post_type: 'question',
    status: 'published',
    likes_count: 42,
    comments_count: 16,
    created_at: '2025-03-16T18:00:00Z',
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'cm1',
    user_id: 'u-user-3',
    post_id: 'p1',
    content: 'This line always stops me in my tracks. Especially Book IV where he discusses the inner retreat—reminding us that nowhere does a person withdraw into greater quiet than into their own mind.',
    created_at: '2025-03-10T12:15:00Z',
  },
  {
    id: 'cm2',
    user_id: 'u-user-4',
    post_id: 'p1',
    content: 'Beautifully put. I find that morning journaling before checking any email is the only way I can consistently tap into that well.',
    created_at: '2025-03-10T13:40:00Z',
  },
  {
    id: 'cm3',
    user_id: 'u-admin-1',
    post_id: 'p3',
    content: 'For me it is Annie Dillard: "How we spend our days is, of course, how we spend our lives."',
    created_at: '2025-03-16T18:45:00Z',
  }
];

export const INITIAL_LISTINGS: BookListing[] = [
  {
    id: 'l1',
    lender_id: 'u-user-3',
    title: 'Gödel, Escher, Bach: An Eternal Golden Braid',
    author: 'Douglas Hofstadter',
    condition: 'Very Good',
    lending_period_days: 21,
    pickup_location: 'Cambridge, MA (Harvard Square or Central)',
    terms: 'Please keep notes in pencil or on sticky notes only. No bent pages.',
    status: 'available',
    cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    created_at: '2025-03-14T15:00:00Z',
  },
  {
    id: 'l2',
    lender_id: 'u-admin-1',
    title: 'The Nature of Thought (Two-Volume Set)',
    author: 'Brand Blanshard',
    condition: 'Like New',
    lending_period_days: 28,
    pickup_location: 'New York, NY (Upper West Side)',
    terms: 'Careful handling requested. Rare hardcover edition.',
    status: 'available',
    cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    created_at: '2025-03-15T09:30:00Z',
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    user_id: 'u-admin-1',
    type: 'comment',
    title: 'New comment on your reflection',
    message: 'Marcus Bell replied to your quote reflection on Marcus Aurelius.',
    link: '/community',
    is_read: false,
    created_at: '2025-03-10T12:15:00Z',
  },
  {
    id: 'n2',
    user_id: 'u-admin-1',
    type: 'follow',
    title: 'New Follower',
    message: 'Sophia Chen began following your literary essays.',
    link: '/authors/u-user-4',
    is_read: true,
    created_at: '2025-03-12T16:15:00Z',
  }
];

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep1',
    reporter_id: 'u-user-3',
    target_type: 'post',
    target_id: 'p2',
    target_summary: 'Gödel, Escher, Bach lending listing post',
    reason: 'Incorrect category or location formatting',
    details: 'User posted a question in thought type instead of lending topic.',
    status: 'pending',
    created_at: '2025-03-15T10:00:00Z',
  }
];
