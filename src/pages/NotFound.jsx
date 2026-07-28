import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'

export default function NotFound({ message = 'That page doesn’t exist.' }) {
  return (
    <Layout>
      <div className="container section stack">
        <p className="eyebrow">Error 404</p>
        <h1 className="h1">Not found</h1>
        <p className="lede">{message}</p>
        <p><Link className="btn" to="/">Back to home</Link></p>
      </div>
    </Layout>
  )
}
