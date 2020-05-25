/** @jsx createElement */
import { createElement, Fragment } from "@bikeshaving/crank";
import { format } from "date-fns";

import { Statistic, Title } from "./";
import { CountryData } from "../utils";
import { LoadingIndicator } from "./loading-indicator";
import { Suspense } from "./suspense";

export async function Country({ country }) {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <CountryRenderer country={country} />
    </Suspense>
  );
}

export async function* CountryRenderer({ country }) {
  const { Slug } = country;
  const countryData = (await new CountryData(Slug).load()).backwards();

  let day = countryData.next().value;
  let done = false;

  const onclick = () => {
    const next = countryData.next();

    done = next.done;
    day = next.value || day; // keep first day

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
