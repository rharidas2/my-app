import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Alert } from 'react-bootstrap';
import { registerUser } from '@/lib/authenticate';

export default function Register() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [warning, setWarning] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await registerUser(user, password, password2);
      router.push('/login');
    } catch (err) {
        console.log("Registration error:", err);
        if (err?.info?.message) {
          setWarning(err.info.message);
        } else {
          setWarning('An error occurred. Please try again.');
        }
      }
      
  }

  return (
    <>
      <h1>Register</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username:</Form.Label>
          <Form.Control 
            type="text" 
            value={user} 
            onChange={(e) => setUser(e.target.value)} 
            required 
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password:</Form.Label>
          <Form.Control 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password:</Form.Label>
          <Form.Control 
            type="password" 
            value={password2} 
            onChange={(e) => setPassword2(e.target.value)} 
            required 
          />
        </Form.Group>
        {warning && <Alert variant="danger">{warning}</Alert>}
        <Button variant="primary" type="submit">Register</Button>
      </Form>
    </>
  );
}
