import { requireRole } from '@/lib/auth';
import { ProductForm } from '@/components/product-form';
export default async function NewProduct(){await requireRole(['admin','manager']);return <main className="dash-content"><div className="inner-heading"><span className="section-kicker">CATALOG / NEW OBJECT</span><h1>Add something <em>lovely.</em></h1><p>Bring a new piece into the collection.</p></div><div className="dash-card form-panel"><ProductForm/></div></main>}
