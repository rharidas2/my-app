import { useAtom } from 'jotai';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { searchHistoryAtom, historyLoadingAtom } from '@/store';
import { useRouter } from 'next/router';
import { getHistory, removeFromHistory } from '@/lib/userData';
import { useEffect } from 'react';
import { isAuthenticated } from '@/lib/authenticate';
import styles from '@/styles/History.module.css';

export default function History() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [loading, setLoading] = useAtom(historyLoadingAtom);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    async function loadData() {
      setLoading(true);
      try {
        const data = await getHistory();
        setSearchHistory(data);
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  let parsedHistory = [];
  searchHistory.forEach(h => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });

  function historyClicked(e, index) {
    router.push(`/artwork?${searchHistory[index]}`);
  }

  async function removeHistoryClicked(e, index) {
    e.stopPropagation();
    try {
      if (isAuthenticated()) {
        const updatedHistory = await removeFromHistory(searchHistory[index]);
        setSearchHistory(updatedHistory);
      } else {
        setSearchHistory(current => {
          let x = [...current];
          x.splice(index, 1);
          return x;
        });
      }
    } catch (error) {
      console.error("Error removing history item:", error);
    }
  }

  if (loading) {
    return (
      <Card>
        <Card.Body>
          <h4>Loading your search history...</h4>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      {parsedHistory.length > 0 ? (
        <ListGroup>
          {parsedHistory.map((historyItem, index) => (
            <ListGroup.Item 
              key={index} 
              onClick={e => historyClicked(e, index)} 
              className={styles.historyListItem}
            >
              {Object.keys(historyItem).map(key => (
                <span key={key}>
                  {key}: <strong>{historyItem[key]}</strong>&nbsp;
                </span>
              ))}
              <Button 
                className="float-end" 
                variant="danger" 
                size="sm" 
                onClick={e => removeHistoryClicked(e, index)}
              >
                &times;
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            Try searching for some artwork.
          </Card.Body>
        </Card>
      )}
    </>
  );
}