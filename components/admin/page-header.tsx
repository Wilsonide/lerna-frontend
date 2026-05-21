interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight text-brand-black">
        {title}
      </h1>

      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
