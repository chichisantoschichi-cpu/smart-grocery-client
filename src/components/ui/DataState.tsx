import type { ReactNode } from "react";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";

interface DataStateProps {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRetry?: () => void;
  children: ReactNode;
}

export default function DataState({
  loading = false,
  error = null,
  empty = false,
  emptyTitle = "No data found",
  emptyDescription = "There is nothing to display yet.",
  onRetry,
  children,
}: DataStateProps) {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (empty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return <>{children}</>;
}
