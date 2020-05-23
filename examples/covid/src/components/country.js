/** @jsx createElement */
import { createElement, Fragment } from "@bikeshaving/crank";
import { last, first } from "lodash-es";
import { format } from "date-fns";

import { Statistic, Title } from "./";
import { api } from "../utils";
import { LoadingIndicator } from "./loading-indicator";
import { Suspense } from "./suspense";
import { COVID_API_BASE_URL } from "../constants";

export async function Country({ country }) {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <CountryRenderer country={country} />
    </Suspense>
  );
}

export async function* CountryRenderer({ country }) {
  const { Slug } = country;
  const countryData = await new CountryData(Slug).load();
  const backwards = countryData.backwards();
  let day = backwards.next().value;
  let done = false;
  const onclick = () => {
    const next = backwards.next();

    done = next.done;
    day = next.value || day;

    this.refresh();
  };

  for await (const _ of this) {
    yield (
      <Fragment>
        <Title>{country.Country}</Title>
        {day ? (
          <Fragment>
            <div>
              <strong>Last update: </strong>
              {format(day.Date, "YYYY-MM-DD")}{" "}
              {done ? (
                <i>first day</i>
              ) : (
                <button onclick={onclick}>back</button>
              )}
            </div>
            <div style="display: flex; flex-wrap: wrap; width: 500px">
              <Statistic number={day.Confirmed} description="Confirmed" />
              <Statistic number={day.Deaths} description="Deaths" />
              <Statistic number={day.Recovered} description="Recovered" />
              <Statistic number={day.Active} description="Active" />
            </div>
          </Fragment>
        ) : (
          `No statistics found ...`
        )}
      </Fragment>
    );
  }
}

class CountryData {
  constructor(slug) {
    this.slug = slug;
  }
  async load() {
    const data = await api(`${COVID_API_BASE_URL}/live/country/${this.slug}`, {
      slow: false,
    })
      .then((response) => response.json())
      .catch((error) => console.log("error", error));

    this.data = data;

    return this;
  }
  *backwards() {
    for (const day of this.data.reverse()) {
      yield day;
    }
  }
}
