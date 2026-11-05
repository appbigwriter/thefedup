import type { Article, Author, Category, InstitutionalPage } from "../types";

export const categories: Category[] = [
  { slug: "atrocity-of-the-week", name: "Atrocity of the Week", description: "The most poorly planned decision of the past few days, taken apart down to the last screw.", tone: "fail" },
  { slug: "highly-questionable", name: "Highly Questionable", description: "Trends, apps and fads everybody loves that are structurally ridiculous.", tone: "alert" },
  { slug: "the-flawed-blueprint", name: "The Flawed Blueprint", description: "We take an everyday system, find the flaw and redesign it. Nobody will use it.", tone: "blueprint" },
  { slug: "letters-to-management", name: "Letters to Management", description: "Formal complaints, in writing, addressed to people who will never read them.", tone: "paper" },
  { slug: "it-was-bad-back-then-too", name: "It Was Bad Back Then Too", description: "The antidote to nostalgia: the past didn't work either. It was just slower.", tone: "steel" },
];

export const authors: Author[] = [
  {
    slug: "arthur",
    name: "Arthur Bastos",
    role: "Retired quality-control inspector",
    bio: "Spent 37 years rejecting parts at an auto-parts factory and now rejects the rest of the world. Carries a notebook of nonconformities and believes everything has a specification; the problem is nobody reads it.",
    fictional: true,
  },
  {
    slug: "nico",
    name: "Nico Ferraz",
    role: "Retired late-night AM radio host",
    bio: "Hosted \"Nico After Midnight\" on AM radio for 30 years. He doesn't want to fix the world; he wants to know who signed off on it. Owns a dog named Manager so he can always ask to speak to the Manager.",
    fictional: true,
  },
];

