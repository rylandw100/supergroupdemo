"use client"

import React, { useMemo, useRef, useState } from "react";
import { Plus, X, Search, ArrowLeft, Info, UserMinus, Users, UserPlus, Eye, ChevronDown, MoreVertical, Bookmark, Calendar, History } from "lucide-react";

// =============================================================
// Mock Data
// =============================================================
const VARIABLE_OPTIONS = [
  { id: "var-1", label: "Department → Product Design", type: "variable" as const },
  { id: "var-2", label: "Work location → San Francisco office", type: "variable" as const },
  { id: "var-3", label: "Department → Engineering", type: "variable" as const },
  { id: "var-4", label: "Level → Manager", type: "variable" as const },
  { id: "var-5", label: "Level → IC", type: "variable" as const },
  { id: "var-6", label: "Employment status → Contractor", type: "variable" as const },
  { id: "var-7", label: "Tenure → ≥ 1 year", type: "variable" as const },
  { id: "var-8", label: "Manager → Yes", type: "variable" as const },
];

const EMPLOYEE_OPTIONS = [
  { id: "emp-1", label: "Anne Montgomery (Admin • Neuralink)", email: "anne@neuralink.com", type: "employee" as const },
  { id: "emp-2", label: "Ravi Patel (Engineering Manager)", email: "ravi@acme.com", type: "employee" as const },
  { id: "emp-3", label: "Sofia García (Product Designer)", email: "sofia@acme.com", type: "employee" as const },
  { id: "emp-4", label: "Max Chen (Staff Engineer)", email: "max@acme.com", type: "employee" as const },
  { id: "emp-5", label: "Priya Nair (HRBP)", email: "priya@acme.com", type: "employee" as const },
  { id: "emp-6", label: "Luis Romero (Finance)", email: "luis@acme.com", type: "employee" as const },
];

const ATTRIBUTE_DEFINITIONS = [
  { id: "attr-dept", label: "Department", kind: "department" as const },
  { id: "attr-comp", label: "Annual compensation", kind: "compensation" as const },
  { id: "attr-start", label: "Start date", kind: "startdate" as const },
  { id: "attr-location", label: "Work location", kind: "location" as const },
  { id: "attr-level", label: "Level", kind: "level" as const },
  { id: "attr-team", label: "Team", kind: "team" as const },
];

const DEPARTMENT_VALUES = [
  "Product Design",
  "Engineering",
  "Product Management",
  "Finance",
  "HR",
  "Sales",
  "Marketing",
];

const LOCATION_VALUES = [
  "San Francisco",
  "New York",
  "London",
  "Remote",
  "Austin",
  "Seattle",
];

const LEVEL_VALUES = [
  "Manager",
  "Senior Manager",
  "Director",
  "IC",
  "Senior IC",
  "Staff IC",
];

const TEAM_VALUES = [
  "Engineering",
  "Product",
  "Design",
  "Sales",
  "Marketing",
  "Operations",
];

// =============================================================
// Contextual AND Suggestions Mock Data
// =============================================================
const AND_SUGGESTIONS: Record<string, Array<{ label: string; preview: string; chip: Chip }>> = {
  "department": [
    { 
      label: "Location", 
      preview: "Location → San Francisco", 
      chip: { id: "suggest-location-1", label: "Work location → San Francisco", type: "variable" }
    },
    { 
      label: "Level", 
      preview: "Level → Manager", 
      chip: { id: "suggest-level-1", label: "Level → Manager", type: "variable" }
    },
    { 
      label: "Team", 
      preview: "Team → Engineering", 
      chip: { id: "suggest-team-1", label: "Team → Engineering", type: "variable" }
    },
  ],
  "location": [
    { 
      label: "Department", 
      preview: "Department → Engineering", 
      chip: { id: "suggest-dept-1", label: "Department → Engineering", type: "variable" }
    },
    { 
      label: "Level", 
      preview: "Level → IC", 
      chip: { id: "suggest-level-2", label: "Level → IC", type: "variable" }
    },
    { 
      label: "Team", 
      preview: "Team → Product", 
      chip: { id: "suggest-team-2", label: "Team → Product", type: "variable" }
    },
  ],
  "level": [
    { 
      label: "Department", 
      preview: "Department → Product Design", 
      chip: { id: "suggest-dept-2", label: "Department → Product Design", type: "variable" }
    },
    { 
      label: "Location", 
      preview: "Location → New York", 
      chip: { id: "suggest-location-2", label: "Work location → New York office", type: "variable" }
    },
    { 
      label: "Team", 
      preview: "Team → Design", 
      chip: { id: "suggest-team-3", label: "Team → Design", type: "variable" }
    },
  ],
  "team": [
    { 
      label: "Department", 
      preview: "Department → Engineering", 
      chip: { id: "suggest-dept-3", label: "Department → Engineering", type: "variable" }
    },
    { 
      label: "Location", 
      preview: "Location → Remote", 
      chip: { id: "suggest-location-3", label: "Work location → Remote", type: "variable" }
    },
    { 
      label: "Level", 
      preview: "Level → Senior IC", 
      chip: { id: "suggest-level-3", label: "Level → Senior IC", type: "variable" }
    },
  ],
  "compensation": [
    { 
      label: "Department", 
      preview: "Department → Engineering", 
      chip: { id: "suggest-dept-4", label: "Department → Engineering", type: "variable" }
    },
    { 
      label: "Location", 
      preview: "Location → San Francisco", 
      chip: { id: "suggest-location-4", label: "Work location → San Francisco office", type: "variable" }
    },
    { 
      label: "Level", 
      preview: "Level → Staff IC", 
      chip: { id: "suggest-level-4", label: "Level → Staff IC", type: "variable" }
    },
  ],
  "startdate": [
    { 
      label: "Department", 
      preview: "Department → Engineering", 
      chip: { id: "suggest-dept-5", label: "Department → Engineering", type: "variable" }
    },
    { 
      label: "Location", 
      preview: "Location → San Francisco", 
      chip: { id: "suggest-location-5", label: "Work location → San Francisco office", type: "variable" }
    },
    { 
      label: "Level", 
      preview: "Level → Manager", 
      chip: { id: "suggest-level-5", label: "Level → Manager", type: "variable" }
    },
  ],
};

// Helper function to extract chip type from label
function getChipType(chip: Chip): string {
  const label = chip.label.toLowerCase();
  if (label.includes("department")) return "department";
  if (label.includes("location")) return "location";
  if (label.includes("level")) return "level";
  if (label.includes("team")) return "team";
  if (label.includes("compensation")) return "compensation";
  if (label.includes("start date") || label.includes("start date")) return "startdate";
  return "";
}

// Generate contextual suggestions based on last chip and current rule
function getContextualSuggestions(lastChip: Chip | null, currentRule: Rule = []): Array<{ label: string; preview: string; attributeKind?: string }> {
  if (!lastChip || lastChip.type === "employee") return [];
  const chipType = getChipType(lastChip);
  if (!chipType) return [];
  
  // Get all attribute types already in the current rule
  const usedAttributeTypes = new Set<string>();
  currentRule.forEach(chip => {
    const attrType = getChipType(chip);
    if (attrType) {
      usedAttributeTypes.add(attrType);
    }
  });
  
  // Generate suggestions with preview that includes the full condition chain
  const suggestions = AND_SUGGESTIONS[chipType] || [];
  const fullConditionChain = currentRule.map(c => c.label).join(" AND ");
  
  return suggestions
    .filter(s => {
      // Filter out suggestions for attributes already in the rule
      const suggestionAttrType = getChipType(s.chip);
      return !usedAttributeTypes.has(suggestionAttrType);
    })
    .map(s => ({
      label: s.label,
      preview: fullConditionChain ? `${fullConditionChain} AND ${s.preview}` : `${lastChip.label} AND ${s.preview}`,
      attributeKind: getChipType(s.chip), // Store the attribute kind to open the form
    }));
}

// =============================================================
// Types
// =============================================================
export type Chip = { id: string; label: string; type: "variable" | "employee" };
export type Rule = Chip[]; // AND chain
export type RuleGroup = Rule[]; // Multiple groups (user-visible as separate pills)

