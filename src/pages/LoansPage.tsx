import { useEffect, useState } from 'react'
import { loanService } from '../services/loanService'
import { bookService } from '../services/bookService'

type Loan = { id: number; bookId: number; bookTitle: string; studentName: string; loanDate: string; status: string }
type Book = { id: number; title: string; stock: number }

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [form, setForm] = useState({ bookId: 0, studentName: '' })
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' })
  const [showAllBooks, setShowAllBooks] = useState(false)

  const load = async () => {
    try {
      setLoans(await loanService.getActive())
      setBooks(await bookService.getAll())
    } catch {
      setMessage({ type: 'error', text: 'Error al cargar datos' })
    }
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await loanService.create(form)
      setMessage({ type: 'success', text: 'Préstamo registrado' })
      setForm({ bookId: 0, studentName: '' })
      load()
    } catch (err:any) {
      const msg = err?.response?.data?.error ?? err?.response?.data?.message ?? 'Error del servidor'
      setMessage({ type: 'error', text: String(msg) })
    }
  }

  const handleReturn = async (id: number) => {
    try { 
      await loanService.returnLoan(id); 
      setMessage({ type: 'success', text: 'Préstamo devuelto' }); 
      load() 
    } catch { 
      setMessage({ type: 'error', text: 'Error al devolver' }) 
    }
  }

  const selectedBookHasNoStock = form.bookId !== 0 && books.find(b => b.id === form.bookId && b.stock === 0)

  return (
    <div className="container mt-4">
      <h1 className="display-4 mb-4">Gestión de Préstamos</h1>

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
          {message.text}
        </div>
      )}

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header">
              <h3 className="card-title mb-0">Registrar nuevo préstamo</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="bookId" className="form-label">Libro</label>
                  <select
                    id="bookId"
                    value={form.bookId}
                    onChange={e => setForm({ ...form, bookId: Number(e.target.value) })}
                    required
                    className="form-select"
                  >
                    <option value={0} disabled>Seleccionar libro con stock</option>
                    {(showAllBooks ? books : books.filter(b => b.stock > 0)).map(b => (
                      <option key={b.id} value={b.id}>
                        {b.title} (stock: {b.stock}){b.stock === 0 ? ' — sin stock' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-check mb-3">
                  <input
                    id="showAllBooks"
                    type="checkbox"
                    checked={showAllBooks}
                    onChange={e => setShowAllBooks(e.target.checked)}
                    className="form-check-input"
                  />
                  <label htmlFor="showAllBooks" className="form-check-label">Mostrar libros sin stock</label>
                </div>

                {selectedBookHasNoStock && (
                  <div className="alert alert-warning p-2">
                    Atención: este libro no tiene stock.
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="studentName" className="form-label">Nombre del Estudiante</label>
                  <input
                    id="studentName"
                    value={form.studentName}
                    onChange={e => setForm({ ...form, studentName: e.target.value })}
                    required
                    className="form-control"
                  />
                </div>
                <div className="d-grid">
                  <button
                    type="submit"
                    disabled={selectedBookHasNoStock}
                    className="btn btn-primary"
                  >
                    Registrar Préstamo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <h2>Préstamos Activos</h2>
          <div className="row row-cols-1 row-cols-lg-2 g-4">
            {loans.length > 0 ? loans.map(l => (
              <div key={l.id} className="col">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{l.bookTitle}</h5>
                    <p className="card-text">
                      Prestado a: <strong>{l.studentName}</strong>
                    </p>
                    <p className="card-text"><small className="text-muted">Fecha: {new Date(l.loanDate).toLocaleDateString()}</small></p>
                    <p><span className="badge bg-success">{l.status}</span></p>
                  </div>
                  <div className="card-footer bg-light text-end">
                    <button onClick={() => handleReturn(l.id)} className="btn btn-success btn-sm">
                      Marcar como Devuelto
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-12">
                <div className="alert alert-info">
                  <p className="mb-0">No hay préstamos activos en este momento.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
