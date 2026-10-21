"use client";

import { useState, type FormEvent } from "react";
import {
  business,
  organizationTypes,
  quantityRanges,
  quoteItems,
} from "@/content/site";

// There is no backend yet: the form composes an email to the quote inbox.
export function QuoteForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const items = data.getAll("items").join(", ") || "Not specified";
    const organization = String(data.get("organization"));

    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Organization: ${organization}`,
      `Organization type: ${data.get("type")}`,
      `Estimated quantity: ${data.get("quantity")}`,
      `Interested in: ${items}`,
      `Needed by: ${data.get("needed") || "Flexible"}`,
      "",
      String(data.get("notes") || ""),
    ].join("\n");

    const subject = `Quote request: ${organization}`;
    window.location.href = `mailto:${business.quoteEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label className="field">
          <span className="mono">Your name</span>
          <input autoComplete="name" name="name" required />
        </label>
        <label className="field">
          <span className="mono">Work email</span>
          <input autoComplete="email" name="email" required type="email" />
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          <span className="mono">Organization</span>
          <input autoComplete="organization" name="organization" required />
        </label>
        <label className="field">
          <span className="mono">Organization type</span>
          <select defaultValue={organizationTypes[0]} name="type">
            {organizationTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="field">
        <legend className="mono">Estimated quantity</legend>
        <div className="segmented">
          {quantityRanges.map((range, index) => (
            <label key={range}>
              <input
                defaultChecked={index === 1}
                name="quantity"
                type="radio"
                value={range}
              />
              <span>{range}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend className="mono">Interested in</legend>
        <div className="chips">
          {quoteItems.map((item) => (
            <label key={item}>
              <input name="items" type="checkbox" value={item} />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form-row">
        <label className="field">
          <span className="mono">Needed by (optional)</span>
          <input name="needed" type="date" />
        </label>
        <label className="field">
          <span className="mono">Notes (optional)</span>
          <input
            name="notes"
            placeholder="Colors, logo files, ceremony details…"
          />
        </label>
      </div>

      <div className="form-submit">
        <button className="button button-primary" type="submit">
          Send request
        </button>
        <p aria-live="polite" className="form-status">
          {sent
            ? `Your email app should open with the request filled in. If it doesn't, write to ${business.quoteEmail}.`
            : "We'll reply with pricing, lead times and a fit kit option."}
        </p>
      </div>
    </form>
  );
}
