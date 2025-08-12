import React, { useState, useEffect } from 'react';
import { ThemeEditor } from './ThemeEditor';
import { AnimationShowcase } from './AnimationShowcase';
import { ThemeLibraryEnhanced } from './ThemeLibraryEnhanced';
import { 
  Button,
  Container,
  Section,
  Columns,
  Column,
  Box,
  Card,
  CardHeader,
  CardHeaderTitle,
  CardHeaderIcon,
  CardImage,
  CardContent,
  CardFooter,
  CardFooterItem,
  Hero,
  HeroHead,
  HeroBody,
  HeroFoot,
  Title,
  Subtitle,
  Field,
  Control,
  Input,
  Select,
  Textarea,
  Checkbox,
  Radio,
  Notification,
  Tag,
  Tags,
  Progress,
  Message,
  MessageHeader,
  MessageBody,
  Navbar,
  NavbarBrand,
  NavbarBurger,
  NavbarMenu,
  NavbarStart,
  NavbarEnd,
  NavbarItem,
  NavbarLink,
  NavbarDropdown,
  NavbarDivider,
  Modal,
  ModalBackground,
  ModalContent,
  ModalClose,
  ModalCard,
  ModalCardHead,
  ModalCardTitle,
  ModalCardBody,
  ModalCardFoot,
  Tabs,
  Tab,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownContent,
  DropdownItem,
  DropdownDivider,
  Menu,
  MenuLabel,
  MenuList,
  Breadcrumb,
  BreadcrumbItem,
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
  PaginationList,
  Image,
  Table,
  Media,
  MediaLeft,
  MediaRight,
  MediaContent,
  Level,
  LevelLeft,
  LevelRight,
  LevelItem,
  Footer
} from '@qwanyx/bulma-components';

