import { useAtom } from 'jotai';
import { Card, Col, Row } from 'react-bootstrap';
import ArtworkCard from '@/components/ArtworkCard';
import { favouritesAtom, favouritesLoadingAtom } from '@/store';
import { getFavourites } from '@/lib/userData';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '@/lib/authenticate';

export default function Favourites() {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [loading, setLoading] = useAtom(favouritesLoadingAtom);
  const router = useRouter();

  useEffect(() => {

    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }


    async function loadData() {
      setLoading(true);
      try {
        const data = await getFavourites();
        setFavouritesList(data);
      } catch (error) {
        console.error("Failed to load favorites:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <Card>
        <Card.Body>
          <h4>Loading your favorites...</h4>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      {favouritesList.length > 0 ? (
        <Row className="gy-4">
          {favouritesList.map(objID => (
            <Col lg={3} key={objID}>
              <ArtworkCard objectID={objID} />
            </Col>
          ))}
        </Row>
      ) : (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            Try adding some new artwork to the list.
          </Card.Body>
        </Card>
      )}
    </>
  );
}