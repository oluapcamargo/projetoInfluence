import { sortBy } from "lodash";

export interface HourOfDay {
  id: number;
  label: string;
}

export function returnPossibleHours(firstHour: number, lastHour: number) {
  const possibleHours = new Array(24).fill(null);
  const hoursWith30Minuts = [] as HourOfDay[];
  possibleHours.forEach((value, index) => {
    if (index >= firstHour && index <= lastHour) {
      hoursWith30Minuts.push(
        {
          id: index,
          label: `${index.toString().length === 1 ? `0${index}` : index}:00`
        },
        {
          id: Number(`${index}${index}`),
          label: `${index.toString().length === 1 ? `0${index}` : index}:30`
        }
      );
    }
  });

  const sortedHoursWith30Minuts = sortBy(
    hoursWith30Minuts,
    value => value.label
  );

  if (lastHour === 24) {
    sortedHoursWith30Minuts.push({
      id: 24,
      label: "00:00"
    });
  }
  return sortedHoursWith30Minuts;
}
