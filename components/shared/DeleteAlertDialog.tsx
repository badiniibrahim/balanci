/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  entityType: string;
  setOpen: (value: boolean) => void;
  entityName: string;
  entityId: number;
  deleteMutation: UseMutationResult<any, unknown, number>;
};

export function DeleteAlertDialog({
  open,
  entityType,
  setOpen,
  entityName,
  entityId,
  deleteMutation,
}: Props) {
  const [confirmText, setConfirmText] = useState<string>("");

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {`This action cannot be undone. This will permanently delete your
            ${entityType} and remove your data from our servers.`}
            <div className="flex flex-col gap-2">
              <span>
                If you are sure, enter, <b>{entityName}</b> to confirm:
              </span>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={confirmText !== entityName || deleteMutation.isPending}
            onClick={(e) => {
              e.stopPropagation();
              toast.loading("Deleting income...", { id: entityId });
              deleteMutation.mutate(entityId);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
