import './App.css'
import '@qwanyx/ui/dist/ui.css'

function App() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>QWANYX Modules Host</h1>
      <p>Ce serveur héberge les modules réutilisables via Module Federation.</p>
      <p>Port: 5000</p>
      <hr />
      <h2>Modules exposés:</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>./NavbarQwanyx</li>
        <li>./HeroGeneric</li>
        <li>./FooterGeneric</li>
        <li>./ServicesGrid</li>
        <li>./hooks/useAuth</li>
        <li>./hooks/useWorkspace</li>
      </ul>
    </div>
  )
}

export default App
