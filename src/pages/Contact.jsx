import { useState } from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { BRAND } from '../config';
import { validateEmail, validateRequired } from '../utils/validators';

const initialValues = { name: '', email: '', subject: '', message: '' };

const validators = {
  name: (value) => validateRequired(value, 'name', 2),
  email: validateEmail,
  subject: (value) => validateRequired(value, 'subject', 3),
  message: (value) => validateRequired(value, 'message', 10),
};

export default function Contact() {
  useDocumentTitle('Contact us');
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) setErrors((previous) => ({ ...previous, [name]: validators[name](value) }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setErrors((previous) => ({ ...previous, [name]: validators[name](value) }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = Object.fromEntries(Object.keys(validators).map((name) => [name, validators[name](values[name])]));
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors).find((name) => nextErrors[name]);
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }
    setSent(true);
    setValues(initialValues);
  };

  const renderError = (name) =>
    errors[name] ? <p id={`contact-${name}-error`} className="field__error">{errors[name]}</p> : null;

  const fieldProps = (name) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `contact-${name}-error` : undefined,
  });

  return (
    <div className="container page">
      <div className="page-title">
        <h1>Contact us</h1>
        <p>Questions about an order or a product? Send us a message.</p>
      </div>

      <div className="contact-layout">
        {sent ? (
          <div className="form-success form-success--block" role="status">
            <h2>Message received</h2>
            <p>Thanks for writing to us. This is a demo form, so the message was not actually sent.</p>
            <button type="button" className="btn btn--outline" onClick={() => setSent(false)}>Send another message</button>
          </div>
        ) : (
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="contact-name">Name</label>
                <input type="text" autoComplete="name" {...fieldProps('name')} />
                {renderError('name')}
              </div>
              <div className="field">
                <label htmlFor="contact-email">Email</label>
                <input type="email" autoComplete="email" {...fieldProps('email')} />
                {renderError('email')}
              </div>
              <div className="field field--wide">
                <label htmlFor="contact-subject">Subject</label>
                <input type="text" {...fieldProps('subject')} />
                {renderError('subject')}
              </div>
              <div className="field field--wide">
                <label htmlFor="contact-message">Message</label>
                <textarea rows="6" {...fieldProps('message')} />
                {renderError('message')}
              </div>
            </div>
            <button type="submit" className="btn btn--primary btn--lg">Send message</button>
          </form>
        )}

        <aside className="contact-info" aria-label="Store details">
          <h2>Store details</h2>
          <ul>
            <li><Mail size={18} aria-hidden="true" /><a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>
            <li><Phone size={18} aria-hidden="true" /><a href={`tel:${BRAND.phone.replace(/\s/g, '')}`}>{BRAND.phone}</a></li>
            <li><MapPin size={18} aria-hidden="true" /><span>{BRAND.address}</span></li>
            <li><Clock size={18} aria-hidden="true" /><span>{BRAND.hours}</span></li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
