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

  console.log(`*** countries`, countries);
  yield* countries;
}
