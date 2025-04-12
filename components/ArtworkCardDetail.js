import { Button, Card } from 'react-bootstrap';
import useSWR from 'swr';
import Error from 'next/error';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { useState, useEffect } from 'react';
import { addToFavourites, removeFromFavourites } from '@/lib/userData';

export default function ArtworkCardDetail({ objectID }) {
  const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);


  useEffect(() => {
    setShowAdded(favouritesList?.includes(objectID));
  }, [favouritesList, objectID]);

  async function favouritesClicked() {
    if (!objectID) return;
    
    setIsProcessing(true);
    try {
      if (showAdded) {
        const updatedList = await removeFromFavourites(objectID);
        setFavouritesList(updatedList);
      } else {
        const updatedList = await addToFavourites(objectID);
        setFavouritesList(updatedList);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    } finally {
      setIsProcessing(false);
    }
  }

  if (error) {
    return <Error statusCode={404} />;
  }

  if (data) {
    return (
      <Card>
        {data.primaryImage && <Card.Img variant="top" src={data.primaryImage} />}
        <Card.Body>
          <Card.Title>{data.title || "N/A"}</Card.Title>
          <Card.Text>
            <strong>Date: </strong>{data.objectDate || "N/A"}<br />
            <strong>Classification: </strong>{data.classification || "N/A"}<br />
            <strong>Medium: </strong>{data.medium || "N/A"}
            <br /><br />

            <strong>Artist: </strong> {data.artistDisplayName || "N/A"} 
            {data.artistWikidata_URL && (
              <> ( <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer">wiki</a> )</>
            )}<br />
            <strong>Credit Line: </strong> {data.creditLine || "N/A"}<br />
            <strong>Dimensions: </strong> {data.dimensions || "N/A"}<br /><br />

            <Button 
              variant={showAdded ? "primary" : "outline-primary"} 
              onClick={favouritesClicked}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `+ Favourite ${showAdded ? "( added )" : ""}`}
            </Button>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
  return null;
}