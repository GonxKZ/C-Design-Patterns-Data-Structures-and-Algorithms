import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './PatronesNavbar.css';

const PatronesNavbar = ({ categories, patterns, selectedCategory, setSelectedCategory, selectedPattern, setSelectedPattern }) => {
  const [showPatterns, setShowPatterns] = useState(false);
  const selectRef = useRef(null);

  // Filtrar patrones por categoría
  const patternsInCategory = patterns.filter(pattern => pattern.category === selectedCategory);

  // Efecto para manejar la selección en el select
  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.value = selectedPattern;
    }
  }, [selectedPattern]);

  // Manejador para teclas en categorías
  const handleCategoryKeyDown = (e, categoryId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedCategory(categoryId);
      setShowPatterns(true);
      
      // Seleccionar el primer patrón de esta categoría si no hay ninguno seleccionado
      const firstPattern = patterns.find(p => p.category === categoryId);
      if (firstPattern && (!selectedPattern || patterns.find(p => p.id === selectedPattern)?.category !== categoryId)) {
        setSelectedPattern(firstPattern.id);
      }
    }
  };

  // Manejador para cambio de select
  const handleSelectChange = (e) => {
    setSelectedPattern(e.target.value);
  };

  return (
    <div className="patrones-navbar">
      <div className="navbar-container">
        <div className="navbar-title">
          <h2>Patrones de Diseño</h2>
        </div>
        
        <div className="navbar-categories" role="tablist">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(category.id);
                setShowPatterns(true);
                
                // Seleccionar el primer patrón de esta categoría si no hay ninguno seleccionado
                const firstPattern = patterns.find(p => p.category === category.id);
                if (firstPattern && (!selectedPattern || patterns.find(p => p.id === selectedPattern)?.category !== category.id)) {
                  setSelectedPattern(firstPattern.id);
                }
              }}
              onKeyDown={(e) => handleCategoryKeyDown(e, category.id)}
              role="tab"
              aria-selected={selectedCategory === category.id}
              tabIndex={0}
            >
              {category.name}
              {selectedCategory === category.id && (
                <div 
                  className="category-underline"
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </div>
        
        <div className="navbar-patterns-dropdown">
          <select
            className="patterns-select"
            onChange={handleSelectChange}
            value={selectedPattern}
            aria-label="Seleccionar patrón de diseño"
            ref={selectRef}
          >
            {patternsInCategory.map(pattern => (
              <option
                key={pattern.id}
                value={pattern.id}
              >
                {pattern.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {showPatterns && (
        <div 
          className="patterns-list"
          role="tablist"
          aria-label="Patrones disponibles"
        >
          {patternsInCategory.map(pattern => (
            <button
              key={pattern.id}
              className={`pattern-list-item ${selectedPattern === pattern.id ? 'active' : ''}`}
              onClick={() => setSelectedPattern(pattern.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedPattern(pattern.id);
                }
              }}
              role="tab"
              aria-selected={selectedPattern === pattern.id}
              tabIndex={0}
            >
              {pattern.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

PatronesNavbar.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  patterns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired
  })).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  setSelectedCategory: PropTypes.func.isRequired,
  selectedPattern: PropTypes.string.isRequired,
  setSelectedPattern: PropTypes.func.isRequired
};

export default PatronesNavbar;
