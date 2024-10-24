import { Card } from "@/components/ui/card";

export default function ColorShowcase() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-foreground text-3xl font-bold mb-8">
        Color System Showcase
      </h1>

      {/* Background Colors */}
      <section className="space-y-4">
        <h2 className="text-foreground text-2xl font-semibold">Background Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="bg-background p-4 rounded border border-border">
              <code className="text-muted-foreground">bg-background</code>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="bg-card p-4 rounded border border-border">
              <code className="text-muted-foreground">bg-card</code>
            </div>
          </Card>

          <Card className="p-4">
            <div className="bg-primary p-4 rounded">
              <code className="text-primary-foreground">bg-primary</code>
            </div>
          </Card>

          <Card className="p-4">
            <div className="bg-secondary p-4 rounded">
              <code className="text-secondary-foreground">bg-secondary</code>
            </div>
          </Card>

          <Card className="p-4">
            <div className="bg-muted p-4 rounded">
              <code className="text-muted-foreground">bg-muted</code>
            </div>
          </Card>

          <Card className="p-4">
            <div className="bg-accent p-4 rounded">
              <code className="text-accent-foreground">bg-accent</code>
            </div>
          </Card>
        </div>
      </section>

      {/* Text Colors */}
      <section className="space-y-4">
        <h2 className="text-foreground text-2xl font-semibold">Text Colors & Styles</h2>
        <Card className="p-6 space-y-6">
          {/* Heading Styles */}
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Heading 1 Style</h1>
              <code className="text-muted-foreground">text-4xl font-bold text-foreground</code>
            </div>

            <div>
              <h2 className="text-3xl font-semibold text-foreground">Heading 2 Style</h2>
              <code className="text-muted-foreground">text-3xl font-semibold text-foreground</code>
            </div>

            <div>
              <h3 className="text-2xl font-medium text-foreground">Heading 3 Style</h3>
              <code className="text-muted-foreground">text-2xl font-medium text-foreground</code>
            </div>

            <div>
              <h4 className="text-xl text-foreground">Heading 4 Style</h4>
              <code className="text-muted-foreground">text-xl text-foreground</code>
            </div>
          </div>

          {/* Regular Text Colors */}
          <div className="space-y-4">
            <div>
              <span className="text-foreground">text-foreground</span>
              <code className="ml-4 text-muted-foreground">text-foreground</code>
            </div>

            <div>
              <span className="text-primary">text-primary</span>
              <code className="ml-4 text-muted-foreground">text-primary</code>
            </div>

            <div>
              <span className="text-secondary-foreground">text-secondary-foreground</span>
              <code className="ml-4 text-muted-foreground">text-secondary-foreground</code>
            </div>

            <div>
              <span className="text-muted-foreground">text-muted-foreground</span>
              <code className="ml-4 text-muted-foreground">text-muted-foreground</code>
            </div>

            <div>
              <span className="text-accent-foreground">text-accent-foreground</span>
              <code className="ml-4 text-muted-foreground">text-accent-foreground</code>
            </div>
          </div>
        </Card>
      </section>

      {/* Interactive Elements */}
      <section className="space-y-4">
        <h2 className="text-foreground text-2xl font-semibold">Interactive Elements</h2>
        <Card className="p-6 space-y-6">
          {/* Buttons */}
          <div className="space-y-4">
            <div className="space-y-2">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
                Primary Button
              </button>
              <code className="block text-muted-foreground">
                bg-primary text-primary-foreground
              </code>
            </div>

            <div className="space-y-2">
              <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded">
                Secondary Button
              </button>
              <code className="block text-muted-foreground">
                bg-secondary text-secondary-foreground
              </code>
            </div>

            <div className="space-y-2">
              <button className="bg-accent text-accent-foreground px-4 py-2 rounded">
                Accent Button
              </button>
              <code className="block text-muted-foreground">
                bg-accent text-accent-foreground
              </code>
            </div>

            <div className="space-y-2">
              <button className="bg-destructive text-destructive-foreground px-4 py-2 rounded">
                Destructive Button
              </button>
              <code className="block text-muted-foreground">
                bg-destructive text-destructive-foreground
              </code>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-foreground text-xl font-medium">Links</h3>
            
            <div className="space-y-2">
              <a href="#" className="text-primary hover:text-primary/80 underline">
                Primary Link
              </a>
              <code className="block text-muted-foreground">
                text-primary hover:text-primary/80 underline
              </code>
            </div>

            <div className="space-y-2">
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                Default Link with Hover
              </a>
              <code className="block text-muted-foreground">
                text-foreground hover:text-primary transition-colors
              </code>
            </div>

            <div className="space-y-2">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Muted Link
              </a>
              <code className="block text-muted-foreground">
                text-muted-foreground hover:text-foreground transition-colors
              </code>
            </div>
          </div>
        </Card>
      </section>

      {/* Common Patterns */}
      <section className="space-y-4">
        <h2 className="text-foreground text-2xl font-semibold">Common Patterns</h2>
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="border border-border p-4 rounded">
              Border Example
            </div>
            <code className="block text-muted-foreground">
              border border-border
            </code>
          </div>

          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Input Example" 
              className="border border-input bg-background text-foreground p-2 rounded w-full"
            />
            <code className="block text-muted-foreground">
              border border-input bg-background text-foreground
            </code>
          </div>

          <div className="space-y-2">
            <div className="bg-muted p-4 rounded">
              <p className="text-muted-foreground">Muted Text Section</p>
            </div>
            <code className="block text-muted-foreground">
              bg-muted text-muted-foreground
            </code>
          </div>
        </Card>
      </section>

      {/* Chart Colors */}
      <section className="space-y-4">
        <h2 className="text-foreground text-2xl font-semibold">Chart Colors</h2>
        <Card className="p-6 space-y-6">
          {/* Color Squares */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="space-y-2">
                <div className={`bg-chart-${num} h-20 rounded`}></div>
                <code className="text-muted-foreground block text-center">
                  bg-chart-{num}
                </code>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}