import { useEffect, useState } from 'react'
import { bookService } from '../services/bookService'
import { loanService } from '../services/loanService'

type Book = { id: number; title: string; author: string; isbn: string; stock: number }

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Book | null>(null)
  const [form, setForm] = useState({ title: '', author: '', isbn: '', stock: 0 })
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' })

  const load = async () => {
    setLoading(true)
    try {
      const data = await bookService.getAll()
      setBooks(data)
    } catch {
      setMessage({ type: 'error', text: 'Error al cargar libros' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const clearForm = () => { setEditing(null); setForm({ title: '', author: '', isbn: '', stock: 0 }) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing) {
        await bookService.update(editing.id, form)
        setMessage({ type: 'success', text: 'Libro actualizado' })
      } else {
        await bookService.create(form)
        setMessage({ type: 'success', text: 'Libro creado' })
      }
      clearForm(); load()
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? err?.response?.data?.message ?? 'Error del servidor'
      setMessage({ type: 'error', text: String(msg) })
    }
  }

  const handleEdit = (b: Book) => { setEditing(b); setForm({ title: b.title, author: b.author, isbn: b.isbn, stock: b.stock }) }

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar libro?')) return
    try {
      const active = await loanService.getActive()
      const hasActive = Array.isArray(active) && active.some((l: any) => l.bookId === id)
      if (hasActive) {
        setMessage({ type: 'error', text: 'No se puede eliminar: existen préstamos activos para este libro. Devuelva los préstamos primero.' })
        return
      }
    } catch (checkErr) {
      console.warn('Could not check active loans before delete', checkErr)
    }
    try {
      await bookService.delete(id)
      setMessage({ type: 'success', text: 'Libro eliminado' })
      load()
    } catch (err:any) {
      const msg = err?.response?.data?.error ?? err?.response?.statusText ?? 'Error al eliminar'
      setMessage({ type: 'error', text: String(msg) })
      console.error('Delete book error:', err?.response ?? err)
    }
  }

  const handleDarBaja = async (id: number) => {
    const reason = prompt('Motivo (opcional)') ?? undefined
    try {
      const res = await bookService.darBaja(id, { reason })
      setMessage({ type: 'success', text: res?.message ?? 'Artículo dado de baja' })
      load()
    } catch (err:any) { setMessage({ type: 'error', text: err?.response?.data?.error ?? 'Error al dar de baja' }) }
  }

  return (
    <div className="container mt-4">
      <h1 className="display-4 mb-4">Gestión de Libros</h1>

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
          {message.text}
        </div>
      )}

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header">
              <h3 className="card-title mb-0">{editing ? 'Editar libro' : 'Añadir nuevo libro'}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Título</label>
                  <input id="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="form-control" />
                </div>
                <div className="mb-3">
                  <label htmlFor="author" className="form-label">Autor</label>
                  <input id="author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required className="form-control" />
                </div>
                <div className="mb-3">
                  <label htmlFor="isbn" className="form-label">ISBN</label>
                  <input id="isbn" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} required className="form-control" />
                </div>
                <div className="mb-3">
                  <label htmlFor="stock" className="form-label">Stock</label>
                  <input id="stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} required className="form-control" />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editing ? 'Actualizar Libro' : 'Guardar Libro'}
                  </button>
                  <button type="button" onClick={clearForm} className="btn btn-secondary">
                    Limpiar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando libros...</span>
              </div>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-lg-2 g-4">
              {books.map(b => (
                <div key={b.id} className="col">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="card-title text-primary">{b.title}</h5>
                      <p className="card-subtitle mb-2 text-muted">por {b.author}</p>
                      <p className="card-text"><small>ISBN: {b.isbn}</small></p>
                      <p>
                        Stock: <span className={`badge ${b.stock > 0 ? 'bg-success' : 'bg-danger'}`}>{b.stock}</span>
                      </p>
                    </div>
                    <div className="card-footer bg-light d-flex justify-content-end gap-2">
                      <button onClick={() => handleEdit(b)} className="btn btn-secondary btn-sm">Editar</button>
                      <button onClick={() => handleDelete(b.id)} className="btn btn-danger btn-sm">Eliminar</button>
                      <button onClick={() => handleDarBaja(b.id)} className="btn btn-warning btn-sm">Dar Baja</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
