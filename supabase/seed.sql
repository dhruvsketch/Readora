-- ==============================================================================
-- READORA SEED DATA (Supabase / PostgreSQL)
-- ==============================================================================

-- Categories
INSERT INTO public.categories (id, name, slug, description, icon, display_order) VALUES
('c0000001-0000-0000-0000-000000000001', 'Philosophy & Ideas', 'philosophy-ideas', 'Reflections on ethics, existence, consciousness, and timeless wisdom.', 'BookOpen', 1),
('c0000001-0000-0000-0000-000000000002', 'Literary Fiction', 'literary-fiction', 'Classic and contemporary narrative works of literary merit.', 'Feather', 2),
('c0000001-0000-0000-0000-000000000003', 'Technology & Society', 'technology-society', 'Examining artificial intelligence, digital culture, and future frontiers.', 'Cpu', 3),
('c0000001-0000-0000-0000-000000000004', 'History & Culture', 'history-culture', 'Deep historical perspectives, civilizational narratives, and cultural heritage.', 'Compass', 4),
('c0000001-0000-0000-0000-000000000005', 'Science & Nature', 'science-nature', 'Cosmology, evolutionary biology, physics, and ecological harmony.', 'Globe', 5),
('c0000001-0000-0000-0000-000000000006', 'Essays & Criticism', 'essays-criticism', 'Incisive literary criticism, cultural commentary, and personal essays.', 'Edit3', 6)
ON CONFLICT (slug) DO NOTHING;

-- Books
INSERT INTO public.books (id, title, slug, description, author, cover_image, category_id, language, publisher, publication_date, format, license, status, is_featured, reading_permissions) VALUES
(
  'b0000001-0000-0000-0000-000000000001',
  'Meditations: The Emperor''s Notebook',
  'meditations-marcus-aurelius',
  'A series of deeply personal reflections and private notes written by Marcus Aurelius, Roman Emperor from 161 to 180 AD, outlining Stoic philosophy and practical ethics for resilience, virtue, and peace of mind.',
  'Marcus Aurelius',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  'c0000001-0000-0000-0000-000000000001',
  'English',
  'Readora Classics Editions',
  '180-01-01',
  'Chapter-based',
  'Public Domain',
  'published',
  true,
  'public'
),
(
  'b0000001-0000-0000-0000-000000000002',
  'The Architecture of Solitude',
  'the-architecture-of-solitude',
  'An immersive exploration of why deep thought requires quiet spaces, how modern digital distraction erodes deep reading, and how reclaiming solitude restores creative clarity.',
  'Elena Rostova',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  'c0000001-0000-0000-0000-000000000006',
  'English',
  'Veritas Literary Press',
  '2024-03-15',
  'Chapter-based',
  'Creative Commons BY-NC 4.0',
  'published',
  true,
  'public'
),
(
  'b0000001-0000-0000-0000-000000000003',
  'Letters from a Stoic: Epistles on Life',
  'letters-from-a-stoic',
  'Lucius Annaeus Seneca''s timeless letters to Lucilius offering ethical guidance, advice on coping with adversity, friendship, mortality, and the pursuit of tranquility.',
  'Seneca',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  'c0000001-0000-0000-0000-000000000001',
  'English',
  'Classical Epistles Library',
  '1969-01-01',
  'Chapter-based',
  'Public Domain',
  'published',
  false,
  'public'
),
(
  'b0000001-0000-0000-0000-000000000004',
  'The Silicon Commons: Technology and Ethics',
  'the-silicon-commons',
  'Investigating the moral landscape of generative algorithms, intellectual property rights in the age of neural networks, and how society preserves human agency.',
  'Dr. Julian Vance',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
  'c0000001-0000-0000-0000-000000000003',
  'English',
  'Meridian Academic Publishing',
  '2025-01-10',
  'Chapter-based',
  'Open Knowledge License',
  'published',
  true,
  'public'
)
ON CONFLICT (slug) DO NOTHING;

