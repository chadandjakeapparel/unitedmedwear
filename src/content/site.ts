// Page copy and business details for the United Medwear landing page.
// Values marked CONFIRM are placeholders that the business should verify
// before launch.

export const business = {
  name: "United Medwear",
  legalName: "United Medwear, LLC",
  // CONFIRM: inbox that receives quote requests.
  quoteEmail: "quotes@unitedmedwear.com",
};

export const navLinks = [
  { href: "#outfit", label: "Who we outfit" },
  { href: "#line", label: "The line" },
  { href: "#process", label: "Process" },
  { href: "#ceremonies", label: "Ceremonies" },
];

export const audiences = [
  {
    fig: "Fig. 01",
    title: "Practices & clinics",
    body: "Coats and scrubs for every provider and front-desk team member, with names, credentials and your practice logo sewn in. Reorder one coat or the whole office.",
    tags: ["Physician offices", "Dental", "Dermatology", "Veterinary"],
  },
  {
    fig: "Fig. 02",
    title: "Hospitals & health systems",
    body: "Department-by-department outfitting with consistent color, cut and logo placement across every campus, so staff look like one system.",
    tags: ["Medical staff", "Nursing", "Residents", "Allied health"],
  },
  {
    fig: "Fig. 03",
    title: "University programs",
    body: "White coat ceremonies, clinical rotations and program-branded scrubs for incoming classes, ordered from a single roster.",
    tags: ["Medical schools", "Nursing", "PA & DPT", "Pharmacy"],
  },
  {
    fig: "Fig. 04",
    title: "Labs & research",
    body: "Durable, launderable coats for teaching labs, core facilities and research teams, sized and labeled for shared use or individual issue.",
    tags: ["Teaching labs", "Core facilities", "Biotech", "Diagnostics"],
  },
];

export const lineItems = [
  {
    code: "UM-100",
    item: "Physician lab coat",
    use: "Attendings, specialists, consults",
    cut: "Full length, tailored fit",
    custom: "Name, credentials, department, logo",
  },
  {
    code: "UM-200",
    item: "Staff & clinic coat",
    use: "Clinic teams, pharmacy, labs",
    cut: "Mid length, relaxed fit",
    custom: "Name, title, logo",
  },
  {
    code: "UM-300",
    item: "Student & ceremony coat",
    use: "White coat ceremonies, rotations",
    cut: "Short consultation length",
    custom: "Name, program crest, class year",
  },
  {
    code: "UM-400",
    item: "Scrub sets",
    use: "Clinical and surgical teams",
    cut: "Core and stretch fabrics, full size range",
    custom: "Color by role, chest logo, name",
  },
  {
    code: "UM-500",
    item: "Layers",
    use: "Cold units, outreach, front desk",
    cut: "Fleece, soft-shell, quarter-zip, vest",
    custom: "Logo, name",
  },
  {
    code: "UM-600",
    item: "Finishing",
    use: "Program identity",
    cut: "Sleeve patches, surgical caps, garment bags",
    custom: "Custom crest, colors, labeling",
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Fit kit",
    body: "We send try-on samples in every size so your team can choose before anything is sewn.",
  },
  {
    step: "02",
    title: "Roster & proof",
    body: "You send one spreadsheet of names, titles and sizes. We digitize your logo and return a sewn proof for sign-off.",
  },
  {
    step: "03",
    title: "Sewn & checked",
    body: "Each coat is embroidered, then checked against the roster line by line for spelling, credentials and size.",
  },
  {
    step: "04",
    title: "Sorted by person",
    body: "Garments arrive bagged and labeled by name, grouped by department or class, ready to hand out.",
  },
];

export const programFeatures = [
  {
    title: "Your standards, on file",
    body: "Logos, thread colors, placements and approved styles are saved once, so the coat ordered next year matches the coat ordered today.",
  },
  {
    title: "New hires without a new project",
    body: "Send a name and a size when someone joins. Their coat matches the rest of the team, with no minimum to meet.",
  },
  {
    title: "One invoice, many departments",
    body: "Order across departments or campuses and receive consolidated billing with orders broken out the way your finance team needs.",
  },
];

// Typical back-schedule from a white coat ceremony date.
// CONFIRM: lead times against actual production capacity.
export const ceremonySchedule = [
  {
    weeksBefore: 10,
    label: "Fit kit arrives",
    detail: "Try-on coats in every size ship to your program office.",
  },
  {
    weeksBefore: 8,
    label: "Roster due",
    detail: "Names, credentials and sizes for the incoming class.",
  },
  {
    weeksBefore: 7,
    label: "Proof approved",
    detail: "Your crest digitized and a sample name sewn for sign-off.",
  },
  {
    weeksBefore: 3,
    label: "Production complete",
    detail: "Every coat checked against the roster, line by line.",
  },
  {
    weeksBefore: 1,
    label: "Delivered, sorted by student",
    detail: "Bagged and labeled by name, in alphabetical cartons.",
  },
];

export const threadColors = [
  { name: "Navy", value: "#1c2f55" },
  { name: "Cardinal", value: "#9e2a2f" },
  { name: "Hunter", value: "#24513f" },
  { name: "Royal", value: "#2851a3" },
  { name: "Black", value: "#16181c" },
  { name: "Silver", value: "#7e858f" },
];

export const organizationTypes = [
  "Private practice or clinic",
  "Hospital or health system",
  "Medical, nursing or health sciences program",
  "Laboratory or research group",
  "Other",
];

export const quantityRanges = ["1–10", "11–50", "51–200", "200+"];

export const quoteItems = [
  "Lab coats",
  "Scrubs",
  "Layers",
  "White coat ceremony",
  "Patches & finishing",
];
