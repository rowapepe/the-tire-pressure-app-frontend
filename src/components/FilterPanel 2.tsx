import { Button, Col, Form, Row } from 'react-bootstrap'

export interface Filters {
  query: string
  category: string
  radius: number
  sort: 'title' | 'price' | 'radius'
}

interface FilterPanelProps {
  filters: Filters
  onChange: (filters: Filters) => void
  resultCount: number
}

export function FilterPanel({ filters, onChange, resultCount }: FilterPanelProps) {
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => onChange({ ...filters, [key]: value })

  return (
    <Form className="filter-panel" onSubmit={(event) => event.preventDefault()}>
      <Row className="g-2">
        <Col xs={12}>
          <Form.Label>Название</Form.Label>
          <Form.Control value={filters.query} onChange={(event) => update('query', event.target.value)} placeholder="Например, Michelin" />
        </Col>
        <Col xs={6}>
          <Form.Label>Тема</Form.Label>
          <Form.Select value={filters.category} onChange={(event) => update('category', event.target.value)}>
            <option value="">Все</option>
            <option value="Летние">Летние</option>
            <option value="Зимние">Зимние</option>
            <option value="Всесезонные">Всесезонные</option>
          </Form.Select>
        </Col>
        <Col xs={6}>
          <Form.Label>Сортировка</Form.Label>
          <Form.Select value={filters.sort} onChange={(event) => update('sort', event.target.value as Filters['sort'])}>
            <option value="title">По названию</option>
            <option value="price">По цене</option>
            <option value="radius">По радиусу</option>
          </Form.Select>
        </Col>
        <Col xs={12}>
          <Form.Label>Минимальный радиус: R{filters.radius}</Form.Label>
          <Form.Range min={13} max={22} value={filters.radius} onChange={(event) => update('radius', Number(event.target.value))} />
        </Col>
      </Row>
      <div className="d-flex justify-content-between align-items-center mt-2">
        <small className="text-muted">Найдено: {resultCount}</small>
        <Button variant="outline-secondary" size="sm" onClick={() => onChange({ query: '', category: '', radius: 13, sort: 'title' })}>Сбросить</Button>
      </div>
    </Form>
  )
}