-- Book Chapters for Meditations
INSERT INTO public.book_chapters (book_id, chapter_number, title, content, summary, read_time_minutes, is_published) VALUES
(
  'b0000001-0000-0000-0000-000000000001',
  1,
  'Book I: Debts and Lessons',
  '<p>From my grandfather Verus I learned good morals and the government of my temper.</p><p>From the reputation and remembrance of my father, modesty and a manly character.</p><p>From my mother, piety and beneficence, and abstinence, not only from evil deeds, but even from evil thoughts; and further, simplicity in my way of living, far removed from the habits of the rich.</p><p>From my governor, to be neither of the green nor of the blue party at the games in the Circus, nor a partizan either of the Parmularius or the Scutarius at the gladiators'' fights; from him too I learned endurance of labour, and to want little, and to work with my own hands, and not to meddle with other people''s affairs, and not to be ready to listen to slander.</p><p>From Diognetus, not to busy myself about trifling things, and not to give credit to what was said by miracle-workers and jugglers about incantations and the driving away of daemons and such things; and not to breed quails for fighting, nor to give myself up passionately to such things; and to endure freedom of speech; and to have become intimate with philosophy.</p>',
  'Aurelius systematically acknowledges his debts to mentors, family, and tutors who shaped his character.',
  6,
  true
),
(
  'b0000001-0000-0000-0000-000000000001',
  2,
  'Book II: On the River Gran, Among the Quadi',
  '<p>When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. They are like this because they cannot distinguish good from evil.</p><p>But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own—not of the same blood or birth, but the same mind, and possessing a share of the divine. And so none of them can hurt me. No one can implicate me in ugliness. Nor can I feel angry at my relative, or hate him. We were made to work together like feet, like hands, like the rows of the upper and lower teeth.</p><p>To obstruct each other is unnatural. To feel anger at someone, to turn your back on him: these are obstructions.</p><p>Whatever this is that I am, it is a little flesh and breath, and the ruling part. Despise the flesh: blood and bones and a network, a jumble of nerves, veins, and arteries. Consider the breath: wind, always changing, expelled and sucked back again. Third was the ruling part. Discard your books; be no longer distracted; that is not allowed.</p>',
  'Morning preparation for encountering human foibles and anchoring the mind in what is within one''s control.',
  8,
  true
),
(
  'b0000001-0000-0000-0000-000000000001',
  3,
  'Book III: The Fleetness of Life',
  '<p>We ought to observe also that even the things which follow after the things which are produced according to nature contain something pleasing and attractive. For instance, when bread is baked some parts are split at the surface, and these parts which thus open, and have a certain fashion contrary to the purpose of the baker''s art, are beautiful in a manner, and in a peculiar way excite a desire for eating.</p><p>And again, figs, when they are quite ripe, gape open; and in the ripe olives the very circumstance of their being near to rottenness adds a peculiar beauty to the fruit. And the ears of corn bending down, and the lion''s eyebrows, and the foam which flows from the mouth of wild boars, and many other things—though they are far from being beautiful, if a man considers them severally, yet because they follow upon things which are produced by nature, they help to adorn them, and they please the mind.</p>',
  'Seeing the intrinsic dignity and aesthetic truth in nature''s natural decay and lifecycle.',
  7,
  true
)
ON CONFLICT (book_id, chapter_number) DO NOTHING;

-- Chapters for The Architecture of Solitude
INSERT INTO public.book_chapters (book_id, chapter_number, title, content, summary, read_time_minutes, is_published) VALUES
(
  'b0000001-0000-0000-0000-000000000002',
  1,
  'The Sanctuary of the Undivided Mind',
  '<p>To read deeply is an act of defiance against a hyper-fragmented century. When we surrender our attention to an endless stream of digital ephemera, we do not merely lose time; we surrender our cognitive sovereignty.</p><p>Solitude is not isolation. Isolation is the painful absence of others, whereas solitude is the rich, generative presence of oneself. In the quiet sanctuary of an undivided mind, disparate memories synthesize, questions ripen into clarity, and language finds its cadence.</p><p>Consider the desk of the 19th-century naturalist or the philosopher''s garden path. These were not luxuries of an idle class; they were deliberate architectures designed to insulate cognition from the cacophony of trivial urgency.</p>',
  'The distinction between loneliness and productive solitude, and why deep reading demands undivided attention.',
  5,
  true
),
(
  'b0000001-0000-0000-0000-000000000002',
  2,
  'The Geometry of Silence',
  '<p>Silence is not the absence of sound, but the presence of room to think. When the room falls quiet, our internal monologue undergoes a phase shift. The immediate reactive impulses settle like sediment in still water, leaving behind a transparent current of contemplative thought.</p><p>In this chapter, we investigate the physical environments that encourage contemplation: natural lighting, minimal clutter, tactile paper, and the rhythmic pacing of unbroken paragraphs.</p>',
  'Exploring physical and sensory environments that foster prolonged concentration.',
  6,
  true
)
ON CONFLICT (book_id, chapter_number) DO NOTHING;
