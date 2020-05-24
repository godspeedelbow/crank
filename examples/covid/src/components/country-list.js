/** @jsx createElement */
import { createElement, Fragment } from "@bikeshaving/crank";

import { sortBy } from "lodash-es";
import { countriesGenerator } from "../utils";
import classnames from "classnames";
import { LoadingIndicator } from "./loading-indicator";
import { Suspense } from "./suspense";
import { ImFeelingLucky } from "./im-feeling-lucky";

export async function CountryList({ onClick, selected }) {
  return (
    <Fragment>
      <ImFeelingLucky onClick={onClick} />
      <Suspense fallback={<LoadingIndicator />}>
        <CountryListRenderer onClick={onClick} selected={selected} />
      </Suspense>
    </Fragment>
  );
}

async function* CountryListRenderer({ onClick, selected }) {
  const countries = [];
  for await (const country of countriesGenerator()) {
    countries.push(country);
  }
  for await ({ selected } of this) {
    yield (
      <div class="country-list">
        {sortBy([...countries], "Country").map((country) => (
          <div
            key={country.Slug}
            class={classnames(
              "country",
              selected && selected.Slug === country.Slug && "selected"
            )}
            onclick={() => onClick(country)}
          >
            {country.Country}
          </div>
        ))}
      </div>
    );
  }
}
