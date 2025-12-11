import { Routes, Route, NavLink } from 'react-router-dom'
import BooksPage from './pages/BooksPage'
import LoansPage from './pages/LoansPage'

export default function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand">
            Biblioteca
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Libros
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/loans" className="nav-link">
                  Préstamos
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<BooksPage />} />
          <Route path="/loans" element={<LoansPage />} />
        </Routes>
      </main>
    </>
  )
}

