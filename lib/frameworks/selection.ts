import {
  FRAMEWORK_TILE_DATA,
  MAX_PROFESSIONAL_ADDITIONAL,
  NIST_FRAMEWORK_ID,
  type FrameworkPlan,
} from "@/lib/frameworks/library";

/**
 * Whether a framework can be toggled (selected or deselected) given the
 * current selection and plan tier. NIST is always locked. Essential plans
 * cannot toggle anything except NIST (which stays locked). Professional
 * plans can toggle up to MAX_PROFESSIONAL_ADDITIONAL frameworks beyond NIST.
 */
export function canSelectFramework(
  frameworkId: string,
  currentSelection: ReadonlyArray<string>,
  plan: FrameworkPlan,
): boolean {
  if (frameworkId === NIST_FRAMEWORK_ID) return false;
  if (plan === "essential") return false;
  if (currentSelection.includes(frameworkId)) return true;

  const additionalCount = currentSelection.filter((id) => id !== NIST_FRAMEWORK_ID).length;
  return additionalCount < MAX_PROFESSIONAL_ADDITIONAL;
}

/**
 * The "tile state" used by FrameworkTile. Captures every visual variant in a
 * single switch so the tile component stays declarative.
 */
export type FrameworkTileState =
  | "selected"
  | "unselected"
  | "locked"
  | "disabled"
  | "disabled-essential";

export function deriveTileState(
  frameworkId: string,
  currentSelection: ReadonlyArray<string>,
  plan: FrameworkPlan,
): FrameworkTileState {
  const tile = FRAMEWORK_TILE_DATA.find((f) => f.id === frameworkId);
  if (!tile) return "unselected";
  if (tile.locked) return "locked";

  if (plan === "essential") return "disabled-essential";

  const isSelected = currentSelection.includes(frameworkId);
  if (isSelected) return "selected";

  const additionalCount = currentSelection.filter((id) => id !== NIST_FRAMEWORK_ID).length;
  if (additionalCount >= MAX_PROFESSIONAL_ADDITIONAL) return "disabled";

  return "unselected";
}
