# campus-landing

A one-page guide for first-year students: upcoming events, a FAQ and contacts. Plain HTML, CSS and JavaScript, with no build step.

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

- Every link in the top bar scrolls to its section.
- On a phone-sized screen the links move into a menu behind the ☰ button. Tapping a link closes the menu.
- Dark mode is remembered: reload the page and it stays on.
- The countdown under the heading is for the next event that hasn't happened yet. If there are none, it says so.
- Past events are faded out. The filter buttons show only that type of event.
- Event titles and descriptions are shown as plain text. If one contains HTML, it's displayed, not run.

## Code

- `index.html`: the page
- `style.css`: styles, including dark mode and the mobile layout
- `script.js`: menu, dark mode, events list, countdown
- `events.json`: the list of events

## Contributing

Fork the repo, make your changes on a new branch, and open a pull request. Check your change on a narrow window as well as a wide one.

If you find a bug, open an issue with the steps to reproduce it, what you expected, and what happened instead.

Part of Source Start by CSI SPIT. MIT licensed.
