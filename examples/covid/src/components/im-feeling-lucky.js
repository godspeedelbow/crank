/** @jsx createElement */
import { createElement } from "@bikeshaving/crank";

import { countriesGenerator } from "../utils";

export async function* ImFeelingLucky({ onClick }) {
  const countries = countriesGenerator();

  const onclick = (country) => {
    onClick(country);
    this.refresh();
  };

  for await (const _ of this) {
    const { next: country, done } = await countries.next();

    yield done ? (
      <i>You're out of luck!</i>
    ) : (
      <button onclick={() => onclick(country)}>I'm feeling lucky</button>
    );
  }
}
