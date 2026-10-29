import Link from "next/link";
export default async function Collection({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return (
    <main className="container state-page">
      <span className="section-kicker">
        CURATED STORIES / {slug.join(" / ").toUpperCase()}
      </span>
      <h1>
        Design for <em>living.</em>
      </h1>
      <p>
        Beautifully considered objects for a quieter, more meaningful everyday.
      </p>
      <Link href="/shop" className="btn btn-primary">
        Browse the collection →
      </Link>
    </main>
  );
}
