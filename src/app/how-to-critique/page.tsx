import { Card, CardContent, CardTitle } from "@/src/components/ui/card";

export default function HowToCritiquePage() {
  return (
    <Card className="container mx-auto px-4 py-8">
      <CardTitle>
        <h1 className="text-2xl font-bold mb-6">How to give constructive critique</h1>
      </CardTitle>
      <CardContent>
        <section id="why-feedback-matters" className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Why Feedback Matters</h2>
          <p className="mb-6">
            Feedback is a powerful tool for growth and improvement. It provides valuable insights that can help refine skills, enhance performance, and drive innovation.
          </p>
          <h3 className="text-xl font-semibold mb-2">Benefits of quality Feedback:</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>Highlights both strengths and areas for improvement</li>
            <li>Motivates and drives continuous learning</li>
            <li>Enhances performance and decision-making</li>
            <li>Fosters communication and understanding</li>
            <li>Contributes to personal and professional growth</li>
          </ul>
        </section>

        <section id="how-to-give-good-feedback" className="mb-8">
          <h2 className="text-xl font-semibold mb-2">So how to give good feedback?</h2>
          <h3 className="text-lg font-semibold">1. Be specific and constructive</h3>
          <p className="mb-4">Instead of general comments, provide specific examples and suggestions for improvement.</p>
          <h3 className="text-lg font-semibold">2. Balance positive and negative feedback</h3>
          <p className="mb-4">Highlight what works well along with areas for improvement.</p>
          <h3 className="text-lg font-semibold">3. Be respectful and professional</h3>
          <p className="mb-4">Frame your critique in a way that is helpful and encouraging, not dismissive or harsh.</p>
          <h3 className="text-lg font-semibold">4. Consider the artist&apos;s intent</h3>
          <p className="mb-4">Try to understand the goals of the track and evaluate it in that context.</p>
          <h3 className="text-lg font-semibold">5. Provide actionable advice</h3>
          <p className="mb-4">Provide actionable advice to help the artist achieve their goals.</p>
        </section>
      </CardContent>
    </Card>
  );
}