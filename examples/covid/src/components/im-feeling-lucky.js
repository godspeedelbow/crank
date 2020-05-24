/** @jsx createElement */
import { createElement } from "@bikeshaving/crank";

import { countriesGenerator } from "../utils";

export async function* ImFeelingLucky({ onClick }) {
  const countries = countriesGenerator();

  let country;
  const onclick = async () => {
    onClick(country);
    this.refresh();
  };

  for await (const _ of this) {
    country = (await countries.next()).value;
    yield <button onclick={onclick}>I'm feeling lucky</button>;
  }
}
