"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteChore } from "@/app/(parent)/parent/actions";
import { EditChoreForm } from "@/components/chores/EditChoreForm";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  RewardPill,
} from "@/components/ui/Card";
import { FormMessage } from "@/components/ui/FormField";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { FamilyChoreLibraryItem } from "@/lib/family-chore-library-types";
import { ChoreStatus } from "@/lib/constants/statuses";

export interface ChoreLibraryRowProps {
  chore: FamilyChoreLibraryItem;
}

export function ChoreLibraryRow({ chore }: ChoreLibraryRowProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditable = chore.status === ChoreStatus.AVAILABLE;

  function handleEditClick() {
    setConfirmDelete(false);
    setError(null);
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
  }

  function handleSaved() {
    setIsEditing(false);
    router.refresh();
  }

  function handleDeleteClick() {
    setError(null);
    setConfirmDelete(true);
  }

  function handleCancelDelete() {
    setConfirmDelete(false);
  }

  function handleConfirmDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteChore(chore.id);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setConfirmDelete(false);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <p className="font-medium">{chore.name}</p>
          {chore.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{chore.description}</p>
          ) : null}
        </CardTitle>
        <RewardPill amount={chore.reward} />
      </CardHeader>
      <CardContent>
        <StatusBadge type="chore" status={chore.status} paid={chore.paid} />
      </CardContent>
      {isEditable && !isEditing ? (
        <CardFooter>
          <Button type="button" variant="secondary" size="sm" onClick={handleEditClick}>
            Edit
          </Button>
          <Button type="button" variant="danger" size="sm" onClick={handleDeleteClick}>
            Delete
          </Button>
        </CardFooter>
      ) : null}
      {confirmDelete ? (
        <CardContent>
          <p className="text-sm font-medium">Delete this chore?</p>
          <div className="mt-3 flex flex-col gap-2">
            <Button
              type="button"
              variant="danger"
              size="sm"
              disabled={isPending}
              onClick={handleConfirmDelete}
            >
              {isPending ? "Deleting…" : "Yes, delete"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isPending}
              onClick={handleCancelDelete}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      ) : null}
      {error ? (
        <CardContent>
          <FormMessage variant="error">{error}</FormMessage>
        </CardContent>
      ) : null}
      {isEditing ? (
        <CardContent>
          <EditChoreForm chore={chore} onCancel={handleCancelEdit} onSaved={handleSaved} />
        </CardContent>
      ) : null}
    </Card>
  );
}
