import Link from 'next/link';

export default function IntroductionDisplay() {
  return (
    <div className="border p-4 bg-card rounded mb-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to Improve</h1>
      <p className="mb-4">
        Improve is a platform for creators to share work, receive valuable feedback, and grow together through constructive criticism.
      </p>
      <ul className="list-disc pl-5 mb-4">
        <li>Share your creative work</li>
        <li>Receive thoughtful, constructive feedback</li>
        <li>Help others refine their craft</li>
      </ul>
          <Link href="/how-to-critique" className="text-accent-foreground hover:underline">
        Learn why good feedback matters
      </Link>
    </div>
  );
}