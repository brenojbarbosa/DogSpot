'use client'

import Link from 'next/link'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { useEffect, useState } from 'react'

export default function NavigationBar() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <Navbar expand="lg" style={{ backgroundColor: '#232946' }} variant="dark">
      <Container>
        <Link
          className="navbar-brand d-flex flex-column align-items-start"
          href="/"
          style={{
            fontFamily: "'Roboto', sans-serif",
            color: "#eebbc3",
            textDecoration: "none"
          }}
        >
          <div className="d-flex align-items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="#eebbc3"
              className="me-2"
              viewBox="0 0 16 16"
            >
              <path d="M11.273 1.114a1.5 1.5 0 1 1 2.454 1.772 1.5 1.5 0 0 1-2.454-1.772ZM6.5 3a1.5 1.5 0 1 1 0 3A1.5 1.5 0 0 1 6.5 3Zm-4 1a1.5 1.5 0 1 1 0 3A1.5 1.5 0 0 1 2.5 4Zm10.485 4.379a2.5 2.5 0 0 1-1.07 3.376c-.69.355-1.526.599-2.409.702l-.03.003a17.1 17.1 0 0 1-2.752 0l-.03-.003c-.883-.103-1.719-.347-2.408-.702a2.5 2.5 0 0 1-1.07-3.376c.34-.662.858-1.311 1.489-1.884a6.1 6.1 0 0 1 1.222-.847 3 3 0 0 1 2.346 0c.436.207.86.496 1.222.847.63.573 1.148 1.222 1.489 1.884Zm-3.167-6.918a1.5 1.5 0 1 1-2.454 1.772 1.5 1.5 0 0 1 2.454-1.772Z" />
            </svg>
            <span style={{ fontSize: '2rem' }}>DogSpot</span>
          </div>
          <span style={{ fontSize: '0.9rem', color: '#b8c1ec', marginLeft: '32px' }}>
            O lar do seu doguinho
          </span>
        </Link>

        <Navbar.Toggle aria-controls="dog-navbar-nav" />
        <Navbar.Collapse id="dog-navbar-nav">
          <Nav className="ms-auto">
            <Link
              className="nav-link"
              href="/"
              style={{ fontFamily: "'Roboto', sans-serif", color: "#eebbc3" }}
            >
              Início
            </Link>
            <Link
              className="nav-link"
              href="/profile"
              style={{ fontFamily: "'Roboto', sans-serif", color: "#eebbc3" }}
            >
              Meu Perfil
            </Link>
            <Link
              className="nav-link"
              href="/register"
              style={{ fontFamily: "'Roboto', sans-serif", color: "#eebbc3" }}
            >
              Registro
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
