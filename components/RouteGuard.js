import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '@/store';
import { getFavourites, getHistory } from '@/lib/userData';
import { isAuthenticated } from '@/lib/authenticate';

const PUBLIC_PATHS = ['/login', '/register', '/'];

export default function RouteGuard(props) {
  const router = useRouter();
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [, setSearchHistory] = useAtom(searchHistoryAtom);

  async function updateAtoms() {
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
  }

  useEffect(() => {
    if (!isAuthenticated() && !PUBLIC_PATHS.includes(router.pathname)) {
      router.push('/login');
    } else if (isAuthenticated()) {
      updateAtoms();
    }
  }, [router.pathname]);

  return <>{props.children}</>;
}