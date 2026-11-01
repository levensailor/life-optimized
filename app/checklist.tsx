"use client";

import {
  CSSProperties,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ChecklistState,
  freshSeedChecklist,
  isChecklistState,
} from "./checklist-data";

const STORAGE_KEY = "household-catch-up:v1";
type TileStyle = CSSProperties & { "--delay": string };

const tileStyle = (delay: string): TileStyle => ({ "--delay": delay });

const createTaskId = (sectionId: string) => {
  const uniqueId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${sectionId}-${uniqueId}`;
};

export function Checklist() {
  const [checklist, setChecklist] =
    useState<ChecklistState>(freshSeedChecklist);
  const [hydrated, setHydrated] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    let nextChecklist = freshSeedChecklist();

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isChecklistState(parsed)) nextChecklist = parsed;
      }
    } catch {
      // Storage can be unavailable or malformed; the seed remains usable.
    }

    const hydration = window.setTimeout(() => {
      setChecklist(nextChecklist);
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(hydration);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checklist));
    } catch {
      // The in-memory checklist still works when storage is unavailable.
    }
  }, [checklist, hydrated]);

  const metrics = useMemo(() => {
    const tasks = checklist.sections.flatMap((section) => section.tasks);
    return {
      completed: tasks.filter((task) => task.completed).length,
      total: tasks.length,
    };
  }, [checklist.sections]);

  const updateSection = (
    sectionId: string,
    update: ChecklistState["sections"][number]["tasks"],
  ) => {
    setChecklist((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId ? { ...section, tasks: update } : section,
      ),
    }));
  };

  const toggleTask = (sectionId: string, taskId: string) => {
    const section = checklist.sections.find(({ id }) => id === sectionId);
    if (!section) return;
    updateSection(
      sectionId,
      section.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const editTask = (sectionId: string, taskId: string, text: string) => {
    const section = checklist.sections.find(({ id }) => id === sectionId);
    if (!section) return;
    updateSection(
      sectionId,
      section.tasks.map((task) =>
        task.id === taskId ? { ...task, text } : task,
      ),
    );
  };

  const deleteTask = (sectionId: string, taskId: string) => {
    const section = checklist.sections.find(({ id }) => id === sectionId);
    if (!section) return;
    updateSection(
      sectionId,
      section.tasks.filter((task) => task.id !== taskId),
    );
  };

  const addTask = (event: FormEvent, sectionId: string) => {
    event.preventDefault();
    const text = drafts[sectionId]?.trim();
    const section = checklist.sections.find(({ id }) => id === sectionId);
    if (!text || !section) return;
    updateSection(sectionId, [
      ...section.tasks,
      { id: createTaskId(sectionId), text, completed: false },
    ]);
    setDrafts((current) => ({ ...current, [sectionId]: "" }));
  };

  const resetCheckboxes = () => {
    setChecklist((current) => ({
      ...current,
      sections: current.sections.map((section) => ({
        ...section,
        tasks: section.tasks.map((task) => ({ ...task, completed: false })),
      })),
    }));
    setResetOpen(false);
  };

  if (!hydrated) {
    return (
      <main className="shell" aria-busy="true">
        <div className="loading-card">Loading your household checklist…</div>
      </main>
    );
  }

  return (
    <main className="shell">
      <div className="bento-grid">
        <header className="tile hero-tile span-hero" style={tileStyle("0ms")}>
          <p className="eyebrow">A calmer home, one box at a time</p>
          <h1>Household Catch-Up</h1>
          <p className="hero-copy">
            Pick a corner, make a little progress, and let your browser remember
            the rest.
          </p>
        </header>

        <section
          className="tile metric-tile"
          aria-label="Overall progress"
          style={tileStyle("40ms")}
        >
          <p className="caption">Overall progress</p>
          <p className="metric" aria-live="polite">
            {metrics.completed} of {metrics.total} complete.
          </p>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={metrics.total}
            aria-valuenow={metrics.completed}
            aria-label={`${metrics.completed} of ${metrics.total} tasks complete`}
          >
            <span
              style={{
                width: `${metrics.total ? (metrics.completed / metrics.total) * 100 : 0}%`,
              }}
            />
          </div>
        </section>

        <section
          className="tile controls-tile"
          aria-label="Checklist controls"
          style={tileStyle("80ms")}
        >
          <p className="caption">View controls</p>
          <label className="switch-row">
            <input
              type="checkbox"
              checked={checklist.hideCompleted}
              onChange={(event) =>
                setChecklist((current) => ({
                  ...current,
                  hideCompleted: event.target.checked,
                }))
              }
            />
            <span>Hide completed tasks</span>
          </label>
          <button className="button secondary" onClick={() => setResetOpen(true)}>
            Reset checkboxes
          </button>
        </section>

        {checklist.sections.map((section, sectionIndex) => {
          const visibleTasks = checklist.hideCompleted
            ? section.tasks.filter((task) => !task.completed)
            : section.tasks;

          return (
            <section
              className={`tile section-tile section-${sectionIndex + 1}`}
              key={section.id}
              style={tileStyle(`${120 + sectionIndex * 40}ms`)}
            >
              <div className="section-heading">
                <div>
                  <p className="caption">Room {sectionIndex + 1}</p>
                  <h2>{section.title}</h2>
                </div>
                <span className="task-count">{section.tasks.length}</span>
              </div>

              <ul className="task-list">
                {visibleTasks.map((task) => (
                  <li className="task-row" key={task.id}>
                    <input
                      className="task-checkbox"
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(section.id, task.id)}
                      aria-label={`Mark ${task.text} ${task.completed ? "incomplete" : "complete"}`}
                    />
                    <input
                      className={`task-text ${task.completed ? "completed" : ""}`}
                      value={task.text}
                      onChange={(event) =>
                        editTask(section.id, task.id, event.target.value)
                      }
                      aria-label={`Edit task: ${task.text}`}
                    />
                    <button
                      className="icon-button"
                      onClick={() => deleteTask(section.id, task.id)}
                      aria-label={`Delete task: ${task.text}`}
                      title="Delete task"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>

              {visibleTasks.length === 0 && (
                <p className="empty-state">Everything here is complete.</p>
              )}

              <form
                className="add-task"
                onSubmit={(event) => addTask(event, section.id)}
              >
                <label className="sr-only" htmlFor={`add-${section.id}`}>
                  Add a task to {section.title}
                </label>
                <input
                  id={`add-${section.id}`}
                  value={drafts[section.id] ?? ""}
                  onChange={(event) =>
                    setDrafts((current) => ({
                      ...current,
                      [section.id]: event.target.value,
                    }))
                  }
                  placeholder="Add a task"
                />
                <button className="button" type="submit">
                  Add
                </button>
              </form>
            </section>
          );
        })}
      </div>

      {resetOpen && (
        <div className="dialog-backdrop" role="presentation">
          <section
            className="confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="reset-title"
            aria-describedby="reset-description"
          >
            <p className="caption">Fresh start</p>
            <h2 id="reset-title">Reset every checkbox?</h2>
            <p id="reset-description">
              Your added, edited, and deleted tasks will stay exactly as they
              are.
            </p>
            <div className="dialog-actions">
              <button
                className="button secondary"
                onClick={() => setResetOpen(false)}
                autoFocus
              >
                Cancel
              </button>
              <button className="button danger" onClick={resetCheckboxes}>
                Reset checkboxes
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
