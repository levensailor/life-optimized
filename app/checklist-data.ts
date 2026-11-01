export type ChecklistTask = {
  id: string;
  text: string;
  completed: boolean;
};

export type ChecklistSection = {
  id: string;
  title: string;
  tasks: ChecklistTask[];
};

export type ChecklistState = {
  sections: ChecklistSection[];
  hideCompleted: boolean;
};

const section = (
  id: string,
  title: string,
  tasks: string[],
): ChecklistSection => ({
  id,
  title,
  tasks: tasks.map((text, index) => ({
    id: `${id}-${index + 1}`,
    text,
    completed: false,
  })),
});

export const SEED_CHECKLIST: ChecklistState = {
  hideCompleted: false,
  sections: [
    section("kitchen", "Kitchen", [
      "Clean out the fridge; toss expired food and wipe shelves",
      "Check pantry and freezer for forgotten or expired food",
      "Make a grocery list, checking staples and seasonings",
      "Clean the microwave, stovetop, and backsplash",
      "Wipe cabinet fronts and handles",
      "Mop the floor",
      "Clean trash and recycling bins",
    ]),
    section("bathroom", "Bathroom", [
      "Scrub the toilet, sink, tub, and shower",
      "Clean mirrors and wipe shelves",
      "Remove buildup from faucets and showerheads",
      "Wash bath mats and shower curtain or liner",
      "Sort toiletries and clear out empty or expired products",
      "Restock toilet paper, soap, and cleaning supplies",
    ]),
    section("bedroom", "Bedroom and wardrobe", [
      "Clear out clothes that no longer fit or get worn",
      "Put donations in a bag and arrange a drop-off",
      "Put away seasonal clothes and shoes",
      "Clear bedside tables and dresser tops",
      "Wash bedding extras: mattress protector, duvet cover, and throws",
      "Vacuum under the bed and behind furniture",
    ]),
    section("living", "Living spaces", [
      "Dust shelves, lamps, ceiling fans, and baseboards",
      "Vacuum sofa cushions and underneath them",
      "Clean under rugs and moveable furniture",
      "Wipe frequently touched switches, handles, and remotes",
      "Clean windowsills and obvious window smudges",
      "Tidy the entryway and sort shoes, bags, and coats",
    ]),
    section("upkeep", "Forgotten corners and household upkeep", [
      "Sort accumulated mail, receipts, and paperwork",
      "Clear out one junk drawer or cluttered cupboard",
      "Check household supplies and make a restocking list",
      "Replace or clean air filters as needed",
      "Test smoke and carbon monoxide alarms",
      "Check for leaks under sinks",
      "Gather batteries, bulbs, and electronics needing proper disposal",
      "Make a short list of repairs that have been put off",
    ]),
  ],
};

const isTask = (value: unknown): value is ChecklistTask => {
  if (!value || typeof value !== "object") return false;
  const task = value as Partial<ChecklistTask>;
  return (
    typeof task.id === "string" &&
    task.id.length > 0 &&
    typeof task.text === "string" &&
    task.text.trim().length > 0 &&
    typeof task.completed === "boolean"
  );
};

const isSection = (value: unknown): value is ChecklistSection => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ChecklistSection>;
  return (
    typeof candidate.id === "string" &&
    candidate.id.length > 0 &&
    typeof candidate.title === "string" &&
    candidate.title.length > 0 &&
    Array.isArray(candidate.tasks) &&
    candidate.tasks.every(isTask)
  );
};

export const isChecklistState = (value: unknown): value is ChecklistState => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ChecklistState>;
  if (
    typeof candidate.hideCompleted !== "boolean" ||
    !Array.isArray(candidate.sections) ||
    candidate.sections.length === 0 ||
    !candidate.sections.every(isSection)
  ) {
    return false;
  }

  const sectionIds = candidate.sections.map(({ id }) => id);
  const taskIds = candidate.sections.flatMap(({ tasks }) =>
    tasks.map(({ id }) => id),
  );
  return (
    new Set(sectionIds).size === sectionIds.length &&
    new Set(taskIds).size === taskIds.length
  );
};

export const freshSeedChecklist = (): ChecklistState =>
  JSON.parse(JSON.stringify(SEED_CHECKLIST)) as ChecklistState;
