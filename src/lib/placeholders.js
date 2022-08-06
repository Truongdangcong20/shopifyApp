import info from 'assets/info.json';

const PLACEHOLDERS = info.homepage.content;

export function getHeroPlaceholder(heros) {
  if (!heros?.length) return [];

  return heros.map((hero, index) => {
    if (hero?.heading?.value) {
      return hero;
    }

    const placeholder = PLACEHOLDERS.HEROS[index];

    const byLine =
      hero?.byLine || hero?.descriptionHtml
        ? {value: hero.descriptionHtml}
        : placeholder.byline;

    const heading =
      hero?.heading || hero?.title ? {value: hero.title} : placeholder.heading;

    return {
      heading,
      byLine,
      cta: hero?.cta || placeholder.cta,
      handle: hero?.handle || placeholder.handle,
      id: hero?.id || index,
      spread: hero?.spread || placeholder.spread,
      spreadSecondary: hero?.spreadSecondary || placeholder.spreadSecondary,
      height: placeholder?.height || undefined,
      top: placeholder?.top || undefined,
    };
  });
}

export function getProductInfoPlaceholder() {
  function getMultipleRandom(arr, infos) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, infos);
  }

  return getMultipleRandom(PLACEHOLDERS.PRODUCT_INFO, 3);
}

export function getProductPlaceholder() {
  return PLACEHOLDERS.PRODUCT;
}
