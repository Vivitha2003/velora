import { useState } from 'react';
import { validateEmail } from '../utils/validators';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = validateEmail(email);
    setError(message);
    if (!message) {
      setDone(true);
      setEmail('');
    }
  };

  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <div className="container newsletter__inner">
        <div>
          <h2 id="newsletter-title">Join the VELORA list</h2>
          <p>New arrivals and seasonal offers, once a month. Unsubscribe any time.</p>
        </div>

        {done ? (
          <p className="form-success" role="status">
            Thanks for subscribing. This is a demo, so no email was actually saved or sent.
          </p>
        ) : (
          <form className="newsletter__form" onSubmit={handleSubmit} noValidate>
            <div className="field field--inline">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError('');
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'newsletter-error' : undefined}
                autoComplete="email"
              />
              <button type="submit" className="btn btn--primary">Subscribe</button>
            </div>
            {error && <p id="newsletter-error" className="field__error">{error}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
