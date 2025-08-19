import React from 'react';
import { z } from 'zod';
import { 
  Form, 
  Field, 
  Select, 
  FileInput
} from './Form';
import { Radio } from './Radio';
import { Checkbox } from './Checkbox';
import { Input, Textarea } from './Input';
import { Button } from './Button';
import { Heading, Text } from './Text';
import { Container, Section, Grid } from './Container';

// Validation schema
const contactSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional().or(z.literal('')),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  country: z.string().min(1, 'Please select a country'),
  newsletter: z.boolean().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions'
  }),
  priority: z.enum(['low', 'medium', 'high']),
  attachment: z.any().optional()
});

type ContactFormData = z.infer<typeof contactSchema>;

export const FormExample: React.FC = () => {
  const handleSubmit = (data: ContactFormData) => {
    console.log('Form submitted:', data);
    alert('Form submitted successfully! Check console for data.');
  };

  const countries = [
    { value: '', label: 'Select a country', disabled: true },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' },
    { value: 'es', label: 'Spain' },
    { value: 'it', label: 'Italy' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'jp', label: 'Japan' },
    { value: 'cn', label: 'China' }
  ];

  const subjects = [
    { value: '', label: 'Choose a subject', disabled: true },
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'billing', label: 'Billing Question' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'partnership', label: 'Partnership Opportunity' }
  ];

  return (
    <Container>
      <Section spacing="xl">
        <Heading as="h2" className="mb-2">Contact Form Example</Heading>
        <Text color="secondary" className="mb-8">
          This form demonstrates all form components with validation using Zod
        </Text>

        <Form<ContactFormData>
          onSubmit={handleSubmit}
          schema={contactSchema}
          defaultValues={{
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
            country: '',
            newsletter: false,
            terms: false,
            priority: 'medium'
          }}
          size="md"
          variant="default"
        >
          <Grid cols={2} gap="md" className="mb-4">
            <Field name="firstName" label="First Name" required>
              <Input 
                name="firstName" 
                placeholder="John"
                fullWidth
              />
            </Field>
            
            <Field name="lastName" label="Last Name" required>
              <Input 
                name="lastName" 
                placeholder="Doe"
                fullWidth
              />
            </Field>
          </Grid>

          <Grid cols={2} gap="md" className="mb-4">
            <Field name="email" label="Email Address" required>
              <Input 
                name="email" 
                type="email" 
                placeholder="john.doe@example.com"
                fullWidth
              />
            </Field>
            
            <Field name="phone" label="Phone Number" help="Optional international format">
              <Input 
                name="phone" 
                type="tel" 
                placeholder="+1234567890"
                fullWidth
              />
            </Field>
          </Grid>

          <Grid cols={2} gap="md" className="mb-4">
            <Field name="country" label="Country" required>
              <Select 
                name="country"
                options={countries}
                fullWidth
              />
            </Field>

            <Field name="subject" label="Subject" required>
              <Select 
                name="subject"
                options={subjects}
                fullWidth
              />
            </Field>
          </Grid>

          <Field name="message" label="Message" required className="mb-4">
            <Textarea 
              name="message" 
              placeholder="Tell us more about your inquiry..."
              rows={5}
              fullWidth
            />
          </Field>

          <Field name="priority" label="Priority Level" className="mb-4">
            <div className="flex gap-4">
              <Radio name="priority" value="low" label="Low" />
              <Radio name="priority" value="medium" label="Medium" />
              <Radio name="priority" value="high" label="High" />
            </div>
          </Field>

          <Field name="attachment" label="Attachment" className="mb-4">
            <FileInput 
              name="attachment"
              accept=".pdf,.doc,.docx,.txt"
              label="Upload document"
            />
          </Field>

          <div className="space-y-3 mb-6">
            <Checkbox 
              name="newsletter" 
              label="Subscribe to our newsletter for updates"
            />
            
            <Checkbox 
              name="terms" 
              label="I accept the terms and conditions"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="solid" color="primary">
              Submit Form
            </Button>
            <Button type="reset" variant="ghost">
              Reset
            </Button>
          </div>
        </Form>
      </Section>

      <Section spacing="lg">
        <Heading as="h3" className="mb-4">Form Features</Heading>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Built with React Hook Form for optimal performance</li>
          <li>Zod schema validation with custom error messages</li>
          <li>All form states handled automatically (errors, touched, dirty)</li>
          <li>Responsive grid layout</li>
          <li>Accessible form controls with proper labels</li>
          <li>Theme-aware styling that adapts to dark/light mode</li>
          <li>TypeScript support with full type safety</li>
          <li>File upload with validation</li>
          <li>Radio groups and checkboxes</li>
          <li>Select dropdowns with placeholder</li>
        </ul>
      </Section>
    </Container>
  );
};

// Simple Form Example
export const SimpleFormExample: React.FC = () => {
  const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    remember: z.boolean().optional()
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const handleLogin = (data: LoginFormData) => {
    console.log('Login data:', data);
  };

  return (
    <Container>
      <Section spacing="lg">
        <Heading as="h3" align="center" className="mb-6">
          Sign In
        </Heading>
        
        <Form<LoginFormData>
          onSubmit={handleLogin}
          schema={loginSchema}
          defaultValues={{
            email: '',
            password: '',
            remember: false
          }}
        >
          <Field name="email" label="Email" required className="mb-4">
            <Input 
              name="email" 
              type="email" 
              placeholder="you@example.com"
              fullWidth
            />
          </Field>

          <Field name="password" label="Password" required className="mb-4">
            <Input 
              name="password" 
              type="password" 
              placeholder="Enter your password"
              fullWidth
            />
          </Field>

          <div className="mb-6">
            <Checkbox name="remember" label="Remember me" />
          </div>

          <Button type="submit" fullWidth variant="solid" color="primary">
            Sign In
          </Button>
        </Form>
      </Section>
    </Container>
  );
};