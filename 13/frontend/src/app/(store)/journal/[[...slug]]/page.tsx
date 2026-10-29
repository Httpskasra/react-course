import Link from "next/link";
export default async function Journal({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  return (
    <main className="container state-page">
      <span className="section-kicker">OUR JOURNAL</span>
      <h1>{slug?.join(" / ") || "Notes on beautiful living"}</h1>
      <p>Optional catch-all route example.</p>
      <Link href="/shop" className="btn btn-primary">
        Explore collection
      </Link>
    </main>
  );
}
