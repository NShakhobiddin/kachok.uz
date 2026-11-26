import { SiteProvider } from './data';
import { Landing } from './Landing';
import type { SiteData } from './model';
import { Privacy } from './Privacy';

export type Page = 'index' | 'maxfiylik';

export function App({ page, data }: { page: Page; data: SiteData }) {
  return <SiteProvider data={data}>{page === 'maxfiylik' ? <Privacy /> : <Landing />}</SiteProvider>;
}
