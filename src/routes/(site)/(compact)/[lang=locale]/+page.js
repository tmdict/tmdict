export const trailingSlash = "always";

export function load({ params }) {
  return {
    lang: params.lang
  };
}

export const entries = () => {
  return [
    { lang: "en" },
    { lang: "ja" },
    { lang: "zh" },
  ]
}
