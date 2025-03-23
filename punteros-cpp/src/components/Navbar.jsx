import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import './Navbar.css';

const Navbar = ({ secciones, seccionActual, cambiarSeccion, modoQuiz, iniciarQuiz }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Efecto para detectar el scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Cierra el menú móvil cuando se selecciona una sección
  const handleSeccionClick = (seccionId) => {
    cambiarSeccion(seccionId);
    setMenuOpen(false);
  };

  // Cierra el menú móvil cuando se inicia el quiz
  const handleIniciarQuiz = (seccionId) => {
    iniciarQuiz(seccionId);
    setMenuOpen(false);
  };

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="navbar-container">
        <motion.div 
          className="navbar-logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSeccionClick('introduccion')}
        >
          <span className="logo-cpp">C++</span> Punteros
        </motion.div>

        {/* Botón hamburguesa para móvil */}
        <motion.div 
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`hamburger ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </motion.div>

        {/* Menú de navegación - versión escritorio */}
        <div className="navbar-links">
          {secciones.map((seccion) => (
            <motion.div
              key={seccion.id}
              className={`nav-item ${seccionActual === seccion.id ? 'active' : ''}`}
              onClick={() => handleSeccionClick(seccion.id)}
              whileHover={{ y: -3 }}
              whileTap={{ y: 0 }}
            >
              {seccion.nombre}
              {seccionActual === seccion.id && (
                <motion.div 
                  className="nav-underline"
                  layoutId="navbar-underline"
                />
              )}
            </motion.div>
          ))}
          <motion.div 
            className={`nav-item quiz-button ${modoQuiz ? 'active' : ''}`}
            onClick={() => handleIniciarQuiz(seccionActual)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="quiz-icon">✓</span> Quiz
          </motion.div>
        </div>
      </div>

      {/* Menú de navegación - versión móvil */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {secciones.map((seccion) => (
              <motion.div
                key={seccion.id}
                className={`mobile-nav-item ${seccionActual === seccion.id ? 'active' : ''}`}
                onClick={() => handleSeccionClick(seccion.id)}
                whileHover={{ x: 10 }}
                whileTap={{ x: 5 }}
              >
                {seccion.nombre}
              </motion.div>
            ))}
            <motion.div 
              className={`mobile-nav-item quiz-button ${modoQuiz ? 'active' : ''}`}
              onClick={() => handleIniciarQuiz(seccionActual)}
              whileHover={{ x: 10 }}
              whileTap={{ x: 5 }}
            >
              <span className="quiz-icon">✓</span> Iniciar Quiz
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

Navbar.propTypes = {
  secciones: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired
    })
  ).isRequired,
  seccionActual: PropTypes.string.isRequired,
  cambiarSeccion: PropTypes.func.isRequired,
  modoQuiz: PropTypes.bool.isRequired,
  iniciarQuiz: PropTypes.func.isRequired
};

export default Navbar;
