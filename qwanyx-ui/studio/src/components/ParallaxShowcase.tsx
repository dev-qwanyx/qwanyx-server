import React from 'react';
import {
  Parallax,
  ParallaxImage,
  ParallaxText,
  ParallaxLayer,
  ParallaxSection,
  ParallaxReveal,
  Container,
  Heading,
  Text,
  Card,
  CardContent,
  Button,
  HeroTitle,
  HeroSubtitle,
  Section,
  Grid
} from '@qwanyx/ui';

export const ParallaxShowcase: React.FC = () => {
  // Using optimized images (1280px width for faster loading)
  const images = {
    hero: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1280',
    mountain: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1280',
    city: 'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=1280',
    nature: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=1280',
    abstract: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1280',
    ocean: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1280'
  };

  return (
    <div className="qwanyx-min-h-screen">
      {/* Hero with Parallax Background */}
      <ParallaxSection
        backgroundImage={images.hero}
        height="100vh"
        overlayOpacity={0.5}
        className="bg-gradient-to-b from-indigo-900 to-purple-900"
      >
        <Container>
          <ParallaxReveal animation="fadeUp">
            <HeroTitle className="text-white text-center text-6xl font-bold">
              Parallax Effects
            </HeroTitle>
          </ParallaxReveal>
          <ParallaxReveal animation="fadeUp" delay={0.2}>
            <HeroSubtitle className="text-white text-center text-2xl">
              Scroll down to see various parallax effects
            </HeroSubtitle>
          </ParallaxReveal>
          <ParallaxReveal animation="zoom" delay={0.4}>
            <div className="flex justify-center mt-8">
              <Button size="lg" variant="solid" color="primary">
                Explore More
              </Button>
            </div>
          </ParallaxReveal>
        </Container>
      </ParallaxSection>

      {/* Text Over Image Parallax */}
      <div className="relative h-screen overflow-hidden">
        <ParallaxImage
          src={images.mountain}
          containerClassName="w-full h-full"
          speed={0.5}
          scale={true}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <ParallaxText direction="up" speed={0.3} className="text-center">
            <h2 className="text-6xl font-bold text-white mb-4">Stunning Views</h2>
            <p className="text-xl text-white">Text moving over parallax images</p>
          </ParallaxText>
        </div>
      </div>

      {/* Split Section with Parallax */}
      <Section className="py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
          <div className="relative overflow-hidden h-screen md:h-auto">
            <ParallaxImage
              src={images.city}
              containerClassName="w-full h-full min-h-[400px]"
              speed={0.3}
              scale={false}
            />
          </div>
          <div className="flex items-center justify-center p-12 bg-white">
            <ParallaxReveal animation="fadeLeft">
              <div>
                <Heading as="h2" className="mb-4">Dynamic Content</Heading>
                <Text className="mb-6">
                  Create engaging layouts by combining parallax images with content sections. 
                  The image scrolls at a different speed creating depth.
                </Text>
                <Button variant="solid" color="primary">Learn More</Button>
              </div>
            </ParallaxReveal>
          </div>
        </div>
      </Section>

      {/* Multiple Parallax Layers */}
      <div className="relative h-screen overflow-hidden bg-gradient-to-b from-sky-100 to-sky-300">
        <ParallaxLayer depth={1} className="absolute inset-0">
          <img src={images.nature} alt="Background" className="w-full h-full object-cover opacity-30" />
        </ParallaxLayer>
        
        <ParallaxLayer depth={0.8} className="absolute top-20 left-10">
          <div className="w-64 h-64 bg-white rounded-lg shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-2">Layer 1</h3>
            <p>Furthest back, slowest movement</p>
          </div>
        </ParallaxLayer>
        
        <ParallaxLayer depth={0.5} className="absolute top-40 right-20">
          <div className="w-64 h-64 bg-indigo-500 text-white rounded-lg shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-2">Layer 2</h3>
            <p>Middle layer, medium speed</p>
          </div>
        </ParallaxLayer>
        
        <ParallaxLayer depth={0.2} className="absolute bottom-20 left-1/3">
          <div className="w-64 h-64 bg-purple-500 text-white rounded-lg shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-2">Layer 3</h3>
            <p>Closest layer, fastest movement</p>
          </div>
        </ParallaxLayer>
      </div>

      {/* Cards with Different Parallax Speeds */}
      <Section className="py-20 bg-gray-100">
        <Container>
          <ParallaxReveal animation="fadeUp">
            <Heading as="h2" className="text-center mb-16">
              Cards with Parallax Movement
            </Heading>
          </ParallaxReveal>

          <div className="space-y-32">
            <Parallax speed={0.2}>
              <Card className="max-w-2xl mx-auto shadow-xl">
                <CardContent className="p-8">
                  <Heading as="h3">Slow Movement</Heading>
                  <Text>This card moves slowly as you scroll (speed: 0.2)</Text>
                </CardContent>
              </Card>
            </Parallax>

            <Parallax speed={0.5}>
              <Card className="max-w-2xl mx-auto shadow-xl bg-indigo-50">
                <CardContent className="p-8">
                  <Heading as="h3">Medium Movement</Heading>
                  <Text>This card moves at medium speed (speed: 0.5)</Text>
                </CardContent>
              </Card>
            </Parallax>

            <Parallax speed={0.8}>
              <Card className="max-w-2xl mx-auto shadow-xl bg-purple-50">
                <CardContent className="p-8">
                  <Heading as="h3">Fast Movement</Heading>
                  <Text>This card moves quickly as you scroll (speed: 0.8)</Text>
                </CardContent>
              </Card>
            </Parallax>
          </div>
        </Container>
      </Section>

      {/* Full Width Parallax Image Break */}
      <div className="h-96 relative">
        <ParallaxImage
          src={images.abstract}
          containerClassName="w-full h-full"
          speed={0.4}
          scale={true}
          overlay={true}
          overlayOpacity={0.3}
        />
      </div>

      {/* Text Parallax in Different Directions */}
      <Section className="py-20 bg-white">
        <Container>
          <ParallaxReveal animation="fadeUp">
            <Heading as="h2" className="text-center mb-16">
              Directional Text Movement
            </Heading>
          </ParallaxReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <ParallaxText direction="left" speed={0.3}>
              <Card className="shadow-lg border-l-4 border-blue-500">
                <CardContent>
                  <Heading as="h4">← Moving Left</Heading>
                  <Text>This content slides left as you scroll down the page</Text>
                </CardContent>
              </Card>
            </ParallaxText>

            <ParallaxText direction="right" speed={0.3}>
              <Card className="shadow-lg border-r-4 border-purple-500">
                <CardContent>
                  <Heading as="h4">Moving Right →</Heading>
                  <Text>This content slides right as you scroll down the page</Text>
                </CardContent>
              </Card>
            </ParallaxText>

            <ParallaxText direction="up" speed={0.4}>
              <Card className="shadow-lg border-t-4 border-green-500">
                <CardContent>
                  <Heading as="h4">↑ Moving Up</Heading>
                  <Text>This content moves upward creating a lifting effect</Text>
                </CardContent>
              </Card>
            </ParallaxText>

            <ParallaxText direction="down" speed={0.4}>
              <Card className="shadow-lg border-b-4 border-red-500">
                <CardContent>
                  <Heading as="h4">Moving Down ↓</Heading>
                  <Text>This content moves downward for a sinking effect</Text>
                </CardContent>
              </Card>
            </ParallaxText>
          </div>
        </Container>
      </Section>

      {/* Hero Section with Text Over Parallax */}
      <div className="relative h-screen overflow-hidden">
        <ParallaxImage
          src={images.ocean}
          containerClassName="w-full h-full"
          speed={0.3}
          scale={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute inset-0 z-10 flex items-end pb-20">
          <Container>
            <ParallaxText direction="up" speed={0.2}>
              <h2 className="text-5xl font-bold text-white mb-4">Ocean Dreams</h2>
              <p className="text-xl text-white mb-8 max-w-2xl">
                Experience the depth and movement of parallax scrolling. 
                Each element moves at its own pace, creating an immersive visual journey.
              </p>
              <Button size="lg" variant="solid" className="bg-white text-black hover:bg-gray-100">
                Dive Deeper
              </Button>
            </ParallaxText>
          </Container>
        </div>
      </div>

      {/* Reveal Grid */}
      <Section className="py-20 bg-gray-50">
        <Container>
          <ParallaxReveal animation="fadeUp">
            <Heading as="h2" className="text-center mb-16">
              Scroll-Triggered Animations
            </Heading>
          </ParallaxReveal>

          <Grid cols={3} gap="lg">
            {['fadeUp', 'fadeLeft', 'fadeRight', 'zoom', 'rotate', 'fadeDown'].map((animation, index) => (
              <ParallaxReveal key={animation} animation={animation as any} delay={index * 0.1}>
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-600" />
                  <CardContent>
                    <Heading as="h4" className="capitalize">{animation}</Heading>
                    <Text>Reveals with {animation} animation on scroll</Text>
                  </CardContent>
                </Card>
              </ParallaxReveal>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Footer */}
      <Parallax speed={0.1}>
        <div className="bg-gradient-to-r from-gray-900 to-black text-white py-20">
          <Container>
            <div className="text-center">
              <Heading as="h3" className="text-white mb-4">
                QWANYX UI Parallax Components
              </Heading>
              <Text className="text-gray-300">
                Create stunning scroll experiences with ease
              </Text>
            </div>
          </Container>
        </div>
      </Parallax>
    </div>
  );
};