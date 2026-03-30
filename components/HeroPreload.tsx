/**
 * Renders <link rel="preload"> hints for the hero background images.
 * Because the images are CSS background-images (not <img> elements),
 * the browser cannot discover them at parse time — explicit preloads
 * tell it to fetch them as part of the critical resource chain.
 *
 * Media queries ensure only the relevant image is preloaded per device.
 */
export default function HeroPreload() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/images/hero-bg8.webp"
        media="(min-width: 768px)"
      />
      <link
        rel="preload"
        as="image"
        href="/images/bg-mobile2.webp"
        media="(max-width: 767px)"
      />
    </>
  );
}
