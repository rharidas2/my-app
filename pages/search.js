import { Col, Row, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { addToHistory } from '@/lib/userData';
import { isAuthenticated } from '@/lib/authenticate';

export default function AdvancedSearch() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  async function submitForm(data) {
    let queryString = '';
    

    queryString += `${data.searchBy}=true`;
    if(data.geoLocation) queryString += `&geoLocation=${data.geoLocation}`;
    if(data.medium) queryString += `&medium=${data.medium}`;
    queryString += `&isOnView=${data.isOnView}`;
    queryString += `&isHighlight=${data.isHighlight}`;
    queryString += `&q=${data.q}`;

    try {
      if (isAuthenticated()) {
        const updatedHistory = await addToHistory(queryString);
        setSearchHistory(updatedHistory);
      } else {
        setSearchHistory(current => [...current, queryString]);
      }
      
      router.push(`/artwork?${queryString}`);
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit(submitForm)}>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Search Query</Form.Label>
              <Form.Control 
                className={errors.q && "is-invalid"} 
                type="text" 
                placeholder="" 
                {...register("q", { required: true })} 
              />
              {errors.q && <div className="text-danger">This field is required</div>}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Label>Search By</Form.Label>
            <Form.Select {...register("searchBy")} className="mb-3">
              <option value="title">Title</option>
              <option value="tags">Tags</option>
              <option value="artistOrCulture">Artist or Culture</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Geo Location</Form.Label>
              <Form.Control type="text" placeholder="" {...register("geoLocation")} />
              <Form.Text className="text-muted">
                Case Sensitive String (ie &quot;Europe&quot;, &quot;France&quot;, &quot;Paris&quot;, etc.)
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Medium</Form.Label>
              <Form.Control type="text" placeholder="" {...register("medium")}/>
              <Form.Text className="text-muted">
                Case Sensitive String (ie: &quot;Ceramics&quot;, &quot;Paintings&quot;, etc.)
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Check
              type="checkbox"
              label="Highlighted"
              {...register("isHighlight")}
            />
            <Form.Check
              type="checkbox"
              label="Currently on View"
              {...register("isOnView")}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <br />
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}