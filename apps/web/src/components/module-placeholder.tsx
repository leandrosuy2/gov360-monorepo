import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gov360/ui";

interface ModulePlaceholderProps {
  title: string;
  description: string;
  features: string[];
}

export function ModulePlaceholder({ title, description, features }: ModulePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Funcionalidades planejadas</CardTitle>
          <CardDescription>Este módulo faz parte da arquitetura GOV360</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        Módulo em desenvolvimento — estrutura de banco de dados e API já preparadas.
      </div>
    </div>
  );
}
