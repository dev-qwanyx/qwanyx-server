import React, { useState } from 'react';
import {
  Title,
  Subtitle,
  Columns,
  Column,
  Box,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardFooterItem,
  Notification,
  Section,
  Container,
  Tags,
  Tag,
  // Animation imports
  AnimatedButton,
  AnimatedCard,
  AnimatedBox,
  AnimatedNotification,
  StaggerContainer,
  StaggerItem,
  Floating,
  Shake,
  Animated,
  ScrollReveal,
  MotionDiv,
  PageTransition,
  Parallax,
  AOSProvider,
  AOSWrapper,
  FadeUp,
  FadeDown,
  FadeLeft,
  FadeRight,
  SlideUp,
  ZoomIn,
  FlipLeft,
  hoverScale,
  hoverLift,
  hoverRotate,
  tapScale
} from '@qwanyx/bulma-components';

export const AnimationShowcase: React.FC = () => {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <AOSProvider>
      <div>
        {/* Header */}
        <Box>
          <Title size={3}>🎨 Animation Showcase</Title>
          <Subtitle>All animation capabilities in one place!</Subtitle>
        </Box>

        {/* CSS Animations */}
        <Section>
          <Title size={4}>CSS Animations</Title>
          <Subtitle>Pure CSS animations with custom classes</Subtitle>
          
          <Columns multiline>
            <Column size="one-quarter">
              <Box className="animate-fade-in">Fade In</Box>
            </Column>
            <Column size="one-quarter">
              <Box className="animate-fade-in-up">Fade In Up</Box>
            </Column>
            <Column size="one-quarter">
              <Box className="animate-scale-in">Scale In</Box>
            </Column>
            <Column size="one-quarter">
              <Box className="animate-slide-in-left">Slide In Left</Box>
            </Column>
          </Columns>

          <Columns multiline>
            <Column size="one-quarter">
              <Box className="animate-pulse">Pulse (looping)</Box>
            </Column>
            <Column size="one-quarter">
              <Box className="animate-bounce">Bounce (looping)</Box>
            </Column>
            <Column size="one-quarter">
              <Box className="animate-rotate">Rotate (looping)</Box>
            </Column>
            <Column size="one-quarter">
              <Box className="animate-float">Float (looping)</Box>
            </Column>
          </Columns>

          <Title size={5}>Hover Effects</Title>
          <Columns multiline>
            <Column size="one-quarter">
              <Box className="hover-grow">Hover to Grow</Box>
            </Column>
            <Column size="one-quarter">
              <Box className="hover-shrink">Hover to Shrink</Box>
            </Column>
            <Column size="one-quarter">
              <Box className="hover-rotate">Hover to Rotate</Box>
            </Column>
            <Column size="one-quarter">
              <Box className="hover-lift">Hover to Lift</Box>
            </Column>
          </Columns>
        </Section>

        {/* Framer Motion Animations */}
        <Section>
          <Title size={4}>Framer Motion Components</Title>
          <Subtitle>React animations with physics-based spring animations</Subtitle>

          <Title size={5}>Animated Buttons</Title>
          <div className="buttons">
            <AnimatedButton color="primary" animationType="scale">
              Scale on Hover
            </AnimatedButton>
            <AnimatedButton color="info" animationType="lift">
              Lift on Hover
            </AnimatedButton>
            <AnimatedButton color="success" animationType="glow">
              Glow on Hover
            </AnimatedButton>
            <AnimatedButton color="warning" animationType="pulse">
              Pulse on Hover
            </AnimatedButton>
          </div>

          <Title size={5}>Animated Cards</Title>
          <Columns>
            <Column size="one-third">
              <AnimatedCard hoverEffect="lift" scrollAnimation="fadeIn">
                <CardContent>
                  <Title size={5}>Lift Card</Title>
                  <p>This card lifts up when you hover over it</p>
                </CardContent>
                <CardFooter>
                  <CardFooterItem as="a">Learn More</CardFooterItem>
                </CardFooter>
              </AnimatedCard>
            </Column>
            <Column size="one-third">
              <AnimatedCard hoverEffect="scale" scrollAnimation="slideUp">
                <CardContent>
                  <Title size={5}>Scale Card</Title>
                  <p>This card scales when you hover over it</p>
                </CardContent>
                <CardFooter>
                  <CardFooterItem as="a">Learn More</CardFooterItem>
                </CardFooter>
              </AnimatedCard>
            </Column>
            <Column size="one-third">
              <AnimatedCard hoverEffect="glow" scrollAnimation="slideRight">
                <CardContent>
                  <Title size={5}>Glow Card</Title>
                  <p>This card glows when you hover over it</p>
                </CardContent>
                <CardFooter>
                  <CardFooterItem as="a">Learn More</CardFooterItem>
                </CardFooter>
              </AnimatedCard>
            </Column>
          </Columns>

          <Title size={5}>Stagger Animation</Title>
          <StaggerContainer>
            <Columns>
              <Column size="one-quarter">
                <StaggerItem>
                  <Box>Item 1</Box>
                </StaggerItem>
              </Column>
              <Column size="one-quarter">
                <StaggerItem>
                  <Box>Item 2</Box>
                </StaggerItem>
              </Column>
              <Column size="one-quarter">
                <StaggerItem>
                  <Box>Item 3</Box>
                </StaggerItem>
              </Column>
              <Column size="one-quarter">
                <StaggerItem>
                  <Box>Item 4</Box>
                </StaggerItem>
              </Column>
            </Columns>
          </StaggerContainer>

          <Title size={5}>Special Effects</Title>
          <Columns>
            <Column size="one-third">
              <Floating duration={2} distance={15}>
                <Box>Floating Box</Box>
              </Floating>
            </Column>
            <Column size="one-third">
              <Shake onHover>
                <Box>Hover to Shake</Box>
              </Shake>
            </Column>
            <Column size="one-third">
              <MotionDiv whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <Box>Hover to Spin</Box>
              </MotionDiv>
            </Column>
          </Columns>

          <Title size={5}>Animated Notifications</Title>
          <Button color="primary" onClick={() => setShowNotification(!showNotification)}>
            Toggle Notification
          </Button>
          {showNotification && (
            <div style={{ marginTop: '1rem' }}>
              <AnimatedNotification color="success" animationType="bounce">
                <strong>Success!</strong> This notification bounced in!
              </AnimatedNotification>
            </div>
          )}
        </Section>

        {/* AOS Scroll Animations */}
        <Section>
          <Title size={4}>Scroll Animations (AOS)</Title>
          <Subtitle>Elements animate as you scroll</Subtitle>

          <Columns multiline>
            <Column size="one-third">
              <FadeUp>
                <Box>
                  <Title size={5}>Fade Up</Title>
                  <p>This box fades up as you scroll</p>
                </Box>
              </FadeUp>
            </Column>
            <Column size="one-third">
              <FadeUp delay={100}>
                <Box>
                  <Title size={5}>Fade Up Delayed</Title>
                  <p>This box fades up with delay</p>
                </Box>
              </FadeUp>
            </Column>
            <Column size="one-third">
              <FadeUp delay={200}>
                <Box>
                  <Title size={5}>Fade Up More Delayed</Title>
                  <p>This box fades up with more delay</p>
                </Box>
              </FadeUp>
            </Column>
          </Columns>

          <Columns multiline>
            <Column size="one-third">
              <FadeLeft>
                <Box>
                  <Title size={5}>Fade Left</Title>
                  <p>Slides in from the right</p>
                </Box>
              </FadeLeft>
            </Column>
            <Column size="one-third">
              <ZoomIn>
                <Box>
                  <Title size={5}>Zoom In</Title>
                  <p>Zooms in as you scroll</p>
                </Box>
              </ZoomIn>
            </Column>
            <Column size="one-third">
              <FadeRight>
                <Box>
                  <Title size={5}>Fade Right</Title>
                  <p>Slides in from the left</p>
                </Box>
              </FadeRight>
            </Column>
          </Columns>

          <Columns>
            <Column size="half">
              <FlipLeft>
                <Box>
                  <Title size={5}>Flip Left</Title>
                  <p>This box flips in from the left</p>
                </Box>
              </FlipLeft>
            </Column>
            <Column size="half">
              <SlideUp>
                <Box>
                  <Title size={5}>Slide Up</Title>
                  <p>This box slides up from below</p>
                </Box>
              </SlideUp>
            </Column>
          </Columns>
        </Section>

        {/* Animate.css Integration */}
        <Section>
          <Title size={4}>Animate.css Library</Title>
          <Subtitle>Popular animation library with tons of effects</Subtitle>

          <Columns multiline>
            <Column size="one-quarter">
              <Box className="animate__animated animate__bounceIn">
                Bounce In
              </Box>
            </Column>
            <Column size="one-quarter">
              <Box className="animate__animated animate__fadeInLeft">
                Fade In Left
              </Box>
            </Column>
            <Column size="one-quarter">
              <Box className="animate__animated animate__zoomIn">
                Zoom In
              </Box>
            </Column>
            <Column size="one-quarter">
              <Box className="animate__animated animate__rotateIn">
                Rotate In
              </Box>
            </Column>
          </Columns>

          <Title size={5}>Attention Seekers</Title>
          <Columns multiline>
            <Column size="one-quarter">
              <Box className="animate__animated animate__pulse animate__infinite">
                Pulse (infinite)
              </Box>
            </Column>
            <Column size="one-quarter">
              <Box className="animate__animated animate__shakeX animate__infinite">
                Shake X (infinite)
              </Box>
            </Column>
            <Column size="one-quarter">
              <Box className="animate__animated animate__tada animate__infinite">
                Tada (infinite)
              </Box>
            </Column>
            <Column size="one-quarter">
              <Box className="animate__animated animate__heartBeat animate__infinite">
                Heartbeat (infinite)
              </Box>
            </Column>
          </Columns>
        </Section>

        {/* Combined Effects */}
        <Section>
          <Title size={4}>Combined Effects</Title>
          <Subtitle>Mixing different animation libraries</Subtitle>

          <ScrollReveal animation="slideUp">
            <AnimatedBox animateOnHover animation="blur">
              <Title size={5}>Multiple Animations</Title>
              <p>This box:</p>
              <ul>
                <li>Slides up on scroll (Framer Motion)</li>
                <li>Has blur effect on appear (Custom)</li>
                <li>Scales on hover (Framer Motion)</li>
              </ul>
            </AnimatedBox>
          </ScrollReveal>

          <div style={{ marginTop: '2rem' }}>
            <Parallax offset={30}>
              <Box className="animate__animated animate__pulse animate__infinite hover-glow">
                <Title size={5}>All Effects Combined!</Title>
                <Tags>
                  <Tag color="primary">Parallax</Tag>
                  <Tag color="info">Pulse</Tag>
                  <Tag color="success">Hover Glow</Tag>
                </Tags>
              </Box>
            </Parallax>
          </div>
        </Section>

        {/* Performance Note */}
        <Box>
          <Title size={5}>⚡ Performance Note</Title>
          <p>
            All animations are optimized for performance:
          </p>
          <ul>
            <li>CSS animations use GPU acceleration</li>
            <li>Framer Motion uses spring physics for smooth animations</li>
            <li>AOS disables on mobile for better performance</li>
            <li>Animations use <code>transform</code> and <code>opacity</code> for best performance</li>
          </ul>
        </Box>
      </div>
    </AOSProvider>
  );
};