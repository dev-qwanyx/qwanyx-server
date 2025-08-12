import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarBurger,
  NavbarMenu,
  NavbarStart,
  NavbarEnd,
  NavbarItem,
  NavbarLink,
  NavbarDropdown,
  Hero,
  HeroBody,
  Title,
  Subtitle,
  Container,
  Section,
  Columns,
  Column,
  Card,
  CardContent,
  CardFooter,
  CardFooterItem,
  Button,
  Box,
  Footer,
  Level,
  LevelLeft,
  LevelRight,
  LevelItem,
  Image
} from '@qwanyx/bulma-components';

function App() {
  const [isNavbarActive, setIsNavbarActive] = useState(false);

  const services = [
    {
      icon: 'fa-robot',
      title: 'Digital Humans',
      description: 'Create lifelike AI avatars for customer service and engagement',
      color: 'primary'
    },
    {
      icon: 'fa-brain',
      title: 'AI Integration',
      description: 'Seamlessly integrate AI capabilities into your existing systems',
      color: 'info'
    },
    {
      icon: 'fa-comments',
      title: 'Natural Language',
      description: 'Advanced NLP for human-like conversations and understanding',
      color: 'success'
    },
    {
      icon: 'fa-chart-line',
      title: 'Analytics',
      description: 'Real-time insights and performance metrics for your AI agents',
      color: 'warning'
    },
    {
      icon: 'fa-shield-alt',
      title: 'Enterprise Security',
      description: 'Bank-level security and compliance for your data',
      color: 'danger'
    },
    {
      icon: 'fa-cogs',
      title: 'Custom Solutions',
      description: 'Tailored AI solutions designed for your specific needs',
      color: 'link'
    }
  ];

  const features = [
    {
      title: 'Multi-Platform Support',
      description: 'Deploy across web, mobile, and desktop platforms',
      icon: 'fa-devices'
    },
    {
      title: '24/7 Availability',
      description: 'Your digital humans work around the clock',
      icon: 'fa-clock'
    },
    {
      title: 'Scalable Infrastructure',
      description: 'From startup to enterprise, we scale with you',
      icon: 'fa-expand'
    }
  ];

  return (
    <>
      {/* Navigation */}
      <Navbar color="dark" fixed="top">
        <NavbarBrand>
          <NavbarItem as="a" href="/">
            <Title size={4} style={{ color: 'white', margin: 0 }}>QWANYX</Title>
          </NavbarItem>
          <NavbarBurger
            isActive={isNavbarActive}
            onClick={() => setIsNavbarActive(!isNavbarActive)}
          />
        </NavbarBrand>
        <NavbarMenu isActive={isNavbarActive}>
          <NavbarStart>
            <NavbarItem>Home</NavbarItem>
            <NavbarItem>Services</NavbarItem>
            <NavbarItem hasDropdown isHoverable>
              <NavbarLink>Solutions</NavbarLink>
              <NavbarDropdown>
                <NavbarItem>Healthcare</NavbarItem>
                <NavbarItem>Finance</NavbarItem>
                <NavbarItem>Retail</NavbarItem>
                <NavbarItem>Education</NavbarItem>
              </NavbarDropdown>
            </NavbarItem>
            <NavbarItem>About</NavbarItem>
            <NavbarItem>Contact</NavbarItem>
          </NavbarStart>
          <NavbarEnd>
            <NavbarItem>
              <div className="buttons">
                <Button color="primary">
                  <strong>Get Started</strong>
                </Button>
                <Button isLight>
                  Log in
                </Button>
              </div>
            </NavbarItem>
          </NavbarEnd>
        </NavbarMenu>
      </Navbar>

      {/* Hero Section */}
      <Hero color="dark" size="large" style={{ marginTop: '52px' }}>
        <HeroBody>
          <Container>
            <Title size={1}>
              Welcome to QWANYX
            </Title>
            <Subtitle size={3}>
              The Future of Digital Human Technology
            </Subtitle>
            <Subtitle>
              Create intelligent, empathetic AI avatars that transform how you connect with customers
            </Subtitle>
            <div className="buttons" style={{ marginTop: '2rem' }}>
              <Button color="primary" size="large">
                Start Free Trial
              </Button>
              <Button color="light" size="large" isOutlined>
                Watch Demo
              </Button>
            </div>
          </Container>
        </HeroBody>
      </Hero>

      {/* Services Section */}
      <Section>
        <Container>
          <div className="has-text-centered mb-6">
            <Title size={2}>Our Services</Title>
            <Subtitle>
              Comprehensive AI solutions for modern businesses
            </Subtitle>
          </div>
          <Columns multiline>
            {services.map((service, index) => (
              <Column key={index} size="one-third">
                <Card>
                  <CardContent>
                    <div className="has-text-centered mb-4">
                      <span className={`icon is-large has-text-${service.color}`}>
                        <i className={`fas ${service.icon} fa-3x`}></i>
                      </span>
                    </div>
                    <p className="title is-4 has-text-centered">{service.title}</p>
                    <p className="has-text-centered">{service.description}</p>
                  </CardContent>
                  <CardFooter>
                    <CardFooterItem as="a">
                      Learn More →
                    </CardFooterItem>
                  </CardFooter>
                </Card>
              </Column>
            ))}
          </Columns>
        </Container>
      </Section>

      {/* Features Section */}
      <Section className="has-background-light">
        <Container>
          <div className="has-text-centered mb-6">
            <Title size={2}>Why Choose QWANYX?</Title>
            <Subtitle>
              Industry-leading features that set us apart
            </Subtitle>
          </div>
          <Columns>
            {features.map((feature, index) => (
              <Column key={index}>
                <Box>
                  <article className="media">
                    <div className="media-left">
                      <span className="icon is-large has-text-primary">
                        <i className={`fas ${feature.icon} fa-2x`}></i>
                      </span>
                    </div>
                    <div className="media-content">
                      <div className="content">
                        <p>
                          <strong>{feature.title}</strong>
                          <br />
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </article>
                </Box>
              </Column>
            ))}
          </Columns>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section>
        <Container>
          <Level>
            <LevelItem hasTextCentered>
              <div>
                <p className="heading">Digital Humans Created</p>
                <p className="title">10,000+</p>
              </div>
            </LevelItem>
            <LevelItem hasTextCentered>
              <div>
                <p className="heading">Active Users</p>
                <p className="title">50,000+</p>
              </div>
            </LevelItem>
            <LevelItem hasTextCentered>
              <div>
                <p className="heading">Countries</p>
                <p className="title">45</p>
              </div>
            </LevelItem>
            <LevelItem hasTextCentered>
              <div>
                <p className="heading">Customer Satisfaction</p>
                <p className="title">99%</p>
              </div>
            </LevelItem>
          </Level>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="has-background-primary">
        <Container>
          <div className="has-text-centered">
            <Title size={2} style={{ color: 'white' }}>
              Ready to Transform Your Business?
            </Title>
            <Subtitle size={4} style={{ color: 'white' }}>
              Join thousands of companies using QWANYX digital humans
            </Subtitle>
            <div className="buttons is-centered" style={{ marginTop: '2rem' }}>
              <Button color="white" size="large" isOutlined>
                Schedule a Demo
              </Button>
              <Button color="light" size="large">
                Contact Sales
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Footer */}
      <Footer>
        <Container>
          <Columns>
            <Column size="one-quarter">
              <Title size={4}>QWANYX</Title>
              <p>
                Leading the future of AI-powered digital human technology.
              </p>
            </Column>
            <Column>
              <Title size={5}>Products</Title>
              <ul>
                <li><a>Digital Avatars</a></li>
                <li><a>Voice AI</a></li>
                <li><a>API Platform</a></li>
                <li><a>Analytics Dashboard</a></li>
              </ul>
            </Column>
            <Column>
              <Title size={5}>Company</Title>
              <ul>
                <li><a>About Us</a></li>
                <li><a>Careers</a></li>
                <li><a>Partners</a></li>
                <li><a>Press</a></li>
              </ul>
            </Column>
            <Column>
              <Title size={5}>Resources</Title>
              <ul>
                <li><a>Documentation</a></li>
                <li><a>Blog</a></li>
                <li><a>Support</a></li>
                <li><a>Status</a></li>
              </ul>
            </Column>
            <Column>
              <Title size={5}>Connect</Title>
              <div className="buttons">
                <Button as="a" href="#" color="dark">
                  <span className="icon">
                    <i className="fab fa-twitter"></i>
                  </span>
                </Button>
                <Button as="a" href="#" color="dark">
                  <span className="icon">
                    <i className="fab fa-linkedin"></i>
                  </span>
                </Button>
                <Button as="a" href="#" color="dark">
                  <span className="icon">
                    <i className="fab fa-github"></i>
                  </span>
                </Button>
              </div>
            </Column>
          </Columns>
          <hr />
          <div className="content has-text-centered">
            <p>
              © 2024 QWANYX. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </Container>
      </Footer>
    </>
  );
}

export default App;