export const articles: Article[] = [
  {
    slug: "unexpected-item-self-checkout",
    title: "Unexpected item: how self-checkout turned me into an unpaid employee",
    subtitle: "The supermarket fired the cashier and hired you. Nobody told you.",
    excerpt: "I spent forty minutes running a supermarket register with no training, no pay and no stool. And the machine still complained about my banana.",
    category: "highly-questionable",
    author: "nico",
    publishedAt: "2026-11-03",
    keywords: ["self-checkout", "supermarket", "cashier", "technology"],
    featured: true,
    coverLabel: "UNEXPECTED ITEM",
    blueprint: "If the customer does the cashier's job, the customer deserves the cashier's discount. Or at the very least, the stool.",
    faq: [
      { q: "Is self-checkout always bad?", a: "No. If you're buying three things in a hurry, it can be great. The problem starts when it becomes the only option and the system treats every customer like a suspect." },
      { q: "Why does the scale say \"unexpected item\"?", a: "Usually the bagging area compares the expected weight of the product with the weight placed in the bag. Any difference outside the tolerance freezes the transaction until someone overrides it." },
    ],
    content: `Yesterday I got fired from a job I never had. Let me explain.

I went into the supermarket to buy four things: bread, coffee, soap and a banana. One. I'm a 61-year-old man, I don't need a bunch. At the exit there was **one human register open** and a line that started back at the bakery. Next to it, eight glowing screens, calling me like sirens.

I went.

## The job I didn't apply for

Look at what happened. The cashier — trained, doing this eight hours a day, knows the banana code by heart — was replaced by me. Me: no training, no badge, no paycheck. And no stool. **She had a stool.** I stood there holding a banana like it was evidence.

Arthur, who was with me and is incapable of experiencing anything without measuring it, timed me: four items in seven minutes and forty seconds. According to him, an experienced cashier would do it in under a minute. "You are the least productive employee in the history of retail," he said. Thanks, Arthur. At least I'm free.

## "Unexpected item in the bagging area"

Then the machine spoke to me. In that calm voice of someone who has never stood in line: *unexpected item in the bagging area*.

Unexpected? **It was a banana.** A banana is the most expected thing on Earth. Monkeys expect bananas. Grocery stores expect bananas. Bananas are so expected they come pre-wrapped.

Arthur explained, with the patience of a man who has rejected 2.3 million parts: the bagging-area scale compares the expected weight with the weight you put down. It was off by twelve grams. Twelve grams! I told him that was my dignity leaving the building. It weighs exactly twelve grams. He wrote it down in his notebook.

## The lady with the badge

The screen froze and a little red light came on above my head. A red light. Above an older gentleman. Holding a banana. Everybody looked.

Then the lady with the badge came to unlock it. And who was the lady with the badge? **The same lady from the register.** She wasn't fired; she was promoted to old-man supervisor. The company didn't eliminate her job; now she works *and* I work. The only system in history where you add an employee and nobody gets paid more.

## The final question

At the end, after the receipt, the screen asked: "How was your experience?" With little faces. Green, yellow, red.

Arthur gave it a rating. I asked what he gave it. He looked at the screen and said, without blinking: "Unexpected item."

I have nothing against technology. I was a radio host; I lived on technology. What I won't accept is technology that hands the work to me and the profit to someone else, and then wants to know if I enjoyed it.`,
  },
  {
    slug: "flawed-blueprint-airplane-boarding",
    title: "Airplane boarding is the worst logistics project ever approved by human beings",
    subtitle: "A technical report on lines, groups, carry-ons and the impossibility of sitting down.",
    excerpt: "We board airplanes like filling a bottle through the neck, in the wrong order, with everyone carrying a bag that doesn't fit. I redesigned the process. Nobody will use it.",
    category: "the-flawed-blueprint",
    author: "arthur",
    publishedAt: "2026-10-28",
    keywords: ["boarding", "airplane", "airport", "logistics", "lines"],
    featured: true,
    coverLabel: "BOARDING: ZERO",
    blueprint: "Staggered boarding — windows first, then middles, then aisles, alternating rows — and one simple rule: your carry-on goes above your own seat, not above the seat closest to the door.",
    faq: [
      { q: "Is there really a faster way to board?", a: "Academic studies and simulations, such as those published by astrophysicist Jason Steffen in 2008, suggest that methods preventing several passengers from blocking the same stretch of aisle tend to be faster than back-to-front group boarding." },
      { q: "Why don't airlines use the ideal method?", a: "Because boarding order is also a product: paid priority, loyalty programs and families with small children scramble any theoretical sequence." },
    ],
    content: `Let's look at the data.

A single-aisle airplane has, say, thirty rows and six seats per row. One aisle. One door. One hundred and eighty people, each carrying a bag designed to fit "most airlines" — which, in engineering terms, means "none".

The current process consists of taking those hundred and eighty people and pushing them through the same tube, in the same direction, at the same time. In any factory this would have a name: **bottleneck**. At the airport, it's called "priority boarding".

## First: the current design

The most common system splits passengers into groups. The groups are called over a loudspeaker whose intelligibility, by my informal measurement, sits below 40%. The groups are formed not by seating logic but by credit card tier.

Nico, who was with me on our last trip, put it better than I could: "They call us by income, not by row."

## Second: the structural flaw

The problem isn't the number of people. It's the **single point of failure**: the passenger standing in the aisle stowing a bag. While he wrestles with the overhead bin, everyone behind him stops. If he's in row 4 and the person behind him is in row 28, row 28 waits for a problem that isn't theirs.

Make it worse with the migratory bag phenomenon: since the bin above your seat is already full, you stow your bag in row 6 and sit in row 22. On the way out, you swim upstream. It's a system that fails on entry *and* on exit. Rare. Almost admirable.

## Third: the redesign

The redesign isn't my invention. Academic studies and simulations — the most cited being astrophysicist Jason Steffen's, in 2008 — suggest that **staggered boarding**, where several passengers stow bags at the same time in different stretches of the aisle, is faster than boarding in back-to-front blocks.

The simplified version, which even Nico can follow:

1. Window seats first, then middle seats, then aisle seats.
2. Within each stage, alternate rows, so nobody is stuck right behind somebody else in the aisle.
3. Carry-on **above your own seat**. No exceptions. No "just for a second over here".

## Fourth: why it will never happen

Because boarding order is a product. People pay to get on first, to sit down earlier inside a tube where they'll be sitting for three hours. It's the only line in the world where you pay to wait longer.

I logged it in the notebook: grade-five nonconformity. Nico asked me to note that they don't give out peanuts anymore. Noted. Grade two.`,
  },
  {
    slug: "letter-to-management-yogurt-lid",
    title: "A letter to the management of the yogurt lid",
    subtitle: "A formal complaint, filed in duplicate, about packaging that requires strength, technique and faith.",
    excerpt: "Dear management: the yogurt lid tore into three pieces, none of them useful, and I ended up eating the product with my fingertip. Please find my formal complaint below.",
    category: "letters-to-management",
    author: "arthur",
    publishedAt: "2026-10-21",
    keywords: ["packaging", "design", "yogurt", "complaint"],
    featured: true,
    coverLabel: "DEAR MANAGEMENT",
    blueprint: "An opening tab larger than an adult fingertip, a seal that peels off in one piece, and an opening test by someone over 60 before the packaging is approved.",
    content: `To the management responsible for the yogurt lid,

I am writing to formally report a nonconformity observed on the 19th of this month, at 7:42 a.m., in my kitchen.

## Description of the incident

While attempting to open a cup of plain yogurt, I located the opening tab. By "tab", please understand a protrusion of roughly two millimeters, designed, as far as I can tell, to be gripped by an ant.

I pulled with my thumb and index finger. The lid tore. Not cleanly: it tore into **three pieces**, none of them removable, all firmly bonded to the rim. One of them, the largest, remained over the yogurt like a tarp over a roof under construction.

## Mitigation attempts

1. I tried a knife. The knife pierced the lid and sprayed yogurt onto my shirt, which had been ironed.
2. I tried a spoon. The spoon pushed the lid into the yogurt.
3. I called Nico. Nico arrived, looked at the cup, said "that doesn't open, Arthur, it's decorative," opened it with his teeth and ate half.

## Failure analysis

The problem is not the yogurt. The yogurt is within specification. The problem is that someone approved this packaging by testing it with 25-year-old hands, in a lab, with the cup sitting still on a table under perfect lighting. Nobody tested it at 7:42 a.m., half asleep, with the hands of a 64-year-old man and a coffee going cold nearby.

In quality control, we call this **testing outside conditions of use**. It's the equivalent of approving an umbrella on a sunny day.

## Request

I respectfully request that the next version of the lid be tested by someone who has, at some point, opened a container without meaning to. I am available to take part in the test. I will bring a spare shirt.

Sincerely,

**Arthur Bastos**
Quality inspector (retired, but not in spirit)

*P.S. from Nico: the yogurt was good.*`,
  },
  {
    slug: "it-was-bad-back-then-payphones-and-bank-lines",
    title: "It was bad back then too: payphones, coins and a whole afternoon in the bank line",
    subtitle: "Before anyone says \"things were better in my day\", let's look at the facts. They weren't.",
    excerpt: "Some people miss a time when paying a bill took an afternoon and calling home required coins, luck and a payphone that wasn't broken. We remember. We don't miss it.",
    category: "it-was-bad-back-then-too",
    author: "nico",
    publishedAt: "2026-10-14",
    keywords: ["nostalgia", "payphone", "bank", "80s", "90s"],
    featured: true,
    coverLabel: "IN MY DAY",
    blueprint: "Complain about the present without romanticizing the past. The past also went to production without testing — just more slowly.",
    content: `Every week somebody comments on our videos: "back in your day things worked". My friend, I was there. **They didn't.** They worked *more slowly*, which gave the impression that someone was looking after them.

Arthur asked me to write this because, according to him, I have "emotional memory without quality control". He'll edit it. I'm telling you now that I disagree with his edits.

## The payphone

To call home you needed three things: coins, a working payphone and faith. The coins were never the right ones. The working payphone was always two blocks past the first one you found, which had no receiver. And faith was necessary because the payphone **ate your coins** without connecting the call, and there was nobody to complain to. No customer service. Just the wind.

I spent years doing late-night radio. Do you know how many listeners called from payphones to request a song and got cut off halfway through? I have a mental collection of "Nico, play that one by…" *click*. To this day I don't know which one.

## The bank line

Paying a bill was a commitment. You blocked off the afternoon. You brought a newspaper, a sandwich and sometimes a folding stool. Arthur timed it. His worst record, logged in the notebook, was **three hours and eleven minutes** to pay an electric bill that, by the time he reached the teller, was overdue.

The bank closed at four. If you got there at one minute past four, the revolving door locked with you inside it, like a metaphor.

## The form in triplicate

Everything had a form. The form came in triplicate. The third copy, the pink one, nobody knew what it was for, but it was the only one they ever asked for later.

## So is today better?

No. Today is bad in a different way. Today the payphone is an app that demands an update the moment you need it, and the bank line is a chatbot that replies "I didn't understand, could you rephrase?".

The difference is that back then we suffered standing up, and today we suffer sitting down, staring at our phones. It's an ergonomic improvement. Arthur approved it. With reservations.`,
  },
];

