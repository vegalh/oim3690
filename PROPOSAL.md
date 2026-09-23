

# Project Proposal: Lesson Finder & Designer

## Background

I interviewed the teacher I work with in my kindergarten classroom about what actually makes her day hard. Two things came up over and over:

1. **Prep time** — putting together circle time and daily lessons takes her a long time, especially when she has to pull ideas from different books, folders, and websites.
2. **Tailoring lessons** — it's hard to quickly adjust a lesson to fit the time she actually has that day, the room/environment she's in, the weather (indoor vs. outdoor activities), and what the specific group of children is interested in that week.

There's also a bigger goal behind this: our kindergarten wants to stand out for having high-quality, child-led lessons, not just filler activities. Right now that reputation depends entirely on how much prep time a teacher has, which isn't sustainable.

## Problem Statement

Teachers need a fast way to find or build a lesson that fits **today's specific constraints** (time available, environment, weather, children's current interests) instead of starting from scratch or digging through scattered materials every time.

## Proposed Solution

A simple web app — a **Lesson Finder & Designer** — with two connected parts:

### 1. Lesson Library (Finder)
A searchable/filterable collection of circle-time and activity ideas, where each lesson is tagged with:
- **Duration** (e.g., 5 min, 15 min, 30 min)
- **Environment** (indoor, outdoor, gym, requires table space, etc.)
- **Weather dependency** (needs outdoor/nice weather, indoor-only, weather-flexible)
- **Interest/theme tags** (animals, dinosaurs, seasons, music, letters, numbers, etc.)
- **Materials needed**

A teacher could filter by "I have 15 minutes, we're stuck inside, it's rainy, and the kids are into dinosaurs this week" and get a short list of matching lessons instead of searching manually.

### 2. Lesson Designer (Builder)
A lightweight form/template where a teacher can quickly assemble a new lesson plan by picking a structure (intro → activity → wrap-up), filling in the same tags as above, and saving it back into the library so it's reusable and taggable for next time — turning one-off ideas into a growing, searchable resource for the whole school.

## Why This Fits the Class

This matches the plain HTML/CSS/JS approach I've been using for the rest of my coursework (like the housing points tracker in [try.html](try.html)):
- Lesson data can be stored as a simple array of objects in JavaScript, with `localStorage` used to save new lessons a teacher adds through the Designer.
- The Finder is essentially a filter/search UI over that array (similar filtering logic to what I already built for housing points).
- The Designer is a form that appends a new lesson object to the same list.

No frameworks or backend needed — everything can run as a static page, which also means it would be easy to eventually share with other teachers at the school.

## Next Steps

1. Sketch the tag categories with the teacher (duration, environment, weather, interests) to make sure the filters match how she actually thinks about lessons.
2. Seed the library with a handful of real lessons she already uses, tagged accordingly.
3. Build the Finder UI first (filter + list), then add the Designer form once the data shape is proven out.
4. Get her to test it during actual lesson prep and adjust the tags/filters based on what's missing or confusing.

## Site Plan

The teacher I interviewed lands here, usually mid-prep with a specific set of constraints in mind — 15 minutes, indoors, rainy day, dinosaur-obsessed kids — rather than a blank slate. The one thing she does on this site is filter the Lesson Library down to a short list of matching activities and open the one that fits today. The site has three sections: **Home** (the filter form plus results list, since that's the task she does every day), **About** (why this exists — the prep-time problem and the goal of consistent, high-quality lessons), and **Projects** (the Lesson Designer form for building and saving new tagged lessons, shown as a growing project of the library itself). Content is just the tagged lesson data (duration, environment, weather, interest tags, materials, steps) stored as a JS array/`localStorage`, with no accounts or backend. Two sites I looked at for comparison were Teachers Pay Teachers and PBS LearningMedia, because both let a teacher narrow a large pile of resources down fast using the same kind of facets I want (grade/subject on those sites, time/environment/weather/interest on mine) — that filter-first pattern is exactly what makes "just show me what fits today" possible instead of scrolling everything.