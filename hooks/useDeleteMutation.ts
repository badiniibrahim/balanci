import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type DeleteFunction = (id: number) => Promise<void>;

export function useDeleteMutation(
  entityType: string,
  deleteFn: DeleteFunction
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFn,
    onSuccess: (_, id) => {
      toast.success(`${entityType} deleted successfully`, { id });
      queryClient.invalidateQueries({ queryKey: ["fetchIncome"] });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
