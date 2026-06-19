# Pinterest Clone

Replica of a Pinterest-style image gallery built with Vite, HTML, CSS and JavaScript. The app uses the Unsplash API to request image data and display responsive image cards based on the user's search.

This project is still in progress, so some sections include placeholders to complete later.

## Screenshots

<!-- Add screenshots here when the UI is ready. -->

| Desktop | Mobile |
| --- | --- |
| TODO: Add desktop screenshot | TODO: Add mobile screenshot |

## Project Description

This school project consists of creating a Pinterest clone. The page allows users to view different types of images depending on the search they perform.

The project is built with Vite and should use components to organize and reuse code. Image data is requested from the Unsplash API, including the image, photographer information, user profile image and other available metadata needed to match the proposed design.

## Requirements

- Meets the minimum HTML and CSS requirements from Project 1.
- Fully responsive website.
- Code organized into reusable components.
- Correctly retrieves the data needed to match the proposed design.
- Uses the Unsplash API for all displayed data.
- Clears the search input after every search.
- Provides a way to return to the initial page state, currently by clicking the logo.
- Public GitHub repository for project review.

## Current Features

- Initial image gallery loaded from Unsplash.
- Search by keyword using the search input.
- Search input clears after each search.
- Logo resets the page to the initial gallery state.
- Responsive masonry-style image gallery.
- Image cards display:
  - Unsplash image.
  - Photographer name.
  - Photographer profile image.
  - Image creation date.
  - Link to visit the image on Unsplash.
  - Overlay counters/icons.

## Tech Stack

- Vite
- JavaScript
- HTML
- CSS
- Unsplash API

## API

This project uses the Unsplash API.

- Documentation: https://unsplash.com/developers
- Current endpoints used:
  - `GET /photos`
  - `GET /search/photos`

TODO: Add more detail about the final endpoint choices and which response fields are used in each component.

## Getting Started

### Prerequisites

- Node.js installed.
- npm installed.
- Unsplash developer account.
- Unsplash Access Key.

TODO: Add the exact recommended Node.js version.

### Installation

Clone the repository:

```bash
git clone TODO: Add repository URL
cd pinterest-clone
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root. You can copy the example file:

```bash
cp .env.example .env
```

Then add your Unsplash Access Key:

```env
VITE_UNSPLASH_ACCESS_KEY=YOUR_UNSPLASH_ACCESS_KEY
```

Important: the variable must start with `VITE_` so Vite can expose it to the frontend through `import.meta.env`.

### Run the Project

Start the development server:

```bash
npm run dev
```

Then open the local URL shown in the terminal, usually:

```text
http://localhost:5173/
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```text
pinterest-clone/
|-- public/
|   |-- favicon.ico
|   `-- favicon.svg
|-- src/
|   |-- assets/
|   |   `-- images/
|   |-- css/
|   |   |-- button.css
|   |   |-- gallery.css
|   |   |-- header.css
|   |   |-- style.css
|   |   |-- utilities.css
|   |   `-- variables.css
|   `-- main.js
|-- .env.example
|-- index.html
|-- package.json
`-- README.md
```

TODO: Update this structure if/when the JavaScript is split into reusable component files.

## Design

- Proposed design: https://www.figma.com/design/gLRrcetLfS9KkG2o43qpfB/PROYECTO3?node-id=0-1&t=mq0pGZimhN0ytHEM-1
- Working Figma copy: https://www.figma.com/design/l48vr2vuBLl9OSuecc3i8k/PROYECTO3--Copy-?node-id=1-565&t=NC1WIjYdEnd23hi0-0

## Roadmap / TODO

- Split JavaScript into reusable components/modules.
- Replace temporary/random overlay counters with real API data where possible.
- Improve empty state and error messages.
- Add loading state while images are being requested.
- Add screenshots to this README.
- Add final deployment URL.
- Add repository URL.
- Review accessibility labels and image alt text.
- Confirm final responsive behavior on mobile, tablet and desktop.

## Useful Links

- Unsplash Developers: https://unsplash.com/developers
- Figma design: https://www.figma.com/design/gLRrcetLfS9KkG2o43qpfB/PROYECTO3?node-id=0-1&t=mq0pGZimhN0ytHEM-1
- Magnifying glass reference: https://commons.wikimedia.org/wiki/File:Magnifying_glass_icon.svg
