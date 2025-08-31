import React from 'react';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
  Heading, 
  Text,
  Button,
  Grid
} from '../../src';

export const CardShowcase: React.FC = () => {
  return (
    <div>
      <Heading size="3xl" style={{ marginBottom: '0.5rem' }}>Card</Heading>
      <Text size="lg" style={{ color: 'rgb(var(--text-muted))', marginBottom: '2rem' }}>
        Flexible container component for grouping related content
      </Text>

      <Grid cols={3} gap="lg">
        <Card>
          <CardHeader>
            <CardTitle>Simple Card</CardTitle>
            <CardDescription>This is a basic card with header</CardDescription>
          </CardHeader>
          <CardContent>
            <Text>Card content goes here. It can contain any type of content.</Text>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card with Footer</CardTitle>
          </CardHeader>
          <CardContent>
            <Text>This card has action buttons in the footer.</Text>
          </CardContent>
          <CardFooter>
            <Button size="sm">Cancel</Button>
            <Button size="sm" variant="solid" color="primary">Save</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardImage 
            src="https://via.placeholder.com/400x200" 
            alt="Placeholder"
            style={{ height: '150px', objectFit: 'cover' }}
          />
          <CardHeader>
            <CardTitle>Card with Image</CardTitle>
            <CardDescription>Image cards for visual content</CardDescription>
          </CardHeader>
        </Card>
      </Grid>
    </div>
  );
};