function App() {
  const [activeTab, setActiveTab] = useState('themes');
  const [isModalActive, setIsModalActive] = useState(false);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [isNavbarActive, setIsNavbarActive] = useState(false);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [autoThemeEnabled, setAutoThemeEnabled] = useState(true);
  
  // Store custom theme in state to persist across tab changes
  const [customTheme, setCustomTheme] = useState(() => {
    const saved = localStorage.getItem('qwanyx-custom-theme');
    return saved ? JSON.parse(saved) : null;
  });
  
  // Track current theme being edited
  const [currentThemeName, setCurrentThemeName] = useState<string>('Custom Theme');
  const [currentThemeId, setCurrentThemeId] = useState<string | undefined>();

  // Convert hex to HSL
  const hexToHSL = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Apply saved theme on load
  useEffect(() => {
    const savedTheme = localStorage.getItem('qwanyx-current-theme');
    if (savedTheme) {
      const theme = JSON.parse(savedTheme);
      const root = document.documentElement;
      const mainColors = ['primary', 'link', 'info', 'success', 'warning', 'danger'];
      
      // Apply main colors with HSL conversion
      mainColors.forEach(colorName => {
        const value = theme[colorName];
        if (value && value.startsWith('#')) {
          const hsl = hexToHSL(value);
          root.style.setProperty(`--bulma-${colorName}-h`, `${hsl.h}deg`);
          root.style.setProperty(`--bulma-${colorName}-s`, `${hsl.s}%`);
          root.style.setProperty(`--bulma-${colorName}-l`, `${hsl.l}%`);
          root.style.setProperty(`--bulma-${colorName}`, value);
        }
      });
      
      // Apply other colors
      Object.entries(theme).forEach(([key, value]) => {
        if (!mainColors.includes(key)) {
          root.style.setProperty(`--bulma-${key}`, value as string);
        }
      });
    }
  }, []);

  // Detect system theme preference
  useEffect(() => {
    const detectSystemTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setSystemTheme(isDark ? 'dark' : 'light');
      
      if (autoThemeEnabled) {
        // Apply Bulma's data-theme attribute for automatic theme switching
        if (isDark) {
          document.documentElement.setAttribute('data-theme', 'dark');
          document.documentElement.classList.add('theme-dark');
          document.documentElement.classList.remove('theme-light');
        } else {
          document.documentElement.removeAttribute('data-theme');
          document.documentElement.classList.add('theme-light');
          document.documentElement.classList.remove('theme-dark');
        }
      }
    };

    // Initial detection
    detectSystemTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectSystemTheme);

    return () => {
      mediaQuery.removeEventListener('change', detectSystemTheme);
    };
  }, [autoThemeEnabled]);

  return (
    <div>
      {/* Header */}
      <Hero color="primary">
        <HeroBody>
          <Title>QWANYX Components</Title>
          <Subtitle>Complete Bulma React Component Library</Subtitle>
          <div className="notification is-info is-light mt-4">
            <p>
              <strong>Browser Theme Detection: </strong>
              Your system is currently using <strong>{systemTheme}</strong> theme.
              {autoThemeEnabled ? ' Auto-theme is enabled.' : ' Auto-theme is disabled.'}
            </p>
            <Button 
              size="small" 
              color={autoThemeEnabled ? 'success' : 'warning'}
              onClick={() => setAutoThemeEnabled(!autoThemeEnabled)}
              style={{ marginTop: '0.5rem' }}
            >
              {autoThemeEnabled ? '✓ Auto Theme Enabled' : '○ Auto Theme Disabled'}
            </Button>
          </div>
        </HeroBody>
      </Hero>

      <Container>
        {/* Navigation Tabs */}
        <Tabs size="large" boxed style={{ marginTop: '2rem' }}>
          <Tab isActive={activeTab === 'themes'} onClick={() => setActiveTab('themes')}>
            <a>
              <span className="icon is-small"><i className="fas fa-paint-brush"></i></span>
              <span>Theme Library</span>
            </a>
          </Tab>
          <Tab isActive={activeTab === 'theme'} onClick={() => setActiveTab('theme')}>
            <a>
              <span className="icon is-small"><i className="fas fa-palette"></i></span>
              <span>Theme Editor</span>
            </a>
          </Tab>
          <Tab isActive={activeTab === 'elements'} onClick={() => setActiveTab('elements')}>
            <a>
              <span className="icon is-small"><i className="fas fa-square"></i></span>
              <span>Elements</span>
            </a>
          </Tab>
          <Tab isActive={activeTab === 'layout'} onClick={() => setActiveTab('layout')}>
            <a>
              <span className="icon is-small"><i className="fas fa-th"></i></span>
              <span>Layout</span>
            </a>
          </Tab>
          <Tab isActive={activeTab === 'forms'} onClick={() => setActiveTab('forms')}>
            <a>
              <span className="icon is-small"><i className="fas fa-wpforms"></i></span>
              <span>Forms</span>
            </a>
          </Tab>
          <Tab isActive={activeTab === 'components'} onClick={() => setActiveTab('components')}>
            <a>
              <span className="icon is-small"><i className="fas fa-layer-group"></i></span>
              <span>Components</span>
            </a>
          </Tab>
          <Tab isActive={activeTab === 'navigation'} onClick={() => setActiveTab('navigation')}>
            <a>
              <span className="icon is-small"><i className="fas fa-compass"></i></span>
              <span>Navigation</span>
            </a>
          </Tab>
          <Tab isActive={activeTab === 'animations'} onClick={() => setActiveTab('animations')}>
            <a>
              <span className="icon is-small"><i className="fas fa-magic"></i></span>
              <span>Animations</span>
            </a>
          </Tab>
        </Tabs>

        {/* Content Area */}
        <Box style={{ minHeight: '500px', marginTop: '2rem' }}>
          {activeTab === 'themes' && (
            <ThemeLibraryEnhanced 
              onThemeSelect={(name, id) => {
                setCurrentThemeName(name);
                setCurrentThemeId(id);
              }}
            />
          )}
          
          {activeTab === 'theme' && (
            <ThemeEditor 
              onThemeChange={(theme) => {
                setCustomTheme(theme);
                localStorage.setItem('qwanyx-custom-theme', JSON.stringify(theme));
              }}
              initialTheme={customTheme}
              currentThemeName={currentThemeName}
              currentThemeId={currentThemeId}
            />
          )}
          
          {activeTab === 'elements' && (
            <div>
              <Title size={4}>Basic Elements</Title>
              
              {/* Buttons */}
              <div className="mb-5">
                <Title size={5}>Buttons</Title>
                <div className="buttons">
                  <Button>Default</Button>
                  <Button color="primary">Primary</Button>
                  <Button color="link">Link</Button>
                  <Button color="info">Info</Button>
                  <Button color="success">Success</Button>
                  <Button color="warning">Warning</Button>
                  <Button color="danger">Danger</Button>
                </div>
                <div className="buttons">
                  <Button size="small">Small</Button>
                  <Button size="medium">Medium</Button>
                  <Button size="large">Large</Button>
                  <Button color="primary" isOutlined>Outlined</Button>
                  <Button color="info" isLight>Light</Button>
                  <Button color="success" isRounded>Rounded</Button>
                  <Button color="warning" isLoading>Loading</Button>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-5">
                <Title size={5}>Tags</Title>
                <Tags>
                  <Tag>One</Tag>
                  <Tag color="primary">Two</Tag>
                  <Tag color="info">Three</Tag>
                  <Tag color="success">Four</Tag>
                  <Tag color="warning">Five</Tag>
                  <Tag color="danger">Six</Tag>
                </Tags>
                <Tags addons>
                  <Tag color="dark">npm</Tag>
                  <Tag color="info">0.1.0</Tag>
                </Tags>
                <div className="mt-2">
                  <Tag size="medium" rounded>Medium Rounded</Tag>
                  <Tag size="large" color="primary" light>Large Light</Tag>
                  <Tag delete />
                </div>
              </div>

              {/* Notifications */}
              <div className="mb-5">
                <Title size={5}>Notifications</Title>
                <Notification>
                  <button className="delete"></button>
                  Default notification with close button
                </Notification>
                <Notification color="primary" light>
                  Primary light notification
                </Notification>
                <Notification color="info">
                  <strong>Info!</strong> This is an info notification.
                </Notification>
                <Notification color="success">
                  <strong>Success!</strong> Your changes have been saved.
                </Notification>
                <Notification color="warning">
                  <strong>Warning!</strong> Please review before proceeding.
                </Notification>
                <Notification color="danger">
                  <strong>Error!</strong> Something went wrong.
                </Notification>
              </div>

              {/* Progress */}
              <div className="mb-5">
                <Title size={5}>Progress</Title>
                <Progress value="15" max="100">15%</Progress>
                <Progress color="primary" value="30" max="100">30%</Progress>
                <Progress color="info" value="45" max="100">45%</Progress>
                <Progress color="success" value="60" max="100">60%</Progress>
                <Progress color="warning" value="75" max="100">75%</Progress>
                <Progress color="danger" value="90" max="100">90%</Progress>
                <Progress color="primary" size="small" value="50" max="100" />
                <Progress color="info" size="large" value="80" max="100" />
              </div>

              {/* Images */}
              <div className="mb-5">
                <Title size={5}>Images</Title>
                <Columns>
                  <Column>
                    <Image size="128x128">
                      <img src="https://picsum.photos/128/128" alt="Random square image" />
                    </Image>
                  </Column>
                  <Column>
                    <Image ratio="square">
                      <img src="https://picsum.photos/480/480" alt="Square ratio" />
                    </Image>
                  </Column>
                  <Column>
                    <Image ratio="16by9">
                      <img src="https://picsum.photos/640/360" alt="16by9 ratio" />
                    </Image>
                  </Column>
                </Columns>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div>
              <Title size={4}>Layout Components</Title>
              
              {/* Container */}
              <div className="mb-5">
                <Title size={5}>Container</Title>
                <Container className="has-background-light p-4 mb-4">
                  <div className="content">
                    <p>Standard Container</p>
                  </div>
                </Container>
                <Container fluid className="has-background-light p-4">
                  <div className="content">
                    <p>Fluid Container</p>
                  </div>
                </Container>
              </div>

              {/* Columns */}
              <div className="mb-5">
                <Title size={5}>Columns Grid</Title>
                <Columns>
                  <Column size="one-quarter">
                    <Box className="has-background-warning-light">
                      <div className="content">1/4</div>
                    </Box>
                  </Column>
                  <Column size="one-quarter">
                    <Box className="has-background-warning-light">
                      <div className="content">1/4</div>
                    </Box>
                  </Column>
                  <Column size="half">
                    <Box className="has-background-warning-light">
                      <div className="content">1/2</div>
                    </Box>
                  </Column>
                </Columns>
              </div>

              {/* Level */}
              <div className="mb-5">
                <Title size={5}>Level</Title>
                <Level>
                  <LevelLeft>
                    <LevelItem>
                      <Title size={5}>123 posts</Title>
                    </LevelItem>
                    <LevelItem>
                      <Field hasAddons>
                        <Control>
                          <Input placeholder="Find a post" />
                        </Control>
                        <Control>
                          <Button>Search</Button>
                        </Control>
                      </Field>
                    </LevelItem>
                  </LevelLeft>
                  <LevelRight>
                    <LevelItem><strong>All</strong></LevelItem>
                    <LevelItem><a>Published</a></LevelItem>
                    <LevelItem><a>Drafts</a></LevelItem>
                    <LevelItem><Button color="success">New</Button></LevelItem>
                  </LevelRight>
                </Level>
              </div>

              {/* Media Object */}
              <div className="mb-5">
                <Title size={5}>Media Object</Title>
                <Media>
                  <MediaLeft>
                    <Image size="64x64">
                      <img src="https://i.pravatar.cc/64?img=3" alt="Avatar" />
                    </Image>
                  </MediaLeft>
                  <MediaContent>
                    <p><strong>John Smith</strong> <small>@johnsmith</small> <small>31m</small></p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </MediaContent>
                  <MediaRight>
                    <button className="delete"></button>
                  </MediaRight>
                </Media>
              </div>

              {/* Hero */}
              <div className="mb-5">
                <Title size={5}>Hero</Title>
                <Hero color="info">
                  <HeroBody>
                    <Title>Hero title</Title>
                    <Subtitle>Hero subtitle</Subtitle>
                  </HeroBody>
                </Hero>
              </div>
            </div>
          )}

          {activeTab === 'forms' && (
            <div>
              <Title size={4}>Form Components</Title>
              
              {/* Input Fields */}
              <div className="mb-5">
                <Title size={5}>Input Fields</Title>
                <Field>
                  <label className="label">Name</label>
                  <Control>
                    <Input placeholder="Text input" />
                  </Control>
                </Field>
                
                <Field>
                  <label className="label">Email</label>
                  <Control>
                    <Input type="email" placeholder="Email input" color="success" />
                  </Control>
                  <p className="help is-success">This email is valid</p>
                </Field>

                <Field>
                  <label className="label">Password</label>
                  <Control>
                    <Input type="password" placeholder="Password" color="danger" />
                  </Control>
                  <p className="help is-danger">Password is too short</p>
                </Field>
              </div>

              {/* Select */}
              <div className="mb-5">
                <Title size={5}>Select</Title>
                <Field>
                  <label className="label">Subject</label>
                  <Control>
                    <Select>
                      <option>Select dropdown</option>
                      <option>Option 1</option>
                      <option>Option 2</option>
                      <option>Option 3</option>
                    </Select>
                  </Control>
                </Field>

                <Field>
                  <Control>
                    <Select color="primary" size="large" rounded>
                      <option>Large rounded select</option>
                      <option>Option A</option>
                      <option>Option B</option>
                    </Select>
                  </Control>
                </Field>
              </div>

              {/* Textarea */}
              <div className="mb-5">
                <Title size={5}>Textarea</Title>
                <Field>
                  <label className="label">Message</label>
                  <Control>
                    <Textarea placeholder="Textarea" />
                  </Control>
                </Field>

                <Field>
                  <Control>
                    <Textarea color="info" placeholder="Info textarea with fixed size" fixedSize rows={4} />
                  </Control>
                </Field>
              </div>

              {/* Checkbox & Radio */}
              <div className="mb-5">
                <Title size={5}>Checkbox & Radio</Title>
                <Field>
                  <Control>
                    <Checkbox label=" Remember me" />
                  </Control>
                </Field>
                
                <Field>
                  <Control>
                    <Radio name="answer" label=" Yes" />
                  </Control>
                  <Control>
                    <Radio name="answer" label=" No" />
                  </Control>
                </Field>
              </div>

              {/* Combined Fields */}
              <div className="mb-5">
                <Title size={5}>Field Groups</Title>
                <Field grouped>
                  <Control>
                    <Button color="primary">Submit</Button>
                  </Control>
                  <Control>
                    <Button color="link" isLight>Cancel</Button>
                  </Control>
                </Field>

                <Field hasAddons>
                  <Control>
                    <Input placeholder="Find a repository" />
                  </Control>
                  <Control>
                    <Button color="info">Search</Button>
                  </Control>
                </Field>
              </div>
            </div>
          )}

          {activeTab === 'components' && (
            <div>
              <Title size={4}>UI Components</Title>
              
              {/* Cards */}
              <div className="mb-5">
                <Title size={5}>Cards</Title>
                <Columns>
                  <Column size="one-third">
                    <Card>
                      <CardHeader>
                        <CardHeaderTitle>Card Title</CardHeaderTitle>
                        <CardHeaderIcon>
                          <span className="icon">
                            <i className="fas fa-angle-down"></i>
                          </span>
                        </CardHeaderIcon>
                      </CardHeader>
                      <CardContent>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                      </CardContent>
                      <CardFooter>
                        <CardFooterItem as="a">Save</CardFooterItem>
                        <CardFooterItem as="a">Edit</CardFooterItem>
                        <CardFooterItem as="a">Delete</CardFooterItem>
                      </CardFooter>
                    </Card>
                  </Column>
                  <Column size="one-third">
                    <Card>
                      <CardImage>
                        <Image ratio="4by3">
                          <img src="https://picsum.photos/640/480?random=1" alt="Random landscape" />
                        </Image>
                      </CardImage>
                      <CardContent>
                        <Media>
                          <MediaLeft>
                            <Image size="48x48">
                              <img src="https://i.pravatar.cc/48?img=8" alt="User avatar" />
                            </Image>
                          </MediaLeft>
                          <MediaContent>
                            <p className="title is-4">John Smith</p>
                            <p className="subtitle is-6">@johnsmith</p>
                          </MediaContent>
                        </Media>
                        <div className="content">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                          <br />
                          <time dateTime="2024-1-1">11:09 PM - 1 Jan 2024</time>
                        </div>
                      </CardContent>
                    </Card>
                  </Column>
                </Columns>
              </div>

              {/* Messages */}
              <div className="mb-5">
                <Title size={5}>Messages</Title>
                <Message>
                  <MessageHeader>
                    <p>Hello World</p>
                    <button className="delete"></button>
                  </MessageHeader>
                  <MessageBody>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </MessageBody>
                </Message>
                
                <Message color="info">
                  <MessageBody>
                    <strong>Info message</strong> without header
                  </MessageBody>
                </Message>

                <Message color="success">
                  <MessageBody>
                    <strong>Success!</strong> Your request has been processed.
                  </MessageBody>
                </Message>
              </div>

              {/* Modal */}
              <div className="mb-5">
                <Title size={5}>Modal</Title>
                <Button color="primary" onClick={() => setIsModalActive(true)}>
                  Open Modal
                </Button>
                
                <Modal isActive={isModalActive}>
                  <ModalBackground onClick={() => setIsModalActive(false)} />
                  <ModalCard>
                    <ModalCardHead>
                      <ModalCardTitle>Modal Title</ModalCardTitle>
                      <button className="delete" onClick={() => setIsModalActive(false)}></button>
                    </ModalCardHead>
                    <ModalCardBody>
                      <p>This is the modal content.</p>
                      <p>You can put any content here.</p>
                    </ModalCardBody>
                    <ModalCardFoot>
                      <Button color="success" onClick={() => setIsModalActive(false)}>Save</Button>
                      <Button onClick={() => setIsModalActive(false)}>Cancel</Button>
                    </ModalCardFoot>
                  </ModalCard>
                </Modal>
              </div>

              {/* Table */}
              <div className="mb-5">
                <Title size={5}>Table</Title>
                <Table striped hoverable fullwidth>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>John Doe</td>
                      <td>john@example.com</td>
                      <td>Admin</td>
                      <td>
                        <Button size="small" color="info">Edit</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Jane Smith</td>
                      <td>jane@example.com</td>
                      <td>User</td>
                      <td>
                        <Button size="small" color="info">Edit</Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === 'navigation' && (
            <div>
              <Title size={4}>Navigation Components</Title>
              
              {/* Navbar */}
              <div className="mb-5">
                <Title size={5}>Navbar</Title>
                <Navbar color="light">
                  <NavbarBrand>
                    <NavbarItem as="a">
                      <strong>QWANYX</strong>
                    </NavbarItem>
                    <NavbarBurger isActive={isNavbarActive} onClick={() => setIsNavbarActive(!isNavbarActive)} />
                  </NavbarBrand>
                  <NavbarMenu isActive={isNavbarActive}>
                    <NavbarStart>
                      <NavbarItem>Home</NavbarItem>
                      <NavbarItem>Documentation</NavbarItem>
                      <NavbarItem hasDropdown isHoverable>
                        <NavbarLink>More</NavbarLink>
                        <NavbarDropdown>
                          <NavbarItem>About</NavbarItem>
                          <NavbarItem>Jobs</NavbarItem>
                          <NavbarDivider />
                          <NavbarItem>Report an issue</NavbarItem>
                        </NavbarDropdown>
                      </NavbarItem>
                    </NavbarStart>
                    <NavbarEnd>
                      <NavbarItem>
                        <div className="buttons">
                          <Button color="primary">Sign up</Button>
                          <Button isLight>Log in</Button>
                        </div>
                      </NavbarItem>
                    </NavbarEnd>
                  </NavbarMenu>
                </Navbar>
              </div>

              {/* Breadcrumb */}
              <div className="mb-5">
                <Title size={5}>Breadcrumb</Title>
                <Breadcrumb>
                  <BreadcrumbItem><a>Home</a></BreadcrumbItem>
                  <BreadcrumbItem><a>Documentation</a></BreadcrumbItem>
                  <BreadcrumbItem><a>Components</a></BreadcrumbItem>
                  <BreadcrumbItem isActive><a>Breadcrumb</a></BreadcrumbItem>
                </Breadcrumb>

                <Breadcrumb separator="arrow">
                  <BreadcrumbItem><a>Products</a></BreadcrumbItem>
                  <BreadcrumbItem><a>Electronics</a></BreadcrumbItem>
                  <BreadcrumbItem isActive><a>Phones</a></BreadcrumbItem>
                </Breadcrumb>
              </div>

              {/* Dropdown */}
              <div className="mb-5">
                <Title size={5}>Dropdown</Title>
                <Dropdown isActive={isDropdownActive} isHoverable>
                  <DropdownTrigger>
                    <Button onClick={() => setIsDropdownActive(!isDropdownActive)}>
                      <span>Dropdown button</span>
                      <span className="icon is-small">
                        <i className="fas fa-angle-down"></i>
                      </span>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownContent>
                      <DropdownItem>Item 1</DropdownItem>
                      <DropdownItem>Item 2</DropdownItem>
                      <DropdownItem isActive>Active item</DropdownItem>
                      <DropdownDivider />
                      <DropdownItem>More items</DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
              </div>

              {/* Menu */}
              <div className="mb-5">
                <Title size={5}>Menu</Title>
                <Columns>
                  <Column size="one-quarter">
                    <Menu>
                      <MenuLabel>General</MenuLabel>
                      <MenuList>
                        <li><a>Dashboard</a></li>
                        <li><a>Customers</a></li>
                      </MenuList>
                      <MenuLabel>Administration</MenuLabel>
                      <MenuList>
                        <li><a>Team Settings</a></li>
                        <li>
                          <a className="is-active">Manage Your Team</a>
                          <ul>
                            <li><a>Members</a></li>
                            <li><a>Plugins</a></li>
                            <li><a>Add a member</a></li>
                          </ul>
                        </li>
                      </MenuList>
                      <MenuLabel>Transactions</MenuLabel>
                      <MenuList>
                        <li><a>Payments</a></li>
                        <li><a>Transfers</a></li>
                        <li><a>Balance</a></li>
                      </MenuList>
                    </Menu>
                  </Column>
                </Columns>
              </div>

              {/* Pagination */}
              <div className="mb-5">
                <Title size={5}>Pagination</Title>
                <Pagination>
                  <PaginationPrevious>Previous</PaginationPrevious>
                  <PaginationNext>Next page</PaginationNext>
                  <PaginationList>
                    <li><PaginationLink>1</PaginationLink></li>
                    <li><PaginationEllipsis /></li>
                    <li><PaginationLink>45</PaginationLink></li>
                    <li><PaginationLink isCurrent>46</PaginationLink></li>
                    <li><PaginationLink>47</PaginationLink></li>
                    <li><PaginationEllipsis /></li>
                    <li><PaginationLink>86</PaginationLink></li>
                  </PaginationList>
                </Pagination>
              </div>

              {/* Tabs */}
              <div className="mb-5">
                <Title size={5}>Tabs</Title>
                <Tabs>
                  <Tab isActive><a>Pictures</a></Tab>
                  <Tab><a>Music</a></Tab>
                  <Tab><a>Videos</a></Tab>
                  <Tab><a>Documents</a></Tab>
                </Tabs>

                <Tabs alignment="centered" boxed>
                  <Tab isActive><a>All</a></Tab>
                  <Tab><a>Pending</a></Tab>
                  <Tab><a>Completed</a></Tab>
                </Tabs>

                <Tabs toggleRounded fullwidth>
                  <Tab isActive><a>All</a></Tab>
                  <Tab><a>Open</a></Tab>
                  <Tab><a>Closed</a></Tab>
                  <Tab><a>Archived</a></Tab>
                </Tabs>
              </div>
            </div>
          )}

          {activeTab === 'animations' && (
            <AnimationShowcase />
          )}
        </Box>

        {/* Footer */}
        <Footer style={{ marginTop: '3rem' }}>
          <div className="content has-text-centered">
            <p>
              <strong>QWANYX Components</strong> - A complete Bulma React component library
            </p>
            <p>
              Built with React, TypeScript, and Bulma CSS
            </p>
          </div>
        </Footer>
      </Container>
    </div>
  );
}

export default App;