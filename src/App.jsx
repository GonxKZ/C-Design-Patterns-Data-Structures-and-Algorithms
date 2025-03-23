import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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

  useEffect(() => {
    console.log("Secciones disponibles:", Object.keys(quizzes));
    console.log("Sección actual:", seccionActual);
    console.log("Modo quiz:", modoQuiz);
    console.log("Quiz actual:", quizActual);
  }, [seccionActual, modoQuiz, quizActual]);

  const cambiarSeccion = (seccion) => {
    console.log("Cambiando a sección:", seccion);
    setSeccionActual(seccion)
    setModoQuiz(false)
  }

  const iniciarQuiz = (seccion) => {
    console.log("Iniciando quiz para sección:", seccion);
    setQuizActual(seccion);
    setModoQuiz(true);
  }

  const secciones = [
    { id: 'introduccion', nombre: 'Introducción a los Punteros' },
    { id: 'declaracion', nombre: 'Declaración y Uso Básico' },
    { id: 'operaciones', nombre: 'Operaciones con Punteros' },
    { id: 'arreglos', nombre: 'Punteros y Arreglos' },
    { id: 'gestion', nombre: 'Gestión de Memoria' },
    { id: 'funciones', nombre: 'Punteros a Funciones' },
    { id: 'avanzados', nombre: 'Conceptos Avanzados' },
    { id: 'patrones', nombre: 'Patrones de Diseño' }
  ]

  const renderizarSeccion = () => {
    if (modoQuiz) {
      console.log("Renderizando quiz para:", quizActual);
      console.log("Quiz data disponible:", quizzes[quizActual] ? "Sí" : "No");
      
      if (!quizActual || !quizzes[quizActual]) {
        return <div>No hay preguntas disponibles para esta sección</div>;
      }
      
      return <Quiz preguntas={quizzes[quizActual]} />;
    }

    switch (seccionActual) {
      case 'introduccion':
        return <Introduccion />
      case 'declaracion':
        return <DeclaracionPunteros />
      case 'operaciones':
        return <OperacionesPunteros />
      case 'arreglos':
        return <PunterosArreglos />
      case 'gestion':
        return <GestionMemoria />
      case 'funciones':
        return <PunterosFunciones />
      case 'avanzados':
        return <ConceptosAvanzados />
      case 'patrones':
        return <PatronesDiseñoMejorado />
      default:
        return <Introduccion />
    }
  }

  // Generar el contenido a mostrar con AnimatePresence para transiciones
  const contenidoActual = renderizarSeccion();
  const contenidoKey = `${seccionActual}-${modoQuiz}`;

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div 
          className="loading-logo"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          C++
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Cargando...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div 
      className="app-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Navbar
        secciones={secciones}
        seccionActual={seccionActual}
        cambiarSeccion={cambiarSeccion}
        modoQuiz={modoQuiz}
        iniciarQuiz={iniciarQuiz}
      />

      <header 
        className="header"
      >
        <motion.h1 variants={itemVariants}>Punteros en C++ para Programadores desde Java</motion.h1>
        <motion.p variants={itemVariants}>Una guía interactiva para entender los punteros en C++, patrones de dsiseño y estructuras de datos</motion.p>
      </header>

      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={contenidoKey}
            className="seccion"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            {contenidoActual}
          </motion.div>
        </AnimatePresence>
      </main>

      <motion.footer 
        className="footer"
        variants={itemVariants}
      >
        <p> 2025 Punteros en C++ para Programadores Java</p>
      </motion.footer>
    </motion.div>
  )
}

export default App
