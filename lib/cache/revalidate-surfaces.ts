import { revalidatePath } from "next/cache";

import { getChildBoardPath, getLegacyChildBoardPath } from "@/lib/auth/child-auth-paths";
import {
  getLegacyParentDashboardPath,
  getParentDashboardPath,
} from "@/lib/auth/parent-auth-paths";

/** Invalidate parent dashboard at canonical and legacy paths. */
export function revalidateParentDashboard(slug: string): void {
  revalidatePath(getParentDashboardPath({ slug }));
  revalidatePath(getLegacyParentDashboardPath());
}

/** Invalidate child board at canonical and legacy paths. */
export function revalidateChildBoard(slug: string): void {
  revalidatePath(getChildBoardPath({ slug }));
  revalidatePath(getLegacyChildBoardPath());
}

/** Invalidate all child surfaces when parent actions affect kid data. */
export function revalidateChildSurfaces(): void {
  revalidatePath(getLegacyChildBoardPath());
  revalidatePath("/child", "layout");
}