export const pages: InstitutionalPage[] = [
  {
    slug: "about",
    title: "About The Fed Up Buddies",
    description: "Who Arthur and Nico are, why they complain and how this site is made.",
    content: `**The Fed Up Buddies** is a satire, opinion and humor project about the news, technology, behavior and everyday absurdity. It is part of an ecosystem with versions in three languages: *Os Saco Cheio* (Portuguese) and *Los Hartos* (Spanish).

## The characters

**Arthur Bastos** and **Nico Ferraz** are **fictional characters**: two retirees in their early sixties, friends for 31 years, who met in a line at the motor vehicles office. Arthur was a quality-control inspector; Nico was a late-night AM radio host. In the story, they were "digitized" by Nico's grandson, who couldn't stand listening to them complain at Sunday lunch anymore.

In the videos, Arthur and Nico appear as **digital avatars created with artificial intelligence**. They do not represent or imitate real people.

## What we publish

- **Atrocity of the Week** — poorly planned decisions and events.
- **Highly Questionable** — trends and technologies everybody loves.
- **The Flawed Blueprint** — everyday systems redesigned (without hope).
- **Letters to Management** — formal complaints.
- **It Was Bad Back Then Too** — the antidote to nostalgia.

## Our rules

1. We make fun of **systems, decisions and designs** — never victims, minorities or personal characteristics.
2. When we cite a real fact, we link the source.
3. Satire is opinion: the pieces are signed by the characters and reflect their point of view.
4. Partisan politics isn't our beat. Bureaucracy is.

## Who runs this site

Content is written and edited by the project's editorial team. Editor in charge: [INSERT EDITOR NAME]. To reach us, see the [contact](/contact) page.`,
  },
  {
    slug: "contact",
    title: "Contact",
    description: "How to reach The Fed Up Buddies team — and how to send your letter to management.",
    content: `Want to send a complaint to **Letters to Management**, suggest a topic, point out a mistake or talk about partnerships?

- **Email:** [INSERT OFFICIAL EMAIL]

When you write to us, tell us the story in as much detail as you can, without personal data about other people. If your letter is used in a video or article, it may be adapted, and we won't identify you without permission.

We don't reply as fast as a call center, but unlike a call center, we read.`,
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: "How The Fed Up Buddies handles personal data and which technologies are active on this site.",
    content: `*Last updated: [INSERT PUBLICATION DATE]*

This policy explains how **The Fed Up Buddies** website handles visitor information. It describes only what is **actually active** on the site.

## Controller
[INSERT LEGAL NAME OF THE RESPONSIBLE PARTY], contact: [INSERT OFFICIAL EMAIL].

## What we collect today
- **Theme preference (light/dark):** stored only in your browser (local storage). It is not sent to us.
- **Technical server logs:** the hosting provider may log technical data (such as IP address and access time) for security and operation, under the hosting provider's own policy.
- **Emails you send us:** used only to reply and, with your permission, for Letters to Management.

## What is NOT active right now
This site does **not** currently use audience analytics, advertising pixels or ads. If that changes (for example, by enabling Google AdSense or analytics tools), this policy will be updated before activation and, where the law requires it, we will ask for your consent.

## Your rights
You may request access to, correction of or deletion of your data at the email above.

## Changes
We will update this page whenever our practices change.`,
  },
  {
    slug: "terms",
    title: "Terms of Use",
    description: "Rules for using The Fed Up Buddies website.",
    content: `By using this site, you agree to these terms.

## Nature of the content
The content is **satire and opinion**. The pieces are signed by fictional characters and should not be taken as professional advice of any kind.

## Rights
Texts, characters, trademarks and images belong to [INSERT RIGHTS HOLDER]. Short quotes with a link back to the source are welcome.

## External links
We may point to external sources. We don't control the content of those sites.

## Contact
Questions: [INSERT OFFICIAL EMAIL].`,
  },
];
