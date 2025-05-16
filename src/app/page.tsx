'use client'

import { useState, useEffect } from 'react'
import { Card, Row, Col, Spinner, Button, Modal, Form } from 'react-bootstrap'
import { FaTrash } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

interface Comentario {
  autor: string
  texto: string
}

interface Post {
  id: number
  url: string
  autor?: {
    nome: string
    email: string
    foto: string
  }
  curtidas?: number
  curtido?: boolean
  comentarios?: Comentario[]
  novoComentario?: string
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [carregando, setCarregando] = useState(true)
  const [novaImagem, setNovaImagem] = useState<File | null>(null)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const usuario = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('usuarioLogado') || 'null')
    : null

  useEffect(() => {
    const fetchAPI = async () => {
      const res = await fetch('https://dog.ceo/api/breeds/image/random/9')
      const dados = await res.json()

      const gerarNomeDog = () => {
        const nomes = ['Bolt', 'Luna', 'Toby', 'Mel', 'Rex', 'Princesa', 'Thor', 'Nina', 'Max', 'Amora']
        const sobrenomes = ['Latidor', 'Peloslongos', 'CaudaFeliz', 'Rabanada', 'Bigodes', 'Saltitante']
        const nome = nomes[Math.floor(Math.random() * nomes.length)]
        const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)]
        return `${nome} ${sobrenome}`
      }

      const postsAPI = dados.message.map((url: string, index: number) => ({
        id: 1000 + index,
        url,
        autor: {
          nome: gerarNomeDog(),
          email: 'api@dogspot.com',
          foto: ''
        },
        curtidas: 0,
        curtido: false,
        comentarios: []
      }))

      const postsLocal = JSON.parse(localStorage.getItem('postsDogSpot') || '[]')
      const todos = [...postsAPI, ...postsLocal]
      setPosts(todos)
      setCarregando(false)
    }

    if (typeof window !== 'undefined') fetchAPI()
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      setNovaImagem(file)
    }
  }

  const handleAddPost = () => {
  if (novaImagem && usuario) {
    const reader = new FileReader()

    reader.onloadend = () => {
      const base64String = reader.result as string

      const newPost: Post = {
        id: posts.length + 1,
        url: base64String, 
        autor: {
          nome: usuario.nome,
          email: usuario.email,
          foto: usuario.foto || ''
        },
        curtidas: 0,
        curtido: false,
        comentarios: []
      }

      const postsAtualizados = [newPost, ...posts]
      setPosts(postsAtualizados)

    
      localStorage.setItem(
        'postsDogSpot',
        JSON.stringify(postsAtualizados.filter(p => p.id < 1000))
      )

      setNovaImagem(null)
      setShowModal(false)
    }

   
    reader.readAsDataURL(novaImagem)
  }
}


  const toggleCurtir = (id: number) => {
    const novos = posts.map(post => {
      if (post.id === id) {
        const curtido = !post.curtido
        const curtidas = (post.curtidas || 0) + (curtido ? 1 : -1)
        return { ...post, curtido, curtidas }
      }
      return post
    })
    setPosts(novos)
  }

  const handleComentarioChange = (id: number, texto: string) => {
    const novosPosts = posts.map(post => {
      if (post.id === id) {
        return { ...post, novoComentario: texto }
      }
      return post
    })
    setPosts(novosPosts)
  }

  const handleAdicionarComentario = (id: number) => {
    const novosPosts = posts.map(post => {
      if (post.id === id && post.novoComentario) {
        const novoComentario = {
          autor: usuario ? usuario.nome : 'Usuário',
          texto: post.novoComentario
        }
        return {
          ...post,
          comentarios: [...(post.comentarios || []), novoComentario],
          novoComentario: ''
        }
      }
      return post
    })
    setPosts(novosPosts)
  }

  const handleExcluirPost = (id: number) => {
    const novosPosts = posts.filter(post => post.id !== id)
    setPosts(novosPosts)
    localStorage.setItem('postsDogSpot', JSON.stringify(novosPosts.filter(p => p.id < 1000)))
  }

  if (carregando) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <div className="container py-5 text-light min-vh-100" style={{ backgroundColor: '#1e1e2f' }}>
      <h2 className="mb-4 text-center d-flex justify-content-center align-items-center gap-2" style={{ color: '#eebbc3' }}>
        DogSpot - Feed
      </h2>

      <div className="d-flex justify-content-center gap-3 mb-4">
        <Button onClick={() => setShowModal(true)} className="px-4 py-2" style={{ backgroundColor: '#7f5af0', border: 'none' }}>
          Envie seu doguinho
        </Button>

        <Button onClick={() => router.push('/nextdogs')} className="px-4 py-2" variant="outline-light">
          Ver novos doguinhos 🐶
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="text-center">Nenhum doguinho postado ainda! 😢</p>
      ) : (
        <Row xs={1} sm={2} md={3} className="g-4">
          {posts.map((post, index) => (
            <Col key={`${post.id}-${index}`}>
              <Card className="shadow-sm rounded-4 h-100 bg-dark text-light">
                <div style={{ height: '250px', overflow: 'hidden' }}>
                  <Card.Img
                    variant="top"
                    src={post.url}
                    alt="Dog"
                    className="rounded-top-4"
                    style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                  />
                </div>
                <Card.Body>
                  <Card.Title>{post.autor?.nome}</Card.Title>

                  <button
                    className={`btn btn-sm ${post.curtido ? 'btn-danger' : 'btn-outline-danger'} me-2`}
                    onClick={() => toggleCurtir(post.id)}
                    style={{
                      backgroundColor: post.curtido ? '#7f5af0' : 'transparent',
                      border: `2px solid ${post.curtido ? '#7f5af0' : '#7f5af0'}`,
                      color: post.curtido ? 'white' : '#7f5af0',
                      fontWeight: 'bold'
                    }}
                  >
                    ❤️ Curtir ({post.curtidas || 0})
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger ms-2"
                    onClick={() => handleExcluirPost(post.id)}
                  >
                    <FaTrash />
                  </button>

                  <div className="mt-3">
                    {post.comentarios?.length ? (
                      <div className="mt-3">
                        <h6 className="text-muted">Comentários</h6>
                        <ul className="list-unstyled">
                          {post.comentarios.map((comentario, index) => (
                            <li key={index}>
                              <strong>{comentario.autor}</strong>: {comentario.texto}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <div style={{ height: '90px' }}>
                      <Form.Control
                        as="textarea"
                        value={post.novoComentario || ''}
                        onChange={(e) => handleComentarioChange(post.id, e.target.value)}
                        placeholder="Escreva um comentário..."
                        style={{ resize: 'none', height: '70px' }}
                      />
                      <Button
                        className="mt-2"
                        style={{ backgroundColor: '#7f5af0', border: 'none' }}
                        onClick={() => handleAdicionarComentario(post.id)}
                      >
                        Comentar
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Fazer Upload de Imagem</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Imagem</Form.Label>
              <Form.Control type="file" onChange={handleImageUpload} />
            </Form.Group>
            <Button
              style={{
                backgroundColor: '#7f5af0',
                border: 'none',
                position: 'relative',
                zIndex: 10
              }}
              onClick={handleAddPost}
              disabled={!novaImagem}
            >
              Adicionar Post
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}
