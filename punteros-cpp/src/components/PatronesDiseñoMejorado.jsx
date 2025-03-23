import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { patternCategories, designPatterns } from '../data/DesignPatterns';
import PatronesNavbar from './PatronesNavbar';
import './PatronesDiseño.css';

const PatronesDiseñoMejorado = () => {
  const [selectedCategory, setSelectedCategory] = useState('creational');
  const [selectedPattern, setSelectedPattern] = useState('singleton');
  const [comparisonMode, setComparisonMode] = useState('cppModern'); // 'cppModern' o 'java' para comparar con C++ tradicional
  
  // Convertir objeto de patrones a un array para usar en el navbar
  const patternsArray = Object.entries(designPatterns).map(([id, pattern]) => ({
    id,
    name: pattern.name,
    category: pattern.category
  }));
  
  // Obtener el patrón seleccionado
  const pattern = designPatterns[selectedPattern];
  
  // Asegurarse de que siempre hay un patrón seleccionado
  useEffect(() => {
    if (!pattern) {
      const firstPattern = patternsArray.find(p => p.category === selectedCategory);
      if (firstPattern) {
        setSelectedPattern(firstPattern.id);
      }
    }
  }, [selectedCategory, pattern, patternsArray, setSelectedPattern]);
  
  // Función para renderizar el código con explicaciones línea a línea
  const renderCodeWithExplanations = (implementation) => {
    if (!implementation) return null;
    
    const { code, explanation } = implementation;
    const codeLines = code.split('\n');
    
    return (
      <div className="code-with-explanations">
        <div className="code-container">
          <pre>
            <code>
              {codeLines.map((line, index) => {
                const lineExplanation = explanation?.find(exp => exp.line === index + 1);
                const lineKey = `${selectedPattern}-${implementation}-line-${index}`;
                
                return (
                  <div 
                    key={lineKey}
                    className={`code-line ${lineExplanation ? 'has-explanation' : ''}`}
                    data-line-number={index + 1}
                    title={lineExplanation ? lineExplanation.text : ''}
                  >
                    <span className="line-number">{index + 1}</span>
                    <span className="line-content">{line}</span>
                    {lineExplanation && (
                      <span className="line-explanation">{lineExplanation.text}</span>
                    )}
                  </div>
                );
              })}
            </code>
          </pre>
        </div>
      </div>
    );
  };
  
  // Función para renderizar la sección de comparaciones entre implementaciones
  const renderComparisons = () => {
    if (!pattern?.comparisons) return null;
    
    return (
      <div className="pattern-comparisons">
        <h4>Comparaciones entre implementaciones</h4>
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Aspecto</th>
                <th>C++ Tradicional</th>
                <th>{comparisonMode === 'cppModern' ? 'C++ Moderno' : 'Java'}</th>
              </tr>
            </thead>
            <tbody>
              {pattern.comparisons?.map((comparison, index) => (
                <tr key={`comparison-${comparison.title}-${index}`}>
                  <td className="comparison-title">{comparison.title}</td>
                  <td>{comparison.cppTraditional}</td>
                  <td>{comparison[comparisonMode]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  // Función para renderizar la teoría del patrón
  const renderTheory = () => {
    if (!pattern?.theory) return null;
    
    const { background, problem, solution, applicability, consequences } = pattern.theory;
    
    return (
      <div className="pattern-theory">
        <h4>Teoría del Patrón</h4>
        
        {background && (
          <div className="theory-section">
            <h5>Contexto</h5>
            <p>{background}</p>
          </div>
        )}
        
        {problem && (
          <div className="theory-section">
            <h5>Problema</h5>
            <p>{problem}</p>
          </div>
        )}
        
        {solution && (
          <div className="theory-section">
            <h5>Solución</h5>
            <p>{solution}</p>
          </div>
        )}
        
        {applicability?.length > 0 && (
          <div className="theory-section">
            <h5>Aplicabilidad</h5>
            <ul>
              {applicability.map((item, index) => (
                <li key={`applicability-${item.substring(0, 10)}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        
        {consequences?.length > 0 && (
          <div className="theory-section">
            <h5>Consecuencias</h5>
            <ul>
              {consequences.map((item, index) => (
                <li key={`consequence-${item.substring(0, 10)}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  // Función para obtener el nombre de la categoría
  const getCategoryName = (categoryId) => {
    const category = patternCategories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  return (
    <div
      className="patrones-diseño-container"
    >
      {/* Barra de navegación */}
      <PatronesNavbar 
        categories={patternCategories}
        patterns={patternsArray}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPattern={selectedPattern}
        setSelectedPattern={setSelectedPattern}
      />
      
      {/* Contenido principal */}
      <div className="pattern-content-wrapper">
        <AnimatePresence mode="wait">
          {pattern && (
            <div 
              key={selectedPattern}
              className="pattern-main-content"
            >
              <div className="pattern-header">
                <h3>{pattern.name}</h3>
                <span className="category-badge">{getCategoryName(pattern.category)}</span>
                <p>{pattern.description}</p>
              </div>
              
              {/* Botones de comparación */}
              <div className="comparison-buttons">
                <button
                  className={comparisonMode === 'cppModern' ? 'active' : ''}
                  onClick={() => setComparisonMode('cppModern')}
                >
                  Comparar con C++ Moderno
                </button>
                <button
                  className={comparisonMode === 'java' ? 'active' : ''}
                  onClick={() => setComparisonMode('java')}
                >
                  Comparar con Java
                </button>
              </div>
              
              {/* Implementaciones de código con explicaciones */}
              {pattern.implementations && (
                <div className="implementation-comparison-container">
                  <div className="implementation-container">
                    <h4>C++ Tradicional</h4>
                    {pattern.implementations.cppTraditional && renderCodeWithExplanations(pattern.implementations.cppTraditional)}
                    {!pattern.implementations.cppTraditional && <p>No hay implementación disponible para C++ tradicional.</p>}
                  </div>
                  
                  <div className="implementation-container">
                    <h4>{comparisonMode === 'cppModern' ? 'C++ Moderno' : 'Java'}</h4>
                    {pattern.implementations[comparisonMode] ? 
                      renderCodeWithExplanations(pattern.implementations[comparisonMode]) : 
                      <p>No hay implementación disponible para {comparisonMode === 'cppModern' ? 'C++ Moderno' : 'Java'}.</p>
                    }
                  </div>
                </div>
              )}
              
              {!pattern.implementations && (
                <div className="no-implementations-message">
                  <p>Este patrón no incluye implementaciones de código específicas, ya que representa un concepto arquitectónico 
                  de alto nivel que se aplica a la estructura general del sistema más que a un fragmento de código concreto.</p>
                </div>
              )}
              
              {/* Comparaciones entre implementaciones */}
              {pattern.comparisons && renderComparisons()}
              
              {/* Teoría del patrón */}
              {renderTheory()}
              
              {/* Notas adicionales */}
              {pattern.notes && (
                <div className="pattern-notes">
                  <h4>Notas adicionales</h4>
                  <p>{pattern.notes}</p>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PatronesDiseñoMejorado;
