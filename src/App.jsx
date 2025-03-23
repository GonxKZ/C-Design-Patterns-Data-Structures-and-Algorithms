import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import Introduccion from './components/Introduccion'
import DeclaracionPunteros from './components/DeclaracionPunteros'
import OperacionesPunteros from './components/OperacionesPunteros'
import PunterosArreglos from './components/PunterosArreglos'
import GestionMemoria from './components/GestionMemoria'
import PunterosFunciones from './components/PunterosFunciones'
import ConceptosAvanzados from './components/ConceptosAvanzados'
import PatronesDiseñoMejorado from './components/PatronesDiseñoMejorado'
import Quiz from './components/Quiz'
import Navbar from './components/Navbar'

import { quizIntroduccion, quizDeclaracion, quizOperaciones, quizArreglos, quizGestionMemoria, quizPunterosFunciones, quizConceptosAvanzados, quizPatronesDiseño } from './data/QuizData'

const quizzes = {
  'introduccion': quizIntroduccion,
  'declaracion': quizDeclaracion,
  'operaciones': quizOperaciones,
  'arreglos': quizArreglos,
  'gestion': quizGestionMemoria,
  'funciones': quizPunterosFunciones,
  'avanzados': quizConceptosAvanzados,
  'patrones': quizPatronesDiseño
};

// Definir las secciones disponibles
const secciones = [
  { id: 'introduccion', nombre: 'Introducción' },
  { id: 'declaracion', nombre: 'Declaración' },
  { id: 'operaciones', nombre: 'Operaciones' },
  { id: 'arreglos', nombre: 'Arreglos' },
  { id: 'gestion', nombre: 'Gestión Memoria' },
  { id: 'funciones', nombre: 'Funciones' },
  { id: 'avanzados', nombre: 'Avanzados' },
  { id: 'patrones', nombre: 'Patrones Diseño' }
];

function App() {
  const [seccionActual, setSeccionActual] = useState('introduccion')
  const [modoQuiz, setModoQuiz] = useState(false)
  const [quizActual, setQuizActual] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulamos un tiempo de carga para mostrar la animación
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const cambiarSeccion = (seccion) => {
    console.log("Cambiando a sección:", seccion);
    setSeccionActual(seccion);
    setModoQuiz(false);
  }

  const iniciarQuiz = (seccion) => {
    console.log("Iniciando quiz de sección:", seccion);
    if (quizzes[seccion]) {
      setQuizActual(quizzes[seccion]);
      setModoQuiz(true);
    } else {
      console.error(`No hay quiz disponible para la sección: ${seccion}`);
    }
  }

  const renderizarSeccion = () => {
    if (modoQuiz && quizActual) {
      return <Quiz preguntas={quizActual} volver={() => setModoQuiz(false)} />;
    }

    switch(seccionActual) {
      case 'introduccion': return <Introduccion />;
      case 'declaracion': return <DeclaracionPunteros />;
      case 'operaciones': return <OperacionesPunteros />;
      case 'arreglos': return <PunterosArreglos />;
      case 'gestion': return <GestionMemoria />;
      case 'funciones': return <PunterosFunciones />;
      case 'avanzados': return <ConceptosAvanzados />;
      case 'patrones': return <PatronesDiseñoMejorado />;
      default: return <Introduccion />;
    }
  }

  return (
    <div className="app-container">
      {loading ? (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loading-logo">C++</div>
          <p>Cargando contenido...</p>
        </motion.div>
      ) : (
        <>
          <header className="header">
            <h1>Guía Completa de Punteros en C++</h1>
            <Navbar 
              secciones={secciones}
              seccionActual={seccionActual} 
              cambiarSeccion={cambiarSeccion} 
              iniciarQuiz={iniciarQuiz}
              modoQuiz={modoQuiz}
            />
          </header>
          
          <main className="main-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={seccionActual + (modoQuiz ? "-quiz" : "")}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                {renderizarSeccion()}
              </motion.div>
            </AnimatePresence>
          </main>
          
          <footer className="footer">
            <p>© 2025 Guía de Punteros en C++ - Creado con <span className="heart">♥</span> para amantes del código</p>
          </footer>
        </>
      )}
    </div>
  )
}

export default App
