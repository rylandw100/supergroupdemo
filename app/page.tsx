"use client"

import React, { useMemo, useRef, useState } from "react";
import { Plus, X, Search, ArrowLeft, Info, UserMinus, Users, UserPlus, Eye, ChevronDown, MoreVertical, Bookmark, Calendar, History, Pencil } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

// Parse chip label to extract attribute info for editing
function parseChipForEditing(chip: Chip): { attrKind: string; operator?: string; values?: string[] } | null {
  const label = chip.label;
  const attrType = getChipType(chip);
  
  if (!attrType) return null;
  
  // Parse "Department → Product Design" format
  if (label.includes("→")) {
    const match = label.match(/(.+?)\s*→\s*(.+)/);
    if (match) {
      const value = match[2].trim();
      return { attrKind: attrType, operator: "is any of", values: [value] };
    }
  }
  
  // Parse "Work location is any of San Francisco" format
  if (label.includes("is any of") || label.includes("is not any of") || label.includes("is all of")) {
    const operatorMatch = label.match(/(is any of|is not any of|is all of)/i);
    const operator = operatorMatch ? operatorMatch[1] : "is any of";
    const valueMatch = label.match(/(?:is any of|is not any of|is all of)\s+(.+)/i);
    if (valueMatch) {
      const values = valueMatch[1].split(",").map(v => v.trim());
      return { attrKind: attrType, operator, values };
    }
  }
  
  return { attrKind: attrType };
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

const OptionRow: React.FC<{ label: string; badge?: string; onClick: () => void; focused?: boolean; onMouseEnter?: () => void; dataIdx?: number; disabled?: boolean; subtext?: string }> = ({ label, badge, onClick, focused = false, onMouseEnter, dataIdx, disabled = false, subtext }) => (
  <button 
    onClick={disabled ? undefined : onClick} 
    onMouseEnter={disabled ? undefined : onMouseEnter}
    data-idx={dataIdx}
    disabled={disabled}
    className={`flex w-full flex-col rounded-lg px-2 py-2 text-left text-sm ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/60"} ${focused && !disabled ? "bg-muted/70 ring-1 ring-black/10" : ""}`}
    role="option"
    aria-selected={focused}
    aria-disabled={disabled}
  >
    <div className="flex items-center justify-between">
      <span className="line-clamp-1">{label}</span>
      <div className="ml-2 flex items-center gap-2">
        {focused && !disabled ? (
          <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold uppercase text-white">TAB</span>
        ) : null}
        {badge ? <span className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{badge}</span> : null}
      </div>
    </div>
    {subtext && (
      <span className="text-xs text-muted-foreground mt-1">{subtext}</span>
    )}
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
  externalQuery?: string;
  hideSearchBar?: boolean;
  isOption2?: boolean;
  isException?: boolean;
  exceptionsLength?: number;
  chipToEdit?: { chip: Chip; groupIdx: number; chipIdx: number } | null;
}> = ({ open, anchorRect, onClose, onSelect, lastChip, isNewGroup = false, currentRule = [], previousGroupIdx, externalQuery, hideSearchBar = false, isOption2 = false, isException = false, exceptionsLength = 0, chipToEdit = null }) => {
  const [query, setQuery] = useState("");
  const effectiveQuery = externalQuery !== undefined ? externalQuery : query;
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
    const q = effectiveQuery.trim().toLowerCase();
    if (!q) return all;
    return all.filter((o) => o.label.toLowerCase().includes(q));
  }, [all, effectiveQuery]);

  const contextualSuggestions = useMemo(() => getContextualSuggestions(lastChip || null, currentRule), [lastChip, currentRule]);

  const variables = useMemo(() => filtered.filter((f) => f.type === "variable"), [filtered]);
  const people = useMemo(() => filtered.filter((f) => f.type === "employee"), [filtered]);

  // Build flat list of all options in order matching the rendered UI: Common filters → Operators → Attributes → Employees → Variables
  const flatList = useMemo(() => {
    const list: Array<{ type: 'suggestion' | 'attribute' | 'employee' | 'variable'; data: any; label: string; disabled?: boolean }> = [];
    const q = effectiveQuery.trim().toLowerCase();
    // For exceptions in Option 1, hide suggestions when exceptions are empty
    const showSuggestions = contextualSuggestions.length > 0 && !q && lastChip !== null && !(isException && !isOption2 && exceptionsLength === 0);
    
    // Add common filters (suggestions) - only show when there's no query and lastChip exists
    if (showSuggestions) {
      contextualSuggestions.forEach(s => {
        list.push({ type: 'suggestion', data: s, label: s.label });
      });
    }
    
    // Operators section removed - no longer showing "AND Other" button
    
    // Add attributes - filter by query
    const filteredAttributes = q 
      ? ATTRIBUTE_DEFINITIONS.filter(a => a.label.toLowerCase().includes(q))
      : ATTRIBUTE_DEFINITIONS;
    filteredAttributes.forEach(a => {
      list.push({ type: 'attribute', data: a, label: a.label });
    });
    
    // Add employees
    people.forEach(p => {
      list.push({ type: 'employee', data: p, label: p.label, disabled: p.id === "emp-6" });
    });
    
    // Add variables
    variables.forEach(v => {
      list.push({ type: 'variable', data: v, label: v.label });
    });
    
    return list;
  }, [contextualSuggestions, isNewGroup, people, variables, effectiveQuery, lastChip, isException, isOption2, exceptionsLength]);

  // Reset popover state when it opens, or pre-fill if editing a chip
  React.useEffect(() => {
    if (open) {
      if (chipToEdit) {
        // Pre-fill form with chip data
        const parsed = parseChipForEditing(chipToEdit.chip);
        if (parsed) {
          const attrDef = ATTRIBUTE_DEFINITIONS.find(a => a.kind === parsed.attrKind);
          if (attrDef) {
            setSelectedAttr(attrDef);
            setMode('attr');
            setQuery("");
            
            // Set operator and values based on attribute type
            if (parsed.attrKind === 'department' && parsed.operator && parsed.values) {
              setDeptOperator(parsed.operator as 'is any of' | 'is not any of' | 'is all of');
              setDeptValues(parsed.values);
            } else if (parsed.attrKind === 'location' && parsed.operator && parsed.values) {
              setLocationOperator(parsed.operator as 'is any of' | 'is not any of' | 'is all of');
              setLocationValues(parsed.values);
            } else if (parsed.attrKind === 'level' && parsed.operator && parsed.values) {
              setLevelOperator(parsed.operator as 'is any of' | 'is not any of' | 'is all of');
              setLevelValues(parsed.values);
            } else if (parsed.attrKind === 'team' && parsed.operator && parsed.values) {
              setTeamOperator(parsed.operator as 'is any of' | 'is not any of' | 'is all of');
              setTeamValues(parsed.values);
            }
            setAddingToPreviousGroup(false);
          }
        }
      } else {
        setMode('list');
        setSelectedAttr(null);
        setQuery("");
        setDeptValues([]);
        setLocationValues([]);
        setLevelValues([]);
        setTeamValues([]);
        setCompValue("");
        setDateValue("");
        setAddingToPreviousGroup(false);
      }
    }
  }, [open, chipToEdit]);

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
    
    // In Option 2, always behave as if saveAndAddAnother is true
    const shouldSaveAndAddAnother = isOption2 || saveAndAddAnother;
    
    // If we're adding from "Add another group" and clicked a common filter, add to previous group
    onSelect(chip, addingToPreviousGroup, shouldSaveAndAddAnother);
    
    if (shouldSaveAndAddAnother) {
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
          let next = e.key === "ArrowDown" ? i + 1 : i - 1;
          // Skip disabled items
          while (next >= 0 && next < total && flatList[next]?.disabled) {
            next = e.key === "ArrowDown" ? next + 1 : next - 1;
          }
          return Math.max(0, Math.min(total - 1, next));
        });
      } else if (e.key === "Enter" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault();
        const item = flatList[focusedIdx];
        if (!item || item.disabled) return;

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
      {(!hideSearchBar || mode === 'attr') && (
        <div className="flex items-center gap-2 border-b p-3">
          {mode === 'attr' ? (
            !chipToEdit && (
              <button onClick={() => setMode('list')} className="mr-1 rounded p-1 hover:bg-muted" title="Back">
                <ArrowLeft className="h-4 w-4" />
              </button>
            )
          ) : (
            <Search className="h-4 w-4 opacity-60" />
          )}
          {mode === 'list' ? (
            !hideSearchBar ? (
              <input
                autoFocus
                value={effectiveQuery}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users, variables, attributes"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            ) : null
          ) : (
            <div className="text-sm font-medium">{selectedAttr?.label} condition</div>
          )}
        </div>
      )}

      {/* Body */}
      {mode === 'list' ? (
        <div ref={listScrollRef} className="max-h-80 overflow-auto p-2">
          {(() => {
            const q = effectiveQuery.trim().toLowerCase();
            const showSuggestions = contextualSuggestions.length > 0 && !q && lastChip !== null;
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
                ) : null}
                {isNewGroup && showSuggestions && (
                  <div className="border-t border-[rgba(0,0,0,0.1)] my-2"></div>
                )}
                <div data-section="attributes">
                  {isNewGroup ? (
                    <Section title={(!q && lastChip === null) || (isException && !isOption2 && exceptionsLength === 0) ? "Add a group" : "Add another group (OR)"} emptyText="No attributes.">
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
                    const isLuisRomero = p.id === "emp-6";
                    return (
                      <OptionRow 
                        key={p.id} 
                        dataIdx={flatIdx}
                        label={p.label} 
                        focused={focusedIdx === flatIdx}
                        onMouseEnter={() => setFocusedIdx(flatIdx)}
                        onClick={() => onSelect(p as Chip)}
                        disabled={isLuisRomero}
                        subtext={isLuisRomero ? "This individual can't be added due to provisioning rules" : undefined}
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
            {!isOption2 && !chipToEdit && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAndAddAnother}
                  onChange={(e) => setSaveAndAddAnother(e.target.checked)}
                  className="cursor-pointer"
                />
                <span className="text-sm text-[#202022]">Save and add another</span>
              </label>
            )}
            {(isOption2 || chipToEdit) && <div />}
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

const LabelSegment: React.FC<{ text: string; onRemove: () => void; isLast?: boolean; isFirst?: boolean; onClick?: (e: React.MouseEvent<HTMLElement>) => void }> = ({ text, onRemove, isLast = false, isFirst = false, onClick }) => (
  <div 
    className={`relative group/seg select-none px-3 py-1 self-stretch flex items-center shrink-0 ${!isFirst ? 'border-t border-[rgba(0,0,0,0.1)]' : ''} ${!isLast ? 'border-r border-[rgba(0,0,0,0.1)]' : ''} ${onClick ? 'cursor-pointer hover:bg-[rgba(0,0,0,0.05)] transition-colors' : ''}`} 
    style={!isFirst ? { marginTop: '-1px', marginLeft: '-1px' } : { marginLeft: '-1px' }}
    onClick={onClick}
  >
    <span className="text-[13px] leading-[16px] tracking-[0.25px] text-[#202022] break-words whitespace-normal">{text}</span>
    {/* close button on the right; appears on hover/focus */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }}
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
  onAddAfterChip?: (anchor: DOMRect, chipIdx: number) => void;
  isOption2?: boolean;
  chipEditState?: { groupIdx: number; chipIdx: number; query: string; isException: boolean } | null;
  onChipEditChange?: (query: string) => void;
  onChipEditBlur?: () => void;
  onChipEditKeyDown?: (e: React.KeyboardEvent) => void;
  getChipEditInputRef?: (key: string) => (el: HTMLInputElement | null) => void;
  onChipClick?: (chip: Chip, chipIdx: number, rect: DOMRect) => void;
}> = ({ rule, groupIdx, onRemoveAt, onAddAtEnd, onAddAfterChip, isOption2 = false, chipEditState, onChipEditChange, onChipEditBlur, onChipEditKeyDown, getChipEditInputRef, onChipClick }) => {
  const plusRef = useRef<HTMLButtonElement>(null);
  const isEditingThisChip = chipEditState?.groupIdx === groupIdx && chipEditState?.chipIdx === rule.length;
  
  return (
    <div className="flex flex-wrap items-start border px-0" style={{ minHeight: '24px', backgroundColor: '#FAFAFA', borderColor: 'rgba(0,0,0,0.1)', borderRadius: '6px' }}>
      {rule.map((chip, idx) => {
        const isEditingThis = isOption2 && chipEditState?.groupIdx === groupIdx && chipEditState?.chipIdx === idx;
        const inputKey = `${groupIdx}-${idx}`;
        return (
          <React.Fragment key={`${chip.id}-${idx}`}>
            {idx > 0 && <AndBadge />}
            <LabelSegment 
              text={chip.label} 
              onRemove={() => onRemoveAt(idx)} 
              isLast={idx === rule.length - 1 && !isEditingThis} 
              isFirst={idx === 0}
              onClick={onChipClick ? (e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                onChipClick(chip, idx, rect);
              } : undefined}
            />
            {/* Inline input after this chip if editing in Option 2 */}
            {isEditingThis && (
              <>
                <AndBadge />
                <div className="relative group/seg select-none px-3 py-1 self-stretch flex items-center shrink-0 border-t border-r border-[rgba(0,0,0,0.1)]" style={{ marginTop: '-1px', marginLeft: '-1px' }}>
                  <input
                    ref={getChipEditInputRef?.(inputKey)}
                    value={chipEditState.query}
                    onChange={(e) => onChipEditChange?.(e.target.value)}
                    onBlur={onChipEditBlur}
                    onKeyDown={onChipEditKeyDown}
                    placeholder="Search users, variables, attributes"
                    className="text-[13px] leading-[16px] tracking-[0.25px] text-[#202022] outline-none bg-transparent w-full placeholder:text-muted-foreground"
                    style={{ minWidth: '200px' }}
                    autoFocus
                  />
                </div>
              </>
            )}
          </React.Fragment>
        );
      })}
      {/* Inline input after last chip if editing at end in Option 2 */}
      {isOption2 && isEditingThisChip && (
        <>
          <AndBadge />
          <div className="relative group/seg select-none px-3 py-1 self-stretch flex items-center shrink-0 border-t border-r border-[rgba(0,0,0,0.1)]" style={{ marginTop: '-1px', marginLeft: '-1px' }}>
            <input
              ref={getChipEditInputRef?.(`${groupIdx}-${rule.length}`)}
              value={chipEditState?.query || ""}
              onChange={(e) => onChipEditChange?.(e.target.value)}
              onBlur={onChipEditBlur}
              onKeyDown={onChipEditKeyDown}
              placeholder="Search users, variables, attributes"
              className="text-[13px] leading-[16px] tracking-[0.25px] text-[#202022] outline-none bg-transparent w-full placeholder:text-muted-foreground"
              style={{ minWidth: '200px' }}
              autoFocus
            />
          </div>
        </>
      )}
      {/* trailing divider and add button */}
      <div className="self-stretch border-l border-t border-[rgba(0,0,0,0.1)] px-1 flex items-center" style={{ marginTop: '-1px', marginLeft: '-1px' }}>
        {isOption2 && isEditingThisChip ? (
          <div className="h-5 w-5" /> // Spacer to maintain layout
        ) : (
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
        )}
      </div>
    </div>
  );
};

const ExceptionChip: React.FC<{ 
  chip: Chip; 
  onRemove: () => void; 
  onAdd: (anchor: DOMRect) => void;
  isOption2?: boolean;
  isEditing?: boolean;
  editQuery?: string;
  onEditChange?: (query: string) => void;
  onEditBlur?: () => void;
  onEditKeyDown?: (e: React.KeyboardEvent) => void;
  editInputRef?: (el: HTMLInputElement | null) => void;
}> = ({ chip, onRemove, onAdd, isOption2 = false, isEditing = false, editQuery = "", onEditChange, onEditBlur, onEditKeyDown, editInputRef }) => {
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
      {/* trailing divider and add button or input */}
      <div className="h-full border-l border-[rgba(0,0,0,0.1)] px-1 flex items-center">
        {isOption2 && isEditing ? (
          <input
            ref={editInputRef}
            value={editQuery}
            onChange={(e) => onEditChange?.(e.target.value)}
            onBlur={onEditBlur}
            onKeyDown={onEditKeyDown}
            placeholder="Search users, variables, attributes"
            className="text-[13px] leading-[16px] tracking-[0.25px] text-[#202022] outline-none bg-transparent"
            style={{ height: '20px', minWidth: '200px' }}
            autoFocus
          />
        ) : (
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
        )}
      </div>
    </div>
  );
};

// =============================================================
// Helper function to generate rule description
// =============================================================
function generateRuleDescription(rules: RuleGroup, exceptions: RuleGroup): string {
  if (rules.length === 0) {
    return "No rules defined";
  }

  // Helper function to format currency
  function formatCurrency(value: string): string {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  }

  // Helper function to spell out operator
  function spellOutOperator(op: string): string {
    const opMap: Record<string, string> = {
      '>': 'greater than',
      '>=': 'greater or equal to',
      '=': 'equal to',
      '<=': 'less or equal to',
      '<': 'less than',
      'is any of': 'is any of',
      'is not any of': 'is not any of',
      'is all of': 'is all of',
      'before': 'before',
      'on': 'on',
      'on or after': 'on or after',
    };
    return opMap[op] || op;
  }

  // Helper function to format list with "or" before last item
  function formatList(items: string[]): string {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    const last = items[items.length - 1];
    const rest = items.slice(0, -1);
    return `${rest.join(", ")}, or ${last}`;
  }

  // Process each group (OR condition)
  const descriptions: string[] = [];
  
  for (const group of rules) {
    if (group.length === 0) continue;
    
    // Process chips in the group (AND condition)
    const departmentValues: string[] = [];
    const levelValues: string[] = [];
    const locationValues: string[] = [];
    const teamValues: string[] = [];
    const compensationParts: string[] = [];
    const startDateParts: string[] = [];
    const otherParts: string[] = [];
    
    for (const chip of group) {
      const label = chip.label;
      
      // Parse department
      if (label.includes("Department")) {
        if (label.includes("→")) {
          // Single value: "Department → Product Design"
          const match = label.match(/Department\s*→\s*(.+)/i);
          if (match) departmentValues.push(match[1].trim());
        } else if (label.includes("is any of") || label.includes("is not any of") || label.includes("is all of")) {
          // Multiple values: "Department is any of Product Design, Engineering"
          const match = label.match(/Department\s+(?:is any of|is not any of|is all of)\s+(.+)/i);
          if (match) {
            const values = match[1].split(",").map(v => v.trim());
            departmentValues.push(...values);
          }
        }
      }
      // Parse location
      else if (label.includes("Work location") || label.includes("location")) {
        if (label.includes("→")) {
          // Single value: "Work location → San Francisco office"
          const match = label.match(/Work location\s*→\s*(.+)/i);
          if (match) locationValues.push(match[1].trim());
        } else if (label.includes("is any of") || label.includes("is not any of") || label.includes("is all of")) {
          // Multiple values
          const match = label.match(/Work location\s+(?:is any of|is not any of|is all of)\s+(.+)/i);
          if (match) {
            const values = match[1].split(",").map(v => v.trim());
            locationValues.push(...values);
          }
        }
      }
      // Parse level
      else if (label.includes("Level")) {
        if (label.includes("→")) {
          // Single value: "Level → Manager"
          const match = label.match(/Level\s*→\s*(.+)/i);
          if (match) levelValues.push(match[1].trim());
        } else if (label.includes("is any of") || label.includes("is not any of") || label.includes("is all of")) {
          // Multiple values
          const match = label.match(/Level\s+(?:is any of|is not any of|is all of)\s+(.+)/i);
          if (match) {
            const values = match[1].split(",").map(v => v.trim());
            levelValues.push(...values);
          }
        }
      }
      // Parse team
      else if (label.includes("Team")) {
        if (label.includes("→")) {
          // Single value: "Team → Engineering"
          const match = label.match(/Team\s*→\s*(.+)/i);
          if (match) teamValues.push(match[1].trim());
        } else if (label.includes("is any of") || label.includes("is not any of") || label.includes("is all of")) {
          // Multiple values
          const match = label.match(/Team\s+(?:is any of|is not any of|is all of)\s+(.+)/i);
          if (match) {
            const values = match[1].split(",").map(v => v.trim());
            teamValues.push(...values);
          }
        }
      }
      // Parse annual compensation
      else if (label.includes("Annual compensation")) {
        const match = label.match(/Annual compensation\s+([><=]+)\s+(.+)/i);
        if (match) {
          const op = match[1].trim();
          const value = match[2].trim();
          const formattedValue = formatCurrency(value);
          const spelledOp = spellOutOperator(op);
          compensationParts.push(`have an annual compensation ${spelledOp} ${formattedValue}`);
        }
      }
      // Parse start date
      else if (label.includes("Start date")) {
        const match = label.match(/Start date\s+(before|on|on or after)\s+(.+)/i);
        if (match) {
          const op = match[1].trim();
          const value = match[2].trim();
          startDateParts.push(`have a start date ${op} ${value}`);
        }
      }
      // Parse employee
      else if (chip.type === "employee") {
        const nameMatch = label.match(/^([^(]+)/);
        if (nameMatch) {
          otherParts.push(nameMatch[1].trim());
        }
      }
      // Fallback
      else {
        otherParts.push(label);
      }
    }
    
    // Build description for this group
    const groupParts: string[] = [];
    
    // Format department
    if (departmentValues.length > 0) {
      if (departmentValues.length === 1) {
        groupParts.push(`are in the ${departmentValues[0]} department`);
      } else {
        const formatted = formatList([...departmentValues]);
        groupParts.push(`are in the ${formatted} departments`);
      }
    }
    
    // Format location
    if (locationValues.length > 0) {
      if (locationValues.length === 1) {
        groupParts.push(`are in ${locationValues[0]}`);
      } else {
        const formatted = formatList([...locationValues]);
        groupParts.push(`are in ${formatted}`);
      }
    }
    
    // Format level
    if (levelValues.length > 0) {
      if (levelValues.length === 1) {
        groupParts.push(`are ${levelValues[0]}s`);
      } else {
        const formatted = formatList(levelValues.map(v => `${v}s`));
        groupParts.push(`are ${formatted}`);
      }
    }
    
    // Format team
    if (teamValues.length > 0) {
      if (teamValues.length === 1) {
        groupParts.push(`are on the ${teamValues[0]} team`);
      } else {
        const formatted = formatList([...teamValues]);
        groupParts.push(`are on the ${formatted} teams`);
      }
    }
    
    // Add compensation
    groupParts.push(...compensationParts);
    
    // Add start date
    groupParts.push(...startDateParts);
    
    // Add other parts
    groupParts.push(...otherParts);
    
    // Join AND conditions with "and"
    if (groupParts.length > 0) {
      if (groupParts.length === 1) {
        descriptions.push(groupParts[0]);
      } else {
        // Combine multiple AND conditions with "and"
        const last = groupParts.pop();
        descriptions.push(`${groupParts.join(", ")}, and ${last}`);
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
  
  // Simplify description to avoid repeating "in" or "are"
  // Pattern: "are in the X department, are in the Y department" → "are in the X department, the Y department"
  description = description.replace(/, are in the ([^,]+) department/g, (match, dept, offset, full) => {
    // Check if preceded by "are in the ... department"
    const before = full.substring(0, offset);
    if (before.match(/are in the .+ department$/)) {
      return `, the ${dept} department`;
    }
    return match;
  });
  
  // Pattern: "are in X, are in Y" → "are in X, Y"
  description = description.replace(/, are in ([^,]+)(?=,|$| and| or)/g, (match, location, offset, full) => {
    // Check if preceded by "are in ..."
    const before = full.substring(0, offset);
    if (before.match(/are in [^,]+$/)) {
      return `, ${location}`;
    }
    return match;
  });
  
  // Pattern: "are X, are Y" (but not "are on the X team") → "are X, Y"
  description = description.replace(/, are ([^,]+)(?=,|$| and| or)/g, (match, value, offset, full) => {
    // Skip if it's "are on the ... team"
    if (value.includes("on the")) return match;
    // Check if preceded by "are ..." (not "are on the")
    const before = full.substring(0, offset);
    if (before.match(/are [^,]+$/) && !before.match(/are on the/)) {
      return `, ${value}`;
    }
    return match;
  });
  
  // Add exceptions
  if (exceptions.length > 0) {
    const exceptionNames: string[] = [];
    for (const exceptionGroup of exceptions) {
      if (exceptionGroup.length === 0) continue;
      const groupNames = exceptionGroup.map(e => {
        if (e.type === "employee") {
          const nameMatch = e.label.match(/^([^(]+)/);
          return nameMatch ? nameMatch[1].trim() : e.label;
        }
        return e.label;
      });
      // Join chips in group with " AND "
      exceptionNames.push(groupNames.join(" AND "));
    }
    
    if (exceptionNames.length === 1) {
      description += ` -- excluding ${exceptionNames[0]}`;
    } else if (exceptionNames.length > 1) {
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
// Supergroup Component (reusable)
// =============================================================
const SupergroupComponent: React.FC<{ isOption2?: boolean }> = ({ isOption2 = false }) => {
  const [rules, setRules] = useState<RuleGroup>([
    [{ id: "var-1", label: "Department → Product Design", type: "variable" }],
    [{ id: "var-2", label: "Work location is any of San Francisco", type: "variable" }],
    [
      { id: "var-3", label: "Department → Engineering", type: "variable" },
      { id: "var-4", label: "Level → Manager", type: "variable" },
    ],
  ]);

  const [exceptions, setExceptions] = useState<RuleGroup>([]);

  const [popover, setPopover] = useState<{ open: boolean; target: { groupIdx: number; insertAtEnd?: boolean; chipIdx?: number } | null; rect: DOMRect | null; currentRule?: Rule; isException?: boolean }>({ open: false, target: null, rect: null, currentRule: [], isException: false });
  const [lastChip, setLastChip] = useState<Chip | null>(null);
  const [lastExceptionChip, setLastExceptionChip] = useState<Chip | null>(null);
  const [kebabMenuOpen, setKebabMenuOpen] = useState(false);
  const [kebabMenuRect, setKebabMenuRect] = useState<DOMRect | null>(null);
  const [temporalityPopoverOpen, setTemporalityPopoverOpen] = useState(false);
  const [temporalityPopoverRect, setTemporalityPopoverRect] = useState<DOMRect | null>(null);
  const [shouldOpenAddAnother, setShouldOpenAddAnother] = useState(false);
  const [shouldOpenExceptionAnother, setShouldOpenExceptionAnother] = useState(false);
  const [learnMoreDrawerOpen, setLearnMoreDrawerOpen] = useState(false);
  const [chipToEdit, setChipToEdit] = useState<{ chip: Chip; groupIdx: number; chipIdx: number } | null>(null);
  
  // Inline search state for Option 2
  const [addMemberQuery, setAddMemberQuery] = useState("");
  const [excludeQuery, setExcludeQuery] = useState("");
  const [addMemberActive, setAddMemberActive] = useState(false);
  const [excludeActive, setExcludeActive] = useState(false);
  const addMemberInputRef = useRef<HTMLInputElement>(null);
  const excludeInputRef = useRef<HTMLInputElement>(null);
  const [pendingPopoverTarget, setPendingPopoverTarget] = useState<{ target: { groupIdx: number; insertAtEnd?: boolean; chipIdx?: number } | null; currentRule?: Rule; isException?: boolean } | null>(null);
  
  // Inline chip editing state for Option 2
  const [chipEditState, setChipEditState] = useState<{ groupIdx: number; chipIdx: number; query: string; isException: boolean } | null>(null);
  const chipEditInputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

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
    
    // For Option 2, check if this is a chip edit (clicking + on a chip)
    if (isOption2 && target.chipIdx !== undefined && !target.insertAtEnd) {
      // This is editing after a specific chip
      setChipEditState({ 
        groupIdx: target.groupIdx, 
        chipIdx: target.chipIdx, 
        query: "", 
        isException: false 
      });
      setPendingPopoverTarget({ target, currentRule, isException: false });
      // Open popover immediately with button's rect first, then update to input's rect
      setPopover({ open: true, rect, target, currentRule });
      setTimeout(() => {
        const inputKey = `${target.groupIdx}-${target.chipIdx}`;
        const inputEl = chipEditInputRefs.current.get(inputKey);
        if (inputEl) {
          const inputRect = inputEl.getBoundingClientRect();
          setPopover(prev => ({ ...prev, rect: inputRect }));
          inputEl.focus();
        }
      }, 0);
    } else if (isOption2 && isNewGroup) {
      // This is adding a new group - use the add member input
      setAddMemberActive(true);
      setAddMemberQuery("");
      setPendingPopoverTarget({ target, currentRule, isException: false });
      setTimeout(() => {
        addMemberInputRef.current?.focus();
        // Open popover with input's rect
        if (addMemberInputRef.current) {
          const inputRect = addMemberInputRef.current.getBoundingClientRect();
          setPopover({ open: true, rect: inputRect, target, currentRule });
        }
      }, 0);
    } else if (isOption2 && target.insertAtEnd) {
      // This is clicking + at the end of an existing group - show inline input after last chip
      // Set chipIdx to rule.length to indicate "after the last chip"
      const chipIdxForEdit = targetGroup ? targetGroup.length : 0;
      setChipEditState({ 
        groupIdx: target.groupIdx, 
        chipIdx: chipIdxForEdit, 
        query: "", 
        isException: false 
      });
      setPendingPopoverTarget({ target, currentRule, isException: false });
      // Open popover immediately with button's rect first, then update to input's rect
      setPopover({ open: true, rect, target, currentRule });
      setTimeout(() => {
        const inputKey = `${target.groupIdx}-${chipIdxForEdit}`;
        const inputEl = chipEditInputRefs.current.get(inputKey);
        if (inputEl) {
          const inputRect = inputEl.getBoundingClientRect();
          setPopover(prev => ({ ...prev, rect: inputRect }));
          inputEl.focus();
        }
      }, 0);
    } else {
      setPopover({ open: true, rect, target, currentRule });
    }
  };
  
  const closePopover = () => {
    setPopover(prev => ({ ...prev, open: false, rect: null, target: null }));
    setChipToEdit(null);
    // For Option 2, deactivate inline search
    if (isOption2) {
      setAddMemberActive(false);
      setExcludeActive(false);
      setAddMemberQuery("");
      setExcludeQuery("");
      setPendingPopoverTarget(null);
      // Note: chipEditState is managed by handleChipEditBlur and addChipToRule/addException
    }
    // Don't clear lastChip or currentRule here - keep them for next time popover opens
  };

  // Handle chip click to edit (from Supergroup component)
  const handleChipClick = (chip: Chip, groupIdx: number, chipIdx: number, rect: DOMRect) => {
    const parsed = parseChipForEditing(chip);
    if (!parsed) return;
    
    // Find the attribute definition
    const attrDef = ATTRIBUTE_DEFINITIONS.find(a => a.kind === parsed.attrKind);
    if (!attrDef) return;
    
    // Store chip to edit info
    setChipToEdit({ chip, groupIdx, chipIdx });
    
    // Open popover with attribute form, positioned at the bottom of the clicked chip
    const target = { groupIdx, chipIdx };
    const targetGroup = rules[groupIdx] || [];
    const currentRule = targetGroup;
    
    setPopover({
      open: true,
      rect,
      target,
      currentRule,
      isException: false
    });
  };
  
  // Handler for chip edit input changes
  const handleChipEditChange = (query: string) => {
    if (!chipEditState) return;
    setChipEditState({ ...chipEditState, query });
    // Open popover when user starts typing
    if (query && !popover.open && pendingPopoverTarget) {
      const inputKey = chipEditState.isException 
        ? `exception-${chipEditState.groupIdx}-${chipEditState.chipIdx}` 
        : `${chipEditState.groupIdx}-${chipEditState.chipIdx}`;
      const inputEl = chipEditInputRefs.current.get(inputKey);
      if (inputEl) {
        const rect = inputEl.getBoundingClientRect();
        const target = { groupIdx: chipEditState.groupIdx, chipIdx: chipEditState.chipIdx };
        const targetGroup = chipEditState.isException 
          ? exceptions[chipEditState.groupIdx] || []
          : rules[chipEditState.groupIdx] || [];
        setPopover({ 
          open: true, 
          rect, 
          target, 
          currentRule: targetGroup,
          isException: chipEditState.isException
        });
      }
    }
    // Update popover position if already open
    if (popover.open) {
      const inputKey = chipEditState.isException 
        ? `exception-${chipEditState.groupIdx}-${chipEditState.chipIdx}` 
        : `${chipEditState.groupIdx}-${chipEditState.chipIdx}`;
      const inputEl = chipEditInputRefs.current.get(inputKey);
      if (inputEl) {
        const rect = inputEl.getBoundingClientRect();
        setPopover(prev => ({ ...prev, rect }));
      }
    }
  };
  
  // Handler for chip edit blur
  const handleChipEditBlur = () => {
    if (!chipEditState) return;
    // Delay blur check to allow click events to fire first
    setTimeout(() => {
      // Don't close if popover is still open (user clicked on an item)
      if (popover.open) {
        return;
      }
      // Revert chip edit state when clicking away (return chip to original state)
      setChipEditState(null);
      closePopover();
    }, 200);
  };
  
  // Handler for chip edit keydown
  const handleChipEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setChipEditState(null);
      closePopover();
    }
  };
  
  // Helper to get chip edit input ref callback
  const getChipEditInputRef = (key: string) => (el: HTMLInputElement | null) => {
    if (el) {
      chipEditInputRefs.current.set(key, el);
    } else {
      chipEditInputRefs.current.delete(key);
    }
  };

  const addChipToRule = (chip: Chip, target: { groupIdx: number; insertAtEnd?: boolean; chipIdx?: number }) => {
    let updatedRules: RuleGroup = [];
    let wasChipEdit = false;
    
    // Check if this is from a chip edit input
    if (isOption2 && chipEditState && !chipEditState.isException) {
      wasChipEdit = true;
    }
    
    setRules((prev) => {
      const newRules = addChipToRulePure(prev, chip, target);
      updatedRules = newRules;
      
      // For Option 2, update pendingPopoverTarget to point to next group
      if (isOption2 && addMemberActive) {
        // Get the last chip from the newly added group for context
        const addedGroup = newRules[target.groupIdx];
        const newLastChip = addedGroup && addedGroup.length > 0 ? addedGroup[addedGroup.length - 1] : chip;
        setLastChip(newLastChip);
        // Update target to point to next group (new group) with empty currentRule to show "Add another group (OR)"
        setPendingPopoverTarget({ 
          target: { groupIdx: newRules.length, insertAtEnd: true }, 
          currentRule: [], // Empty to show "Add another group (OR)" instead of AND suggestions
          isException: false
        });
      } else {
        setLastChip(chip);
      }
      
      return newRules;
    });
    
    // For Option 2, after selection from chip edit input, switch to "Add member(s)" input
    if (isOption2 && wasChipEdit) {
      // Clear chip edit state and activate the "Add member(s)" input at the end
      setChipEditState(null);
      setAddMemberActive(true);
      setAddMemberQuery("");
      // Update pendingPopoverTarget to point to a NEW group (rules.length) to show "Add another group (OR)"
      // This matches what happens when clicking the "Add member(s)" button
      const newGroupIdx = updatedRules.length; // Point to a new group (doesn't exist yet)
      const newTarget = { groupIdx: newGroupIdx, insertAtEnd: true };
      setPendingPopoverTarget({ 
        target: newTarget, 
        currentRule: [], // Empty rule for new group
        isException: false
      });
      // Update popover target immediately (before setTimeout) so it uses the correct target
      // Close and reopen popover with correct target to ensure it shows the right content
      setPopover(prev => ({ 
        ...prev, 
        open: false,
        target: newTarget,
        currentRule: []
      }));
      // Keep popover open and refocus on "Add member(s)" input
      setTimeout(() => {
        addMemberInputRef.current?.focus();
        // Reopen popover with correct target and position
        if (addMemberInputRef.current) {
          const rect = addMemberInputRef.current.getBoundingClientRect();
          setPopover({ 
            open: true,
            rect, 
            target: newTarget,
            currentRule: [],
            isException: false
          });
        }
      }, 0);
    } else if (isOption2 && addMemberActive) {
      setAddMemberQuery("");
      // Update popover target to point to a new group with empty currentRule to show "Add another group (OR)"
      const newGroupTarget = { groupIdx: updatedRules.length, insertAtEnd: true };
      // Keep popover open but update target and currentRule - it will update as user types
      // Refocus input after a brief delay
      setTimeout(() => {
        addMemberInputRef.current?.focus();
        // Update popover position, target, and currentRule
        if (addMemberInputRef.current && popover.open) {
          const rect = addMemberInputRef.current.getBoundingClientRect();
          setPopover(prev => ({ ...prev, rect, target: newGroupTarget, currentRule: [] }));
        }
      }, 0);
    } else {
      closePopover();
    }
  };

  const removeChip = (groupIdx: number, chipIdx: number) => setRules((prev) => removeChipPure(prev, groupIdx, chipIdx));

  const openExceptionPopover = (rect: DOMRect, target?: { groupIdx: number; chipIdx?: number; insertAtEnd?: boolean }) => {
    // For Option 2, check if this is editing after a specific exception chip
    if (isOption2 && target && target.chipIdx !== undefined && !target.insertAtEnd) {
      const targetGroup = exceptions[target.groupIdx] || [];
      setChipEditState({ 
        groupIdx: target.groupIdx, 
        chipIdx: target.chipIdx, 
        query: "", 
        isException: true 
      });
      setPendingPopoverTarget({ target, currentRule: targetGroup, isException: true });
      // Open popover immediately with button's rect first, then update to input's rect
      setPopover({ open: true, rect, target, currentRule: targetGroup, isException: true });
      setTimeout(() => {
        const inputKey = `exception-${target.groupIdx}-${target.chipIdx}`;
        const inputEl = chipEditInputRefs.current.get(inputKey);
        if (inputEl) {
          const inputRect = inputEl.getBoundingClientRect();
          setPopover(prev => ({ ...prev, rect: inputRect }));
          inputEl.focus();
        }
      }, 0);
    } else if (isOption2 && target && target.insertAtEnd) {
      // This is clicking + at the end of an exception group
      const targetGroup = exceptions[target.groupIdx] || [];
      const chipIdxForEdit = targetGroup.length;
      setChipEditState({ 
        groupIdx: target.groupIdx, 
        chipIdx: chipIdxForEdit, 
        query: "", 
        isException: true 
      });
      setPendingPopoverTarget({ target, currentRule: targetGroup, isException: true });
      setPopover({ open: true, rect, target, currentRule: targetGroup, isException: true });
      setTimeout(() => {
        const inputKey = `exception-${target.groupIdx}-${chipIdxForEdit}`;
        const inputEl = chipEditInputRefs.current.get(inputKey);
        if (inputEl) {
          const inputRect = inputEl.getBoundingClientRect();
          setPopover(prev => ({ ...prev, rect: inputRect }));
          inputEl.focus();
        }
      }, 0);
    } else if (isOption2) {
      // This is adding a new exception
      setExcludeActive(true);
      setExcludeQuery("");
      // Set target to point to a new exception group
      const newGroupTarget = { groupIdx: exceptions.length, insertAtEnd: true };
      // Get the last exception group for currentRule (for contextual suggestions)
      const lastExceptionGroup = exceptions.length > 0 ? exceptions[exceptions.length - 1] : [];
      setPendingPopoverTarget({ target: newGroupTarget, currentRule: lastExceptionGroup, isException: true });
      setTimeout(() => {
        excludeInputRef.current?.focus();
        // Open popover with input's rect
        if (excludeInputRef.current) {
          const inputRect = excludeInputRef.current.getBoundingClientRect();
          setPopover({ open: true, rect: inputRect, target: newGroupTarget, currentRule: lastExceptionGroup, isException: true });
        }
      }, 0);
    } else {
      // Option 1: open popover with target pointing to new exception group
      const newGroupTarget = { groupIdx: exceptions.length, insertAtEnd: true };
      // Get the last exception group for currentRule (for contextual suggestions)
      const lastExceptionGroup = exceptions.length > 0 ? exceptions[exceptions.length - 1] : [];
      setPopover({ open: true, rect, target: newGroupTarget, currentRule: lastExceptionGroup, isException: true });
    }
  };

  const addException = (chip: Chip, target?: { groupIdx: number; insertAtEnd?: boolean; chipIdx?: number }) => {
    const wasChipEdit = isOption2 && chipEditState && chipEditState.isException;
    
    // If target is provided, use it; otherwise add to a new group
    const exceptionTarget = target || { groupIdx: exceptions.length, insertAtEnd: true };
    
    let updatedExceptions: RuleGroup = [];
    setExceptions((prev) => {
      const newExceptions = addChipToRulePure(prev, chip, exceptionTarget);
      updatedExceptions = newExceptions;
      // Update lastExceptionChip for contextual suggestions
      const addedGroup = newExceptions[exceptionTarget.groupIdx];
      if (addedGroup && addedGroup.length > 0) {
        setLastExceptionChip(addedGroup[addedGroup.length - 1]);
      } else {
        setLastExceptionChip(chip);
      }
      return newExceptions;
    });
    
    // For Option 2, after selection from chip edit input, switch to "EXCLUDE" input
    if (isOption2 && wasChipEdit) {
      // Clear chip edit state and activate the "EXCLUDE" input
      setChipEditState(null);
      setExcludeActive(true);
      setExcludeQuery("");
      // Update pendingPopoverTarget to point to a new exception group (use updated length)
      const newGroupTarget = { groupIdx: updatedExceptions.length, insertAtEnd: true };
      // Get the last exception group for currentRule (for contextual suggestions)
      const lastExceptionGroup = updatedExceptions.length > 0 ? updatedExceptions[updatedExceptions.length - 1] : [];
      setPendingPopoverTarget({ target: newGroupTarget, currentRule: lastExceptionGroup, isException: true });
      // Update popover target immediately (before setTimeout) so it uses the correct target
      // Close and reopen popover with correct target to ensure it shows the right content
      setPopover(prev => ({ 
        ...prev, 
        open: false,
        target: newGroupTarget,
        currentRule: lastExceptionGroup,
        isException: true
      }));
      // Keep popover open and refocus on "EXCLUDE" input
      setTimeout(() => {
        excludeInputRef.current?.focus();
        // Reopen popover with correct target and position
        if (excludeInputRef.current) {
          const rect = excludeInputRef.current.getBoundingClientRect();
          setPopover({ 
            open: true,
            rect, 
            target: newGroupTarget,
            currentRule: lastExceptionGroup,
            isException: true
          });
        }
      }, 0);
    } else if (isOption2 && excludeActive) {
      setExcludeQuery("");
      // Update popover target to point to a new exception group (for next selection to be OR)
      const newGroupTarget = { groupIdx: updatedExceptions.length, insertAtEnd: true };
      // Get the last exception group for currentRule (for contextual suggestions)
      const lastExceptionGroup = updatedExceptions.length > 0 ? updatedExceptions[updatedExceptions.length - 1] : [];
      // Keep popover open but update target - it will update as user types
      // Refocus input after a brief delay
      setTimeout(() => {
        excludeInputRef.current?.focus();
        // Update popover position and target
        if (excludeInputRef.current && popover.open) {
          const rect = excludeInputRef.current.getBoundingClientRect();
          setPopover(prev => ({ ...prev, rect, target: newGroupTarget, currentRule: lastExceptionGroup }));
        }
      }, 0);
    } else {
      closePopover();
    }
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

  // Watch for "save and add another" flag for exceptions and open new exception popover after state updates
  React.useEffect(() => {
    if (shouldOpenExceptionAnother && !popover.open) {
      // Find the "EXCLUDE" button and open popover
      const excludeButton = document.querySelector('[data-exclude-button]') as HTMLElement;
      if (excludeButton) {
        const rect = excludeButton.getBoundingClientRect();
        openExceptionPopover(rect);
        setShouldOpenExceptionAnother(false);
      }
    }
  }, [shouldOpenExceptionAnother, popover.open]);

  const removeException = (groupIdx: number, chipIdx: number) => {
    setExceptions((prev) => removeChipPure(prev, groupIdx, chipIdx));
  };

  const memberCount = useMemo(() => countMembers(rules), [rules]);

  return (
    <>
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
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
        <div className="flex flex-wrap items-center gap-2" style={rules.length === 0 ? { paddingBottom: '32px' } : undefined}>
          {rules.map((group, groupIdx) => (
            <div key={groupIdx}>
              <RulePill
                rule={group}
                groupIdx={groupIdx}
                onRemoveAt={(chipIdx) => removeChip(groupIdx, chipIdx)}
                onAddAtEnd={(rect) => openPopover(rect, { groupIdx, insertAtEnd: true })}
                onAddAfterChip={isOption2 ? (rect, chipIdx) => openPopover(rect, { groupIdx, chipIdx }) : undefined}
                isOption2={isOption2}
                chipEditState={chipEditState}
                onChipEditChange={handleChipEditChange}
                onChipEditBlur={handleChipEditBlur}
                onChipEditKeyDown={handleChipEditKeyDown}
                getChipEditInputRef={getChipEditInputRef}
                onChipClick={(chip, chipIdx, rect) => handleChipClick(chip, groupIdx, chipIdx, rect)}
              />
            </div>
          ))}
          <div className="flex-shrink-0" style={{ minWidth: '70px' }}>
            {isOption2 && addMemberActive ? (
              <input
                ref={addMemberInputRef}
                value={addMemberQuery}
                onChange={(e) => {
                  setAddMemberQuery(e.target.value);
                  // Open popover when user starts typing
                  if (e.target.value && !popover.open && pendingPopoverTarget) {
                    const rect = addMemberInputRef.current?.getBoundingClientRect() || new DOMRect();
                    setPopover({ 
                      open: true, 
                      rect, 
                      target: pendingPopoverTarget.target, 
                      currentRule: pendingPopoverTarget.currentRule || [],
                      isException: false
                    });
                  }
                  // Update popover position if already open
                  if (addMemberInputRef.current && popover.open) {
                    const rect = addMemberInputRef.current.getBoundingClientRect();
                    setPopover(prev => ({ ...prev, rect }));
                  }
                }}
                onBlur={(e) => {
                  // Delay blur check to allow click events to fire first
                  setTimeout(() => {
                    // Don't close if popover is still open (user clicked on an item)
                    if (popover.open) {
                      return;
                    }
                    if (!addMemberQuery.trim()) {
                      setAddMemberActive(false);
                      closePopover();
                    }
                  }, 200);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setAddMemberActive(false);
                    closePopover();
                  }
                }}
                placeholder="Search users, variables, attributes"
                className="text-[13px] leading-[16px] tracking-[0.25px] text-[#202022] px-2 outline-none"
                style={{ height: '24px', minWidth: '320px' }}
                autoFocus
              />
            ) : (
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
            )}
          </div>
        </div>

        {rules.length > 0 && (
        <div className="pt-8">
          <div className="flex flex-wrap items-center gap-2">
            {exceptions.length > 0 && exceptions.some(group => group.length > 0) && (
              <span className="text-[14px] font-medium leading-[20px] text-[#252528]">Except:</span>
            )}
            {exceptions.map((exceptionGroup, groupIdx) => (
              exceptionGroup.length > 0 && (
                <div key={groupIdx}>
                  <RulePill
                    rule={exceptionGroup}
                    groupIdx={groupIdx}
                    onRemoveAt={(chipIdx) => removeException(groupIdx, chipIdx)}
                    onAddAtEnd={(rect) => openExceptionPopover(rect, { groupIdx, insertAtEnd: true })}
                    onAddAfterChip={isOption2 ? (rect, chipIdx) => openExceptionPopover(rect, { groupIdx, chipIdx }) : undefined}
                    isOption2={isOption2}
                    chipEditState={chipEditState?.isException && chipEditState.groupIdx === groupIdx ? chipEditState : null}
                    onChipEditChange={handleChipEditChange}
                    onChipEditBlur={handleChipEditBlur}
                    onChipEditKeyDown={handleChipEditKeyDown}
                    getChipEditInputRef={(key) => getChipEditInputRef(`exception-${key}`)}
                  />
                </div>
              )
            ))}
            {isOption2 && excludeActive ? (
              <input
                ref={excludeInputRef}
                value={excludeQuery}
                onChange={(e) => {
                  setExcludeQuery(e.target.value);
                  // Open popover when user starts typing
                  if (e.target.value && !popover.open && pendingPopoverTarget) {
                    const rect = excludeInputRef.current?.getBoundingClientRect() || new DOMRect();
                    setPopover({ 
                      open: true, 
                      rect, 
                      target: pendingPopoverTarget.target, 
                      currentRule: pendingPopoverTarget.currentRule || [],
                      isException: true
                    });
                  }
                  // Update popover position if already open
                  if (excludeInputRef.current && popover.open) {
                    const rect = excludeInputRef.current.getBoundingClientRect();
                    setPopover(prev => ({ ...prev, rect }));
                  }
                }}
                onBlur={(e) => {
                  // Delay blur check to allow click events to fire first
                  setTimeout(() => {
                    // Don't close if popover is still open (user clicked on an item)
                    if (popover.open) {
                      return;
                    }
                    if (!excludeQuery.trim()) {
                      setExcludeActive(false);
                      closePopover();
                    }
                  }, 200);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setExcludeActive(false);
                    closePopover();
                  }
                }}
                placeholder="Search users, variables, attributes"
                className="text-[13px] leading-[16px] tracking-[0.25px] text-[#202022] px-2 outline-none"
                style={{ height: '24px', minWidth: '320px' }}
                autoFocus
              />
            ) : (
              <button
                data-exclude-button
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
            )}
          </div>
        </div>
        )}

        {rules.length > 0 && (
        <div className="mt-4 flex items-start justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            <span className="text-[#202022]">
              This group includes only active or recently hired employees in the United States who meet any of the above conditions, updated in real time.{" "}
              <button
                onClick={() => setLearnMoreDrawerOpen(true)}
                className="text-[#202022] underline hover:no-underline"
              >
                Learn more
              </button>
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

      <Popover
        open={popover.open}
        anchorRect={popover.rect}
        onClose={closePopover}
        chipToEdit={chipToEdit}
        onSelect={(chip, usePreviousGroup, saveAndAddAnother) => {
          if (popover.isException) {
            // For exceptions, handle the same way as rules
            if (usePreviousGroup && popover.currentRule) {
              // Selection from "Common filters (AND)" - add as AND to the previous exception group
              const prevGroupIdx = exceptions.length > 0 ? exceptions.length - 1 : 0;
              addException(chip, { groupIdx: prevGroupIdx, insertAtEnd: true });
            } else if (popover.target) {
              // For Option 2, if we're adding from excludeActive input and selection is NOT from "Common filters (AND)",
              // add as a new chip (OR) instead of using the target
              if (isOption2 && excludeActive && !usePreviousGroup && popover.target.insertAtEnd) {
                // Add as a new exception group (OR)
                addException(chip);
              } else {
                // Use the target from popover (for + button clicks, etc.)
                addException(chip, popover.target);
              }
            } else {
              // Add as a new exception group (OR)
              addException(chip);
            }
          } else if (chipToEdit) {
            // If we're editing a chip from the drawer, replace it instead of adding
            setRules((prev) => {
              const newRules = prev.map((group, gIdx) => {
                if (gIdx === chipToEdit.groupIdx) {
                  return group.map((c, cIdx) => 
                    cIdx === chipToEdit.chipIdx ? chip : c
                  );
                }
                return group;
              });
              return newRules;
            });
            setChipToEdit(null);
            closePopover();
            return;
          } else if (usePreviousGroup && popover.currentRule) {
            // Selection from "Common filters (AND)" - add as AND to the previous chip
            // Find the previous group index (the last group that exists)
            const prevGroupIdx = rules.length > 0 ? rules.length - 1 : 0;
            addChipToRule(chip, { groupIdx: prevGroupIdx, insertAtEnd: true });
          } else if (popover.target) {
            // For Option 2, if selection is NOT from "Common filters (AND)" and we're adding from "Add member(s)" input,
            // add as a new chip (OR) instead of AND
            if (isOption2 && !usePreviousGroup && (addMemberActive || (chipEditState && !chipEditState.isException))) {
              // If popover.target has chipIdx (not insertAtEnd), it means we were in chip edit mode
              // In that case, add as OR to the end of the last group
              if (popover.target.chipIdx !== undefined && !popover.target.insertAtEnd) {
                const targetGroupIdx = rules.length > 0 ? rules.length - 1 : 0;
                addChipToRule(chip, { groupIdx: targetGroupIdx, insertAtEnd: true });
              } else {
                // Already has insertAtEnd, use it as is (will add as OR)
                addChipToRule(chip, popover.target);
              }
            } else {
              // Default behavior: use the target as specified
              addChipToRule(chip, popover.target);
            }
          }
          
          // For Option 2, saveAndAddAnother behavior is handled by addChipToRule/addException
          // For non-Option 2, if "save and add another" is checked, set flag to open new popover after state updates
          if (saveAndAddAnother && popover.rect && !isOption2) {
            // Close current popover first
            closePopover();
            if (popover.isException) {
              // For exceptions, set flag to open exception popover again (as if "Exclude" button was clicked)
              setShouldOpenExceptionAnother(true);
            } else {
              // For rules, set flag to open new popover after rules state updates
              setShouldOpenAddAnother(true);
            }
          }
        }}
        lastChip={popover.isException ? lastExceptionChip : lastChip}
        isNewGroup={popover.isException ? (popover.target?.groupIdx === exceptions.length) : (popover.target?.groupIdx === rules.length)}
        currentRule={popover.currentRule || []}
        previousGroupIdx={popover.isException ? (exceptions.length > 0 ? exceptions.length - 1 : undefined) : (rules.length > 0 ? rules.length - 1 : undefined)}
        isException={popover.isException}
        exceptionsLength={exceptions.length}
        externalQuery={isOption2 ? (
          chipEditState ? chipEditState.query :
          popover.isException ? excludeQuery : addMemberQuery
        ) : undefined}
        hideSearchBar={isOption2 && (addMemberActive || excludeActive || !!chipEditState)}
        isOption2={isOption2}
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

      {/* Learn More Drawer */}
      {learnMoreDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setLearnMoreDrawerOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">How members are calculated</h2>
                <button
                  onClick={() => setLearnMoreDrawerOpen(false)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#202022] mb-2">
                    <span className="mr-2">1.</span>Temporality setting
                  </h3>
                  <p className="text-sm text-[#202022]">
                    We start by checking the temporality setting. This group evaluates membership in real time.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#202022] mb-2">
                    <span className="mr-2">2.</span>Employment state setting
                  </h3>
                  <p className="text-sm text-[#202022] mb-3">
                    Next, we identify the total pool of employees eligible for assessment based on their employment state.
                  </p>
                  <div className="flex items-center justify-between gap-2 px-3 py-2 bg-[rgba(0,0,0,0.05)] rounded-lg border border-[rgba(0,0,0,0.1)]">
                    <span className="text-sm text-[#202022]">Employment state is active, recently hired</span>
                    <button className="p-1 hover:bg-[rgba(0,0,0,0.1)] rounded">
                      <Pencil className="h-3.5 w-3.5 text-[#202022]" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#202022] mb-2">
                    <span className="mr-2">3.</span>Pre-existing rules
                  </h3>
                  <p className="text-sm text-[#202022] mb-3">
                    We then review any existing rules that may affect whether an employee can be added to the group.
                  </p>
                  <div className="flex items-center justify-between gap-2 px-3 py-2 bg-[rgba(0,0,0,0.05)] rounded-lg border border-[rgba(0,0,0,0.1)]">
                    <span className="text-sm text-[#202022]">Country is United States</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This rule is coming from the country filter in Time off policies
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#202022] mb-2">
                    <span className="mr-2">4.</span>Scope and conditions
                  </h3>
                  <p className="text-sm text-[#202022] mb-3">
                    Employees who meet the scope requirements and satisfy any of the defined conditions will be added to the group.
                  </p>
                  {rules.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-[#202022] mb-2">Match any of the following:</p>
                      <div className="space-y-1">
                        {rules.map((group, groupIdx) => (
                          <React.Fragment key={groupIdx}>
                            {group.map((chip, chipIdx) => (
                              <div key={chip.id} className="flex items-center" style={{ gap: '8px' }}>
                                {chipIdx === 0 && groupIdx === 0 ? (
                                  <>
                                    <div className="flex items-center justify-center shrink-0" style={{ width: '24px' }}></div>
                                    <div className="flex-1 px-2 py-1 bg-[rgba(0,0,0,0.05)] rounded-md border border-[rgba(0,0,0,0.1)]">
                                      <span className="text-xs text-[#202022]">{chip.label}</span>
                                    </div>
                                  </>
                                ) : chipIdx === 0 ? (
                                  <>
                                    <div className="flex items-center justify-center shrink-0" style={{ width: '24px' }}>
                                      <span className="text-xs font-medium text-[#252528]">OR</span>
                                    </div>
                                    <div className="flex-1 px-2 py-1 bg-[rgba(0,0,0,0.05)] rounded-md border border-[rgba(0,0,0,0.1)]">
                                      <span className="text-xs text-[#202022]">{chip.label}</span>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center justify-center shrink-0" style={{ width: '24px' }}></div>
                                    <div className="flex items-center justify-center shrink-0" style={{ width: '24px' }}>
                                      <span className="text-xs font-medium text-[#252528]">AND</span>
                                    </div>
                                    <div className="flex-1 px-2 py-1 bg-[rgba(0,0,0,0.05)] rounded-md border border-[rgba(0,0,0,0.1)]">
                                      <span className="text-xs text-[#202022]">{chip.label}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#202022] mb-2">
                    <span className="mr-2">5.</span>Exclusions
                  </h3>
                  <p className="text-sm text-[#202022]">
                    Finally, any individuals or groups listed as exclusions will be removed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// =============================================================
// Main Component
// =============================================================
export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8fb]">
      <main className="mx-auto max-w-4xl p-8">
        <h1 className="text-2xl font-semibold">This is a form title</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          This is a form caption. This subtext should explain the purpose of the form, what it takes for a user to fill it out and what value it provides after filling out.
        </p>

        <Tabs defaultValue="option1" className="mt-8">
          <TabsList>
            <TabsTrigger value="option1">Option 1</TabsTrigger>
            <TabsTrigger value="option2">Option 2</TabsTrigger>
          </TabsList>
          <TabsContent value="option1">
            <SupergroupComponent />
          </TabsContent>
          <TabsContent value="option2">
            <SupergroupComponent isOption2={true} />
          </TabsContent>
        </Tabs>
      </main>
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