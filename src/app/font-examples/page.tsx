import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const fonts = [
  { name: 'Lilita One', className: 'font-headline', style: {} },
  { name: 'Fredoka One', className: 'font-fredoka', style: {} },
  { name: 'Nunito', className: 'font-nunito', style: {} },
  { name: 'Lobster', className: 'font-lobster', style: {} },
  { name: 'Pacifico', className: 'font-pacifico', style: {} },
  { name: 'Comfortaa', className: 'font-comfortaa', style: {} },
];

export default function FontExamplesPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-brand font-bold text-primary">Font Examples</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Here are some fun and bubbly font options for your site.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {fonts.map((font) => (
          <Card key={font.name}>
            <CardHeader>
              <CardTitle className="text-2xl">{font.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${font.className} text-4xl truncate`} style={font.style}>
                Willow Wind Warbler
              </p>
              <p className={`${font.className} text-lg mt-4`} style={font.style}>
                The quick brown fox jumps over the lazy dog.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
