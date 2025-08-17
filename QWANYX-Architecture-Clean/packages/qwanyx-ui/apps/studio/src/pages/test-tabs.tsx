import React from 'react';
import { SimpleTabs, Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../src/components/Tabs';
import { Button } from '../../../../src/components/Button';

export default function TestTabsPage() {
  return (
    <div style={{ padding: '40px', backgroundColor: 'rgb(var(--background))' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px' }}>
        Tab Component Test - Ripple Effects
      </h1>

      {/* Test regular buttons first to ensure ripple works */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Regular Buttons (Ripple Test)
        </h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button variant="solid" showRipple={true}>Solid Button</Button>
          <Button variant="outline" showRipple={true}>Outline Button</Button>
          <Button variant="ghost" showRipple={true}>Ghost Button</Button>
          <Button variant="tab" showRipple={true}>Tab Button</Button>
          <Button variant="pill" showRipple={true}>Pill Button</Button>
          <Button variant="segment" showRipple={true}>Segment Button</Button>
          <Button variant="nav" showRipple={true}>Nav Button</Button>
        </div>
      </div>

      {/* Test tabs with different variants */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Line Tabs (Default)
        </h2>
        <SimpleTabs
          tabs={[
            { id: 'tab1', label: 'First Tab', content: <div>Content for first tab with ripple effect</div> },
            { id: 'tab2', label: 'Second Tab', content: <div>Content for second tab</div> },
            { id: 'tab3', label: 'Third Tab', content: <div>Content for third tab</div> },
          ]}
          variant="line"
        />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Pill Tabs
        </h2>
        <SimpleTabs
          tabs={[
            { id: 'pill1', label: 'First Pill', content: <div>Pill tab content 1</div> },
            { id: 'pill2', label: 'Second Pill', content: <div>Pill tab content 2</div> },
            { id: 'pill3', label: 'Third Pill', content: <div>Pill tab content 3</div> },
          ]}
          variant="pills"
        />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Segment Tabs
        </h2>
        <SimpleTabs
          tabs={[
            { id: 'seg1', label: 'Segment 1', content: <div>Segment content 1</div> },
            { id: 'seg2', label: 'Segment 2', content: <div>Segment content 2</div> },
            { id: 'seg3', label: 'Segment 3', content: <div>Segment content 3</div> },
          ]}
          variant="segment"
        />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Nav Tabs
        </h2>
        <SimpleTabs
          tabs={[
            { id: 'nav1', label: 'Navigation 1', content: <div>Nav content 1</div> },
            { id: 'nav2', label: 'Navigation 2', content: <div>Nav content 2</div> },
            { id: 'nav3', label: 'Navigation 3', content: <div>Nav content 3</div> },
          ]}
          variant="nav"
        />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Manual Tabs Construction
        </h2>
        <Tabs defaultValue="manual1">
          <TabsList variant="line">
            <TabsTrigger value="manual1">Manual Tab 1</TabsTrigger>
            <TabsTrigger value="manual2">Manual Tab 2</TabsTrigger>
            <TabsTrigger value="manual3">Manual Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="manual1">
            <div>Manual tab content 1 - Testing ripple on click</div>
          </TabsContent>
          <TabsContent value="manual2">
            <div>Manual tab content 2</div>
          </TabsContent>
          <TabsContent value="manual3">
            <div>Manual tab content 3</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}