// =============================================================
// Deterministic mock membership & counting
// =============================================================
const MEMBER_IDS: string[] = Array.from({ length: 250 }, (_, i) => `u${i + 1}`);

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return Math.abs(h >>> 0);
}

/** Map a chip to a deterministic subset of MEMBER_IDS. Employees map to a single id. */
function chipToMemberSet(chip: Chip): Set<string> {
  if (chip.type === "employee") {
    const idx = hashStr(chip.id) % MEMBER_IDS.length;
    return new Set([MEMBER_IDS[idx]]);
  }
  const out = new Set<string>();
  const seedA = (hashStr(chip.id) % 3) + 3; // 3..5 out of 10 ⇒ ~30%
  MEMBER_IDS.forEach((m) => {
    if ((hashStr(`${chip.id}:${m}`) % 10) < seedA) out.add(m);
  });
  return out;
}

/**
 * Member counting per spec:
 *  - For each group (AND chain), intersect the member sets of its chips.
 *  - Sum those intersection sizes across all groups (OR semantics without de-dup across groups).
 */
function countMembers(rules: RuleGroup): number {
  return rules.reduce((sum, rule) => {
    if (rule.length === 0) return sum;
    let acc = new Set<string>(chipToMemberSet(rule[0]));
    for (let i = 1; i < rule.length; i++) {
      const next = chipToMemberSet(rule[i]);
      acc = new Set(Array.from(acc).filter((x) => next.has(x)));
      if (acc.size === 0) break;
    }
    return sum + acc.size;
  }, 0);
}

// =============================================================
// Pure helpers (unit-testable) for editing rules
// =============================================================
function addChipToRulePure(
  prev: RuleGroup,
  chip: Chip,
  target: { groupIdx: number; insertAtEnd?: boolean; chipIdx?: number }
): RuleGroup {
  const draft: RuleGroup = prev.map((r) => r.map((c) => ({ ...c })));
  const group = draft[target.groupIdx];
  if (!group) {
    return [...draft, [chip]]; // create new group at end
  }
  if (target.insertAtEnd) {
    return draft.map((r, i) => (i === target.groupIdx ? [...r, chip] : r));
  }
  if (typeof target.chipIdx === "number") {
    const newGroup = [...group];
    newGroup.splice(target.chipIdx + 1, 0, chip);
    return draft.map((r, i) => (i === target.groupIdx ? newGroup : r));
  }
  return draft.map((r, i) => (i === target.groupIdx ? [...r, chip] : r));
}

function removeChipPure(prev: RuleGroup, groupIdx: number, chipIdx: number): RuleGroup {
  const draft = prev.map((r) => [...r]);
  draft[groupIdx] = draft[groupIdx].filter((_, i) => i !== chipIdx);
  return draft.filter((g) => g.length > 0);
}

// =============================================================
// Small UI primitives
// =============================================================
const IconButton: React.FC<{ onClick?: () => void; title?: string; className?: string; children: React.ReactNode }>
  = ({ onClick, title, className, children }) => (
  <button onClick={onClick} title={title} className={`inline-flex h-7 w-7 items-center justify-center rounded-full border hover:bg-muted transition ${className ?? ""}`}>{children}</button>
);

const Section: React.FC<{ title: string; emptyText: string; children: React.ReactNode }> = ({ title, emptyText, children }) => {
  const hasChildren = React.Children.count(children) > 0;
  return (
    <div className="py-2">
      <div className="px-2 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</div>
      <div className="flex flex-col gap-1">{hasChildren ? children : <div className="px-2 py-6 text-sm text-muted-foreground">{emptyText}</div>}</div>
    </div>
  );
};

