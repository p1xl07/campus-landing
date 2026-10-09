# campus-landing

A multi-page guide for first-year students: home, about, events, FAQ and contact. Plain HTML, CSS and JavaScript, with no build step.

## Running it

Because the page loads events from `events.json`, it needs to be served over HTTP.

From the project directory, run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/` in your browser.

The live version is published with GitHub Pages from the `main` branch, so merged changes show up there within a couple of minutes.

## Adding an event

Add an entry to `events.json`:

```json
{
  "title": "Robotics workshop",
  "type": "Workshop",
  "date": "2026-10-20",
  "time": "16:00",
  "place": "Lab 2",
  "description": "Build a line follower in two hours."
}
```

`type` is `Workshop`, `Contest` or `Social`.

## How it's supposed to work

- The landing page welcomes students with a campus image and links to the About, Events, FAQ and Contact pages.
- The hamburger button opens a navigation drawer, allowing users to move between pages.
- Light and dark themes are available, and the selected theme is remembered across page reloads.
- The Events page displays events from `events.json` and provides event filtering.
- Past events are visually distinguished from upcoming events.
- Event titles and descriptions are displayed as text rather than executed as HTML.

## Code

- `index.html`: home / landing page
- `about.html`: about page
- `events.html`: events directory and event filtering
- `faq.html`: FAQ page
- `contact.html`: contact page
- `style.css`: shared styles, light/dark themes, navigation drawer, and responsive layout
- `script.js`: original events logic, retained for compatibility
- `events.json`: the list of events
- `assets/img/campus-landscape.png`: landing page hero image

## Contributing

Fork the repo, make your changes on a new branch, and open a pull request. Check your change on a narrow window as well as a wide one.

If you find a bug, open an issue with the steps to reproduce it, what you expected, and what happened instead.

Part of Source Start by CSI SPIT. MIT licensed.
