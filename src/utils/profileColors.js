// Shared palette used by the ordered gallery profile-border sequence.
const profileColors = [
  "var(--color-green-lime)",
  "var(--color-blue)",
  "var(--color-cyan)",
  "var(--color-green-dark)",
  "var(--color-fuchsia)",
  "var(--color-orange)",
  "var(--color-pink-lilac)",
  "var(--color-green-mint)",
  "var(--color-green-teal)",
  "var(--color-red-primary)",
  "var(--color-pink-coral)"
];

// Indexes preserve the original gallery order, including repeated cyan and fuchsia.
const galleryColorSequence = [0, 1, 2, 3, 4, 5, 2, 6, 7, 8, 9, 4, 10];

let currentProfileColorIndex = 0;

// Preserve the gallery's repeating color order across successive renders.
export function getNextProfileColor() {
  const colorIndex = galleryColorSequence[currentProfileColorIndex];
  const profileColor = profileColors[colorIndex];
  currentProfileColorIndex = (currentProfileColorIndex + 1) % galleryColorSequence.length;
  return profileColor;
}
