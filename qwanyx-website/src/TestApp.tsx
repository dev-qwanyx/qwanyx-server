import React from 'react';

function TestApp() {
  return (
    <div>
      <h1 className="title">Test: Basic HTML Works</h1>
      <button className="button is-primary">Bulma Button Test</button>
      <div className="notification is-info">
        If you can see this styled, Bulma CSS is loaded!
      </div>
    </div>
  );
}

export default TestApp;