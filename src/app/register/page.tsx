'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form, Button, Card } from 'react-bootstrap'

export default function RegisterPage() {
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [raca, setRaca] = useState('')
  const [descricao, setDescricao] = useState('')
  const [fotoPerfil, setFotoPerfil] = useState('')

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoPerfil(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRegistro = () => {
    const perfil = {
      nome,
      raca,
      descricao,
      fotoPerfil: fotoPerfil || 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
    }

    localStorage.setItem('perfilDog', JSON.stringify(perfil))
    router.push('/profile')
  }

  return (
    <Card className="p-4 rounded-4 shadow text-light mx-auto" style={{ maxWidth: 500, backgroundColor: '#232946' }}>
      <h2 className="text-center mb-4" style={{ color: '#eebbc3' }}>Registro do Dog</h2>

      <Form.Group className="mb-3">
        <Form.Label style={{ color: '#eebbc3' }}>Nome</Form.Label>
        <Form.Control
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label style={{ color: '#eebbc3' }}>Raça</Form.Label>
        <Form.Control
          type="text"
          value={raca}
          onChange={(e) => setRaca(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label style={{ color: '#eebbc3' }}>Descrição</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label style={{ color: '#eebbc3' }}>Foto (opcional)</Form.Label>
        <Form.Control type="file" accept="image/*" onChange={handleFotoChange} />
      </Form.Group>

      <Button
        className="rounded-pill w-100"
        style={{ backgroundColor: '#eebbc3', color: '#232946', border: 'none' }}
        onClick={handleRegistro}
      >
        Registrar
      </Button>
    </Card>
  )
}
