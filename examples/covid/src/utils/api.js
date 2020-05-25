import { COVID_API_BASE_URL } from "../constants";

const FAST = 0; //ms
const SLOW = 5 * 1000; //ms

export function api(url, { slow } = {}) {
  return new Promise(async (resolve) => {
    const res = await fetch(url);
    setTimeout(
      () => {
        resolve(res);
      },
      slow ? SLOW : FAST
    );
  });
}

export async function* countriesGenerator() {
  const res = await api(COVID_API_BASE_URL + "/countries");
  const countries = await res.json();

  yield* countries;
}

export class CountryData {
  constructor(slug) {
    this.slug = slug;
  }
  async load() {
    const data = await api(`${COVID_API_BASE_URL}/live/country/${this.slug}`, {
      slow: false,
    })
      .then((response) => response.json())
      .catch((error) => console.log("error", error));

    this.data = data.filter(({ Province, City }) => !Province && !City);

    return this;
  }
  *backwards() {
    for (const day of this.data.reverse()) {
      yield day;
    }
  }
}
