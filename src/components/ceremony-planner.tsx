"use client";

import { useState, useSyncExternalStore } from "react";
import { ceremonySchedule } from "@/content/site";

const DAY = 24 * 60 * 60 * 1000;

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function weeksBefore(date: Date, weeks: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - weeks * 7);
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Today's date is only known in the browser; the server renders without it.
const subscribeToNothing = () => () => {};
function useToday() {
  const key = useSyncExternalStore(
    subscribeToNothing,
    () => new Date().toDateString(),
    () => null,
  );
  return key ? new Date(key) : null;
}

export function CeremonyPlanner() {
  const [ceremony, setCeremony] = useState("2027-08-13");
  const today = useToday();
  const ceremonyDate = parseLocalDate(ceremony);
  const rosterWeeks = ceremonySchedule.find((s) => s.label === "Roster due")
    ?.weeksBefore;

  const weeksAway =
    today && ceremonyDate
      ? Math.floor((ceremonyDate.getTime() - today.getTime()) / (7 * DAY))
      : null;

  return (
    <div className="planner">
      <label className="planner-input">
        <span className="mono">Ceremony date</span>
        <input
          onChange={(event) => setCeremony(event.target.value)}
          type="date"
          value={ceremony}
        />
      </label>

      {ceremonyDate ? (
        <>
          <ol className="planner-steps">
            {ceremonySchedule.map((step) => (
              <li key={step.label}>
                <span className="mono planner-date">
                  {formatDate(weeksBefore(ceremonyDate, step.weeksBefore))}
                </span>
                <strong>{step.label}</strong>
                <span className="planner-detail">{step.detail}</span>
              </li>
            ))}
            <li className="planner-final">
              <span className="mono planner-date">{formatDate(ceremonyDate)}</span>
              <strong>Coats on</strong>
              <span className="planner-detail">
                Your class crosses the stage in coats that fit and carry their names.
              </span>
            </li>
          </ol>
          {weeksAway !== null && rosterWeeks && weeksAway < rosterWeeks ? (
            <p className="planner-note">
              {weeksAway < 0
                ? "That date has passed. Choose an upcoming ceremony."
                : `That's ${weeksAway} week${weeksAway === 1 ? "" : "s"} out, which is tighter than our typical schedule. Reach out today and we'll tell you what's possible.`}
            </p>
          ) : null}
        </>
      ) : (
        <p className="planner-note">Choose a date to see your schedule.</p>
      )}
    </div>
  );
}
