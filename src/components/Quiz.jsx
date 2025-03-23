import { useState, useEffect } from 'react';
// Usamos eslint-disable para evitar warnings con motion
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const Quiz = ({ preguntas }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Debug: imprimir quizData recibido
    console.log('Quiz recibió datos:', { 
      preguntas, 
      esArray: Array.isArray(preguntas), 
      longitud: preguntas?.length 
    });

    // Verificar si quizData es válido
    if (!preguntas || !Array.isArray(preguntas) || preguntas.length === 0) {
      console.error('Error: preguntas no es un array válido o está vacío', preguntas);
      setError(true);
      return;
    }
    setError(false);
    
    setSelectedOption(null);
    setIsChecked(false);
  }, [preguntas, currentQuestionIndex]);

  // Si no hay datos válidos, mostrar mensaje de error
  if (error) {
    return (
      <motion.div 
        className="quiz-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card">
          <h3>Error al cargar el quiz</h3>
          <p>Lo sentimos, ha ocurrido un error al cargar las preguntas. Por favor, inténtalo de nuevo más tarde.</p>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = preguntas[currentQuestionIndex];

  // Mejorar la explicación con detalles adicionales
  const getEnhancedExplanation = () => {
    if (!currentQuestion.explicacion) return '';
    
    // La explicación base
    let explanation = currentQuestion.explicacion;
    
    // Añadir ejemplos de código si la pregunta trata sobre sintaxis o código
    if (currentQuestion.pregunta.toLowerCase().includes('sintaxis') || 
        currentQuestion.pregunta.toLowerCase().includes('código') || 
        currentQuestion.pregunta.toLowerCase().includes('operador')) {
      if (currentQuestion.codeExample) {
        explanation += `\n\n${currentQuestion.codeExample}`;
      } else {
        // Ejemplos por defecto basados en palabras clave
        if (currentQuestion.pregunta.toLowerCase().includes('puntero a función')) {
          explanation += '\n\nEjemplo:\n```cpp\ndouble (*ptrFuncion)(int, int); // Puntero a una función que recibe dos ints y devuelve un double\n```';
        } else if (currentQuestion.pregunta.toLowerCase().includes('operador')) {
          explanation += '\n\nEjemplo de uso:\n```cpp\nint num = 10;\nint* ptr = &num; // & obtiene la dirección\nint valor = *ptr; // * accede al valor\n```';
        }
      }
    }
    
    // Añadir comparación con Java si la pregunta menciona Java o comparación
    if (currentQuestion.pregunta.toLowerCase().includes('java') || 
        currentQuestion.pregunta.toLowerCase().includes('diferencia')) {
      explanation += '\n\nComparación con Java: En Java, la gestión de memoria es automática a través del recolector de basura, y no hay acceso directo a las direcciones de memoria como en C++.';
    }
    
    // Añadir consejos de buenas prácticas
    explanation += '\n\nConsejo: ' + (currentQuestion.tip || 'Siempre inicializa tus punteros y libera la memoria cuando ya no la necesites para evitar fugas de memoria.');
    
    return explanation;
  };

  const handleOptionSelect = (index) => {
    if (!isChecked) {
      setSelectedOption(index);
    }
  };

  const checkAnswer = () => {
    setIsChecked(true);
    if (selectedOption === currentQuestion.respuestaCorrecta) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < preguntas.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const progressPercentage = ((currentQuestionIndex + 1) / preguntas.length) * 100;

  return (
    <motion.div 
      className="quiz-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {!completed ? (
        <>
          <div className="quiz-header">
            <div className="quiz-icon">Q</div>
            <h3>Pregunta {currentQuestionIndex + 1} de {preguntas.length}</h3>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="quiz-question">
                {currentQuestion.pregunta}
              </div>
              
              <div className="quiz-options">
                {currentQuestion.opciones.map((option, index) => (
                  <motion.div
                    key={index}
                    className={`quiz-option ${
                      // Añadir la clase selected para la opción seleccionada
                      selectedOption === index && !isChecked ? 'selected' : ''
                    } ${
                      isChecked
                        ? index === currentQuestion.respuestaCorrecta
                          ? 'correct'
                          : selectedOption === index && selectedOption !== currentQuestion.respuestaCorrecta
                          ? 'incorrect'
                          : ''
                        : ''
                    }`}
                    onClick={() => handleOptionSelect(index)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={!isChecked ? { x: 5, backgroundColor: '#e8f4fc' } : {}}
                  >
                    {option}
                  </motion.div>
                ))}
              </div>
              
              {isChecked && (
                <motion.div
                  className="quiz-explanation visible"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <strong>
                    {selectedOption === currentQuestion.respuestaCorrecta
                      ? '¡Correcto! '
                      : '¡Incorrecto! '}
                  </strong>
                  {/* Usar la explicación mejorada en lugar de la explicación original */}
                  <div>
                    {getEnhancedExplanation().split('\n\n').map((paragraph, i) => {
                      // Detectar bloques de código
                      if (paragraph.startsWith('```') && paragraph.endsWith('```')) {
                        const code = paragraph.slice(6, -3); // Quitar ```cpp y ```
                        return (
                          <pre key={i} className="code-example">
                            <code>{code}</code>
                          </pre>
                        );
                      }
                      // Detectar consejos
                      else if (paragraph.startsWith('Consejo:')) {
                        return (
                          <div key={i} className="consejo">
                            {paragraph}
                          </div>
                        );
                      }
                      // Detectar comparaciones
                      else if (paragraph.startsWith('Comparación con Java:')) {
                        return (
                          <div key={i} className="comparacion">
                            <div className="java">
                              <h4>Java</h4>
                              <div style={{ padding: '1rem' }}>
                                {paragraph.replace('Comparación con Java: ', '')}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      // Texto normal
                      else {
                        return <p key={i}>{paragraph}</p>;
                      }
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
          
          <div className="quiz-buttons">
            <button
              className="quiz-button check"
              onClick={checkAnswer}
              disabled={selectedOption === null || isChecked}
            >
              Comprobar
            </button>
            <button
              className="quiz-button next"
              onClick={nextQuestion}
              disabled={!isChecked}
            >
              {currentQuestionIndex < preguntas.length - 1 ? 'Siguiente' : 'Finalizar'}
            </button>
          </div>
          
          <div className="quiz-progress">
            <span>{currentQuestionIndex + 1}</span>
            <div className="quiz-progress-bar">
              <motion.div
                className="quiz-progress-fill"
                initial={{ width: `${((currentQuestionIndex) / preguntas.length) * 100}%` }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
            <span>{preguntas.length}</span>
          </div>
        </>
      ) : (
        <motion.div
          className="quiz-completed"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3>¡Quiz completado!</h3>
          <p>Has acertado {score} de {preguntas.length} preguntas.</p>
          <p>Puntuación: {Math.round((score / preguntas.length) * 100)}%</p>
          
          {score === preguntas.length ? (
            <div className="importante">
              ¡Excelente! Has dominado este tema por completo.
            </div>
          ) : score >= preguntas.length * 0.7 ? (
            <div className="aviso">
              ¡Buen trabajo! Has comprendido la mayor parte del tema, pero puedes repasar algunos conceptos.
            </div>
          ) : (
            <div className="advertencia">
              Te recomendamos repasar este tema para comprender mejor los conceptos.
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Quiz; 