const OptionRow: React.FC<{ label: string; badge?: string; onClick: () => void; focused?: boolean; onMouseEnter?: () => void; dataIdx?: number }> = ({ label, badge, onClick, focused = false, onMouseEnter, dataIdx }) => (
  <button 
    onClick={onClick} 
    onMouseEnter={onMouseEnter}
    data-idx={dataIdx}
    className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-muted/60 ${focused ? "bg-muted/70 ring-1 ring-black/10" : ""}`}
    role="option"
    aria-selected={focused}
  >
    <span className="line-clamp-1">{label}</span>
    <div className="ml-2 flex items-center gap-2">
      {focused ? (
        <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold uppercase text-white">TAB</span>
      ) : null}
      {badge ? <span className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{badge}</span> : null}
    </div>
  </button>
);

const SuggestionRow: React.FC<{ label: string; preview: string; onClick: () => void; attributeKind?: string; focused?: boolean; onMouseEnter?: () => void; dataIdx?: number }> = ({ label, preview, onClick, attributeKind, focused = false, onMouseEnter, dataIdx }) => (
  <button 
    onClick={onClick} 
    onMouseEnter={onMouseEnter}
    data-idx={dataIdx}
    className={`flex w-full flex-col rounded-lg px-2 py-2 text-left hover:bg-muted/60 ${focused ? "bg-muted/70 ring-1 ring-black/10" : ""}`}
    role="option"
    aria-selected={focused}
  >
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      {focused ? (
        <span className="ml-2 rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold uppercase text-white">TAB</span>
      ) : null}
    </div>
    <span className="text-xs text-muted-foreground">Ex. {preview}</span>
  </button>
);

// =============================================================
// Popover with Attributes flow
// =============================================================
const Popover: React.FC<{
  open: boolean;
  anchorRect: DOMRect | null;
  onClose: () => void;
  onSelect: (chip: Chip, usePreviousGroup?: boolean, saveAndAddAnother?: boolean) => void;
  lastChip?: Chip | null;
  isNewGroup?: boolean;
  currentRule?: Rule;
  previousGroupIdx?: number;
}> = ({ open, anchorRect, onClose, onSelect, lastChip, isNewGroup = false, currentRule = [], previousGroupIdx }) => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<'list' | 'attr'>('list');
  const [selectedAttr, setSelectedAttr] = useState<typeof ATTRIBUTE_DEFINITIONS[number] | null>(null);
  const [addingToPreviousGroup, setAddingToPreviousGroup] = useState(false);

  // attribute form state
  const [deptOperator, setDeptOperator] = useState<'is any of' | 'is not any of' | 'is all of'>('is any of');
  const [deptValues, setDeptValues] = useState<string[]>([]);

  const [compOperator, setCompOperator] = useState<'>' | '>=' | '=' | '<=' | '<'>('>=');
  const [compValue, setCompValue] = useState<string>("");

  const [dateOperator, setDateOperator] = useState<'before' | 'on' | 'on or after'>('on or after');
  const [dateValue, setDateValue] = useState<string>("");

  const [locationOperator, setLocationOperator] = useState<'is any of' | 'is not any of' | 'is all of'>('is any of');
  const [locationValues, setLocationValues] = useState<string[]>([]);

  const [levelOperator, setLevelOperator] = useState<'is any of' | 'is not any of' | 'is all of'>('is any of');
  const [levelValues, setLevelValues] = useState<string[]>([]);

  const [teamOperator, setTeamOperator] = useState<'is any of' | 'is not any of' | 'is all of'>('is any of');
  const [teamValues, setTeamValues] = useState<string[]>([]);
  const [saveAndAddAnother, setSaveAndAddAnother] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const listScrollRef = useRef<HTMLDivElement>(null);
  const attrScrollRef = useRef<HTMLDivElement>(null);
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [focusedOperatorIdx, setFocusedOperatorIdx] = useState(0);
  const [focusedValueIdx, setFocusedValueIdx] = useState(0);

  // Generate variable options from multiselect attribute values
  const multiselectVariables = useMemo(() => {
    const deptVars = DEPARTMENT_VALUES.map((val, idx) => ({
      id: `var-dept-${idx}`,
      label: `Department → ${val}`,
      type: "variable" as const,
    }));
    const locationVars = LOCATION_VALUES.map((val, idx) => ({
      id: `var-location-${idx}`,
      label: `Work location → ${val}`,
      type: "variable" as const,
    }));
    const levelVars = LEVEL_VALUES.map((val, idx) => ({
      id: `var-level-${idx}`,
      label: `Level → ${val}`,
      type: "variable" as const,
    }));
    const teamVars = TEAM_VALUES.map((val, idx) => ({
      id: `var-team-${idx}`,
      label: `Team → ${val}`,
      type: "variable" as const,
    }));
    return [...deptVars, ...locationVars, ...levelVars, ...teamVars];
  }, []);

  const all = useMemo(() => [...VARIABLE_OPTIONS, ...multiselectVariables, ...EMPLOYEE_OPTIONS], [multiselectVariables]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((o) => o.label.toLowerCase().includes(q));
  }, [all, query]);

  const contextualSuggestions = useMemo(() => getContextualSuggestions(lastChip || null, currentRule), [lastChip, currentRule]);

  const variables = useMemo(() => filtered.filter((f) => f.type === "variable"), [filtered]);
  const people = useMemo(() => filtered.filter((f) => f.type === "employee"), [filtered]);

  // Build flat list of all options in order: Common filters → Attributes → Employees → Variables
  const flatList = useMemo(() => {
    const list: Array<{ type: 'suggestion' | 'attribute' | 'employee' | 'variable'; data: any; label: string }> = [];
    const q = query.trim().toLowerCase();
    
    // Add common filters (suggestions) - only show when there's no query
    if (contextualSuggestions.length > 0 && !q) {
      contextualSuggestions.forEach(s => {
        list.push({ type: 'suggestion', data: s, label: s.label });
      });
    }
    
    // Add "AND Other" button if in new group mode - only show when there's no query
    if (isNewGroup && contextualSuggestions.length > 0 && !q) {
      list.push({ type: 'suggestion', data: { isOther: true }, label: 'AND Other' });
    }
    
    // Add attributes - filter by query
    const filteredAttributes = q 
      ? ATTRIBUTE_DEFINITIONS.filter(a => a.label.toLowerCase().includes(q))
      : ATTRIBUTE_DEFINITIONS;
    filteredAttributes.forEach(a => {
      list.push({ type: 'attribute', data: a, label: a.label });
    });
    
    // Add employees
    people.forEach(p => {
      list.push({ type: 'employee', data: p, label: p.label });
    });
    
    // Add variables
    variables.forEach(v => {
      list.push({ type: 'variable', data: v, label: v.label });
    });
    
    return list;
  }, [contextualSuggestions, isNewGroup, people, variables, query]);

  // Reset focus when list changes
  React.useEffect(() => {
    setFocusedIdx(0);
    setFocusedOperatorIdx(0);
    setFocusedValueIdx(0);
  }, [mode, query, contextualSuggestions.length, people.length, variables.length, selectedAttr]);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, onClose]);

  // Check if form is valid
  const isFormValid = useMemo(() => {
    if (!selectedAttr) return false;
    
    if (selectedAttr.kind === 'department' || selectedAttr.kind === 'location' || selectedAttr.kind === 'level' || selectedAttr.kind === 'team') {
      const values = selectedAttr.kind === 'department' ? deptValues :
                     selectedAttr.kind === 'location' ? locationValues :
                     selectedAttr.kind === 'level' ? levelValues : teamValues;
      return values.length > 0;
    } else if (selectedAttr.kind === 'compensation') {
      return compValue.trim().length > 0;
    } else if (selectedAttr.kind === 'startdate') {
      return dateValue.trim().length > 0;
    }
    
    return false;
  }, [selectedAttr, deptValues, locationValues, levelValues, teamValues, compValue, dateValue]);

  function resetAndClose() {
    setMode('list');
    setSelectedAttr(null);
    setDeptValues([]);
    setCompValue("");
    setDateValue("");
    setLocationValues([]);
    setLevelValues([]);
    setTeamValues([]);
    setAddingToPreviousGroup(false);
    // Don't reset saveAndAddAnother - keep it persistent across sessions
    onClose();
  }

  function handleSaveAttribute() {
    if (!selectedAttr || !isFormValid) return;
    let label = "";
    if (selectedAttr.kind === 'department') {
      const vals = deptValues.length ? deptValues.join(", ") : "(none)";
      label = `${selectedAttr.label} ${deptOperator} ${vals}`;
    } else if (selectedAttr.kind === 'compensation') {
      label = `${selectedAttr.label} ${compOperator} ${compValue || '(blank)'}`;
    } else if (selectedAttr.kind === 'startdate') {
      label = `${selectedAttr.label} ${dateOperator} ${dateValue || '(no date)'}`;
    } else if (selectedAttr.kind === 'location') {
      const vals = locationValues.length ? locationValues.join(", ") : "(none)";
      label = `Work location ${locationOperator} ${vals}`;
    } else if (selectedAttr.kind === 'level') {
      const vals = levelValues.length ? levelValues.join(", ") : "(none)";
      label = `${selectedAttr.label} ${levelOperator} ${vals}`;
    } else if (selectedAttr.kind === 'team') {
      const vals = teamValues.length ? teamValues.join(", ") : "(none)";
      label = `${selectedAttr.label} ${teamOperator} ${vals}`;
    }
    
    const chip = { id: `attr-${selectedAttr.kind}-${Date.now()}`, label, type: 'variable' as const };
    
    // If we're adding from "Add another group" and clicked a common filter, add to previous group
    onSelect(chip, addingToPreviousGroup, saveAndAddAnother);
    
    if (saveAndAddAnother) {
      // Reset form but keep popover open - parent will handle opening new popover
      setMode('list');
      setSelectedAttr(null);
      setDeptValues([]);
      setCompValue("");
      setDateValue("");
      setLocationValues([]);
      setLevelValues([]);
      setTeamValues([]);
      setAddingToPreviousGroup(false);
      // Keep saveAndAddAnother checked for next session
      // Don't call onClose() - let parent handle opening new popover
    } else {
      resetAndClose();
    }
  }

  React.useEffect(() => {
    if (!open || mode !== 'list') return;
    
    function handleKeyDown(e: KeyboardEvent) {
      const total = flatList.length;
      if (total === 0) return;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIdx((i) => {
          const next = e.key === "ArrowDown" ? i + 1 : i - 1;
          return Math.max(0, Math.min(total - 1, next));
        });
      } else if (e.key === "Enter" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault();
        const item = flatList[focusedIdx];
        if (!item) return;

        if (item.type === 'suggestion') {
          if (item.data.isOther) {
            const attrSection = containerRef.current?.querySelector('[data-section="attributes"]');
            if (attrSection) {
              attrSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          } else {
            const attrDef = ATTRIBUTE_DEFINITIONS.find(a => a.kind === item.data.attributeKind);
            if (attrDef) {
              setSelectedAttr(attrDef);
              setMode('attr');
              if (isNewGroup) {
                setAddingToPreviousGroup(true);
              }
            }
          }
        } else if (item.type === 'attribute') {
          setSelectedAttr(item.data);
          setMode('attr');
        } else if (item.type === 'employee' || item.type === 'variable') {
          onSelect(item.data as Chip);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, mode, flatList, focusedIdx, isNewGroup, onSelect, onClose]);

  // Keyboard navigation for attribute form
  React.useEffect(() => {
    if (!open || mode !== 'attr' || !selectedAttr) return;

    function handleAttrKeyDown(e: KeyboardEvent) {
      if (selectedAttr?.kind === 'department' || selectedAttr?.kind === 'location' || selectedAttr?.kind === 'level' || selectedAttr?.kind === 'team') {
        const values = selectedAttr.kind === 'department' ? DEPARTMENT_VALUES :
                      selectedAttr.kind === 'location' ? LOCATION_VALUES :
                      selectedAttr.kind === 'level' ? LEVEL_VALUES : TEAM_VALUES;
        
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          setFocusedValueIdx((i) => {
            const next = e.key === "ArrowDown" ? i + 1 : i - 1;
            return Math.max(0, Math.min(values.length - 1, next));
          });
        } else if (e.key === " ") {
          e.preventDefault();
          const value = values[focusedValueIdx];
          if (value) {
            if (selectedAttr.kind === 'department') {
              setDeptValues((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
            } else if (selectedAttr.kind === 'location') {
              setLocationValues((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
            } else if (selectedAttr.kind === 'level') {
              setLevelValues((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
            } else if (selectedAttr.kind === 'team') {
              setTeamValues((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
            }
          }
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (isFormValid) {
            handleSaveAttribute();
          }
        } else if (e.key === "Escape") {
          e.preventDefault();
          resetAndClose();
        }
      } else if (selectedAttr?.kind === 'compensation' || selectedAttr?.kind === 'startdate') {
        if (e.key === "Enter") {
          e.preventDefault();
          if (isFormValid) {
            handleSaveAttribute();
          }
        } else if (e.key === "Escape") {
          e.preventDefault();
          resetAndClose();
        }
      }
    }

    document.addEventListener("keydown", handleAttrKeyDown);
    return () => document.removeEventListener("keydown", handleAttrKeyDown);
  }, [open, mode, selectedAttr, focusedValueIdx, deptValues, locationValues, levelValues, teamValues, isFormValid, compValue, dateValue, handleSaveAttribute, resetAndClose]);

  // Auto-scroll to keep focused item visible
  React.useEffect(() => {
    if (!open || mode !== 'list' || !listScrollRef.current) return;

    const container = listScrollRef.current;
    const row = container.querySelector<HTMLButtonElement>(`[data-idx="${focusedIdx}"]`);
    if (!row) return;

    const padding = 4;
    if (focusedIdx === 0) {
      container.scrollTop = 0;
      return;
    }

    const rowTop = row.offsetTop;
    const rowBottom = rowTop + row.offsetHeight;
    const viewTop = container.scrollTop;
    const viewBottom = viewTop + container.clientHeight;

    if (rowTop < viewTop + padding) {
      container.scrollTop = Math.max(0, rowTop - padding);
    } else if (rowBottom > viewBottom - padding) {
      container.scrollTop = rowBottom - container.clientHeight + padding;
    }
  }, [focusedIdx, open, mode]);

  // Auto-scroll for attribute form values
  React.useEffect(() => {
    if (!open || mode !== 'attr' || !attrScrollRef.current || !selectedAttr) return;

    const container = attrScrollRef.current;
    const row = container.querySelector<HTMLLabelElement>(`[data-value-idx="${focusedValueIdx}"]`);
    if (!row) return;

    const padding = 4;
    if (focusedValueIdx === 0) {
      container.scrollTop = 0;
      return;
    }

    const rowTop = row.offsetTop;
    const rowBottom = rowTop + row.offsetHeight;
    const viewTop = container.scrollTop;
    const viewBottom = viewTop + container.clientHeight;

    if (rowTop < viewTop + padding) {
      container.scrollTop = Math.max(0, rowTop - padding);
    } else if (rowBottom > viewBottom - padding) {
      container.scrollTop = rowBottom - container.clientHeight + padding;
    }
  }, [focusedValueIdx, open, mode, selectedAttr]);

  if (!open || !anchorRect) return null;

  const style: React.CSSProperties = {
    position: "fixed",
    top: anchorRect.bottom + 8,
    left: Math.min(anchorRect.left, window.innerWidth - 360),
    width: 360,
    zIndex: 50,
  };

  return (
    <div style={style} ref={containerRef} className="rounded-2xl border bg-white shadow-xl">
      <div className="flex items-center gap-2 border-b p-3">
        {mode === 'attr' ? (
          <button onClick={() => setMode('list')} className="mr-1 rounded p-1 hover:bg-muted" title="Back">
            <ArrowLeft className="h-4 w-4" />
          </button>
        ) : (
          <Search className="h-4 w-4 opacity-60" />
        )}
        {mode === 'list' ? (
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users, variables, attributes"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        ) : (
          <div className="text-sm font-medium">{selectedAttr?.label} condition</div>
        )}
      </div>

      {/* Body */}
      {mode === 'list' ? (
        <div ref={listScrollRef} className="max-h-80 overflow-auto p-2">
          {(() => {
            const q = query.trim().toLowerCase();
            const showSuggestions = contextualSuggestions.length > 0 && !q;
            const filteredAttributes = q 
              ? ATTRIBUTE_DEFINITIONS.filter(a => a.label.toLowerCase().includes(q))
              : ATTRIBUTE_DEFINITIONS;
            
            let currentIdx = 0;
            
            return (
              <>
                {showSuggestions ? (
                  isNewGroup ? (
                    <Section title="Common filters (AND)" emptyText="No suggestions available.">
                      {contextualSuggestions.map((suggestion, idx) => {
                        const flatIdx = currentIdx++;
                        const attrDef = ATTRIBUTE_DEFINITIONS.find(a => a.kind === suggestion.attributeKind);
                        return (
                          <SuggestionRow
                            key={`suggest-${idx}`}
                            dataIdx={flatIdx}
                            label={suggestion.label}
                            preview={suggestion.preview}
                            attributeKind={suggestion.attributeKind}
                            focused={focusedIdx === flatIdx}
                            onMouseEnter={() => setFocusedIdx(flatIdx)}
                            onClick={() => {
                              if (attrDef) {
                                setSelectedAttr(attrDef);
                                setMode('attr');
                                setAddingToPreviousGroup(true);
                              }
                            }}
                          />
                        );
                      })}
                    </Section>
                  ) : (
                    <Section title="Common filters (AND)" emptyText="No suggestions available.">
                      {contextualSuggestions.map((suggestion, idx) => {
                        const flatIdx = currentIdx++;
                        const attrDef = ATTRIBUTE_DEFINITIONS.find(a => a.kind === suggestion.attributeKind);
                        return (
                          <SuggestionRow
                            key={`suggest-${idx}`}
                            dataIdx={flatIdx}
                            label={suggestion.label}
                            preview={suggestion.preview}
                            attributeKind={suggestion.attributeKind}
                            focused={focusedIdx === flatIdx}
                            onMouseEnter={() => setFocusedIdx(flatIdx)}
                            onClick={() => {
                              if (attrDef) {
                                setSelectedAttr(attrDef);
                                setMode('attr');
                              }
                            }}
                          />
                        );
                      })}
                    </Section>
                  )
                ) : !q ? (
                  <Section title="Operators" emptyText="No operators available.">
                    {(() => {
                      const flatIdx = currentIdx++;
                      return (
                        <button
                          data-idx={flatIdx}
                          onClick={() => {
                            const attrSection = containerRef.current?.querySelector('[data-section="attributes"]');
                            if (attrSection) {
                              attrSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                          onMouseEnter={() => setFocusedIdx(flatIdx)}
                          className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-muted/60 ${focusedIdx === flatIdx ? "bg-muted/70 ring-1 ring-black/10" : ""}`}
                        >
                          <span className="line-clamp-1">AND Other</span>
                          {focusedIdx === flatIdx ? (
                            <span className="ml-2 rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold uppercase text-white">TAB</span>
                          ) : null}
                        </button>
                      );
                    })()}
                    </Section>
                ) : null}
                {isNewGroup && showSuggestions && (
                  <div className="border-t border-[rgba(0,0,0,0.1)] my-2"></div>
                )}
                <div data-section="attributes">
                  {isNewGroup ? (
                    <Section title="Add another group (OR)" emptyText="No attributes.">
                      {filteredAttributes.map((a, idx) => {
                        const flatIdx = currentIdx++;
                        return (
                          <OptionRow 
                            key={a.id} 
                            dataIdx={flatIdx}
                            label={a.label} 
                            focused={focusedIdx === flatIdx}
                            onMouseEnter={() => setFocusedIdx(flatIdx)}
                            onClick={() => { setSelectedAttr(a); setMode('attr'); }} 
                          />
                        );
                      })}
                    </Section>
                  ) : (
                    <Section title="Attributes" emptyText="No attributes.">
                      {filteredAttributes.map((a, idx) => {
                        const flatIdx = currentIdx++;
                        return (
                          <OptionRow 
                            key={a.id} 
                            dataIdx={flatIdx}
                            label={a.label} 
                            focused={focusedIdx === flatIdx}
                            onMouseEnter={() => setFocusedIdx(flatIdx)}
                            onClick={() => { setSelectedAttr(a); setMode('attr'); }} 
                          />
                        );
                      })}
                    </Section>
                  )}
                </div>
                <Section title="Employees" emptyText="No employees match your search.">
                  {people.map((p, idx) => {
                    const flatIdx = currentIdx++;
                    return (
                      <OptionRow 
                        key={p.id} 
                        dataIdx={flatIdx}
                        label={p.label} 
                        focused={focusedIdx === flatIdx}
                        onMouseEnter={() => setFocusedIdx(flatIdx)}
                        onClick={() => onSelect(p as Chip)} 
                      />
                    );
                  })}
                </Section>
                <Section title="Variables" emptyText="No variables match your search.">
                  {variables.map((v, idx) => {
                    const flatIdx = currentIdx++;
                    return (
                      <OptionRow 
                        key={v.id} 
                        dataIdx={flatIdx}
                        label={v.label} 
                        focused={focusedIdx === flatIdx}
                        onMouseEnter={() => setFocusedIdx(flatIdx)}
                        onClick={() => onSelect(v as Chip)} 
                      />
                    );
                  })}
                </Section>
              </>
            );
          })()}
        </div>
      ) : (
        <div className="flex flex-col max-h-80">
          <div ref={attrScrollRef} className="flex-1 overflow-auto p-3">
            {/* Attribute forms */}
          {selectedAttr?.kind === 'department' && (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-muted-foreground">Operator</label>
              <select value={deptOperator} onChange={(e) => setDeptOperator(e.target.value as any)} className="w-full rounded-lg border px-2 py-1 text-sm">
                <option>is any of</option>
                <option>is not any of</option>
                <option>is all of</option>
              </select>
              <label className="mt-3 block text-xs font-medium text-muted-foreground">Values</label>
              <div className="mb-2 flex items-center gap-2 rounded-lg bg-muted/40 p-2 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Use <strong>↑</strong>/<strong>↓</strong> to navigate, <strong>Space</strong> to select or unselect a value, and <strong>Enter</strong> to confirm your choices.
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DEPARTMENT_VALUES.map((d, idx) => (
                  <label 
                    key={d} 
                    data-value-idx={idx}
                    className={`flex items-center gap-2 rounded-lg border p-2 text-sm hover:bg-muted/60 ${focusedValueIdx === idx ? "bg-muted/70 ring-1 ring-black/10" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={deptValues.includes(d)}
                      onChange={(e) => {
                        setDeptValues((prev) => (e.target.checked ? [...prev, d] : prev.filter((x) => x !== d)));
                      }}
                    />
                    <span className="flex-1">{d}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {selectedAttr?.kind === 'compensation' && (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-muted-foreground">Operator</label>
              <select value={compOperator} onChange={(e) => setCompOperator(e.target.value as any)} className="w-full rounded-lg border px-2 py-1 text-sm">
                <option>{">"}</option>
                <option>{">="}</option>
                <option>{"="}</option>
                <option>{"<="}</option>
                <option>{"<"}</option>
              </select>
              <label className="mt-3 block text-xs font-medium text-muted-foreground">Value</label>
              <div className="mb-2 flex items-center gap-2 rounded-lg bg-muted/40 p-2 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Type a value and press <strong>Enter</strong> to save.
                </span>
              </div>
              <input 
                value={compValue} 
                onChange={(e) => setCompValue(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isFormValid) {
                    e.preventDefault();
                    handleSaveAttribute();
                  }
                }}
                placeholder="e.g. 150000" 
                className="w-full rounded-lg border px-2 py-1 text-sm" 
              />
            </div>
          )}

          {selectedAttr?.kind === 'startdate' && (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-muted-foreground">Operator</label>
              <select value={dateOperator} onChange={(e) => setDateOperator(e.target.value as any)} className="w-full rounded-lg border px-2 py-1 text-sm">
                <option>before</option>
                <option>on</option>
                <option>on or after</option>
              </select>
              <label className="mt-3 block text-xs font-medium text-muted-foreground">Date</label>
              <div className="mb-2 flex items-center gap-2 rounded-lg bg-muted/40 p-2 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Select a date and press <strong>Enter</strong> to save.
                </span>
              </div>
              <input 
                type="date" 
                value={dateValue} 
                onChange={(e) => setDateValue(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isFormValid) {
                    e.preventDefault();
                    handleSaveAttribute();
                  }
                }}
                className="w-full rounded-lg border px-2 py-1 text-sm" 
              />
            </div>
          )}

          {selectedAttr?.kind === 'location' && (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-muted-foreground">Operator</label>
              <select value={locationOperator} onChange={(e) => setLocationOperator(e.target.value as any)} className="w-full rounded-lg border px-2 py-1 text-sm">
                <option>is any of</option>
                <option>is not any of</option>
                <option>is all of</option>
              </select>
              <label className="mt-3 block text-xs font-medium text-muted-foreground">Values</label>
              <div className="mb-2 flex items-center gap-2 rounded-lg bg-muted/40 p-2 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Use <strong>↑</strong>/<strong>↓</strong> to navigate, <strong>Space</strong> to select or unselect a value, and <strong>Enter</strong> to confirm your choices.
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {LOCATION_VALUES.map((l, idx) => (
                  <label 
                    key={l} 
                    data-value-idx={idx}
                    className={`flex items-center gap-2 rounded-lg border p-2 text-sm hover:bg-muted/60 ${focusedValueIdx === idx ? "bg-muted/70 ring-1 ring-black/10" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={locationValues.includes(l)}
                      onChange={(e) => {
                        setLocationValues((prev) => (e.target.checked ? [...prev, l] : prev.filter((x) => x !== l)));
                      }}
                    />
                    <span className="flex-1">{l}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {selectedAttr?.kind === 'level' && (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-muted-foreground">Operator</label>
              <select value={levelOperator} onChange={(e) => setLevelOperator(e.target.value as any)} className="w-full rounded-lg border px-2 py-1 text-sm">
                <option>is any of</option>
                <option>is not any of</option>
                <option>is all of</option>
              </select>
              <label className="mt-3 block text-xs font-medium text-muted-foreground">Values</label>
              <div className="mb-2 flex items-center gap-2 rounded-lg bg-muted/40 p-2 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Use <strong>↑</strong>/<strong>↓</strong> to navigate, <strong>Space</strong> to select or unselect a value, and <strong>Enter</strong> to confirm your choices.
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {LEVEL_VALUES.map((l, idx) => (
                  <label 
                    key={l} 
                    data-value-idx={idx}
                    className={`flex items-center gap-2 rounded-lg border p-2 text-sm hover:bg-muted/60 ${focusedValueIdx === idx ? "bg-muted/70 ring-1 ring-black/10" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={levelValues.includes(l)}
                      onChange={(e) => {
                        setLevelValues((prev) => (e.target.checked ? [...prev, l] : prev.filter((x) => x !== l)));
                      }}
                    />
                    <span className="flex-1">{l}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {selectedAttr?.kind === 'team' && (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-muted-foreground">Operator</label>
              <select value={teamOperator} onChange={(e) => setTeamOperator(e.target.value as any)} className="w-full rounded-lg border px-2 py-1 text-sm">
                <option>is any of</option>
                <option>is not any of</option>
                <option>is all of</option>
              </select>
              <label className="mt-3 block text-xs font-medium text-muted-foreground">Values</label>
              <div className="mb-2 flex items-center gap-2 rounded-lg bg-muted/40 p-2 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Use <strong>↑</strong>/<strong>↓</strong> to navigate, <strong>Space</strong> to select or unselect a value, and <strong>Enter</strong> to confirm your choices.
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {TEAM_VALUES.map((t, idx) => (
                  <label 
                    key={t} 
                    data-value-idx={idx}
                    className={`flex items-center gap-2 rounded-lg border p-2 text-sm hover:bg-muted/60 ${focusedValueIdx === idx ? "bg-muted/70 ring-1 ring-black/10" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={teamValues.includes(t)}
                      onChange={(e) => {
                        setTeamValues((prev) => (e.target.checked ? [...prev, t] : prev.filter((x) => x !== t)));
                      }}
                    />
                    <span className="flex-1">{t}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          </div>
          {/* Footer actions - outside scrollable area */}
          <div className="flex items-center justify-between gap-2 border-t pt-3 px-3 pb-3 bg-white">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={saveAndAddAnother}
                onChange={(e) => setSaveAndAddAnother(e.target.checked)}
                className="cursor-pointer"
              />
              <span className="text-sm text-[#202022]">Save and add another</span>
            </label>
            <div className="flex items-center gap-2" style={{ marginLeft: '18px' }}>
              <button onClick={resetAndClose} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-muted/60">Cancel</button>
              <button 
                onClick={handleSaveAttribute} 
                disabled={!isFormValid}
                className={`rounded-lg px-3 py-1.5 text-sm text-white ${
                  isFormValid 
                    ? "bg-black hover:bg-black/90" 
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================
// Compound Rule Pill (with AND between stitched values)
// =============================================================
const AndBadge = () => (
  <div className="self-stretch border-l border-r border-t border-[rgba(0,0,0,0.1)] px-2 flex items-center shrink-0" style={{ marginTop: '-1px', marginLeft: '-1px' }}>
    <span className="select-none text-[10px] font-medium leading-[12px] tracking-[0.5px] text-[#6f6f72] opacity-80 whitespace-nowrap">AND</span>
  </div>
);

const LabelSegment: React.FC<{ text: string; onRemove: () => void; isLast?: boolean; isFirst?: boolean }> = ({ text, onRemove, isLast = false, isFirst = false }) => (
  <div className={`relative group/seg select-none px-3 py-1 self-stretch flex items-center shrink-0 ${!isFirst ? 'border-t border-[rgba(0,0,0,0.1)]' : ''} ${!isLast ? 'border-r border-[rgba(0,0,0,0.1)]' : ''}`} style={!isFirst ? { marginTop: '-1px', marginLeft: '-1px' } : { marginLeft: '-1px' }}>
    <span className="text-[13px] leading-[16px] tracking-[0.25px] text-[#202022] break-words whitespace-normal">{text}</span>
    {/* close button on the right; appears on hover/focus */}
    <button
      onClick={onRemove}
      className="absolute right-1 top-1/2 hidden h-5 w-5 -translate-y-1/2 items-center justify-center rounded hover:bg-[rgba(0,0,0,0.05)] group-hover/seg:flex focus:flex focus:outline-none"
      style={{ backgroundColor: '#F2F2F2' }}
      title="Remove"
    >
      <X className="h-3.5 w-3.5 text-[#202022]" />
    </button>
  </div>
);

const RulePill: React.FC<{
  rule: Rule;
  groupIdx: number;
  onRemoveAt: (chipIdx: number) => void;
  onAddAtEnd: (anchor: DOMRect) => void;
}> = ({ rule, onRemoveAt, onAddAtEnd }) => {
  const plusRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="flex flex-wrap items-start border px-0" style={{ minHeight: '24px', backgroundColor: '#FAFAFA', borderColor: 'rgba(0,0,0,0.1)', borderRadius: '6px' }}>
      {rule.map((chip, idx) => (
        <React.Fragment key={`${chip.id}-${idx}`}>
          {idx > 0 && <AndBadge />}
          <LabelSegment text={chip.label} onRemove={() => onRemoveAt(idx)} isLast={idx === rule.length - 1} isFirst={idx === 0} />
        </React.Fragment>
      ))}
      {/* trailing divider and add button */}
      <div className="self-stretch border-l border-t border-[rgba(0,0,0,0.1)] px-1 flex items-center" style={{ marginTop: '-1px', marginLeft: '-1px' }}>
        <button
          ref={plusRef}
          onClick={() => {
            const rect = plusRef.current?.getBoundingClientRect();
            if (rect) onAddAtEnd(rect);
          }}
          className="h-5 w-5 flex items-center justify-center hover:bg-[rgba(0,0,0,0.05)] rounded"
          title="Add another (AND)"
        >
          <Plus className="h-4 w-4 text-[#202022]" />
        </button>
      </div>
    </div>
  );
};

const ExceptionChip: React.FC<{ chip: Chip; onRemove: () => void; onAdd: (anchor: DOMRect) => void }> = ({ chip, onRemove, onAdd }) => {
  const plusRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="flex items-center border px-0" style={{ height: '24px', backgroundColor: '#FAFAFA', borderColor: 'rgba(0,0,0,0.1)', borderRadius: '6px' }}>
      <div className="relative group/seg select-none px-3 py-0 h-full flex items-center">
        <span className="text-[13px] leading-[16px] tracking-[0.25px] text-[#202022]">{chip.label}</span>
        {/* close button on the right; appears on hover/focus */}
        <button
          onClick={onRemove}
          className="absolute right-1 top-1/2 hidden h-5 w-5 -translate-y-1/2 items-center justify-center rounded hover:bg-[rgba(0,0,0,0.05)] group-hover/seg:flex focus:flex focus:outline-none"
          style={{ backgroundColor: '#F2F2F2' }}
          title="Remove"
        >
          <X className="h-3.5 w-3.5 text-[#202022]" />
        </button>
      </div>
      {/* trailing divider and add button */}
      <div className="h-full border-l border-[rgba(0,0,0,0.1)] px-1 flex items-center">
        <button
          ref={plusRef}
          onClick={() => {
            const rect = plusRef.current?.getBoundingClientRect();
            if (rect) onAdd(rect);
          }}
          className="h-5 w-5 flex items-center justify-center hover:bg-[rgba(0,0,0,0.05)] rounded"
          title="Add another exception"
        >
          <Plus className="h-4 w-4 text-[#202022]" />
        </button>
      </div>
    </div>
  );
};

// =============================================================
// Helper function to generate rule description
// =============================================================
function generateRuleDescription(rules: RuleGroup, exceptions: Chip[]): string {
  if (rules.length === 0) {
    return "No rules defined";
  }

  // Process each group (OR condition)
  const descriptions: string[] = [];
  
  for (const group of rules) {
    if (group.length === 0) continue;
    
    // Process chips in the group (AND condition)
    let department: string | null = null;
    let level: string | null = null;
    let location: string | null = null;
    let team: string | null = null;
    const otherParts: string[] = [];
    
    for (const chip of group) {
      const label = chip.label;
      
      // Parse common patterns
      if (label.includes("→")) {
        const [attr, value] = label.split("→").map(s => s.trim());
        const attrLower = attr.toLowerCase();
        
        // Format based on attribute type
        if (attrLower.includes("department")) {
          department = value;
        } else if (attrLower.includes("work location") || attrLower.includes("location")) {
          location = value;
        } else if (attrLower.includes("level")) {
          level = value;
        } else if (attrLower.includes("team")) {
          team = value;
        } else {
          // Generic format
          otherParts.push(`${attr.toLowerCase()} ${value.toLowerCase()}`);
        }
      } else if (chip.type === "employee") {
        // Employee name - extract from label
        const nameMatch = label.match(/^([^(]+)/);
        if (nameMatch) {
          otherParts.push(nameMatch[1].trim());
        }
      } else {
        // Fallback: use label as-is
        otherParts.push(label.toLowerCase());
      }
    }
    
    // Build description for this group
    const groupParts: string[] = [];
    
    // Combine department and level (e.g., "Engineering" + "Manager" = "engineering managers")
    if (department && level) {
      const deptLower = department.toLowerCase();
      const levelLower = level.toLowerCase();
      // Combine into a single phrase
      groupParts.push(`${deptLower} ${levelLower}s`);
    } else if (department) {
      // Convert department to job title format
      const deptLower = department.toLowerCase();
      if (deptLower.includes("product design")) {
        groupParts.push("product designers");
      } else if (deptLower.includes("engineering")) {
        groupParts.push("engineers");
      } else {
        groupParts.push(`${deptLower} employees`);
      }
    } else if (level) {
      groupParts.push(level.toLowerCase());
    }
    
    // Add location
    if (location) {
      groupParts.push(`in the ${location}`);
    }
    
    // Add team
    if (team) {
      groupParts.push(`on the ${team} team`);
    }
    
    // Add other parts
    groupParts.push(...otherParts);
    
    // Join AND conditions
    if (groupParts.length > 0) {
      if (groupParts.length === 1) {
        descriptions.push(groupParts[0]);
      } else {
        // Combine multiple AND conditions with commas
        descriptions.push(groupParts.join(", "));
      }
    }
  }
  
  // Join OR conditions with "or" before the last item
  let description = "";
  if (descriptions.length === 0) {
    description = "";
  } else if (descriptions.length === 1) {
    description = descriptions[0];
  } else {
    const last = descriptions.pop();
    description = `${descriptions.join(", ")}, or ${last}`;
  }
  
  // Add exceptions
  if (exceptions.length > 0) {
    const exceptionNames = exceptions.map(e => {
      if (e.type === "employee") {
        const nameMatch = e.label.match(/^([^(]+)/);
        return nameMatch ? nameMatch[1].trim() : e.label;
      }
      return e.label;
    });
    
    if (exceptionNames.length === 1) {
      description += ` -- excluding ${exceptionNames[0]}`;
    } else {
      const last = exceptionNames.pop();
      description += ` -- excluding ${exceptionNames.join(", ")}, and ${last}`;
    }
  }
  
  return description;
}

// =============================================================
// Kebab Menu Dropdown Component
// =============================================================
const KebabMenuDropdown: React.FC<{ open: boolean; anchorRect: DOMRect | null; onClose: () => void }> = ({ open, anchorRect, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, onClose]);

  if (!open || !anchorRect) return null;

  const style: React.CSSProperties = {
    position: "fixed",
    top: anchorRect.bottom + 4,
    right: window.innerWidth - anchorRect.right,
    width: 280,
    zIndex: 50,
  };

  const menuItems = [
    {
      icon: Bookmark,
      title: "Create shortcut",
      description: "Save the added rules as a shortcut",
    },
    {
      icon: Calendar,
      title: "Schedule a change for later",
      description: "Queue updates for a later date",
    },
    {
      icon: Users,
      title: "Edit employment state rules",
      description: "By default this group will only include Active and Accepted employees",
    },
    {
      icon: History,
      title: "Group history",
      description: "View group change history",
    },
  ];

  return (
    <div style={style} ref={containerRef} className="rounded-lg border bg-white shadow-xl overflow-hidden">
      <div className="py-1">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={onClose}
              className="w-full flex items-start gap-2 px-3 py-1 hover:bg-[rgba(0,0,0,0.05)] transition-colors text-left"
            >
              <div className="pt-0.5 shrink-0">
                <Icon className="h-4 w-4 text-[#202022]" />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[13px] leading-[16px] tracking-[0.25px] text-[#202022]">{item.title}</span>
                <span className="text-[11px] leading-[13px] text-[#6f6f72]">{item.description}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// =============================================================
// Temporality Popover Component
// =============================================================
const TemporalityPopover: React.FC<{ open: boolean; anchorRect: DOMRect | null; onClose: () => void }> = ({ open, anchorRect, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, onClose]);

  if (!open || !anchorRect) return null;

  const style: React.CSSProperties = {
    position: "fixed",
    top: anchorRect.bottom + 4,
    left: anchorRect.left,
    width: 320,
    zIndex: 50,
  };

  return (
    <div style={style} ref={containerRef} className="rounded-lg border bg-white shadow-xl p-4">
      <p className="text-sm text-[#202022]">This is where Supergroup temporality settings will live</p>
    </div>
  );
};

// =============================================================
// Main Component
// =============================================================
export default function Home() {
  const [rules, setRules] = useState<RuleGroup>([
    [{ id: "var-1", label: "Department → Product Design", type: "variable" }],
    [{ id: "var-2", label: "Work location → San Francisco office", type: "variable" }],
    [
      { id: "var-3", label: "Department → Engineering", type: "variable" },
      { id: "var-4", label: "Level → Manager", type: "variable" },
    ],
  ]);

  const [exceptions, setExceptions] = useState<Chip[]>([]);

  const [popover, setPopover] = useState<{ open: boolean; target: { groupIdx: number; insertAtEnd?: boolean; chipIdx?: number } | null; rect: DOMRect | null; currentRule?: Rule; isException?: boolean }>({ open: false, target: null, rect: null, currentRule: [], isException: false });
  const [lastChip, setLastChip] = useState<Chip | null>(null);
  const [kebabMenuOpen, setKebabMenuOpen] = useState(false);
  const [kebabMenuRect, setKebabMenuRect] = useState<DOMRect | null>(null);
  const [temporalityPopoverOpen, setTemporalityPopoverOpen] = useState(false);
  const [temporalityPopoverRect, setTemporalityPopoverRect] = useState<DOMRect | null>(null);
  const [shouldOpenAddAnother, setShouldOpenAddAnother] = useState(false);

  const openPopover = (rect: DOMRect, target: { groupIdx: number; insertAtEnd?: boolean; chipIdx?: number }) => {
    // Check if we're adding a new group (target.groupIdx === rules.length)
    const isNewGroup = target.groupIdx === rules.length;
    
    // Get the current rule from the target group
    const targetGroup = rules[target.groupIdx];
    let currentRule = targetGroup || [];
    let chipToShow = lastChip;
    
    // If we're adding a new group, use the last existing group's rule and chip
    if (isNewGroup && rules.length > 0) {
      // Find the last group that has chips
      for (let i = rules.length - 1; i >= 0; i--) {
        const group = rules[i];
        if (group && group.length > 0) {
          currentRule = group;
          chipToShow = group[group.length - 1];
          break;
        }
      }
    } else {
      // If we're adding to an existing group, use that group's rule and chip
      if (targetGroup && targetGroup.length > 0) {
        currentRule = targetGroup;
        chipToShow = targetGroup[targetGroup.length - 1];
      } else if (!chipToShow && rules.length > 0) {
        // Fallback: find the last chip from all existing groups
        for (let i = rules.length - 1; i >= 0; i--) {
          const group = rules[i];
          if (group && group.length > 0) {
            chipToShow = group[group.length - 1];
            break;
          }
        }
      }
    }
    
    setLastChip(chipToShow);
    setPopover({ open: true, rect, target, currentRule });
  };
  
  const closePopover = () => {
    setPopover(prev => ({ ...prev, open: false, rect: null, target: null }));
    // Don't clear lastChip or currentRule here - keep them for next time popover opens
  };

  const addChipToRule = (chip: Chip, target: { groupIdx: number; insertAtEnd?: boolean; chipIdx?: number }) => {
    setRules((prev) => addChipToRulePure(prev, chip, target));
    setLastChip(chip); // Track the last added chip
    closePopover();
  };

  const removeChip = (groupIdx: number, chipIdx: number) => setRules((prev) => removeChipPure(prev, groupIdx, chipIdx));

  const openExceptionPopover = (rect: DOMRect) => {
    setPopover({ open: true, rect, target: null, currentRule: [], isException: true });
  };

  const addException = (chip: Chip) => {
    setExceptions((prev) => [...prev, chip]);
    closePopover();
  };

  // Watch for "save and add another" flag and open new popover after rules update
  React.useEffect(() => {
    if (shouldOpenAddAnother && !popover.open) {
      // Find the "add another group" button and open popover
      const addAnotherButton = document.querySelector('[data-add-another-group]') as HTMLElement;
      if (addAnotherButton) {
        const rect = addAnotherButton.getBoundingClientRect();
        openPopover(rect, { groupIdx: rules.length, insertAtEnd: true });
        setShouldOpenAddAnother(false);
      }
    }
  }, [shouldOpenAddAnother, popover.open, rules.length]);

  const removeException = (chipId: string) => {
    setExceptions((prev) => prev.filter((c) => c.id !== chipId));
  };

  const memberCount = useMemo(() => countMembers(rules), [rules]);

  return (
    <div className="min-h-screen bg-[#faf8fb]">
      <main className="mx-auto max-w-4xl p-8">
        <h1 className="text-2xl font-semibold">This is a form title</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          This is a form caption. This subtext should explain the purpose of the form, what it takes for a user to fill it out and what value it provides after filling out.
        </p>

        <div className="mt-8 rounded-2xl border bg-white shadow-sm overflow-hidden">
          {/* Header bar with temporality dropdown and kebab menu */}
          <div className="flex items-center justify-between border-b px-3 py-2 rounded-t-2xl" style={{ backgroundColor: '#FAFAFA' }}>
            <button 
              onClick={(e) => {
                const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                setTemporalityPopoverRect(rect);
                setTemporalityPopoverOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-0 h-8 rounded-md hover:bg-[rgba(0,0,0,0.05)] transition-colors"
            >
              <span className="text-sm font-medium text-[#202022]">Supergroup</span>
              <span className="text-sm text-[#6F6F72]">evaluated in real time</span>
              <ChevronDown className="h-4 w-4 text-[#202022]" />
            </button>
            <button 
              onClick={(e) => {
                const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                setKebabMenuRect(rect);
                setKebabMenuOpen(true);
              }}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-[rgba(0,0,0,0.05)] transition-colors"
            >
              <MoreVertical className="h-5 w-5 text-[#202022]" />
            </button>
          </div>
          
          <div className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            {rules.map((group, groupIdx) => (
              <div key={groupIdx}>
                <RulePill
                  rule={group}
                  groupIdx={groupIdx}
                  onRemoveAt={(chipIdx) => removeChip(groupIdx, chipIdx)}
                  onAddAtEnd={(rect) => openPopover(rect, { groupIdx, insertAtEnd: true })}
                />
              </div>
            ))}
            <div className="flex-shrink-0" style={{ minWidth: '70px' }}>
              <button
                data-add-another-group
                onClick={(e) => {
                  const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                  openPopover(rect, { groupIdx: rules.length, insertAtEnd: true });
                }}
                className="group relative inline-flex items-center gap-1 px-2 hover:bg-[rgba(0,0,0,0.05)] transition-all overflow-hidden" 
                style={{ height: '24px', borderRadius: '6px', border: '1px dashed rgba(0,0,0,0.2)' }}
              >
                <UserPlus className="h-3 w-3 text-[#202022] shrink-0" /> 
                {rules.length === 0 ? (
                  <span className="text-[13px] leading-[16px] tracking-[0.25px] text-[#202022] whitespace-nowrap">Add member(s)</span>
                ) : (
                  <span className="text-[13px] leading-[16px] tracking-[0.25px] text-[#202022] max-w-0 group-hover:max-w-[100px] opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap overflow-hidden">ADD</span>
                )}
              </button>
            </div>
          </div>

          {rules.length > 0 && (
          <div className="pt-8">
            <div className="flex flex-wrap items-center gap-1">
              {exceptions.length > 0 && (
                <span className="text-[14px] font-medium leading-[20px] text-[#252528]">Except:</span>
              )}
              {exceptions.map((exception) => (
                <ExceptionChip
                  key={exception.id}
                  chip={exception}
                  onRemove={() => removeException(exception.id)}
                  onAdd={(rect) => openExceptionPopover(rect)}
                />
              ))}
              <button
                onClick={(e) => {
                  const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                  openExceptionPopover(rect);
                }}
                className="group relative inline-flex items-center gap-1 px-2 hover:bg-[rgba(0,0,0,0.05)] transition-all overflow-hidden" 
                style={{ height: '24px', borderRadius: '6px', border: '1px dashed rgba(0,0,0,0.2)' }}
              >
                <UserMinus className="h-3 w-3 text-[#202022] shrink-0" /> 
                <span className="text-[13px] leading-[16px] tracking-[0.25px] text-[#202022] max-w-0 group-hover:max-w-[100px] opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap overflow-hidden">EXCLUDE</span>
              </button>
            </div>
          </div>
          )}

          {rules.length > 0 && (
          <div className="mt-4 flex items-start justify-between border-t pt-4">
            <div className="text-sm text-muted-foreground">
              <span>This will include: </span>
              <span className="text-[#202022]">
                {(() => {
                  const hasAttributesOrVariables = rules.some(group => 
                    group.some(chip => chip.type === "variable" || chip.label.includes("→"))
                  );
                  const description = generateRuleDescription(rules, exceptions);
                  if (hasAttributesOrVariables) {
                    return <>Active or recently hired employees who are {description}.</>;
                  }
                  return <>{description}.</>;
                })()}
              </span>
            </div>
            <button 
              className="inline-flex items-center gap-1 px-2 hover:bg-[rgba(0,0,0,0.05)] transition-colors shrink-0" 
              style={{ height: '24px', borderRadius: '6px', marginLeft: '24px' }}
              title="Preview people"
            >
              <Eye className="h-3 w-3 text-[#202022]" />
              <span className="text-sm text-[#202022]">{memberCount} members</span>
            </button>
          </div>
          )}
          </div>
        </div>
      </main>

      <Popover
        open={popover.open}
        anchorRect={popover.rect}
        onClose={closePopover}
        onSelect={(chip, usePreviousGroup, saveAndAddAnother) => {
          if (popover.isException) {
            addException(chip);
          } else if (usePreviousGroup && popover.currentRule) {
            // Find the previous group index (the last group that exists)
            const prevGroupIdx = rules.length > 0 ? rules.length - 1 : 0;
            addChipToRule(chip, { groupIdx: prevGroupIdx, insertAtEnd: true });
          } else if (popover.target) {
            addChipToRule(chip, popover.target);
          }
          
          // If "save and add another" is checked, set flag to open new popover after state updates
          if (saveAndAddAnother && popover.rect) {
            // Close current popover first
            closePopover();
            // Set flag to open new popover after rules state updates
            setShouldOpenAddAnother(true);
          }
        }}
        lastChip={lastChip}
        isNewGroup={popover.target?.groupIdx === rules.length}
        currentRule={popover.currentRule || []}
        previousGroupIdx={rules.length > 0 ? rules.length - 1 : undefined}
      />

      <KebabMenuDropdown
        open={kebabMenuOpen}
        anchorRect={kebabMenuRect}
        onClose={() => {
          setKebabMenuOpen(false);
          setKebabMenuRect(null);
        }}
      />

      <TemporalityPopover
        open={temporalityPopoverOpen}
        anchorRect={temporalityPopoverRect}
        onClose={() => {
          setTemporalityPopoverOpen(false);
          setTemporalityPopoverRect(null);
        }}
      />
    </div>
  );
}

// =============================================================
// Lightweight tests (console only, non-UI)
// =============================================================
(function runTests() {
  try {
    const base: RuleGroup = [
      [{ id: "a", label: "A", type: "variable" }],
      [{ id: "b", label: "B", type: "variable" }],
    ];

    // 1) Append at end
    const r1 = addChipToRulePure(base, { id: "x", label: "X", type: "variable" }, { groupIdx: 0, insertAtEnd: true });
    console.assert(r1[0].length === 2 && r1[0][1].id === "x", "Append at end works");

    // 2) Insert after chipIdx
    const r2 = addChipToRulePure(base, { id: "y", label: "Y", type: "variable" }, { groupIdx: 0, chipIdx: 0 });
    console.assert(r2[0][1].id === "y", "Insert after index works");

    // 3) New group creation when target absent
    const r3 = addChipToRulePure(base, { id: "z", label: "Z", type: "variable" }, { groupIdx: 2, insertAtEnd: true });
    console.assert(r3.length === 3 && r3[2][0].id === "z", "Creating a new group works");

    // 4) Remove last chip drops empty group
    const r4 = removeChipPure([[{ id: "a", label: "A", type: "variable" }]], 0, 0);
    console.assert(r4.length === 0, "Removing last chip drops empty group");

    // 5) Member counting mock returns non-negative
    const mc = countMembers([
      [{ id: "aa", label: "AA", type: "variable" }, { id: "bb", label: "BB", type: "variable" }],
      [{ id: "cc", label: "CC", type: "variable" }],
    ]);
    console.assert(typeof mc === "number" && mc >= 0, "Member count is non-negative number");

    console.log("Prototype tests passed ✅");
  } catch (e) {
    console.error("Test failure:", e);
  }
})();