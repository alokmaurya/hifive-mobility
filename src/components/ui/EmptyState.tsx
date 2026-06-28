interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ emoji = "🗺️", title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="text-5xl mb-4">{emoji}</div>
      <p className="text-base font-semibold text-white mb-1">{title}</p>
      {description && <p className="text-sm text-zinc-500 mb-5">{description}</p>}
      {action}
    </div>
  );
}
