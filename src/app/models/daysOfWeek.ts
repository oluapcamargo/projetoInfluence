import { get } from "lodash";

export interface DayOfWeek {
  id: number;
  label: string;
}

export function returnDaysOfWeek() {
  const daysOfWeek = [
    { id: 1, label: "Domingo" },
    { id: 2, label: "Segunda-feira" },
    { id: 3, label: "Terça-feira" },
    { id: 4, label: "Quarta-feira" },
    { id: 5, label: "Quinta-feira" },
    { id: 6, label: "Sexta-feira" },
    { id: 7, label: "Sábado" }
  ] as DayOfWeek[];

  return daysOfWeek;
}
